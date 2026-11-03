import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const folder=path.resolve(import.meta.dirname,'../Web-and-Papyrus/starcade.arcade/launcher/games/supply-chain');
vm.runInThisContext(fs.readFileSync(path.join(folder,'rules.js'),'utf8'));
const R=globalThis.SupplyRules,s=R.create(),orders=[];
while(!s.result){const id=s.stock[1]>=2?'assemble':s.stock[0]>=2?'smelt':'extract';orders.push(id);R.act(s,id);assert.deepEqual(R.restore(R.pack(s)),s);}
assert.equal(s.result,'delivered');assert.equal(s.shift,17);assert.throws(()=>R.act(s,'extract'));
assert.throws(()=>R.act(R.create(),'assemble'));assert.throws(()=>R.restore({schema:1,actions:['unknown']}));
let layer=[R.create()],seen=new Set(),count=0,deadline=false;
while(layer.length){const next=[];for(const state of layer){const key=[state.shift,...state.stock,state.result].join(':');if(seen.has(key))continue;seen.add(key);count++;assert.deepEqual(R.restore(R.pack(state)),state);if(state.result){if(state.result==='deadline')deadline=true;continue;}for(const o of R.orders){try{R.preview(state,o.id);}catch(_){continue;}const v=R.restore(R.pack(state));R.act(v,o.id);assert.ok(v.stock.every((n,i)=>n>=0&&n<=[8,6,4][i]));next.push(v);}}layer=next;}
assert.ok(deadline);
const browser=await chromium.launch({headless:true,executablePath:process.env.STARCADE_BROWSER||undefined});
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{window.finishes=0;addEventListener('message',e=>{if(e.data.type==='finish')finishes++});});
 await page.goto(pathToFileURL(path.join(folder,'index.html')).href);
 assert.equal(await page.locator('[data-order="assemble"]').isDisabled(),true);
 for(let i=0;i<orders.length;i++){await page.locator(`[data-order="${orders[i]}"]`).click();if(i===2)await page.reload();}
 await page.waitForFunction(()=>finishes===1);assert.equal(await page.locator('#heading').textContent(),'Contract delivered');
 await page.reload();assert.equal(await page.evaluate(()=>finishes),0);
 await page.keyboard.press('y');await page.locator('[data-order="abandon"]').click();assert.equal(await page.locator('#heading').textContent(),'Contract abandoned');
 assert.deepEqual(errors,[]);console.log(`Supply Chain: ${count} reachable resource/shift/result states checked; 17-shift win, timeout/capacity/invalid actions/replay and browser full contract/reload/no-repeat/abandon passed.`);
}finally{await browser.close();}
