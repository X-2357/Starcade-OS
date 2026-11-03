import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
const folder=path.resolve(import.meta.dirname,'../Web-and-Papyrus/starcade.arcade/launcher/games/signal-casebook');
vm.runInThisContext(fs.readFileSync(path.join(folder,'rules.js'),'utf8'));
const R=globalThis.CasebookRules,perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
let campaigns=0;
for(const a of perms)for(const b of perms)for(const c of perms){const s=R.create();for(let i=0;i<3;i++){for(const clue of [a,b,c][i]){R.act(s,'clue'+clue);assert.deepEqual(R.restore(R.pack(s)),s);}R.act(s,'accuse'+R.cases[i].correct);if(i<2)R.act(s,'next');}assert.equal(s.result,'complete');assert.equal(s.history.length,14);assert.throws(()=>R.act(s,'next'));campaigns++;}
assert.throws(()=>R.act(R.create(),'accuse2'));const dup=R.create();R.act(dup,'clue0');assert.throws(()=>R.act(dup,'clue0'));
assert.throws(()=>R.restore({schema:1,actions:['next']}));const wrong=R.create();for(let i=0;i<3;i++)R.act(wrong,'clue'+i);R.act(wrong,'accuse0');assert.equal(wrong.result,'incorrect');
const browser=await chromium.launch({headless:true,executablePath:process.env.STARCADE_BROWSER||undefined});
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(()=>{window.finishes=0;addEventListener('message',e=>{if(e.data.type==='finish')finishes++});});
 await page.goto(pathToFileURL(path.join(folder,'index.html')).href);assert.equal(await page.locator('[data-order="accuse2"]').isDisabled(),true);
 for(let i=0;i<3;i++){for(let j=0;j<3;j++){await page.locator(`[data-order="clue${j}"]`).click();if(i===0&&j===1){await page.reload();assert.equal(await page.locator('#log p').count(),2);}}await page.locator(`[data-order="accuse${R.cases[i].correct}"]`).click();if(i<2)await page.locator('[data-order="next"]').click();}
 await page.waitForFunction(()=>finishes===1);assert.equal(await page.locator('#heading').textContent(),'Casebook complete');await page.reload();assert.equal(await page.evaluate(()=>finishes),0);
 await page.evaluate(()=>localStorage.setItem('starcade.signal-casebook.v1','{"schema":99}'));await page.reload();assert.match(await page.locator('#notice').textContent(),/could not be restored/);
 await page.keyboard.press('Enter');const saved=await page.evaluate(()=>localStorage.getItem('starcade.signal-casebook.v1'));await page.keyboard.press('y');assert.match(await page.locator('#new').textContent(),/Confirm/);assert.equal(await page.evaluate(()=>localStorage.getItem('starcade.signal-casebook.v1')),saved);
 assert.deepEqual(errors,[]);console.log(`Casebook: ${campaigns} complete clue-order campaigns/replay; invalid/duplicate/early accusation/wrong conclusion; browser campaign, evidence restore, no-repeat finish, bad save and keyboard/abandon passed.`);
}finally{await browser.close();}
