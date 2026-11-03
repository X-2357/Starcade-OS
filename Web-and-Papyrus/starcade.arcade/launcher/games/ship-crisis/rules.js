"use strict";
(function(root){
 const presets=[{id:'balanced',name:'Balanced',power:[2,2,2]},{id:'assault',name:'Assault',power:[1,1,4]},{id:'evade',name:'Evasive',power:[3,3,0]},{id:'repair',name:'Repair hull',power:[0,4,0]},{id:'retreat',name:'Signal surrender',power:[0,0,0]}];
 function create(seed){if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Invalid seed');let rng=seed;const attacks=[];for(let i=0;i<10;i++){rng=(Math.imul(rng,1664525)+1013904223)>>>0;attacks.push(4+rng%3);}return {seed,attacks,turn:0,hull:12,enemy:30,escape:0,kits:2,history:[],log:[],result:null};}
 function preview(s,id){const p=presets.find(p=>p.id===id);if(!p||s.result||id==='repair'&&!s.kits)throw Error('Unavailable order');const [engines,shields,weapons]=p.power;return {id,name:p.name,power:p.power,attack:s.attacks[s.turn],damage:Math.max(0,s.attacks[s.turn]-shields),hit:weapons*2,advance:engines,heal:id==='repair'?Math.min(5,12-s.hull):0};}
 function act(s,id){const p=preview(s,id);s.history.push(id);s.turn++;if(id==='retreat'){s.result='surrender';s.log.push('You signaled surrender.');return;}if(id==='repair'){s.kits--;s.hull+=p.heal;}s.enemy=Math.max(0,s.enemy-p.hit);s.escape+=p.advance;const incoming=s.enemy===0||s.escape>=18?0:p.damage;s.hull=Math.max(0,s.hull-incoming);s.log.push(`${p.name}: dealt ${p.hit}, advanced ${p.advance}, repaired ${p.heal}, took ${incoming}.`);if(s.enemy===0)s.result='victory';else if(s.escape>=18)s.result='escaped';else if(!s.hull)s.result='destroyed';else if(s.turn===10)s.result='timeout';}
 function pack(s){return {schema:1,seed:s.seed,actions:s.history.slice()};}
 function restore(v){if(!v||v.schema!==1||!Array.isArray(v.actions)||v.actions.length>10)throw Error('Invalid save');const s=create(v.seed);for(const id of v.actions){if(typeof id!=='string')throw Error('Invalid order');act(s,id);}return s;}
 function score(s){return ['victory','escaped'].includes(s.result)?1000+s.hull*50+s.kits*100:s.escape*10+(30-s.enemy)*5;}
 root.CrisisRules={presets,create,preview,act,pack,restore,score};
})(globalThis);
