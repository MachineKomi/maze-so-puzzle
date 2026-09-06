async page => {
  const data=await(await page.request.get('http://127.0.0.1:4194/output/playwright/rewards/fixtures.json')).json();
  const rows=[];
  for(const action of ['turn','resize','blur','home']) {
    const fixture=data.fixtures.find(f=>f.id===(action==='turn'?'gold':'combat'));
    const context=await page.context().browser().newContext({viewport:{width:1280,height:720}});
    const p=await context.newPage();
    await p.goto('http://127.0.0.1:4196');
    await p.evaluate(({data,fixture})=>{
      localStorage.setItem(data.keys.run,JSON.stringify(fixture.snapshot));
      localStorage.setItem(data.keys.progress,JSON.stringify(data.progress));
      localStorage.setItem(data.keys.preferences,JSON.stringify({...data.preferences,quality:'full',motion:'full'}));
    },{data,fixture});
    await p.reload(); await p.getByRole('button',{name:'Play',exact:true}).click();
    await p.getByRole('button',{name:/^Continue/}).click();
    await p.locator('.maze-terrain-svg').waitFor(); await p.bringToFront();
    await p.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));
    const key='Arrow'+fixture.direction[0].toUpperCase()+fixture.direction.slice(1);
    await p.keyboard.press(key); await p.waitForTimeout(action==='turn'?230:400);
    const admitted=await p.locator('.vfx-rewards').getAttribute('data-peak');
    if(!Number(admitted))throw Error('No admitted reward');
    let focusSwitch;
    if(action==='turn') {
      const opposite={up:'Down',down:'Up',left:'Right',right:'Left'}[fixture.direction];
      await p.keyboard.down('Arrow'+opposite); await p.waitForTimeout(450); await p.keyboard.up('Arrow'+opposite);
    } else if(action==='resize') await p.setViewportSize({width:1180,height:720});
    else if(action==='blur') {
      const other=await context.newPage(); await other.goto('about:blank'); await other.bringToFront();
      focusSwitch=await p.evaluate(()=>({hidden:document.hidden,focused:document.hasFocus(),tokens:document.querySelector('.vfx-rewards')?.dataset.tokens}));
      await other.waitForTimeout(2400); await other.close(); await p.bringToFront();
    }
    else await p.getByRole('button',{name:'Home',exact:true}).click();
    await p.waitForTimeout(2500);
    const result=await p.evaluate(key=>{
      const c=document.querySelector('.vfx-rewards');return{saved:JSON.parse(localStorage.getItem(key)),
        width:c?.width,tokens:c?.dataset.tokens,arrivals:c?.dataset.arrivals,screen:document.querySelector('.front-door-play')?'title':document.querySelector('.maze-board')?'game':'home'};
    },data.keys.run);
    if(result.tokens && result.tokens!=='0')throw Error('Stale tokens');
    if(result.width && result.width!==1)throw Error('Retained surface');
    if(action!=='turn'&&JSON.stringify(result.saved.game)!==JSON.stringify(fixture.after))throw Error('Interrupted committed state mismatch');
    if(action==='turn'&&result.saved.game.goldStarsCollected!==fixture.after.goldStarsCollected)throw Error('Turn lost reward');
    rows.push({action,admitted,focusSwitch,...result,saved:undefined}); await context.close();
  }
  return {status:'pass',rows};
}
