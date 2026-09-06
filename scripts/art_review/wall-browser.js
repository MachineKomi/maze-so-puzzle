async page => {
  const path='C:/maze-game/output/playwright/walls04-rack/';
  const data=await (await page.request.get('http://127.0.0.1:4194/output/playwright/walls04-rack/fixtures.json')).json();
  const browser=page.context().browser();
  const rows=[];
  for(const dpr of [1,2]) for(const quality of ['full','lite','static']) for(const motion of ['full','reduced']) for(const fixture of data.fixtures) {
    const ctx=await browser.newContext({viewport:{width:1193,height:833},deviceScaleFactor:dpr});
    const p=await ctx.newPage(); p.setDefaultTimeout(15000); const errors=[];
    p.on('pageerror',e=>errors.push(String(e)));
    await p.addInitScript(({data,fixture,quality,motion})=>{
      localStorage.setItem(data.keys.run,JSON.stringify(fixture.snapshot));
      localStorage.setItem(data.keys.progress,JSON.stringify(data.progress));
      localStorage.setItem(data.keys.preferences,JSON.stringify({...data.preferences,quality,motion}));
    },{data,fixture,quality,motion});
    await p.goto('http://127.0.0.1:4195/');
    await p.getByRole('button',{name:'Play',exact:true}).click();
    await p.getByRole('button',{name:/^Continue/}).click();
    await p.locator('.maze-terrain-svg').waitFor();
    await p.bringToFront();
    await p.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));
    const before=await p.evaluate(()=>({step:document.querySelector('.step-pill')?.getAttribute('aria-label'),world:getComputedStyle(document.querySelector('.camera-world')).translate}));
    await p.evaluate(()=>{
      window.wallProbe={mutations:0,frames:[],samples:[]};
      window.wallObserver=new MutationObserver(m=>window.wallProbe.mutations+=m.length);
      window.wallObserver.observe(document.querySelector('.maze-terrain-svg'),{subtree:true,attributes:true,childList:true});
      let start;
      const sample=t=>{start??=t; const board=document.querySelector('.maze-board'),v=getComputedStyle(board,'::after');
        window.wallProbe.frames.push(t);window.wallProbe.samples.push({width:board.clientWidth,pseudo:parseFloat(v.width),content:v.content,animation:v.animationName,transform:v.transform,world:getComputedStyle(document.querySelector('.camera-world')).translate});
        if(t-start<1100)requestAnimationFrame(sample);
      }; requestAnimationFrame(sample);
    });
    const key='Arrow'+fixture.direction[0].toUpperCase()+fixture.direction.slice(1);
    await p.keyboard.down(key);
    await p.waitForTimeout(430);
    await p.keyboard.up(key);
    await p.waitForTimeout(850);
    const after=await p.evaluate(()=>{window.wallObserver.disconnect();return {...window.wallProbe,step:document.querySelector('.step-pill')?.getAttribute('aria-label'),wallNodes:document.querySelectorAll('.terrain-wall-side').length,quality:document.querySelector('.game-stage').dataset.quality,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).length};});
    const bad=after.samples.filter(s=>s.content!=='none' && (Math.abs(s.width-s.pseudo)>1 ||s.animation!=='none'||s.transform!=='none'));
    if(bad.length||errors.length||after.mutations||after.broken||after.wallNodes!==1||after.step===before.step)throw new Error(JSON.stringify({fixture:fixture.id,dpr,quality,motion,bad:bad.slice(0,2),errors,after}));
    const moving=new Set(after.samples.map(s=>s.world)).size;
    if(moving<2)throw new Error(`Camera did not move: ${fixture.id}/${quality}/${motion}`);
    const deltas=after.frames.slice(1).map((t,i)=>t-after.frames[i]).sort((a,b)=>a-b);
    rows.push({id:fixture.id,dpr,quality,motion,before,afterStep:after.step,terrainMutations:after.mutations,frameCount:after.frames.length,movingTransforms:moving,maxFrameMs:deltas.at(-1),p95FrameMs:deltas[Math.floor(deltas.length*.95)],ghostInvalidSamples:bad.length,errors});
    if(dpr===1&&quality==='full'&&motion==='full')await p.screenshot({path:path+'game-'+fixture.id+'.png'});
    await ctx.close();
  }
  return {status:'pass',scope:'local Chromium report-only; not iPad or clean-host performance',cases:rows.length,movingCases:rows.filter(r=>r.movingTransforms>1).length,terrainMutations:rows.reduce((n,r)=>n+r.terrainMutations,0),rows};
}
