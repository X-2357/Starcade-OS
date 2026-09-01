import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
import path from "node:path";
const root=path.resolve(import.meta.dirname,"../Web-and-Papyrus/starcade.arcade/launcher/games");
const games=["constellation-codebreaker"];
const browser=await chromium.launch({headless:true,executablePath:process.env.STARCADE_BROWSER||undefined});
const failures=[];
for(const id of games){
  const page=await browser.newPage({viewport:{width:1600,height:900}}),errors=[];
  page.on("pageerror",e=>errors.push(String(e)));
  page.on("console",m=>{if(m.type()==="error")errors.push(m.text())});
  await page.goto(pathToFileURL(path.join(root,id,"index.html")).href,{waitUntil:"domcontentloaded"});
  await page.waitForTimeout(150);
  for(const key of ["ArrowRight","ArrowDown","Enter","ArrowLeft","ArrowUp","Enter","x","y"]){await page.keyboard.press(key);await page.waitForTimeout(60)}
  const branding=await page.evaluate(()=>getComputedStyle(document.body,"::after").content);
  if(!branding.includes("CREATED BY X-2357"))errors.push("creator branding not rendered");
  if(errors.length)failures.push(`${id}: ${errors.join(" | ")}`);
  await page.close();
}
await browser.close();
if(failures.length)throw new Error(failures.join("\n"));
console.log(`Expansion interaction audit passed for ${games.length} games.`);
