"use strict";
(()=>{
  const c=game,x=c.getContext("2d"),keys=new Set();let ship,fuel,score,state,mission,pad,wind,finished;
  function startMission(){pad={x:100+Math.random()*580,w:Math.max(100,230-mission*14)};wind=(Math.random()-.5)*(.004+mission*.002);ship={x:450,y:55,vx:0,vy:0,a:0};fuel=Math.max(520,1050-mission*45);state="fly"}
  function reset(){score=0;mission=1;finished=false;startMission();StarcadeHost.score(0)}
  function conclude(ok){state=ok?"landed":"crashed";if(ok){const precision=Math.max(0,1-Math.abs(ship.vx)/.72)*500+Math.max(0,1-ship.vy/1.02)*500,bonus=Math.max(250,Math.floor(fuel*2+1200+precision));score+=bonus*mission;StarcadeHost.score(score);if(mission===5){state="complete";finished=true;StarcadeHost.achievement("lunar-five-landings");StarcadeHost.finish(score)}}else{finished=true;StarcadeHost.finish(score)}}
  function step(){
    if(state==="fly"){
      ship.vy+=.019+mission*.001;ship.vx+=wind;
      if(keys.has("ArrowLeft")&&fuel>0){ship.vx-=.014;fuel--}if(keys.has("ArrowRight")&&fuel>0){ship.vx+=.014;fuel--}if(keys.has("ArrowUp")&&fuel>0){ship.vy-=.055;fuel-=2}
      fuel=Math.max(0,fuel);ship.x+=ship.vx;ship.y+=ship.vy;if(ship.x<0)ship.x=900;if(ship.x>900)ship.x=0;
      if(ship.y>500){const safe=Math.abs(ship.vx)<.72&&ship.vy<1.02&&ship.x>pad.x&&ship.x<pad.x+pad.w;conclude(safe)}
    }
    draw();requestAnimationFrame(step);
  }
  function draw(){
    x.fillStyle="#05090d";x.fillRect(0,0,900,560);x.fillStyle="#1e2735";x.beginPath();x.moveTo(0,515);for(let q=0;q<=900;q+=35)x.lineTo(q,506+Math.sin(q*.07+mission)*7);x.lineTo(900,560);x.lineTo(0,560);x.fill();x.fillStyle="#a8b9ff";x.fillRect(pad.x,508,pad.w,7);x.fillStyle="#63718f";x.fillRect(pad.x+pad.w/2-3,490,6,18);
    x.save();x.translate(ship.x,ship.y);x.strokeStyle="#e9eefc";x.lineWidth=2;x.strokeRect(-12,-10,24,20);x.beginPath();x.moveTo(-12,10);x.lineTo(-20,19);x.moveTo(12,10);x.lineTo(20,19);x.stroke();if(keys.has("ArrowUp")&&fuel>0){x.strokeStyle="#ffba67";x.beginPath();x.moveTo(-6,11);x.lineTo(0,28);x.lineTo(6,11);x.stroke()}x.restore();
    x.fillStyle="#9aaba7";x.font="15px Arial";x.textAlign="left";x.fillText(`MISSION ${mission}   FUEL ${fuel}   V ${ship.vy.toFixed(2)}   H ${ship.vx.toFixed(2)}   WIND ${(wind*1000).toFixed(1)}`,20,30);
    if(state!=="fly"){x.textAlign="center";x.fillStyle=state==="crashed"?"#ff8d72":"#8df7c7";x.font="30px Arial";x.fillText(state==="complete"?"FIVE-MISSION TOUR COMPLETE":state==="landed"?`MISSION ${mission} COMPLETE`:"LANDER LOST",450,245);x.font="15px Arial";x.fillText(state==="landed"?"PRESS A / ENTER FOR NEXT DESCENT":"PRESS A / ENTER TO RESTART",450,285)}
  }
  addEventListener("keydown",e=>{const k=StarcadeInput.key(e);keys.add(k);if(k==="Action"&&state!=="fly"){if(state==="landed"){mission++;startMission()}else reset()}if(StarcadeInput.isControl(k))e.preventDefault()});addEventListener("keyup",e=>keys.delete(StarcadeInput.key(e)));
  reset();StarcadeHost.ready({title:"Lunar Descent"});requestAnimationFrame(step);
})();
