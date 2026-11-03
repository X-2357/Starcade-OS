"use strict";
(() => {
  const E=RazorDerby,$=id=>document.getElementById(id),canvas=$("pitch"),ctx=canvas.getContext("2d");
  let session=parent===window?0:null;
  const send=(type,value)=>parent.postMessage({channel:"starcade",game:"razor-derby",session,type,value},"*");
  const H={save:value=>send("save",value),score:value=>send("score",value),finish:value=>send("finish",value),exit:()=>send("exit")};
  const key="starcade.razor-derby.match.v1",held=new Set();
  let selectedTactic="balanced";
  const tactics=["balanced","wide","press"],tacticNames={balanced:"Balanced",wide:"Wide outlets",press:"High press"},tacticHelp={balanced:"Two defenders press; support keeps balanced lanes.",wide:"Support runners offer wider passing outlets.",press:"Three defenders press; fewer hold their shape."};
  let league=false,seasonState=null,seasonSettled=false,settling=false;
  const seasonKey="starcade.razor-derby.season.v1";
  let practice=false,selectedTarget=-1,targetCarrier=-1;
  const recordsKey="starcade.razor-derby.records.v1";
  function identity(){return [...crypto.getRandomValues(new Uint32Array(3))].map(n=>n.toString(16).padStart(8,"0")).join("");}
  function recordResult(){if(practice||league||!state.matchId)return;try{const entries=RazorRecords.read(localStorage.getItem(recordsKey));const entry={id:state.matchId,rules:1,tactic:state.tactic||"balanced",ended:Math.floor(Date.now()/1000),goals:state.goals,stats:state.stats};localStorage.setItem(recordsKey,JSON.stringify({schema:1,entries:RazorRecords.append(entries,entry)}));}catch(_){$("notice").textContent="Match records unavailable; this result is still shown here.";}}
  const practiceKey="starcade.razor-derby.practice.v1";
  let state=null,loaded=false,raf=0,last=0,acc=0,action={},confirmNew=false,localTick=0,hostTick=0;
  function persist(native=true){
    if(league){if(!seasonState)return;seasonState.match=seasonSettled?null:state;try{localStorage.setItem(seasonKey,JSON.stringify(seasonState));}catch(_){$("notice").textContent="Season checkpoint unavailable. Keep this match open.";}return;}
    if(!state)return;
    try{localStorage.setItem(practice?practiceKey:key,JSON.stringify(state));}catch(_){$("notice").textContent=practice?"Practice saving unavailable; keep this session open to finish it.":"Local saving unavailable. Use Return to checkpoint through the arcade.";}
    if(native&&!practice)H.save(state);
  }
  function clearInput(){held.clear();action={};selectedTarget=-1;targetCarrier=-1;}
  function receiver(){
    if(!state||state.ball.owner!==state.control){selectedTarget=-1;targetCarrier=-1;return -1;}
    if(targetCarrier!==state.control){selectedTarget=-1;targetCarrier=state.control;}
    return selectedTarget>=0?selectedTarget:E.target(state,state.control);
  }
  function cycleTarget(){
    if(state?.phase!=="live"||state.ball.owner!==state.control)return;
    const current=receiver(),eligible=state.players.filter(p=>p.id<6&&p.id!==state.control&&p.id%6!==0).map(p=>p.id);
    selectedTarget=eligible[(eligible.indexOf(current)+1)%eligible.length];draw();
  }
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;acc=0;clearInput();}
  async function finishSeasonRound(){
    if(settling)return;settling=true;
    const base=seasonState,completed=state,r=RazorSeason.round(base);persist();
    try{const goals=await RazorSeason.simulateAsync((base.seed+r*7919)>>>0);
      if(!league||seasonState!==base||state!==completed)return;
      const next=RazorSeason.settle(base,completed,r,goals);localStorage.setItem(seasonKey,JSON.stringify(next));seasonState=next;seasonSettled=true;$("notice").textContent=`Round ${r+1} saved.`;
    }catch(_){$("notice").textContent="Season result could not be saved. Resume retries settlement.";}
    finally{settling=false;show();}
  }
  function show(){
    const done=state?.phase==="result";
    $("tactic").disabled=settling;$("tactic").textContent=`Tactic: ${tacticNames[selectedTactic]}`;$("tacticHelp").textContent=tacticHelp[selectedTactic];
    $("start").disabled=settling;$("new").disabled=settling;$("practice").disabled=settling;
    $("mode").textContent=practice?"PRACTICE — NO SCORES OR REWARDS":"STARCADE EXHIBITION RULES";
    $("practice").hidden=practice;
    $("season").hidden=league;$("fixtures").hidden=!league;
    $("overlay").hidden=state?.phase==="live";
    $("new").hidden=!state;
    $("new").textContent=confirmNew?"Confirm abandon and start new":practice?"New practice":"New exhibition";
    $("start").hidden=done&&!league||league&&RazorSeason.round(seasonState)>=3;
    $("start").textContent=practice?"Resume practice":state?"Resume exhibition":"Start exhibition";
    $("heading").textContent=done?(state.goals[0]>state.goals[1]?"Teal victory":state.goals[0]<state.goals[1]?"Rose victory":"Honors even"):state?(practice?"Practice paused":"Exhibition paused"):"Take the pitch";
    if(done){const t=state.stats;$("body").textContent=`Full time: ${state.goals[0]} – ${state.goals[1]}. Shots ${t.shots[0]} / ${t.shots[1]}; completed challenges ${t.steals[0]} / ${t.steals[1]}; keeper saves ${t.saves[0]} / ${t.saves[1]}. Teal / Rose. Move closer before shooting; use your marked passing outlet under pressure.`;}
    else if(state)$("body").textContent="Your match is saved. Resume when ready; the clock does not run while paused. Teal attacks right. Use X to pass or challenge, A to shoot or switch defender.";
    if(league){const r=RazorSeason.round(seasonState);$("mode").textContent=`LEAGUE · ROUND ${Math.min(3,r+1)}/3 · LOCAL SEASON`;
      $("new").hidden=false;$("new").textContent=confirmNew?"Confirm abandon season":"New season";
      $("heading").textContent=r===3?"Season complete":`Relay Runners vs ${RazorSeason.teams[r+1]}`;
      $("body").textContent=RazorSeason.table(seasonState).map(t=>`${t.name}: ${t.points} pts, ${t.played} played, goals ${t.for}:${t.against}`).join("\n")+"\nTeal is your team. Ranked by points, goal difference and goals scored. Level records remain tied.";
      $("start").textContent=settling?"Settling round…":state?.phase==="result"&&!seasonSettled?"Retry result settlement":state&&state.phase!=="result"?"Resume league match":"Play next league match";
    }
  }
  function pause(){if(!state||state.phase!=="live")return;state.phase="paused";stop();persist();show();draw();}
  function resume(){
    if(document.hidden)return;
    if(league&&state?.phase==="result"&&!seasonSettled){finishSeasonRound();show();return;}
    if(league&&(!state||state.phase==="result")){if(RazorSeason.round(seasonState)>=3)return;state=RazorSeason.start(seasonState);seasonSettled=false;localTick=hostTick=0;}
    if(!state){state=E.create(crypto.getRandomValues(new Uint32Array(1))[0]);if(!practice&&!league)H.score(0);}
    if(state.phase==="result")return;
    if(!practice&&!league&&!state.matchId)state.matchId=identity();
    state.tactic=selectedTactic;state.phase="live";confirmNew=false;$("new").textContent="New exhibition";clearInput();show();last=0;acc=0;
    if(!raf)raf=requestAnimationFrame(frame);
  }
  function newMatch(){
    if(league){if(seasonState&&RazorSeason.round(seasonState)<3&&!confirmNew){confirmNew=true;show();return;}stop();seasonState=RazorSeason.create(crypto.getRandomValues(new Uint32Array(1))[0]);state=null;seasonSettled=false;confirmNew=false;persist();show();draw();return;}
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
    const target=receiver();
    $("target").textContent=target>=0?`Pass target: runner ${target%6+1}${selectedTarget<0?" (auto)":" (selected)"}`:"Pass target: gain possession";
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
      const input={x:Number(held.has("ArrowRight")||held.has("d"))-Number(held.has("ArrowLeft")||held.has("a")),y:Number(held.has("ArrowDown")||held.has("s"))-Number(held.has("ArrowUp")||held.has("w")),sprint:held.has("Shift"),passTarget:receiver(),...action};
      E.step(state,input);action={};acc-=1/60;
    }
    if(state.tick-localTick>=120){persist(false);localTick=state.tick;}
    if(state.tick-hostTick>=900||oldGoals!==state.goals.join(":")){persist();hostTick=state.tick;}
    draw();
    if(state.phase==="result"){stop();if(league){finishSeasonRound();show();return;}recordResult();persist();if(!practice)H.finish(state.goals[0]*1000+(state.goals[0]>=state.goals[1]?500:0));show();return;}
    raf=requestAnimationFrame(frame);
  }
  function load(value){
    if(loaded)return;loaded=true;
    try{let saved=value;if(!saved){try{saved=JSON.parse(localStorage.getItem(key)||"null");}catch(_){throw Error("Unreadable save");}}
      if(saved){state=E.restore(saved);selectedTactic=state.tactic||"balanced";if(state.phase==="live")state.phase="paused";localTick=hostTick=state.tick;}
    }catch(_){state=null;$("notice").textContent="The saved exhibition could not be restored. Start a fresh match.";}
    show();draw();
  }
  $("resetSeason").onclick=()=>{if(!$("resetSeason").dataset.confirm){$("resetSeason").dataset.confirm="1";$("resetSeason").textContent="Confirm replace damaged season";return;}localStorage.removeItem(seasonKey);$("resetSeason").hidden=true;$("resetSeason").dataset.confirm="";$("season").click();};
  $("season").onclick=()=>{
    if(!loaded)return;let saved;
    try{const text=localStorage.getItem(seasonKey);saved=text?RazorSeason.restore(JSON.parse(text)):RazorSeason.create(crypto.getRandomValues(new Uint32Array(1))[0]);}
    catch(_){$("notice").textContent="Stored season is unsupported or damaged; it has been preserved.";$("resetSeason").hidden=false;return;}
    pause();stop();league=true;practice=false;seasonState=saved;state=saved.match;seasonSettled=!state;confirmNew=false;
    selectedTactic=state?.tactic||"balanced";if(state?.phase==="live")state.phase="paused";if(state)localTick=hostTick=state.tick;show();draw();
  };
  $("practice").onclick=()=>{
    if(!loaded)return;
    pause();stop();league=false;practice=true;state=null;localTick=hostTick=0;
    try{const saved=JSON.parse(localStorage.getItem(practiceKey)||"null");if(saved){state=E.restore(saved);if(state.phase==="result")state=null;else state.phase="paused";}}catch(_){$("notice").textContent="Practice save unavailable; a fresh drill is ready.";}
    if(!state)state=E.create(crypto.getRandomValues(new Uint32Array(1))[0]);
    selectedTactic=state.tactic||"balanced";state.phase="paused";show();draw();
  };
  $("fixtures").onclick=()=>{if(!league)return;pause();$("overlay").inert=true;document.querySelector("nav").inert=true;$("recordPanel").hidden=false;$("recordsTitle").textContent="Season fixtures";$("recordsSubtitle").textContent="Three rounds · all teams play each other once";$("recordList").replaceChildren();RazorSeason.fixtures.forEach((round,r)=>round.forEach(([a,b])=>{const result=seasonState.results.find(m=>m.round===r&&m.a===a&&m.b===b);const p=document.createElement("p");p.textContent=`Round ${r+1}: ${RazorSeason.teams[a]} ${result?result.goals.join(" : "):"vs"} ${RazorSeason.teams[b]}${result?"":" — scheduled"}`;$("recordList").append(p);}));$("closeRecords").focus();};
  $("records").onclick=()=>{$("recordsTitle").textContent="Latest exhibition records";$("recordsSubtitle").textContent="Local completion dates · rules revision 1 · latest ten matches";pause();$("overlay").inert=true;document.querySelector("nav").inert=true;$("recordPanel").hidden=false;$("recordList").replaceChildren();try{const entries=RazorRecords.read(localStorage.getItem(recordsKey));if(!entries.length)$("recordList").textContent="No completed exhibitions recorded yet.";for(const e of entries.slice().reverse()){const p=document.createElement("p");p.textContent=`${new Date(e.ended*1000).toLocaleString()} · Teal ${e.goals[0]} : ${e.goals[1]} Rose · shots ${e.stats.shots.join("/")} · challenges ${e.stats.steals.join("/")} · keeper saves ${e.stats.saves.join("/")}${e.tactic?` · tactic ${tacticNames[e.tactic]}`:""}`;$("recordList").append(p);}}catch(_){$("recordList").textContent="Stored records are unavailable or from an unsupported version.";}$("closeRecords").focus();};
  $("closeRecords").onclick=()=>{$("recordPanel").hidden=true;$("overlay").inert=false;document.querySelector("nav").inert=false;show();$("records").focus();};
  $("tactic").onclick=()=>{if(settling||state?.phase==="live")return;selectedTactic=tactics[(tactics.indexOf(selectedTactic)+1)%tactics.length];if(state&&state.phase!=="result"){state.tactic=selectedTactic;persist();}show();};
  $("start").onclick=resume;$("new").onclick=newMatch;$("exit").onclick=leave;$("return").onclick=leave;
  $("pause").onclick=()=>state?.phase==="live"?pause():resume();
  $("cycle").onclick=cycleTarget;
  $("pass").onclick=()=>{if(state?.phase==="live")action.pass=true;};$("shoot").onclick=()=>{if(state?.phase==="live")action.shoot=true;};
  addEventListener("keydown",e=>{
    const k=e.key.length===1?e.key.toLowerCase():e.key;
    if(!$("recordPanel").hidden){e.preventDefault();if(k==="Escape"||k==="Enter"||k===" "){e.preventDefault();e.stopImmediatePropagation();$("closeRecords").click();}return;}
    if(k==="c"||k==="Control"){e.preventDefault();if(!e.repeat)cycleTarget();return;}
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
