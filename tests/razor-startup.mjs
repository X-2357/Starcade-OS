import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const folder=path.resolve(import.meta.dirname,'../Web-and-Papyrus/starcade.arcade/launcher/games/razor-derby'),baseline=process.env.STARCADE_EXPECT_UNGUARDED==='1';
const browser=await chromium.launch({headless:true,executablePath:process.env.STARCADE_BROWSER||undefined});
try{
 const page=await browser.newPage();let release;const gate=new Promise(resolve=>release=resolve);
 await page.route('**/razor-derby/game.js',async route=>{await gate;await route.continue();});
 await page.goto(pathToFileURL(path.join(folder,'index.html')).href,{waitUntil:'commit'});await page.locator('#drills').waitFor({state:'visible'});
 assert.equal(await page.locator('#drills').evaluate(el=>el.onclick),null);
 assert.equal(await page.locator('main').evaluate(el=>el.inert),!baseline);
 if(baseline){await page.locator('#drills').click();release();await page.waitForLoadState('load');assert.equal(await page.locator('#recordPanel').isVisible(),false);console.log('Known-bad calibration: painted controls are active before handlers exist; early click is lost. No runtime root-cause claim beyond this controlled reproduction.');}
 else{assert.equal(await page.locator('#loading').isVisible(),true);release();await page.waitForFunction(()=>document.body.dataset.ready==='true');assert.equal(await page.locator('main').evaluate(el=>el.inert),false);assert.equal(await page.locator('#loading').isVisible(),false);await page.locator('#drills').click();assert.equal(await page.locator('#recordPanel').isVisible(),true);console.log('Startup: delayed game-script delivery keeps controls inert; initialized standalone view enables controls and selector correctly.');}
 if(!baseline){
  const host=await browser.newPage();await host.route('http://startup.test/**',async route=>{const rel=new URL(route.request().url()).pathname;if(rel==='/parent.html')return route.fulfill({contentType:'text/html',body:`<iframe id="game" src="/game/index.html" width="1200" height="850"></iframe><script>window.childReady=false;window.writes=[];addEventListener('message',e=>{if(e.data?.type==='ready')childReady=true;if(['score','save','finish'].includes(e.data?.type))writes.push(e.data.type);});window.restore=value=>document.getElementById('game').contentWindow.postMessage({channel:'starcade',type:'load',session:42,value},'*');</script>`});const file=rel.startsWith('/game/')?path.join(folder,rel.slice(6)):path.join(folder,'..',rel);if(!fs.existsSync(file))return route.fulfill({status:404,body:''});await route.fulfill({body:fs.readFileSync(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream'});});
  await host.goto('http://startup.test/parent.html');await host.waitForFunction(()=>childReady);const game=host.frameLocator('#game');assert.equal(await game.locator('main').evaluate(el=>el.inert),true);assert.equal(await game.locator('body').getAttribute('data-ready'),'false');
  for(const key of ['Enter','v'])await host.locator('#game').evaluate((el,key)=>el.contentWindow.postMessage({channel:'starcade',type:'input',value:{key,down:true}},'*'),key);
  await host.waitForTimeout(50);assert.deepEqual(await host.evaluate(()=>writes),[]);assert.equal(await game.locator('body').evaluate(()=>localStorage.getItem('starcade.razor-derby.match.v1')),null);
  const fixture=await game.locator('body').evaluate(()=>{const s=RazorDerby.create(123);s.phase='paused';s.tick=120;s.shotAim='lower';return s;});await host.evaluate(v=>restore(v),fixture);await host.waitForFunction(()=>document.getElementById('game').contentDocument.body.dataset.ready==='true');assert.match(await game.locator('#shotAim').textContent(),/Lower lane/);assert.equal(await game.locator('#heading').textContent(),'Exhibition paused');await game.locator('#drills').click();assert.equal(await game.locator('.drill-card').count(),3);await host.close();console.log('Startup: delayed parent restore rejects early forwarded Enter/V without creating save/run, then restores actual saved aim and enables controls.');
 }
}finally{await browser.close();}
