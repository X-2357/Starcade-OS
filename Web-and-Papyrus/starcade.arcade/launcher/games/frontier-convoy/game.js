"use strict";
(()=>{
 const R=ConvoyRules,H=StarcadeHost,$=id=>document.getElementById(id),key="starcade.frontier-convoy.run.v1";
 let state=null,loaded=false,armed=false;
 function save(){if(!state)return;const data=R.pack(state);try{localStorage.setItem(key,JSON.stringify(data));}catch(_){$("notice").textContent="Local save unavailable. Keep the expedition open to finish it.";}H.save(data);}
 function fresh(){state=R.create(crypto.getRandomValues(new Uint32Array(1))[0]);armed=false;$("new").textContent="New expedition (Y)";H.score(0);save();render();$("choices").querySelector("button:not(:disabled)")?.focus();}
 function costs(delta){return ["fuel","hull","supplies"].map((label,i)=>delta[i]?`${delta[i]>0?"+":""}${delta[i]} ${label}`:null).filter(Boolean).concat(delta[3]?[`+${delta[3]} commendation`]:[]).join(" · ")||"No resource change";}
 function render(){
  const done=state.phase==="result";
  $("map").replaceChildren();for(let i=1;i<=6;i++){const n=document.createElement("span");n.textContent=`${i===6?"PORT":"RELAY"} ${i}`;n.className=i<=state.leg?"done":i===state.leg+1?"next":"";$("map").append(n);}
  $("resources").innerHTML=["Fuel","Hull","Supplies"].map((name,i)=>`<div>${name}<strong>${state.resources[i]}</strong><small> / ${[15,10,12][i]}</small></div>`).join("");
  $("stage").textContent=done?"EXPEDITION DEBRIEF":state.phase==="route"?`LEG ${state.leg+1} OF 6 · CHOOSE YOUR ROUTE`:`RELAY ${state.leg} · LOCAL ENCOUNTER`;
  const encounter=state.phase==="event"?R.events[state.deck[state.leg-1]]:null;
  $("title").textContent=done?(state.outcome==="arrived"?"Convoy delivered":"Distress extraction"):encounter?encounter[0]:"Choose the next crossing";
  $("story").textContent=done?`${state.outcome==="arrived"?"All six legs completed.":"No remaining route could be crossed with your reserves. The convoy signals for extraction."} ${state.leg} legs, ${state.merit} commendation, ${state.resources[1]} hull remaining. Score ${R.score(state)}. Your log records every resource change.`:encounter?encounter[1]:"Charted corridors protect your hull but use more fuel. Slingshots and emergency drifts trade integrity for reserves. You must retain at least one hull.";
  $("choices").replaceChildren();
  for(const option of R.choices(state)){
   const b=document.createElement("button");b.dataset.choice=option.id;b.disabled=!option.allowed;
   const title=document.createElement("b"),description=document.createElement("span"),cost=document.createElement("small");title.textContent=option.title;description.textContent=option.text;cost.textContent=costs(option.delta)+(option.allowed?"":" — insufficient reserves");b.append(title,description,cost);
   b.onclick=()=>{R.apply(state,option.id);armed=false;$("new").textContent="New expedition (Y)";save();render();if(state.phase==="result"){H.score(R.score(state));H.finish(R.score(state));$("new").focus();}else $("choices").querySelector("button:not(:disabled)")?.focus();};$("choices").append(b);
  }
  $("log").replaceChildren();for(const entry of state.log.slice().reverse()){
   const p=document.createElement("p");p.textContent=`Leg ${entry.leg}: ${entry.title}. ${entry.text} Reserves ${entry.before.join("/")} → ${entry.after.join("/")} (fuel/hull/supplies).${entry.merit?` +${entry.merit} commendation.`:""}`;$("log").append(p);
  }
  if(!state.log.length)$("log").textContent="The convoy awaits your first route order.";
 }
 function load(value){if(loaded)return;loaded=true;try{let saved=value;if(!saved)saved=JSON.parse(localStorage.getItem(key)||"null");if(!saved){fresh();return;}state=R.restore(saved);render();if(state.phase==="result")H.score(R.score(state));($("choices").querySelector("button:not(:disabled)")||$("new")).focus();}catch(_){$("notice").textContent="The expedition save could not be restored. A fresh convoy is ready.";fresh();}}
 $("exit").onclick=()=>{save();H.exit();};
 $("new").onclick=()=>{if(!state)return;if(state.phase!=="result"&&state.history.length&&!armed){armed=true;$("new").textContent="Confirm abandon and start new";return;}fresh();$("choices").querySelector("button:not(:disabled)")?.focus();};
 addEventListener("keydown",e=>{
  if(e.repeat||e.ctrlKey||e.altKey||e.metaKey)return;
  if(e.key.toLowerCase()==="y"){e.preventDefault();$("new").click();return;}
  if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Enter"," "].includes(e.key))return;
  e.preventDefault();const controls=[...document.querySelectorAll("button:not(:disabled)")],active=document.activeElement;
  if(e.key==="Enter"||e.key===" "){(controls.includes(active)?active:$("choices").querySelector("button:not(:disabled)")||$("new")).click();return;}
  const delta=["ArrowUp","ArrowLeft"].includes(e.key)?-1:1,index=controls.indexOf(active);controls[(index+delta+controls.length)%controls.length]?.focus();
 });
 H.onLoad(load);if(parent===window)load(null);H.ready({title:"Frontier Convoy"});
})();
