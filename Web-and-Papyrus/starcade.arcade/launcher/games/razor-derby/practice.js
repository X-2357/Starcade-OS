"use strict";
(()=>{
  const drills={
    passing:{name:'Passing circuit',goal:3,metric:'completed',description:'Complete three teal passes. Start with space and several outlets; use C / RB to choose a receiver, then X.'},
    finishing:{name:'Finishing chances',goal:2,metric:'goals',description:'Score two teal goals. Start near goal with the ball ready; A / Enter shoots away from the keeper.'},
    defending:{name:'Defending recovery',goal:2,metric:'steals',description:'Win two teal challenges. Start between the Rose carrier and your goal; close in, then X, or A to switch runner.'}
  };
  const known=kind=>Object.prototype.hasOwnProperty.call(drills,kind);
  function key(kind){if(!known(kind))throw Error('Unknown training drill');return `starcade.razor-derby.practice.${kind}.v1`;}
  function create(kind,seed){
    if(!known(kind))throw Error('Unknown training drill');
    const s=RazorDerby.create(seed);s.drill={rules:1,kind};s.phase='paused';s.players.forEach(p=>p.cool=0);
    const set=(id,x,y)=>Object.assign(s.players[id],{x,y});
    if(kind==='passing'){
      set(5,40,30);set(1,53,18);set(2,53,42);set(3,62,12);set(4,62,48);
      set(7,76,15);set(8,76,45);set(9,86,12);set(10,86,48);set(11,80,30);
    }else if(kind==='finishing'){
      set(5,79,18);set(7,64,12);set(8,64,48);set(9,72,8);set(10,72,52);set(11,58,30);
    }else{set(1,60,30);set(5,38,18);set(11,68,30);s.ball.owner=11;s.control=1;s.possession=1;}
    const owner=s.players[s.ball.owner];s.ball.x=owner.x;s.ball.y=owner.y;
    s.event=drills[kind].name+' — team objective; no rewards';
    return restore(s,kind);
  }
  function restore(value,kind){
    if(!known(kind)||!value?.drill||value.drill.rules!==1||value.drill.kind!==kind)throw Error('Unsupported training checkpoint');
    const s=RazorDerby.restore(value);
    if(!s.individual||s.metricsFromTick!==0)throw Error('Training action coverage unavailable');
    if(s.phase==='live')s.phase='paused';return s;
  }
  function status(s){
    const kind=s?.drill?.kind;if(!known(kind)||s.drill.rules!==1)return null;
    const d=drills[kind],value=d.metric==='goals'?s.goals[0]:s.individual.slice(0,6).reduce((n,p)=>n+p[d.metric],0);
    return {name:d.name,description:d.description,value,target:d.goal,done:value>=d.goal};
  }
  window.RazorPractice={drills,key,create,restore,status};
})();
