import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const root=path.resolve(import.meta.dirname,'..'),folder=path.join(root,'Web-and-Papyrus/starcade.arcade/launcher/games/razor-derby');
const c={window:{}};for(const f of ['engine.js','aim.js','legacy-season.js','season.js'])vm.runInNewContext(fs.readFileSync(path.join(folder,f),'utf8'),c);
const old={};vm.runInNewContext(execFileSync('git',['show','c5d2c31:Web-and-Papyrus/starcade.arcade/launcher/games/razor-derby/engine.js'],{cwd:root,encoding:'utf8'}),old);
const E=c.RazorDerby,B=old.RazorDerby,A=c.window.RazorAim,L=c.window.RazorSeason;
const same=(a,b)=>assert.equal(JSON.stringify(a),JSON.stringify(b));
// Whole pre-change engine states, not a replacement hand-written implementation.
for(let seed=1;seed<=12;seed++)for(const ai of [true,false]){
 const a=B.create(seed),b=E.create(seed);
 for(let tick=1;tick<=E.LIMIT;tick++){const input=ai?{computerBoth:true}:{x:tick%240<120?1:-1,y:tick%360<180?.5:-.5,sprint:tick%180<30,shoot:tick%97===0,pass:tick%131===0};B.step(a,input);E.step(b,{...input,shotAim:'auto'});if(tick%600===0)same(a,b);}
}
for(let seed=1;seed<=3;seed++){const a=B.create(seed),b=E.create(seed);a.shotAim=b.shotAim='upper';for(let i=0;i<E.LIMIT;i++){B.step(a,{computerBoth:true});E.step(b,{computerBoth:true});}same(a,b);}
function ready(){const s=E.create(2);s.players[5].cool=0;s.players[5].x=79;s.players[5].y=30;s.ball.x=79;s.ball.y=30;return s;}
const upper=ready(),lower=ready(),auto=ready();E.shoot(upper,5,'upper');E.shoot(lower,5,'lower');E.shoot(auto,5);assert.ok(upper.ball.vy<0);assert.ok(lower.ball.vy>0);assert.equal(upper.rng,lower.rng);assert.equal(auto.rng,upper.rng);same(upper.stats,lower.stats);same(upper.individual,lower.individual);
const invalid=ready(),bytes=JSON.stringify(invalid);assert.equal(E.shoot(invalid,5,'future'),false);assert.equal(JSON.stringify(invalid),bytes);assert.equal(E.shotTarget(invalid,5,'future'),null);
invalid.shotAim='upper';assert.equal(E.restore(invalid).shotAim,'upper');assert.throws(()=>E.restore({...invalid,shotAim:'future'}));assert.equal(E.restore(E.create(1)).shotAim,undefined);
const before=JSON.stringify(invalid);assert.equal(A.point(invalid,'upper').y,24);assert.equal(A.point(invalid,'lower').y,36);assert.equal(JSON.stringify(invalid),before);assert.equal(A.next('auto'),'upper');assert.equal(A.next('upper'),'lower');assert.equal(A.next('lower'),'auto');
const action=ready();action.shotAim='lower';E.step(action,{shoot:true});assert.ok(action.ball.vy>0);
console.log('Aim engine:24 complete controlled/AI matches equal pre-change Auto,3 saved-human-aim AI matches unchanged; manual lane/RNG/counters, invalid/restore and pure guide checks passed.');
const browser=await chromium.launch({headless:true,executablePath:process.env.STARCADE_BROWSER||undefined});
try{
 const page=await browser.newPage({viewport:{width:1600,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{window.publications=[];addEventListener('message',e=>{if(['save','score','finish','derbyPrize'].includes(e.data?.type))publications.push(e.data.type);});const v=sessionStorage.getItem('aim.fixture');if(v)localStorage.setItem('starcade.razor-derby.career.v2',v);});
 await page.goto(pathToFileURL(path.join(folder,'index.html')).href);await page.locator('#drills').click();await page.getByRole('button',{name:'Open Finishing chances',exact:true}).click();await page.evaluate(()=>publications=[]);
 await page.keyboard.press('v');assert.match(await page.locator('#shotAim').textContent(),/Upper lane/);await page.evaluate(()=>dispatchEvent(new KeyboardEvent('keydown',{key:'v',repeat:true,bubbles:true})));assert.match(await page.locator('#shotAim').textContent(),/Upper lane/);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('starcade.razor-derby.practice.finishing.v1')).shotAim),'upper');await page.locator('#start').click();await page.screenshot({path:path.resolve(root,'../Razor-Shot-Placement-2026-11-03.png')});await page.keyboard.press('y');
 await page.reload();await page.locator('#drills').click();await page.getByRole('button',{name:'Open Finishing chances',exact:true}).click();assert.match(await page.locator('#shotAim').textContent(),/Upper lane/);await page.locator('#shotAim').click();assert.match(await page.locator('#shotAim').textContent(),/Lower lane/);
 await page.locator('#practiceReview').click();const saved=await page.evaluate(()=>localStorage.getItem('starcade.razor-derby.practice.finishing.v1'));await page.keyboard.press('v');assert.equal(await page.evaluate(()=>localStorage.getItem('starcade.razor-derby.practice.finishing.v1')),saved);await page.keyboard.press('Escape');
 await page.locator('#shotAim').click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('starcade.razor-derby.practice.finishing.v1')).shotAim),undefined);assert.deepEqual(await page.evaluate(()=>publications),[]);
 await page.keyboard.press('v');await page.locator('#new').click();await page.locator('#new').click();await page.waitForTimeout(50);await page.keyboard.press('y');assert.match(await page.locator('#shotAim').textContent(),/Auto/);
 // A retained completed fixture locks aim; next human fixture starts Auto.
 const s=L.create(8);s.match=L.start(s);s.match.tick=E.LIMIT;s.match.phase='result';s.match.shotAim='lower';await page.evaluate(v=>sessionStorage.setItem('aim.fixture',JSON.stringify(v)),s);await page.reload();await page.evaluate(()=>{RazorSeason.simulateRoundAsync=async()=>Array.from({length:3},()=>{const s=RazorDerby.create(1);return {goals:[0,0],stats:s.stats,individual:s.individual,metricsFromTick:0};});});await page.locator('#season').click();assert.equal(await page.locator('#shotAim').isDisabled(),true);await page.locator('#start').click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('starcade.razor-derby.career.v2')).results.length===4);await page.locator('#start').click();await page.waitForTimeout(50);await page.keyboard.press('y');assert.match(await page.locator('#shotAim').textContent(),/Auto/);assert.deepEqual(errors,[]);
 // Actual launcher mapping/held dedupe; native UI event source mocked, game real.
 const launcher=await browser.newPage(),view=path.resolve(folder,'../..');await launcher.route('http://starcade.test/**',async route=>{const rel=new URL(route.request().url()).pathname;if(rel.endsWith('/shared/osfui.js'))return route.fulfill({contentType:'text/javascript',body:'window.handlers={};window.osfui={available:()=>true,ready:Promise.resolve(),on:(k,f)=>handlers[k]=f,send:()=>{}};'});const file=path.join(view,rel);if(!fs.existsSync(file)||!fs.statSync(file).isFile())return route.fulfill({status:404,body:''});await route.fulfill({body:fs.readFileSync(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream'});});
 await launcher.goto('http://starcade.test/index.html');await launcher.locator('.game-card').filter({hasText:'Razor Derby'}).click();const game=launcher.frameLocator('#gameFrame');await game.locator('#practice').click();await game.locator('#shotAim').waitFor({state:'visible'});
 const rs=down=>launcher.evaluate(down=>handlers['ui.gamepad']({kind:'button',button:{id:128,down}}),down);
 await rs(true);await game.getByRole('button',{name:'Aim: Upper lane (V / RS)',exact:true}).waitFor();await rs(true);assert.match(await game.locator('#shotAim').textContent(),/Upper lane/);await rs(false);await rs(true);await game.getByRole('button',{name:'Aim: Lower lane (V / RS)',exact:true}).waitFor();
 await game.locator('#practiceReview').click();await rs(false);await rs(true);assert.equal(await launcher.evaluate(()=>JSON.parse(localStorage.getItem('starcade.razor-derby.practice.v1')).shotAim),'lower');await game.locator('#closeRecords').click();await launcher.locator('#backButton').click();await launcher.waitForFunction(()=>document.getElementById('gameFrame').contentWindow.location.href==='about:blank');
 await launcher.locator('.game-card').filter({hasText:'Constellation Cards'}).click();await launcher.frameLocator('#gameFrame').locator('#hand button').first().waitFor();await launcher.locator('#gameFrame').evaluate(el=>{el.contentWindow.inputKeys=[];el.contentWindow.addEventListener('message',e=>{if(e.data?.type==='input')el.contentWindow.inputKeys.push(e.data.value.key);});});await rs(false);await rs(true);await launcher.waitForTimeout(50);assert.deepEqual(await launcher.locator('#gameFrame').evaluate(el=>el.contentWindow.inputKeys),[]);await launcher.close();
 console.log('Browser: V/button/RS held dedupe, lane guide, drill save/reload/reset, modal/result locks, next fixture Auto, zero practice publications and other-game RS isolation passed. Hardware/Starfield not tested.');
}finally{await browser.close();}
