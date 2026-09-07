import {test,expect,type Page} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {findInputFixture,savedFixture} from './v22-input-fixtures';
import {ACTIVE_RUN_STORAGE_KEY} from '../../src/session';
import {PLAYER_PROGRESS_STORAGE_KEY,createDefaultPlayerProgress} from '../../src/progress';
import {PRESENTATION_PREFERENCES_KEY,DEFAULT_PRESENTATION_PREFERENCES} from '../../src/motion';
import {keyForDirection,expectUiRouteState} from './gameplay-browser';

const output=resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,'scene-depth');
const door=findInputFixture(events=>events.some(e=>e.type==='door-opened'))!;
const weapon=findInputFixture(events=>events.some(e=>e.type==='sword-collected'))!;
test.beforeAll(async()=>{await mkdir(output,{recursive:true});});
async function enter(page:Page,f:typeof door,quality:string){
 await page.addInitScript(({snapshot,progress,preferences,keys})=>{
  localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));localStorage.setItem(keys.preferences,JSON.stringify(preferences));
 },{snapshot:savedFixture(f,'scene23'),progress:createDefaultPlayerProgress(16),preferences:{...DEFAULT_PRESENTATION_PREFERENCES,quality,muted:true},keys:{run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY}});
 await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
 await expectUiRouteState(page,f.before);
}
for(const [width,height,quality] of [[780,312,'full'],[1080,810,'full'],[780,312,'lite']] as const)test(`SCENE23 door depth and Power readability ${width}/${quality}`,async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width,height});
 await page.clock.install({time:new Date('2026-09-07T00:00:00Z')});await enter(page,door,quality);await page.clock.pauseAt(new Date('2026-09-07T01:00:00Z'));
 const before=await page.evaluate(()=>{
  const board=document.querySelector('.maze-board')!.getBoundingClientRect(),label=document.querySelector('.player-label-layer')!,badge=label.querySelector('.player-power')!,b=badge.getBoundingClientRect();
  const frame=document.querySelector<HTMLImageElement>('img[data-field-layout="door"]')!,tile=frame.parentElement!.getBoundingClientRect(),r=frame.getBoundingClientRect(),bounds=frame.dataset.artVisibleBounds!.split(',').map(Number);
  const actors=document.querySelector('.camera-actors')!,solids=[...actors.querySelectorAll<HTMLElement>('.object-layer,.player-layer,[data-follower-id]')];
  return{door:{width:r.width*bounds[2]!/tile.width,height:r.height*bounds[3]!/tile.height},font:parseFloat(getComputedStyle(badge).fontSize),labelZ:Number(getComputedStyle(label).zIndex),wallZ:Number(getComputedStyle(document.querySelector('.maze-foreground')!).zIndex),inside:b.top>=board.top&&b.bottom<=board.bottom,
   actorsZ:Number(getComputedStyle(actors).zIndex),solids:solids.map(s=>({y:s.getBoundingClientRect().top,z:Number(getComputedStyle(s).zIndex)}))};
 });
 expect(before.door.height).toBeGreaterThan(1.24);expect(before.door.width).toBeLessThan(1.13);expect(before.font).toBeGreaterThanOrEqual(14);expect(before.inside).toBe(true);
 expect(before.labelZ).toBeGreaterThan(before.wallZ);expect(before.actorsZ).toBeLessThan(before.wallZ);
 for(const a of before.solids)for(const b of before.solids)if(a.y>b.y+2)expect(a.z).toBeGreaterThan(b.z);
 await page.locator('.maze-board').screenshot({path:resolve(output,`door-${width}-${quality}-before.png`)});
 await page.keyboard.press(keyForDirection[door.direction]);await page.clock.runFor(120);
 await expect(page.locator('.door-opening-presentation')).toHaveCount(1);
 const opening=await page.evaluate(()=>({door:Number(getComputedStyle(document.querySelector('.door-opening-presentation')!).zIndex),ame:Number(getComputedStyle(document.querySelector('.player-layer')!).zIndex),same:document.querySelector('.door-opening-presentation')!.parentElement===document.querySelector('.player-layer')!.parentElement}));
 expect(opening.same).toBe(true);expect(opening.door).toBeLessThan(opening.ame);
 await page.locator('.maze-board').screenshot({path:resolve(output,`door-${width}-${quality}-opening.png`)});
 await page.clock.runFor(2200);await expectUiRouteState(page,door.result.state);expect(errors).toEqual([]);
 await writeFile(resolve(output,`door-${width}-${quality}.json`),JSON.stringify({scope:'Real authored route, controlled clock visual/geometry contract; not frame timing',before,opening,errors},null,2));
});
test('SCENE23 weapon pickup and held canvas use identical scale',async({page})=>{
 await page.setViewportSize({width:1080,height:810});await enter(page,weapon,'static');
 const pickup=await page.locator('.object-kind-sword img').first().evaluate(i=>({id:i.getAttribute('data-art-id'),width:parseFloat(getComputedStyle(i).width)}));
 await page.locator('.maze-board').screenshot({path:resolve(output,'weapon-before.png')});
 await page.keyboard.press(keyForDirection[weapon.direction]);await expectUiRouteState(page,weapon.result.state);
 const held=await page.locator('.player-held-weapon').evaluate(i=>({id:i.getAttribute('data-art-id'),width:parseFloat(getComputedStyle(i).width)}));
 expect(held.id).toBe(pickup.id);expect(held.width).toBeCloseTo(pickup.width,1);
 await page.locator('.maze-board').screenshot({path:resolve(output,'weapon-held.png')});
 await writeFile(resolve(output,'weapon.json'),JSON.stringify({pickup,held},null,2));
});
