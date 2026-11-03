"use strict";
(function(root){
const orders=[{id:'extract',name:'Extract ore',delta:[3,0,0]},{id:'smelt',name:'Smelt plate',delta:[-2,1,0]},{id:'assemble',name:'Deliver module',delta:[0,-2,1]},{id:'abandon',name:'Abandon contract',delta:[0,0,0]}];
function create(){return {shift:0,stock:[2,0,0],history:[],log:[],result:null};}
function preview(s,id){const p=orders.find(p=>p.id===id);if(!p||s.result||!s.stock.every((n,i)=>n+p.delta[i]>=0&&n+p.delta[i]<=[8,6,4][i]))throw Error('Unavailable order');return p;}
function act(s,id){const p=preview(s,id);s.history.push(id);s.shift++;s.stock=s.stock.map((n,i)=>n+p.delta[i]);s.log.push(`Shift ${s.shift}: ${p.name}; ore/plates/delivered ${s.stock.join('/')}.`);if(id==='abandon')s.result='abandoned';else if(s.stock[2]===4)s.result='delivered';else if(s.shift===20)s.result='deadline';}
function pack(s){return {schema:1,actions:s.history.slice()};}
function restore(v){if(!v||v.schema!==1||!Array.isArray(v.actions)||v.actions.length>20)throw Error('Invalid save');const s=create();for(const id of v.actions){if(typeof id!=='string')throw Error('Invalid order');act(s,id);}return s;}
function score(s){return s.result==='delivered'?1000+(20-s.shift)*100+s.stock[0]*5+s.stock[1]*10:s.stock[2]*100;}
root.SupplyRules={orders,create,preview,act,pack,restore,score};
})(globalThis);
