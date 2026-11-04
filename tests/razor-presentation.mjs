import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const root=path.resolve(import.meta.dirname,'..'),folder=path.join(root,'Web-and-Papyrus/starcade.arcade/launcher/games/razor-derby');
const c={window:{}};
for(const f of ['engine.js','legacy-season.js','season.js','presentation.js'])vm.runInNewContext(fs.readFileSync(path.join(folder,f),'utf8'),c);
const L=c.window.RazorSeason,P=c.window.RazorPresentation,E=c.RazorDerby;
assert.equal(P.leaders(L.create(1)).length,0);assert.equal(P.leaders(L.createLegacy(1)).length,0);assert.equal(P.leaders(L.create(1),'previous').length,0);
// Synthetic accepted fixtures exercise presentation attribution, not balance.
function finish(s){const m=L.start(s);m.tick=E.LIMIT;m.phase='result';m.goals=[2,0];m.individual.forEach(p=>p.ticks=E.LIMIT);m.individual[5].goals=2;m.individual[5].shots=3;m.individual[1].assists=1;
 const others=Array.from({length:3},()=>{const a=E.create(1);a.individual.forEach(p=>p.ticks=E.LIMIT);return {goals:[0,0],individual:a.individual,stats:a.stats,metricsFromTick:0};});return L.settle(s,m,L.round(s),others);}
let s=L.create(42);for(let i=0;i<7;i++)s=finish(s);
assert.equal(P.leaders(s).length,48);assert.equal(P.leaders(s)[0].id,'t0p5');assert.equal(P.leaders(s)[0].stats.goals,14);assert.equal(P.leaders(s)[1].rank,2);assert.equal(P.leaders(s).at(-1).rank,2);
s=L.nextSeason(s,43);s.lineups.forEach((row,t)=>{row[1]=`t${t}p6`;row[2]=`t${t}p7`;});s=L.restore(s);s=finish(s);
assert.equal(P.leaders(s,'career').length,64);assert.equal(P.leaders(s,'previous')[0].stats.goals,14);assert.equal(P.leaders(s,'current')[0].stats.goals,2);assert.equal(P.leaders(s,'career')[0].stats.goals,16);assert.equal(P.leaders(s,'previous','assists')[0].id,'t0p1');assert.equal(P.leaders(s,'current','invalid').length,0);
console.log('Presentation data: actual-stat projection, shared ties, empty/legacy, current/career/archive coverage and64 athletes passed. Synthetic fixtures.');
const browser=await chromium.launch({headless:true,executablePath:process.env.STARCADE_BROWSER||undefined});
try{
 const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{const fixture=sessionStorage.getItem('visual.fixture');if(fixture)localStorage.setItem('starcade.razor-derby.career.v2',fixture);});
 await page.goto(pathToFileURL(path.join(folder,'index.html')).href);await page.evaluate(v=>localStorage.setItem('starcade.razor-derby.career.v2',JSON.stringify(v)),s);await page.locator('#season').click();
 assert.equal(await page.locator('#leagueSummary tbody tr').count(),8);
 await page.screenshot({path:path.resolve(root,'../Razor-League-Visual-2026-11-03.png')});
 await page.locator('#roster').click();assert.equal(await page.locator('.player-card').count(),8);assert.match(await page.locator('[data-player=t0p6]').textContent(),/Starting slot 1/);
 const before=await page.evaluate(()=>localStorage.getItem('starcade.razor-derby.career.v2'));
 await page.screenshot({path:path.resolve(root,'../Razor-Roster-Visual-2026-11-03.png')});
 assert.equal(await page.locator('#recordPanel').evaluate(el=>el.scrollTop),0,'Panels must open at their heading, not scroll to Back');
 await page.getByRole('button',{name:'Season 1',exact:true}).click();assert.match(await page.locator('[data-player=t0p1]').textContent(),/Starting slot 1/);assert.doesNotMatch(await page.locator('.roster-grid').textContent(),/Career level/);assert.equal(await page.getByRole('button',{name:'Train Faye Vale (1 point)',exact:true}).count(),0);await page.getByRole('button',{name:'Current season',exact:true}).click();
 await page.keyboard.press('Escape');await page.locator('#leaders').click();await page.getByRole('button',{name:'Career totals',exact:true}).click();
 assert.equal(await page.locator('#recordList tbody tr').count(),12);assert.match(await page.locator('#recordList').textContent(),/64 tracked athletes/);
 await page.getByRole('button',{name:'Next players',exact:true}).click();assert.equal(await page.locator('#recordList tbody tr').count(),12);
 for(let i=0;i<4;i++)await page.getByRole('button',{name:'Next players',exact:true}).click();assert.equal(await page.locator('#recordList tbody tr').count(),4);assert.equal(await page.getByRole('button',{name:'Next players',exact:true}).isDisabled(),true);
 await page.getByRole('button',{name:'Latest archived season',exact:true}).click();assert.match(await page.locator('#recordList tbody tr').first().textContent(),/Faye Vale/);await page.getByRole('button',{name:'Assists',exact:true}).click();assert.match(await page.locator('#recordList tbody tr').first().textContent(),/Bryn Vale/);
 assert.equal(await page.evaluate(()=>localStorage.getItem('starcade.razor-derby.career.v2')),before,'Read-only leader navigation must not mutate career');
 await page.screenshot({path:path.resolve(root,'../Razor-Leaders-Visual-2026-11-03.png')});
 await page.setViewportSize({width:900,height:650});await page.screenshot({path:path.resolve(root,'../Razor-Leaders-Compact-2026-11-03.png')});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.keyboard.press('Escape');await page.locator('#start').click();await page.waitForTimeout(100);await page.keyboard.press('y');
 await page.locator('#roster').click();assert.equal(await page.getByRole('button',{name:'Train Faye Vale (1 point)',exact:true}).isDisabled(),true);
 // Same forwarded-controller message used by actual host. Back leaves panel paused.
 await page.evaluate(()=>postMessage({channel:'starcade',type:'input',value:{key:'Escape',down:true}},'*'));await page.locator('#recordPanel').waitFor({state:'hidden'});assert.equal(await page.locator('#overlay').isVisible(),true);
 await page.setViewportSize({width:1600,height:1000});await page.locator('#start').click();await page.waitForTimeout(200);await page.screenshot({path:path.resolve(root,'../Razor-Arena-Visual-2026-11-03.png')});
 const target=await page.locator('#target').textContent();assert.ok(s.rosters[0].some(p=>target.includes(p.name)),'League passing cue must identify the actual athlete');
 await page.evaluate(()=>{const v=JSON.parse(localStorage.getItem('starcade.razor-derby.career.v2'));v.match=RazorSeason.start(v);v.match.tick=RazorDerby.LIMIT;v.match.phase='result';sessionStorage.setItem('visual.fixture',JSON.stringify(v));});await page.reload();
 await page.evaluate(()=>{RazorSeason.simulateRoundAsync=async()=>Array.from({length:3},()=>{const m=RazorDerby.create(1);return {goals:[0,0],stats:m.stats,individual:m.individual,metricsFromTick:0};});});
 await page.locator('#season').click();await page.locator('#start').click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('starcade.razor-derby.career.v2')).results.length===8);
 assert.match(await page.locator('#matchTeams').textContent(),/Vector Wolves/,'Result scoreboard must identify the played opponent');assert.match(await page.locator('#heading').textContent(),/Aurora Guard/,'Next fixture remains distinct');
 await page.evaluate(()=>sessionStorage.setItem('visual.fixture',JSON.stringify(RazorSeason.create(1))));await page.reload();await page.locator('#season').click();await page.locator('#history').click();assert.equal(await page.locator('#closeRecords').evaluate(el=>el===document.activeElement),true);
 assert.deepEqual(errors,[]);console.log('Browser: eight-club standings, adjacent roster actions/locks,64-player paging, historical leaders, no display writes, compact overflow and forwarded controller Back passed. Visual captures saved; Starfield not tested.');
}finally{await browser.close();}
