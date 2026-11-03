"use strict";
(function (root) {
  const DT = 1 / 60, LIMIT = 7200;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const team = id => id < 6 ? 0 : 1;
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  function random(s) { s.rng = (Math.imul(s.rng, 1664525) + 1013904223) >>> 0; return s.rng / 4294967296; }
  const bases = [[5,30],[23,15],[23,45],[40,12],[40,48],[46,30]];
  function kickoff(s, side, keeper = false) {
    s.players.forEach((p, id) => { const b = bases[id % 6]; p.x = team(id) ? 100 - b[0] : b[0]; p.y = b[1]; p.cool = 30; });
    const owner = side * 6 + (keeper ? 0 : 5), p = s.players[owner];
    s.ball = { x:p.x, y:p.y, vx:0, vy:0, owner, ignore:-1, flight:0 };
    s.possession = side; s.shotClock = 1200;
    s.control = side === 0 ? owner : 5;
  }
  function create(seed) {
    if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw Error("Invalid seed");
    const s = { schema:1, rules:1, rng:seed, tick:0, phase:"live", goals:[0,0], control:5,
      possession:0, shotClock:1200, ball:null, event:"Kickoff — teal attacks right", eventTick:0,
      players:Array.from({length:12}, (_,id)=>({id,x:0,y:0,cool:0,energy:100})),
      stats:{shots:[0,0],passes:[0,0],steals:[0,0],saves:[0,0],turnovers:[0,0]} };
    kickoff(s,0); return s;
  }
  function announce(s,text) {s.event=text;s.eventTick=s.tick;}
  function take(s,id) {
    const side=team(id);
    if(side!==s.possession){s.possession=side;s.shotClock=1200;}
    s.ball.owner=id;s.ball.vx=0;s.ball.vy=0;s.ball.flight=0;
    if(side===0)s.control=id;
  }
  function target(s,id) {
    const side=team(id), p=s.players[id], dir=side ? -1 : 1;
    let pick=-1,best=-Infinity;
    s.players.forEach((q,j)=>{
      if(j===id || team(j)!==side || j%6===0)return;
      const nearest=Math.min(...s.players.filter(r=>team(r.id)!==side).map(r=>distance(q,r)));
      const value=(q.x-p.x)*dir*.4+nearest-distance(p,q)*.15;
      if(value>best){best=value;pick=j;}
    });return pick;
  }
  function release(s,id,x,y,speed) {
    const p=s.players[id], d=Math.hypot(x-p.x,y-p.y)||1;
    s.ball={x:p.x,y:p.y,vx:(x-p.x)/d*speed,vy:(y-p.y)/d*speed,owner:-1,ignore:id,flight:0};p.cool=30;
  }
  function pass(s,id) {
    if(s.ball.owner!==id || s.players[id].cool>0)return false;
    const j=target(s,id);if(j<0)return false;
    const q=s.players[j];release(s,id,q.x,q.y,34);s.stats.passes[team(id)]++;
    announce(s,`${team(id)===0?"Teal":"Rose"} passes to runner ${j%6+1}`);return true;
  }
  function shoot(s,id) {
    if(s.ball.owner!==id || s.players[id].cool>0)return false;
    const side=team(id), p=s.players[id], keeper=s.players[(1-side)*6];
    const x=side===0?102:-2, range=Math.abs(x-p.x);
    const aim=(keeper.y>=30?24:36)+(random(s)-.5)*(3+range*.13);
    release(s,id,x,aim,47);s.stats.shots[side]++;
    announce(s,`${side===0?"Teal":"Rose"} shoots`);return true;
  }
  function challenge(s,id) {
    const p=s.players[id], owner=s.ball.owner;
    if(owner<0 || team(owner)===team(id) || p.cool>0 || distance(p,s.players[owner])>4)return false;
    p.cool=45;
    if(random(s)<.65){take(s,id);s.stats.steals[team(id)]++;announce(s,`${team(id)===0?"Teal":"Rose"} wins a challenge`);return true;}
    return false;
  }
  function move(p,x,y,sprint=false,keeper=false) {
    const n=Math.hypot(x,y);if(!n){p.energy=clamp(p.energy+10*DT,0,100);return;}
    const fast=sprint&&p.energy>5,speed=keeper?8:fast?18:12;
    p.energy=clamp(p.energy+(fast?-24:10)*DT,0,100);
    p.x=clamp(p.x+x/n*speed*DT,keeper?2:4,keeper?98:96);
    p.y=clamp(p.y+y/n*speed*DT,3,57);
  }
  function switchDefender(s) {
    if(s.ball.owner>=0&&team(s.ball.owner)===0){s.control=s.ball.owner;return;}
    const sorted=s.players.slice(1,6).sort((a,b)=>distance(a,s.ball)-distance(b,s.ball));
    s.control=sorted[0].id===s.control?sorted[1].id:sorted[0].id;
  }
  function step(s,input={}) {
    if(s.phase!=="live")return;
    s.tick++;s.shotClock--;
    s.players.forEach(p=>{p.cool=Math.max(0,p.cool-1);});
    if(s.tick>=LIMIT){s.phase="result";announce(s,"Full time");return;}
    if(input.shoot){if(s.ball.owner===s.control)shoot(s,s.control);else switchDefender(s);}
    if(input.pass){if(s.ball.owner===s.control)pass(s,s.control);else challenge(s,s.control);}
    const carrier=s.ball.owner>=0?s.players[s.ball.owner]:s.ball;
    for(const p of s.players){
      const side=team(p.id), dir=side===0?1:-1, own=s.ball.owner>=0&&team(s.ball.owner)===side;
      if(p.id===s.control){move(p,clamp(input.x||0,-1,1),clamp(input.y||0,-1,1),!!input.sprint,p.id%6===0);continue;}
      if(p.id%6===0){if(s.ball.owner===p.id&&p.cool===0)pass(s,p.id);move(p,(side?95:5)-p.x,clamp(s.ball.y,22,38)-p.y,false,true);continue;}
      if(s.ball.owner===p.id){
        if(s.tick%15===0&&p.cool===0){
          const pressure=Math.min(...s.players.filter(q=>team(q.id)!==side).map(q=>distance(p,q)));
          if((side===0?p.x>72:p.x<28)&&Math.abs(p.y-30)<22)shoot(s,p.id);
          else if(pressure<7)pass(s,p.id);
        }
        move(p,dir, (30-p.y)*.025);continue;
      }
      const pursuers=s.players.filter(q=>team(q.id)===side&&q.id%6!==0&&q.id!==s.control).sort((a,b)=>distance(a,carrier)-distance(b,carrier));
      const chase=!own&&(s.ball.owner<0||pursuers.slice(0,2).some(q=>q.id===p.id));
      const base=bases[p.id%6];
      const tx=chase?carrier.x:clamp((side?100-base[0]:base[0])+(own?(carrier.x-50)*.55+dir*15:dir*8),8,92);
      const ty=chase?carrier.y:base[1]+(carrier.y-30)*.15;
      if(distance(p,{x:tx,y:ty})>.5)move(p,tx-p.x,ty-p.y);
      if(!own&&s.ball.owner>=0&&distance(p,carrier)<2.8)challenge(s,p.id);
    }
    const b=s.ball;
    if(b.owner>=0){const p=s.players[b.owner];b.x=p.x;b.y=p.y;}
    else {
      b.x+=b.vx*DT;b.y+=b.vy*DT;b.flight++;
      if(b.y<1||b.y>59){b.y=clamp(b.y,1,59);b.vy*=-.7;}
      if(b.x<0||b.x>100){
        const scorer=b.x>100?0:1;
        if(b.y>=21&&b.y<=39){s.goals[scorer]++;announce(s,`${scorer===0?"TEAL":"ROSE"} GOAL!`);kickoff(s,1-scorer);}
        else {announce(s,"Wide — keeper restart");kickoff(s,1-scorer,true);}
      }else{
        for(const p of s.players){
          if(p.id===b.ignore&&b.flight<18)continue;
          if(distance(p,b)<(p.id%6===0?2.6:1.6)){
            if(p.id%6===0&&Math.abs(b.vx)>40){s.stats.saves[team(p.id)]++;announce(s,`${team(p.id)===0?"Teal":"Rose"} keeper saves`);}
            take(s,p.id);break;
          }
        }
        if(s.ball.owner<0&&b.flight>=300){announce(s,"Loose ball — restart");kickoff(s,1-s.possession,true);}
      }
    }
    if(s.shotClock<=0){const lost=s.possession;s.stats.turnovers[lost]++;kickoff(s,1-lost,true);announce(s,"Possession clock — turnover");}
  }
  function restore(data) {
    if(!data||data.schema!==1||data.rules!==1)throw Error("Unsupported match");
    const s=JSON.parse(JSON.stringify(data));
    const bounded=(n,a,b)=>typeof n==="number"&&Number.isFinite(n)&&n>=a&&n<=b;
    const integer=(n,a,b)=>Number.isInteger(n)&&bounded(n,a,b);
    if(!integer(s.rng,0,0xffffffff)||!integer(s.tick,0,LIMIT)||!["live","paused","result"].includes(s.phase)||!integer(s.control,0,5)||!integer(s.possession,0,1)||!integer(s.shotClock,0,1200))throw Error("Invalid match header");
    if((s.phase==="result")!==(s.tick===LIMIT))throw Error("Invalid result");
    if(!Array.isArray(s.goals)||s.goals.length!==2||!s.goals.every(n=>integer(n,0,240)))throw Error("Invalid score");
    if(!Array.isArray(s.players)||s.players.length!==12||!s.players.every((p,i)=>p&&p.id===i&&bounded(p.x,0,100)&&bounded(p.y,0,60)&&integer(p.cool,0,45)&&bounded(p.energy,0,100)))throw Error("Invalid players");
    const b=s.ball;
    if(!b||!bounded(b.x,-2,102)||!bounded(b.y,0,60)||!bounded(b.vx,-47,47)||!bounded(b.vy,-47,47)||!integer(b.owner,-1,11)||!integer(b.ignore,-1,11)||!integer(b.flight,0,300))throw Error("Invalid ball");
    if(b.owner>=0&&team(b.owner)!==s.possession)throw Error("Invalid possession");
    if(typeof s.event!=="string"||s.event.length>100||!integer(s.eventTick,0,s.tick))throw Error("Invalid event");
    if(!s.stats||!["shots","passes","steals","saves","turnovers"].every(key=>Array.isArray(s.stats[key])&&s.stats[key].length===2&&s.stats[key].every(n=>integer(n,0,10000))))throw Error("Invalid statistics");
    return s;
  }
  root.RazorDerby={create,step,restore,target,pass,shoot,challenge,distance,team,LIMIT};
})(globalThis);
