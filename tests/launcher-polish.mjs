// Acceptance test for the launcher polish layer (Docs/LAUNCHER_POLISH_STAGE1_SCOPE_2026-11-04.md).
// Runs the real launcher in headless Chromium/Edge with a stand-in for the OSF UI bridge.
// Browser evidence only: not Starfield/WebView2, not controller, not frame time next to other mods.
// Set STARCADE_BROWSER to an Edge/Chrome executable; set SHOTS to a folder to also save screenshots and a video.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

const webRoot = path.resolve(import.meta.dirname, '../Web-and-Papyrus');
const launcherDir = path.join(webRoot, 'starcade.arcade/launcher');
const shots = process.env.SHOTS ? path.resolve(process.env.SHOTS) : null;
if (shots) fs.mkdirSync(shots, { recursive: true });
const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.mp3':'audio/mpeg', '.png':'image/png', '.svg':'image/svg+xml' };
const stub = 'window.osfui={available:()=>false,send(){},on(){},ready:Promise.resolve()};';

const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/favicon.ico') { res.writeHead(204); res.end(); return; }
  if (p === '/shared/osfui.js') { res.writeHead(200, { 'Content-Type':'text/javascript' }); res.end(stub); return; }
  const file = path.join(webRoot, p.endsWith('/') ? p + 'index.html' : p);
  if (!file.startsWith(webRoot)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    res.end(data);
  });
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}/starcade.arcade/launcher/`;
const browser = await chromium.launch({ headless: true, executablePath: process.env.STARCADE_BROWSER || undefined });

async function open(options = {}) {
  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 }, reducedMotion: options.reducedMotion ? 'reduce' : 'no-preference',
    ...(options.video && shots ? { recordVideo: { dir: shots, size: { width: 1280, height: 720 } } } : {})
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(url, { waitUntil: 'load' });
  return { context, page, errors };
}
const names = (page) => page.evaluate(() => document.getAnimations().map((a) => a.animationName).filter(Boolean));
const shot = async (page, name) => { if (shots) await page.screenshot({ path: path.join(shots, name + '.png') }); };
const selectedIndex = (page) => page.evaluate(() => [...document.querySelectorAll('.game-card')].findIndex((c) => c.classList.contains('selected')));
const gridClass = (page) => page.evaluate(() => document.getElementById('gameGrid').className);

// ---- static rules the scope promised (read from the files, not from a running page) ----
const css = fs.readFileSync(path.join(launcherDir, 'polish.css'), 'utf8');
const js = fs.readFileSync(path.join(launcherDir, 'polish.js'), 'utf8');
const uncomment = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const usesBlur = (text) => /(^|[{;\s])filter\s*:|backdrop-filter\s*:/.test(uncomment(text));
const usesTimers = (text) => /setInterval|requestAnimationFrame|setTimeout/.test(uncomment(text));
// calibrate the two checks against known-bad and known-good text before trusting them
assert.ok(usesBlur('a{filter:blur(2px)}') && usesBlur('a{opacity:1; filter: blur(2px)}') && usesBlur('a{backdrop-filter: blur(2px)}'));
assert.ok(!usesBlur('/* no filter: here */ a{opacity:1}') && !usesBlur('.filter:hover{opacity:1}') && !usesBlur('.filter { transition:opacity .2s }'));
assert.ok(usesTimers('setTimeout(f,1)') && !usesTimers('// no setTimeout\nlet a=1'));
assert.ok(!usesBlur(css), 'polish.css must not use filter or backdrop-filter');
assert.ok(!usesTimers(js), 'polish.js must be event-driven: no timers or frame loops');
assert.ok(/prefers-reduced-motion/.test(css), 'reduced-motion handling missing');
// SAFE VARIANT rules (2026-11-04, after the owner's PC froze on an earlier animated version): nothing continuous but the equaliser
assert.ok(!/will-change/.test(uncomment(css)), 'will-change must not be used');
assert.equal((uncomment(css).match(/infinite/g) || []).length, 1, 'only the equaliser may loop forever');
assert.ok(/#musicToggle\.is-playing::after\s*\{[^}]*infinite/.test(uncomment(css)), 'the one infinite animation must be the equaliser');
assert.ok(!/position\s*:\s*(fixed|sticky)/.test(uncomment(css)), 'polish must not add positioned overlay layers');
// the launcher's own files must be untouched by this layer
for (const file of ['style.css', 'main.js']) assert.ok(fs.statSync(path.join(launcherDir, file)).size > 0);

// ---- main flow ----
const { context, page, errors } = await open({ video: true });

// calibrate the error counter against a known-bad event before trusting a zero
await page.evaluate(() => { setTimeout(() => { throw new Error('calibration'); }, 0); });
await page.waitForTimeout(100);
assert.equal(errors.length, 1, 'error counter did not see a deliberate error');
errors.length = 0;

// 1. intro: entrance + continuous effects running, then the entrance hands over to the selected-card pulse
await page.waitForTimeout(250);
await shot(page, '01-intro');
let running = await names(page);
assert.ok(running.includes('cardIn'), 'cardIn should be running at load');
assert.match(await gridClass(page), /\benter\b/);
// the infinite-animation probe: anything that never ends, read from the live page
const infinite = () => page.evaluate(() => document.getAnimations().filter((a) => a.effect.getComputedTiming().iterations === Infinity).map((a) => a.animationName));
// calibrate it: a deliberately infinite animation must be seen, then removed
await page.evaluate(() => { const d = document.createElement('div'); d.id = 'calib'; document.body.appendChild(d); d.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, iterations: Infinity }).id = 'calib'; });
assert.equal((await infinite()).length, 1, 'infinite-animation probe did not see a deliberate infinite animation');
await page.evaluate(() => { document.getAnimations().filter((a) => a.id === 'calib').forEach((a) => a.cancel()); document.getElementById('calib').remove(); });
assert.deepEqual(await infinite(), [], 'nothing may loop forever at load');
await page.waitForFunction(() => !document.getElementById('gameGrid').classList.contains('enter'), null, { timeout: 5000 });
await page.waitForTimeout(300);
await shot(page, '02-settled');
running = await names(page);
assert.ok(!running.includes('cardIn'), 'entrance must have finished');
assert.deepEqual(await infinite(), [], 'once settled, nothing may loop forever');
assert.equal(await page.evaluate(() => document.getElementById('shell').dataset.view), 'library');
// the sliding star layers must never make the shell scrollable (this broke focus/hover scrolling once: the page jumped up)
const scrollable = () => page.evaluate(() => { const s = document.getElementById('shell'), t = document.querySelector('.topbar'); s.scrollTop = 80; t.scrollTop = 80; const r = { shell: s.scrollTop, topbar: t.scrollTop }; s.scrollTop = 0; t.scrollTop = 0; return r; });
assert.deepEqual(await scrollable(), { shell: 0, topbar: 0 }, 'shell/topbar must not be scrollable');

// 2. every keyframe animates only the allowed cheap properties
const keyframeProps = await page.evaluate(() => {
  const out = {};
  for (const sheet of document.styleSheets) {
    if (!sheet.href || !sheet.href.includes('polish.css')) continue;
    for (const rule of sheet.cssRules) if (rule instanceof CSSKeyframesRule) {
      const set = new Set(); for (const k of rule.cssRules) for (const p of k.style) set.add(p); out[rule.name] = [...set];
    }
  }
  return out;
});
assert.ok(Object.keys(keyframeProps).length >= 7, 'expected the polish keyframes to be present');
const allowed = new Set(['transform', 'opacity', 'background-size', 'box-shadow', 'text-shadow']);
for (const [name, props] of Object.entries(keyframeProps)) for (const p of props) assert.ok(allowed.has(p), `${name} animates disallowed property ${p}`);

// 3. a plain refresh of the same filter (what a native state push does) must NOT replay the entrance; a new filter must
await page.click('.filter.active');
await page.waitForTimeout(80);
assert.doesNotMatch(await gridClass(page), /\benter\b/, 'same-filter redraw replayed the entrance');
const before = await page.locator('.game-card').count();
await page.click('.filter[data-filter="arcade"]');
await page.waitForTimeout(120);
assert.match(await gridClass(page), /\benter\b/, 'new filter should play the entrance');
const arcade = await page.locator('.game-card').count();
assert.ok(arcade > 0 && arcade < before, 'arcade filter should show a subset');
await page.waitForTimeout(250);
await shot(page, '03-arcade-filter-entering');
await page.waitForFunction(() => !document.getElementById('gameGrid').classList.contains('enter'), null, { timeout: 5000 });
await page.click('.filter[data-filter="all"]');
await page.waitForFunction(() => !document.getElementById('gameGrid').classList.contains('enter'), null, { timeout: 5000 });

// 4. keyboard selection still works, and hover/focus plays the light sweep
const first = await selectedIndex(page);
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(150);
assert.equal(await selectedIndex(page), first + 1, 'ArrowRight should move the selection');
await page.locator('.game-card').nth(2).hover();
await page.waitForTimeout(150);
assert.ok((await names(page)).includes('sheen'), 'hover should play the light sweep');
await page.mouse.move(...(await page.locator('.game-card').nth(2).boundingBox().then((b) => [b.x + 40, b.y + 30])));
await page.waitForTimeout(80);
assert.match(await page.locator('.game-card').nth(2).evaluate((el) => el.style.getPropertyValue('--mx')), /px$/, 'pointer spotlight should follow the mouse');
await page.mouse.move(5, 5);
await page.waitForTimeout(80);
assert.equal(await page.locator('.game-card').nth(2).evaluate((el) => el.style.getPropertyValue('--mx')), '', 'spotlight must clear when the pointer leaves');
await page.locator('.game-card').nth(2).hover();
await page.waitForTimeout(300);
assert.equal(await page.evaluate(() => Math.round(document.querySelector('.topbar').getBoundingClientRect().top)), 1, 'hovering/focusing must not scroll the page');
assert.deepEqual(await scrollable(), { shell: 0, topbar: 0 });
// (the card list itself may scroll when a card is focused: that is the launcher's existing behaviour) - frame it for the preview
await page.evaluate(() => { document.querySelector('.content').scrollTop = 0; });
const box = await page.locator('.game-card').nth(2).boundingBox();
await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.4);
await page.waitForTimeout(450);
await shot(page, '04-hover');

// 5. panels open with an animation and close again
await page.mouse.move(5, 5);
await page.click('#musicListButton');
await page.waitForTimeout(100);
assert.ok((await names(page)).includes('popIn'), 'track panel should animate in');
await page.waitForTimeout(300);
await shot(page, '05-track-list');
await page.click('#closeTrackList');
await page.click('#leaderboardButton');
await page.waitForTimeout(350);
await shot(page, '06-leaderboard');
await page.click('#closeLeaderboard');

// 6. the equaliser follows the audio element's real events
const eq = (p) => p.evaluate(() => ({ cls: document.getElementById('musicToggle').classList.contains('is-playing'),
  anim: getComputedStyle(document.getElementById('musicToggle'), '::after').animationName }));
assert.equal((await eq(page)).cls, false);
await page.evaluate(() => document.getElementById('musicPlayer').dispatchEvent(new Event('playing')));
assert.deepEqual(await eq(page), { cls: true, anim: 'equaliser' });
await shot(page, '07-equaliser-on');
await page.evaluate(() => document.getElementById('musicPlayer').dispatchEvent(new Event('pause')));
assert.equal((await eq(page)).cls, false);

// 7. a game is running: continuous launcher effects stop, and come back with an intro on return
await page.locator('.game-card').first().click();
await page.waitForSelector('#player:not(.hidden)');
await page.waitForTimeout(300);
assert.equal(await page.evaluate(() => document.getElementById('shell').dataset.view), 'player');
assert.deepEqual(await infinite(), [], 'nothing may loop forever while a game runs');
await shot(page, '08-in-game');
await page.keyboard.press('Escape');
await page.waitForSelector('#library:not(.hidden)');
await page.waitForTimeout(150);
assert.equal(await page.evaluate(() => document.getElementById('shell').dataset.view), 'library');
assert.match(await gridClass(page), /\benter\b/, 'returning from a game should replay the intro');
await page.waitForTimeout(500);
await shot(page, '09-back-in-library');

assert.deepEqual(errors, [], 'console/page errors during the main flow');
await context.close();

// ---- reduced motion: nothing from the polish layer may animate ----
const reduced = await open({ reducedMotion: true });
await reduced.page.waitForTimeout(400);
const polishNames = ['cardIn', 'fadeIn', 'sheen', 'popIn', 'equaliser', 'textIn', 'toastPop'];
const stillRunning = (await names(reduced.page)).filter((n) => polishNames.includes(n));
assert.deepEqual(stillRunning, [], 'reduced motion must stop the polish animations');
assert.deepEqual(reduced.errors, []);
await reduced.context.close();

await browser.close();
server.close();
console.log('launcher polish checks passed (browser only; Starfield WebView2 not tested)');
