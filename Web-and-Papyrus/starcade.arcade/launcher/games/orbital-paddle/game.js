"use strict";
(()=>{
  const c=game,x=c.getContext("2d"),keys=new Set();
  let player,computer,ball,playerGames,cpuGames,playerSets,cpuSets,round,score,live,finished,serveToPlayer,rally;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function newBall(){ball={x:450,y:280,vx:0,vy:0};live=false}
  function reset(){player=computer=280;playerGames=cpuGames=playerSets=cpuSets=0;round=1;rally=0;score=0;finished=false;serveToPlayer=true;newBall();StarcadeHost.score(0)}
  function launch(){if(!live&&!finished){const speed=5.2+round*.28;ball.vx=(serveToPlayer?-1:1)*speed;ball.vy=(Math.random()-.5)*4.5;live=true}}
  function endMatch(won){finished=true;live=false;if(won){score+=3000+round*750;StarcadeHost.score(score);StarcadeHost.achievement("orbital-paddle-champion")}StarcadeHost.finish(score)}
  function point(playerWon){
    if(playerWon){playerGames++;score+=350*round+Math.min(500,rally*15);StarcadeHost.score(score)}else cpuGames++;rally=0;
    if(playerGames>=7||cpuGames>=7){if(playerGames>cpuGames)playerSets++;else cpuSets++;if(playerSets>=2||cpuSets>=2){endMatch(playerSets>cpuSets);return}round++;playerGames=cpuGames=0;computer=player=280}
    serveToPlayer=!playerWon;newBall();
  }
  function step(){
    if(!finished){
      if(keys.has("ArrowUp"))player-=6.5;if(keys.has("ArrowDown"))player+=6.5;player=clamp(player,58,502);
      const aiSpeed=Math.min(6.3,3.1+round*.32+Math.max(0,cpuGames-playerGames)*.15);
      if(live)computer+=clamp(ball.y-computer,-aiSpeed,aiSpeed);computer=clamp(computer,58,502);
      if(live){
        ball.x+=ball.vx;ball.y+=ball.vy;
        if(ball.y<9){ball.y=9;ball.vy=Math.abs(ball.vy)}if(ball.y>551){ball.y=551;ball.vy=-Math.abs(ball.vy)}
        if(ball.x<45&&ball.x>22&&ball.vx<0&&Math.abs(ball.y-player)<66){ball.x=45;ball.vx=Math.abs(ball.vx)*1.035;ball.vy+=(ball.y-player)*.045;rally++;score+=25+Math.min(50,rally);StarcadeHost.score(score)}
        if(ball.x>855&&ball.x<880&&ball.vx>0&&Math.abs(ball.y-computer)<66){ball.x=855;ball.vx=-Math.abs(ball.vx)*1.035;ball.vy+=(ball.y-computer)*.04;rally++}
        ball.vy=clamp(ball.vy,-8.5,8.5);
        if(ball.x<0)point(false);else if(ball.x>900)point(true);
      }
    }
    draw();requestAnimationFrame(step);
  }
  function draw(){
    x.fillStyle="#060b0a";x.fillRect(0,0,900,560);x.strokeStyle="#24423b";x.setLineDash([8,12]);x.beginPath();x.moveTo(450,42);x.lineTo(450,540);x.stroke();x.setLineDash([]);
    x.fillStyle="#c58cff";x.fillRect(24,player-62,14,124);x.fillStyle="#76948d";x.fillRect(862,computer-62,14,124);
    x.fillStyle="#f4f6f5";x.beginPath();x.arc(ball.x,ball.y,8,0,Math.PI*2);x.fill();
    x.textAlign="center";x.font="bold 28px Arial";x.fillStyle="#c58cff";x.fillText(playerGames,410,34);x.fillStyle="#76948d";x.fillText(cpuGames,490,34);
    x.font="14px Arial";x.fillStyle="#9fb2ae";x.fillText(`BEST OF 3 SETS  ·  SET ${round}  ·  SETS ${playerSets}-${cpuSets}  ·  RALLY ${rally}  ·  SCORE ${score}`,450,555);
    if(!live&&!finished){x.font="16px Arial";x.fillText("PRESS A / ENTER TO SERVE",450,325)}
    if(finished){x.fillStyle="rgba(3,7,6,.9)";x.fillRect(0,205,900,150);x.fillStyle=playerSets>cpuSets?"#8df7c7":"#ff8d72";x.font="bold 28px Arial";x.fillText(playerSets>cpuSets?"ORBITAL CUP WON":"MATCH LOST",450,265);x.fillStyle="#fff";x.font="14px Arial";x.fillText("PRESS A / ENTER FOR A NEW MATCH",450,310)}
  }
  addEventListener("keydown",e=>{const k=StarcadeInput.key(e);keys.add(k);if(k==="Action"){if(finished)reset();else launch()}if(StarcadeInput.isControl(k))e.preventDefault()});
  addEventListener("keyup",e=>keys.delete(StarcadeInput.key(e)));reset();StarcadeHost.ready({title:"Orbital Paddle"});requestAnimationFrame(step);
})();
