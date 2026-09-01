"use strict";

(() => {
  const canvas = game;
  const ctx = canvas.getContext("2d");
  const SIZE = 72;
  const ORIGIN = 42;
  const GLYPH = {
    K: "\u2654", Q: "\u2655", R: "\u2656", B: "\u2657", N: "\u2658", P: "\u2659",
    k: "\u265A", q: "\u265B", r: "\u265C", b: "\u265D", n: "\u265E", p: "\u265F"
  };
  const VALUE = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
  const PST = [
    0, 0, 0, 0, 0, 0, 0, 0,
    5, 10, 10, -20, -20, 10, 10, 5,
    5, -5, -10, 0, 0, -10, -5, 5,
    0, 0, 0, 20, 20, 0, 0, 0,
    5, 5, 10, 25, 25, 10, 5, 5,
    10, 10, 20, 30, 30, 20, 10, 10,
    50, 50, 50, 50, 50, 50, 50, 50,
    0, 0, 0, 0, 0, 0, 0, 0
  ];

  let state;
  let cursor = 56;
  let selected = -1;
  let busy = false;
  let result = "";
  let score = 0;
  let lastMove = null;
  let promotionPrompt = null;
  let searchDeadline = 0;
  let searchNodes = 0;
  let searchedDepth = 0;
  const table = new Map();

  const xy = (i) => [i % 8, i >> 3];
  const at = (x, y) => y * 8 + x;
  const whitePiece = (p) => !!p && p === p.toUpperCase();
  const owns = (p, white) => !!p && whitePiece(p) === white;
  const enemy = (white) => !white;

  function freshState() {
    return {
      board: "rnbqkbnrpppppppp................................PPPPPPPPRNBQKBNR".split("").map((p) => p === "." ? "" : p),
      white: true,
      castle: { K: true, Q: true, k: true, q: true },
      ep: -1,
      halfmove: 0,
      fullmove: 1,
      history: []
    };
  }

  function reset() {
    state = freshState();
    cursor = 56;
    selected = -1;
    busy = false;
    result = "";
    score = 0;
    lastMove = null;
    promotionPrompt = null;
    rememberPosition();
    StarcadeHost.score(0);
    draw();
  }

  function clone(s) {
    return {
      board: s.board.slice(), white: s.white, castle: { ...s.castle }, ep: s.ep,
      halfmove: s.halfmove, fullmove: s.fullmove, history: s.history.slice()
    };
  }

  function positionKey(s) {
    return `${s.board.map((p) => p || ".").join("")}|${s.white ? "w" : "b"}|${Object.entries(s.castle).filter(([,v]) => v).map(([k]) => k).join("")}|${s.ep}`;
  }

  function rememberPosition() { state.history.push(positionKey(state)); }

  function attacked(s, square, byWhite) {
    const [tx, ty] = xy(square);
    const pawnY = ty + (byWhite ? 1 : -1);
    for (const dx of [-1, 1]) {
      const x = tx + dx;
      if (x >= 0 && x < 8 && pawnY >= 0 && pawnY < 8 && s.board[at(x, pawnY)] === (byWhite ? "P" : "p")) return true;
    }
    for (const [dx, dy] of [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]]) {
      const x = tx + dx, y = ty + dy;
      if (x >= 0 && x < 8 && y >= 0 && y < 8 && s.board[at(x,y)] === (byWhite ? "N" : "n")) return true;
    }
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      if (!dx && !dy) continue;
      const x = tx + dx, y = ty + dy;
      if (x >= 0 && x < 8 && y >= 0 && y < 8 && s.board[at(x,y)] === (byWhite ? "K" : "k")) return true;
    }
    const rays = [
      [1,0,"rq"],[-1,0,"rq"],[0,1,"rq"],[0,-1,"rq"],
      [1,1,"bq"],[-1,1,"bq"],[1,-1,"bq"],[-1,-1,"bq"]
    ];
    for (const [dx, dy, types] of rays) {
      let x = tx + dx, y = ty + dy;
      while (x >= 0 && x < 8 && y >= 0 && y < 8) {
        const p = s.board[at(x,y)];
        if (p) {
          if (owns(p, byWhite) && types.includes(p.toLowerCase())) return true;
          break;
        }
        x += dx; y += dy;
      }
    }
    return false;
  }

  function inCheck(s, white) {
    const king = s.board.indexOf(white ? "K" : "k");
    return king < 0 || attacked(s, king, enemy(white));
  }

  function pseudoMoves(s, white, includeCastle = true) {
    const out = [];
    const add = (from, x, y, extra = {}) => {
      if (x < 0 || x > 7 || y < 0 || y > 7) return false;
      const to = at(x,y), target = s.board[to];
      if (!target) { out.push({ from, to, ...extra }); return true; }
      if (!owns(target, white) && target.toLowerCase() !== "k") out.push({ from, to, capture: target, ...extra });
      return false;
    };

    for (let from = 0; from < 64; from++) {
      const p = s.board[from];
      if (!owns(p, white)) continue;
      const [x,y] = xy(from), type = p.toLowerCase();
      if (type === "p") {
        const d = white ? -1 : 1;
        const one = at(x, y + d);
        if (y + d >= 0 && y + d < 8 && !s.board[one]) {
          if(y+d===(white?0:7)){for(const promotion of["q","r","b","n"])add(from,x,y+d,{promotion})}else add(from,x,y+d);
          const home = white ? 6 : 1;
          if (y === home && !s.board[at(x, y + d * 2)]) add(from, x, y + d * 2, { doublePawn: true });
        }
        for (const dx of [-1,1]) {
          const tx = x + dx, ty = y + d;
          if (tx < 0 || tx > 7 || ty < 0 || ty > 7) continue;
          const to = at(tx,ty), target = s.board[to];
          if(target&&!owns(target,white)&&target.toLowerCase()!=="k"){if(ty===(white?0:7)){for(const promotion of["q","r","b","n"])add(from,tx,ty,{promotion})}else add(from,tx,ty)}
          else if (to === s.ep) out.push({ from, to, epCapture: at(tx,y) });
        }
      } else if (type === "n") {
        for (const [dx,dy] of [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]]) add(from,x+dx,y+dy);
      } else if (type === "k") {
        for (let dx=-1; dx<=1; dx++) for (let dy=-1; dy<=1; dy++) if (dx || dy) add(from,x+dx,y+dy);
        if (includeCastle && !inCheck(s, white)) {
          const rank = white ? 7 : 0;
          const kingHome = at(4,rank);
          if (from === kingHome) {
            const kRight = white ? "K" : "k", qRight = white ? "Q" : "q";
            if (s.castle[kRight] && !s.board[at(5,rank)] && !s.board[at(6,rank)] && s.board[at(7,rank)] === (white ? "R" : "r") && !attacked(s,at(5,rank),!white) && !attacked(s,at(6,rank),!white)) out.push({from,to:at(6,rank),castle:"K"});
            if (s.castle[qRight] && !s.board[at(1,rank)] && !s.board[at(2,rank)] && !s.board[at(3,rank)] && s.board[at(0,rank)] === (white ? "R" : "r") && !attacked(s,at(3,rank),!white) && !attacked(s,at(2,rank),!white)) out.push({from,to:at(2,rank),castle:"Q"});
          }
        }
      } else {
        const dirs = type === "b" ? [[1,1],[-1,1],[1,-1],[-1,-1]] : type === "r" ? [[1,0],[-1,0],[0,1],[0,-1]] : [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
        for (const [dx,dy] of dirs) for (let n=1; n<8 && add(from,x+dx*n,y+dy*n); n++);
      }
    }
    return out;
  }

  function makeMove(s, m) {
    const next = clone(s);
    const piece = next.board[m.from];
    const captured = m.epCapture !== undefined ? next.board[m.epCapture] : next.board[m.to];
    next.board[m.to] = piece;
    next.board[m.from] = "";
    if (m.epCapture !== undefined) next.board[m.epCapture] = "";
    if (m.castle) {
      const rank = whitePiece(piece) ? 7 : 0;
      const rookFrom = m.castle === "K" ? at(7,rank) : at(0,rank);
      const rookTo = m.castle === "K" ? at(5,rank) : at(3,rank);
      next.board[rookTo] = next.board[rookFrom];
      next.board[rookFrom] = "";
    }
    if (m.promotion) next.board[m.to] = whitePiece(piece) ? m.promotion.toUpperCase() : m.promotion.toLowerCase();
    if (piece === "K") { next.castle.K = false; next.castle.Q = false; }
    if (piece === "k") { next.castle.k = false; next.castle.q = false; }
    if (m.from === 56 || m.to === 56) next.castle.Q = false;
    if (m.from === 63 || m.to === 63) next.castle.K = false;
    if (m.from === 0 || m.to === 0) next.castle.q = false;
    if (m.from === 7 || m.to === 7) next.castle.k = false;
    next.ep = m.doublePawn ? (m.from + m.to) >> 1 : -1;
    next.halfmove = piece.toLowerCase() === "p" || captured ? 0 : next.halfmove + 1;
    if (!next.white) next.fullmove++;
    next.white = !next.white;
    return next;
  }

  function legalMoves(s, white = s.white) {
    return pseudoMoves(s, white).filter((m) => !inCheck(makeMove({ ...s, white, board:s.board.slice(), castle:{...s.castle}, history:s.history.slice() }, m), white));
  }

  function insufficient(s) {
    const pieces = s.board.filter(Boolean).map((p) => p.toLowerCase()).filter((p) => p !== "k");
    if (!pieces.length) return true;
    if (pieces.length === 1 && (pieces[0] === "b" || pieces[0] === "n")) return true;
    if (pieces.every((p) => p === "b")) {
      const colors = s.board.map((p,i) => p && p.toLowerCase() === "b" ? ((i%8)+(i>>3))%2 : -1).filter((v) => v >= 0);
      return colors.every((v) => v === colors[0]);
    }
    return false;
  }

  function terminal(s) {
    const moves = legalMoves(s);
    if (!moves.length) return inCheck(s,s.white) ? (s.white ? "CPU CHECKMATE" : "PLAYER CHECKMATE") : "STALEMATE";
    if (s.halfmove >= 100) return "DRAW - FIFTY-MOVE RULE";
    if (insufficient(s)) return "DRAW - INSUFFICIENT MATERIAL";
    const key = positionKey(s);
    if (s.history.filter((k) => k === key).length >= 3) return "DRAW - THREEFOLD REPETITION";
    return "";
  }

  function evaluate(s) {
    let total = 0;
    const bishops={white:0,black:0},pawns={white:Array(8).fill(0),black:Array(8).fill(0)};
    for (let i=0;i<64;i++) {
      const p=s.board[i]; if(!p) continue;
      const white=whitePiece(p), type=p.toLowerCase();
      let value=VALUE[type] || 0;
      if(type==="p") value += PST[white ? i : 63-i];
      if(type==="p")pawns[white?"white":"black"][i%8]++;
      if(type==="b")bishops[white?"white":"black"]++;
      const [x,y]=xy(i); value += (3.5-Math.abs(x-3.5)) + (3.5-Math.abs(y-3.5));
      total += white ? value : -value;
    }
    for(const side of["white","black"]){const sign=side==="white"?1:-1;if(bishops[side]>=2)total+=sign*28;for(let f=0;f<8;f++){if(pawns[side][f]>1)total-=sign*14*(pawns[side][f]-1);if(pawns[side][f]&&!pawns[side][f-1]&&!pawns[side][f+1])total-=sign*10}}
    total += (legalMoves(s,true).length-legalMoves(s,false).length)*2;
    if(inCheck(s,true))total-=22;if(inCheck(s,false))total+=22;
    return total;
  }

  function search(s, depth, alpha, beta) {
    searchNodes++;
    if(performance.now()>=searchDeadline)return evaluate(s);
    const end=terminal(s);
    if(end) return end==="PLAYER CHECKMATE" ? 100000+depth : end==="CPU CHECKMATE" ? -100000-depth : 0;
    if(depth===0) return evaluate(s);
    const key=`${positionKey(s)}|${s.halfmove}|${depth}`;if(table.has(key))return table.get(key);
    const moves=legalMoves(s).sort((a,b)=>((VALUE[(s.board[b.to]||"").toLowerCase()]||0)+(b.promotion?800:0))-((VALUE[(s.board[a.to]||"").toLowerCase()]||0)+(a.promotion?800:0)));
    let best=s.white?-Infinity:Infinity;
    if(s.white){for(const m of moves){best=Math.max(best,search(makeMove(s,m),depth-1,alpha,beta));alpha=Math.max(alpha,best);if(beta<=alpha||performance.now()>=searchDeadline)break}}
    else for(const m of moves){best=Math.min(best,search(makeMove(s,m),depth-1,alpha,beta));beta=Math.min(beta,best);if(beta<=alpha||performance.now()>=searchDeadline)break}
    if(performance.now()<searchDeadline)table.set(key,best);return best;
  }

  function chooseCpuMove(){
    const moves=legalMoves(state);let chosen=moves[0];searchDeadline=performance.now()+1200;searchNodes=0;searchedDepth=0;table.clear();
    for(let depth=1;depth<=4&&performance.now()<searchDeadline;depth++){
      let iteration=chosen,bestValue=Infinity,complete=true;
      const ordered=moves.slice().sort((a,b)=>(VALUE[(state.board[b.to]||"").toLowerCase()]||0)-(VALUE[(state.board[a.to]||"").toLowerCase()]||0));
      for(const m of ordered){if(performance.now()>=searchDeadline){complete=false;break}const value=search(makeMove(state,m),depth,-Infinity,Infinity);if(value<bestValue){bestValue=value;iteration=m}}
      if(complete){chosen=iteration;searchedDepth=depth}
    }
    return chosen;
  }

  function completeMove(m) {
    const captured = m.epCapture !== undefined ? state.board[m.epCapture] : state.board[m.to];
    state = makeMove(state,m);
    lastMove = m;
    rememberPosition();
    if (captured) score += state.white ? -Math.floor((VALUE[captured.toLowerCase()]||0)/10) : Math.floor((VALUE[captured.toLowerCase()]||0)/5);
    score=Math.max(0,score); StarcadeHost.score(score);
    result=terminal(state);
    if(result){if(result==="PLAYER CHECKMATE"){score+=2500;StarcadeHost.score(score)}StarcadeHost.finish(score)}
  }

  function cpuMove() {
    busy=true; draw();
    setTimeout(()=>{
      const best=chooseCpuMove();
      if(best) completeMove(best);
      busy=false; draw();
    },120);
  }

  function act() {
    if(result){reset();return}
    if(busy||!state.white)return;
    if(promotionPrompt){const move={...promotionPrompt.moves[promotionPrompt.index]};promotionPrompt=null;selected=-1;completeMove(move);if(!result)cpuMove();draw();return}
    if(selected<0){if(owns(state.board[cursor],true))selected=cursor}
    else {
      const matches=legalMoves(state,true).filter((m)=>m.from===selected&&m.to===cursor);
      const move=matches[0];
      if(move){if(matches.length>1){promotionPrompt={moves:matches,index:0};draw();return}selected=-1;completeMove(move);if(!result)cpuMove()}
      else selected=owns(state.board[cursor],true)?cursor:-1;
    }
    draw();
  }

  function statusText() {
    if(result)return result;
    if(promotionPrompt)return`PROMOTE TO ${promotionPrompt.moves[promotionPrompt.index].promotion.toUpperCase()} - LEFT/RIGHT, A CONFIRM`;
    if(busy)return "STARCADE CPU CALCULATING...";
    const check=inCheck(state,state.white)?" - CHECK":"";
    return `${state.white?"WHITE TO MOVE":"BLACK TO MOVE"}${check} - MOVE ${state.fullmove}${searchedDepth?` - CPU D${searchedDepth}`:""}`;
  }

  function draw() {
    ctx.fillStyle="#050908";ctx.fillRect(0,0,660,660);
    const legal=selected>=0?legalMoves(state,true).filter((m)=>m.from===selected).map((m)=>m.to):[];
    for(let i=0;i<64;i++){
      const[x,y]=xy(i),px=ORIGIN+x*SIZE,py=ORIGIN+y*SIZE;
      ctx.fillStyle=(x+y)%2?"#18342d":"#8a7650";ctx.fillRect(px,py,SIZE,SIZE);
      if(lastMove&&(i===lastMove.from||i===lastMove.to)){ctx.fillStyle="rgba(242,200,121,.24)";ctx.fillRect(px,py,SIZE,SIZE)}
      if(legal.includes(i)){ctx.fillStyle=state.board[i]?"rgba(255,110,90,.42)":"rgba(141,247,199,.42)";ctx.beginPath();ctx.arc(px+36,py+36,state.board[i]?29:10,0,Math.PI*2);ctx.fill()}
      if(i===selected){ctx.strokeStyle="#f2c879";ctx.lineWidth=5;ctx.strokeRect(px+3,py+3,SIZE-6,SIZE-6)}
      if(i===cursor){ctx.strokeStyle="#fff";ctx.lineWidth=3;ctx.strokeRect(px+1,py+1,SIZE-2,SIZE-2)}
      const p=state.board[i];if(p){ctx.textAlign="center";ctx.textBaseline="middle";ctx.font='52px "Segoe UI Symbol"';ctx.fillStyle=whitePiece(p)?"#8df7c7":"#ff9f82";ctx.fillText(GLYPH[p],px+36,py+38)}
    }
    ctx.fillStyle="#08120f";ctx.fillRect(0,0,660,32);ctx.textAlign="center";ctx.textBaseline="middle";ctx.font="bold 15px Arial";ctx.fillStyle=inCheck(state,state.white)?"#ff8d72":"#c8d8d2";ctx.fillText(statusText(),330,16);
    if(result){ctx.fillStyle="rgba(3,7,6,.9)";ctx.fillRect(0,270,660,120);ctx.fillStyle=result.startsWith("PLAYER")?"#8df7c7":result.startsWith("CPU")?"#ff8d72":"#f2c879";ctx.font="bold 27px Arial";ctx.fillText(result,330,313);ctx.fillStyle="#d7e2de";ctx.font="14px Arial";ctx.fillText("PRESS A / ENTER TO START A NEW MATCH",330,351)}
    if(promotionPrompt){ctx.fillStyle="rgba(3,7,6,.94)";ctx.fillRect(110,265,440,130);ctx.fillStyle="#f2c879";ctx.font="bold 20px Arial";ctx.fillText("SELECT PROMOTION",330,295);const options=promotionPrompt.moves;for(let i=0;i<options.length;i++){ctx.fillStyle=i===promotionPrompt.index?"#8df7c7":"#829792";ctx.font='42px "Segoe UI Symbol"';ctx.fillText(GLYPH[options[i].promotion.toUpperCase()],240+i*60,345)}ctx.fillStyle="#d7e2de";ctx.font="13px Arial";ctx.fillText("LEFT / RIGHT TO CHOOSE - A TO CONFIRM",330,378)}
  }

  addEventListener("keydown",(event)=>{
    const key=StarcadeInput.key(event),[x,y]=xy(cursor);
    if(promotionPrompt&&key==="ArrowLeft")promotionPrompt.index=(promotionPrompt.index+promotionPrompt.moves.length-1)%promotionPrompt.moves.length;
    else if(promotionPrompt&&key==="ArrowRight")promotionPrompt.index=(promotionPrompt.index+1)%promotionPrompt.moves.length;
    else if(key==="ArrowLeft")cursor=at((x+7)%8,y);
    else if(key==="ArrowRight")cursor=at((x+1)%8,y);
    if(key==="ArrowUp")cursor=at(x,(y+7)%8);
    if(key==="ArrowDown")cursor=at(x,(y+1)%8);
    if(key==="Action")act();
    if(StarcadeInput.isControl(key)){event.preventDefault();draw()}
  });

  reset();
  StarcadeHost.ready({title:"Galactic Chess vs CPU"});
})();
