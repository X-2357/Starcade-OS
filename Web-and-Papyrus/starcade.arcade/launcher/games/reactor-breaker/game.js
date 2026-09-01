"use strict";
(()=>{
  const c=game,x=c.getContext("2d"),keys=new Set();
  let pad,ball,bricks,powerups,score,live,lives,level,wideUntil,finished;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function makeLevel(){
    bricks=[];powerups=[];const rows=Math.min(8,4+level),cols=12;
    for(let r=0;r<rows;r++)for(let q=0;q<cols;q++){
      if(level>2&&(r+q+level)%11===0)continue;
      const hp=1+(level>2&&r<2?1:0)+(level>6&&r===0?1:0);
      bricks.push({x:35+q*70,y:42+r*31,w:62,h:21,hp,max:hp,hue:155+r*16});
    }
    live=false;ball={x:pad+60,y:500,vx:0,vy:0};
  }
  function reset(){pad=390;score=0;lives=3;level=1;wideUntil=0;finished=false;makeLevel();StarcadeHost.score(0)}
  function launch(){if(!live&&!finished){const speed=5+Math.min(3,level*.22);ball.vx=(Math.random()<.5?-1:1)*speed*.72;ball.vy=-speed;live=true}}
  function loseBall(){lives--;live=false;wideUntil=0;if(lives<=0){finished=true;StarcadeHost.finish(score)}else ball={x:pad+60,y:500,vx:0,vy:0}}
  function nextLevel(){score+=1000*level+lives*200;StarcadeHost.score(score);level++;if(level===5)StarcadeHost.achievement("reactor-level-five");makeLevel()}
  function step(){
    if(!finished){
      if(keys.has("ArrowLeft"))pad-=7.5;if(keys.has("ArrowRight"))pad+=7.5;const width=performance.now()<wideUntil?180:120;pad=clamp(pad,0,900-width);
      if(!live){ball.x=pad+width/2;ball.y=500}else{
        ball.x+=ball.vx;ball.y+=ball.vy;
        if(ball.x<8){ball.x=8;ball.vx=Math.abs(ball.vx)}if(ball.x>892){ball.x=892;ball.vx=-Math.abs(ball.vx)}if(ball.y<8){ball.y=8;ball.vy=Math.abs(ball.vy)}
        if(ball.y>505&&ball.y<535&&ball.vy>0&&ball.x>pad&&ball.x<pad+width){ball.y=505;ball.vy=-Math.abs(ball.vy);ball.vx+=(ball.x-(pad+width/2))*.035;ball.vx=clamp(ball.vx,-8.5,8.5)}
        for(const b of bricks)if(b.hp>0&&ball.x>b.x&&ball.x<b.x+b.w&&ball.y>b.y&&ball.y<b.y+b.h){b.hp--;ball.vy*=-1;score+=50*b.max*level;StarcadeHost.score(score);if(b.hp===0&&Math.random()<.09)powerups.push({x:b.x+b.w/2,y:b.y,type:Math.random()<.55?"wide":"life"});break}
        if(ball.y>570)loseBall();if(!bricks.some(b=>b.hp>0))nextLevel();
      }
      powerups.forEach(p=>p.y+=2.8);for(const p of powerups)if(p.y>510&&p.y<540&&p.x>pad&&p.x<pad+width){p.y=600;if(p.type==="wide")wideUntil=performance.now()+12000;else lives=Math.min(5,lives+1)}powerups=powerups.filter(p=>p.y<570);
    }
    draw();requestAnimationFrame(step);
  }
  function draw(){
    x.fillStyle="#070c0b";x.fillRect(0,0,900,560);bricks.forEach(b=>{if(b.hp){x.fillStyle=`hsl(${b.hue} 55% ${42+b.hp*12}%)`;x.fillRect(b.x,b.y,b.w,b.h);if(b.hp>1){x.strokeStyle="#f2c879";x.strokeRect(b.x+1,b.y+1,b.w-2,b.h-2)}}});
    powerups.forEach(p=>{x.fillStyle=p.type==="life"?"#ff8d72":"#8df7c7";x.beginPath();x.arc(p.x,p.y,9,0,Math.PI*2);x.fill();x.fillStyle="#07100d";x.font="bold 11px Arial";x.textAlign="center";x.fillText(p.type==="life"?"+":"W",p.x,p.y+4)});
    const width=performance.now()<wideUntil?180:120;x.fillStyle="#ff8d72";x.fillRect(pad,520,width,13);x.fillStyle="#fff";x.beginPath();x.arc(ball.x,ball.y,7,0,Math.PI*2);x.fill();
    x.fillStyle="#c8d8d2";x.font="15px Arial";x.textAlign="left";x.fillText(`REACTOR ${level}   CORES ${lives}   SCORE ${score}`,18,25);
    if(!live&&!finished){x.textAlign="center";x.fillStyle="#9fb2ae";x.fillText("PRESS A / ENTER TO LAUNCH",450,470)}
    if(finished){x.fillStyle="rgba(3,7,6,.9)";x.fillRect(0,210,900,140);x.textAlign="center";x.fillStyle="#ff8d72";x.font="bold 28px Arial";x.fillText("REACTOR BREACH",450,270);x.fillStyle="#fff";x.font="14px Arial";x.fillText("PRESS A / ENTER TO RESTART",450,312)}
  }
  addEventListener("keydown",e=>{const k=StarcadeInput.key(e);keys.add(k);if(k==="Action"){if(finished)reset();else launch()}if(StarcadeInput.isControl(k))e.preventDefault()});addEventListener("keyup",e=>keys.delete(StarcadeInput.key(e)));
  reset();StarcadeHost.ready({title:"Reactor Breaker"});requestAnimationFrame(step);
})();
