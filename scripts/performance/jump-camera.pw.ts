import { test, expect, type Page } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { CURATED_LEVELS } from "../../src/game/levels";
import { solveLevel } from "../../src/game/solver";
import { getCameraWindow, getVisibleTileKeys } from "../../src/game/exploration";
import { createActiveRunSnapshot, ACTIVE_RUN_STORAGE_KEY } from "../../src/session";
import { createDefaultPlayerProgress, PLAYER_PROGRESS_STORAGE_KEY } from "../../src/progress";
import { DEFAULT_PRESENTATION_PREFERENCES, PRESENTATION_PREFERENCES_KEY } from "../../src/motion";
import { deriveRoute, keyForDirection, expectUiRouteState } from "./gameplay-browser";

const output=resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,"jump-camera");
const before=process.env.MAZE_JUMP_PHASE==="before";
const fixtures=CURATED_LEVELS.flatMap(level=>{
 const route=deriveRoute(level,solveLevel(level,{requireAllAnimals:true}).directions);
 return route.flatMap((step,index)=>{
  const jump=step.result.events.find(e=>e.type==="hole-jumped");
  if(!jump)return [];
  const from=getCameraWindow(level,jump.from),to=getCameraWindow(level,jump.to);
  if(from.left===to.left&&from.top===to.top)return [];
  const revealed=new Set(route.slice(0,index+1).flatMap(s=>getVisibleTileKeys(level,s.before.position)));
  const snapshot=createActiveRunSnapshot({level,game:step.before,mode:"normal",runId:`run-jump-camera-${level.id}-${index}`,revealedTiles:revealed});
  if(!snapshot)throw Error('Invalid real-route snapshot');
  return [{level,step,jump,snapshot,index,from,to}];
 });
});
const progress={...createDefaultPlayerProgress(),unlockedLevelCount:16,unlockedLevelIds:CURATED_LEVELS.map(l=>l.id)};
test.beforeAll(async()=>{await mkdir(output,{recursive:true});await writeFile(resolve(output,"fixtures.json"),JSON.stringify({fixtures,progress,preferences:DEFAULT_PRESENTATION_PREFERENCES,keys:{run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY}},null,2));});
async function enter(page:Page,fixture:typeof fixtures[number],quality="full",motion="full"){
 await page.addInitScript(({fixture,progress,preferences,quality,motion,keys})=>{
  localStorage.setItem(keys.run,JSON.stringify(fixture.snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));
  localStorage.setItem(keys.preferences,JSON.stringify({...preferences,quality,motion,muted:true}));
 },{fixture,progress,preferences:DEFAULT_PRESENTATION_PREFERENCES,quality,motion,keys:{run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY}});
 await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();
 await expectUiRouteState(page,fixture.step.before);
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
 await page.waitForTimeout(350);
}
async function startSamples(page:Page){await page.evaluate(()=>{
 const board=document.querySelector<HTMLElement>('.maze-board')!,world=board.querySelector<HTMLElement>('.camera-world')!;
 const sample={rows:[] as any[],running:true};(window as any).jumpProof=sample;
 const tick=(time:number)=>{
  const cols=Number(board.style.getPropertyValue('--grid-size')),w=world.getBoundingClientRect(),b=board.getBoundingClientRect();
  const jump=board.querySelector<HTMLElement>('.jump-presentation'),actor=jump??board.querySelector<HTMLElement>('.player-layer')!;
  const a=actor.getBoundingClientRect(),cell=(b.width-2*board.clientLeft*b.width/board.offsetWidth)/cols;
  const camera={x:-parseFloat(world.style.translate)*parseFloat(world.style.width)/100*cols/100,y:-parseFloat(world.style.translate.split(' ')[1]!)*parseFloat(world.style.height)/100*cols/100};
  sample.rows.push({time,jump:!!jump,camera,actor:{x:(a.x-b.x)/cell,y:(a.y-b.y)/cell},world:{x:w.x,y:w.y},state:board.dataset.travelState});
  if(sample.running)requestAnimationFrame(tick);
 };requestAnimationFrame(tick);
});}
for(const [width,height] of [[780,312],[1280,720]])test(`JUMP camera follows airborne player ${width}x${height}`,async({page})=>{
 const f=fixtures.find(f=>!f.step.result.events.some(e=>e.type==='portal-warped'))!;expect(f).toBeTruthy();
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width,height});await enter(page,f);
 await startSamples(page);await page.keyboard.press(keyForDirection[f.step.direction]);
 await expect(page.locator('.jump-presentation')).toBeVisible();await page.waitForTimeout(160);
 await page.screenshot({path:resolve(output,`airborne-${width}.png`)});
 await expect(page.locator('.jump-presentation')).toHaveCount(0);await page.waitForTimeout(180);
 const rows=await page.evaluate(()=>{const p=(window as any).jumpProof;p.running=false;return p.rows;});
 await writeFile(resolve(output,`camera-${width}.json`),JSON.stringify({before,level:f.level.id,jump:f.jump,from:f.from,to:f.to,rows},null,2));
 await expectUiRouteState(page,f.step.result.state);expect(errors).toEqual([]);
 if(!before){const air=rows.filter((r:any)=>r.jump);expect(air.length).toBeGreaterThan(6);
  const axis=f.from.left!==f.to.left?'x':'y',a=axis==='x'?f.from.left:f.from.top,z=axis==='x'?f.to.left:f.to.top;
  expect(new Set(air.map((r:any)=>r.camera[axis].toFixed(3))).size).toBeGreaterThan(6);
  expect(air.some((r:any)=>r.camera[axis]>Math.min(a,z)+.15&&r.camera[axis]<Math.max(a,z)-.15)).toBe(true);
  const changes=rows.slice(1).map((r:any,i:number)=>Math.abs(r.camera[axis]-rows[i].camera[axis]));expect(Math.max(...changes)).toBeLessThan(.55);
  const end=rows.at(-1);expect(end.camera.x).toBeCloseTo(f.to.left,4);expect(end.camera.y).toBeCloseTo(f.to.top,4);
 }
});
for(const mode of ['lite','reduced','static','resize','blur'])test(`JUMP bounded handoff ${mode}`,async({page})=>{
 test.skip(before,'Baseline diagnostic only');const f=fixtures.find(f=>!f.step.result.events.some(e=>e.type==='portal-warped'))!;
 await page.setViewportSize({width:780,height:312});await enter(page,f,mode==='static'?'static':mode==='lite'?'lite':'full',mode==='reduced'?'reduced':'full');
 await startSamples(page);await page.keyboard.press(keyForDirection[f.step.direction]);await expect(page.locator('.jump-presentation')).toBeVisible();
 if(mode==='resize')await page.setViewportSize({width:844,height:390});
 if(mode==='blur')await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
 await expect(page.locator('.jump-presentation')).toHaveCount(0);await expect(page.locator('.maze-board')).toHaveAttribute('data-travel-state','settled');
 await expectUiRouteState(page,f.step.result.state);
 const rows=await page.evaluate(()=>{const p=(window as any).jumpProof;p.running=false;return p.rows;});
 await writeFile(resolve(output,`${mode}.json`),JSON.stringify(rows,null,2));
 if(mode==='reduced'||mode==='static')for(const r of rows.filter((r:any)=>r.jump)){expect(r.camera.x).toBeCloseTo(f.to.left,4);expect(r.camera.y).toBeCloseTo(f.to.top,4);}
});
