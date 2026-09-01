"use strict";

(() => {
  const canvas = game, ctx = canvas.getContext("2d"), CELL = 70, ORIGIN = 50;
  const PLAYER = 1, CPU = 2, PLAYER_KING = 3, CPU_KING = 4;
  let state, cursor = 40, selected = -1, forcedFrom = -1, busy = false, result = "", score = 0, lastMove = null;

  const rc = (i) => [i % 8, i >> 3];
  const index = (x,y) => y * 8 + x;
  const inside = (x,y) => x >= 0 && x < 8 && y >= 0 && y < 8;
  const sideOf = (p) => p === PLAYER || p === PLAYER_KING ? PLAYER : p === CPU || p === CPU_KING ? CPU : 0;
  const king = (p) => p === PLAYER_KING || p === CPU_KING;
  const opponent = (side) => side === PLAYER ? CPU : PLAYER;

  function freshState() {
    const board = Array(64).fill(0);
    for (let i=0;i<24;i++) if (((i%8)+(i>>3))%2) board[i]=CPU;
    for (let i=40;i<64;i++) if (((i%8)+(i>>3))%2) board[i]=PLAYER;
    return { board, side:PLAYER, quiet:0, history:[] };
  }

  function reset() {
    state=freshState(); cursor=40; selected=-1; forcedFrom=-1; busy=false; result=""; score=0; lastMove=null;
    remember(); StarcadeHost.score(0); draw();
  }

  function clone(s) { return {board:s.board.slice(),side:s.side,quiet:s.quiet,history:s.history.slice()}; }
  function key(s) { return `${s.board.join("")}|${s.side}`; }
  function remember() { state.history.push(key(state)); }
  function directions(piece) {
    if (king(piece)) return [[-1,-1],[1,-1],[-1,1],[1,1]];
    return sideOf(piece)===PLAYER ? [[-1,-1],[1,-1]] : [[-1,1],[1,1]];
  }

  function pieceMoves(s, from, capturesOnly=false) {
    const board=s.board,piece=board[from],side=sideOf(piece),[x,y]=rc(from),captures=[],steps=[];
    if(!side)return captures;
    for(const[dx,dy]of directions(piece)){
      const nx=x+dx,ny=y+dy,jx=x+dx*2,jy=y+dy*2;
      if(inside(jx,jy)&&sideOf(board[index(nx,ny)])===opponent(side)&&!board[index(jx,jy)]) captures.push({from,to:index(jx,jy),capture:index(nx,ny)});
      if(!capturesOnly&&inside(nx,ny)&&!board[index(nx,ny)]) steps.push({from,to:index(nx,ny),capture:-1});
    }
    return captures.length?captures:capturesOnly?[]:steps;
  }

  function legalMoves(s, onlyFrom=-1) {
    const captures=[];
    for(let i=0;i<64;i++)if(sideOf(s.board[i])===s.side&&(onlyFrom<0||i===onlyFrom))captures.push(...pieceMoves(s,i,true));
    if(captures.length)return captures;
    if(onlyFrom>=0)return [];
    const steps=[];for(let i=0;i<64;i++)if(sideOf(s.board[i])===s.side)steps.push(...pieceMoves(s,i,false));
    return steps;
  }

  function apply(s,m,continueTurn=false) {
    const next=clone(s),piece=next.board[m.from];
    next.board[m.to]=piece;next.board[m.from]=0;if(m.capture>=0)next.board[m.capture]=0;
    let promoted=false;const row=m.to>>3;
    if(piece===PLAYER&&row===0){next.board[m.to]=PLAYER_KING;promoted=true}
    if(piece===CPU&&row===7){next.board[m.to]=CPU_KING;promoted=true}
    next.quiet=m.capture>=0||promoted?0:next.quiet+1;
    if(!continueTurn)next.side=opponent(next.side);
    return {next,promoted};
  }

  function sequenceOutcomes(s,move) {
    const first=apply(s,move,true),land=move.to;
    if(move.capture<0||first.promoted){first.next.side=opponent(s.side);return[{state:first.next,path:[move]}]}
    const more=pieceMoves(first.next,land,true);
    if(!more.length){first.next.side=opponent(s.side);return[{state:first.next,path:[move]}]}
    const outcomes=[];
    for(const nextMove of more)for(const outcome of sequenceOutcomes(first.next,nextMove))outcomes.push({state:outcome.state,path:[move,...outcome.path]});
    return outcomes;
  }

  function terminal(s) {
    if(!s.board.some((p)=>sideOf(p)===PLAYER)||!legalMoves({...s,side:PLAYER}).length)return"CPU VICTORY";
    if(!s.board.some((p)=>sideOf(p)===CPU)||!legalMoves({...s,side:CPU}).length)return"PLAYER VICTORY";
    if(s.quiet>=80)return"DRAW - FORTY-MOVE RULE";
    const current=key(s);if(s.history.filter((p)=>p===current).length>=3)return"DRAW - THREEFOLD REPETITION";
    return"";
  }

  function evaluate(s) {
    let value=0;
    for(let i=0;i<64;i++){
      const p=s.board[i];if(!p)continue;const[x,y]=rc(i),side=sideOf(p),base=king(p)?175:100;
      const advance=king(p)?0:(side===PLAYER?7-y:y)*4;
      const center=(x>=2&&x<=5&&y>=2&&y<=5)?8:0;
      const edge=(x===0||x===7)?5:0;
      value+=(side===PLAYER?1:-1)*(base+advance+center+edge);
    }
    return value;
  }

  function search(s,depth,alpha,beta) {
    const end=terminal(s);if(end)return end==="PLAYER VICTORY"?100000+depth:end==="CPU VICTORY"?-100000-depth:0;
    if(depth===0)return evaluate(s);
    const moves=legalMoves(s),outcomes=[];
    for(const m of moves)outcomes.push(...sequenceOutcomes(s,m));
    outcomes.sort((a,b)=>b.path.filter(m=>m.capture>=0).length-a.path.filter(m=>m.capture>=0).length);
    if(s.side===PLAYER){let best=-Infinity;for(const o of outcomes){best=Math.max(best,search(o.state,depth-1,alpha,beta));alpha=Math.max(alpha,best);if(beta<=alpha)break}return best}
    let best=Infinity;for(const o of outcomes){best=Math.min(best,search(o.state,depth-1,alpha,beta));beta=Math.min(beta,best);if(beta<=alpha)break}return best;
  }

  function finishTurn() {
    state.side=opponent(state.side);forcedFrom=-1;selected=-1;remember();result=terminal(state);
    if(result){if(result==="PLAYER VICTORY"){score+=1500;StarcadeHost.score(score)}StarcadeHost.finish(score)}
  }

  function playerMove(move) {
    const capturedPiece=move.capture>=0?state.board[move.capture]:0;
    const applied=apply(state,move,true);state=applied.next;lastMove=move;
    if(move.capture>=0){score+=king(capturedPiece)?175:100;StarcadeHost.score(score)}
    const more=move.capture>=0&&!applied.promoted?pieceMoves(state,move.to,true):[];
    if(more.length){forcedFrom=move.to;selected=move.to;cursor=move.to}
    else{finishTurn();if(!result)cpuMove()}
  }

  function cpuMove() {
    busy=true;draw();setTimeout(()=>{
      const choices=[];for(const m of legalMoves(state))choices.push(...sequenceOutcomes(state,m));
      let best=choices[0],bestValue=Infinity;
      for(const choice of choices){const value=search(choice.state,5,-Infinity,Infinity)+(Math.random()*2-1);if(value<bestValue){bestValue=value;best=choice}}
      if(best){let captured=0;for(const m of best.path){if(m.capture>=0)captured++;lastMove=m}state=best.state;score=Math.max(0,score-captured*75);StarcadeHost.score(score);remember()}
      result=terminal(state);if(result){if(result==="PLAYER VICTORY"){score+=1500;StarcadeHost.score(score)}StarcadeHost.finish(score)}
      busy=false;draw();
    },120);
  }

  function act() {
    if(result){reset();return}if(busy||state.side!==PLAYER)return;
    const legal=legalMoves(state,forcedFrom);
    if(selected<0){if(sideOf(state.board[cursor])===PLAYER&&legal.some(m=>m.from===cursor))selected=cursor}
    else{
      const move=legal.find(m=>m.from===selected&&m.to===cursor);
      if(move)playerMove(move);else if(forcedFrom<0&&sideOf(state.board[cursor])===PLAYER&&legal.some(m=>m.from===cursor))selected=cursor;
    }
    draw();
  }

  function status() {
    if(result)return result;if(busy)return"STARCADE CPU CALCULATING...";
    if(forcedFrom>=0)return"MULTI-JUMP REQUIRED";
    if(legalMoves(state).some(m=>m.capture>=0))return"YOUR TURN - CAPTURE REQUIRED";
    return"YOUR TURN - LIGHT PIECES";
  }

  function draw() {
    ctx.fillStyle="#05090d";ctx.fillRect(0,0,660,660);
    const targets=selected>=0?legalMoves(state,forcedFrom).filter(m=>m.from===selected).map(m=>m.to):[];
    for(let i=0;i<64;i++){
      const[x,y]=rc(i),px=ORIGIN+x*CELL,py=ORIGIN+y*CELL;
      ctx.fillStyle=(x+y)%2?"#13231f":"#35514b";ctx.fillRect(px,py,CELL,CELL);
      if(lastMove&&(i===lastMove.from||i===lastMove.to)){ctx.fillStyle="rgba(242,200,121,.22)";ctx.fillRect(px,py,CELL,CELL)}
      if(targets.includes(i)){ctx.fillStyle="rgba(141,247,199,.42)";ctx.beginPath();ctx.arc(px+35,py+35,10,0,Math.PI*2);ctx.fill()}
      const p=state.board[i];if(p){ctx.beginPath();ctx.arc(px+35,py+35,25,0,Math.PI*2);ctx.fillStyle=sideOf(p)===PLAYER?"#8df7c7":"#ff8d72";ctx.fill();ctx.strokeStyle="rgba(255,255,255,.35)";ctx.lineWidth=3;ctx.stroke();if(king(p)){ctx.fillStyle="#08120f";ctx.font="bold 25px Arial";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("\u2605",px+35,py+36)}}
      ctx.strokeStyle=i===cursor?"#fff":i===selected?"#f2c879":"transparent";ctx.lineWidth=4;ctx.strokeRect(px+3,py+3,CELL-6,CELL-6);
    }
    ctx.fillStyle="#08120f";ctx.fillRect(0,0,660,34);ctx.textAlign="center";ctx.textBaseline="middle";ctx.font="bold 14px Arial";ctx.fillStyle=status().includes("REQUIRED")?"#f2c879":"#c8d8d2";ctx.fillText(status(),330,17);
    if(result){ctx.fillStyle="rgba(3,7,6,.9)";ctx.fillRect(0,270,660,120);ctx.fillStyle=result.startsWith("PLAYER")?"#8df7c7":result.startsWith("CPU")?"#ff8d72":"#f2c879";ctx.font="bold 27px Arial";ctx.fillText(result,330,313);ctx.fillStyle="#e8f4f2";ctx.font="14px Arial";ctx.fillText("PRESS A / ENTER TO START A NEW MATCH",330,351)}
  }

  addEventListener("keydown",(event)=>{
    const keyName=StarcadeInput.key(event),[x,y]=rc(cursor);
    if(keyName==="ArrowLeft")cursor=index((x+7)%8,y);
    if(keyName==="ArrowRight")cursor=index((x+1)%8,y);
    if(keyName==="ArrowUp")cursor=index(x,(y+7)%8);
    if(keyName==="ArrowDown")cursor=index(x,(y+1)%8);
    if(keyName==="Action")act();
    if(StarcadeInput.isControl(keyName)){event.preventDefault();draw()}
  });

  reset();StarcadeHost.ready({title:"Orbital Checkers vs CPU"});
})();
