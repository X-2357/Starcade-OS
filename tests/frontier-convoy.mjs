import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const folder=path.resolve(import.meta.dirname,'../Web-and-Papyrus/starcade.arcade/launcher/games/frontier-convoy');
vm.runInThisContext(fs.readFileSync(path.join(folder,'rules.js'),'utf8'));
const R=globalThis.ConvoyRules;
for(let seed=0;seed<200;seed++){
 const s=R.create(seed);
 while(s.phase!=='result'){
  R.apply(s,s.phase==='event'?'2':s.leg<3?'cruise':'sling');
  assert.deepEqual(R.restore(R.pack(s)),s);
 }
 assert.equal(s.outcome,'arrived');assert.throws(()=>R.apply(s,'cruise'));
}
for(const bad of [null,{}, {schema:1,rules:1,seed:1,actions:['2']}, {schema:1,rules:1,seed:1,actions:['cruise','cruise']}])assert.throws(()=>R.restore(bad));
const loss=R.create(1);while(loss.phase!=='result')R.apply(loss,loss.phase==='event'?'2':R.choices(loss).find(c=>c.id==='cruise').allowed?'cruise':'ration');assert.equal(loss.outcome,'stranded');
const browser=await chromium.launch({headless:true,executablePath:process.env.STARCADE_BROWSER||undefined});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{window.finishes=0;addEventListener('message',e=>{if(e.data.type==='finish')finishes++});});
 await page.goto(pathToFileURL(path.join(folder,'index.html')).href);
 for(let leg=0;leg<6;leg++){
  await page.locator(`[data-choice="${leg<3?'cruise':'sling'}"]`).click();
  if(leg<5)await page.locator('[data-choice="2"]').click();
  if(leg===1){await page.reload();assert.match(await page.locator('#stage').textContent(),/LEG 3/);}
 }
 await page.waitForFunction(()=>finishes===1);assert.equal(await page.locator('#title').textContent(),'Convoy delivered');
 await page.reload();assert.equal(await page.evaluate(()=>finishes),0);
 await page.keyboard.press('y');await page.keyboard.press('Enter');
 const before=await page.evaluate(()=>localStorage.getItem('starcade.frontier-convoy.run.v1'));
 await page.keyboard.press('y');assert.match(await page.locator('#new').textContent(),/Confirm/);
 assert.equal(await page.evaluate(()=>localStorage.getItem('starcade.frontier-convoy.run.v1')),before);
 assert.deepEqual(errors,[]);
 console.log('Convoy: 200 complete arrivals with every-choice restore; stranded/invalid-state fixtures; browser full run, reload, result, keyboard and abandon confirmation passed.');
}finally{await browser.close();}
