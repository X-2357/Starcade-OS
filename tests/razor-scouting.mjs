import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const root=path.resolve(import.meta.dirname,'..'),folder=path.join(root,'Web-and-Papyrus/starcade.arcade/launcher/games/razor-derby');
const c={window:{}};for(const f of ['engine.js','legacy-season.js','season.js','presentation.js'])vm.runInNewContext(fs.readFileSync(path.join(folder,f),'utf8'),c);
const S=c.window.RazorSeason,P=c.window.RazorPresentation,E=c.RazorDerby;
assert.equal(P.scouting(null),null);assert.equal(P.scouting(S.createLegacy(1)),null);
let s=S.create(4);assert.equal(P.scouting(s).recent.length,0);const snapshots=[];
for(let r=0;r<7;r++){
 snapshots.push(s);const bytes=JSON.stringify(s),v=P.scouting(s),m=S.start(s);
 assert.equal(v.round,r+1);assert.equal(v.opponent,Number(m.leagueLineup[6][1]));assert.equal(v.clubs[1].players.map(p=>p.id).join(),m.leagueLineup.slice(6).join());assert.equal(v.clubs[0].players.length,6);assert.equal(JSON.stringify(s),bytes);
 assert.equal(P.scouting({...s,match:m}),null);
 const f=()=>{const a=E.create(1);a.tick=E.LIMIT;a.phase='result';a.goals=[2,1];a.individual.forEach(p=>p.ticks=E.LIMIT);return a;};const match=S.start(s);Object.assign(match,{tick:E.LIMIT,phase:'result',goals:[2,1]});match.individual.forEach(p=>p.ticks=E.LIMIT);
 s=S.settle(s,match,r,[f(),f(),f()]);
}
assert.equal(P.scouting(s),null);
const changed=S.changeLineup(snapshots[1],1,'t0p6');assert.equal(P.scouting(changed).clubs[0].players[1].id,'t0p6');
const v=P.scouting(snapshots[3]),opp=v.opponent;for(const row of v.recent){const m=snapshots[3].results.find(m=>m.round===row.round-1&&(m.a===opp||m.b===opp));assert.equal(row.own,m.goals[m.a===opp?0:1]);assert.equal(row.result,row.own>row.against?'W':row.own<row.against?'L':'D');}
console.log('Scouting: all seven opponents agree with actual engine fixture lineups, changed starters, opponent-perspective accepted results, missing/legacy/active/final guards and byte immutability passed.');
const browser=await chromium.launch({headless:true,executablePath:process.env.STARCADE_BROWSER||undefined});
try{
 const page=await browser.newPage({viewport:{width:1600,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{const s=sessionStorage.getItem('scout.fixture');if(s)localStorage.setItem('starcade.razor-derby.career.v2',s);});
 await page.goto(pathToFileURL(path.join(folder,'index.html')).href);await page.locator('#season').click();await page.locator('#scout').click();assert.match(await page.locator('#recordsTitle').textContent(),new RegExp(S.teams[1]));assert.match(await page.locator('#recordList').textContent(),/No current-season results/);await page.keyboard.press('Escape');
 await page.evaluate(v=>{sessionStorage.setItem('scout.fixture',JSON.stringify(v));localStorage.setItem('starcade.razor-derby.career.v2',JSON.stringify(v));},snapshots[3]);await page.reload();await page.locator('#season').click();const bytes=await page.evaluate(()=>localStorage.getItem('starcade.razor-derby.career.v2'));await page.locator('#scout').click();assert.match(await page.locator('#recordsTitle').textContent(),new RegExp(S.teams[4]));assert.equal(await page.locator('#recordList .player-card').count(),12);
 await page.screenshot({path:path.resolve(root,'../Razor-Scouting-2026-11-03.png')});await page.keyboard.press('PageDown');assert.ok(await page.locator('#recordPanel').evaluate(el=>el.scrollTop)>0);await page.getByRole('button',{name:'Manage your lineup',exact:true}).click();assert.equal(await page.locator('#recordsTitle').textContent(),'Rosters & player statistics');assert.equal(await page.evaluate(()=>localStorage.getItem('starcade.razor-derby.career.v2')),bytes);await page.keyboard.press('Escape');
 await page.evaluate(()=>requestAnimationFrame=()=>0);await page.locator('#start').click();await page.keyboard.press('y');assert.equal(await page.locator('#scout').isVisible(),false);await page.locator('#scout').evaluate(el=>el.click());assert.equal(await page.locator('#recordPanel').isVisible(),false);assert.deepEqual(errors,[]);
 const pending=JSON.parse(JSON.stringify(snapshots[1]));pending.match=S.start(pending);pending.match.tick=E.LIMIT;pending.match.phase='result';
 await page.evaluate(v=>sessionStorage.setItem('scout.fixture',JSON.stringify(v)),pending);await page.reload();await page.locator('#season').click();assert.equal(await page.locator('#scout').isVisible(),false);
 await page.evaluate(()=>RazorSeason.simulateRoundAsync=async()=>Array.from({length:3},()=>{const m=RazorDerby.create(1);return {goals:[0,0],stats:m.stats,individual:m.individual,metricsFromTick:0};}));await page.locator('#start').click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('starcade.razor-derby.career.v2')).results.length===8);await page.locator('#scout').click();assert.match(await page.locator('#recordsTitle').textContent(),new RegExp(S.teams[3]));assert.deepEqual(errors,[]);
 console.log('Browser: first/next opponent,12 starter cards, read-only career bytes, roster route, paging/Back, active/unsettled guards, actual settlement to next scouting and reload passed. Synthetic fixtures; Starfield unverified.');
}finally{await browser.close();}
