"use strict";
(function(){
  const c=game,x=c.getContext("2d"),W=900,H=560,GROUND=505;
  let aim,missiles,bursts,score,live,wave,spawn,buildings,ammo,launched,quota,wavePause,finished;
  function reset(){
    aim={x:450,y:245};missiles=[];bursts=[];score=0;live=true;wave=1;spawn=0;finished=false;
    buildings=[
      {x:82,w:72,h:45,hp:2,type:"hab"},{x:190,w:60,h:68,hp:2,type:"tower"},
      {x:350,w:82,h:52,hp:2,type:"reactor"},{x:485,w:82,h:52,hp:2,type:"reactor"},
      {x:650,w:60,h:68,hp:2,type:"tower"},{x:760,w:72,h:45,hp:2,type:"hab"}
    ];beginWave();StarcadeHost.score(0);
  }
  function beginWave(){ammo=Math.min(55,24+wave*3);launched=0;quota=10+wave*3;wavePause=0}
  function living(){return buildings.filter(q=>q.hp>0)}
  function launchEnemy(){const targets=living();if(!targets.length)return;const t=targets[Math.floor(Math.random()*targets.length)];missiles.push({x:Math.random()*W,y:0,tx:t.x+t.w/2,ty:GROUND-3,v:1.05+wave*.1+Math.random()*.8,target:t,split:wave>=4&&Math.random()<.12})}
  function impact(q){q.target.hp--;bursts.push({x:q.tx,y:q.ty,r:5,max:42,enemy:true});if(!living().length){live=false;if(!finished){finished=true;StarcadeHost.finish(score)}}}
  function step(){
    if(live&&wavePause){if(--wavePause===0){wave++;for(const b of buildings)if(b.hp===1)b.hp=2;beginWave()}draw();requestAnimationFrame(step);return}
    if(live&&launched<quota&&++spawn>Math.max(22,72-wave*3)){spawn=0;launchEnemy();launched++}
    missiles.forEach(q=>{const dx=q.tx-q.x,dy=q.ty-q.y,d=Math.hypot(dx,dy)||1;q.x+=dx/d*q.v;q.y+=dy/d*q.v;if(q.split&&q.y>180){q.split=false;const targets=living();for(let i=0;i<2&&targets.length;i++){const t=targets[Math.floor(Math.random()*targets.length)];missiles.push({x:q.x,y:q.y,tx:t.x+t.w/2,ty:GROUND-3,v:q.v*1.12,target:t,split:false})}}if(d<q.v+3){q.hit=true;impact(q)}});
    bursts.forEach(q=>q.r+=q.enemy?2.5:4.2);
    for(const q of missiles)for(const z of bursts)if(!q.hit&&!z.enemy&&Math.hypot(q.x-z.x,q.y-z.y)<z.r){q.hit=true;score+=100;StarcadeHost.score(score);bursts.push({x:q.x,y:q.y,r:3,max:24,enemy:true});break}
    missiles=missiles.filter(q=>!q.hit);bursts=bursts.filter(q=>q.r<q.max);
    if(live&&launched>=quota&&!missiles.length&&!wavePause){score+=living().length*150+ammo*20;StarcadeHost.score(score);if(wave===5)StarcadeHost.achievement("missile-wave-five");wavePause=120}draw();requestAnimationFrame(step);
  }
  function base(){
    x.fillStyle="#152b28";x.fillRect(0,GROUND,W,H-GROUND);x.fillStyle="#31564e";x.fillRect(0,GROUND,W,4);
    buildings.forEach(q=>{if(q.hp<=0){x.fillStyle="#321d1a";x.fillRect(q.x,GROUND-8,q.w,8);return}const top=GROUND-q.h;x.fillStyle=q.hp===1?"#7a4035":"#274f49";x.fillRect(q.x,top,q.w,q.h);x.strokeStyle=q.hp===1?"#ff8d72":"#8df7c7";x.lineWidth=2;x.strokeRect(q.x,top,q.w,q.h);x.fillStyle="#d6b96e";for(let yy=top+12;yy<GROUND-8;yy+=16)for(let xx=q.x+10;xx<q.x+q.w-5;xx+=18)x.fillRect(xx,yy,7,6);if(q.type==="reactor"){x.beginPath();x.arc(q.x+q.w/2,top,16,Math.PI,0);x.fillStyle="#274f49";x.fill();x.stroke()}});
  }
  function draw(){
    x.fillStyle="#05090d";x.fillRect(0,0,W,H);x.fillStyle="#829792";for(let i=0;i<45;i++)x.fillRect((i*197)%W,(i*83)%440,1,1);base();
    x.lineWidth=2;x.strokeStyle="#ff8d72";missiles.forEach(q=>{x.beginPath();x.moveTo(q.x-(q.tx-q.x)*.035,q.y-(q.ty-q.y)*.035);x.lineTo(q.x,q.y);x.stroke();x.fillStyle="#fff";x.fillRect(q.x-2,q.y-2,4,4)});
    bursts.forEach(q=>{x.beginPath();x.arc(q.x,q.y,q.r,0,Math.PI*2);x.strokeStyle=q.enemy?"#ff8d72":"#8df7c7";x.stroke()});
    x.strokeStyle="#8df7c7";x.strokeRect(aim.x-12,aim.y-12,24,24);x.beginPath();x.moveTo(aim.x-20,aim.y);x.lineTo(aim.x+20,aim.y);x.moveTo(aim.x,aim.y-20);x.lineTo(aim.x,aim.y+20);x.stroke();
    x.font="15px Arial";x.fillStyle="#dce8e5";x.fillText(`COLONY ${living().length}/6   INTERCEPTORS ${ammo}   SCORE ${score}`,18,28);x.fillText(`DEFENSE WAVE ${wave}`,730,28);if(wavePause){x.textAlign="center";x.fillStyle="#8df7c7";x.font="24px Arial";x.fillText(`WAVE ${wave} SECURED`,W/2,190);x.textAlign="left"}
    if(!live){x.fillStyle="rgba(3,7,6,.88)";x.fillRect(0,220,W,120);x.textAlign="center";x.fillStyle="#ff8d72";x.font="28px Arial";x.fillText("COLONY LOST",W/2,270);x.fillStyle="#fff";x.font="16px Arial";x.fillText("PRESS A / ENTER TO REBUILD",W/2,305);x.textAlign="left"}
  }
  addEventListener("keydown",e=>{const k=StarcadeInput.key(e);if(k==="ArrowLeft")aim.x=Math.max(20,aim.x-18);if(k==="ArrowRight")aim.x=Math.min(W-20,aim.x+18);if(k==="ArrowUp")aim.y=Math.max(35,aim.y-18);if(k==="ArrowDown")aim.y=Math.min(GROUND-25,aim.y+18);if(k==="Action"){if(live&&!wavePause&&ammo>0){ammo--;bursts.push({x:aim.x,y:aim.y,r:2,max:82,enemy:false})}else if(!live)reset()}if(StarcadeInput.isControl(k))e.preventDefault()});
  reset();StarcadeHost.ready({title:"Missile Defense"});step();
})();
