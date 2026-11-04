"use strict";
(() => {
  const E=RazorDerby,$=id=>document.getElementById(id),canvas=$("pitch"),ctx=canvas.getContext("2d");
  let session=parent===window?0:null;
  const send=(type,value)=>parent.postMessage({channel:"starcade",game:"razor-derby",session,type,value},"*");
  const H={save:value=>send("save",value),score:value=>send("score",value),finish:value=>send("finish",value),exit:()=>send("exit")};
  const key="starcade.razor-derby.match.v1",held=new Set();
  let selectedTactic="balanced",selectedShotAim="auto";
  const tactics=["balanced","wide","press"],tacticNames={balanced:"Balanced",wide:"Wide outlets",press:"High press"},tacticHelp={balanced:"Two defenders press; support keeps balanced lanes.",wide:"Support runners offer wider passing outlets.",press:"Three defenders press; fewer hold their shape."};
  let league=false,seasonState=null,seasonSettled=false,settling=false;
  const careerKey="starcade.razor-derby.career.v2",legacySeasonKey="starcade.razor-derby.season.v1";
  let seasonKey=careerKey;
  let practice=false,selectedTarget=-1,targetCarrier=-1;
  const recordsKey="starcade.razor-derby.records.v1";
  const coachKey='starcade.razor-derby.coach.v1';let coachEnabled=true;
  try{coachEnabled=localStorage.getItem(coachKey)!=='off';}catch(_){}
  function coachDisplay(){const enabled=coachEnabled&&!!state;$('coachHud').hidden=!enabled;document.body.classList.toggle('coach-on',enabled&&state.phase==='live');$('coachToggle').textContent=`Live coach: ${coachEnabled?'on':'off'}`;$('coachToggle').setAttribute('aria-pressed',String(coachEnabled));if(!enabled)return null;const v=RazorCoach.model(state,receiver());$('coachAction').textContent=v.action;$('coachHint').textContent=v.hint;$('coachLane').textContent=v.lane+' · coverage can change as players move';$('coachLane').classList.toggle('covered',v.covered===true);$('coachRange').textContent=v.rangeLabel+' · '+v.pressure;$('coachPossessionLabel').textContent=v.possession;$('possessionMeter').value=v.seconds;$('sprintMeter').value=v.energy;return v;}
  function applyShotAim(){if(!state||state.phase==='result')return;if(selectedShotAim==='auto')delete state.shotAim;else state.shotAim=selectedShotAim;}
  function aimDisplay(){$('shotAim').textContent=`Aim: ${RazorAim.labels[selectedShotAim]} (V / RS)`;$('shotAim').disabled=!loaded||settling||state?.phase==='result';const p=state?.phase!=='result'?RazorAim.point(state,selectedShotAim):null;$('aimHint').textContent=state?.phase==='result'?'Shot placement locked at full time':`Shot: ${RazorAim.labels[selectedShotAim]} · ${p?'nominal guide; spread still applies':'gain possession to aim'}`;return p;}
  function cycleShotAim(){if(!loaded||settling||state?.phase==='result'||!$('recordPanel').hidden)return;selectedShotAim=RazorAim.next(selectedShotAim);applyShotAim();if(state)persist(state.phase!=='live');aimDisplay();draw();}
  function identity(){return [...crypto.getRandomValues(new Uint32Array(3))].map(n=>n.toString(16).padStart(8,"0")).join("");}
  function recordResult(){if(practice||league||!state.matchId)return;try{const entries=RazorRecords.read(localStorage.getItem(recordsKey));const entry={id:state.matchId,rules:1,tactic:state.tactic||"balanced",ended:Math.floor(Date.now()/1000),goals:state.goals,stats:state.stats};localStorage.setItem(recordsKey,JSON.stringify({schema:1,entries:RazorRecords.append(entries,entry)}));}catch(_){$("notice").textContent="Match records unavailable; this result is still shown here.";}}
  const practiceKey="starcade.razor-derby.practice.v1";
  let practiceKind=null,practiceStorageKey=practiceKey;
  let state=null,loaded=false,raf=0,last=0,acc=0,action={},confirmNew=false,localTick=0,hostTick=0;
  function persist(native=true){
    if(league){if(!seasonState)return;seasonState.match=seasonSettled?null:state;try{localStorage.setItem(seasonKey,JSON.stringify(seasonState));}catch(_){$("notice").textContent="Season checkpoint unavailable. Keep this match open.";}return;}
    if(!state)return;
    try{localStorage.setItem(practice?practiceStorageKey:key,JSON.stringify(state));}catch(_){$("notice").textContent=practice?"Practice saving unavailable; keep this session open to finish it.":"Local saving unavailable. Use Return to checkpoint through the arcade.";}
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
    $("start").disabled=settling;$("new").disabled=settling;$("practice").disabled=settling;$("drills").disabled=settling;
    $("mode").textContent=practice?"PRACTICE — NO SCORES OR REWARDS":"STARCADE EXHIBITION RULES";
    $("practice").hidden=practice&&!practiceKind;
    $("season").hidden=league;$("fixtures").hidden=!league;for(const id of ["roster","career","history","leaders"])$(id).hidden=!league||seasonState.schema!==2;
    $("overlay").hidden=state?.phase==="live";
    renderLeagueSummary();$("practiceReview").hidden=!practice;coachDisplay();drillDisplay();aimDisplay();$("matchReport").hidden=!state&&!(league&&seasonState.results.some(m=>m.a===0||m.b===0));
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
      $("body").textContent="You play as Relay Runners (teal). Ranked by points, goal difference and goals scored; level records share placing. Select a menu below, or play the next match.";
      $("start").textContent=settling?"Settling round…":state?.phase==="result"&&!seasonSettled?"Retry result settlement":state&&state.phase!=="result"?"Resume league match":"Play next league match";
    }
  }
  function pause(){if(!state||state.phase!=="live")return;state.phase="paused";stop();persist();show();draw();}
  function resume(){
    if(!loaded||document.hidden)return;
    if(league&&state?.phase==="result"&&!seasonSettled){finishSeasonRound();show();return;}
    if(league&&(!state||state.phase==="result")){if(RazorSeason.round(seasonState)>=RazorSeason.rounds(seasonState))return;const nextFixture=state?.phase==='result';state=RazorSeason.start(seasonState);if(nextFixture)selectedShotAim='auto';seasonSettled=false;localTick=hostTick=0;}
    if(!state){const seed=crypto.getRandomValues(new Uint32Array(1))[0];state=practice&&practiceKind?RazorPractice.create(practiceKind,seed):E.create(seed);if(!practice&&!league)H.score(0);}
    if(state.phase==="result")return;
    if(!practice&&!league&&!state.matchId)state.matchId=identity();
    state.tactic=selectedTactic;applyShotAim();state.phase="live";confirmNew=false;$("new").textContent="New exhibition";clearInput();show();last=0;acc=0;
    if(!raf)raf=requestAnimationFrame(frame);
  }
  function newMatch(){
    if(league){if(seasonState&&RazorSeason.round(seasonState)<RazorSeason.rounds(seasonState)&&!confirmNew){confirmNew=true;show();return;}stop();try{const next=RazorSeason.nextSeason(seasonState,crypto.getRandomValues(new Uint32Array(1))[0]);localStorage.setItem(careerKey,JSON.stringify(next));seasonKey=careerKey;seasonState=next;state=null;selectedShotAim='auto';seasonSettled=false;confirmNew=false;show();draw();}catch(_){$("notice").textContent="Could not archive/start the next season. Existing career is preserved.";}return;}
    if(state&&state.phase!=="result"&&!confirmNew){confirmNew=true;$("new").textContent="Confirm abandon and start new";return;}
    stop();state=null;selectedShotAim='auto';confirmNew=false;localTick=0;hostTick=0;resume();persist();
  }
  function leave(){if(state?.phase==="live")state.phase="paused";stop();persist();H.exit();}
  const project=(x,y)=>({x:95+x*10.1+(y-30)*.6,y:90+y*8.4});
  function line(x1,y1,x2,y2,color,width=1){const a=project(x1,y1),b=project(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  let rosterDisplayFor=null,rosterDisplay=new Map();
  function namedAthlete(id){if(!league||seasonState.schema!==2||!state?.leagueLineup)return null;if(rosterDisplayFor!==seasonState){rosterDisplayFor=seasonState;rosterDisplay=new Map(seasonState.rosters.flat().map(p=>[p.id,p]));}return rosterDisplay.get(state.leagueLineup[id]);}
  function draw(){
    RazorPresentation.arena(ctx,project);
    ctx.textAlign='center';const coaching=coachDisplay();drillDisplay();const placement=aimDisplay();
    const opponentId=league?(state?.leagueLineup?Number(/^t(\d+)p/.exec(state.leagueLineup[6])?.[1]):state?.phase==='result'&&seasonSettled?RazorSeason.round(seasonState):Math.min(RazorSeason.round(seasonState)+1,RazorSeason.rounds(seasonState))):null;
    const opponent=league?RazorSeason.teams[opponentId]:null;
    $("matchTeams").textContent=league?`Relay Runners / ${opponent}`:'Teal side / Rose side';
    if(!state){$("score").textContent="TEAL 0 : 0 ROSE";$("clock").textContent="02:00";$("clock").classList.remove("urgent");return;}
    const target=receiver(),targetAthlete=namedAthlete(target),feedback=RazorPresentation.courtFeedback(state);
    $("target").textContent=target>=0?`Pass target: ${targetAthlete?targetAthlete.name:`runner ${target%6+1}`}${selectedTarget<0?" (auto)":" (selected)"}`:"Pass target: gain possession";
    if(target>=0&&state.ball.owner===state.control){const p=state.players[state.control],t=state.players[target];ctx.save();ctx.setLineDash([5,7]);line(p.x,p.y,t.x,t.y,coaching?.covered?'#ff98a477':'#f1cd8355',2);ctx.restore();}
    if(placement){const runner=state.players[state.control],q=project(Math.max(0,Math.min(100,placement.x)),placement.y);ctx.save();ctx.setLineDash([2,9]);line(runner.x,runner.y,Math.max(0,Math.min(100,placement.x)),placement.y,'#f1cd8344',1);ctx.setLineDash([]);ctx.fillStyle='#09232c';ctx.strokeStyle='#f5cb85';ctx.lineWidth=2;ctx.beginPath();ctx.arc(q.x,q.y,8,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(q.x-4,q.y);ctx.lineTo(q.x+4,q.y);ctx.moveTo(q.x,q.y-4);ctx.lineTo(q.x,q.y+4);ctx.stroke();ctx.restore();}
    for(const p of state.players){const q=project(p.x,p.y),side=E.team(p.id);ctx.fillStyle="#0007";ctx.beginPath();ctx.ellipse(q.x,q.y+7,15,7,0,0,Math.PI*2);ctx.fill();
      if(p.id===state.control){ctx.strokeStyle="#ffe59a";ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(q.x,q.y+5,20,11,0,0,Math.PI*2);ctx.stroke();}
      const kit=side?"#e86b94":"#6ee1c6";
      ctx.fillStyle=kit;ctx.beginPath();ctx.moveTo(q.x-11,q.y-6);ctx.lineTo(q.x+11,q.y-6);ctx.lineTo(q.x+8,q.y+10);ctx.lineTo(q.x-8,q.y+10);ctx.closePath();ctx.fill();
      ctx.strokeStyle="#bddce5";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(q.x-6,q.y+10);ctx.lineTo(q.x-8,q.y+17);ctx.moveTo(q.x+6,q.y+10);ctx.lineTo(q.x+8,q.y+17);ctx.stroke();
      ctx.fillStyle=kit;ctx.beginPath();ctx.arc(q.x,q.y-8,12,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#d4ffff";ctx.lineWidth=1;ctx.stroke();
      ctx.fillStyle="#05151b";ctx.font="bold 12px Arial";ctx.fillText(p.id%6===0?"K":String(p.id%6+1),q.x,q.y-4);
      if(p.id===state.control&&feedback){ctx.save();for(const [offset,fraction,color] of [[20,feedback.energy,'#6ee1c6'],[25,feedback.recovery,'#f5cb85']]){if(fraction===null)continue;ctx.fillStyle='#03151e';ctx.fillRect(q.x-15,q.y+offset,30,3);ctx.fillStyle=color;ctx.fillRect(q.x-15,q.y+offset,30*fraction,3);}ctx.restore();}
      const athlete=namedAthlete(p.id);if(athlete){ctx.fillStyle="#e8f4f2";ctx.font="10px Arial";ctx.fillText(athlete.name,q.x,q.y+(side?-26:p.id===state.control?40:29));}
      if(p.id===target){ctx.fillStyle="#ffe59a";ctx.beginPath();ctx.moveTo(q.x,q.y-40);ctx.lineTo(q.x+7,q.y-32);ctx.lineTo(q.x,q.y-24);ctx.lineTo(q.x-7,q.y-32);ctx.closePath();ctx.fill();}
    }
    const ball=project(state.ball.x,state.ball.y);if(feedback?.tail){const t=project(feedback.tail.x,feedback.tail.y);ctx.save();ctx.strokeStyle=feedback.tail.kind==='shot'?'#f5cb85aa':'#6ee1c6aa';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(t.x,t.y-18);ctx.lineTo(ball.x,ball.y-18);ctx.stroke();ctx.restore();}ctx.fillStyle="#fff4bc";ctx.shadowColor="#ffd36e";ctx.shadowBlur=14;ctx.beginPath();ctx.arc(ball.x,ball.y-18,6,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    $("score").textContent=`TEAL ${state.goals[0]} : ${state.goals[1]} ROSE`;
    const seconds=Math.ceil((E.LIMIT-state.tick)/60);$("clock").classList.toggle("urgent",seconds<=30);$("clock").textContent=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
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
      if(saved){state=E.restore(saved);selectedTactic=state.tactic||"balanced";selectedShotAim=state.shotAim||"auto";if(state.phase==="live")state.phase="paused";localTick=hostTick=state.tick;}
    }catch(_){state=null;$("notice").textContent="The saved exhibition could not be restored. Start a fresh match.";}
    show();draw();document.querySelector('main').inert=false;$('loading').hidden=true;document.body.dataset.ready='true';
  }
  $("resetSeason").onclick=()=>{if(!$("resetSeason").dataset.confirm){$("resetSeason").dataset.confirm="1";$("resetSeason").textContent="Confirm replace damaged season";return;}localStorage.setItem(careerKey,JSON.stringify(RazorSeason.create(crypto.getRandomValues(new Uint32Array(1))[0])));seasonKey=careerKey;$("resetSeason").hidden=true;$("resetSeason").dataset.confirm="";$("season").click();};
  $("season").onclick=()=>{
    if(!loaded)return;let saved;
    try{seasonKey=localStorage.getItem(careerKey)!==null?careerKey:legacySeasonKey;const text=localStorage.getItem(seasonKey);saved=text?RazorSeason.restore(JSON.parse(text)):RazorSeason.create(crypto.getRandomValues(new Uint32Array(1))[0]);if(saved.schema===2)seasonKey=careerKey;}
    catch(_){$("notice").textContent="Stored season is unsupported or damaged; it has been preserved.";$("resetSeason").hidden=false;return;}
    pause();stop();league=true;practice=false;seasonState=saved;state=saved.match;seasonSettled=!state;confirmNew=false;
    selectedTactic=state?.tactic||"balanced";selectedShotAim=state?.shotAim||"auto";if(state?.phase==="live")state.phase="paused";if(state)localTick=hostTick=state.tick;show();draw();
  };
  $("practice").onclick=()=>{
    if(!loaded)return;
    pause();stop();league=false;practice=true;practiceKind=null;practiceStorageKey=practiceKey;state=null;localTick=hostTick=0;
    try{const saved=JSON.parse(localStorage.getItem(practiceKey)||"null");if(saved){state=E.restore(saved);if(state.phase==="result")state=null;else state.phase="paused";}}catch(_){$("notice").textContent="Practice save unavailable; a fresh drill is ready.";}
    if(!state)state=E.create(crypto.getRandomValues(new Uint32Array(1))[0]);
    selectedTactic=state.tactic||"balanced";selectedShotAim=state.shotAim||"auto";state.phase="paused";show();draw();
  };
  function focusPanel(){$('closeRecords').focus({preventScroll:true});$('recordPanel').scrollTop=0;}
  function panel(title,subtitle){pause();$("overlay").inert=true;document.querySelector("nav").inert=true;$("recordPanel").hidden=false;$("recordsTitle").textContent=title;$("recordsSubtitle").textContent=subtitle;$("recordActions").replaceChildren();$("recordList").replaceChildren();}
  function clubBadge(team){const b=document.createElement('span');b.className=`club-badge club-${team}`;b.textContent=RazorSeason.teams[team].split(' ').map(w=>w[0]).join('');b.setAttribute('aria-hidden','true');return b;}
  function statCards(values,parent){const grid=document.createElement('div');grid.className='stat-cards';for(const [label,value] of values){const cell=document.createElement('div'),n=document.createElement('strong'),l=document.createElement('span');n.textContent=value;l.textContent=label;cell.append(n,l);grid.append(cell);}parent.append(grid);}
  function dataTable(headers,rows,parent,label){const wrap=document.createElement('div');wrap.className='table-scroll';wrap.tabIndex=0;wrap.setAttribute('aria-label',label);const table=document.createElement('table'),caption=document.createElement('caption'),head=document.createElement('thead'),body=document.createElement('tbody'),tr=document.createElement('tr');caption.textContent=label;table.append(caption);for(const name of headers){const th=document.createElement('th');th.scope='col';th.textContent=name;tr.append(th);}head.append(tr);table.append(head,body);for(const row of rows){const tr=document.createElement('tr');for(const value of row){const td=document.createElement('td');if(value instanceof Node)td.append(value);else td.textContent=value;tr.append(td);}body.append(tr);}wrap.append(table);parent.append(wrap);return table;}
  function renderLeagueSummary(){const box=$('leagueSummary');box.replaceChildren();box.hidden=!league;$('overlay').classList.toggle('league-view',league);if(!league)return;
    const table=RazorSeason.table(seasonState),home=table.find(t=>t.id===0),round=RazorSeason.round(seasonState);statCards([['Season',seasonState.number||'Legacy'],['Rounds',`${round}/${RazorSeason.rounds(seasonState)}`],['Your points',home.points],['Goal difference',home.for-home.against]],box);
    dataTable(['Club','P','GF','GA','Pts'],table.map(t=>{const club=document.createElement('span');club.className='club-name';club.append(clubBadge(t.id),document.createTextNode(t.name));return [club,t.played,t.for,t.against,t.points];}),box,'League standings');
  }
  let leaderMetric='goals',leaderPeriod='current',leaderPage=0;
  function leadersView(){if(!league||seasonState.schema!==2)return;panel('League leaders','Recorded athlete performances · tied values share a rank · players without tracked appearances are omitted.');
    for(const [period,label] of [['current','Current season'],['career','Career totals'],['previous','Latest archived season']]){const b=button(label,()=>{leaderPeriod=period;leaderPage=0;leadersView();});b.setAttribute('aria-pressed',String(period===leaderPeriod));}
    for(const [metric,label] of Object.entries(RazorPresentation.metrics)){const b=button(label,()=>{leaderMetric=metric;leaderPage=0;leadersView();});b.setAttribute('aria-pressed',String(metric===leaderMetric));}
    const rows=RazorPresentation.leaders(seasonState,leaderPeriod,leaderMetric);leaderPage=Math.max(0,Math.min(leaderPage,Math.max(0,Math.ceil(rows.length/12)-1)));
    detail(`${RazorPresentation.metrics[leaderMetric]} · ${leaderPeriod==='previous'?'Latest archived season':leaderPeriod==='career'?'Career totals':'Current season'} · ${rows.length} tracked athletes`);
    if(!rows.length)detail('No tracked player appearances in this period yet. Complete a league match, or choose another period.');
    else dataTable(['Rank','Athlete','Club','Played',RazorPresentation.metrics[leaderMetric]],rows.slice(leaderPage*12,leaderPage*12+12).map(p=>[p.rank,p.name,RazorSeason.teams[p.team],p.stats.appearances,p.stats[leaderMetric]]),$('recordList'),'Player leaderboard');
    button('Previous players',()=>{leaderPage--;leadersView();},leaderPage===0);button('Next players',()=>{leaderPage++;leadersView();},(leaderPage+1)*12>=rows.length);focusPanel();
  }
  $('leaders').onclick=leadersView;
  function reportView(source,meta,returnView=null){panel('Match report',meta.label||'Recorded match facts');try{const r=RazorReport.build(source,meta),summary=document.createElement('div');summary.className='report-score';const score=document.createElement('strong'),clubs=document.createElement('span'),status=document.createElement('span');score.textContent=r.goals.join(' : ');clubs.textContent=r.names.join(' / ');status.textContent=r.complete?'Full time':r.tick===null?'Saved match':`Paused at ${Math.floor(r.tick/3600)}:${String(Math.floor(r.tick/60)%60).padStart(2,'0')}`;summary.append(score,clubs,status);$('recordList').append(summary);
    if(returnView)button('Back to previous season',returnView);button('Open training drills',()=>$('drills').click(),settling);
    if(!r.stats)detail('Detailed counters are unavailable for this saved fixture. Only the saved score is shown.');
    else{dataTable(['Team statistic',r.names[0],r.names[1]],[['Goals',...r.goals],['Shots',...r.stats.shots],['Pass attempts',...r.stats.passes],['Challenges won',...r.stats.steals],['Keeper saves',...r.stats.saves],['Clock turnovers',...r.stats.turnovers]],$('recordList'),'Team comparison').classList.add('team-report');
      if(r.players){detail(r.fromTick?`Player tracking began ${(r.fromTick/60).toFixed(1)}s into the match. Team totals cover the whole match; player counters cover the tracked period only.`:'Player counters cover this match from kickoff. Team actions include AI teammates.');detail(`Tracked pass completion · ${r.names[0]} ${RazorReport.passes(r.tracked[0])} · ${r.names[1]} ${RazorReport.passes(r.tracked[1])}`);
        const table=dataTable(['Athlete','Side','Goals','Assists','Shots','Passes','Challenges','Saves'],r.players.map(p=>[p.name,r.names[p.side],p.goals,p.assists,p.shots,`${p.completed}/${p.passes}`,p.steals,p.saves]),$('recordList'),'Recorded athlete contributions · passes completed/attempted');table.classList.add('athlete-report');
        if(r.contributors.length)detail('Recorded goal contributors: '+r.contributors.map(p=>`${p.name} (${r.names[p.side]}) ${p.goals}`).join(' · '));
      }else detail('Individual player counters are unavailable for this checkpoint; no player statistics were reconstructed.');
      for(const hint of r.hints){const p=document.createElement('p');p.className='report-advice';p.textContent=hint;$('recordList').append(p);}}
    if(practice&&source===state&&practiceKind){const d=RazorPractice.status(source);detail(`Training objective: ${d.name} · ${d.value}/${d.target}${d.done?' achieved':''}. Practice grants no career or inventory rewards.`);}
  }catch(_){detail('Match report unavailable. Existing checkpoint is unchanged.');}focusPanel();}
  $('matchReport').onclick=()=>{if(state){const opponent=league?(state.leagueLineup?Number(/^t(\d+)p/.exec(state.leagueLineup[6])?.[1]):state.phase==='result'&&seasonSettled?RazorSeason.round(seasonState):RazorSeason.round(seasonState)+1):null;reportView(state,{home:league?RazorSeason.teams[0]:'Teal',away:league?RazorSeason.teams[opponent]:'Rose',rosters:league&&seasonState.schema===2?seasonState.rosters:[],label:practice?'Practice match · recorded team actions':league?'Current league match':'Exhibition match'});}
    else if(league){const m=seasonState.results.filter(m=>m.a===0||m.b===0).at(-1);if(m)reportView(m,{home:RazorSeason.teams[m.a],away:RazorSeason.teams[m.b],rosters:seasonState.rosters||[],complete:true,label:`Latest league fixture · round ${m.round+1}`});}};

  function drillDisplay(){const v=practice&&practiceKind&&state?RazorPractice.status(state):null;$('drillProgress').hidden=!v;if(!v)return;$('drillTitle').textContent=v.name;const count=`${v.value} / ${v.target} · ${v.done?(state.phase==='result'?'Target achieved — restart when ready':'Target achieved — continue or restart'):state.phase==='result'?'Time expired — target not met':'Target in progress'}`;if($('drillCount').textContent!==count)$('drillCount').textContent=count;$('drillMeter').max=v.target;$('drillMeter').value=Math.min(v.value,v.target);$('drillProgress').classList.toggle('achieved',v.done);if(practice)$('mode').textContent=`PRACTICE · ${v.name.toUpperCase()} · NO REWARDS`;}
  function openDrill(kind,replace=false,expectedText=null){if(!loaded||settling)return;pause();let savedText=null,valid=false;try{
    if(state){if(league)localStorage.setItem(seasonKey,JSON.stringify({...seasonState,match:seasonSettled?null:state}));else localStorage.setItem(practice?practiceStorageKey:key,JSON.stringify(state));}
    const slot=RazorPractice.key(kind);savedText=localStorage.getItem(slot);if(replace&&savedText!==expectedText)throw Error("Checkpoint changed before replacement");const next=savedText!==null&&!replace?RazorPractice.restore(JSON.parse(savedText),kind):RazorPractice.create(kind,crypto.getRandomValues(new Uint32Array(1))[0]);valid=true;
    localStorage.setItem(slot,JSON.stringify(next));stop();league=false;practice=true;practiceKind=kind;practiceStorageKey=slot;state=next;selectedTactic=state.tactic||'balanced';selectedShotAim=state.shotAim||'auto';localTick=hostTick=state.tick;confirmNew=false;
    $('recordPanel').hidden=true;$('overlay').inert=false;document.querySelector('nav').inert=false;show();draw();$(state.phase==='result'?'new':'start').focus();
  }catch(_){detail('Training checkpoint unavailable, unsupported or storage blocked. Existing checkpoints and current mode retained.');if(savedText!==null&&!valid&&!replace){let confirmed=false;const reset=button(`Replace saved ${RazorPractice.drills[kind].name}`,()=>{if(!confirmed){confirmed=true;reset.textContent='Confirm replace saved drill';return;}openDrill(kind,true,savedText);});}}}
  $('drills').onclick=()=>{if(!loaded||settling)return;panel('Training drills','Independent checkpoints · same match engine · two-minute team objectives · no arcade scores, XP or inventory prizes.');for(const [kind,d] of Object.entries(RazorPractice.drills)){const card=document.createElement('article');card.className='drill-card';const h=document.createElement('h3'),p=document.createElement('p');h.textContent=d.name;p.textContent=d.description;card.append(h,p);button(`Open ${d.name}`,()=>openDrill(kind),false,card);$('recordList').append(card);}detail('Goals restart with normal kickoff positions. Targets include your AI teammates. New practice restarts only the selected drill after confirmation; free practice is kept separately.');focusPanel();};

  $('coachToggle').onclick=()=>{coachEnabled=!coachEnabled;try{localStorage.setItem(coachKey,coachEnabled?'on':'off');}catch(_){$('notice').textContent='Coach setting applies this session; preference storage unavailable.';}coachDisplay();};
  $('practiceReview').onclick=()=>{if(!practice)return;panel('Practice team review','Actual tracked actions by your teal side · no scores, XP or inventory prizes.');const v=RazorCoach.review(state);if(!v)detail('Player action coverage unavailable in this older checkpoint. Resume to begin actual tracking; old actions are not reconstructed.');else{statCards([['Pass attempts',v.passes],['Completed',v.completed],['Shots',v.shots],['Challenges',v.steals]],$('recordList'));detail(`Keeper saves ${v.saves}. Tracking begins ${(v.fromTick/60).toFixed(1)}s into the match; team actions include your AI teammates.`);detail(v.completed?'Passing drill: your side completed a pass. Try selecting a different receiver with C / RB.':'Passing drill: use C / RB to select an outlet, then X. Watch the coverage cue; a clear lane can close.');detail(v.shots?'Shooting drill: your side attempted a shot. Compare long shots with closer attempts.':'Shooting drill: carry closer, wait for recovery, then A / Enter. Auto aims away from the keeper; V / RS selects a lane.');detail(v.steals?'Defending drill: your side won a challenge. Switch runners to protect the next attack.':'Defending drill: when Rose carries, A switches runner and X challenges at close range.');}focusPanel();};

  function button(label,fn,disabled=false,container=$("recordActions")){const b=document.createElement("button");b.textContent=label;b.disabled=disabled;b.onclick=fn;container.append(b);return b;}
  function detail(text){const p=document.createElement("p");p.textContent=text;$("recordList").append(p);}
  function careerChange(fn,after){const top=$('recordPanel').scrollTop,label=document.activeElement?.textContent;try{const next=fn(seasonState);localStorage.setItem(careerKey,JSON.stringify(next));seasonState=next;after();const same=[...$('recordPanel').querySelectorAll('button:not(:disabled)')].find(b=>b.textContent===label);if(same)same.focus({preventScroll:true});$('recordPanel').scrollTop=top;}catch(_){detail("Change unavailable or storage write failed. Existing career retained.");}}
  let rosterTeam=0,rosterPeriod='current',rosterSlot=1,rosterArchiveIndex=0;
  function rosterView(){if(!league||seasonState.schema!==2)return;panel('Rosters & player statistics','Choose a club, inspect actual statistics, and develop your Relay Runners between matches.');
    const archives=seasonState.archives.filter(a=>a.schema===2),selected=rosterPeriod==='current'?seasonState:rosterPeriod==='career'?null:archives.find(a=>a.number===rosterPeriod);
    if(rosterPeriod!=='career'&&!selected){rosterPeriod='current';return rosterView();}
    for(let t=0;t<8;t++){const b=button(RazorSeason.teams[t],()=>{rosterTeam=t;rosterView();});b.className=`club-choice club-${t}`;b.setAttribute('aria-pressed',String(rosterTeam===t));}
    button('Current season',()=>{rosterPeriod='current';rosterView();});button('Career totals',()=>{rosterPeriod='career';rosterView();});
    if(archives.length){rosterArchiveIndex=Math.max(0,Math.min(rosterArchiveIndex,archives.length-1));const a=archives[archives.length-1-rosterArchiveIndex];button(`Season ${a.number}`,()=>{rosterPeriod=a.number;rosterView();});button('Newer archived roster',()=>{rosterArchiveIndex--;rosterPeriod=archives[archives.length-1-rosterArchiveIndex].number;rosterView();},rosterArchiveIndex===0);button('Older archived roster',()=>{rosterArchiveIndex++;rosterPeriod=archives[archives.length-1-rosterArchiveIndex].number;rosterView();},rosterArchiveIndex===archives.length-1);}
    const managing=rosterTeam===0&&(rosterPeriod==='current'||rosterPeriod==='career');
    if(managing)button(`Lineup slot ${rosterSlot} (cycle 1–5)`,()=>{rosterSlot=rosterSlot%5+1;rosterView();});
    const source=selected||seasonState,row=source.rosters[rosterTeam],lineup=source.lineups[rosterTeam];
    detail(`${RazorSeason.teams[rosterTeam]} · ${rosterPeriod==='career'?'Career':`Season ${source.number}`} · training points available ${RazorSeason.rewards(seasonState).available}`);
    const grid=document.createElement('div');grid.className='roster-grid';$('recordList').append(grid);
    for(const p of row){const v=RazorSeason.playerStats(seasonState,p.id,rosterPeriod==='career'?undefined:source.number),slot=lineup.indexOf(p.id),card=document.createElement('article');card.className=`player-card club-${rosterTeam}`;card.dataset.player=p.id;
      const title=document.createElement('h3');title.append(clubBadge(rosterTeam),document.createTextNode(p.name));card.append(title);
      const role=document.createElement('p');role.className='player-role';role.textContent=`${p.role} · ${slot<0?'Reserve':slot===0?'Starting keeper':`Starting slot ${slot}`}`;card.append(role);
      statCards([['Played',v.appearances],['Goals',v.goals],['Assists',v.assists],['Saves',v.saves]],card);
      const detail=document.createElement('p');detail.textContent=`Shots ${v.shots} · passes ${v.completed}/${v.passes} completed · challenges ${v.steals} · tracked minutes ${(v.ticks/3600).toFixed(1)}`;card.append(detail);
      if(rosterPeriod==='career'||rosterPeriod==='current'){const xp=RazorSeason.playerStats(seasonState,p.id),progress=document.createElement('p');progress.className='development';progress.textContent=`Career level ${xp.level} · ${xp.xp} XP · league rating ${RazorSeason.rating(seasonState,p.id)}/10`;card.append(progress);}
      if(managing){const actions=document.createElement('div');actions.className='player-actions';card.append(actions);if(p.id!=='t0p0')button(`Assign ${p.name} to slot ${rosterSlot}`,()=>careerChange(s=>RazorSeason.changeLineup(s,rosterSlot,p.id),rosterView),!!seasonState.match||settling,actions);button(`Train ${p.name} (1 point)`,()=>careerChange(s=>RazorSeason.train(s,p.id),rosterView),!!seasonState.match||settling||RazorSeason.rewards(seasonState).available<1||seasonState.training.filter(t=>t.id===p.id).length>=5,actions);}
      grid.append(card);
    }
    focusPanel();
  }
  let rewardPage=0;
  let prizePending=null,prizeFrontier=null,prizeStatus=0,prizeMessage='';
  function prizeRequest(action,prize){
    if(prizePending)return;
    const requestId=identity(),passport=seasonState.prizePassport;
    prizePending={requestId,passport};prizeMessage='Waiting for Starfield inventory service…';
    send('derbyPrize',{rules:1,requestId,passport,action,ordinal:prize?.ordinal||0,result:prize?.result??-1,expectedFrontier:prizeFrontier??0});
    setTimeout(()=>{if(prizePending?.requestId!==requestId)return;prizePending=null;prizeFrontier=null;prizeMessage='No confirmation received. Delivery is unknown. Check the save ledger before retrying; the native DLL and prize scripts must match.';if(prizeVisible())renderPrizes();},15000);
    renderPrizes();
  }
  function prizeVisible(){return league&&seasonState?.schema===2&&!$('recordPanel').hidden&&$('recordsTitle').textContent==='Starfield prizes';}
  function renderPrizes(){
    if(!prizeVisible())return;
    panel('Starfield prizes','Claims belong to the current Starfield save/character. An earlier save rolls back inventory and its claim ledger together.');
    detail(prizeMessage);detail('Match: loss 100, draw 150, win 200 credits. Season: 1st 500 + 3 Med Packs; 2nd 300 + 2; 3rd 150 + 1; other placings 100 + 1. No entry fee.');
    button('Check current save claim ledger',()=>prizeRequest('status'),!!prizePending);
    try{const list=RazorPrizes.entitlements(seasonState),next=prizeFrontier===null?null:list.find(p=>p.ordinal>prizeFrontier);
      detail(prizeFrontier===null?'Claim status not confirmed. Query the current save before claiming.':`Recorded through milestone ${prizeFrontier}. ${list.filter(p=>p.ordinal>prizeFrontier).length} earned prizes remain.`);
      if(next){detail(`Next: ${next.label} — ${next.credits} credits${next.medpacks?` + ${next.medpacks} Med Packs`:''}`);button('Claim next earned prize',()=>prizeRequest('claim',next),!!prizePending||prizeStatus===3||!!seasonState.match||settling);}
      else if(prizeFrontier!==null)detail('No unclaimed earned prizes. Finish another league match to earn more.');
      if(seasonState.match||settling)detail('Finish or settle the active match before claiming.');
      if(prizeStatus===3)detail('A reserved prize has uncertain delivery. Further claims are blocked to prevent duplicate inventory; check inventory and keep this save for diagnosis.');
    }catch(_){detail('Career prize history unavailable; no claim sent.');}
    focusPanel();
  }
  function worldPrizesView(){
    if(!league||seasonState.schema!==2)return;
    try{if(!seasonState.prizePassport){const next=RazorSeason.restore({...seasonState,prizePassport:identity()});localStorage.setItem(careerKey,JSON.stringify(next));seasonState=next;}}
    catch(_){detail('Could not save the career prize identity. No claim sent.');return;}
    panel('Starfield prizes','Current save inventory rewards');prizeFrontier=null;prizeStatus=0;
    if(prizePending){prizeMessage='An earlier request is still awaiting confirmation.';renderPrizes();}else prizeRequest('status');
  }
  addEventListener('message',event=>{
    const m=event.data,r=m?.value;
    if(event.source!==parent||m?.channel!=='starcade'||m.type!=='derbyPrize'||m.session!==session||!r||!prizePending||r.requestId!==prizePending.requestId)return;
    const pending=prizePending;prizePending=null;
    if(!league||seasonState?.prizePassport!==pending.passport)return;
    if(![0,1,2,3].includes(r.status)||!Number.isInteger(r.frontier)||r.frontier<0||r.frontier>8000000){prizeFrontier=null;prizeMessage=r.message||'Prize service unavailable or outdated.';}
    else {prizeStatus=r.status;prizeFrontier=r.status===0?null:r.frontier;prizeMessage=(r.message||'Prize ledger response')+(r.status===1&&r.credits>0?` · Received ${r.credits} credits and ${r.medpacks||0} Med Packs.`:'');}
    if(prizeVisible())renderPrizes();
  });
  function rewardsView(){if(!league||seasonState.schema!==2)return;panel('Career rewards','League development ledger. Claim Starfield inventory prizes separately below.');button('Starfield inventory prizes',worldPrizesView);const v=RazorSeason.rewards(seasonState);detail(`Earned ${v.earned} · Spent ${v.spent} · Available ${v.available}`);detail(v.honours.join(' · ')||'No completed season honours yet.');for(const t of RazorSeason.careerTable(seasonState))detail(`${t.name}: career ${t.played} matches, W/D/L ${t.wins}/${t.draws}/${t.losses}, goals ${t.for}:${t.against}`);button('Newer rewards',()=>{rewardPage=Math.max(0,rewardPage-1);rewardsView();},rewardPage===0);button('Older rewards',()=>{rewardPage++;rewardsView();},(rewardPage+1)*10>=v.ledger.length);for(const e of v.ledger.slice().reverse().slice(rewardPage*10,rewardPage*10+10))detail(`${e.text}: +${e.points} training points [${e.id}]`);detail('Spend points in your roster between matches. XP is earned from appearances and recorded actions; levels and training improve league-only speed and shot accuracy.');focusPanel();}
  let historyIndex=0;
  function historyView(){if(!league||seasonState.schema!==2)return;const list=seasonState.archives;panel('Previous seasons','Archived actual fixtures and final rosters; incomplete seasons are labeled.');if(!list.length){detail('No previous seasons archived yet.');focusPanel();return;}historyIndex=Math.max(0,Math.min(historyIndex,list.length-1));const a=list[list.length-1-historyIndex];button('Newer season',()=>{historyIndex--;historyView();},historyIndex===0);button('Older season',()=>{historyIndex++;historyView();},historyIndex===list.length-1);detail(a.legacy?'Legacy four-team season: team results known, player statistics unavailable.':`Season ${a.number} · ${a.results.length===28?'Complete':'Abandoned / incomplete'} · ${a.results.length}/28 fixtures`);for(const t of RazorSeason.table(a))detail(`${t.name}: ${t.points} points, ${t.played} played, goals ${t.for}:${t.against}`);for(const m of a.results)detail(`Round ${m.round+1}: ${RazorSeason.teams[m.a]} ${m.goals.join(' : ')} ${RazorSeason.teams[m.b]}`);if(!a.legacy)for(const row of a.rosters)detail(row.map(p=>`${p.name} [${p.id}]`).join(' · '));for(const m of a.results.filter(m=>m.a===0||m.b===0))button(`Report round ${m.round+1}`,()=>reportView(m,{home:RazorSeason.teams[m.a],away:RazorSeason.teams[m.b],rosters:a.rosters||[],complete:true,label:`${a.legacy?'Legacy season':`Season ${a.number}`} · round ${m.round+1}`},historyView));focusPanel();}
  $("roster").onclick=rosterView;$("career").onclick=rewardsView;$("history").onclick=historyView;
  $("fixtures").onclick=()=>{if(!league)return;pause();$("overlay").inert=true;document.querySelector("nav").inert=true;$("recordPanel").hidden=false;$("recordsTitle").textContent="Season fixtures";$("recordsSubtitle").textContent="All teams play each other once";$("recordActions").replaceChildren();$("recordList").replaceChildren();RazorSeason.fixturesFor(seasonState).forEach((round,r)=>round.forEach(([a,b])=>{const result=seasonState.results.find(m=>m.round===r&&m.a===a&&m.b===b);const p=document.createElement("p");p.textContent=`Round ${r+1}: ${RazorSeason.teams[a]} ${result?result.goals.join(" : "):"vs"} ${RazorSeason.teams[b]}${result?"":" — scheduled"}`;$("recordList").append(p);}));focusPanel();};
  $("records").onclick=()=>{$("recordsTitle").textContent="Latest exhibition records";$("recordsSubtitle").textContent="Local completion dates · rules revision 1 · latest ten matches";pause();$("overlay").inert=true;document.querySelector("nav").inert=true;$("recordPanel").hidden=false;$("recordActions").replaceChildren();$("recordList").replaceChildren();try{const entries=RazorRecords.read(localStorage.getItem(recordsKey));if(!entries.length)$("recordList").textContent="No completed exhibitions recorded yet.";for(const e of entries.slice().reverse()){const p=document.createElement("p");p.textContent=`${new Date(e.ended*1000).toLocaleString()} · Teal ${e.goals[0]} : ${e.goals[1]} Rose · shots ${e.stats.shots.join("/")} · challenges ${e.stats.steals.join("/")} · keeper saves ${e.stats.saves.join("/")}${e.tactic?` · tactic ${tacticNames[e.tactic]}`:""}`;$("recordList").append(p);}}catch(_){$("recordList").textContent="Stored records are unavailable or from an unsupported version.";}focusPanel();};
  $("closeRecords").onclick=()=>{$("recordPanel").hidden=true;$("overlay").inert=false;document.querySelector("nav").inert=false;show();$("records").focus();};
  $("tactic").onclick=()=>{if(settling||state?.phase==="live")return;selectedTactic=tactics[(tactics.indexOf(selectedTactic)+1)%tactics.length];if(state&&state.phase!=="result"){state.tactic=selectedTactic;persist();}show();};
  $("start").onclick=resume;$("new").onclick=newMatch;$("exit").onclick=leave;$("return").onclick=leave;
  $("pause").onclick=()=>state?.phase==="live"?pause():resume();
  $("shotAim").onclick=cycleShotAim;
  $("cycle").onclick=cycleTarget;
  $("pass").onclick=()=>{if(state?.phase==="live")action.pass=true;};$("shoot").onclick=()=>{if(state?.phase==="live")action.shoot=true;};
  addEventListener("keydown",e=>{
    if(!loaded){e.preventDefault();e.stopImmediatePropagation();return;}
    const k=e.key.length===1?e.key.toLowerCase():e.key;
    if(!$("recordPanel").hidden){
      if(['c','Control','Shift','PageUp','PageDown'].includes(k)){e.preventDefault();e.stopImmediatePropagation();$('recordPanel').scrollBy({top:(k==='Shift'||k==='PageUp'?-1:1)*Math.max(120,Math.round($('recordPanel').clientHeight*.65)),behavior:'auto'});return;}
      if(["Escape","Enter"," ","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(k)){e.preventDefault();e.stopImmediatePropagation();const buttons=[...$("recordPanel").querySelectorAll("button:not(:disabled)")];const i=buttons.indexOf(document.activeElement);if(k==="Escape")$("closeRecords").click();else if(k==="Enter"||k===" ")(buttons[i]||buttons[0]).click();else buttons[(i+(["ArrowUp","ArrowLeft"].includes(k)?-1:1)+buttons.length)%buttons.length].focus();}return;
    }
    if(k==="v"){e.preventDefault();if(!e.repeat)cycleShotAim();return;}
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
