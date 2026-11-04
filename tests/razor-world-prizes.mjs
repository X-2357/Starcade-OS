import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
const root=path.resolve(import.meta.dirname,'..'),view=path.join(root,'Web-and-Papyrus/starcade.arcade/launcher'),folder=path.join(view,'games/razor-derby');
const c={window:{}};
for(const f of ['engine.js','legacy-season.js','season.js','prizes.js'])vm.runInNewContext(fs.readFileSync(path.join(folder,f),'utf8'),c);
const L=c.window.RazorSeason,P=c.window.RazorPrizes,E=c.RazorDerby;
// Execute the production C++ prize policy and compare every supported outcome
// against the actual preview module, including season limits and negative cases.
const policy=execFileSync(path.join(root,'Native/build/windows/x64/releasedbg/DerbyPrizePolicyTest.exe'),{encoding:'utf8'});
for(const row of policy.trim().split(/\r?\n/)){const [o,r,credits,medpacks]=row.split(',').map(Number);assert.equal(JSON.stringify(P.amount(o,r)),JSON.stringify({credits,medpacks}));}
for(const args of [[0,0],[-1,0],[8000001,0],[1,3],[8,0],[8,9]])assert.throws(()=>P.amount(...args));
let s=L.create(42);s.prizePassport='abcdef0123456789abcdef01';
for(let r=0;r<7;r++){const m=L.start(s);m.tick=E.LIMIT;m.phase='result';m.goals=[r%3,1];const z=()=>{const m=E.create(1);return {goals:[0,0],stats:m.stats,individual:m.individual,metricsFromTick:0};};s=L.settle(s,m,r,[z(),z(),z()]);}
const prizes=P.entitlements(s);assert.equal(prizes.length,8);assert.equal(new Set(prizes.map(p=>p.ordinal)).size,8);
const next=L.nextSeason(s,43);assert.equal(next.prizePassport,s.prizePassport);assert.equal(JSON.stringify(P.entitlements(next)),JSON.stringify(prizes));
assert.equal(P.entitlements(L.createLegacy(1)).length,0);assert.equal(P.entitlements(L.create(1)).length,0);assert.throws(()=>L.restore({...s,prizePassport:'bad'}));
// Transport/VM source contracts, not claims of executing Papyrus or AddItem.
const native=fs.readFileSync(path.join(root,'Native/src/main.cpp'),'utf8'),shim=fs.readFileSync(path.join(root,'Web-and-Papyrus/Source/x2357StarcadeNative.psc'),'utf8'),ledger=fs.readFileSync(path.join(root,'Web-and-Papyrus/Source/x2357StarcadePlayerAlias.psc'),'utf8'),dispatch=fs.readFileSync(path.join(root,'Web-and-Papyrus/Source/x2357StarcadeDerbyPrizes.psc'),'utf8');
assert.match(native,/BindNativeMethod\("x2357StarcadeNative", "ReportDerbyPrize"/);assert.match(shim,/ReportDerbyPrize\(string requestId, int status, int frontier, int credits, int medpacks, string message\)/);
assert.match(native,/DispatchStaticCall\("x2357StarcadeDerbyPrizes", "ProcessPrize"/);assert.match(dispatch,/ProcessPrize\(string requestId, string passport, int ordinal, int credits, int medpacks, int expectedFrontier\)/);
assert.match(dispatch,/0x00000809/);assert.match(dispatch,/GetAlias\(0\)/);assert.match(ledger,/expectedFrontier != actualFrontier/);assert.ok(ledger.indexOf('expectedFrontier != actualFrontier')<ledger.indexOf('player.AddItem(money'));assert.match(native,/args\[5\] = expected/);assert.match(ledger,/LockGuard DerbyPrizeGuard/);assert.match(ledger,/Length >= 128/);
assert.ok(ledger.indexOf('derbyStatuses[slot] = 3')<ledger.indexOf('player.AddItem(money'));assert.match(ledger,/ordinal <= derbyFrontiers\[slot\]/);
const baseline=execFileSync('git',['show','c4ef4f2:Native/src/main.cpp'],{cwd:root,encoding:'utf8'});
const casinoStart='    void DispatchCreditTransaction',previousEnd='    void BindPapyrus()',currentEnd='    void ReportDerbyPrize';
assert.equal(native.slice(native.indexOf(casinoStart),native.indexOf(currentEnd)).replace(/\r\n/g,'\n'),baseline.slice(baseline.indexOf(casinoStart),baseline.indexOf(previousEnd)).replace(/\r\n/g,'\n'),'Casino dispatch, credit/XP callbacks must remain identical after line-ending normalization');
console.log('Policy: compiled C++ and JS previews agree; career entitlements/order/rollover/legacy exclusions and native/Papyrus declaration seams passed. Papyrus not executed.');
const browser=await chromium.launch({headless:true,executablePath:process.env.STARCADE_BROWSER||undefined});
try{
 const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.addInitScript(value=>{localStorage.setItem('starcade.razor-derby.career.v2',JSON.stringify(value));},s);
 await page.route('http://starcade.test/**',async route=>{
  const rel=new URL(route.request().url()).pathname;
  if(rel.endsWith('/shared/osfui.js')){await route.fulfill({contentType:'text/javascript',body:`window.sent=[];window.handlers={};window.osfui={available:()=>true,ready:Promise.resolve(),on:(k,f)=>handlers[k]=f,send:(k,p)=>sent.push({k,p})};`});return;}
  const file=path.join(view,rel);if(!fs.existsSync(file)||!fs.statSync(file).isFile())return route.fulfill({status:404,body:''});
  await route.fulfill({body:fs.readFileSync(file),contentType:({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream'});
 });
 await page.goto('http://starcade.test/index.html');await page.locator('.game-card').filter({hasText:'Razor Derby'}).click();
 const frame=page.frameLocator('#gameFrame');await frame.locator('#season').click();await frame.locator('#career').click();await frame.getByRole('button',{name:'Starfield inventory prizes'}).click();
 await page.waitForFunction(()=>sent.some(v=>v.k==='starcade.arcade.derby.prize'));
 const requests=()=>page.evaluate(()=>sent.filter(v=>v.k==='starcade.arcade.derby.prize'));
 let req;const receive=async()=>{await page.waitForFunction(previous=>{const p=sent.filter(v=>v.k==='starcade.arcade.derby.prize').at(-1)?.p;return p&&p.requestId!==previous;},req?.requestId);req=(await requests()).at(-1).p;};await receive();assert.equal(req.game,'razor-derby');assert.equal(req.action,'status');assert.equal(req.passport,s.prizePassport);
 const respond=async(status,frontier,extra={})=>page.evaluate(({requestId,status,frontier,extra})=>handlers['starcade.derbyPrize']({requestId,status,frontier,message:'Test inventory service',rules:1,...extra}),{requestId:req.requestId,status,frontier,extra});
 // Wrong request IDs cannot unlock claims.
 await page.evaluate(()=>handlers['starcade.derbyPrize']({requestId:'stale',status:2,frontier:0}));assert.equal(await frame.getByRole('button',{name:'Claim next earned prize'}).count(),0);
 await respond(2,0);await frame.getByRole('button',{name:'Claim next earned prize'}).click();await receive();assert.equal(req.ordinal,1);assert.equal(req.result,prizes[0].result);
 assert.equal(await frame.getByRole('button',{name:'Claim next earned prize'}).isDisabled(),true);
 await respond(1,1,{credits:prizes[0].credits,medpacks:0});await frame.getByText(/Received .* credits/).waitFor();
 await frame.getByRole('button',{name:'Claim next earned prize'}).click();await receive();assert.equal(req.ordinal,2);assert.equal(req.expectedFrontier,1);
 // Save changed under an open menu: backend returns actual frontier without pay.
 await respond(2,0);await frame.getByText(/Recorded through milestone 0/).waitFor();
 await frame.getByRole('button',{name:'Claim next earned prize'}).click();await receive();assert.equal(req.ordinal,1);assert.equal(req.expectedFrontier,0);
 await respond(1,1,{credits:prizes[0].credits,medpacks:0});await frame.getByText(/Received .* credits/).waitFor();
 await frame.getByRole('button',{name:'Claim next earned prize'}).click();await receive();assert.equal(req.ordinal,2);
 await respond(2,2);await frame.getByRole('button',{name:'Claim next earned prize'}).click();await receive();assert.equal(req.ordinal,3);
 await respond(3,3);await frame.getByText(/A reserved prize has uncertain delivery/).waitFor();assert.equal(await frame.getByRole('button',{name:'Claim next earned prize'}).isDisabled(),true);
 // Reopen queries the current save, never a cached WebView receipt.
 await frame.locator('#closeRecords').click();await frame.locator('#career').click();await frame.getByRole('button',{name:'Starfield inventory prizes'}).click();await receive();assert.equal(req.action,'status');await respond(2,0);
 assert.match(await frame.locator('#recordList').textContent(),/Recorded through milestone 0/);
 // Old/missing PEX or native callback: timeout is unknown, no automatic claim.
 await frame.getByRole('button',{name:'Check current save claim ledger'}).click();await receive();const count=(await requests()).length;
 await frame.getByText(/No confirmation received/).waitFor({timeout:18000});assert.equal((await requests()).length,count);assert.equal(await frame.getByRole('button',{name:'Claim next earned prize'}).count(),0);
 await frame.getByRole('button',{name:'Check current save claim ledger'}).click();await receive();await respond(0,0);await frame.getByText('Test inventory service',{exact:true}).waitFor();assert.equal(await frame.getByRole('button',{name:'Claim next earned prize'}).count(),0);
 // Actual iframe/launcher guard rejects a stale session before reaching native.
 const n=(await requests()).length;await page.frames().find(f=>f.url().includes('razor-derby/index.html')).evaluate(()=>parent.postMessage({channel:'starcade',game:'razor-derby',session:-1,type:'derbyPrize',value:{action:'claim',game:'blackjack'}},'*'));
 await page.waitForTimeout(50);assert.equal((await requests()).length,n);
 await page.screenshot({path:path.resolve(root,'../Razor-World-Prizes-2026-11-03.png')});
 assert.deepEqual(errors,[]);console.log('Browser: real game/launcher transport, preview, explicit claim, pending lock, stale ID/session, duplicate frontier, uncertain lock, save-ledger requery, timeout without auto-retry and unavailable service passed. Inventory service mocked; Starfield acceptance pending.');
}finally{await browser.close();}
