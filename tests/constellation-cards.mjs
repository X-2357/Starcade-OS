import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
const folder = path.resolve(import.meta.dirname, '../Web-and-Papyrus/starcade.arcade/launcher/games/constellation-cards');
vm.runInThisContext(fs.readFileSync(path.join(folder, 'rules.js'), 'utf8'));
const R = globalThis.ConstellationRules;
// Known good and bad restores calibrate the save reader at the rules layer.
assert.equal(R.restore(R.pack(R.create(42, 0))).moves.length, 0);
for (const bad of [null, {}, {schema:2}, {schema:1,seed:1,first:0,moves:[[0,9]]}, {schema:1,seed:1,first:0,moves:[[0,0],[0,0]]}]) assert.throws(() => R.restore(bad));
const capture = R.create(1,0);
capture.board[1] = {card:0,owner:1}; // south 2
capture.board[5] = {card:1,owner:1}; // west 3
capture.board[7] = {card:4,owner:1}; // north 2
capture.board[3] = {card:3,owner:1}; // east 4, equals Wayfarer west
assert.deepEqual(R.captures(capture,3,4,0),[1,5,7]);
let results = new Set();
for(let seed=0;seed<200;seed++) {
  let s=R.create(seed,seed%2);
  while(s.moves.length<9) {
    const move = seed%3===0 ? [0,s.board.findIndex(c=>!c)] : R.choose(s);
    R.play(s,...move);
    const resumed = R.restore(R.pack(s));
    assert.deepEqual(resumed,s);
    assert.equal(R.scores(s).reduce((a,b)=>a+b),10);
  }
  results.add(Math.sign(R.scores(s)[0]-R.scores(s)[1]));
  assert.equal(R.report(s).totals[0]-R.report(s).totals[1],R.scores(s)[0]-5);
  assert.throws(()=>R.play(s,0,0));
}
assert.ok(results.has(-1)&&results.has(1), 'both sides can win');
const browser=await chromium.launch({headless:true, executablePath:process.env.STARCADE_BROWSER||undefined});
try {
  const page=await browser.newPage({viewport:{width:1280,height:800}});
  await page.addInitScript(()=>{window.reports=[];addEventListener('message',e=>{if(e.data.type==='finish')reports.push(e.data.value)});});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(pathToFileURL(path.join(folder,'index.html')).href);
  await page.locator('#hand button').first().click();
  await page.keyboard.press('Enter'); // card selection focused first empty board position
  await page.reload();
  const afterReload = await page.evaluate(()=>JSON.parse(localStorage.getItem('starcade.constellation-cards.match.v1')).moves.length);
  assert.ok(afterReload>=2);
  await page.evaluate(()=>{window.reports=[];});
  for(let i=0;i<5;i++) {
    if((await page.locator('#status').textContent()).includes('rematch'))break;
    await page.locator('#hand button').first().click();
    await page.keyboard.press('Enter');
  }
  await page.waitForTimeout(50);
  assert.match(await page.locator('#status').textContent(),/Victory|Defeat|Draw/);
  assert.equal(await page.evaluate(()=>reports.length),1);
  await page.reload();
  assert.match(await page.locator('#status').textContent(),/Victory|Defeat|Draw/);
  await page.waitForTimeout(50);assert.equal(await page.evaluate(()=>reports.length),0);
  // Exercise host input seam, rather than only browser keyboard events.
  await page.locator('#new').click();
  await page.locator('#hand button').first().focus();
  await page.evaluate(()=>{for(const key of ['Enter','ArrowRight','Enter']) window.postMessage({channel:'starcade',type:'input',value:{key,down:true}},'*');});
  await page.waitForTimeout(50);
  assert.ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('starcade.constellation-cards.match.v1')).moves.length>=2));
  const beforeAbandon=await page.evaluate(()=>localStorage.getItem('starcade.constellation-cards.match.v1'));
  await page.keyboard.press('y');
  assert.equal(await page.evaluate(()=>localStorage.getItem('starcade.constellation-cards.match.v1')),beforeAbandon);
  assert.equal(await page.locator('#confirm').isVisible(),true);
  await page.keyboard.press('y');
  assert.ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('starcade.constellation-cards.match.v1')).moves.length<2));
  await page.locator('#hand button').first().click();await page.keyboard.press('x');
  assert.equal(await page.evaluate(()=>document.activeElement.parentElement.id),'hand');
  // Corrupt save is rejected visibly, not merged into executable state.
  await page.evaluate(()=>localStorage.setItem('starcade.constellation-cards.match.v1','{"schema":1,"seed":1,"first":0,"moves":[[0,99]]}'));
  await page.reload();assert.match(await page.locator('#notice').textContent(),/could not be restored/);
  await page.screenshot({path:path.resolve(import.meta.dirname,'../../../Constellation-Cards-2026-11-02.png')});
  assert.deepEqual(errors,[]);
  // Real launcher + real game agree on ready/load/save/exit, with only OSF native
  // transport stubbed. This does not prove the actual OSF WebView/native bridge.
  const launcher=await browser.newPage();
  const view=path.resolve(folder,'../..');
  await launcher.route('http://starcade.test/**', async route=>{
    const rel=new URL(route.request().url()).pathname;
    if(rel.endsWith('/shared/osfui.js')) {await route.fulfill({contentType:'text/javascript',body:'window.osfui={available:()=>false};'});return;}
    const file=path.join(view,rel);
    if(!fs.existsSync(file)||!fs.statSync(file).isFile()){await route.fulfill({status:404,body:''});return;}
    await route.fulfill({body:fs.readFileSync(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream'});
  });
  await launcher.goto('http://starcade.test/index.html');
  await launcher.locator('.game-card').filter({hasText:'Constellation Cards'}).click();
  const game=launcher.frameLocator('#gameFrame');
  await game.locator('#hand button').first().click();
  await game.locator('#board button').filter({hasText:/^[1-9]$/}).first().click();
  await launcher.waitForFunction(()=>JSON.parse(localStorage.getItem('starcade.save.constellation-cards')||'null')?.moves.length>=2);
  const saved=await launcher.evaluate(()=>localStorage.getItem('starcade.save.constellation-cards'));
  await game.locator('#exit').click();
  await launcher.locator('.game-card').filter({hasText:'Constellation Cards'}).click();
  await game.locator('#status').waitFor();
  assert.equal(await launcher.evaluate(()=>localStorage.getItem('starcade.save.constellation-cards')),saved);
  await launcher.close();
  console.log('PASS: captures/equality, 200 complete duels and every-move restore; browser play, resume, result, forwarded controller and corrupt-save recovery. Not a Starfield test.');
} finally {await browser.close();}
