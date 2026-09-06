async page => {
  const origin = 'http://127.0.0.1:4196';
  const data = await (await page.request.get('http://127.0.0.1:4194/output/playwright/rewards/fixtures.json')).json();
  const browser = page.context().browser(), rows = [];
  for (const mode of [{quality:'full',motion:'full',width:1194,height:834,dpr:2},
    {quality:'lite',motion:'full',width:1194,height:834,dpr:2},
    {quality:'static',motion:'full',width:1194,height:834,dpr:2},
    {quality:'full',motion:'reduced',width:844,height:390,dpr:2},
    {quality:'full',motion:'full',width:844,height:390,dpr:2},
    {quality:'full',motion:'full',width:1280,height:720,dpr:1}]) for (const fixture of data.fixtures) {
    const {quality,motion}=mode, moving=quality!=='static'&&motion!=='reduced';
    const context = await browser.newContext({ viewport: { width: mode.width, height: mode.height }, deviceScaleFactor: mode.dpr });
    const p = await context.newPage(), errors = [];
    p.on('pageerror', e => errors.push(String(e)));
    await p.addInitScript(({data,fixture,quality,motion}) => {
      localStorage.setItem(data.keys.run, JSON.stringify(fixture.snapshot));
      localStorage.setItem(data.keys.progress, JSON.stringify(data.progress));
      localStorage.setItem(data.keys.preferences, JSON.stringify({...data.preferences, quality, motion}));
    }, {data,fixture,quality,motion});
    await p.goto(origin);
    await p.getByRole('button', {name:'Play', exact:true}).click();
    await p.getByRole('button', {name:/^Continue/}).click();
    await p.locator('.maze-terrain-svg').waitFor(); await p.bringToFront();
    await p.evaluate(() => Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));
    await p.evaluate(() => new Promise(resolve => {
      window.rewardProbe={samples:[],terrainMutations:0};
      window.rewardObserver=new MutationObserver(m=>window.rewardProbe.terrainMutations+=m.length);
      window.rewardObserver.observe(document.querySelector('.maze-terrain-svg'),{subtree:true,attributes:true,childList:true});
      const start=performance.now();
      const sample=()=>{
        const canvas=document.querySelector('.vfx-rewards'), actor=document.querySelector('[data-reward-anchor="ame"]');
        window.rewardProbe.samples.push({t:performance.now()-start,w:canvas.width,h:canvas.height,...canvas.dataset,
          anchors:document.querySelectorAll('[data-reward-anchor="ame"]').length,
          player:document.querySelector('.battle-ame .player-power')?.textContent,
          enemy:document.querySelector('.battle-enemy .enemy-power')?.textContent,
          actor:actor?.getBoundingClientRect().toJSON()});
        if(performance.now()-start<2800)requestAnimationFrame(sample);
      };
      requestAnimationFrame(()=>{sample();resolve();});
    }));
    await p.keyboard.press('Arrow'+fixture.direction[0].toUpperCase()+fixture.direction.slice(1));
    await p.waitForTimeout(fixture.id==='combat'?1480:360);
    // Screenshots are a separate cohort: capture can stall rAF and must not
    // contaminate the natural completion/arrival case on this loaded host.
    await p.waitForTimeout(2700);
    const result=await p.evaluate(key=>{
      window.rewardObserver.disconnect(); return {...window.rewardProbe,
        saved:JSON.parse(localStorage.getItem(key)),canvas:document.querySelector('.vfx-rewards').dataset,
        feedback:document.querySelector('.feedback-bar')?.textContent,
        broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).length};
    },data.keys.run);
    const positive=result.samples.filter(s=>Number(s.tokens)>0), final=result.samples.at(-1);
    if(errors.length||result.broken||result.terrainMutations||final.w!==1||final.h!==1)throw Error(JSON.stringify({fixture:fixture.id,quality,errors,result}));
    if(!moving && positive.length)throw Error('Static reward motion');
    if(moving && !positive.length)throw Error(`Missing burst: ${fixture.id}/${quality}`);
    const expectedArrivals={gold:quality==='lite'?4:8,science:4,potion:2,combat:12}[fixture.id];
    if(moving && Number(result.canvas.arrivals)!==expectedArrivals)throw Error(`Missing natural arrivals: ${fixture.id}/${quality}`);
    if(JSON.stringify(result.saved.game)!==JSON.stringify(fixture.after))throw Error(`Saved result mismatch: ${fixture.id}`);
    if(result.samples.some(s=>s.w>1536||s.h>1536||Number(s.tokens)>(quality==='lite'?12:24)||s.anchors!==1))throw Error('Resource/anchor bound');
    if(fixture.id==='combat') {
      const event=fixture.events.find(e=>e.type==='enemy-defeated');
      if(result.samples.filter(s=>s.player!==undefined&&s.enemy!==undefined).some(s=>Number(s.player)+Number(s.enemy)!==event.powerAfter))throw Error('Power conservation');
    }
    rows.push({id:fixture.id,...mode,positiveFrames:positive.length,peak:Math.max(...result.samples.map(s=>Number(s.peak)||0)),
      bounces:Number(result.canvas.bounces)||0,arrivals:Number(result.canvas.arrivals)||0,finalSize:[final.w,final.h],
      terrainMutations:result.terrainMutations,feedback:result.feedback,errors});
    await context.close();
  }
  return {status:'pass',rows};
}
