"use strict";
(()=>{
 const E=RazorDerby,teams=['Relay Runners','Ion Comets','Vector Wolves','Aurora Guard'];
 const fixtures=[[[0,1],[2,3]],[[0,2],[1,3]],[[0,3],[1,2]]];
 function create(seed){if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('Invalid season seed');return {schema:1,seed,results:[],match:null};}
 function round(s){return s.results.length/2;}
 function start(s){if(round(s)>=3)throw Error('Season complete');return E.create((s.seed+Math.imul(round(s)+1,2654435761))>>>0);}
 function pilot(s){const p=s.players[s.control],b=s.ball.owner>=0?s.players[s.ball.owner]:s.ball;return s.ball.owner===s.control?{x:1,y:(30-p.y)*.1,shoot:p.x>70,pass:Math.min(...s.players.slice(6).map(q=>E.distance(p,q)))<5&&p.x<70,sprint:true}:{x:b.x-p.x,y:b.y-p.y,pass:true};}
 function simulate(seed){const m=E.create(seed);for(let i=0;i<E.LIMIT;i++)E.step(m,pilot(m));return m.goals.slice();}
 function settle(s,match,expected,otherGoals){const r=round(s);if(expected!==r||r>=3||match.phase!=='result')throw Error('Stale season result');E.restore(match);if(otherGoals&&(!Array.isArray(otherGoals)||otherGoals.length!==2||!otherGoals.every(n=>Number.isInteger(n)&&n>=0&&n<=240)))throw Error('Invalid opponent result');const next=JSON.parse(JSON.stringify(s));const other=fixtures[r][1];next.results.push({round:r,a:0,b:r+1,goals:match.goals.slice()},{round:r,a:other[0],b:other[1],goals:otherGoals||simulate((s.seed+r*7919)>>>0)});next.match=null;return next;}
 function table(s){const rows=teams.map((name,id)=>({id,name,played:0,points:0,for:0,against:0}));for(const m of s.results){const a=rows[m.a],b=rows[m.b];a.played++;b.played++;a.for+=m.goals[0];a.against+=m.goals[1];b.for+=m.goals[1];b.against+=m.goals[0];a.points+=m.goals[0]>m.goals[1]?3:m.goals[0]===m.goals[1]?1:0;b.points+=m.goals[1]>m.goals[0]?3:m.goals[1]===m.goals[0]?1:0;}return rows.sort((a,b)=>b.points-a.points||(b.for-b.against)-(a.for-a.against)||b.for-a.for||a.id-b.id);}
 function restore(v){if(!v||v.schema!==1||!Array.isArray(v.results)||![0,2,4,6].includes(v.results.length))throw Error('Unsupported season');create(v.seed);const s=JSON.parse(JSON.stringify(v));s.results.forEach((m,i)=>{const r=Math.floor(i/2),f=fixtures[r][i%2];if(m.round!==r||m.a!==f[0]||m.b!==f[1]||!Array.isArray(m.goals)||m.goals.length!==2||!m.goals.every(n=>Number.isInteger(n)&&n>=0&&n<=240))throw Error('Invalid fixture');});if(s.match){if(round(s)>=3)throw Error('Unexpected active match');s.match=E.restore(s.match);}return s;}
 function simulateAsync(seed){const m=E.create(seed);return new Promise(resolve=>{function batch(){for(let i=0;i<120&&m.phase!=="result";i++)E.step(m,pilot(m));if(m.phase==="result")resolve(m.goals.slice());else requestAnimationFrame(batch);}requestAnimationFrame(batch);});}
 window.RazorSeason={simulateAsync,teams,create,round,start,settle,table,restore,simulate};
})();
