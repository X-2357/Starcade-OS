import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const folder=path.resolve(import.meta.dirname,'../Web-and-Papyrus/starcade.arcade/launcher/games/race-director');
vm.runInThisContext(fs.readFileSync(path.join(folder,'rules.js'),'utf8'));
const R=globalThis.RaceRules,orders=['push','push','pit','push','push','pit','push','push'];
for(let seed=0;seed<200;seed++){
 const s=R.create(seed);
 for(const id of orders){const p=R.preview(s,id),time=s.time;R.act(s,id);assert.equal(s.time-time,p.seconds);assert.deepEqual(R.restore(R.pack(s)),s);assert.ok(s.fuel>=0&&s.fuel<=18);assert.ok(s.wear<12);}
 assert.equal(s.result,'finished');assert.ok(s.rank>=1&&s.rank<=6);assert.throws(()=>R.act(s,'pit'));
}
assert.throws(()=>R.restore({schema:1,seed:1,actions:['nonsense']}));
const dry=R.create(1);R.act(dry,'push');R.act(dry,'push');const third=R.preview(dry,'push');assert.ok(third.puncture);R.act(dry,'push');assert.equal(dry.wear,4);
const browser=await chromium.launch({headless:true,executablePath:process.env.STARCADE_BROWSER||undefined});
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{window.finishes=0;addEventListener('message',e=>{if(e.data.type==='finish')finishes++});});
 await page.goto(pathToFileURL(path.join(folder,'index.html')).href);
 for(let i=0;i<orders.length;i++){await page.locator(`[data-order="${orders[i]}"]`).click();if(i===0){await page.reload();assert.equal(await page.locator('#heading').textContent(),'Lap 2');}}
 await page.waitForFunction(()=>finishes===1);assert.match(await page.locator('#heading').textContent(),/finished.*position/);
 await page.reload();assert.equal(await page.evaluate(()=>finishes),0);
 await page.keyboard.press('y');await page.locator('[data-order="retire"]').click();assert.equal(await page.locator('#heading').textContent(),'retired');
 assert.deepEqual(errors,[]);console.log('Race Director: 200 complete races, forecast/time agreement, bounds, puncture, every-order restore; browser race/reload/result/no-duplicate/retire passed.');
}finally{await browser.close();}
