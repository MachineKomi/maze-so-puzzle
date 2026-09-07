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
  const snapshot=createActiveRunSnapshot({level,game:step.before,mode:"normal",runId:step.before.loot.runId,revealedTiles:revealed});
  if(!snapshot)throw Error('Invalid real-route snapshot');
  const prior=route[index-1];
  const approachSnapshot=prior?createActiveRunSnapshot({level,game:prior.before,mode:'normal',runId:prior.before.loot.runId,revealedTiles:revealed}):null;
  return [{level,step,jump,snapshot,index,from,to,prior,approachSnapshot}];
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
 const size=await page.locator('.maze-board').evaluate(b=>({width:Number((b as HTMLElement).style.getPropertyValue('--grid-size')),height:Number((b as HTMLElement).style.getPropertyValue('--grid-rows'))||Number((b as HTMLElement).style.getPropertyValue('--grid-size'))}));
 fixture.from=getCameraWindow(fixture.level,fixture.jump.from,size);fixture.to=getCameraWindow(fixture.level,fixture.jump.to,size);
}
async function startSamples(page:Page){await page.evaluate(()=>{
 const board=document.querySelector<HTMLElement>('.maze-board')!,world=board.querySelector<HTMLElement>('.camera-world')!;
 const sample={rows:[] as any[],running:true};(window as any).jumpProof=sample;
 const tick=(time:number)=>{
  const cols=Number(board.style.getPropertyValue('--grid-size')),w=world.getBoundingClientRect(),b=board.getBoundingClientRect();
  const jump=board.querySelector<HTMLElement>('.jump-presentation'),actor=jump??board.querySelector<HTMLElement>('.player-layer')!;
  const a=actor.getBoundingClientRect(),cell=(b.width-2*board.clientLeft*b.width/board.offsetWidth)/cols;
  const pane=board.querySelector<SVGSVGElement>(".maze-terrain-svg")!.viewBox.baseVal;
  const camera={x:pane.x-parseFloat(world.style.translate)*pane.width/100,y:pane.y-parseFloat(world.style.translate.split(' ')[1]!)*pane.height/100};
  const foreground=board.querySelector<SVGSVGElement>(".maze-foreground");
  sample.rows.push({actorZ:Number(getComputedStyle(actor.closest('.camera-actors')??actor).zIndex),foregroundZ:foreground?Number(getComputedStyle(foreground).zIndex):null,foregroundDelta:foreground?Math.max(Math.abs(foreground.getBoundingClientRect().x-w.x),Math.abs(foreground.getBoundingClientRect().y-w.y)):null,time,jump:!!jump,camera,actor:{x:(a.x-b.x)/cell,y:(a.y-b.y)/cell},world:{x:w.x,y:w.y},state:board.dataset.travelState});
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
 for(const r of rows) if(r.jump)expect(r.actorZ).toBeGreaterThan(r.foregroundZ);else expect(r.actorZ).toBeLessThan(r.foregroundZ);
 for(const r of rows) expect(r.foregroundDelta).toBeLessThan(.5);
 if(!before){const air=rows.filter((r:any)=>r.jump);expect(air.length).toBeGreaterThan(6);
  const axis=f.from.left!==f.to.left?'x':'y',a=axis==='x'?f.from.left:f.from.top,z=axis==='x'?f.to.left:f.to.top;
  expect(new Set(air.map((r:any)=>r.camera[axis].toFixed(3))).size).toBeGreaterThan(6);
  expect(air.some((r:any)=>r.camera[axis]>Math.min(a,z)+.15&&r.camera[axis]<Math.max(a,z)-.15)).toBe(true);
  const changes=rows.slice(1).map((r:any,i:number)=>Math.abs(r.camera[axis]-rows[i].camera[axis]));expect(Math.max(...changes)).toBeLessThan(.55);
  const end=rows.at(-1);expect(end.camera.x).toBeCloseTo(f.to.left,4);expect(end.camera.y).toBeCloseTo(f.to.top,4);
 }
});
for(const mode of ['lite','reduced','static','resize','blur'])test(`JUMP bounded handoff ${mode}`,async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
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
 for(const r of rows) expect(r.foregroundDelta).toBeLessThan(.5);
 expect(errors).toEqual([]);
});

for(const width of [780,1280])test(`FIELD21 horizontal jump depth at departure apex landing ${width}`,async({page})=>{
 const f=fixtures.find(f=>f.step.direction==='right'&&f.step.result.events.every(e=>['moved','hole-jumped'].includes(e.type)))!;
 expect(f).toBeTruthy();await page.setViewportSize({width,height:width===780?312:720});
 await page.clock.install({time:new Date('2026-09-07T00:00:00Z')});await enter(page,f);
 await page.clock.pauseAt(new Date('2026-09-07T01:00:00Z'));
 await page.keyboard.press(keyForDirection[f.step.direction]);const rows=[];let prior=0;
 for(const [name,time]of [['departure',16],['apex',192],['landing',416]] as const){
  await page.clock.runFor(time-prior);prior=time;
  const row=await page.evaluate(()=>{
   const actor=document.querySelector<HTMLElement>('.jump-presentation')!,ground=document.querySelector<HTMLElement>('.jump-ground')!,wall=document.querySelector('.maze-foreground')!;
   const label=document.querySelector<HTMLElement>('.player-label-layer')!,l=label.getBoundingClientRect(),a=actor.getBoundingClientRect();
   return{actorZ:Number(getComputedStyle(actor).zIndex),groundZ:Number(getComputedStyle(ground).zIndex),wallZ:Number(getComputedStyle(wall).zIndex),
    labelZ:Number(getComputedStyle(label).zIndex),labelDelta:Math.hypot(l.x-a.x,l.y-a.y),labelClocks:label.getAnimations({subtree:true}).map(a=>a.currentTime),boots:actor.querySelectorAll('.jump-presentation-boots').length,
    actorTranslate:actor.style.translate,groundTranslate:ground.style.translate,
    clocks:[...actor.getAnimations({subtree:true}),...ground.getAnimations({subtree:true})].map(a=>a.currentTime)};
  });
  expect(row.actorZ).toBeGreaterThan(row.wallZ);expect(row.groundZ).toBeLessThan(row.wallZ);
  expect(row.labelZ).toBeGreaterThan(row.actorZ);expect(row.labelDelta).toBeLessThan(.5);expect(row.boots).toBe(0);
  expect(row.labelClocks).toHaveLength(1);expect(row.labelClocks[0]).toBe(row.clocks[0]);
  expect(row.actorTranslate).toBe(row.groundTranslate);expect(row.clocks).toHaveLength(3);
  expect(new Set(row.clocks).size).toBe(1);rows.push({name,time,...row});
  await page.locator('.maze-board').screenshot({path:resolve(output,`depth-${width}-${name}.png`)});
 }
 await page.clock.runFor(160);await expect(page.locator('.jump-presentation,.jump-ground')).toHaveCount(0);
 await expectUiRouteState(page,f.step.result.state);
 await writeFile(resolve(output,`depth-${width}.json`),JSON.stringify({scope:'Real input and engine checkpoint; controlled clock visual proof, not timing',level:f.level.id,rows},null,2));
});

for(const scenario of ['delayed','quality','geometry','portal'])test(`JUMP isolated shared-clock boundary ${scenario}`,async({page})=>{
 test.skip(before,'Candidate hook integration');const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:1421/scripts/art_review/jump-clock.html');
 await page.waitForFunction(()=>Boolean((window as any).jumpHarness));
 await page.evaluate(s=>(window as any).jumpHarness.start(s==='portal',s==='delayed'?120:0),scenario);
 if(scenario==='quality')await page.evaluate(()=>{const h=(window as any).jumpHarness;h.quality('static');h.quality('full');});
 if(scenario==='geometry')await page.evaluate(()=>(window as any).jumpHarness.resize());
 await page.waitForTimeout(55);
 const middle=await page.evaluate(()=>({scene:(window as any).jumpHarness.scene(),animations:[...document.querySelectorAll('.jump-presentation,.jump-ground')].flatMap(e=>e.getAnimations({subtree:true})).map(a=>({state:a.playState,time:a.currentTime}))}));
 await writeFile(resolve(output,`clock-${scenario}.json`),JSON.stringify(middle,null,2));
 expect(middle.animations).toHaveLength(3);for(const a of middle.animations!){expect(a.state).toBe('paused');expect(a.time).toBe(middle.animations![0]!.time);}
 if(scenario==='quality'||scenario==='geometry'){expect(middle.scene.position).toEqual({x:7,y:3});expect(middle.animations![0]!.time).toBe(460);}
 else {expect(middle.scene.position.x).toBeGreaterThan(5);expect(middle.scene.position.x).toBeLessThan(7);expect(middle.scene.camera.top).toBe(1);}
 await expect(page.locator('.jump-presentation')).toHaveCount(0);
 const end=await page.evaluate(()=>(window as any).jumpHarness.scene());
 expect(end.position).toEqual(scenario==='portal'?{x:10,y:9}:{x:7,y:3});
 expect(errors).toEqual([]);
});

test('JUMP rapid ordinary approach and live Sound quality toggle',async({page})=>{
 test.skip(before,'Candidate continuity');const f=fixtures.find(f=>f.approachSnapshot&&f.prior?.result.events.every(e=>e.type==='moved'))!;
 expect(f).toBeTruthy();const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setViewportSize({width:780,height:312});await enter(page,{...f,snapshot:f.approachSnapshot!,step:f.prior!});
 await startSamples(page);await page.keyboard.press(keyForDirection[f.prior!.direction]);await page.waitForTimeout(70);await page.keyboard.press(keyForDirection[f.step.direction]);
 await expect(page.locator('.jump-presentation')).toBeVisible();
 if(!await page.locator('[data-focus-id="sound"]:visible').count()) await page.locator('[data-focus-id="more"]:visible').click();
 await page.locator('[data-focus-id="sound"]:visible').click();await page.locator('input[name="quality"][value="static"]').check();await page.locator('input[name="quality"][value="full"]').check();
 const animations=await page.locator('.jump-presentation,.jump-ground').evaluateAll(nodes=>nodes.flatMap(e=>e.getAnimations({subtree:true})).map(a=>({state:a.playState,time:a.currentTime})));
 await writeFile(resolve(output,'rapid-sound-animation-handles.json'),JSON.stringify(animations,null,2));
 expect(animations).toHaveLength(3);for(const a of animations){expect(a.state).toBe('paused');expect(a.time).toBe(460);}
 await page.keyboard.press('Escape');await expect(page.locator('.jump-presentation')).toHaveCount(0);await expectUiRouteState(page,f.step.result.state);
 const rows=await page.evaluate(()=>{const p=(window as any).jumpProof;p.running=false;return p.rows;});
 await writeFile(resolve(output,'rapid-and-sound.json'),JSON.stringify({rows,animations},null,2));expect(errors).toEqual([]);
});
