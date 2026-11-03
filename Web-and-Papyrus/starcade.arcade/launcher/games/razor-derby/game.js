"use strict";
(() => {
  const E=RazorDerby,$=id=>document.getElementById(id),canvas=$("pitch"),ctx=canvas.getContext("2d");
  let session=parent===window?0:null;
  const send=(type,value)=>parent.postMessage({channel:"starcade",game:"razor-derby",session,type,value},"*");
  const H={save:value=>send("save",value),score:value=>send("score",value),finish:value=>send("finish",value),exit:()=>send("exit")};
  const key="starcade.razor-derby.match.v1",held=new Set();
  let state=null,loaded=false,raf=0,last=0,acc=0,action={},confirmNew=false,localTick=0,hostTick=0;
  function persist(native=true){
    if(!state)return;
    try{localStorage.setItem(key,JSON.stringify(state));}catch(_){$("notice").textContent="Local saving unavailable. Use Return to checkpoint through the arcade.";}
    if(native)H.save(state);
  }
  function clearInput(){held.clear();action={};}
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;acc=0;clearInput();}
  function show(){
    const done=state?.phase==="result";
    $("overlay").hidden=state?.phase==="live";
    $("new").hidden=!state;
    $("start").hidden=done;
    $("start").textContent=state?"Resume exhibition":"Start exhibition";
    $("heading").textContent=done?(state.goals[0]>state.goals[1]?"Teal victory":state.goals[0]<state.goals[1]?"Rose victory":"Honors even"):state?"Exhibition paused":"Take the pitch";
    if(done){const t=state.stats;$("body").textContent=`Full time: ${state.goals[0]} – ${state.goals[1]}. Shots ${t.shots[0]} / ${t.shots[1]}; completed challenges ${t.steals[0]} / ${t.steals[1]}; keeper saves ${t.saves[0]} / ${t.saves[1]}. Teal / Rose. Move closer before shooting; use your marked passing outlet under pressure.`;}
    else if(state)$("body").textContent="Your match is saved. Resume when ready; the clock does not run while paused. Teal attacks right. Use X to pass or challenge, A to shoot or switch defender.";
  }
  function pause(){if(!state||state.phase!=="live")return;state.phase="paused";stop();persist();show();draw();}
  function resume(){
    if(document.hidden)return;
    if(!state){state=E.create(crypto.getRandomValues(new Uint32Array(1))[0]);H.score(0);}
    if(state.phase==="result")return;
    state.phase="live";confirmNew=false;$("new").textContent="New exhibition";clearInput();show();last=0;acc=0;
    if(!raf)raf=requestAnimationFrame(frame);
  }
  function newMatch(){
    if(state&&state.phase!=="result"&&!confirmNew){confirmNew=true;$("new").textContent="Confirm abandon and start new";return;}
    stop();state=null;confirmNew=false;localTick=0;hostTick=0;resume();persist();
  }
  function leave(){if(state?.phase==="live")state.phase="paused";stop();persist();H.exit();}
  const project=(x,y)=>({x:95+x*10.1+(y-30)*.6,y:90+y*8.4});
  function line(x1,y1,x2,y2,color,width=1){const a=project(x1,y1),b=project(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  function draw(){
    ctx.clearRect(0,0,1200,700);ctx.fillStyle="#081922";ctx.fillRect(0,0,1200,700);
    ctx.fillStyle="#12313b";const a=project(0,0),b=project(100,0),c=project(100,60),d=project(0,60);
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fill();
    for(let x=0;x<=100;x+=10)line(x,0,x,60,"#20424b");for(let y=0;y<=60;y+=10)line(0,y,100,y,"#20424b");
    line(0,0,100,0,"#72a9b1",2);line(0,60,100,60,"#72a9b1",2);line(0,0,0,60,"#72a9b1",2);line(100,0,100,60,"#72a9b1",2);line(50,0,50,60,"#729fa7",2);
    line(0,21,0,39,"#8df7c7",9);line(100,21,100,39,"#ff94b5",9);
    ctx.font="14px Arial";ctx.textAlign="center";ctx.fillStyle="#6d9da7";ctx.fillText("TEAL  →",315,650);ctx.fillText("←  ROSE",885,650);
    if(!state)return;
    const target=state.ball.owner===state.control?E.target(state,state.control):-1;
    for(const p of state.players){const q=project(p.x,p.y),side=E.team(p.id);ctx.fillStyle="#0007";ctx.beginPath();ctx.ellipse(q.x,q.y+7,15,7,0,0,Math.PI*2);ctx.fill();
      if(p.id===state.control){ctx.strokeStyle="#ffe59a";ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(q.x,q.y+5,20,11,0,0,Math.PI*2);ctx.stroke();}
      ctx.fillStyle=side?"#e86b94":"#6ee1c6";ctx.beginPath();ctx.arc(q.x,q.y-8,12,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#d4ffff";ctx.lineWidth=1;ctx.stroke();
      ctx.fillStyle="#05151b";ctx.font="bold 12px Arial";ctx.fillText(p.id%6===0?"K":String(p.id%6+1),q.x,q.y-4);
      if(p.id===target){ctx.fillStyle="#ffe59a";ctx.beginPath();ctx.moveTo(q.x,q.y-40);ctx.lineTo(q.x+7,q.y-32);ctx.lineTo(q.x,q.y-24);ctx.lineTo(q.x-7,q.y-32);ctx.closePath();ctx.fill();}
    }
    const ball=project(state.ball.x,state.ball.y);ctx.fillStyle="#fff4bc";ctx.shadowColor="#ffd36e";ctx.shadowBlur=14;ctx.beginPath();ctx.arc(ball.x,ball.y-18,6,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    $("score").textContent=`TEAL ${state.goals[0]} : ${state.goals[1]} ROSE`;
    const seconds=Math.ceil((E.LIMIT-state.tick)/60);$("clock").textContent=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
    $("event").textContent=state.event;$("possession").textContent=`${state.possession?"Rose":"Teal"} possession ${Math.ceil(state.shotClock/60)}s`;
    $("energy").textContent=`Sprint ${Math.round(state.players[state.control].energy)}%`;
  }
  function frame(time){
    raf=0;if(!state||state.phase!=="live"||document.hidden)return;
    if(last)acc+=Math.min((time-last)/1000,.1);last=time;
    const oldGoals=state.goals.join(":");
    while(acc>=1/60&&state.phase==="live"){
      const input={x:Number(held.has("ArrowRight")||held.has("d"))-Number(held.has("ArrowLeft")||held.has("a")),y:Number(held.has("ArrowDown")||held.has("s"))-Number(held.has("ArrowUp")||held.has("w")),sprint:held.has("Shift"),...action};
      E.step(state,input);action={};acc-=1/60;
    }
    if(state.tick-localTick>=120){persist(false);localTick=state.tick;}
    if(state.tick-hostTick>=900||oldGoals!==state.goals.join(":")){persist();hostTick=state.tick;}
    draw();
    if(state.phase==="result"){stop();persist();H.finish(state.goals[0]*1000+(state.goals[0]>=state.goals[1]?500:0));show();return;}
    raf=requestAnimationFrame(frame);
  }
  function load(value){
    if(loaded)return;loaded=true;
    try{let saved=value;if(!saved){try{saved=JSON.parse(localStorage.getItem(key)||"null");}catch(_){throw Error("Unreadable save");}}
      if(saved){state=E.restore(saved);if(state.phase==="live")state.phase="paused";localTick=hostTick=state.tick;}
    }catch(_){state=null;$("notice").textContent="The saved exhibition could not be restored. Start a fresh match.";}
    show();draw();
  }
  $("start").onclick=resume;$("new").onclick=newMatch;$("exit").onclick=leave;$("return").onclick=leave;
  $("pause").onclick=()=>state?.phase==="live"?pause():resume();
  $("pass").onclick=()=>{if(state?.phase==="live")action.pass=true;};$("shoot").onclick=()=>{if(state?.phase==="live")action.shoot=true;};
  addEventListener("keydown",e=>{
    const k=e.key.length===1?e.key.toLowerCase():e.key;
    if(k==="Escape"){e.preventDefault();e.stopImmediatePropagation();leave();return;}
    if(["y","p"].includes(k)){e.preventDefault();if(!e.repeat)state?.phase==="live"?pause():resume();return;}
    if(k==="Enter"||k===" "){
      e.preventDefault();if(e.repeat)return;
      if(state?.phase==="live")action.shoot=true;
      else if(document.activeElement?.tagName==="BUTTON")document.activeElement.click();else resume();return;
    }
    if(state?.phase!=="live")return;
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","w","a","s","d","Shift","x"].includes(k)){e.preventDefault();held.add(k);if(k==="x"&&!e.repeat)action.pass=true;}
  },true);
  addEventListener("keyup",e=>held.delete(e.key.length===1?e.key.toLowerCase():e.key));
  addEventListener("blur",pause);document.addEventListener("visibilitychange",()=>{if(document.hidden)pause();});
  addEventListener("message",e=>{
    if(e.source!==parent||e.data?.channel!=="starcade")return;
    if(e.data.type==="load"){if(loaded)return;session=e.data.session;load(e.data.value);}
    if(e.data.type==="prepareClose"&&e.data.session===session)leave();
  });
  addEventListener("pagehide",()=>{if(state?.phase==="live")state.phase="paused";stop();persist(false);});
  if(parent===window)load(null);send("ready",{title:"Razor Derby"});draw();
})();
