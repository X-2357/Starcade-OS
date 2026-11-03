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
  const careerKey="starcade.razor-derby.career.v2",legacySeasonKey="starcade.razor-derby.season.v1";
  let seasonKey=careerKey;
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
    try{const goals=await RazorSeason.simulateRoundAsync(base);
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
    $("season").hidden=league;$("fixtures").hidden=!league;for(const id of ["roster","career","history"])$(id).hidden=!league||seasonState.schema!==2;
    $("overlay").hidden=state?.phase==="live";
    $("new").hidden=!state;
    $("new").textContent=confirmNew?"Confirm abandon and start new":practice?"New practice":"New exhibition";
    $("start").hidden=done&&!league||league&&RazorSeason.round(seasonState)>=RazorSeason.rounds(seasonState);
    $("start").textContent=practice?"Resume practice":state?"Resume exhibition":"Start exhibition";
    $("heading").textContent=done?(state.goals[0]>state.goals[1]?"Teal victory":state.goals[0]<state.goals[1]?"Rose victory":"Honors even"):state?(practice?"Practice paused":"Exhibition paused"):"Take the pitch";
    if(done){const t=state.stats;$("body").textContent=`Full time: ${state.goals[0]} – ${state.goals[1]}. Shots ${t.shots[0]} / ${t.shots[1]}; completed challenges ${t.steals[0]} / ${t.steals[1]}; keeper saves ${t.saves[0]} / ${t.saves[1]}. Teal / Rose. Move closer before shooting; use your marked passing outlet under pressure.`;}
    else if(state)$("body").textContent="Your match is saved. Resume when ready; the clock does not run while paused. Teal attacks right. Use X to pass or challenge, A to shoot or switch defender.";
    if(league){const r=RazorSeason.round(seasonState);$("mode").textContent=`LEAGUE · ROUND ${Math.min(RazorSeason.rounds(seasonState),r+1)}/${RazorSeason.rounds(seasonState)} · LOCAL SEASON`;
      $("new").hidden=false;$("new").textContent=confirmNew?"Confirm abandon season":"New season";
      $("heading").textContent=r===RazorSeason.rounds(seasonState)?"Season complete":`Relay Runners vs ${RazorSeason.teams[r+1]}`;
      $("body").textContent=RazorSeason.table(seasonState).map(t=>`${t.name}: ${t.points} pts, ${t.played} played, goals ${t.for}:${t.against}`).join("\n")+"\nTeal is your team. Ranked by points, goal difference and goals scored. Level records remain tied.";
      $("start").textContent=settling?"Settling round…":state?.phase==="result"&&!seasonSettled?"Retry result settlement":state&&state.phase!=="result"?"Resume league match":"Play next league match";
    }
  }
  function pause(){if(!state||state.phase!=="live")return;state.phase="paused";stop();persist();show();draw();}
  function resume(){
    if(document.hidden)return;
    if(league&&state?.phase==="result"&&!seasonSettled){finishSeasonRound();show();return;}
    if(league&&(!state||state.phase==="result")){if(RazorSeason.round(seasonState)>=RazorSeason.rounds(seasonState))return;state=RazorSeason.start(seasonState);seasonSettled=false;localTick=hostTick=0;}
    if(!state){state=E.create(crypto.getRandomValues(new Uint32Array(1))[0]);if(!practice&&!league)H.score(0);}
    if(state.phase==="result")return;
    if(!practice&&!league&&!state.matchId)state.matchId=identity();
    state.tactic=selectedTactic;state.phase="live";confirmNew=false;$("new").textContent="New exhibition";clearInput();show();last=0;acc=0;
    if(!raf)raf=requestAnimationFrame(frame);
  }
  function newMatch(){
    if(league){if(seasonState&&RazorSeason.round(seasonState)<RazorSeason.rounds(seasonState)&&!confirmNew){confirmNew=true;show();return;}stop();try{const next=RazorSeason.nextSeason(seasonState,crypto.getRandomValues(new Uint32Array(1))[0]);localStorage.setItem(careerKey,JSON.stringify(next));seasonKey=careerKey;seasonState=next;state=null;seasonSettled=false;confirmNew=false;show();draw();}catch(_){$("notice").textContent="Could not archive/start the next season. Existing career is preserved.";}return;}
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
      if(league&&seasonState.schema===2&&state.leagueLineup){const id=state.leagueLineup[p.id],athlete=seasonState.rosters.flat().find(a=>a.id===id);if(athlete){ctx.fillStyle="#e8f4f2";ctx.font="10px Arial";ctx.fillText(athlete.name,q.x,q.y+24);}}
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
  $("resetSeason").onclick=()=>{if(!$("resetSeason").dataset.confirm){$("resetSeason").dataset.confirm="1";$("resetSeason").textContent="Confirm replace damaged season";return;}localStorage.setItem(careerKey,JSON.stringify(RazorSeason.create(crypto.getRandomValues(new Uint32Array(1))[0])));seasonKey=careerKey;$("resetSeason").hidden=true;$("resetSeason").dataset.confirm="";$("season").click();};
  $("season").onclick=()=>{
    if(!loaded)return;let saved;
    try{seasonKey=localStorage.getItem(careerKey)!==null?careerKey:legacySeasonKey;const text=localStorage.getItem(seasonKey);saved=text?RazorSeason.restore(JSON.parse(text)):RazorSeason.create(crypto.getRandomValues(new Uint32Array(1))[0]);if(saved.schema===2)seasonKey=careerKey;}
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
  function panel(title,subtitle){pause();$("overlay").inert=true;document.querySelector("nav").inert=true;$("recordPanel").hidden=false;$("recordsTitle").textContent=title;$("recordsSubtitle").textContent=subtitle;$("recordActions").replaceChildren();$("recordList").replaceChildren();}
  function button(label,fn,disabled=false){const b=document.createElement("button");b.textContent=label;b.disabled=disabled;b.onclick=fn;$("recordActions").append(b);return b;}
  function detail(text){const p=document.createElement("p");p.textContent=text;$("recordList").append(p);}
  function careerChange(fn,after){try{const next=fn(seasonState);localStorage.setItem(careerKey,JSON.stringify(next));seasonState=next;after();}catch(_){detail("Change unavailable or storage write failed. Existing career retained.");}}
  let rosterTeam=0,rosterPeriod='current',rosterSlot=1;
  function rosterView(){if(!league||seasonState.schema!==2)return;panel('Rosters & player statistics','Actual tracked statistics; missing legacy player data is not reconstructed.');
    const archives=seasonState.archives.filter(a=>a.schema===2),selected=rosterPeriod==='current'?seasonState:rosterPeriod==='career'?null:archives.find(a=>a.number===rosterPeriod);
    if(rosterPeriod!=='career'&&!selected){rosterPeriod='current';return rosterView();}
    for(let t=0;t<8;t++)button(RazorSeason.teams[t],()=>{rosterTeam=t;rosterView();});
    button('Current season',()=>{rosterPeriod='current';rosterView();});button('Career totals',()=>{rosterPeriod='career';rosterView();});
    for(const a of archives)button(`Season ${a.number}`,()=>{rosterPeriod=a.number;rosterView();});
    const managing=rosterTeam===0&&(rosterPeriod==='current'||rosterPeriod==='career');
    if(managing)button(`Lineup slot ${rosterSlot} (cycle 1–5)`,()=>{rosterSlot=rosterSlot%5+1;rosterView();});
    const source=selected||seasonState,row=source.rosters[rosterTeam],lineup=source.lineups[rosterTeam];
    detail(`${RazorSeason.teams[rosterTeam]} · ${rosterPeriod==='career'?'Career':`Season ${source.number}`} · training points available ${RazorSeason.rewards(seasonState).available}`);
    for(const p of row){const v=RazorSeason.playerStats(seasonState,p.id,rosterPeriod==='career'?undefined:source.number),slot=lineup.indexOf(p.id);detail(`${p.name} [${p.id}] · ${p.role} · ${slot<0?'Reserve':slot===0?'Starting keeper':`Starting slot ${slot}`} · appearances ${v.appearances}, tracked minutes ${(v.ticks/3600).toFixed(1)} · goals ${v.goals}, assists ${v.assists}, shots ${v.shots}, passes ${v.completed}/${v.passes}, challenges ${v.steals}, saves ${v.saves}${rosterPeriod==='career'||rosterPeriod==='current'?` · career level ${RazorSeason.playerStats(seasonState,p.id).level}, XP ${RazorSeason.playerStats(seasonState,p.id).xp}, rating ${RazorSeason.rating(seasonState,p.id)}/10`:''}`);
      if(managing){if(p.id!=='t0p0')button(`Assign ${p.name} to slot ${rosterSlot}`,()=>careerChange(s=>RazorSeason.changeLineup(s,rosterSlot,p.id),rosterView),!!seasonState.match||settling);button(`Train ${p.name} (1 point)`,()=>careerChange(s=>RazorSeason.train(s,p.id),rosterView),!!seasonState.match||settling||RazorSeason.rewards(seasonState).available<1||seasonState.training.filter(t=>t.id===p.id).length>=5);}}
    $("closeRecords").focus();
  }
  let rewardPage=0;
  function rewardsView(){if(!league||seasonState.schema!==2)return;panel('Career rewards','League training points and athlete XP are fictional; no Starfield currency or inventory payout.');const v=RazorSeason.rewards(seasonState);detail(`Earned ${v.earned} · Spent ${v.spent} · Available ${v.available}`);detail(v.honours.join(' · ')||'No completed season honours yet.');for(const t of RazorSeason.careerTable(seasonState))detail(`${t.name}: career ${t.played} matches, W/D/L ${t.wins}/${t.draws}/${t.losses}, goals ${t.for}:${t.against}`);button('Newer rewards',()=>{rewardPage=Math.max(0,rewardPage-1);rewardsView();},rewardPage===0);button('Older rewards',()=>{rewardPage++;rewardsView();},(rewardPage+1)*10>=v.ledger.length);for(const e of v.ledger.slice().reverse().slice(rewardPage*10,rewardPage*10+10))detail(`${e.text}: +${e.points} training points [${e.id}]`);detail('Spend points in your roster between matches. XP is earned from appearances and recorded actions; levels and training improve league-only speed and shot accuracy.');$("closeRecords").focus();}
  let historyIndex=0;
  function historyView(){if(!league||seasonState.schema!==2)return;const list=seasonState.archives;panel('Previous seasons','Archived actual fixtures and final rosters; incomplete seasons are labeled.');if(!list.length){detail('No previous seasons archived yet.');return;}historyIndex=Math.max(0,Math.min(historyIndex,list.length-1));const a=list[list.length-1-historyIndex];button('Newer season',()=>{historyIndex--;historyView();},historyIndex===0);button('Older season',()=>{historyIndex++;historyView();},historyIndex===list.length-1);detail(a.legacy?'Legacy four-team season: team results known, player statistics unavailable.':`Season ${a.number} · ${a.results.length===28?'Complete':'Abandoned / incomplete'} · ${a.results.length}/28 fixtures`);for(const t of RazorSeason.table(a))detail(`${t.name}: ${t.points} points, ${t.played} played, goals ${t.for}:${t.against}`);for(const m of a.results)detail(`Round ${m.round+1}: ${RazorSeason.teams[m.a]} ${m.goals.join(' : ')} ${RazorSeason.teams[m.b]}`);if(!a.legacy)for(const row of a.rosters)detail(row.map(p=>`${p.name} [${p.id}]`).join(' · '));$("closeRecords").focus();}
  $("roster").onclick=rosterView;$("career").onclick=rewardsView;$("history").onclick=historyView;
  $("fixtures").onclick=()=>{if(!league)return;pause();$("overlay").inert=true;document.querySelector("nav").inert=true;$("recordPanel").hidden=false;$("recordsTitle").textContent="Season fixtures";$("recordsSubtitle").textContent="All teams play each other once";$("recordActions").replaceChildren();$("recordList").replaceChildren();RazorSeason.fixturesFor(seasonState).forEach((round,r)=>round.forEach(([a,b])=>{const result=seasonState.results.find(m=>m.round===r&&m.a===a&&m.b===b);const p=document.createElement("p");p.textContent=`Round ${r+1}: ${RazorSeason.teams[a]} ${result?result.goals.join(" : "):"vs"} ${RazorSeason.teams[b]}${result?"":" — scheduled"}`;$("recordList").append(p);}));$("closeRecords").focus();};
  $("records").onclick=()=>{$("recordsTitle").textContent="Latest exhibition records";$("recordsSubtitle").textContent="Local completion dates · rules revision 1 · latest ten matches";pause();$("overlay").inert=true;document.querySelector("nav").inert=true;$("recordPanel").hidden=false;$("recordActions").replaceChildren();$("recordList").replaceChildren();try{const entries=RazorRecords.read(localStorage.getItem(recordsKey));if(!entries.length)$("recordList").textContent="No completed exhibitions recorded yet.";for(const e of entries.slice().reverse()){const p=document.createElement("p");p.textContent=`${new Date(e.ended*1000).toLocaleString()} · Teal ${e.goals[0]} : ${e.goals[1]} Rose · shots ${e.stats.shots.join("/")} · challenges ${e.stats.steals.join("/")} · keeper saves ${e.stats.saves.join("/")}${e.tactic?` · tactic ${tacticNames[e.tactic]}`:""}`;$("recordList").append(p);}}catch(_){$("recordList").textContent="Stored records are unavailable or from an unsupported version.";}$("closeRecords").focus();};
  $("closeRecords").onclick=()=>{$("recordPanel").hidden=true;$("overlay").inert=false;document.querySelector("nav").inert=false;show();$("records").focus();};
  $("tactic").onclick=()=>{if(settling||state?.phase==="live")return;selectedTactic=tactics[(tactics.indexOf(selectedTactic)+1)%tactics.length];if(state&&state.phase!=="result"){state.tactic=selectedTactic;persist();}show();};
  $("start").onclick=resume;$("new").onclick=newMatch;$("exit").onclick=leave;$("return").onclick=leave;
  $("pause").onclick=()=>state?.phase==="live"?pause():resume();
  $("cycle").onclick=cycleTarget;
  $("pass").onclick=()=>{if(state?.phase==="live")action.pass=true;};$("shoot").onclick=()=>{if(state?.phase==="live")action.shoot=true;};
  addEventListener("keydown",e=>{
    const k=e.key.length===1?e.key.toLowerCase():e.key;
    if(!$("recordPanel").hidden){
      if(["Escape","Enter"," ","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(k)){e.preventDefault();e.stopImmediatePropagation();const buttons=[...$("recordPanel").querySelectorAll("button:not(:disabled)")];const i=buttons.indexOf(document.activeElement);if(k==="Escape")$("closeRecords").click();else if(k==="Enter"||k===" ")(buttons[i]||buttons[0]).click();else buttons[(i+(["ArrowUp","ArrowLeft"].includes(k)?-1:1)+buttons.length)%buttons.length].focus();}return;
    }
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
