import { test, expect, type Page } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { CURATED_LEVELS } from "../../src/game/levels";
import { createInitialGameState, movePlayer } from "../../src/game/engine";
import { progressionStateSignature, solveLevel } from "../../src/game/solver";
import { buildAdventureHudModel } from "../../src/ui/game/hudModel";
import { UI_ART } from "../../src/ui/art";
import type { Direction } from "../../src/game/types";
import { deriveRoute, heldSegment, replayRouteStep, expectUiRouteState, readUiRouteState } from "./gameplay-browser";

const output = resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,"ui01");
const sizes = [[1920,1080],[1280,720],[1194,834],[1024,768],[960,540],[844,390],[568,320]] as const;
const selectedMazes = [1,8,12,15,16];
const browserMessages = new WeakMap<Page, string[]>();
test.beforeEach(async({page})=>{
  const messages:string[]=[];browserMessages.set(page,messages);
  page.on("pageerror",error=>messages.push(`exception: ${error.message}`));
  page.on("console",message=>{if(["error","warning"].includes(message.type()))messages.push(`${message.type()}: ${message.text()}`);});
});
test.afterEach(async({page},info)=>{
  const messages=browserMessages.get(page)??[];
  await writeFile(resolve(output,`console-${info.title.replace(/[^a-z0-9]+/gi,"-")}.json`),JSON.stringify(messages,null,2));
  const unexpected=messages.filter(message=>!(info.title.includes("catalogue fallback")&&message.includes("net::ERR_FAILED")));
  expect(unexpected).toEqual([]);
});
test("UI Sound port conformance and legal too-strong teaching",async({page})=>{
  await page.setViewportSize({width:960,height:540});await page.goto("http://127.0.0.1:1421/?ui-proof");
  await page.getByRole("button",{name:"sound proof",exact:true}).click();
  for(const id of ["mute","next","previous","shuffle"])await page.locator(`[data-focus-id="sound:${id}"]`).click();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("transport-calls")).toHaveText("muted:true,start,next,start,previous,start,shuffle,start");
  await screen(page,"sound-port-conformance");
  let witness: {maze:number;directions:Direction[];direction:Direction}|undefined;
  for(let maze=1;maze<=CURATED_LEVELS.length&&!witness;maze++) {
    const level=CURATED_LEVELS[maze-1]!,initial=createInitialGameState(level);
    const potionIds=new Set(level.objects.filter(o=>o.kind==="potion").map(o=>o.id));
    const signature=(state:typeof initial)=>progressionStateSignature(state,false,potionIds);
    const queue=[{state:initial,path:[] as Direction[]}],seen=new Set([signature(initial)]);
    for(let head=0;head<queue.length&&head<4096&&!witness;head++)for(const direction of ["up","left","right","down"] as const) {
      const {state,path}=queue[head]!,probe=movePlayer(level,state,direction);
      if(probe.events.some(event=>event.type==="enemy-too-strong")) {witness={maze,directions:path,direction};break;}
      const id=signature(probe.state);
      if(!seen.has(id)&&probe.state.status==="playing") {seen.add(id);queue.push({state:probe.state,path:[...path,direction]});}
    }
  }
  expect(witness).toBeDefined();await pick(page,witness!.maze);await page.emulateMedia({reducedMotion:"reduce"});await page.locator(".maze-board").focus();
  for(const step of deriveRoute(CURATED_LEVELS[witness!.maze-1]!,witness!.directions))await replayRouteStep(page,step);
  const before=await readUiRouteState(page);await page.keyboard.press(key[witness!.direction]);
  await expect(page.getByRole("heading",{name:"Too strong!",exact:true})).toBeVisible();expect(await readUiRouteState(page)).toEqual(before);
  await expect(page.locator(".power-equation")).toContainText("<");
  await expect(page.locator(".power-opportunities")).toHaveAttribute("data-search-state","complete");
  await expect(page.locator('[data-opportunity-id="wishing-woods-enemy-power-5"]')).toHaveCount(1);
  for(const card of await page.locator(".power-opportunities article").all()) {
    const box=await card.boundingBox(),footer=await page.locator(".dialog-footer").boundingBox();expect(box!.y+box!.height).toBeLessThanOrEqual(footer!.y);
  }
  await screen(page,"too-strong-engine-opportunities");
  await page.getByRole("button",{name:"Show Required Path",exact:true}).click();await expect(page.locator(".hint-card")).toBeVisible();await page.keyboard.press("Escape");expect(await readUiRouteState(page)).toEqual(before);
});
test("UI complete dialog geometry, extreme content, DPR2 and text resizing",async({page,browser})=>{
  for(const [width,height] of sizes) {
    await page.setViewportSize({width,height});await pick(page,12);
    for(const big of [false,true]) {
      if(big)await action(page,"big-maze");
      for(const id of ["hint","help","sound","bag:boots","mazes","tester"]) {
        const trigger=page.locator(`[data-focus-id="${id}"]:visible`);
        if(!await trigger.isVisible())await page.locator('[data-focus-id="more"]').click();
        await trigger.click();const dialog=page.getByRole("dialog").last();await expect(dialog).toBeVisible();
        const measure=await dialog.evaluate(e=>({rect:e.getBoundingClientRect().toJSON(),sw:e.scrollWidth,cw:e.clientWidth,body:!!e.querySelector('[data-scroll-region="dialog-body"]')}));
        expect(measure.rect.x).toBeGreaterThanOrEqual(0);expect(measure.rect.bottom).toBeLessThanOrEqual(height);
        expect(measure.sw).toBeLessThanOrEqual(measure.cw);expect(measure.body).toBe(true);
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toHaveCount(0);
        expect(await page.locator(".play-shell").getAttribute("data-mode")).toBe(big?"big":"normal");
      }
    }
    await page.goto("http://127.0.0.1:1421/?ui-proof");await page.getByLabel("Extreme content").check();await page.getByLabel("Equipment count").selectOption("12");
    await page.addStyleTag({content:`html {font-size:200%;} p,button,h2 {line-height:1.5;letter-spacing:.12em;word-spacing:.16em;} p {margin-bottom:2em;}`});
    await expect(page.locator(".inventory-slot")).toHaveCount(12);
    for(const selector of [".inventory-grid",".rescue-list",".objective-card",".adventure-hud"]) {
      const extent=await page.locator(selector).evaluate(e=>({sw:e.scrollWidth,cw:e.clientWidth}));
      expect(extent.sw,selector).toBeLessThanOrEqual(extent.cw+1);
    }
    await screen(page,`extreme-text-${width}x${height}`);
    for(const variant of ["standard","blocker","hint","story","celebration","turns"]) {
      await page.getByRole("button",{name:`${variant} proof`,exact:true}).click();
      const rect=await page.getByRole("dialog").boundingBox();expect(rect!.height).toBeLessThanOrEqual(height);expect(rect!.width).toBeLessThanOrEqual(width);
      const close=page.locator('[data-focus-id="dialog-close"]');await expect(close).toBeInViewport();await close.click();
    }
  }
  const context=await browser.newContext({viewport:{width:1194,height:834},deviceScaleFactor:2,baseURL:"http://127.0.0.1:4173"});
  const retina=await context.newPage();await pick(retina,12);await screen(retina,"ipad-dpr2");await retina.locator('[data-focus-id="bag:boots"]').click();await screen(retina,"item-fallback-dpr2");
  expect(await retina.evaluate(()=>devicePixelRatio)).toBe(2);await context.close();
});
const busy = ".battle-presentation,.rescue-presentation,.jump-presentation,.portal-presentation,.door-opening-presentation";
const key: Record<Direction,string> = {up:"ArrowUp",down:"ArrowDown",left:"ArrowLeft",right:"ArrowRight"};

test.beforeAll(async () => {
  await mkdir(output,{recursive:true});
  await writeFile(resolve(output,"source-state.json"),JSON.stringify({capturedAt:new Date().toISOString(),head:execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),workingTree:execFileSync("git",["status","--short"],{encoding:"utf8"}),evidenceClass:"dirty candidate, production preview; not release or hardware qualification"},null,2));
});
async function pick(page:Page, maze:number) {
  await page.goto("/?debug=mazes");
  await page.getByRole("button",{name:new RegExp(`^Test story maze ${maze}:`)}).click();
  await expect(page.locator(".maze-board")).toBeVisible();
  await page.evaluate(()=>document.fonts.ready);
}
async function action(page:Page,id:string) {
  const control=page.locator(`button[data-focus-id="${id}"]:visible`);
  if(!await control.count())await page.locator('[data-focus-id="more"]').click();
  await control.click();
}
async function screen(page:Page,name:string) {
  await page.locator("img:visible").evaluateAll(images=>Promise.all(images.filter(image=>{const r=image.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;}).map(image=>(image as HTMLImageElement).decode().catch(()=>{}))));
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
  await page.screenshot({path:resolve(output,`${name}.png`)});
}
async function geometry(page:Page) {
  return page.evaluate(() => {
    const bounds = (e:Element) => {const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
    const elements = Object.fromEntries([".maze-board",".maze-panel",".adventure-hud",".objective-card",".maze-map-card",".maze-minimap",".inventory-grid",".rescue-list"].map(selector=>{
      const e=document.querySelector<HTMLElement>(selector)!;return [selector,{...bounds(e),scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,scrollHeight:e.scrollHeight,clientHeight:e.clientHeight}];
    }));
    const targets = [...document.querySelectorAll<HTMLElement>(".adventure-hud button")].filter(e=>e.getClientRects().length).map(e=>({...bounds(e),id:e.dataset.focusId,font:getComputedStyle(e).fontSize}));
    return {elements,targets,bag:[...document.querySelectorAll(".inventory-slot")].map(bounds),friends:[...document.querySelectorAll(".rescue-friend")].map(bounds),rootOverflow:document.documentElement.scrollWidth>innerWidth,objectiveFont:getComputedStyle(document.querySelector(".objective-card p")!).fontSize,stageTransform:getComputedStyle(document.querySelector(".game-stage")!).transform};
  });
}
for (const [width,height] of sizes) test(`UI geometry ${width}x${height}: authored maximums Normal and Big`,async({page})=>{
  await page.setViewportSize({width,height});
  const records:unknown[]=[];
  for (const maze of selectedMazes) {
    await pick(page,maze);
    const expected=buildAdventureHudModel(CURATED_LEVELS[maze-1]!,createInitialGameState(CURATED_LEVELS[maze-1]!));
    let normal=0;
    for(const mode of ["normal","big"]){
      if(mode==="big") await action(page,"big-maze");
      await page.locator(".adventure-hud").evaluate(e=>e.scrollTop=0);
      await page.waitForTimeout(100);
      const g=await geometry(page);records.push({width,height,maze,mode,...g});
      await screen(page,`${width}x${height}-maze${maze}-${mode}`);
      const board=g.elements[".maze-board"]!,deck=g.elements[".adventure-hud"]!,map=g.elements[".maze-minimap"]!,mapCard=g.elements[".maze-map-card"]!;
      expect(Math.abs(board.width-board.height)).toBeLessThan(.1);
      expect(board.right).toBeLessThanOrEqual(deck.x);
      expect(g.stageTransform).toBe("none");expect(g.rootOverflow).toBe(false);
      if(mode==="normal")normal=board.width;else expect(board.width).toBeGreaterThanOrEqual(normal);
      expect(map.width).toBeGreaterThanOrEqual(width>=1280?192:width>=960?160:width>=844?120:96);
      expect(map.y-mapCard.y).toBeLessThan(32);
      expect(mapCard.bottom-map.bottom).toBeLessThan(55);
      expect(g.bag).toHaveLength(expected.bagTotal);expect(g.friends).toHaveLength(expected.rescueTotal);
      for(const item of [...g.bag,...g.friends]) {expect(item.x).toBeGreaterThanOrEqual(deck.x);expect(item.right).toBeLessThanOrEqual(deck.right);expect(item.y).toBeGreaterThanOrEqual(deck.y);expect(item.bottom).toBeLessThanOrEqual(deck.bottom);expect(item.bottom).toBeLessThanOrEqual(height);}
      for(const target of g.targets) {const minimum=target.id==="hint"||target.id?.startsWith("move:")?48:44;expect(target.width,`${target.id} width`).toBeGreaterThanOrEqual(minimum);expect(target.height,`${target.id} height`).toBeGreaterThanOrEqual(minimum);}
      expect(deck.scrollWidth).toBeLessThanOrEqual(deck.clientWidth);
      expect(deck.scrollHeight,`deck scroll ${maze}/${mode}`).toBeLessThanOrEqual(deck.clientHeight+1);
      expect(parseFloat(g.objectiveFont)).toBeGreaterThanOrEqual(16);
    }
  }
  await writeFile(resolve(output,`geometry-${width}x${height}.json`),JSON.stringify(records,null,2));
});

test("UI overlays: focus, inertness, held input, safe return and Sound preferences",async({page})=>{
  await page.setViewportSize({width:960,height:540});await pick(page,12);
  const trigger=page.locator('[data-focus-id="hint"]');
  const before=await page.locator(".step-pill").getAttribute("aria-label");
  await trigger.click();await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".play-shell")).toHaveAttribute("inert","");
  await page.keyboard.press("ArrowLeft");await page.keyboard.press("w");
  expect(await page.locator(".step-pill").getAttribute("aria-label")).toBe(before);
  for(let i=0;i<12;i++){await page.keyboard.press(i%2?"Shift+Tab":"Tab");expect(await page.evaluate(()=>!!document.activeElement?.closest('[role="dialog"]'))).toBe(true);}
  await screen(page,"hint-focus-960");await page.keyboard.press("Escape");await expect(trigger).toBeFocused();
  await page.keyboard.press("ArrowLeft");await expectUiRouteState(page,movePlayer(CURATED_LEVELS[11]!,createInitialGameState(CURATED_LEVELS[11]!),"left").state);
  await page.locator('[data-focus-id="sound"]').click();
  await page.getByLabel("Reduced",{exact:true}).check();await page.getByLabel("lite",{exact:true}).check();
  await expect(page.locator("html")).toHaveAttribute("data-motion","reduced");await expect(page.locator("html")).toHaveAttribute("data-quality","lite");
  await page.locator('[data-focus-id="sound:mute"]').click();await page.locator('[data-focus-id="sound:next"]').click();await page.locator('[data-focus-id="sound:previous"]').click();await page.locator('[data-focus-id="sound:shuffle"]').click();
  await expect(page.getByRole("button",{name:/loop/i})).toHaveCount(0);await screen(page,"sound-comfort-960");
  await page.keyboard.press("Escape");await expect(page.locator('[data-focus-id="sound"]')).toBeFocused();
  await page.locator('[data-focus-id="home"]').click();await page.getByRole("button",{name:"Reset progress",exact:true}).click();
  await screen(page,"reset-safe-default");await expect(page.getByRole("button",{name:"Keep my adventure"})).toBeFocused();await page.getByRole("button",{name:"Yes, reset everything"}).click();
  const preference=await page.evaluate(()=>JSON.parse(localStorage.getItem("maze-so-puzzle-presentation-v1")!));expect(preference).toEqual({motion:"reduced",quality:"lite"});
});

test("UI front door, Home hero v04, Book, all modal sizes and text spacing",async({page})=>{
  for(const [width,height]of sizes){
    await page.setViewportSize({width,height});await page.goto("/");await page.evaluate(()=>localStorage.clear());await page.reload();await page.getByRole("button",{name:"Play",exact:true}).waitFor();await screen(page,`title-${width}x${height}`);
    await page.getByRole("button",{name:"Play",exact:true}).click();await expect(page.locator(".title-hero")).toHaveAttribute("src",/home-hero-splash-v04/);await screen(page,`home-${width}x${height}`);
    await page.getByRole("button",{name:/Begin adventure/}).click();await screen(page,`story-${width}x${height}`);
    const dialog=page.getByRole("dialog");const box=await dialog.boundingBox();expect(box!.height).toBeLessThanOrEqual(height);expect(box!.width).toBeLessThanOrEqual(width);
    await page.getByRole("button",{name:"Start the maze",exact:true}).click();
    await action(page,"book");await screen(page,`book-${width}x${height}`);
    await page.getByRole("button",{name:/Home/}).click();
  }
  await page.setViewportSize({width:960,height:540});await pick(page,12);
  await page.addStyleTag({content:'html {font-size:200%;} p, h1, h2, h3, button, label {line-height:1.5;letter-spacing:.12em;word-spacing:.16em;} p {margin-bottom:2em;}'});
  await screen(page,"200percent-text-spacing-play");
  const g=await geometry(page);expect(g.elements[".adventure-hud"]!.scrollWidth).toBeLessThanOrEqual(g.elements[".adventure-hud"]!.clientWidth);
  await page.locator('[data-focus-id="hint"]').click();await screen(page,"200percent-text-spacing-dialog");
  await page.getByRole("button",{name:"Got it!"}).scrollIntoViewIfNeeded();await expect(page.getByRole("button",{name:"Got it!"})).toBeInViewport();
});

test("UI catalogue fallback and DEV-only integration proof",async({page})=>{
  await page.setViewportSize({width:1280,height:720});await page.goto("http://127.0.0.1:1421/?ui-proof");
  await page.getByRole("heading",{name:/styled component/}).waitFor();
  for(let count=1;count<=12;count++){await page.getByLabel("Equipment count").selectOption(String(count));await expect(page.locator(".inventory-slot")).toHaveCount(count);const g=await page.locator(".inventory-grid").evaluate(e=>({scroll:e.scrollWidth,width:e.clientWidth}));expect(g.scroll).toBeLessThanOrEqual(g.width);}
  await page.getByLabel("Equipment count").selectOption("7");
  for(const quality of ["full","lite","static"]){await page.getByLabel("Quality",{exact:true}).selectOption(quality);await screen(page,`styled-proof-${quality}`);}
  for(const variant of ["standard","blocker","hint","story","celebration"]){await page.getByRole("button",{name:`${variant} proof`,exact:true}).click();await screen(page,`dialog-proof-${variant}`);await page.keyboard.press("Escape");}
  for(const [width,height]of [[960,540],[568,320]]) {
    await page.setViewportSize({width,height});
    for(let index=0;index<7;index++) {
      await page.getByLabel("Required item").selectOption(String(index));await page.getByRole("button",{name:"blocker proof",exact:true}).click();
      await screen(page,`required-item-${index}-${width}`);
      const subject=await page.locator(".presentation-art img").evaluate((e:HTMLElement)=>Math.max(...e.dataset.artVisibleBounds!.split(",").map(Number).slice(2))*e.getBoundingClientRect().width);
      expect(subject).toBeGreaterThanOrEqual(width===568?96:144);
      await page.keyboard.press("Escape");
    }
  }
  await page.setViewportSize({width:1280,height:720});
  await page.getByRole("button",{name:"turns proof"}).click();await expect(page.locator('[data-turn-id="first"]')).toBeVisible();await page.getByRole("button",{name:"Next",exact:true}).click();await expect(page.locator('[data-turn-id="second"]')).toBeVisible();await page.getByRole("button",{name:"Next",exact:true}).click();await expect(page.locator('[data-turn-id="third"]')).toBeVisible();await screen(page,"three-turn-story-host");await page.getByRole("button",{name:"Start the maze"}).click();
  await page.getByRole("button",{name:"Catalogue rack"}).click();await expect(page.locator('[aria-label="Complete semantic catalogue"] article')).toHaveCount(UI_ART.length);
  await page.locator('[aria-label="Complete semantic catalogue"] img').evaluateAll(images=>Promise.all(images.map(image=>(image as HTMLImageElement).decode().catch(()=>{}))));
  await page.screenshot({path:resolve(output,"catalogue-family-proof.png"),fullPage:true});
  await writeFile(resolve(output,"presentation-gaps.json"),JSON.stringify(UI_ART.filter(art=>!art.variants?.some(v=>v.usage==="presentation")).map(art=>({id:art.id,family:art.family,src:art.src,width:art.width,height:art.height})),null,2));
  await page.goto("/?debug=mazes");await page.getByRole("button",{name:/Test story maze 12:/}).click();
  await page.waitForLoadState("networkidle"); // isolate this dialog from level-entry requests
  const requested:string[]=[];page.on("request",request=>{if(request.resourceType()==="image")requested.push(request.url());});
  await page.locator('[data-focus-id="bag:boots"]').click();await expect(page.locator(".presentation-art")).toHaveAttribute("data-presentation-available","true");await screen(page,"correct-equipment-presentation-candidate");
  await writeFile(resolve(output,"on-demand-dialog-images.json"),JSON.stringify(requested,null,2));expect(requested.length).toBeLessThan(4);
  await page.keyboard.press("Escape");await page.route("**/*splash-boots*.webp",route=>route.abort());await page.reload();await page.getByRole("button",{name:/Test story maze 12:/}).click();await page.locator('[data-focus-id="bag:boots"]').click();await expect(page.locator(".presentation-art .art-fallback")).toBeVisible();await screen(page,"failed-media-correct-text-fallback");await page.getByRole("button",{name:"Back to the adventure",exact:true}).click();
});

test("UI legal perfect route preserves pending completion and focus defaults",async({page})=>{
  await page.setViewportSize({width:960,height:540});await page.emulateMedia({reducedMotion:"reduce"});await pick(page,1);
  const level=CURATED_LEVELS[0]!;const solution=solveLevel(level,{requireAllAnimals:true});expect(solution.solvable).toBe(true);
  await page.locator(".maze-board").focus();
  let expected=createInitialGameState(level);
  for(const direction of solution.directions){
    await expect(page.locator(busy)).toHaveCount(0);
    await page.waitForTimeout(110);
    expected=movePlayer(level,expected,direction).state;
    await page.keyboard.press(key[direction]);
    await expect(page.locator(".step-pill")).toHaveAttribute("aria-label",`${expected.steps} ${expected.steps===1?"step":"steps"}`);
  }
  await expect(page.getByRole("heading",{name:"Maze solved!"})).toBeVisible();await screen(page,"perfect-completion");
  await expect(page.locator(".dialog-footer .primary-button")).toContainText(/Next/);
  await page.getByRole("button",{name:"Stay here",exact:true}).click();await expect(page.locator(".maze-board")).toBeFocused();
});

test("UI input parity: keyboard, pointer, touch, on-screen controls and cancellation",async({page,context})=>{
  await page.setViewportSize({width:844,height:390});await page.emulateMedia({reducedMotion:"reduce"});
  const level=CURATED_LEVELS[0]!;const first=solveLevel(level).directions[0]!;
  const delta={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}[first];
  for(const source of ["keyboard","pointer","touch","onscreen","onscreen-keyboard"]){
    await pick(page,1);
    if(source==="keyboard"){await page.locator(".maze-board").focus();await page.keyboard.press(key[first]);}
    else if(source.startsWith("onscreen")){
      const control=page.getByRole("button",{name:`Move ${first}`,exact:true});await control.scrollIntoViewIfNeeded();
      if(source==="onscreen-keyboard"){await control.focus();await page.keyboard.press("Space");}else await control.click();
    }else{
      const tile=(await page.locator(".player-layer").boundingBox())!;
      const x=tile.x+tile.width*(.5+delta.x),y=tile.y+tile.height*(.5+delta.y);
      if(source==="pointer")await page.mouse.click(x,y);
      else {const cdp=await context.newCDPSession(page);await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});await cdp.detach();}
    }
    await expectUiRouteState(page,movePlayer(level,createInitialGameState(level),first).state);
    await page.waitForTimeout(450);await expectUiRouteState(page,movePlayer(level,createInitialGameState(level),first).state);
    await screen(page,`input-${source}-844`);
  }
  // Held-cadence cancellation shares the same engine-derived driver as the performance suite.
  const heldLevel=CURATED_LEVELS.find(level=>level.id==="lanternlight-labyrinth")!;
  const route=deriveRoute(heldLevel,solveLevel(heldLevel).directions),segment=heldSegment(heldLevel,route);
  await pick(page,CURATED_LEVELS.indexOf(heldLevel)+1);await page.locator(".maze-board").focus();
  for(const step of route.slice(0,segment.start))await replayRouteStep(page,step);
  await page.keyboard.down(key[segment.direction]);
  await page.waitForTimeout(120);
  await page.locator('[data-focus-id="hint"]').click();const stopped=await readUiRouteState(page);
  await page.waitForTimeout(600);expect(await readUiRouteState(page)).toEqual(stopped);
  await page.keyboard.up(key[segment.direction]);await page.keyboard.press("Escape");await page.waitForTimeout(300);expect(await readUiRouteState(page)).toEqual(stopped);
});

test("UI motion/quality, safe-area and responsive focus invariants",async({page})=>{
  await page.setViewportSize({width:1920,height:1080});await pick(page,12);
  for(const motion of ["full","reduced"] as const)for(const quality of ["full","lite","static"] as const){
    await page.locator('[data-focus-id="sound"]').click();await page.getByLabel(motion==="full"?"Full":"Reduced",{exact:true}).check();await page.getByLabel(quality,{exact:true}).check();await page.keyboard.press("Escape");
    const state=await page.evaluate(()=>({motion:document.documentElement.dataset.motion,quality:document.documentElement.dataset.quality,blur:getComputedStyle(document.querySelector(".adventure-hud")!).backdropFilter,animation:getComputedStyle(document.querySelector(".player-sprite")!).animationName}));
    expect(state.motion).toBe(motion);expect(state.quality).toBe(quality);expect(state.blur).toBe("none");if(motion==="reduced"||quality==="static")expect(state.animation).toBe("none");
    await screen(page,`tv-${motion}-${quality}`);
  }
  await page.locator('[data-focus-id="hint"]').focus();const focus=await page.locator('[data-focus-id="hint"]').evaluate(e=>({width:getComputedStyle(e).outlineWidth,style:getComputedStyle(e).outlineStyle}));expect(focus.style).not.toBe("none");await screen(page,"tv-focus-visible");
  await page.setViewportSize({width:844,height:390});await page.addStyleTag({content:':root {--safe-left:44px;--safe-right:20px;--safe-top:8px;--safe-bottom:8px;}'});
  const g=await geometry(page);expect(g.elements[".maze-board"]!.x).toBeGreaterThanOrEqual(44);expect(g.elements[".adventure-hud"]!.right).toBeLessThanOrEqual(824);await screen(page,"phone-safe-area");
});

test("UI ordinary completion, exactly-once reward, earned Book detail and safe maze switch",async({page})=>{
  await page.setViewportSize({width:960,height:540});await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/");await page.getByRole("button",{name:"Play",exact:true}).click();await page.getByRole("button",{name:/Begin adventure/}).click();await page.getByRole("button",{name:"Start the maze"}).click();
  const level=CURATED_LEVELS[0]!;const route=deriveRoute(level,solveLevel(level,{avoidAnimals:true}).directions);
  await page.locator(".maze-board").focus();
  for(const step of route)await replayRouteStep(page,step);
  await expect(page.getByRole("button",{name:"Stay here",exact:true})).toBeFocused();await screen(page,"optional-friend-missing-safe-stay");
  await page.getByRole("button",{name:/^Next maze/}).evaluate((button:HTMLButtonElement)=>{button.click();button.click();});
  const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem("maze-so-puzzle-progress-v5")!));expect(progress.totalCompletions).toBe(1);
  await page.getByRole("button",{name:"Start the maze"}).click();await page.locator('[data-focus-id="book"]').click();
  const earned=page.locator(".badge-card.earned").first();await earned.click();await expect(page.locator(".presentation-art")).toHaveAttribute("data-presentation-available","true");await screen(page,"earned-keepsake-presentation");await page.keyboard.press("Escape");await expect(earned).toBeFocused();
  await page.keyboard.press("Enter");await expect(page.getByRole("dialog")).toBeVisible();await page.keyboard.press("Escape");await expect(earned).toBeFocused();
  await page.setViewportSize({width:844,height:390});await earned.scrollIntoViewIfNeeded();
  const target=(await earned.boundingBox())!,touch=await page.context().newCDPSession(page);
  await touch.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:target.x+target.width/2,y:target.y+target.height/2}]});await touch.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});await touch.detach();
  await expect(page.getByRole("dialog")).toBeVisible();await screen(page,"earned-touch-844");await page.keyboard.press("Escape");await expect(earned).toBeFocused();
  await page.setViewportSize({width:960,height:540});
  await pick(page,12);await page.locator(".maze-board").focus();await page.keyboard.press("ArrowLeft");await page.locator('[data-focus-id="mazes"]').click();await page.locator(".level-picker-list button").first().click();
  await expect(page.getByRole("heading",{name:"Start a different maze?"})).toBeVisible();await expect(page.getByRole("button",{name:"Keep this maze"})).toBeFocused();await screen(page,"safe-maze-switch");await page.keyboard.press("Escape");await expect(page.locator(".maze-board")).toBeVisible();
});


test("UI Human-reviewable proof sheets",async({page})=>{
  const groups:Record<string,string[]>={
    "layout-proof":sizes.map(([w,h])=>`${w}x${h}-maze12-normal`),
    "materials-proof":["styled-proof-full","styled-proof-lite","styled-proof-static","dialog-proof-blocker","earned-keepsake-presentation","three-turn-story-host","sound-comfort-960","tv-focus-visible"],
    "fallback-text-proof":["required-item-1-960","required-item-1-568","failed-media-correct-text-fallback","200percent-text-spacing-play","200percent-text-spacing-dialog","phone-safe-area","too-strong-engine-opportunities"]
  };
  for(const [name,stems]of Object.entries(groups)) {
    const cards=await Promise.all(stems.map(async stem=>`<figure><img src="data:image/png;base64,${(await readFile(resolve(output,stem+".png"))).toString("base64")}"><figcaption>${stem}</figcaption></figure>`));
    const html=`<!doctype html><meta charset="utf-8"><title>Plan 01 ${name}</title><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#f6efe8;color:#44324f;font:16px system-ui}h1{font-size:28px}main{display:grid;grid-template-columns:1fr 1fr;gap:20px}figure{margin:0;background:white;padding:8px;border:1px solid #cab9d0;border-radius:12px}img{display:block;width:100%;height:350px;object-fit:contain}figcaption{padding:8px;overflow-wrap:anywhere}</style><h1>Plan 01 · ${name}</h1><p>Dirty candidate at 09413c1 · Edge browser evidence, not device or Human acceptance. Art and allocation gates remain open. Full-size originals are adjacent.</p><main>${cards.join("")}</main>`;
    await writeFile(resolve(output,name+".html"),html);await page.setViewportSize({width:1600,height:1100});await page.setContent(html);
    await page.locator("img").evaluateAll(images=>Promise.all(images.map(image=>(image as HTMLImageElement).decode())));
    await page.screenshot({path:resolve(output,name+".png"),fullPage:true});
  }
});
