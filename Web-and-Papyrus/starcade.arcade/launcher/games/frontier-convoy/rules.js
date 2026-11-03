"use strict";
(function(root){
 const routes=[
  {id:"cruise",title:"Charted corridor",text:"Spend fuel to spare your hull.",delta:[-2,0,-1,0]},
  {id:"sling",title:"Debris slingshot",text:"Save fuel; shields absorb debris impacts.",delta:[-1,-2,-1,0]},
  {id:"ration",title:"Emergency drift",text:"Conserve supplies; prolonged exposure damages the convoy.",delta:[-1,-3,0,0]}
 ];
 const events=[
  ["A beacon in the dark","A stranded survey tender has oxygen, but its drive is cold.",[
   ["Share fuel",[-2,0,0,20],"The tender reaches the next relay under its own power."],
   ["Trade repair stores",[1,-1,0,0],"Their reserve propellant costs you a hull patch."],
   ["Transmit their position",[0,0,0,0],"You relay the beacon and keep your escort together."]]],
  ["Silent service dock","An automated dock accepts ration cartridges as maintenance payment.",[
   ["Repair hull",[0,4,-2,0],"Dock arms restore damaged plating."],
   ["Exchange for fuel",[3,0,-2,0],"The dock transfers reserve propellant."],
   ["Continue patrol",[0,0,0,0],"The convoy clears the docking lane."]]],
  ["Garden freighter","A mobile greenhouse has surplus stores but worn shielding.",[
   ["Exchange shield panels",[0,-2,3,0],"Fresh provisions replace a pair of spare shield panels."],
   ["Donate provisions",[0,0,-1,15],"Your supplies support their next harvest cycle."],
   ["Offer navigation charts",[0,0,0,0],"You exchange greetings and safe approach bearings."]]],
  ["Frost on the intake","Condensed ice is clogging a convoy radiator.",[
   ["Flush with propellant",[-1,2,0,0],"The radiator clears and the hull cools."],
   ["Use maintenance stores",[0,3,-1,0],"A careful service stop restores the cooling loop."],
   ["Isolate the intake",[0,0,0,0],"The intact reserve radiator handles the remaining load."]]],
  ["Prospector's cache","A prospecting crew offers tankage in exchange for equipment.",[
   ["Trade provisions",[2,0,-1,0],"Fresh provisions buy two measures of propellant."],
   ["Trade armor stock",[3,-2,0,0],"The cache refuels you in exchange for repair material."],
   ["Keep your reserves",[0,0,0,0],"You leave the cache undisturbed."]]],
  ["Children of the relay","A small relay habitat is waiting for its delayed supply shuttle.",[
   ["Leave a relief pallet",[0,0,-2,25],"The habitat receives essential supplies."],
   ["Help repair their antenna",[-1,-1,0,20],"Their restored antenna reaches the delayed shuttle."],
   ["Forward the supply request",[0,0,0,0],"You pass the request to the next relay."]]],
  ["Drifting workshop","A drifting machine shop can fabricate parts from your cargo pallets.",[
   ["Fabricate hull patches",[0,4,-2,0],"New patches reinforce the convoy."],
   ["Fabricate ration containers",[-1,0,2,0],"A fuel-powered production cycle replenishes stores."],
   ["Decline service",[0,0,0,0],"The workshop returns to its steady drift."]]],
  ["Solar window","A short-lived alignment offers a clean refueling opportunity.",[
   ["Deploy collectors",[2,-1,0,0],"The collectors return fuel with some heat damage."],
   ["Cool and inspect",[0,2,-1,0],"A maintenance pause restores hull integrity."],
   ["Keep formation",[0,0,0,0],"You retain the convoy's current reserves."]]],
  ["The long watch","An exhausted cargo crew requests an escort through the next relay.",[
   ["Escort their shuttle",[-1,0,-1,20],"The shuttle reaches the relay safely."],
   ["Exchange emergency stores",[0,-1,2,0],"A spare patch buys two supply pallets."],
   ["Share a safe route",[0,0,0,0],"You transmit the charted corridor."]]],
  ["Wreck salvage","A marked wreck contains sealed tanks and intact bulkheads.",[
   ["Recover fuel tanks",[2,-2,0,0],"Grappling strain costs plating but recovers propellant."],
   ["Recover repair stock",[-1,3,0,0],"A maneuvering burn brings usable panels aboard."],
   ["Respect the marker",[0,0,0,0],"The convoy leaves the wreck for its registered salvager."]]],
  ["Courier at the crossing","A courier has missed a rendezvous and needs a small reserve.",[
   ["Give fuel",[-1,0,0,10],"The courier resumes the delivery route."],
   ["Give provisions",[0,0,-1,10],"The courier can wait safely for a new rendezvous."],
   ["Relay the message",[0,0,0,0],"You transmit a revised rendezvous request."]]],
  ["Quiet anchorage","A sheltered anchorage gives you time to redistribute reserves.",[
   ["Reinforce plating",[-1,2,-1,0],"A small service burn and spare stores strengthen the hull."],
   ["Convert reserve pallets",[2,0,-2,0],"Your reserve stock trades for sealed fuel cartridges."],
   ["Depart on schedule",[0,0,0,0],"The convoy leaves in good order."]]]
 ];
 function create(seed){
  if(!Number.isInteger(seed)||seed<0||seed>0xffffffff)throw Error("Invalid seed");
  const deck=events.map((_,i)=>i);let rng=seed;
  for(let i=deck.length-1;i>0;i--){rng=(Math.imul(rng,1664525)+1013904223)>>>0;const j=rng%(i+1);[deck[i],deck[j]]=[deck[j],deck[i]];}
  return {seed,deck,leg:0,phase:"route",resources:[9,10,6],merit:0,history:[],log:[],outcome:null};
 }
 function affordable(s,delta){return s.resources.every((n,i)=>n+delta[i]>=(i===1?1:0));}
 function choices(s){
  if(s.phase==="result")return [];
  if(s.phase==="route")return routes.map(r=>({...r,allowed:affordable(s,r.delta)}));
  return events[s.deck[s.leg-1]][2].map((c,i)=>({id:String(i),title:c[0],delta:c[1],text:c[2],allowed:affordable(s,c[1])}));
 }
 function apply(s,id){
  const c=choices(s).find(c=>c.id===id);if(!c||!c.allowed)throw Error("Unavailable choice");
  const before=s.resources.slice();
  s.resources=s.resources.map((n,i)=>Math.min([15,10,12][i],n+c.delta[i]));s.merit+=c.delta[3];
  s.history.push(id);s.log.push({leg:s.phase==="route"?s.leg+1:s.leg,title:c.title,text:c.text,before,after:s.resources.slice(),merit:c.delta[3]});
  if(s.phase==="route"){s.leg++;s.phase=s.leg===6?"result":"event";if(s.leg===6)s.outcome="arrived";}
  else{s.phase="route";if(!choices(s).some(c=>c.allowed)){s.phase="result";s.outcome="stranded";}}
 }
 function pack(s){return {schema:1,rules:1,seed:s.seed,actions:s.history.slice()};}
 function restore(value){
  if(!value||value.schema!==1||value.rules!==1||!Array.isArray(value.actions)||value.actions.length>11)throw Error("Unsupported convoy save");
  const s=create(value.seed);for(const action of value.actions){if(typeof action!=="string")throw Error("Invalid choice");apply(s,action);}return s;
 }
 function score(s){return s.leg*100+s.merit+(s.outcome==="arrived"?1000+s.resources[0]*10+s.resources[1]*25+s.resources[2]*15:0);}
 root.ConvoyRules={routes,events,create,choices,apply,pack,restore,score};
})(globalThis);
