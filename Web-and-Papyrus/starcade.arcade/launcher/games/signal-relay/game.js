"use strict";
(()=>{
  const c=game,x=c.getContext("2d"),colors=["#7dc7ff","#ff9fc8","#8df7c7","#f2c879"],buttons={ArrowUp:0,ArrowRight:1,ArrowDown:2,ArrowLeft:3};
  let sequence=[],position=0,lit=-1,state="idle",score=0,lives=3,round=0,timer=null,finished=false;
  function draw(){x.fillStyle="#060b0a";x.fillRect(0,0,760,560);const p=[[380,115],[555,280],[380,445],[205,280]];p.forEach((v,i)=>{x.beginPath();x.arc(v[0],v[1],86,0,Math.PI*2);x.fillStyle=i===lit?colors[i]:"#172522";x.fill();x.strokeStyle=colors[i];x.lineWidth=4;x.stroke()});x.textAlign="center";x.fillStyle="#dce8e5";x.font="20px Arial";x.fillText(finished?(round>=12?"RELAY MASTERED - PRESS A TO RESTART":"RELAY LOST - PRESS A TO RESTART"):state==="idle"?"PRESS A / ENTER TO INITIALIZE":state==="show"?"RECEIVING SIGNAL":"REPEAT SEQUENCE",380,282);x.font="14px Arial";x.fillStyle="#829792";x.fillText(`ROUND ${round}/12   SIGNALS ${sequence.length}   LIVES ${lives}   SCORE ${score}`,380,315)}
  function flash(i,ms){lit=i;draw();setTimeout(()=>{lit=-1;draw()},ms)}
  function show(){state="show";position=0;let i=0;const pace=Math.max(230,560-round*18);clearInterval(timer);timer=setInterval(()=>{if(i>=sequence.length){clearInterval(timer);setTimeout(()=>{state="input";draw()},Math.max(150,pace/2));return}flash(sequence[i++],Math.max(130,pace*.55))},pace)}
  function next(){round++;sequence.push(Math.floor(Math.random()*4));if(round>8&&round%3===0)sequence.push(Math.floor(Math.random()*4));show()}
  function reset(){clearInterval(timer);sequence=[];score=0;lives=3;round=0;finished=false;StarcadeHost.score(0);next()}
  function fail(){lives--;if(lives<=0){finished=true;state="idle";StarcadeHost.finish(score);draw()}else{score=Math.max(0,score-100*round);StarcadeHost.score(score);state="show";setTimeout(show,650)}}
  function input(i){if(state!=="input"||finished)return;flash(i,130);if(i!==sequence[position]){fail();return}position++;if(position===sequence.length){score+=sequence.length*100+lives*25;StarcadeHost.score(score);if(round===10)StarcadeHost.achievement("signal-relay-ten");if(round>=12){finished=true;state="idle";StarcadeHost.finish(score);draw()}else{state="show";setTimeout(next,500)}}}
  addEventListener("keydown",e=>{const k=StarcadeInput.key(e);if(k==="Action"&&(state==="idle"||finished))reset();else if(buttons[k]!==undefined)input(buttons[k]);if(StarcadeInput.isControl(k))e.preventDefault()});draw();StarcadeHost.ready({title:"Signal Relay"});
})();
