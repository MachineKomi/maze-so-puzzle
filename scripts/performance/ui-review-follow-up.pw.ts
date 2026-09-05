import { test, expect, type Page } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { ASSETS } from "../../src/assets";
import { CURATED_LEVELS } from "../../src/game/levels";
import { createInitialGameState, movePlayer } from "../../src/game/engine";
import { progressionStateSignature, solveLevel } from "../../src/game/solver";
import { DIRECTIONS, type Direction } from "../../src/game/types";
import { deriveRoute, replayRouteStep } from "./gameplay-browser";
import { UI_PRESENTATION_CANDIDATES } from "../../src/generated/uiPresentationArt";
import { UI_REWARD_PRESENTATION_CANDIDATES } from "../../src/generated/uiRewardPresentationArt";
import { MGJRPG02_ART } from "../../src/generated/mgjrpg02Art";
import { MUSIC_CATALOGUE } from "../../src/musicCatalogue";
import { createDefaultPlayerProgress, PLAYER_PROGRESS_STORAGE_KEY } from "../../src/progress";

const output = resolve(process.env.MAZE_PERF_EVIDENCE_DIR!, "ui-review");
let messages:string[]=[];
function watch(page:Page) {
  page.on("pageerror",e=>messages.push(`exception: ${e.message}`));
  page.on("console",e=>{if(["error","warning"].includes(e.type()))messages.push(`${e.type()}: ${e.text()}`);});
}
test.beforeEach(async({page})=>{messages=[];watch(page);});
test.afterEach(async({},info)=>{
  await writeFile(resolve(output,`console-${info.title.replace(/[^a-z0-9]+/gi,"-")}.json`),JSON.stringify(messages,null,2));
  const injected=/failures|semantic fallback/.test(info.title);
  expect(messages.filter(message=>!(injected&&message.includes("net::ERR_FAILED")))).toEqual([]);
});
test.beforeAll(async () => {
  await mkdir(output, { recursive: true });
  await writeFile(resolve(output,"source-build.json"),JSON.stringify({capturedAt:new Date().toISOString(),head:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),workingTree:execFileSync("git",["status","--short"],{encoding:"utf8"}),build:JSON.parse(await readFile("node_modules/.cache/maze-performance/build-provenance.json","utf8")),evidenceClass:"Dirty candidate; separate DEV CPU/rack and production preview; not device qualification"},null,2));
});
test("UI review actual media URL across live contexts and Sound snapshot",async({page})=>{
  await page.addInitScript(()=>{
    const created:HTMLAudioElement[]=[];(window as any).__uiActualAudio=created;
    window.Audio=new Proxy(window.Audio,{construct(target,args){const audio=Reflect.construct(target,args) as HTMLAudioElement;created.push(audio);return audio;}});
  });
  await page.setViewportSize({width:960,height:540});await page.goto("/");await page.getByRole("button",{name:"Play",exact:true}).click();
  const records:unknown[]=[];
  async function actual(context:string,step:string) {
    const media=await page.evaluate(()=>{const audio=(window as any).__uiActualAudio.at(-1) as HTMLAudioElement;return {url:decodeURI(new URL(audio.src).pathname),muted:audio.muted};});
    const track=MUSIC_CATALOGUE.find(t=>t.url===media.url);expect(track?.context).toBe(context);records.push({step,...media,id:track!.id});return track!;
  }
  async function sound(context:string,step:string) {
    const trigger=page.getByRole("button",{name:"Open Sound and comfort",exact:true});
    if(await trigger.count())await trigger.click();else await openUiAction(page,"sound");
    const track=await actual(context,step);await expect(page.locator(".sound-track")).toHaveText(track.id.replaceAll("-"," "));
    for(const muted of [true,false]) {await page.locator('[data-focus-id="sound:mute"]').click();expect((await page.evaluate(()=>(window as any).__uiActualAudio.at(-1).muted))).toBe(muted);await expect(page.locator(".sound-track")).toHaveText(track.id.replaceAll("-"," "));}
    await page.keyboard.press("Escape");return track;
  }
  await sound("title","fresh Home");await page.getByRole("button",{name:/Begin adventure/}).click();await actual("story","first story");await page.getByRole("button",{name:"Start the maze",exact:true}).click();
  const first=await sound("maze","first maze");await openUiAction(page,"book");await sound("adventure-book","Book");await page.getByRole("button",{name:"Resume",exact:true}).click();const resumed=await sound("maze","Book return");expect(resumed.id).not.toBe(first.id);
  await page.emulateMedia({reducedMotion:"reduce"});await page.locator(".maze-board").focus();
  for(const step of deriveRoute(CURATED_LEVELS[0]!,solveLevel(CURATED_LEVELS[0]!,{avoidAnimals:true}).directions))await replayRouteStep(page,step);
  await expect(page.getByRole("heading",{name:"Maze solved!"})).toBeVisible();await actual("victory","victory");await page.getByRole("button",{name:"Stay here",exact:true}).click();await sound("maze","Stay");
  await openUiAction(page,"home");await sound("title","Home return");await page.getByRole("button",{name:"Surprise maze",exact:true}).click();
  // Leaving a played maze keeps its existing safe switch confirmation.
  const confirm=page.getByRole("button",{name:/^Start (the )?new maze/});if(await confirm.count())await confirm.click();
  const story=page.getByRole("button",{name:"Start the maze",exact:true});if(await story.count())await story.click();
  await sound("maze","generated maze");
  await writeFile(resolve(output,"actual-music-contexts.json"),JSON.stringify(records,null,2));
});
test("UI review power latency and engine cost", async ({ page }) => {
  const records=[];
  for (const maze of [7,12,15,16]) {
    const level=CURATED_LEVELS[maze-1]!,initial=createInitialGameState(level);
    const potions=new Set(level.objects.filter(o=>o.kind==="potion").map(o=>o.id));
    const signature=(s:typeof initial)=>progressionStateSignature(s,false,potions);
    const queue=[{state:initial,path:[] as Direction[]}],seen=new Set([signature(initial)]);
    let witness: {state:typeof initial;path:Direction[];direction:Direction;blocker:string}|undefined;
    for(let head=0;head<queue.length&&head<4096&&!witness;head++)for(const direction of DIRECTIONS) {
      const entry=queue[head]!,probe=movePlayer(level,entry.state,direction),event=probe.events.find(e=>e.type==="enemy-too-strong");
      if(event?.type==="enemy-too-strong") {witness={...entry,direction,blocker:event.objectId};break;}
      const id=signature(probe.state);
      if(!seen.has(id)&&probe.state.status==="playing") {seen.add(id);queue.push({state:probe.state,path:[...entry.path,direction]});}
    }
    if(!witness) {records.push({maze,notFoundWithinWitnessBound:true});continue;}
    await page.goto("http://127.0.0.1:1421/?ui-proof");
    const cpu=await page.evaluate(async ({level,state,blocker})=>{
      // Existing DEV module, not injected replacement gameplay or production hook.
      const {createPowerOpportunitySearch}=await import("/src/ui/game/powerGuidance.ts");
      return Array.from({length:6},()=>{const start=performance.now(),search=createPowerOpportunitySearch(level,state,blocker,2048);let step=search.next();while(!step.done)step=search.next();return {ms:performance.now()-start,...step.value,ids:step.value.opportunities.map((o:{id:string})=>o.id)};});
    },{level,state:witness.state,blocker:witness.blocker});
    const scheduled=await page.evaluate(async({level,state,blocker})=>{
      const {createPowerOpportunitySearch,schedulePowerOpportunitySearch}=await import("/src/ui/game/powerGuidance.ts");
      const slices:number[]=[],start=performance.now();
      const result=await new Promise(resolve=>schedulePowerOpportunitySearch(createPowerOpportunitySearch(level,state,blocker),resolve,(ms:number)=>slices.push(ms)));
      return {result,slices,wallMs:performance.now()-start,activeMs:slices.reduce((a,b)=>a+b,0),maxSliceMs:Math.max(...slices)};
    },{level,state:witness.state,blocker:witness.blocker});
    await pick(page,maze);await page.emulateMedia({reducedMotion:"reduce"});await page.locator(".maze-board").focus();
    for(const step of deriveRoute(level,witness.path))await replayRouteStep(page,step);
    await page.evaluate(()=>{
      const record={input:0,commit:0,frame:0,pendingAtCommit:false,requiredPathAtCommit:false,longTasks:[] as {start:number;duration:number}[]};
      (window as any).__uiPowerLatency=record;
      addEventListener("keydown",()=>record.input=performance.now(),{once:true,capture:true});
      const tasks=new PerformanceObserver(list=>record.longTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration}))));tasks.observe({entryTypes:["longtask"]});
      const observer=new MutationObserver(()=>{if([...document.querySelectorAll("h2")].some(e=>e.textContent==="Too strong!")) {record.commit=performance.now();record.pendingAtCommit=document.querySelector(".power-opportunities")?.getAttribute("data-search-state")==="pending";record.requiredPathAtCommit=[...document.querySelectorAll("button")].some(e=>e.textContent==="Show Required Path");observer.disconnect();requestAnimationFrame(()=>requestAnimationFrame(()=>{record.frame=performance.now();setTimeout(()=>tasks.disconnect(),200);}));}});
      observer.observe(document.body,{childList:true,subtree:true});
    });
    await page.keyboard.press({up:"ArrowUp",left:"ArrowLeft",right:"ArrowRight",down:"ArrowDown"}[witness.direction]);
    await expect(page.getByRole("heading",{name:"Too strong!",exact:true})).toBeVisible();
    await expect.poll(()=>page.evaluate(()=>(window as any).__uiPowerLatency.frame)).toBeGreaterThan(0);
    const modal=await page.evaluate(()=>(window as any).__uiPowerLatency);
    expect(modal.pendingAtCommit).toBe(true);expect(modal.requiredPathAtCommit).toBe(true);
    await expect(page.locator(".power-opportunities")).toHaveAttribute("data-search-state","complete");
    expect(await page.locator("[data-opportunity-id]").evaluateAll(elements=>elements.map(e=>e.getAttribute("data-opportunity-id")))).toEqual(cpu[0].ids);
    records.push({maze,blocker:witness.blocker,path:witness.path,cpu,scheduled,modal,commitMs:modal.commit-modal.input,paintOpportunityMs:modal.frame-modal.input});
    await page.screenshot({path:resolve(output,`power-latency-maze${maze}.png`)});
    await page.keyboard.press("Escape");
  }
  expect(records.filter(r=>"cpu" in r).length).toBeGreaterThanOrEqual(2);
  await writeFile(resolve(output,"power-latency.json"),JSON.stringify({evidenceClass:"Report-only DEV CPU and separate production modal latency; not hardware qualification",records},null,2));
});

test("UI review compact 200 percent named reader keeps objective and movement access",async({page})=>{
  for(const [width,height]of [[960,540],[844,390],[568,320]]) {
    const mode="maximized";
    await page.setViewportSize({width,height});await pick(page,12);
    await expect(page.locator(".play-shell")).toHaveAttribute("data-mode",mode);
    const objective=await page.locator(".objective-card p").innerText();
    await page.addStyleTag({content:':root{--safe-top:12px;--safe-bottom:12px;--safe-left:12px;--safe-right:12px} html{font-size:200%} p,button,h2 {line-height:1.5;letter-spacing:.12em;word-spacing:.16em;} p {margin-bottom:2em}'});
    const reader=page.getByRole("region",{name:"Full objective and adventure status",exact:true});await expect(reader).toBeVisible();
    const steps=await page.locator(".step-pill").getAttribute("aria-label");await reader.focus();await page.keyboard.press("ArrowRight");
    expect(await page.locator(".step-pill").getAttribute("aria-label")).toBe(steps);
    for(const atEnd of [false,true]) {
      if(atEnd){await page.keyboard.press("End");await expect.poll(()=>reader.evaluate(e=>e.scrollTop)).toBeGreaterThan(0);}
      for(const id of ["hint","move:up","move:left","move:right","move:down"]) {
        const control=page.locator(`[data-focus-id="${id}"]`),r=(await control.boundingBox())!;
        expect(r.width).toBeGreaterThanOrEqual(48);expect(r.height).toBeGreaterThanOrEqual(48);expect(r.y).toBeGreaterThanOrEqual(12);expect(r.y+r.height).toBeLessThanOrEqual(height-12);
        expect(await control.evaluate(e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));})).toBe(true);
      }
    }
    expect(await reader.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
    await page.screenshot({path:resolve(output,`reader-${width}-${mode}.png`)});
    await page.locator('[data-focus-id="hint"]').click();await expect(page.locator(".hint-objective")).toContainText(objective);await page.keyboard.press("Escape");await expect(page.locator('[data-focus-id="hint"]')).toBeFocused();
  }
});
async function pick(page: Page, maze = 12) {
  await page.goto("/?debug=mazes");
  await page.getByRole("button", { name: new RegExp(`^Test story maze ${maze}:`) }).click();
  await page.evaluate(() => document.fonts.ready);
}
export async function openUiAction(page: Page, id: string) {
  const control = page.locator(`button[data-focus-id="${id}"]:visible`);
  if (!await control.count()) await page.locator('[data-focus-id="more"]').click();
  await control.click();
}
test("UI review compact simultaneous geometry", async ({ page }) => {
  const records = [];
  for (const [width, height] of [[960,540],[844,390],[568,320]]) for (const inset of [0,12]) {
    await page.setViewportSize({width,height});
    for (const maze of [1,8,12,15,16]) {
      await pick(page, maze);
      if (inset) await page.addStyleTag({content:`:root {--safe-top:12px;--safe-bottom:12px;--safe-left:12px;--safe-right:12px;}`});
      await expect(page.locator(".play-shell")).toHaveAttribute("data-layout","compact-landscape");
      {
        const mode="maximized";
        await expect(page.locator(".play-shell")).toHaveAttribute("data-mode",mode);
        const geometry = await page.evaluate(() => {
          const box = (e: Element) => e.getBoundingClientRect().toJSON();
          return { deck:box(document.querySelector(".adventure-hud")!),
            scroll:[document.querySelector(".adventure-hud")!.scrollHeight,document.querySelector(".adventure-hud")!.clientHeight],
            statuses:[...document.querySelectorAll(".inventory-slot,.rescue-friend")].map(e=>{const r=e.getBoundingClientRect();return {box:box(e),tag:e.tagName,uncovered:[[4,4],[r.width-4,r.height-4]].every(([x,y])=>e.contains(document.elementFromPoint(r.x+x,r.y+y)))};}),
            essentials:[...document.querySelectorAll(".objective-card,.maze-minimap,.controls-card")].map(box),
            targets:[...document.querySelectorAll<HTMLElement>(".adventure-hud button")].map(e=>({box:box(e),id:e.dataset.focusId})) };
        });
        records.push({width,height,inset,maze,mode,...geometry});
        await writeFile(resolve(output,"compact-geometry.json"),JSON.stringify(records,null,2));
        for (const r of [...geometry.statuses.map(s=>s.box),...geometry.essentials]) {
          expect(r.top).toBeGreaterThanOrEqual(geometry.deck.top-1);
          expect(r.bottom).toBeLessThanOrEqual(geometry.deck.bottom+1);
          expect(r.left).toBeGreaterThanOrEqual(geometry.deck.left-1);
          expect(r.right).toBeLessThanOrEqual(geometry.deck.right+1);
          expect(r.top).toBeGreaterThanOrEqual(inset);expect(r.bottom).toBeLessThanOrEqual(height-inset);
        }
        expect(geometry.scroll[0]).toBeLessThanOrEqual(geometry.scroll[1]!+1);
        expect(geometry.statuses.every(s=>s.tag==="SPAN")).toBe(true);
        expect(geometry.statuses.every(s=>s.uncovered)).toBe(true);
        for (const target of geometry.targets) {
          const minimum=target.id==="more"?44:48;
          expect(target.box.width).toBeGreaterThanOrEqual(minimum);expect(target.box.height).toBeGreaterThanOrEqual(minimum);
        }
        if (maze===12) await page.screenshot({path:resolve(output,`compact-${width}-${inset}-${mode}.png`)});
      }
    }
  }
  await writeFile(resolve(output,"compact-geometry.json"),JSON.stringify(records,null,2));
});

test("UI review responsive logo failures retain title and actions", async ({ browser }) => {
  for (const width of [568,1280]) for (const failure of ["selected","both","all"]) {
    const context=await browser.newContext({viewport:{width,height:width===568?320:720},deviceScaleFactor:1});
    const page=await context.newPage(), failed:string[]=[];watch(page);
    const selected=width===568?ASSETS.gameLogoCompact:ASSETS.gameLogo;
    const blocked=failure==="selected"?[selected]:failure==="both"?[ASSETS.gameLogoCompact,ASSETS.gameLogo]:[ASSETS.gameLogoCompact,ASSETS.gameLogo,ASSETS.gameLogoFallback];
    await page.route("**/*",route=>{
      const path=decodeURI(new URL(route.request().url()).pathname);
      if(blocked.includes(path)) {failed.push(path);return route.abort();}
      return route.continue();
    });
    await page.goto("http://127.0.0.1:4173/");
    await expect(page.getByRole("heading",{name:"Maze so Puzzle",exact:true})).toHaveCount(1);
    if(failure==="all") await expect(page.locator("span.front-door-logo.art-fallback")).toHaveCount(1);
    else {
      const logo=page.locator("img.front-door-logo");
      await expect.poll(()=>logo.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
      expect(await logo.getAttribute("srcset")).toBeNull();
      const url=decodeURI(new URL(await logo.evaluate((e:HTMLImageElement)=>e.currentSrc)).pathname);
      expect(url).toBe(width===568&&failure==="selected"?ASSETS.gameLogo:ASSETS.gameLogoFallback);
    }
    await expect(page.getByRole("button",{name:"Play",exact:true})).toBeInViewport();
    await expect(page.getByRole("button",{name:"Exit",exact:true})).toBeInViewport();
    await page.screenshot({path:resolve(output,`logo-${width}-${failure}.png`)});
    await page.getByRole("button",{name:"Play",exact:true}).click();
    await expect(page.locator(".title-hero")).toHaveAttribute("src",ASSETS.homeHeroSplash);
    expect(failed.length).toBeLessThanOrEqual(blocked.length*2);
    await writeFile(resolve(output,`logo-${width}-${failure}.json`),JSON.stringify({failed,expectedInjectedErrors:failed.length},null,2));
    await context.close();
  }
});

test("UI review long dialog native keyboard reading and exact return", async ({ page }) => {
  for (const [width,height] of [[960,540],[568,320]]) for (const fixture of ["help","story"]) {
    await page.setViewportSize({width,height});
    if(fixture==="help") {await pick(page,15);await openUiAction(page,"help");}
    else {await page.goto("http://127.0.0.1:1421/?ui-proof");await page.getByRole("button",{name:"story proof",exact:true}).click();}
    await page.addStyleTag({content:"html {font-size:200%}"});
    const body=page.locator(".dialog-body");
    await expect(body).toHaveAttribute("role","region");await expect(body).toHaveAttribute("aria-label",/content$/);
    for(let step=0;step<80&&!await body.evaluate(e=>e===document.activeElement);step++) await page.keyboard.press("Tab");
    await expect(body).toBeFocused();
    const end=await body.evaluate(e=>e.scrollHeight-e.clientHeight);expect(end).toBeGreaterThan(0);
    await page.keyboard.press("Home");
    for(let step=0;step<50&&(await body.evaluate(e=>e.scrollTop))<end-1;step++) {await page.keyboard.press("PageDown");await page.waitForTimeout(30);}
    await expect.poll(()=>body.evaluate(e=>e.scrollTop)).toBeGreaterThanOrEqual(end-1);
    await page.screenshot({path:resolve(output,`keyboard-read-end-${fixture}-${width}.png`)});
    await page.keyboard.press("PageUp");await expect.poll(()=>body.evaluate(e=>e.scrollTop)).toBeLessThan(end-1);
    await page.keyboard.press("Home");await expect.poll(()=>body.evaluate(e=>e.scrollTop)).toBe(0);
    for(let step=0;step<80&&!await page.evaluate(()=>!!document.activeElement?.closest(".dialog-footer"));step++) await page.keyboard.press("Tab");
    expect(await page.evaluate(()=>!!document.activeElement?.closest(".dialog-footer"))).toBe(true);
    await page.keyboard.press("Shift+Tab");expect(await page.evaluate(()=>!!document.activeElement?.closest('[role="dialog"]'))).toBe(true);
    await page.keyboard.press("Escape");
    if(fixture==="story") await expect(page.getByRole("button",{name:"story proof",exact:true})).toBeFocused();
    else await expect(page.locator('[data-focus-id="more"]')).toBeFocused();
  }
});

test("UI review cold presentation candidates and actual-size alpha proofs", async ({ browser,page }) => {
  const reviewedVariants = {...UI_PRESENTATION_CANDIDATES, ...UI_REWARD_PRESENTATION_CANDIDATES};
  const records=[];
  for(const width of [960,568])for(const dpr of [1,2]) {
    const context=await browser.newContext({viewport:{width,height:width===960?540:320},deviceScaleFactor:dpr});
    const cold=await context.newPage(),requests:string[]=[];watch(cold);
    cold.on("request",r=>{if(r.url().includes("/presentation/"))requests.push(new URL(r.url()).pathname);});
    await cold.goto("http://127.0.0.1:1421/?ui-proof");
    await cold.evaluate(()=>document.fonts.ready);expect(requests).toEqual([]);
    for(const [id,variant] of Object.entries(reviewedVariants)) {
      const start=requests.length;
      await cold.getByLabel("Presentation identity").selectOption(id);
      await cold.getByRole("button",{name:"blocker proof",exact:true}).click();
      const art=cold.locator(".presentation-art img");await art.evaluate((e:HTMLImageElement)=>e.decode());
      const measure=await art.evaluate((e:HTMLImageElement)=>({url:new URL(e.currentSrc).pathname,role:e.dataset.artRole,dpr:devicePixelRatio,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height,natural:e.naturalWidth,bounds:e.dataset.artVisibleBounds!.split(",").map(Number),sufficient:e.dataset.artResolutionSufficient}));
      const reward = id in UI_REWARD_PRESENTATION_CANDIDATES;
      const needsLarge = !reward || (width === 960 && dpr === 2);
      const expectedSrc = needsLarge ? variant.src : MGJRPG02_ART[id as keyof typeof MGJRPG02_ART].src;
      expect(measure.url).toBe(expectedSrc);expect(measure.role).toBe("presentation");expect(measure.natural).toBe(needsLarge ? 512 : 256);expect(measure.sufficient).toBe("true");
      expect(measure.width).toBe(width===960?200:128);expect(measure.height).toBe(measure.width);
      expect(Math.max(...measure.bounds.slice(2))*measure.width).toBeGreaterThanOrEqual(width===960?144:96);
      expect(requests.slice(start)).toEqual(needsLarge ? [variant.src] : []);
      records.push({id,...measure,requested:requests.slice(start)});
      if(id==="splash-boots")await cold.screenshot({path:resolve(output,`presentation-${width}-dpr${dpr}.png`)});
      await cold.keyboard.press("Escape");
    }
    await context.close();
  }
  await writeFile(resolve(output,"presentation-selection.json"),JSON.stringify(records,null,2));
  for(const size of [200,128]) {
    const cards=[];
    for(const [id,variant]of Object.entries(reviewedVariants)) {
      const data=(await readFile(resolve("public",variant.src.slice(1)))).toString("base64");
      for(const background of ["cream","dark","checker"])cards.push(`<figure class="${background}"><img width="${size}" height="${size}" src="data:image/webp;base64,${data}"><figcaption>${id}<br>${size}px · ${background}</figcaption></figure>`);
    }
    const html=`<!doctype html><meta charset="utf-8"><title>UI01 candidate alpha proof ${size}px</title><style>*{box-sizing:border-box}body{margin:0;padding:16px;background:#efe7f1;font:14px system-ui}main{display:grid;grid-template-columns:repeat(7,${size+16}px);gap:8px}figure{margin:0;padding:8px;display:grid;justify-items:center;border:1px solid #aa93b3}.cream{background:#fff8ed}.dark{background:#30263f;color:white}.checker{background:conic-gradient(#ddd 25%,white 0 50%,#ddd 0 75%,white 0) 0 0/16px 16px}img{display:block;max-width:none}figcaption{font-size:11px;margin-top:8px;background:#fff9ef;color:#30263f;padding:3px}</style><h1>Equipment and keepsake renditions · ${size} actual CSS pixels</h1><p>Current delivery from approved masters, shown against light, dark and checkerboard surfaces. This sheet records alpha and registration; release acceptance is recorded separately.</p><main>${cards.join("")}</main>`;
    await writeFile(resolve(output,`presentation-alpha-${size}.html`),html);
    await page.setViewportSize({width:7*(size+24)+32,height:1000});await page.setContent(html);
    await page.locator("img").evaluateAll(images=>Promise.all(images.map(e=>(e as HTMLImageElement).decode())));
    await page.screenshot({path:resolve(output,`presentation-alpha-${size}.png`),fullPage:true});
  }
});

test("UI review delayed presentation decode and semantic fallback", async ({ browser }) => {
  for(const failure of ["delay","presentation","all"]) {
    const context=await browser.newContext({viewport:{width:960,height:540},deviceScaleFactor:2}),page=await context.newPage();watch(page);
    let release!:()=>void;const gate=new Promise<void>(resolve=>release=resolve),failed:string[]=[];
    await page.route("**/*splash-boots*.webp",async route=>{
      const src=new URL(route.request().url()).pathname;
      if(src.includes("/presentation/")&&failure==="delay") {await gate;return route.continue();}
      if(failure==="all"||(failure==="presentation"&&src.includes("/presentation/"))) {failed.push(src);return route.abort();}
      return route.continue();
    });
    await page.goto("http://127.0.0.1:1421/?ui-proof");await page.getByLabel("Presentation identity").selectOption("splash-boots");await page.getByRole("button",{name:"blocker proof",exact:true}).click();
    const frame=page.locator(".presentation-art");
    if(failure==="delay") {
      const before=await frame.boundingBox();expect(before!.width).toBe(200);expect(await frame.locator("img").evaluate((e:HTMLImageElement)=>e.complete)).toBe(false);
      await expect(page.getByRole("button",{name:"Back to proof",exact:true})).toBeInViewport();
      release();await frame.locator("img").evaluate((e:HTMLImageElement)=>e.decode());expect(await frame.boundingBox()).toEqual(before);
    } else if(failure==="presentation") {
      const image=frame.locator("img");await expect(image).toHaveAttribute("data-art-role","optical");await image.evaluate((e:HTMLImageElement)=>e.decode());
      expect(await image.evaluate(e=>e.getBoundingClientRect().width)).toBe(64);await expect(image).toHaveAttribute("alt","Splash Boots");
    } else await expect(frame.getByRole("img",{name:"Splash Boots",exact:true})).toHaveClass(/art-fallback/);
    await page.screenshot({path:resolve(output,`presentation-${failure}.png`)});
    await writeFile(resolve(output,`presentation-${failure}.json`),JSON.stringify({failed,expectedInjectedErrors:failed.length},null,2));
    await page.keyboard.press("Escape");await expect(page.getByRole("button",{name:"blocker proof",exact:true})).toBeFocused();await context.close();
  }
});

test("UI review earned reward failures keep a stable fallback across size and DPR changes", async ({ browser }) => {
  const large = UI_REWARD_PRESENTATION_CANDIDATES["reward-trail-sticker"].src;
  const optical = MGJRPG02_ART["reward-trail-sticker"].src;
  for (const failure of ["presentation", "all"] as const) {
    const context = await browser.newContext({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 2 });
    try {
      const page = await context.newPage(); watch(page);
      const failed: string[] = [], presentationRequests: string[] = [];
      // Explicit synthetic earned-Book fixture; this test makes no reward or
      // gameplay acceptance claim and never reads a user's saved profile.
      await page.addInitScript(({ key, progress }) => localStorage.setItem(key, JSON.stringify(progress)), {
        key: PLAYER_PROGRESS_STORAGE_KEY,
        progress: { ...createDefaultPlayerProgress(), stickers: ["first-star"] },
      });
      page.on("request", request => {
        const path = new URL(request.url()).pathname;
        if (path.includes("/presentation/")) presentationRequests.push(path);
      });
      await page.route("**/*reward-trail-sticker*.webp", route => {
        const path = new URL(route.request().url()).pathname;
        if (path === large || (failure === "all" && path === optical)) {
          failed.push(path); return route.abort();
        }
        return route.continue();
      });
      await page.goto("http://127.0.0.1:4173/");
      await page.getByRole("button", { name: "Play", exact: true }).click();
      await page.getByRole("button", { name: "Ame's adventure book", exact: true }).click();
      await page.getByRole("tab", { name: "Achievements", exact: true }).click();
      expect(presentationRequests).toEqual([]);
      const earned = page.locator('[data-focus-id="achievement:first-star"]');
      await earned.click();
      const frame = page.locator(".presentation-art");
      if (failure === "all") {
        await expect(frame.getByRole("img", { name: "My First Maze", exact: true })).toHaveClass(/art-fallback/);
        expect(failed).toContain(optical);
      } else {
        const image = frame.getByRole("img", { name: "My First Maze", exact: true });
        await expect(image).toHaveAttribute("data-art-role", "optical");
        await image.evaluate((element: HTMLImageElement) => element.decode());
        const samples = await image.evaluate(async (element: HTMLImageElement) => {
          const frames = [];
          for (let index = 0; index < 32; index++) {
            await new Promise<void>(done => requestAnimationFrame(() => done()));
            frames.push({ width: element.getBoundingClientRect().width, role: element.dataset.artRole, src: new URL(element.currentSrc).pathname, natural: element.naturalWidth });
          }
          return frames;
        });
        expect(samples).toEqual(Array.from({ length: 32 }, () => ({ width: 64, role: "optical", src: optical, natural: 256 })));
        // Real compact layout now needs only the available 256px rendition.
        await page.setViewportSize({ width: 568, height: 320 });
        await expect(image).toHaveAttribute("data-art-role", "presentation");
        await expect.poll(() => image.evaluate(element => element.getBoundingClientRect().width)).toBe(128);
        await page.setViewportSize({ width: 960, height: 540 });
        await expect(image).toHaveAttribute("data-art-role", "optical");
        await expect.poll(() => image.evaluate(element => element.getBoundingClientRect().width)).toBe(64);
        // Edge's raw CDP density-only override silently changes devicePixelRatio:
        // our recorded probe received no resolution/resize/physical-box event.
        // Pair density with a real 1px viewport change, keeping the authored
        // 200px presentation frame unchanged. No fake dispatched events or
        // runtime polling are used to compensate for that emulation limitation.
        await page.evaluate(() => {
          const events: unknown[] = [];
          const query = matchMedia(`(resolution: ${devicePixelRatio}dppx)`);
          const record = (source: string) => events.push({ source, at: performance.now(), dpr: devicePixelRatio, queryMatches: query.matches, width: innerWidth, height: innerHeight });
          const resize = () => record("window-resize");
          const resolution = () => record("resolution-change");
          const observer = new ResizeObserver(entries => {
            record("device-pixel-box");
            events.push(...entries.map(entry => ({ cssWidth: entry.contentRect.width, deviceWidth: entry.devicePixelContentBoxSize?.[0]?.inlineSize })));
          });
          window.addEventListener("resize", resize); query.addEventListener("change", resolution);
          try { observer.observe(document.documentElement, { box: "device-pixel-content-box" }); }
          catch { record("device-pixel-box-unsupported"); }
          record("before-density-change");
          (window as any).__rewardDprDelivery = { events, record, cleanup: () => { window.removeEventListener("resize", resize); query.removeEventListener("change", resolution); observer.disconnect(); } };
        });
        const cdp = await context.newCDPSession(page);
        try {
          for (const dpr of [1, 2]) {
            await expect.poll(() => frame.evaluate(element => element.getBoundingClientRect().width)).toBe(200);
            const eventStart = await page.evaluate(() => (window as any).__rewardDprDelivery.events.length);
            const width = dpr === 1 ? 961 : 960;
            await cdp.send("Emulation.setDeviceMetricsOverride", { width, height: 540, deviceScaleFactor: dpr, mobile: false });
            await expect.poll(() => page.evaluate(() => devicePixelRatio)).toBe(dpr);
            await page.evaluate(() => (window as any).__rewardDprDelivery.record("after-density-change"));
            await expect.poll(() => page.evaluate(({ eventStart, dpr, width }) =>
              (window as any).__rewardDprDelivery.events.slice(eventStart).some((event: { source?: string; dpr?: number; width?: number }) =>
                event.source === "window-resize" && event.dpr === dpr && event.width === width), { eventStart, dpr, width })).toBe(true);
            await expect.poll(() => frame.evaluate(element => element.getBoundingClientRect().width)).toBe(200);
            await expect(image).toHaveAttribute("data-art-role", dpr === 1 ? "presentation" : "optical");
            await expect.poll(() => image.evaluate(element => element.getBoundingClientRect().width)).toBe(dpr === 1 ? 200 : 64);
          }
        } finally {
          const delivery = await page.evaluate(() => {
            const probe = (window as any).__rewardDprDelivery;
            probe.record("finished"); probe.cleanup(); delete (window as any).__rewardDprDelivery;
            return probe.events;
          });
          await writeFile(resolve(output, "reward-dpr-event-delivery.json"), JSON.stringify({
            mode: "CDP density with a native 1px viewport notification; presentation frame remains 200 CSS pixels",
            limitation: "A prior density-only CDP probe changed devicePixelRatio without emitting any resolution, window resize or physical-pixel box signal. This check does not claim that silent protocol-only mutation represents native display delivery.",
            events: delivery,
          }, null, 2));
          await cdp.detach();
        }
        await writeFile(resolve(output, "reward-fallback-stability.json"), JSON.stringify({ samples, failed, presentationRequests }, null, 2));
      }
      expect(presentationRequests).toEqual([large]);
      expect(failed.filter(path => path === large)).toHaveLength(1);
      await page.getByRole("button", { name: "Back to the adventure", exact: true }).click();
      await expect(earned).toBeFocused();
    } finally { await context.close(); }
  }
});
