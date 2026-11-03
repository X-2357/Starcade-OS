import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const folder=path.resolve(import.meta.dirname,'../Web-and-Papyrus/starcade.arcade/launcher/games/razor-derby');
const c={window:{},requestAnimationFrame:fn=>setTimeout(fn,0)};
for(const file of ['engine.js','legacy-season.js','season.js'])vm.runInNewContext(fs.readFileSync(path.join(folder,file),'utf8'),c);
const L=c.window.RazorSeason,E=c.RazorDerby;
assert.equal(L.teams.length,8);assert.equal(new Set(L.rosters.flat().map(p=>p.id)).size,64);
assert.equal(new Set(L.fixtures.flat().map(([a,b])=>[a,b].sort().join(':'))).size,28);
for(let t=0;t<8;t++)assert.equal(L.fixtures.flat().filter(f=>f.includes(t)).length,7);
let s=L.create(42);s=L.changeLineup(s,1,'t0p6');assert.equal(L.start(s).leagueLineup[1],'t0p6');
let playerGoals=0;
for(let round=0;round<7;round++){
 const match=L.start(s);for(let i=0;i<E.LIMIT;i++)E.step(match,{computerBoth:true});
 const others=await L.simulateRoundAsync(s),next=L.settle(s,match,round,others);
 assert.throws(()=>L.settle(next,match,round,others));s=L.restore(next);assert.equal(s.results.length,(round+1)*4);
 playerGoals+=match.individual.slice(0,6).reduce((n,p)=>n+p.goals,0);
 const table=L.table(s);assert.equal(table.reduce((n,t)=>n+t.for,0),table.reduce((n,t)=>n+t.against,0));
}
assert.equal(L.table(s).every(t=>t.played===7),true);
assert.equal(L.rosters[0].reduce((n,p)=>n+L.playerStats(s,p.id).goals,0),playerGoals);
const earned=L.rewards(s).earned;s=L.train(s,'t0p5');assert.equal(L.rewards(s).available,earned-1);
assert.ok(L.rating(s,'t0p5')>0);const first=JSON.stringify(s.results);s=L.nextSeason(s,43);
assert.equal(s.number,2);assert.equal(JSON.stringify(s.archives[0].results),first);assert.equal(L.rewards(s).earned,earned);assert.equal(L.rewards(s).spent,1);
assert.equal(L.playerStats(s,'t0p6').appearances,7);assert.equal(L.playerStats(s,'t0p1').appearances,0);
const before=L.rewards(s).earned,m=L.start(s);for(let i=0;i<E.LIMIT;i++)E.step(m,{computerBoth:true});s=L.settle(s,m,0,await L.simulateRoundAsync(s));assert.ok(L.rewards(s).earned>before);assert.equal(L.playerStats(s,'t0p6').appearances,8);
assert.throws(()=>L.restore({...s,training:Array(41).fill({id:'t0p5',season:1})}));
const legacy=L.restore({schema:1,seed:1,results:[],match:null});assert.equal(L.rounds(legacy),3);
console.log('Career engine: 28 unique fixtures/seven matches per team, 64 identities, real telemetry, lineup/bench, rollover/career totals and duplicate-safe training rewards passed.');
const browser=await chromium.launch({headless:true,executablePath:process.env.STARCADE_BROWSER||undefined});
try{
 const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{
  const f=sessionStorage.getItem('career.fixture');if(f)localStorage.setItem('starcade.razor-derby.career.v2',f);
  window.publications=[];addEventListener('message',e=>{if(['save','score','finish'].includes(e.data.type))publications.push(e.data.type);});
  addEventListener('DOMContentLoaded',()=>{RazorSeason.simulateRoundAsync=async()=>Array.from({length:3},()=>{const m=RazorDerby.create(1);return {goals:[0,0],stats:m.stats,individual:m.individual,metricsFromTick:0};});});
 });
 await page.goto(pathToFileURL(path.join(folder,'index.html')).href);let v=L.create(81);
 for(let r=0;r<7;r++){
  v.match=L.start(v);v.match.tick=E.LIMIT-3;v.match.phase='paused';v.match.goals=[1,0];
  await page.evaluate(x=>sessionStorage.setItem('career.fixture',JSON.stringify(x)),v);await page.reload();await page.locator('#season').click();await page.evaluate(()=>{publications=[];});await page.locator('#start').click();
  await page.waitForFunction(n=>JSON.parse(localStorage.getItem('starcade.razor-derby.career.v2')).results.length===n,(r+1)*4);
  assert.deepEqual(await page.evaluate(()=>publications),[]);v=await page.evaluate(()=>JSON.parse(localStorage.getItem('starcade.razor-derby.career.v2')));
 }
 assert.equal(await page.locator('#heading').textContent(),'Season complete');await page.locator('#fixtures').click();assert.equal(await page.locator('#recordList p').count(),28);await page.keyboard.press('Enter');
 await page.locator('#roster').click();assert.match(await page.locator('#recordList').textContent(),/Ari Vale/);
 await page.getByRole('button',{name:'Train Faye Vale (1 point)',exact:true}).click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('starcade.razor-derby.career.v2')).training.length),1);
 await page.getByRole('button',{name:'Assign Galen Vale to slot 1',exact:true}).click();await page.locator('#closeRecords').click();
 await page.locator('#career').click();assert.match(await page.locator('#recordList').textContent(),/Spent 1/);await page.locator('#closeRecords').click();
 await page.locator('#new').click();await page.evaluate(()=>sessionStorage.removeItem('career.fixture'));
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('starcade.razor-derby.career.v2')).archives.length),1);
 await page.locator('#history').click();assert.match(await page.locator('#recordList').textContent(),/28\/28 fixtures/);await page.locator('#closeRecords').click();
 await page.reload();await page.locator('#season').click();await page.locator('#roster').click();assert.match(await page.locator('#recordList').textContent(),/Galen Vale/);
 await page.screenshot({path:path.resolve(import.meta.dirname,'../../../Razor-Career-2026-11-03.png')});
 assert.deepEqual(errors,[]);console.log('Career browser: seven-round settlement fixtures, roster/training controls, reward ledger, archived season and reload passed. Actual Starfield/human season not tested.');
}finally{await browser.close();}
