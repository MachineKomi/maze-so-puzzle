async page => {
  await page.goto('http://127.0.0.1:4195/');
  await page.bringToFront();
  return await page.evaluate(async () => {
    const {mountRewardHarness}=await import('/scripts/art_review/reward-lifecycle-harness.tsx');
    const root=document.getElementById('root');root.style.display='none';
    const host=document.createElement('div');document.body.append(host);
    const original=requestAnimationFrame,originalCancel=cancelAnimationFrame,pending=new Set();
    window.requestAnimationFrame=callback=>{const id=original(t=>{pending.delete(id);callback(t);});pending.add(id);return id;};
    window.cancelAnimationFrame=id=>{pending.delete(id);originalCancel(id);};
    const harness=mountRewardHarness(host), failures=[];
    const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
    const state=()=>{const c=host.querySelector('canvas');return {width:c.width,height:c.height,running:c.dataset.running,pending:pending.size,tokens:Number(c.dataset.tokens)||0};};
    for(let i=0;i<100;i++) {
      harness.emit();
      if(i%3===0)harness.cancel();
      else if(i%3===1)window.dispatchEvent(new Event('blur'));
      else {harness.show(false);harness.show(true);}
      const s=state(); if(s.width!==1||s.height!==1||s.pending!==0)failures.push({i,...s});
    }
    await pause(1500);
    const afterCancelled=state();
    if(afterCancelled.width!==1||afterCancelled.pending!==0)failures.push(afterCancelled);
    harness.emit();await pause(400);const fresh=state();
    if(fresh.tokens<=0||fresh.width<=1)failures.push({fresh});
    harness.show(false);harness.show(true);await pause(1200);
    const afterPreference=state();if(afterPreference.width!==1||afterPreference.pending!==0)failures.push(afterPreference);
    harness.emit();harness.unmount();await pause(1500);
    if(host.children.length||pending.size)failures.push({unmountChildren:host.children.length,pending:pending.size});
    window.requestAnimationFrame=original;window.cancelAnimationFrame=originalCancel;host.remove();root.style.display='';
    if(failures.length)throw Error(JSON.stringify(failures));
    return {status:'pass',cycles:100,afterCancelled,fresh,afterPreference,finalPending:pending.size,
      scope:'realReact/canvas/rAF ownedharness; syntheticblur andactive-preferenceboundary; productionnavigation separately'};
  });
}
