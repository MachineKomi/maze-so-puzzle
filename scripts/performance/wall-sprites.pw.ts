import { test,expect } from '@playwright/test';
import { mkdir,writeFile } from 'node:fs/promises';
import {resolve} from 'node:path';
const output=resolve(process.env.MAZE_PERF_EVIDENCE_DIR!,'wall-sprite-rack');
test.beforeAll(async()=>{await mkdir(output,{recursive:true});});
for(const query of ['all&theme=8','all&theme=0','light=bottom-left&theme=9','light=top-right&theme=15','art&start=0','art&start=16','art&weapons','art&enemies','art&items','art&cage=0','art&cage=1','art&cage=2','art&cage=3']) test(`WALL04C artwork rack ${query}`,async({browser})=>{
 const context=await browser.newContext({viewport:{width:1050,height:900},deviceScaleFactor:2});
 try{
  const page=await context.newPage(),errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:1421/scripts/art_review/wall-sprite-lab.html?${query}`);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
  await page.waitForTimeout(400);
  const result=await page.evaluate(()=>({images:[...document.images].map(i=>({id:i.dataset.artId,field:i.dataset.fieldLayout,src:i.currentSrc,natural:i.naturalWidth,
   canvas:i.getBoundingClientRect().width,physical:i.getBoundingClientRect().width*devicePixelRatio,sufficient:i.dataset.artResolutionSufficient,
   alpha:i.dataset.artVisibleBounds,broken:!i.naturalWidth})),foreground:document.querySelectorAll('.maze-foreground').length}));
  const name=query.replaceAll(/[&=]/g,'-');
  await writeFile(resolve(output,`${name}.json`),JSON.stringify({errors,...result},null,2));
  await page.screenshot({path:resolve(output,`${name}.png`),fullPage:true});
  expect(errors).toEqual([]); expect(result.images.every(i=>!i.broken)).toBe(true);
  for(const i of result.images.filter(i=>i.field)) {
   const bounds=i.alpha!.split(',').map(Number);expect(i.canvas*bounds[2]!).toBeGreaterThan(35);
   expect(i.canvas*bounds[2]!).toBeLessThanOrEqual(91);
   expect(i.canvas*bounds[3]!).toBeLessThanOrEqual(i.field==='item'?91:136);
   if(i.physical>i.natural+2) {
    // These existing delivered items have no approved larger rendition. Keep
    // the explicit measured exception visible; don't invent or soften proof.
    expect(['power-potion','gold-bag','gold-chest','science-gears','science-beaker']).toContain(i.id);
    expect(i.sufficient).toBe('false'); expect(i.physical/i.natural).toBeLessThan(1.35);
   }
  }
 }finally{await context.close();}
});

for(const query of ['compare&start=0','compare&start=16','compare&enemies','compare&items','compare&weapons'])test(`FIELD21 corridor proportions ${query}`,async({page})=>{
 await page.setViewportSize({width:1050,height:900});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:1421/scripts/art_review/wall-sprite-lab.html?${query}`);
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
 const rows=await page.locator('img[data-field-layout]').evaluateAll(images=>images.map(i=>{
  const image=i as HTMLImageElement,r=image.getBoundingClientRect(),tile=image.parentElement!.getBoundingClientRect();
  const [x,y,w,h]=image.dataset.artVisibleBounds!.split(',').map(Number);
  return{id:image.dataset.artId,role:image.dataset.fieldLayout,width:r.width*w!/tile.width,height:r.height*h!/tile.height,
    left:(r.x+r.width*x!-tile.x)/tile.width,top:(r.y+r.height*y!-tile.y)/tile.height,loaded:!!image.naturalWidth};
 }));
 for(const r of rows){expect(r.loaded).toBe(true);expect(r.left).toBeGreaterThanOrEqual(.048);expect(r.width).toBeLessThanOrEqual(.902);expect(r.height).toBeLessThanOrEqual(r.role==='item'?.902:1.352);}
 expect(errors).toEqual([]);const name=query.replaceAll(/[&=]/g,'-');
 await writeFile(resolve(output,`${name}.json`),JSON.stringify({errors,rows},null,2));
 await page.screenshot({path:resolve(output,`${name}.png`),fullPage:true});
});

for(const dpr of [1,2,3])test(`FIELD21 four perimeter edges eight lights DPR${dpr}`,async({browser})=>{
 const context=await browser.newContext({viewport:{width:1050,height:900},deviceScaleFactor:dpr});
 try{
  const page=await context.newPage();await page.goto('http://127.0.0.1:1421/scripts/art_review/wall-sprite-lab.html?all&theme=8');
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
  const rows=await page.locator('.terrain-tall-walls').evaluateAll(volumes=>volumes.map(volume=>{
   const cap=volume.querySelector<SVGPathElement>('path[transform]')!,inverse=cap.transform.baseVal.consolidate()!.matrix.inverse(),gaps=[];
   for(let at=.005;at<6;at+=.025)for(const p of [[.005,at],[5.995,at],[at,.005],[at,5.995]])
    if(!cap.isPointInFill(new DOMPoint(p[0],p[1]).matrixTransform(inverse)))gaps.push(p);
   return{light:volume.closest('section')!.querySelector('h2')!.textContent,gaps};
  }));
  expect(rows).toHaveLength(8);for(const row of rows)expect(row.gaps,row.light!).toEqual([]);
  await page.locator('.maze-board').first().screenshot({path:resolve(output,`perimeter-dpr${dpr}.png`)});
  await writeFile(resolve(output,`perimeter-dpr${dpr}.json`),JSON.stringify({scope:'Native SVG projected cap membership plus raster capture; unit proof separately checks continuous forbidden-area coverage',dpr,rows},null,2));
 }finally{await context.close();}
});
