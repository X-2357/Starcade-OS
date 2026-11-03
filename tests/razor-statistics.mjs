import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
vm.runInThisContext(fs.readFileSync(new URL('../Web-and-Papyrus/starcade.arcade/launcher/games/razor-derby/engine.js',import.meta.url),'utf8'));
const E=globalThis.RazorDerby;
function passFixture(){const s=E.create(3);for(const p of s.players){p.x=p.id<6?10:90;p.y=p.id<6?5:50;p.cool=0;}Object.assign(s.players[5],{x:50,y:30});Object.assign(s.players[4],{x:55,y:30});s.ball.x=50;s.ball.y=30;assert.equal(E.pass(s,5,4),true);for(let i=0;i<60&&s.ball.owner<0;i++)E.step(s);assert.equal(s.ball.owner,4);assert.equal(s.individual[5].passes,1);assert.equal(s.individual[5].completed,1);return s;}
const s=passFixture();s.players[4].cool=0;assert.equal(E.shoot(s,4),true);Object.assign(s.ball,{x:99.9,y:30,vx:47,vy:0});E.step(s);assert.equal(s.goals[0],1);assert.equal(s.individual[4].goals,1);assert.equal(s.individual[4].shots,1);assert.equal(s.individual[5].assists,1);
const stolen=passFixture();Object.assign(stolen.players[7],{x:stolen.players[4].x,y:stolen.players[4].y});for(let i=0;i<20&&stolen.ball.owner!==7;i++){stolen.players[7].cool=0;E.challenge(stolen,7);}assert.equal(stolen.ball.owner,7);assert.equal(stolen.assistCandidate,null);assert.equal(stolen.individual[7].steals,1);
const keeper=E.create(1);keeper.players[6].x=96;keeper.players[6].y=30;keeper.ball={x:95.6,y:30,vx:47,vy:0,owner:-1,ignore:5,flight:40,kind:'shot',from:5};E.step(keeper);assert.equal(keeper.individual[6].saves,1);
const legacy=E.create(1);delete legacy.individual;delete legacy.metricsFromTick;legacy.tick=600;legacy.goals=[2,0];E.step(legacy);assert.equal(legacy.metricsFromTick,600);assert.equal(legacy.individual[0].ticks,1);assert.equal(legacy.individual.reduce((n,p)=>n+p.goals,0),0);
console.log('Player telemetry: actual pass completion, shot/goal/assist provenance, opposing possession reset, challenge/save credit and no legacy backfill passed.');
