import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { findInputFixture, savedFixture, authoredLootFixture } from './v22-input-fixtures';
import { ACTIVE_RUN_STORAGE_KEY } from '../../src/session';
import { PLAYER_PROGRESS_STORAGE_KEY, createDefaultPlayerProgress } from '../../src/progress';
import { PRESENTATION_PREFERENCES_KEY, DEFAULT_PRESENTATION_PREFERENCES } from '../../src/motion';

const output=resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,'reward-numbers');
test.beforeAll(async()=>{await mkdir(output,{recursive:true});});
for(const [dpr,failedAtlas] of [[1,false],[2,false],[3,false],[3,true]] as const)
test(`cold counts preserve collection and resized backing DPR${dpr} atlasFailure${failedAtlas}`,async({browser})=>{
  const f=authoredLootFixture(findInputFixture(events=>events.some(e=>e.type==='treasure-opened'&&e.currency==='gold'))!);
  const ctx=await browser.newContext({viewport:{width:780,height:312},deviceScaleFactor:dpr});
  try {
    const page=await ctx.newPage(),errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(({snapshot,keys,progress,preferences,failedAtlas})=>{
      localStorage.setItem(keys.run,JSON.stringify(snapshot));localStorage.setItem(keys.progress,JSON.stringify(progress));
      localStorage.setItem(keys.preferences,JSON.stringify({...preferences,muted:true}));
      const counts={stroke:0,fill:0,bounds:0,atlasFailure:0};(window as any).countProbe=counts;
      const get=HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext=function(...args:any[]){
        if(failedAtlas&&this.width===720&&this.height===128){counts.atlasFailure++;return null;}
        return get.apply(this,args as any);
      } as any;
      for(const [method,key] of [['strokeText','stroke'],['fillText','fill']] as const) {
        const original=CanvasRenderingContext2D.prototype[method];
        CanvasRenderingContext2D.prototype[method]=function(...args:any[]){
          if(this.canvas.classList.contains('vfx-rewards'))counts[key]++;
          return original.apply(this,args as any);
        };
      }
      const rect=Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect=function(){if(this.classList.contains('vfx-rewards'))counts.bounds++;return rect.call(this);};
    },{snapshot:savedFixture(f,'cold-count-resize'),keys:{run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY},
      progress:createDefaultPlayerProgress(16),preferences:DEFAULT_PRESENTATION_PREFERENCES,failedAtlas});
    await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await page.getByRole('button',{name:/^Continue/}).click();
    await page.bringToFront();
    await page.evaluate(()=>{
      const c=document.querySelector('canvas.vfx-rewards')!,rows:any[]=[];(window as any).emptyRewardRows=rows;
      const observer=new MutationObserver(records=>rows.push(...records.map(r=>({name:r.attributeName,old:r.oldValue}))));
      observer.observe(c,{attributes:true,attributeOldValue:true,attributeFilter:['width','height','data-running']});
      (window as any).emptyRewardObserver=observer;
    });
    for(const [width,height] of [[1080,810],[780,312]]){await page.setViewportSize({width,height});await page.waitForTimeout(250);}
    const empty=await page.evaluate(()=>{
      (window as any).emptyRewardObserver.disconnect();const c=document.querySelector<HTMLCanvasElement>('canvas.vfx-rewards')!;
      return{width:c.width,height:c.height,running:c.dataset.running,rows:(window as any).emptyRewardRows};
    });
    expect(empty.width).toBe(1);expect(empty.height).toBe(1);expect(empty.running).toBe('false');
    expect(empty.rows.every((r:any)=>r.name==='data-running'?r.old!=='true':r.old===null||r.old==='1')).toBe(true);
    await page.keyboard.press(`Arrow${f.direction[0]!.toUpperCase()}${f.direction.slice(1)}`);await page.waitForTimeout(1800);
    const counts=await page.evaluate(()=>(window as any).countProbe);
    expect(counts.bounds).toBe(0);expect(counts.stroke>0).toBe(failedAtlas);expect(counts.fill>0).toBe(failedAtlas);
    expect(counts.atlasFailure>0).toBe(failedAtlas);
    const read=()=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).game,ACTIVE_RUN_STORAGE_KEY);
    const settled=await read();expect(settled.loot.sources.flatMap((s:any)=>s.drops).length).toBeGreaterThan(0);
    const rows=[];
    for(const [width,height] of [[780,312],[1080,810],[844,390]]) {
      await page.setViewportSize({width,height});await page.waitForTimeout(450);
      const backing=await page.locator('canvas.vfx-rewards').evaluate((c:HTMLCanvasElement)=>{
        const rect=c.getBoundingClientRect(),w=c.clientWidth,h=c.clientHeight;
        const oldScale=Math.max(.1,Math.min(devicePixelRatio*rect.width/w,1.5,1536/w,1536/h));
        return{w:c.width,h:c.height,expected:[Math.floor(w*oldScale),Math.floor(h*oldScale)],running:c.dataset.running};
      });
      expect(Math.abs(backing.w-backing.expected[0]!),JSON.stringify({width,height,backing})).toBeLessThanOrEqual(1);
      expect(Math.abs(backing.h-backing.expected[1]!),JSON.stringify({width,height,backing})).toBeLessThanOrEqual(1);
      expect(backing.running).toBe('false');expect(await read()).toEqual(settled);rows.push({width,height,backing});
      if(dpr===3)await page.screenshot({path:resolve(output,`count-${width}-fallback${failedAtlas}.png`)});
    }
    expect(errors).toEqual([]);await writeFile(resolve(output,`resize-dpr${dpr}-fallback${failedAtlas}.json`),JSON.stringify({counts,empty,settled,rows,errors},null,2));
  } finally {await ctx.close();}
});

test('count atlas digit bounds, composed values and original fallback remain visible',async({page})=>{
  await page.goto('http://127.0.0.1:1421/');
  const result=await page.evaluate(async()=>{
    const {rewardNumbers,drawRewardNumber}=await import('/src/vfx/rewardNumbers.ts');
    const atlas=rewardNumbers()!,context=atlas.canvas.getContext('2d')!;
    const bounds=Array.from({length:10},(_,digit)=>{
      const pixels=context.getImageData(digit*72,0,72,128).data,points=[];
      for(let y=0;y<128;y++)for(let x=0;x<72;x++)if(pixels[(y*72+x)*4+3]>0)points.push({x,y});
      return{digit,minX:Math.min(...points.map(p=>p.x)),maxX:Math.max(...points.map(p=>p.x)),minY:Math.min(...points.map(p=>p.y)),maxY:Math.max(...points.map(p=>p.y))};
    });
    document.getElementById('root')!.style.display='none';
    const rack=document.createElement('canvas');rack.width=900;rack.height=490;rack.style.background='#b8c79d';document.body.append(rack);
    const c=rack.getContext('2d')!;c.font='16px sans-serif';c.fillStyle='#201834';
    c.fillText('Cached counts / original fallback: 11px, 26px, 66px; each pair shares its baseline',12,25);
    [11,26,66].forEach((font,row)=>[2,10,99,123,456,789].forEach((value,column)=>{
      const x=column*145+74,baseline=75+row*155;
      drawRewardNumber(c,atlas,value,x,baseline,font);drawRewardNumber(c,null,value,x,baseline+65,font);
    }));
    const invalid=document.createElement('canvas');invalid.width=invalid.height=128;
    const guard=invalid.getContext('2d')!;
    for(const value of [0,-1,1.5,Infinity,NaN,Number.MAX_SAFE_INTEGER+1])drawRewardNumber(guard,atlas,value,40,40,20);
    drawRewardNumber(guard,atlas,2,Infinity,40,20);drawRewardNumber(guard,atlas,2,40,40,0);
    return{bounds,shared:rewardNumbers()===atlas,invalidNoDraw:guard.getImageData(0,0,128,128).data.every(v=>v===0),bytes:720*128*4};
  });
  expect(result.shared).toBe(true);expect(result.invalidNoDraw).toBe(true);
  for(const bound of result.bounds){expect(bound.minX).toBeGreaterThan(0);expect(bound.maxX).toBeLessThan(71);expect(bound.minY).toBeGreaterThan(0);expect(bound.maxY).toBeLessThan(127);}
  await page.locator('canvas').screenshot({path:resolve(output,'numeral-comparison.png')});
  await writeFile(resolve(output,'atlas.json'),JSON.stringify(result,null,2));
});
