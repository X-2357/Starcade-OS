import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import http from "node:http";

// Served over a local HTTP origin rather than raw file:// - this matches how
// the real game actually hosts these pages (OSF UI's WebView2 host uses
// SetVirtualHostNameToFolderMapping, a virtual same-origin mapping, never a
// raw file:// navigation - see osf-ui/tools/webview2_host/HostApp.cpp).
// Chromium's raw file:// origin is "null", which blocks same-origin
// <script type="module"> loads and fetch()/HttpClient calls outright (a
// browser-level restriction, unrelated to CORS on the real virtual host) -
// testing over file:// would produce false failures for any module-based
// game (first hit: Mah Jong, an Angular app) that never occur in-game.
const MIME = { ".html":"text/html", ".js":"text/javascript", ".mjs":"text/javascript", ".css":"text/css",
  ".json":"application/json", ".png":"image/png", ".svg":"image/svg+xml", ".woff":"font/woff", ".woff2":"font/woff2",
  ".ico":"image/x-icon", ".txt":"text/plain", ".webmanifest":"application/manifest+json" };

function serveDir(root) {
  return http.createServer((req, res) => {
    const reqPath = decodeURIComponent(req.url.split("?")[0]);
    const filePath = path.join(root, reqPath);
    if (!filePath.startsWith(root)) { res.writeHead(403); res.end(); return; }
    fs.readFile(filePath, (error, data) => {
      if (error) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
      res.end(data);
    });
  });
}

const root = path.resolve(import.meta.dirname, "../Web-and-Papyrus/starcade.arcade/launcher");
const catalogText = fs.readFileSync(path.join(root, "games/catalog.js"), "utf8");
const entries = [...catalogText.matchAll(/entry:\s*"([^"]+)"/g)].map((match) => match[1]);
if (entries.length !== 32) throw new Error(`Expected 32 embedded games, found ${entries.length}`);

const server = serveDir(root);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;

const browser = await chromium.launch({ headless:true, executablePath:process.env.STARCADE_BROWSER || undefined });
const failures = [];
for (const entry of entries) {
  const page = await browser.newPage({ viewport:{ width:1600, height:900 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  try {
    await page.goto(`http://127.0.0.1:${port}/${entry}`, { waitUntil:"domcontentloaded", timeout:20000 });
    // A real player has already clicked the game's library card before this page ever
    // loads inside Starcade's iframe, satisfying browsers' autoplay-audio user-activation
    // requirement. Simulate that click here too, or games that play audio immediately
    // (e.g. quadrilactic) fail this audit on a benign browser policy, not a real bug.
    await page.mouse.click(5, 5).catch(() => {});
    if (!entry.includes("freedoom") && !entry.includes("micropolis") && !entry.includes("mahjong")) await page.waitForTimeout(350);
    else await page.waitForTimeout(2500);
  } catch (error) { errors.push(String(error)); }
  // Chromium's autoplay-audio policy blocks audio.play() until the *page itself* has
  // received a real user gesture - a click dispatched before the game's own audio-init
  // code runs doesn't count, and timing one to land after it (but still automated) isn't
  // reliable. A real Starcade player has already clicked this game's library card, which
  // does satisfy the policy in the live iframe. This is the one specific, well-understood,
  // non-functional exception; any other error still fails the audit normally.
  const realErrors = errors.filter((error) => !error.includes("NotAllowedError") || !error.includes("play() failed because the user didn't interact"));
  if (realErrors.length) failures.push(`${entry}: ${realErrors.join(" | ")}`);
  await page.close();
}
await browser.close();
server.close();
if (failures.length) throw new Error(`UI audit failures:\n${failures.join("\n")}`);
console.log(`UI audit passed for ${entries.length} game pages.`);
