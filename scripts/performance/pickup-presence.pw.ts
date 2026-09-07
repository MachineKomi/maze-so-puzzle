import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {findInputFixture,savedFixture,routeCheckpoints,isOrdinaryMove} from './v22-input-fixtures';
import {isObjectResolved,movePlayer} from '../../src/game/engine';
import {DIRECTIONS} from '../../src/game/types';
import {getCameraWindow,visibleKeysInWindow} from '../../src/game/exploration';
import {expectUiRouteState,keyForDirection} from './gameplay-browser';
import {ACTIVE_RUN_STORAGE_KEY} from '../../src/session';
import {PLAYER_PROGRESS_STORAGE_KEY,createDefaultPlayerProgress} from '../../src/progress';
import {PRESENTATION_PREFERENCES_KEY,DEFAULT_PRESENTATION_PREFERENCES} from '../../src/motion';

const output=resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,'pickup-presence');
const baseline=process.env.MAZE_PRESENCE_BASELINE==='1';
const kinds=['sword','potion','boots','spring-boots','antidote-leaf','key','treasure'] as const;
const fixtures=[...kinds,'key-blue','key-yellow'].map(kind=>{
 const eventType=kind==='treasure'?'treasure-opened':kind.startsWith('key-')?'key-collected':`${kind}-collected`;
 const f=findInputFixture(events=>events.some(e=>e.type===eventType&&(!kind.startsWith('key-')||('color' in e&&e.color===kind.slice(4)))))!;
 if(!f)throw Error(`No authored pickup fixture: ${kind}`);
 const event=f.result.events.find(e=>e.type===eventType)!;
 if(!('objectId' in event))throw Error('Missing object id');
 return{kind,f,id:event.objectId};
});
for(const {kind,f,id} of fixtures)for(const [width,height] of [[844,390],[1280,720]])for(const mode of baseline?['full']:['full','lite','reduced','static']) {
 test(`pickup presence ${kind} ${width} ${mode}`,async({page})=>{
  await mkdir(output,{recursive:true});await page.setViewportSize({width,height});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(({snapshot,progress,preferences,keys})=>{
   localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));localStorage.setItem(keys.preferences,JSON.stringify(preferences));
  },{snapshot:savedFixture(f,'presence26'),progress:createDefaultPlayerProgress(16),preferences:{...DEFAULT_PRESENTATION_PREFERENCES,quality:mode==='lite'?'lite':mode==='static'?'static':'full',motion:mode==='reduced'?'reduced':'full',muted:true},keys:{run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY}});
  await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();
  await expectUiRouteState(page,f.before);
  const pickup=page.locator(`[data-object-id="${id}"]`);await expect(pickup).toBeVisible();
  await pickup.locator('img').evaluate(async(img:HTMLImageElement)=>img.decode());await page.evaluate(()=>document.fonts.ready);
  const samples=[];
  for(const phase of [0,1400,2800]){
   samples.push(await pickup.evaluate((el,phase)=>{
    const animations=el.getAnimations({subtree:true});for(const a of animations){a.pause();a.currentTime=phase;}
    const image=el.querySelector('img')!,style=getComputedStyle(image),backing=getComputedStyle(el,'::before');
    return{phase,animations:animations.length,filter:style.filter,transform:style.transform,opacity:style.opacity,src:(image as HTMLImageElement).currentSrc,art:image.getBoundingClientRect().toJSON(),tile:el.getBoundingClientRect().toJSON(),backing:{content:backing.content,background:backing.backgroundImage,opacity:backing.opacity,filter:backing.filter,animation:backing.animationName,width:backing.width,height:backing.height}};
   },phase));
  }
  if(!baseline){
   expect(samples.every(s=>s.animations===0&&s.opacity==='1'&&s.backing.content==='""'&&s.backing.background.includes('radial-gradient')&&s.backing.filter==='none'&&s.backing.animation==='none')).toBe(true);
   expect(new Set(samples.map(s=>JSON.stringify({...s,phase:0})))).toHaveProperty('size',1);
  }
  await page.screenshot({path:resolve(output,`${kind}-${width}-${mode}.png`)});
  await writeFile(resolve(output,`${kind}-${width}-${mode}.json`),JSON.stringify({level:f.level.id,id,samples},null,2));
  await page.keyboard.press(keyForDirection[f.direction]);await expectUiRouteState(page,f.result.state);await expect(pickup).toHaveCount(0);
  const saved=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).game,ACTIVE_RUN_STORAGE_KEY);
  expect(saved.power).toBe(f.result.state.power);expect(saved.collectedObjectIds).toContain(id);expect(errors).toEqual([]);
 });
}

test('dense authored pickup route keeps presence in folded and Classic views',async({page})=>{
 await mkdir(output,{recursive:true});
 let best: {f:ReturnType<typeof routeCheckpoints>[number];direction:typeof DIRECTIONS[number];count:number;hazards:number}|undefined;
 for(const f of routeCheckpoints())for(const direction of DIRECTIONS){
  let state=f.before,valid=true;
  for(let i=0;i<4;i++){const result=movePlayer(f.level,state,direction);if(!isOrdinaryMove(result)){valid=false;break;}state=result.state;}
  if(!valid)continue;
  const view=getCameraWindow(f.level,f.before.position,6),visible=visibleKeysInWindow(f.level,view);
  const count=f.level.objects.filter(o=>kinds.some(k=>k===o.kind)&&!isObjectResolved(o,f.before)&&visible.has(`${o.at.x},${o.at.y}`)).length;
  const hazards=[...visible].filter(key=>{const[x,y]=key.split(',').map(Number);return ['water','lava','poison'].includes(f.level.terrain[y!]![x!]!);}).length;
  if(hazards&&(!best||count>best.count))best={f,direction,count,hazards};
 }
 expect(best?.count).toBeGreaterThanOrEqual(3);const {f,direction,count,hazards}=best!;
 const snapshot=savedFixture(f,'presence26-dense'),progress=createDefaultPlayerProgress(16),preferences={...DEFAULT_PRESENTATION_PREFERENCES,muted:true};
 const keys={run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY};
 await writeFile(resolve(output,'paired-fixtures.json'),JSON.stringify({progress,preferences,keys,fixtures:[{id:'dense-pickups',snapshot,direction,count:4,visiblePickupCount:count,visibleHazardCells:hazards}]},null,2));
 await page.addInitScript(({snapshot,progress,preferences,keys})=>{localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));localStorage.setItem(keys.preferences,JSON.stringify(preferences));},{snapshot,progress,preferences,keys});
 await page.setViewportSize({width:1194,height:834});await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();await expectUiRouteState(page,f.before);
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
 for(const view of ['expanded','folded','classic']){
  if(view==='folded')await page.getByRole('button',{name:'Fold sidebar'}).click();
  if(view==='classic'){await page.getByRole('button',{name:/^More/}).click();await page.getByRole('button',{name:'Use classic square view'}).click();}
  await page.screenshot({path:resolve(output,`dense-${view}.png`)});
  const held=await page.locator('.player-held-weapon').evaluateAll(images=>images.map(i=>getComputedStyle(i).filter));
  expect(held.every(filter=>!filter.includes('255, 241, 179'))).toBe(true);
 }
 for(let i=0;i<4;i++)await page.keyboard.press(keyForDirection[direction]);
});
