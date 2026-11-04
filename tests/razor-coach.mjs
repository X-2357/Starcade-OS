import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const root=path.resolve(import.meta.dirname,'..'),folder=path.join(root,'Web-and-Papyrus/starcade.arcade/launcher/games/razor-derby');
const c={window:{}};for(const f of ['engine.js','coach.js'])vm.runInNewContext(fs.readFileSync(path.join(folder,f),'utf8'),c);
const E=c.RazorDerby,C=c.window.RazorCoach,s=E.create(1);
s.players.forEach(p=>{p.cool=0;if(p.id>=6){p.x=90;p.y=55;}});Object.assign(s.players[5],{x:40,y:30});Object.assign(s.players[4],{x:60,y:30});
let before=JSON.stringify(s);assert.equal(C.model(s,4).covered,false);assert.equal(JSON.stringify(s),before);assert.match(C.model(s,4).action,/A shoot/);
s.players[7].x=50;s.players[7].y=31.59;assert.equal(C.model(s,4).covered,true);s.players[7].y=31.61;assert.equal(C.model(s,4).covered,false);
s.players[7].y=55;s.players[6].x=50;s.players[6].y=32.59;assert.equal(C.model(s,4).covered,true);s.players[6].y=32.61;assert.equal(C.model(s,4).covered,false);
// Both ends: these are the actual engine catch radii, not arbitrary coaching odds.
assert.match(fs.readFileSync(path.join(folder,'engine.js'),'utf8'),/distance\(p,b\)<\(p.id%6===0\?2.6:1.6\)/);
s.players[5].cool=30;assert.equal(C.model(s,4).recovery,.5);assert.match(C.model(s,4).action,/Recovering/);
s.shotClock=240;assert.match(C.model(s,4).hint,/nearly expired/);s.ball.owner=-1;assert.match(C.model(s).action,/Loose ball/);
s.ball.owner=7;s.players[5].cool=0;s.players[7].x=42;s.players[7].y=30;assert.match(C.model(s).action,/challenge ready/);s.players[7].x=70;assert.match(C.model(s).action,/Close the carrier/);
s.ball.owner=4;assert.match(C.model(s).action,/Teammate possession/);s.ball.owner=5;s.players[4].x=40;s.players[4].y=30;assert.ok(Number.isFinite(C.segmentDistance(s.players[6],s.players[4],s.players[5])));assert.equal(C.model(s,-1).covered,null);
s.players[5].energy=200;s.shotClock=-1;assert.equal(C.model(s).energy,100);assert.equal(C.model(s).seconds,0);s.phase='paused';assert.equal(C.model(s).action.split('Paused').length-1,1);s.phase='result';assert.match(C.model(s).action,/Full time/);
assert.equal(C.review(null),null);const legacy=E.create(2);delete legacy.individual;assert.equal(C.review(legacy),null);s.individual[5].passes=2;s.individual[5].completed=1;assert.equal(C.review(s).completed,1);
console.log('Coach model: read-only/RNG equality, engine-radius seam, coverage boundaries, cooldown/pressure/possession modes, zero-length/no target, limits and legacy coverage passed.');
const browser=await chromium.launch({headless:true,executablePath:process.env.STARCADE_BROWSER||undefined});
try{
 const page=await browser.newPage({viewport:{width:1600,height:1150}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{window.publications=[];addEventListener('message',e=>{if(['save','score','finish','derbyPrize'].includes(e.data?.type))publications.push(e.data.type);});});
 await page.goto(pathToFileURL(path.join(folder,'index.html')).href);await page.locator('#coachToggle').click();assert.equal(await page.locator('#coachToggle').getAttribute('aria-pressed'),'false');await page.reload();assert.match(await page.locator('#coachToggle').textContent(),/off/);
 await page.locator('#coachToggle').click();await page.locator('#practice').click();await page.evaluate(()=>publications=[]);await page.locator('#start').click();await page.waitForTimeout(650);await page.keyboard.press('y');
 assert.equal(await page.locator('#coachHud').isVisible(),true);assert.match(await page.locator('#coachAction').textContent(),/Paused/);
 const checkpoint=await page.evaluate(()=>localStorage.getItem('starcade.razor-derby.practice.v1'));
 await page.locator('#practiceReview').click();assert.match(await page.locator('#recordsTitle').textContent(),/Practice team review/);assert.match(await page.locator('#recordList').textContent(),/Passing drill/);assert.equal(await page.locator('#closeRecords').evaluate(el=>el===document.activeElement),true);
 await page.evaluate(()=>postMessage({channel:'starcade',type:'input',value:{key:'Escape',down:true}},'*'));await page.locator('#recordPanel').waitFor({state:'hidden'});assert.equal(await page.locator('#overlay').isVisible(),true);
 assert.equal(await page.evaluate(()=>localStorage.getItem('starcade.razor-derby.practice.v1')),checkpoint);assert.deepEqual(await page.evaluate(()=>publications),[]);
 await page.locator('#start').click();await page.screenshot({path:path.resolve(root,'../Razor-Live-Coach-2026-11-03.png')});await page.keyboard.press('y');await page.locator('#practiceReview').click();await page.screenshot({path:path.resolve(root,'../Razor-Practice-Review-2026-11-03.png')});
 await page.setViewportSize({width:900,height:650});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.locator('#closeRecords').click();
 await page.evaluate(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='starcade.razor-derby.coach.v1')throw Error('test storage failure');return original.call(this,k,v);};});await page.locator('#coachToggle').click();assert.match(await page.locator('#notice').textContent(),/session/);assert.equal(await page.locator('#coachHud').isVisible(),false);
 assert.deepEqual(errors,[]);console.log('Browser: coach preference/reload, blocked storage/session fallback, practice review/counters, paused checkpoint identity, forwarded Back, compact bounds and zero native practice publications passed. Starfield not tested.');
}finally{await browser.close();}
