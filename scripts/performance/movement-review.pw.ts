/** MOVE-01: real engine-derived journeys; frame sampling is diagnostic overhead. */
import { test, expect, type Page } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { CURATED_LEVELS } from "../../src/game/levels";
import { solveLevel } from "../../src/game/solver";
import { createInitialGameState, movePlayer } from "../../src/game/engine";
import { DIRECTIONS, DIRECTION_DELTAS, type Direction } from "../../src/game/types";
import { advanceFollowerProcession, createFollowerProcession, followerTargets } from "../../src/game/followerTrail";
import { deriveRoute, heldSegment, selectTesterLevel, replayRouteStep, expectUiRouteState, keyForDirection } from "./gameplay-browser";

const output = resolve(process.env.MAZE_PERF_EVIDENCE_DIR!, "movement");
const phase = process.env.MAZE_MOVE_PHASE ?? "after";

async function action(page:Page,id:string) {
  const control=page.locator(`button[data-focus-id="${id}"]:visible`);
  if(!await control.count()) await page.locator('[data-focus-id="more"]').click();
  await control.click();
}
async function travelState(page:Page) {
  return page.evaluate(()=>{
    const board=document.querySelector<HTMLElement>(".maze-board")!,world=board.querySelector<HTMLElement>(".camera-world")!,player=board.querySelector<HTMLElement>(".player-layer")!;
    const rect=board.getBoundingClientRect(),cols=Number(board.style.getPropertyValue("--grid-size"));
    const size={x:parseFloat(getComputedStyle(board).width)-board.clientLeft*2,y:parseFloat(getComputedStyle(board).height)-board.clientTop*2};
    const cell={x:size.x/cols,y:size.y/cols};
    const translation=(element:HTMLElement)=>{const parts=getComputedStyle(element).translate.split(" ");return {x:parseFloat(parts[0]!)||0,y:parseFloat(parts[1]!)||0};};
    const w=translation(world),p=translation(player);
    const logicalCamera={x:-parseFloat(world.style.left)*cols/100,y:-parseFloat(world.style.top)*cols/100};
    const logical={x:parseFloat(player.style.left)*cols/100+logicalCamera.x,y:parseFloat(player.style.top)*cols/100+logicalCamera.y};
    const position={x:logical.x+(p.x-w.x)/cell.x,y:logical.y+(p.y-w.y)/cell.y};
    const camera={x:logicalCamera.x-w.x/cell.x,y:logicalCamera.y-w.y/cell.y};
    return {position,logical,camera,cell,center:{x:rect.left+board.clientLeft+(position.x-camera.x+.5)*cell.x,y:rect.top+board.clientTop+(position.y-camera.y+.5)*cell.y},state:board.dataset.travelState,
      followers:Array.from(board.querySelectorAll<HTMLElement>("[data-follower-id]")).map(f=>{const t=translation(f);return {id:f.dataset.followerId,
        x:parseFloat(f.style.left)*Number(world.style.width.replace("%",""))/100*cols/100+t.x/cell.x,
        y:parseFloat(f.style.top)*Number(world.style.height.replace("%",""))/100*cols/100+t.y/cell.y};})};
  });
}

async function sampleMotion(page: Page) {
  await page.evaluate(() => {
    const board = document.querySelector<HTMLElement>(".maze-board")!;
    const world = board.querySelector<HTMLElement>(".camera-world")!;
    const player = board.querySelector<HTMLElement>(".player-layer")!;
    const frames: unknown[] = [], inputs: unknown[] = [], tasks: unknown[] = [];
    const record = { frames, inputs, tasks, running: true };
    (window as any).__movementReview = record;
    window.addEventListener("keydown", event => inputs.push({ at: performance.now(), key: event.key }));
    const observer = new PerformanceObserver(list => tasks.push(...list.getEntries().map(e => ({ at: e.startTime, ms: e.duration }))));
    observer.observe({ entryTypes: ["longtask"] });
    const frame = (at: number) => {
      const b = board.getBoundingClientRect(), w = world.getBoundingClientRect(), p = player.getBoundingClientRect();
      frames.push({ at, board: [b.x,b.y,b.width,b.height], world: [w.x-b.x,w.y-b.y], player: [p.x-b.x,p.y-b.y],
        steps: document.querySelector(".step-pill")?.getAttribute("aria-label"),
        target: [world.style.left,world.style.top,player.style.left,player.style.top],
        travel: board.dataset.travelState ?? "legacy-css", followerCount: board.querySelectorAll(".pet-follower").length });
      if (record.running) requestAnimationFrame(frame); else observer.disconnect();
    };
    requestAnimationFrame(frame);
  });
}

test.beforeAll(async () => { await mkdir(output, { recursive: true }); });

for (const name of ["Lanternlight Labyrinth", "Rainbow Power Parade", "Twilight Treasure Loop"]) {
  test(`MOVE comparison held route: ${name}`, async ({ page }) => {
    const level = CURATED_LEVELS.find(l => l.name === name)!;
    const route = deriveRoute(level, solveLevel(level).directions);
    const segment = heldSegment(level, route);
    const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
    await page.setViewportSize({ width: 1280, height: 720 });
    await selectTesterLevel(page, level);
    await page.locator(".maze-board").focus();
    // Setup uses the existing reduced presentation setting, then the same full
    // movement cohort is recorded before/after. No game state is injected.
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const step of route.slice(0,segment.start)) await replayRouteStep(page,step);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForTimeout(350);
    await sampleMotion(page);
    await page.keyboard.down(keyForDirection[segment.direction]);
    try { await expectUiRouteState(page, segment.after); }
    finally { await page.keyboard.up(keyForDirection[segment.direction]); }
    await page.waitForTimeout(380);
    await expectUiRouteState(page, segment.after);
    const samples = await page.evaluate(() => { const r=(window as any).__movementReview; r.running=false; return r; });
    await page.screenshot({ path: resolve(output,`${phase}-${level.id}-end.png`) });
    await writeFile(resolve(output,`${phase}-${level.id}.json`), JSON.stringify({
      phase, levelId: level.id, viewport: [1280,720], input: "keyboard held",
      segment: {start:segment.start,length:segment.length,direction:segment.direction},
      expected: {before:segment.before.position, after:segment.after.position, steps:segment.length},
      build: JSON.parse(await readFile("node_modules/.cache/maze-performance/build-provenance.json","utf8")),
      classification: "report-only; no host attestation; frame DOM reads add measurement overhead", samples,
    },null,2));
    expect(errors).toEqual([]);
    if (phase === "after") await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state","settled");
  });
}

for(const [width,height] of [[1920,1080],[1280,720],[1194,834],[1024,768],[960,540],[844,390],[568,320]]) {
  test(`MOVE viewport input and cancellation ${width}x${height}`,async({page})=>{
    test.skip(phase==="before","The pre-change comparison is the three identical held routes.");
    const level=CURATED_LEVELS.find(l=>l.id==="lanternlight-labyrinth")!, initial=createInitialGameState(level);
    const direction=DIRECTIONS.find(d=>{const r=movePlayer(level,initial,d);return r.moved&&r.events.every(e=>e.type==="moved");})!;
    const opposite:Record<Direction,Direction>={up:"down",down:"up",left:"right",right:"left"};
    const records=[];
    await page.setViewportSize({width:width!,height:height!});
    {
      await selectTesterLevel(page,level);
      await expect(page.locator(".play-shell")).toHaveAttribute("data-mode","maximized");
      await expect(page.locator('[data-focus-id="big-maze"]')).toHaveCount(0);
      await page.locator(".maze-board").focus();
      await page.keyboard.press(keyForDirection[direction]);
      await page.waitForTimeout(70);
      const mid=await travelState(page);
      // Reverse from the painted centre through the actual pointer path.
      const delta=DIRECTION_DELTAS[opposite[direction]];
      await page.mouse.click(mid.center.x+delta.x*mid.cell.x*.7,mid.center.y+delta.y*mid.cell.y*.7);
      const reversed=movePlayer(level,movePlayer(level,initial,direction).state,opposite[direction]).state;
      await expectUiRouteState(page,reversed);
      await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state","settled");
      const stopped=await travelState(page);expect(stopped.position.x).toBeCloseTo(initial.position.x,4);expect(stopped.position.y).toBeCloseTo(initial.position.y,4);
      await page.getByRole("button",{name:`Move ${direction}`,exact:true}).click();
      const after=movePlayer(level,reversed,direction).state;await expectUiRouteState(page,after);
      await action(page,"hint");
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press(keyForDirection[direction]);
      await expectUiRouteState(page,after);
      await page.keyboard.press("Escape");
      await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state","settled");
      await page.waitForTimeout(350);await expectUiRouteState(page,after);
      records.push({mode:"maximized",mid,stopped,after:await travelState(page)});
      await page.screenshot({path:resolve(output,`matrix-${width}-${height}-maximized.png`)});
    }
    await writeFile(resolve(output,`matrix-${width}-${height}.json`),JSON.stringify(records,null,2));
  });
}

test("MOVE DPR2 touch, reduced/static and resize",async({browser})=>{
  test.skip(phase==="before");
  for(const viewport of [{width:1194,height:834},{width:568,height:320}]) {
    const context=await browser.newContext({viewport,deviceScaleFactor:2,hasTouch:true,baseURL:"http://127.0.0.1:4173"});
    const page=await context.newPage(), level=CURATED_LEVELS[0]!;
    await selectTesterLevel(page,level);await page.emulateMedia({reducedMotion:"reduce"});
    const initial=createInitialGameState(level), expected=movePlayer(level,initial,"up").state;
    const before=await travelState(page);
    await page.touchscreen.tap(before.center.x,before.center.y-before.cell.y*.7);
    await expectUiRouteState(page,expected);
    await page.setViewportSize({width:viewport.width-10,height:viewport.height});
    await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state","settled");
    const still=await travelState(page);expect(still.camera.x).toBeCloseTo(0,5);expect(still.camera.y).toBeCloseTo(0,5);
    await page.waitForTimeout(380);await expectUiRouteState(page,expected);
    await action(page,"sound");
    await page.getByRole("group",{name:"Surface quality"}).getByRole("radio",{name:"static",exact:true}).check();
    await page.keyboard.press("Escape");
    await page.getByRole("button",{name:"Move down",exact:true}).click();
    await expectUiRouteState(page,movePlayer(level,expected,"down").state);
    await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state","settled");
    await page.screenshot({path:resolve(output,`touch-dpr2-${viewport.width}.png`)});
    await context.close();
  }
});

for(const kind of ["door-opened","enemy-defeated","hole-jumped","portal-warped"] as const) {
  test(`MOVE interaction handoff ${kind}`,async({page})=>{
    const fixtures=CURATED_LEVELS.map(level=>({level,route:deriveRoute(level,solveLevel(level,{requireAllAnimals:true}).directions)}));
    const choices=fixtures.flatMap(({level,route})=>route.flatMap((step,index)=>{
      if(!step.result.events.some(e=>e.type===kind))return [];
      if((kind==="hole-jumped"||kind==="portal-warped")&&step.before.rescuedAnimalIds.length===0)return [];
      const previous=route[index-1];
      if((kind==="door-opened"||kind==="enemy-defeated")&&(!previous?.result.moved||previous.result.events.some(e=>e.type!=="moved")))return [];
      return [{level,route,index}];
    })).sort((a,b)=>a.index-b.index);
    expect(choices.length).toBeGreaterThan(0);
    const {level,route,index}=choices[0]!;const step=route[index]!;
    await page.setViewportSize({width:1280,height:720});await selectTesterLevel(page,level);
    await page.emulateMedia({reducedMotion:"reduce"});await page.locator(".maze-board").focus();
    for(const setup of route.slice(0,index-1))await replayRouteStep(page,setup);
    await page.emulateMedia({reducedMotion:"no-preference"});
    await page.keyboard.press(keyForDirection[route[index-1]!.direction]);
    await page.waitForTimeout(70);const approach=await travelState(page);
    await page.keyboard.press(keyForDirection[step.direction]);await expectUiRouteState(page,step.result.state);
    const selector={"door-opened":".door-opening-presentation","enemy-defeated":".battle-presentation","hole-jumped":".jump-presentation","portal-warped":".portal-presentation"}[kind];
    await expect(page.locator(selector)).toHaveCount(1);
    const atHandoff=await travelState(page);
    if(kind==="hole-jumped"||kind==="portal-warped")await expect(page.locator("[data-follower-id]")).toHaveCount(0);
    else {
      expect(step.result.state.position).toEqual(step.before.position);
      await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state","settled");
      const stationary=await travelState(page);expect(stationary.position.x).toBeCloseTo(step.before.position.x,4);expect(stationary.position.y).toBeCloseTo(step.before.position.y,4);
      const translated=await page.evaluate(()=>[...document.querySelectorAll<HTMLElement>("[data-travel-camera-anchor]")].map(e=>({actual:e.style.translate,world:document.querySelector<HTMLElement>(".camera-world")!.style.translate})));
      for(const anchor of translated)expect(anchor.actual).toBe(anchor.world);
    }
    await page.screenshot({path:resolve(output,`interaction-${kind}.png`)});
    await expect(page.locator(selector)).toHaveCount(0);await page.waitForTimeout(380);await expectUiRouteState(page,step.result.state);
    const ended=await travelState(page);
    if(kind==="hole-jumped"||kind==="portal-warped")for(const follower of ended.followers){expect(follower.x).toBeCloseTo(step.result.state.position.x,4);expect(follower.y).toBeCloseTo(step.result.state.position.y,4);}
    await writeFile(resolve(output,`interaction-${kind}.json`),JSON.stringify({levelId:level.id,index,events:step.result.events,approach,atHandoff,ended},null,2));
  });
}

test("MOVE five friends follow real corridors, reverse and stay off camera",async({page})=>{
  const level=CURATED_LEVELS.find(l=>l.id==="moonlit-friendship-quest")!;
  const route=deriveRoute(level,solveLevel(level,{requireAllAnimals:true}).directions);
  await page.setViewportSize({width:960,height:540});await selectTesterLevel(page,level);await page.emulateMedia({reducedMotion:"reduce"});await page.locator(".maze-board").focus();
  let procession=createFollowerProcession(level.start),state=createInitialGameState(level);const records=[];
  let offCamera=false;
  const check=async()=>{
    await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state","settled");
    const painted=await travelState(page),expected=followerTargets(procession);
    expect(painted.followers.map(f=>f.id)).toEqual(expected.map(f=>f.id));
    for(let i=0;i<expected.length;i++){
      const f=painted.followers[i]!,e=expected[i]!;expect(f.x).toBeCloseTo(e.point.x,4);expect(f.y).toBeCloseTo(e.point.y,4);
      offCamera ||= f.x<painted.camera.x||f.x>painted.camera.x+5||f.y<painted.camera.y||f.y>painted.camera.y+5;
    }
    records.push(painted);
  };
  for(const step of route){
    if(step.result.state.status!=="playing")break;
    await replayRouteStep(page,step);state=step.result.state;
    if(step.result.moved)procession=advanceFollowerProcession(procession,state.position,state.rescuedAnimalIds,step.result.events.some(e=>e.type==="hole-jumped"||e.type==="portal-warped"));
    await check();
  }
  expect(state.rescuedAnimalIds).toHaveLength(5);
  const safe=DIRECTIONS.find(d=>{const r=movePlayer(level,state,d);return r.moved&&r.events.every(e=>e.type==="moved");})!;
  expect(safe).toBeDefined();const opposite={up:"down",down:"up",left:"right",right:"left"} as const;
  for(let i=0;i<8;i++){
    const direction=i%2?opposite[safe]:safe,result=movePlayer(level,state,direction);
    await replayRouteStep(page,{before:state,direction,result});state=result.state;
    procession=advanceFollowerProcession(procession,state.position,state.rescuedAnimalIds);await check();
  }
  expect(offCamera).toBe(true);
  await page.screenshot({path:resolve(output,"five-friends-reversed.png")});
  await writeFile(resolve(output,"five-friends.json"),JSON.stringify({levelId:level.id,offCamera,records},null,2));
});

test("MOVE ordinary save, Book, reload, restart and hidden-page cancellation",async({page,context})=>{
  const level=CURATED_LEVELS[0]!,initial=createInitialGameState(level),expected=movePlayer(level,initial,"up").state;
  await page.goto("/");await page.getByRole("button",{name:"Play",exact:true}).click();await page.getByRole("button",{name:/Begin adventure/}).click();await page.getByRole("button",{name:"Start the maze",exact:true}).click();
  await page.locator(".maze-board").focus();await page.keyboard.down("ArrowUp");await page.waitForTimeout(70);
  const cdp=await context.newCDPSession(page);await cdp.send("Page.setWebLifecycleState",{state:"frozen"});await page.keyboard.up("ArrowUp");await page.waitForTimeout(380);await cdp.send("Page.setWebLifecycleState",{state:"active"});await cdp.detach();
  await page.evaluate(()=>window.dispatchEvent(new Event("blur"))); // explicitly exercises the shared blur cancellation listener
  await page.waitForTimeout(380);await expectUiRouteState(page,expected);
  await action(page,"book");await page.getByRole("button",{name:"Resume",exact:true}).click();await expectUiRouteState(page,expected);
  await page.reload();await page.getByRole("button",{name:"Play",exact:true}).click();await page.getByRole("button",{name:/^Continue Little Star Trail/}).click();await expectUiRouteState(page,expected);
  await expect(page.locator(".maze-board")).toHaveAttribute("data-travel-state","settled");
  await action(page,"restart");await action(page,"restart");await expectUiRouteState(page,initial);await page.waitForTimeout(380);await expectUiRouteState(page,initial);
  await page.screenshot({path:resolve(output,"ordinary-resume-restart.png")});
});
