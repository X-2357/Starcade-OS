"use strict";
(function(root){
const orders=[{id:'conserve',name:'Conserve',fuel:1,wear:1,time:70},{id:'normal',name:'Normal pace',fuel:2,wear:2,time:66},{id:'push',name:'Push',fuel:3,wear:4,time:60},{id:'pit',name:'Pit lap',fuel:0,wear:0,time:84},{id:'retire',name:'Retire race',fuel:0,wear:0,time:0}];
function create(seed){if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Invalid seed');let rng=seed;const wet=[];for(let i=0;i<8;i++){rng=(Math.imul(rng,1664525)+1013904223)>>>0;wet.push(rng%4===0);}return {seed,wet,rivals:[510,525,540,555,570].map(t=>t+seed%7),lap:0,fuel:12,wear:0,time:0,history:[],log:[],result:null,rank:null};}
function preview(s,id){const p=orders.find(p=>p.id===id);if(!p||s.result||s.fuel<p.fuel)throw Error('Unavailable order');const wear=id==='pit'?0:s.wear+p.wear+(id==='push'&&s.wet[s.lap]?2:0),puncture=wear>=12;return {...p,seconds:p.time+(id==='push'&&s.wet[s.lap]?6:0)+(puncture?18:0),afterWear:puncture?4:wear,puncture};}
function act(s,id){const p=preview(s,id);s.history.push(id);if(id==='retire'){s.result='retired';s.log.push('Race retired.');return;}s.fuel=id==='pit'?Math.min(18,s.fuel+10):s.fuel-p.fuel;s.wear=p.afterWear;s.time+=p.seconds;s.lap++;s.log.push(`Lap ${s.lap}: ${p.name}, ${p.seconds}s${p.puncture?', puncture':''}; fuel ${s.fuel}, wear ${s.wear}.`);if(s.lap===8){s.result='finished';s.rank=1+s.rivals.filter(t=>t<s.time).length;}}
function pack(s){return {schema:1,seed:s.seed,actions:s.history.slice()};}
function restore(v){if(!v||v.schema!==1||!Array.isArray(v.actions)||v.actions.length>8)throw Error('Invalid save');const s=create(v.seed);for(const id of v.actions){if(typeof id!=='string')throw Error('Invalid order');act(s,id);}return s;}
function score(s){return s.result==='finished'?(7-s.rank)*200+s.fuel*5:0;}
root.RaceRules={orders,create,preview,act,pack,restore,score};
})(globalThis);
