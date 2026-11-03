import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const folder=path.resolve(import.meta.dirname,'../Web-and-Papyrus/starcade.arcade/launcher/games/razor-derby');
const c={window:{}};vm.runInNewContext(fs.readFileSync(path.join(folder,'engine.js'),'utf8'),c);vm.runInNewContext(fs.readFileSync(path.join(folder,'legacy-season.js'),'utf8'),c);vm.runInNewContext(fs.readFileSync(path.join(folder,'season.js'),'utf8'),c);
const L=c.window.RazorSeason,E=c.RazorDerby;
let s=L.createLegacy(42);const began=performance.now();
for(let round=0;round<3;round++){const match=L.start(s);match.tick=E.LIMIT;match.phase='result';match.goals=[round+1,0];const next=L.settle(s,match,round);assert.throws(()=>L.settle(next,match,round));s=L.restore(next);assert.equal(s.results.length,(round+1)*2);const table=L.table(s);assert.equal(table.reduce((n,t)=>n+t.for,0),table.reduce((n,t)=>n+t.against,0));}
assert.equal(L.table(s).find(t=>t.id===0).points,9);assert.throws(()=>L.start(s));assert.throws(()=>L.restore({...s,results:s.results.slice(1)}));console.log(`Season engine: 3 rounds/6 fixtures, dedupe, restore, goals conservation passed; opponent simulation ${Math.round(performance.now()-began)}ms total.`);
const browser=await chromium.launch({headless:true,executablePath:process.env.STARCADE_BROWSER||undefined});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{const f=sessionStorage.getItem('season.fixture');if(f)localStorage.setItem('starcade.razor-derby.season.v1',f);window.publications=[];addEventListener('message',e=>{if(['save','score','finish'].includes(e.data.type))publications.push(e.data.type);});});
 await page.goto(pathToFileURL(path.join(folder,'index.html')).href);
 let season=L.createLegacy(81);
 for(let r=0;r<3;r++){
  const m=L.start(season);m.tick=E.LIMIT-3;m.phase='paused';m.goals=[r+1,0];season.match=m;
  await page.evaluate(v=>sessionStorage.setItem('season.fixture',JSON.stringify(v)),season);
  await page.reload();await page.locator('#season').click();await page.evaluate(()=>{publications=[];});await page.locator('#start').click();
  try{await page.waitForFunction(n=>JSON.parse(localStorage.getItem('starcade.razor-derby.season.v1')).results.length===n,(r+1)*2,{timeout:5000});}catch(e){console.log(await page.evaluate(()=>({notice:document.getElementById('notice').textContent,heading:document.getElementById('heading').textContent,stored:localStorage.getItem('starcade.razor-derby.season.v1')})));throw e;}
  assert.deepEqual(await page.evaluate(()=>publications),[]);
  season=await page.evaluate(()=>JSON.parse(localStorage.getItem('starcade.razor-derby.season.v1')));
 }
 await page.locator('#fixtures').click();assert.equal(await page.locator('#recordList p').count(),6);assert.equal((await page.locator('#recordList').textContent()).includes('scheduled'),false);await page.keyboard.press('Enter');
 assert.equal(await page.locator('#heading').textContent(),'Season complete');assert.equal(await page.locator('#start').isVisible(),false);
 await page.evaluate(()=>sessionStorage.removeItem('season.fixture'));await page.reload();await page.locator('#season').click();assert.equal(await page.locator('#heading').textContent(),'Season complete');
 await page.locator('#new').click();assert.equal(await page.locator('#heading').textContent(),'Relay Runners vs Ion Comets');
 await page.locator('#start').click();await page.waitForTimeout(150);await page.keyboard.press('y');
 const checkpoint=await page.evaluate(()=>JSON.parse(localStorage.getItem('starcade.razor-derby.career.v2')));assert.ok(checkpoint.match.tick>0);assert.equal(checkpoint.match.phase,'paused');
 await page.reload();await page.locator('#season').click();assert.equal(await page.locator('#start').textContent(),'Resume league match');
 const prior=await page.evaluate(()=>localStorage.getItem('starcade.razor-derby.career.v2'));await page.locator('#new').click();assert.equal(await page.evaluate(()=>localStorage.getItem('starcade.razor-derby.career.v2')),prior);
 const failure=await browser.newPage();
 const interrupted=L.createLegacy(99);interrupted.match=L.start(interrupted);interrupted.match.tick=E.LIMIT;interrupted.match.phase='result';
 await failure.addInitScript(v=>{
  localStorage.setItem('starcade.razor-derby.season.v1',JSON.stringify(v));
  const original=Storage.prototype.setItem;window.failSeason=true;
  Storage.prototype.setItem=function(k,value){if(k==='starcade.razor-derby.season.v1'&&window.failSeason)throw Error('simulated storage failure');return original.call(this,k,value);};
 },interrupted);
 await failure.goto(pathToFileURL(path.join(folder,'index.html')).href);await failure.locator('#season').click();await failure.locator('#start').click();
 await failure.waitForFunction(()=>document.getElementById('notice').textContent.includes('could not be saved'));
 assert.equal(await failure.evaluate(()=>JSON.parse(localStorage.getItem('starcade.razor-derby.season.v1')).results.length),0);
 await failure.evaluate(()=>{window.failSeason=false;});await failure.locator('#start').click();
 await failure.waitForFunction(()=>JSON.parse(localStorage.getItem('starcade.razor-derby.season.v1')).results.length===2);
 assert.equal(await failure.locator('#notice').textContent(),'Round 1 saved.');
 await failure.screenshot({path:path.resolve(import.meta.dirname,'../../../Razor-Season-2026-11-03.png')});
 const corrupt=await browser.newPage();await corrupt.addInitScript(()=>localStorage.setItem('starcade.razor-derby.season.v1','{"schema":99}'));
 await corrupt.goto(pathToFileURL(path.join(folder,'index.html')).href);await corrupt.locator('#season').click();
 assert.equal(await corrupt.evaluate(()=>localStorage.getItem('starcade.razor-derby.season.v1')),'{"schema":99}');
 await corrupt.locator('#resetSeason').click();assert.equal(await corrupt.evaluate(()=>localStorage.getItem('starcade.razor-derby.season.v1')),'{"schema":99}');
 await corrupt.locator('#resetSeason').click();assert.match(await corrupt.locator('#mode').textContent(),/LEAGUE/);
 assert.deepEqual(errors,[]);console.log('Season browser: three played-match completions, atomic round saves, completed reload/new season, interrupted settlement/storage retry, preserved future data/confirmed reset and zero native reward/save publications passed.');
}finally{await browser.close();}
