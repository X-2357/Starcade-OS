import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const folder=path.resolve(import.meta.dirname,'../Web-and-Papyrus/starcade.arcade/launcher/games/ship-crisis');
vm.runInThisContext(fs.readFileSync(path.join(folder,'rules.js'),'utf8'));
const R=globalThis.CrisisRules;
function win(s){
 if(s.result)return ['victory','escaped'].includes(s.result)?[]:null;
 for(const id of ['assault','balanced','evade','repair']){
  if(id==='repair'&&!s.kits)continue;
  const next=R.restore(R.pack(s));R.act(next,id);const tail=win(next);
  if(tail)return [id,...tail];
 }return null;
}
for(let seed=0;seed<100;seed++){
 const s=R.create(seed),orders=win(s);assert.ok(orders);
 for(const id of orders){R.act(s,id);assert.deepEqual(R.restore(R.pack(s)),s);assert.ok(s.hull>=0&&s.hull<=12);}
 assert.throws(()=>R.act(s,'balanced'));
}
assert.throws(()=>R.restore({schema:1,seed:1,actions:['invalid']}));
const empty=R.create(1);R.act(empty,'repair');R.act(empty,'repair');if(!empty.result)assert.throws(()=>R.act(empty,'repair'));
const browser=await chromium.launch({headless:true,executablePath:process.env.STARCADE_BROWSER||undefined});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{window.finishes=0;addEventListener('message',e=>{if(e.data.type==='finish')finishes++});});
 await page.goto(pathToFileURL(path.join(folder,'index.html')).href);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('starcade.ship-crisis.v1')));
 const orders=win(R.restore(saved));
 for(let i=0;i<orders.length;i++){
  await page.locator(`[data-order="${orders[i]}"]`).click();
  if(i===0){await page.reload();assert.match(await page.locator('#heading').textContent(),/Turn 2/);}
 }
 await page.waitForFunction(()=>finishes===1);assert.match(await page.locator('#heading').textContent(),/victory|escaped/);
 await page.reload();assert.equal(await page.evaluate(()=>finishes),0);
 await page.keyboard.press('y');await page.locator('[data-order="retreat"]').click();assert.match(await page.locator('#heading').textContent(),/surrender/);
 assert.deepEqual(errors,[]);console.log('Ship Crisis: 100 reachable wins, every-order restore, bounds/illegal actions; browser win, reload, no duplicate finish and surrender passed.');
}finally{await browser.close();}
