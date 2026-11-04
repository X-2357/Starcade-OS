"use strict";
(()=>{
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function segmentDistance(p,a,b){const x=b.x-a.x,y=b.y-a.y,n=x*x+y*y,t=n?clamp(((p.x-a.x)*x+(p.y-a.y)*y)/n,0,1):0;return Math.hypot(p.x-a.x-t*x,p.y-a.y-t*y);}
  function model(s,target=-1){
    if(!s)return null;
    const player=s.players[s.control],owner=s.ball.owner,side=owner<0?-1:owner<6?0:1;
    const pressure=Math.min(...s.players.slice(6).map(p=>Math.hypot(p.x-player.x,p.y-player.y)));
    const recovery=Math.ceil(player.cool/6)/10,seconds=clamp(s.shotClock/60,0,20),energy=clamp(player.energy,0,100);
    const attacking=owner===s.control,receiver=attacking&&Number.isInteger(target)&&target>0&&target<6&&target!==owner?s.players[target]:null;
    const covered=receiver?s.players.slice(6).some(p=>segmentDistance(p,player,receiver)<(p.id%6===0?2.6:1.6)):null;
    const range=102-player.x,rangeLabel=range<=28?'Near goal':range<=50?'Mid court':'Long range';
    let action,hint;
    if(side<0){action='Loose ball · chase possession';hint='Move toward the ball. A switches your defending runner.';}
    else if(attacking){action=recovery?`Recovering · ${recovery.toFixed(1)}s`:'A shoot · X pass';hint=seconds<=5?'Possession nearly expired: shoot before the clock reaches zero.':pressure<4?'Opponent close: release the ball before the challenge.':range>50?'Long range: carry forward or find a passing outlet.':'Move across the keeper, then shoot toward the open side.';}
    else if(side===0){action='Teammate possession · A takes control';hint='A switches control to the carrier; keep the attack moving.';}
    else{const carrier=s.players[owner],distance=Math.hypot(carrier.x-player.x,carrier.y-player.y);action=recovery?`Challenge recovering · ${recovery.toFixed(1)}s`:distance<=4?'X challenge ready · A switch runner':'Close the carrier · A switch runner';hint='Move close before X. A switches between the nearest defending runners.';}
    if(s.phase==='result'){action='Full time · review your performance';hint='The match clock has stopped. Review the result or start another match.';}else if(s.phase==='paused')action='Paused · '+action;
    return {action,hint,seconds,energy,recovery,rangeLabel:attacking?rangeLabel:side<0?'Loose ball':side===0?'Supporting':'Defending',possession:side===0?'Teal possession':side===1?'Rose possession':'Possession',pressure:pressure<4?'Opponent close':'Space available',covered,lane:covered===null?'Gain possession for a passing outlet':covered?'Passing lane covered now':'Passing lane clear now'};
  }
  function review(s){if(!s?.individual)return null;const totals={passes:0,completed:0,shots:0,steals:0,saves:0};for(const p of s.individual.slice(0,6))for(const k of Object.keys(totals))totals[k]+=p[k];return {...totals,fromTick:s.metricsFromTick||0};}
  window.RazorCoach={model,review,segmentDistance};
})();
