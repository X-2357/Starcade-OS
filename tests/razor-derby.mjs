import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const folder=path.resolve(import.meta.dirname,'../Web-and-Papyrus/starcade.arcade/launcher/games/razor-derby');
vm.runInThisContext(fs.readFileSync(path.join(folder,'engine.js'),'utf8'));
const E=globalThis.RazorDerby;
assert.deepEqual(E.restore(E.create(42)),E.create(42));
for(const bad of [null,{}, {...E.create(1),control:6},{...E.create(1),tick:NaN},{...E.create(1),phase:'result'}])assert.throws(()=>E.restore(bad));
for(const side of [0,1]){
 const s=E.create(1);s.players.forEach(p=>{p.y=5;});s.ball={x:side===0?99.9:.1,y:30,vx:side===0?47:-47,vy:0,owner:-1,ignore:-1,flight:20};
 E.step(s);assert.equal(s.goals[side],1);assert.equal(s.possession,1-side);
}
const clock=E.create(2);clock.shotClock=1;E.step(clock);assert.equal(clock.stats.turnovers[0],1);assert.equal(clock.possession,1);
const loose=E.create(3);loose.ball={x:50,y:5,vx:0,vy:0,owner:-1,ignore:-1,flight:299};E.step(loose);assert.ok(loose.ball.owner>=0);
const pass=E.create(4);pass.players[5].cool=0;assert.equal(E.pass(pass,5),true);assert.equal(pass.ball.owner,-1);assert.equal(pass.stats.passes[0],1);
const save=E.create(5);save.players[6].x=96;save.players[6].y=30;save.ball={x:95.6,y:30,vx:47,vy:0,owner:-1,ignore:5,flight:40};E.step(save);assert.equal(save.stats.saves[1],1);
function pilot(s){
 const p=s.players[s.control],own=s.ball.owner===s.control;
 const carrier=s.ball.owner>=0?s.players[s.ball.owner]:s.ball;
 const pressure=Math.min(...s.players.slice(6).map(q=>E.distance(p,q)));
 return own?{x:1,y:(30-p.y)*.1,shoot:p.x>70,pass:pressure<5&&p.x<70,sprint:true}:{x:carrier.x-p.x,y:carrier.y-p.y,pass:true};
}
let total=[0,0];const began=performance.now();
for(let seed=0;seed<30;seed++){
 const s=E.create(seed);
 for(let tick=0;tick<E.LIMIT;tick++){
  E.step(s,pilot(s));
  if(tick%300===0)assert.deepEqual(E.restore(s),s);
 }
 assert.equal(s.phase,'result');assert.equal(s.tick,E.LIMIT);
 total[0]+=s.goals[0];total[1]+=s.goals[1];
}
assert.ok(total[0]>0&&total[1]>0,`Both teams must score in full play: ${total}`);
const a=E.create(7);for(let i=0;i<2700;i++)E.step(a,pilot(a));const b=E.restore(a);
for(let i=0;i<2000;i++){const input=pilot(a);E.step(a,input);E.step(b,input);}assert.deepEqual(a,b);
console.log(`Engine: 30 complete matches, goals ${total}, ${(performance.now()-began).toFixed(0)}ms; restore/score/save/clock/pass fixtures passed.`);
if(process.env.RAZOR_ENGINE_ONLY)process.exit(0);
const browser=await chromium.launch({headless:true,executablePath:process.env.STARCADE_BROWSER||undefined});
try{
 const page=await browser.newPage({viewport:{width:1400,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(pathToFileURL(path.join(folder,'index.html')).href);
 await page.locator('#start').click();
 await page.keyboard.down('ArrowRight');await page.waitForTimeout(600);await page.keyboard.up('ArrowRight');
 await page.keyboard.press('y');assert.equal(await page.locator('#overlay').isVisible(),true);
 const paused=await page.evaluate(()=>JSON.parse(localStorage.getItem('starcade.razor-derby.match.v1')));
 assert.ok(paused.players[5].x>46);assert.equal(paused.phase,'paused');
 await page.reload();assert.equal(await page.locator('#overlay').isVisible(),true);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('starcade.razor-derby.match.v1')).tick),paused.tick);
 await page.locator('#start').click();await page.keyboard.press('x');await page.waitForTimeout(100);await page.keyboard.press('y');
 await page.locator('#new').click();assert.match(await page.locator('#new').textContent(),/Confirm/);
 await page.locator('#new').click();await page.waitForTimeout(100);await page.keyboard.press('y');
 await page.screenshot({path:path.resolve(import.meta.dirname,'../../../Razor-Derby-2026-11-02.png')});
 // Result reload and corrupted-save recovery are exercised without waiting 2 wall-clock minutes.
 await page.addInitScript(()=>{const fixture=sessionStorage.getItem('razor.fixture');if(fixture)localStorage.setItem('starcade.razor-derby.match.v1',fixture);});
 await page.evaluate(()=>{const s=RazorDerby.create(8);s.tick=RazorDerby.LIMIT;s.phase='result';s.goals=[2,1];sessionStorage.setItem('razor.fixture',JSON.stringify(s));});
 await page.addInitScript(()=>{window.finishes=0;addEventListener('message',e=>{if(e.data.type==='finish')finishes++});});
 await page.reload();assert.match(await page.locator('#heading').textContent(),/Teal victory/);assert.equal(await page.evaluate(()=>finishes),0);
 await page.evaluate(()=>{const s=RazorDerby.create(8);s.tick=RazorDerby.LIMIT-3;s.phase='paused';sessionStorage.setItem('razor.fixture',JSON.stringify(s));});
 await page.reload();await page.locator('#start').click();await page.waitForFunction(()=>finishes===1);
 assert.match(await page.locator('#heading').textContent(),/Honors even/);
 await page.evaluate(()=>sessionStorage.removeItem('razor.fixture'));await page.reload();assert.equal(await page.evaluate(()=>finishes),0);
 await page.evaluate(()=>sessionStorage.setItem('razor.fixture','{"schema":999}'));await page.reload();assert.match(await page.locator('#notice').textContent(),/could not be restored/);
 assert.deepEqual(errors,[]);
 const drill=await browser.newPage();
 await drill.addInitScript(()=>{window.awards=[];addEventListener('message',e=>{if(['score','finish','save'].includes(e.data.type))awards.push(e.data.type);});});
 await drill.goto(pathToFileURL(path.join(folder,'index.html')).href);
 await drill.locator('#start').click();await drill.waitForTimeout(100);await drill.keyboard.press('y');
 const exhibition=await drill.evaluate(()=>localStorage.getItem('starcade.razor-derby.match.v1'));
 await drill.evaluate(()=>{const s=RazorDerby.create(1);s.tick=RazorDerby.LIMIT-3;s.phase='paused';localStorage.setItem('starcade.razor-derby.practice.v1',JSON.stringify(s));});
 await drill.locator('#practice').click();
 await drill.evaluate(()=>{awards=[];});await drill.locator('#start').click();await drill.waitForTimeout(100);await drill.keyboard.press('y');
 assert.match(await drill.locator('#mode').textContent(),/PRACTICE/);
 assert.deepEqual(await drill.evaluate(()=>awards),[]);
 assert.equal(await drill.evaluate(()=>localStorage.getItem('starcade.razor-derby.match.v1')),exhibition);
 await drill.reload();assert.match(await drill.locator('#mode').textContent(),/EXHIBITION/);
 await drill.locator('#practice').click();assert.equal(await drill.locator('#overlay').isVisible(),true);
 await drill.close();
 // Both ends of close-checkpoint seam: actual launcher and game; native API stubbed.
 const launcher=await browser.newPage(),view=path.resolve(folder,'../..');
 await launcher.route('http://starcade.test/**',async route=>{
  const rel=new URL(route.request().url()).pathname;
  if(rel.endsWith('/shared/osfui.js')){await route.fulfill({contentType:'text/javascript',body:'window.osfui={available:()=>false};'});return;}
  const file=path.join(view,rel);if(!fs.existsSync(file)||!fs.statSync(file).isFile()){await route.fulfill({status:404,body:''});return;}
  await route.fulfill({body:fs.readFileSync(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream'});
 });
 await launcher.goto('http://starcade.test/index.html');await launcher.locator('.game-card').filter({hasText:'Razor Derby'}).click();
 const game=launcher.frameLocator('#gameFrame');await game.locator('#start').click();
 await launcher.evaluate(()=>document.getElementById('gameFrame').contentWindow.postMessage({channel:'starcade',type:'input',value:{key:'ArrowRight',down:true}},'*'));
 await launcher.waitForTimeout(400);
 // Close from the launcher, not game's own Return button.
 await launcher.locator('#backButton').click();
 await launcher.waitForFunction(()=>JSON.parse(localStorage.getItem('starcade.save.razor-derby')||'null')?.phase==='paused');
 const checkpoint=await launcher.evaluate(()=>JSON.parse(localStorage.getItem('starcade.save.razor-derby')));
 assert.ok(checkpoint.tick>0);assert.ok(checkpoint.players[5].x>46);
 await launcher.locator('.game-card').filter({hasText:'Razor Derby'}).click();await game.getByRole('heading',{name:'Exhibition paused'}).waitFor();
 assert.equal(await game.locator('#heading').textContent(),'Exhibition paused');
 const beforeStale=await launcher.evaluate(()=>localStorage.getItem('starcade.save.razor-derby'));
 await launcher.frames().find(f=>f.url().includes('razor-derby/index.html')).evaluate(()=>parent.postMessage({channel:'starcade',game:'razor-derby',session:-1,type:'save',value:{poison:true}},'*'));
 await launcher.waitForTimeout(50);assert.equal(await launcher.evaluate(()=>localStorage.getItem('starcade.save.razor-derby')),beforeStale);
 await game.locator('#start').click();
 await launcher.locator('#gameFrame').evaluate(el=>el.contentWindow.addEventListener('message',e=>{if(e.data?.type==='prepareClose')e.stopImmediatePropagation();},true));
 await launcher.locator('#backButton').click();await launcher.waitForFunction(()=>document.getElementById('gameFrame').src==='about:blank');
 // Existing turn-based game's launcher Back still closes synchronously.
 await launcher.locator('.game-card').filter({hasText:'Constellation Cards'}).click();await launcher.frameLocator('#gameFrame').locator('#hand button').first().waitFor();
 assert.equal(await launcher.evaluate(()=>{document.getElementById('backButton').click();return document.getElementById('gameFrame').src;}),'about:blank');
 await launcher.close();
 console.log('Browser: movement, pause/restore, pass, abandon confirmation, result/corrupt restore, launcher close checkpoint and reopen passed. Not a Starfield test.');
}finally{await browser.close();}
