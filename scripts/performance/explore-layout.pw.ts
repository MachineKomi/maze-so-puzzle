import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { CURATED_LEVELS } from "../../src/game/levels";
import { selectTesterLevel } from "./gameplay-browser";
import { keyForDirection, expectUiRouteState } from "./gameplay-browser";
import { findInputFixture, savedFixture } from "./v22-input-fixtures";
import { ACTIVE_RUN_STORAGE_KEY } from "../../src/session";
import { PLAYER_PROGRESS_STORAGE_KEY, createDefaultPlayerProgress } from "../../src/progress";
import { PRESENTATION_PREFERENCES_KEY, DEFAULT_PRESENTATION_PREFERENCES } from "../../src/motion";
import { getCameraWindow, visibleKeysInWindow } from "../../src/game/exploration";

const output = resolve(process.env.MAZE_PERF_EVIDENCE_DIR!, "explore-layout");
const baseline = process.env.MAZE_EXPLORE_BASELINE === "1";
const level = CURATED_LEVELS.find(l => l.objects.filter(o => o.kind === "animal").length === 5 && l.width > 6)!;
async function geometry(page: import("@playwright/test").Page) {
  return page.evaluate(()=>{
    const board=document.querySelector<HTMLElement>(".maze-board")!;
    const hud=document.querySelector<HTMLElement>(".adventure-hud")!;
    const equipment=hud.querySelector<HTMLElement>(".adventure-equipment")!;
    const rect=(e:Element)=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
    const b=rect(board),h=rect(hud),e=rect(equipment),scale=b.width/board.offsetWidth;
    const cx=(b.width-8*scale)/Number(board.style.getPropertyValue("--grid-size"));
    const cy=(b.height-8*scale)/Number(board.style.getPropertyValue("--grid-rows"));
    const essentials=[...hud.querySelectorAll('.inventory-slot,.rescue-friend,.thumb-pad,.maze-minimap,.explore-toolbar button')].map(element=>({name:element.getAttribute('aria-label')??element.className,rect:rect(element),collection:element.matches('.inventory-slot,.rescue-friend')}));
    return{board:b,hud:h,equipment:e,cx,cy,essentials,scroll:{width:hud.scrollWidth,client:hud.clientWidth},columns:Number(board.style.getPropertyValue('--grid-size')),rows:Number(board.style.getPropertyValue('--grid-rows'))};
  });
}

test("Classic is reversible and the whole first maze stays intact",async({page})=>{
  await mkdir(output,{recursive:true});await page.setViewportSize({width:1280,height:720});
  await selectTesterLevel(page,CURATED_LEVELS[0]!);
  const g=await geometry(page);
  expect(g.columns).toBe(CURATED_LEVELS[0]!.width);expect(g.rows).toBe(CURATED_LEVELS[0]!.height);
  await page.getByRole('button',{name:/^More/}).click();
  await page.getByRole('button',{name:'Use classic square view'}).click();
  await expect(page.locator('.play-shell')).toHaveAttribute('data-layout','primary-landscape');
  const b=await page.locator('.maze-board').boundingBox();expect(b!.width).toBeCloseTo(b!.height,0);
  await page.getByRole('button',{name:'Layout & more'}).click();
  await page.getByRole('button',{name:'Use spacious maze view'}).click();
  await expect(page.locator('.play-shell')).toHaveAttribute('data-layout','explore');
  await page.screenshot({path:resolve(output,'whole-tutorial.png')});
});

for(const folded of [false,true])test(`enlarged reader keeps controls and details accessible ${folded}`,async({page})=>{
  await mkdir(output,{recursive:true});await page.setViewportSize({width:844,height:390});
  await selectTesterLevel(page,level);
  if(folded)await page.getByRole('button',{name:'Fold sidebar'}).click();
  await page.evaluate(()=>{document.documentElement.style.fontSize='32px';});
  await expect(page.locator('.adventure-hud')).toHaveAttribute('data-reader','true');
  const reader=page.getByRole('region',{name:'Full objective and adventure status'});
  await reader.focus();await page.keyboard.press('End');
  await expect(page.locator('.thumb-pad')).toBeInViewport();
  await page.getByRole('button',{name:/^More/}).click();
  await page.getByRole('button',{name:'Objective & gentle hint'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.screenshot({path:resolve(output,`enlarged-hint-${folded}.png`)});
});

const jump=findInputFixture(events=>events.some(e=>e.type==='hole-jumped')&&!events.some(e=>e.type==='portal-warped'))!;
const walk=findInputFixture(events=>events.length===1&&events[0]?.type==='moved')!;
async function enterFixture(page:import('@playwright/test').Page,f:typeof walk,quality='full',motion='full') {
  await page.addInitScript(({snapshot,progress,preferences,keys})=>{
    localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));localStorage.setItem(keys.preferences,JSON.stringify(preferences));
  },{snapshot:{...savedFixture(f,'explore25'),revealedTiles:[]},progress:createDefaultPlayerProgress(16),preferences:{...DEFAULT_PRESENTATION_PREFERENCES,quality,motion,muted:true},keys:{run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY}});
  await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();
  await expectUiRouteState(page,f.before);
}
for(const [kind,f]of [['walk',walk],['jump',jump]] as const)for(const mode of ['full','lite','reduced','static'])test(`fold during ${kind} settles one engine action ${mode}`,async({page})=>{
  await mkdir(output,{recursive:true});await page.setViewportSize({width:1280,height:720});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.clock.install({time:new Date('2026-09-07T00:00:00Z')});
  await enterFixture(page,f,mode==='static'?'static':mode==='lite'?'lite':'full',mode==='reduced'?'reduced':'full');
  await page.clock.pauseAt(new Date('2026-09-07T01:00:00Z'));
  await page.keyboard.down(keyForDirection[f.direction]);await page.clock.runFor(48);
  await page.getByRole('button',{name:'Fold sidebar'}).click();
  await page.clock.runFor(1800);await page.keyboard.up(keyForDirection[f.direction]);
  await expectUiRouteState(page,f.result.state);
  await expect(page.locator('.maze-board')).toHaveAttribute('data-travel-state','settled');
  await expect(page.locator('.jump-presentation')).toHaveCount(0);
  const planes=await page.evaluate(()=>{
    const rect=(selector:string)=>document.querySelector(selector)!.getBoundingClientRect();const w=rect('.camera-world'),a=rect('.camera-actors'),f=rect('.maze-foreground');
    return {world:{x:w.x,y:w.y,width:w.width,height:w.height},delta:Math.max(Math.abs(w.x-a.x),Math.abs(w.y-a.y),Math.abs(w.x-f.x),Math.abs(w.y-f.y),Math.abs(w.width-f.width),Math.abs(w.height-f.height))};
  });
  expect(planes.delta).toBeLessThan(.5);expect(errors).toEqual([]);
  await checkGeometry(page,`${kind}-${mode}`);
});

test('fog uses actual expanded and folded viewport with monotonic Classic knowledge',async({page})=>{
  await mkdir(output,{recursive:true});await page.setViewportSize({width:1280,height:720});await enterFixture(page,jump);
  const before=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),ACTIVE_RUN_STORAGE_KEY);
  const g=await geometry(page),view=getCameraWindow(jump.level,jump.before.position,{width:g.columns,height:g.rows});
  expect(new Set(before.revealedTiles)).toEqual(new Set(visibleKeysInWindow(jump.level,view)));
  await page.getByRole('button',{name:'Fold sidebar'}).click();
  const folded=await geometry(page),keys=visibleKeysInWindow(jump.level,getCameraWindow(jump.level,jump.before.position,{width:folded.columns,height:folded.rows}));
  await expect.poll(async()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).revealedTiles.length,ACTIVE_RUN_STORAGE_KEY)).toBe(new Set([...before.revealedTiles,...keys]).size);
  const after=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),ACTIVE_RUN_STORAGE_KEY);
  expect(after.game).toEqual(before.game);
  await page.getByRole('button',{name:'Expand sidebar'}).focus();await page.keyboard.press('Enter');
  await expect(page.getByRole('button',{name:'Fold sidebar'})).toBeFocused();
  expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).revealedTiles,ACTIVE_RUN_STORAGE_KEY)).toEqual(after.revealedTiles);
});
async function checkGeometry(page: import("@playwright/test").Page, name:string) {
  const g=await geometry(page);
  await writeFile(resolve(output,`${name}.json`),JSON.stringify(g,null,2));
  expect(Math.abs(g.cx-g.cy)).toBeLessThan(.2);
  expect(g.board.right).toBeLessThanOrEqual(g.hud.x+1);
  expect(g.scroll.width).toBeLessThanOrEqual(g.scroll.client+1);
  for(const item of g.essentials){
    const bounds=item.collection?g.equipment:g.hud;
    expect(item.rect.x,`${name} ${item.name} left`).toBeGreaterThanOrEqual(bounds.x-1);
    expect(item.rect.right,`${name} ${item.name} right`).toBeLessThanOrEqual(bounds.right+1);
    expect(item.rect.bottom,`${name} ${item.name} bottom`).toBeLessThanOrEqual(bounds.bottom+1);
  }
}
for (const [width, height] of [[1280,720],[1194,834],[844,390],[960,540],[1920,1080],[568,320],[2560,1080]]) {
  test(`exploration composition ${width}x${height}`, async ({ page }) => {
    await mkdir(output, { recursive: true });
    await page.setViewportSize({ width, height });
    await selectTesterLevel(page, level);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: resolve(output, `${width}x${height}-${baseline ? "baseline" : "expanded"}.png`) });
    if (baseline) return;
    await checkGeometry(page,`${width}x${height}-expanded`);
    const board = page.locator(".maze-board");
    const before = await board.boundingBox();
    await page.getByRole("button", { name: "Fold sidebar" }).click();
    await expect(page.getByRole("button", { name: "Expand sidebar" })).toBeVisible();
    await expect.poll(async () => (await board.boundingBox())!.width).toBeGreaterThan(before!.width + 50);
    await page.screenshot({ path: resolve(output, `${width}x${height}-folded.png`) });
    await checkGeometry(page,`${width}x${height}-folded`);
    await page.getByRole("button", { name: "Expand sidebar" }).click();
    await expect(page.getByRole("button", { name: "Fold sidebar" })).toBeVisible();
  });
}
