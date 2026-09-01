"use strict";
(()=>{
  const c=game,x=c.getContext("2d"),A="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const archive=[
    ["ARTIFACT","MYSTERIES","A mysterious object sought among the stars"],["CONSTELLATION","FACTIONS","Explorers headquartered at the Lodge"],
    ["GRAV DRIVE","TECHNOLOGY","Technology that folds the distance between systems"],["STARborn","MYSTERIES","A traveler transformed by the Unity"],
    ["VANGUARD","FACTIONS","The UC civilian defense force"],["AKILA CITY","PLACES","Freestar capital beneath watchful walls"],
    ["ANDREJA","PEOPLE","A guarded explorer with hidden loyalties"],["TERRORMORPH","THREATS","A lethal alien predator"],
    ["PARADISO","PLACES","A resort world with complicated visitors"],["THE LODGE","PLACES","Constellation's New Atlantis headquarters"],
    ["SARAH MORGAN","PEOPLE","Constellation's disciplined chair"],["BARRETT","PEOPLE","Explorer, scientist, and teller of long stories"],
    ["SAM COE","PEOPLE","Freestar pilot with an explorer daughter"],["CORA COE","PEOPLE","A young reader who travels the stars"],
    ["VLADIMIR SALL","PEOPLE","Keeper of the Eye and former pirate"],["NOEL","PEOPLE","Constellation's gifted scientist"],
    ["MATTEO KHATRI","PEOPLE","A theologian searching for meaning"],["WALTER STROUD","PEOPLE","Constellation's financier and shipbuilder"],
    ["NEW ATLANTIS","PLACES","United Colonies capital on Jemison"],["NEON","PLACES","Pleasure city built above Volii Alpha"],
    ["THE KEY","PLACES","Crimson Fleet station in the Kryx system"],["RED MILE","PLACES","Porrima's dangerous spectator run"],
    ["CYDONIA","PLACES","The old mining city beneath Mars"],["GAGARIN","PLACES","Former mech manufacturing settlement"],
    ["HOPE TOWN","PLACES","Home of a major Freestar shipbuilder"],["THE ROCK","PLACES","Headquarters of the Freestar Rangers"],
    ["CRIMSON FLEET","FACTIONS","Pirates who make their home at the Key"],["FREESTAR COLLECTIVE","FACTIONS","Independent systems governed from Akila"],
    ["UNITED COLONIES","FACTIONS","Interstellar republic headquartered on Jemison"],["RYUJIN INDUSTRIES","FACTIONS","Neon's powerful corporate operator"],
    ["HOUSE VARUUN","FACTIONS","Followers of the Great Serpent"],["ECLIPTIC","FACTIONS","Mercenaries encountered across the Settled Systems"],
    ["HEATLEECH","THREATS","A common pest with a dangerous secret"],["ASHTA","THREATS","Pack predator beyond Akila's walls"],
    ["SPACER","THREATS","Lawless raider unaffiliated with the Fleet"],["MICROBE","TECHNOLOGY","One proposed answer to a biological crisis"],
    ["ARMILLARY","MYSTERIES","An assembly built from collected Artifacts"],["THE UNITY","MYSTERIES","A threshold beyond one universe"],
    ["QUANTUM ESSENCE","MYSTERIES","Energy left by a defeated Starborn"],["HELium THREE","TECHNOLOGY","Fuel associated with interstellar travel"],
    ["CREATION ENGINE","TECHNOLOGY","A fabrication system used at outposts"],["COMSPIKE","TECHNOLOGY","Experimental equipment used to reach the Legacy"]
  ].map(q=>[q[0].toUpperCase(),q[1],q[2]]);
  let deck=[],word="",category="",clue="",used=new Set(),cur=0,wrong=0,score=0,round=1,streak=0,hints=2,resolving=false;
  const maxWrong=8,totalRounds=10;
  function shuffle(a){for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function newCampaign(){deck=shuffle([...archive]);score=0;round=1;streak=0;hints=2;next()}
  function next(){const q=deck.pop()||shuffle([...archive]).pop();[word,category,clue]=q;used=new Set();cur=0;wrong=0;resolving=false;draw()}
  function solved(){return [...word].every(q=>q===" "||used.has(q))}
  function choose(){if(resolving)return;const ch=A[cur];if(used.has(ch))return;used.add(ch);if(!word.includes(ch))wrong++;
    if(solved()){streak++;score+=Math.max(250,2200-wrong*180)+streak*100;finishRound(true)}
    else if(wrong>=maxWrong){streak=0;finishRound(false)} draw()}
  function finishRound(won){if(resolving)return;resolving=true;setTimeout(()=>{round++;if(round>totalRounds)StarcadeHost.finish(score);else next()},650)}
  function hint(){if(resolving||hints<=0)return;const choices=[...new Set([...word].filter(q=>q!==" "&&!used.has(q)))];if(!choices.length)return;used.add(choices[Math.floor(Math.random()*choices.length)]);hints--;score=Math.max(0,score-250);if(solved()){streak++;finishRound(true)}draw()}
  function draw(){x.fillStyle="#06100e";x.fillRect(0,0,900,620);x.textAlign="center";
    x.fillStyle="#efc870";x.font="15px Arial";x.fillText(category,450,48);x.fillStyle="#829792";x.font="18px Arial";x.fillText(clue.toUpperCase(),450,85);
    x.fillStyle="#e8f4f2";x.font="34px monospace";x.fillText([...word].map(q=>q===" "?"   ":used.has(q)?q:"_").join(" "),450,165);
    for(let i=0;i<26;i++){const z=i%13,y=Math.floor(i/13),px=65+z*60,py=255+y*75;x.fillStyle=used.has(A[i])?"#101c19":i===cur?"#1d5c4d":"#0d2821";x.fillRect(px,py,50,50);x.strokeStyle=i===cur?"#fff":"#35514b";x.lineWidth=i===cur?3:1;x.strokeRect(px,py,50,50);x.fillStyle=used.has(A[i])?"#55776e":"#8df7c7";x.font="24px Arial";x.fillText(A[i],px+25,py+33)}
    x.fillStyle="#ff786f";x.font="19px Arial";x.fillText(`SIGNAL INTEGRITY ${Math.max(0,maxWrong-wrong)}/${maxWrong}`,450,485);x.fillStyle="#829792";x.fillText(`CLUES ${hints}  ·  STREAK ${streak}`,450,525);hud.textContent=`ARCHIVE ${round}/${totalRounds} · SCORE ${score}`}
  addEventListener("keydown",e=>{const k=StarcadeInput.key(e),z=cur%13,y=Math.floor(cur/13);if(k==="ArrowLeft")cur=y*13+(z+12)%13;if(k==="ArrowRight")cur=y*13+(z+1)%13;if(k==="ArrowUp"||k==="ArrowDown")cur=(cur+13)%26;if(k==="Action")choose();if(k.toLowerCase()==="x")hint();if(StarcadeInput.isControl(k)||k.toLowerCase()==="x"){e.preventDefault();draw()}});
  newCampaign();StarcadeHost.ready({title:"Constellation Codebreaker"});
})();
