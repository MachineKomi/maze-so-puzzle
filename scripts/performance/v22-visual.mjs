/** Matched Full-quality production regression captures; no dev server or runtime hooks. */
import { chromium } from "playwright";
import { preview } from "vite";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { isAbsolute, relative, resolve } from "node:path";
import { deriveNormalFixtures } from "./v22-fixtures.mjs";

const root = process.cwd();
const output = resolve(process.env.MAZE_PERF_EVIDENCE_DIR ?? "C:/GameDev/maze-game-qa/performance/v22-perf-01/visual");
const within = relative(root,output);
if (!within.startsWith("..") && !isAbsolute(within)) throw new Error("Raw visual evidence belongs outside the repository.");
await mkdir(output,{recursive:true});
const fixtures = await deriveNormalFixtures(root);
const fixture = fixtures.fixtures.find(row=>row.count===5);
const browser = await chromium.launch({channel:"msedge",headless:true});
const rows=[];
try {
  for (const phase of ["baseline","candidate"]) {
    const dist = phase === "baseline"
      ? resolve(process.env.V22_BASELINE_DIST ?? "C:/GameDev/maze-game-qa/performance/v22-perf-01/baseline/dist")
      : resolve("dist");
    const server = await preview({root,build:{outDir:dist},preview:{host:"127.0.0.1",port:0,strictPort:false}});
    try {
      const base=server.resolvedUrls.local[0];
      for(const [width,height] of [[1920,1080],[1194,834],[844,390],[568,320]]) {
        const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,serviceWorkers:"block"});
        await context.addInitScript(({fixtures,fixture})=>{
          localStorage.clear();
          localStorage.setItem(fixtures.storage.active,JSON.stringify(fixture.snapshot));
          localStorage.setItem(fixtures.storage.progress,JSON.stringify(fixtures.progress));
          localStorage.setItem(fixtures.storage.presentation,JSON.stringify({quality:"full",motion:"full"}));
        },{fixtures,fixture});
        const page=await context.newPage();
        const errors=[];page.on("pageerror",e=>errors.push(e.message));
        try {
          await page.goto(base,{waitUntil:"networkidle"});
          for(const screen of ["title","home","maze"]) {
            if(screen==="home") await page.getByRole("button",{name:"Play",exact:true}).click();
            if(screen==="maze") await page.getByRole("button",{name:/^Continue/}).click();
            await page.evaluate(async()=>{
              await document.fonts.ready;
              await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));
            });
            await page.waitForTimeout(350);
            const file=resolve(output,`${phase}-${width}x${height}-${screen}.png`);
            await page.screenshot({path:file,animations:"disabled"});
            const geometry=await page.evaluate(()=>{
              const box=node=>{
                const r=node.getBoundingClientRect();
                return {className:node.className,x:r.x,y:r.y,width:r.width,height:r.height};
              };
              return {major:[...document.querySelectorAll(".front-door-screen,.title-screen,.maze-board,.adventure-hud,.maze-map-card,.thumb-pad")].map(box),
                images:[...document.images].filter(image=>image.getBoundingClientRect().width>0).map(image=>({src:new URL(image.currentSrc).pathname,complete:image.complete&&image.naturalWidth>0,...box(image)})),
                minimapTiles:document.querySelectorAll(".minimap-tile").length,
                followers:document.querySelectorAll("[data-follower-id]").length};
            });
            rows.push({phase,width,height,screen,file,sha256:createHash("sha256").update(await readFile(file)).digest("hex"),geometry,errors:[...errors]});
          }
        } finally { await context.close(); }
      }
    } finally { await new Promise(done=>server.httpServer.close(done)); }
  }
} finally { await browser.close(); }
const comparisons=rows.filter(row=>row.phase==="candidate").map(row=>{
  const before=rows.find(item=>item.phase==="baseline"&&item.width===row.width&&item.height===row.height&&item.screen===row.screen);
  return {width:row.width,height:row.height,screen:row.screen,identicalPng:row.sha256===before.sha256,
    identicalGeometry:JSON.stringify(row.geometry)===JSON.stringify(before.geometry)};
});
await writeFile(resolve(output,"summary.json"),JSON.stringify({classification:"Full quality, frozen screenshot animation, DPR1 desktop-browser regression only; not phone-fit or physical-device acceptance",rows,comparisons},null,2));
console.log(JSON.stringify(comparisons,null,2));
if(rows.some(row=>row.errors.length||row.geometry.images.some(image=>!image.complete))) process.exitCode=1;
