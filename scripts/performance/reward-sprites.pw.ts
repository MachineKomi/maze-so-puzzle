import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {findInputFixture,savedFixture} from './v22-input-fixtures';
import {ACTIVE_RUN_STORAGE_KEY} from '../../src/session';
import {PLAYER_PROGRESS_STORAGE_KEY,createDefaultPlayerProgress} from '../../src/progress';
import {PRESENTATION_PREFERENCES_KEY,DEFAULT_PRESENTATION_PREFERENCES} from '../../src/motion';

const output=resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,'enlarged-rewards');
// Physical Gold/Science now have their own real collection suite. These retain
// immediate-rule Power semantics, including typed per-bash combat presentation.
const kinds=['potion','combat'] as const;
const fixtures=kinds.map(id=>({id,fixture:findInputFixture(events=>events.some(e=>id==='potion'?e.type==='potion-collected':e.type==='enemy-defeated'&&e.enemyPower>=7))!}));
test.beforeAll(async()=>{await mkdir(output,{recursive:true});});
for(const [quality,motion,width,height] of [['full','full',1194,834],['lite','full',780,312],['static','full',780,312],['full','reduced',780,312]] as const) test(`WALL04C enlarged rewards preserve real credit and cleanup ${quality}/${motion}`,async({browser})=>{
 const rows=[];
 for(const {id,fixture:f} of fixtures){
  expect(f).toBeTruthy();const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:2});
  try{
   const page=await ctx.newPage(),errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(({snapshot,quality,motion,keys,progress,preferences,diagnostic})=>{
    if(diagnostic){(window as any).rewardWidthProbe=[];(window as any).rewardTargets=[];const clear=CanvasRenderingContext2D.prototype.clearRect;CanvasRenderingContext2D.prototype.clearRect=function(...args:any[]){if(this.canvas.classList.contains('vfx-rewards')&&(window as any).rewardTargets.length<12){const a=document.querySelector('[data-reward-anchor=ame]')!.getBoundingClientRect(),b=this.canvas.getBoundingClientRect(),svg=document.querySelector<SVGSVGElement>('.maze-terrain-svg')!,box=svg.viewBox.baseVal,t=document.querySelector<HTMLElement>('.camera-world')!.style.translate.split(' ').map(parseFloat);(window as any).rewardTargets.push({ms:performance.now(),target:[box.x-(t[0]||0)*box.width/100+(a.left+a.width*.5-b.left)/b.width*6,box.y-(t[1]||0)*box.height/100+(a.top+a.height*.5-b.top)/b.height*6],a:a.toJSON(),b:b.toJSON()});}return clear.apply(this,args as any);};const descriptor=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,"width")!;Object.defineProperty(HTMLCanvasElement.prototype,"width",{...descriptor,set(value){if(this.classList.contains("vfx-rewards"))(window as any).rewardWidthProbe.push({ms:performance.now(),value,stack:new Error().stack,anchors:document.querySelectorAll("[data-reward-anchor=ame]").length});descriptor.set!.call(this,value);}});}
    localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));
    localStorage.setItem(keys.preferences,JSON.stringify({...preferences,quality,motion,muted:true}));
   },{snapshot:savedFixture(f,`large-reward-${id}`),quality,motion,keys:{run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY},progress:createDefaultPlayerProgress(16),preferences:DEFAULT_PRESENTATION_PREFERENCES,diagnostic:process.env.MAZE_REWARD_DIAGNOSTIC==="1"});
   await page.goto(process.env.MAZE_REWARD_DIAGNOSTIC==='1'?'http://127.0.0.1:1421/':'/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});await page.bringToFront();
   await page.evaluate(()=>{
    const samples:unknown[]=[],start=performance.now();(window as any).rewardSamples=samples;
    const sample=()=>{const c=document.querySelector<HTMLCanvasElement>('.vfx-rewards')!;
     samples.push({ms:performance.now(),w:c.width,h:c.height,tokens:Number(c.dataset.tokens)||0,anchors:document.querySelectorAll('[data-reward-anchor="ame"]').length});
     if(performance.now()-start<4000)requestAnimationFrame(sample);};requestAnimationFrame(sample);
   });
   await page.keyboard.press(`Arrow${f.direction[0]!.toUpperCase()}${f.direction.slice(1)}`);await page.waitForTimeout(4200);
   const result=await page.evaluate(key=>({samples:(window as any).rewardSamples as {w:number;h:number;tokens:number;anchors:number}[],
    widthProbe:(window as any).rewardWidthProbe,targets:(window as any).rewardTargets, data:{...document.querySelector<HTMLCanvasElement>('.vfx-rewards')!.dataset},save:JSON.parse(localStorage.getItem(key)!).game,
    broken:[...document.images].filter(i=>!i.naturalWidth).length}),ACTIVE_RUN_STORAGE_KEY);
   await writeFile(resolve(output,`probe-${quality}-${motion}-${id}.json`),JSON.stringify(result,null,2));
   const moving=quality!=='static'&&motion!=='reduced';
   expect(errors).toEqual([]);expect(result.broken).toBe(0);const {loot:expectedLoot,goldStarsCollected:_,sciencePointsCollected:__,...expected}=f.result.state;
   const {loot,goldStarsCollected,sciencePointsCollected,...actual}=result.save;
   expect(actual).toEqual(expected);
   expect(goldStarsCollected+sciencePointsCollected+loot.sources.flatMap((s:any)=>s.drops).reduce((n:number,d:any)=>n+d.amount,0))
     .toBe(expectedLoot.sources.reduce((n,s)=>n+s.amount,0));
   expect(result.samples.at(-1)).toMatchObject({anchors:1});expect(result.data.running).toBe("false");
   expect(result.samples.every(s=>s.w<=1536&&s.h<=1536&&s.tokens<=(quality==='lite'?12:24)&&s.anchors===1)).toBe(true);
   if(moving || id==="combat")expect(result.samples.some(s=>s.tokens>0)).toBe(true);
   if(moving)expect(Number(result.data.arrivals) - (goldStarsCollected-f.before.goldStarsCollected) - (sciencePointsCollected-f.before.sciencePointsCollected)).toBe(id==="potion"?2:12);
   rows.push({id,errors,...result});
  }finally{await ctx.close();}
 }
 await writeFile(resolve(output,`${quality}-${motion}.json`),JSON.stringify(rows,null,2));
});

test('WALL04C dense24 reward cap and cancellation',async({page})=>{
 await page.goto('http://127.0.0.1:1421/');await page.bringToFront();
 const result=await page.evaluate(async()=>{
  // Explicit development harness; no runtime debug port or authored reward mutation.
  const {mountRewardHarness}=await import('/scripts/art_review/reward-lifecycle-harness.tsx');
  const root=document.getElementById('root')!;root.style.display='none';const host=document.createElement('div');document.body.append(host);
  const h=mountRewardHarness(host);h.emitDense();await new Promise(r=>setTimeout(r,180));
  const c=host.querySelector('canvas')!,peak=Number(c.dataset.peak),tokens=Number(c.dataset.tokens),size=[c.width,c.height];
  h.cancel();const cleaned=[c.width,c.height,c.dataset.running];h.unmount();host.remove();root.style.display='';
  return {peak,tokens,size,cleaned};
 });
 expect(result.peak).toBe(24);expect(result.tokens).toBe(24);expect(result.size.every(n=>n>1&&n<=1536)).toBe(true);expect(result.cleaned).toEqual([1,1,'false']);
 await writeFile(resolve(output,'dense.json'),JSON.stringify(result,null,2));
});
