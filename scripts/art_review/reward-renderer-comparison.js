async page => {
  await page.goto('http://127.0.0.1:4195/');
  const cdp=await page.context().newCDPSession(page),events=[];
  cdp.on('Tracing.dataCollected',event=>events.push(...event.value));
  await cdp.send('Tracing.start',{categories:'devtools.timeline,blink.user_timing',transferMode:'ReportEvents'});
  const result=await page.evaluate(async () => {
    const {makeRewardTokens,advanceRewardToken}=await import('/src/vfx/rewardPhysics.ts');
    const {rewardGlyph}=await import('/src/vfx/rewardGlyphs.ts');
    // Disposable owned review page; no game/profile input or performance claim.
    document.getElementById('root').remove();
    const host=document.createElement('div');document.body.append(host);
    host.style.cssText='position:relative;width:600px;height:600px;background:#eee7dd;overflow:hidden';
    const terrain=Array.from({length:8},(_,y)=>Array.from({length:8},(_,x)=>x===0||y===0||x===7||y===7?'wall':'floor'));
    const glyphs=['gold','science','power'].map(rewardGlyph);
    const rows=[];
    for(const [ordinal,mode] of ['dom','canvas','canvas','dom'].entries()) {
      host.replaceChildren();
      let nodes=[],trails=[],shadows=[],labels=[],ctx;
      if(mode==='canvas') {
        const canvas=document.createElement('canvas');canvas.width=canvas.height=900;canvas.style.cssText='width:600px;height:600px';host.append(canvas);
        ctx=canvas.getContext('2d');ctx.scale(1.5,1.5);
      } else {
        const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('width','600');svg.setAttribute('height','600');svg.style.cssText='position:absolute;inset:0';host.append(svg);
        for(let i=0;i<24;i++) {
          const line=document.createElementNS(svg.namespaceURI,'polyline');line.setAttribute('fill','none');line.setAttribute('stroke',['#f5bf4f','#42aaa7','#ee82bc'][Math.floor(i/8)]);line.setAttribute('stroke-width','3');line.setAttribute('stroke-linecap','round');line.setAttribute('opacity','.45');svg.append(line);trails.push(line);
          const shadow=document.createElementNS(svg.namespaceURI,'ellipse');shadow.setAttribute('rx','9');shadow.setAttribute('ry','3');shadow.setAttribute('fill','#543e68');shadow.setAttribute('opacity','.15');svg.append(shadow);shadows.push(shadow);
          const label=document.createElement('b');label.textContent='3';label.style.cssText='position:absolute;left:0;top:0;color:#6a4696;font:11px sans-serif';labels.push(label);
        }
        nodes=Array.from({length:24},(_,i)=>{const img=document.createElement('img');img.src=glyphs[Math.floor(i/8)].toDataURL();img.style.cssText='position:absolute;left:0;top:0;width:24px;height:24px;';host.append(img);return img;});
        labels.forEach(label=>host.append(label));
        await Promise.all(nodes.map(i=>i.decode()));
      }
      let tokens=[],previous=performance.now(),start=previous,lastBurst=-Infinity;
      const durations=[],frames=[];
      performance.mark(`reward-comparison-${ordinal}-${mode}-start`);
      await new Promise(resolve=>{
        const tick=()=>{
          const now=performance.now(),workStart=now;
          if(now-lastBurst>1100) {
            tokens=['gold','science','power'].flatMap((kind,i)=>makeRewardTokens({kind,at:{x:2+i,y:3},amount:8,seed:42+i},now,8));lastBurst=now;
          }
          ctx?.clearRect(0,0,600,600);
          tokens.forEach((token,i)=>{
            advanceRewardToken(token,terrain,{x:3.5,y:4.5},previous,now);
            const x=token.x*75-12,y=token.y*75-12,visible=!token.expired&&!token.arrived;
            if(ctx&&visible) {
              ctx.beginPath();token.trail.forEach((p,j)=>j?ctx.lineTo(p.x*75,p.y*75):ctx.moveTo(p.x*75,p.y*75));
              ctx.strokeStyle=['#f5bf4f','#42aaa7','#ee82bc'][Math.floor(i/8)];ctx.globalAlpha=.45;ctx.lineWidth=3;ctx.lineCap='round';ctx.stroke();
              ctx.beginPath();ctx.ellipse(x+12,y+20,9,3,0,0,Math.PI*2);ctx.fillStyle='#543e68';ctx.globalAlpha=.15;ctx.fill();ctx.globalAlpha=1;
              ctx.save();ctx.translate(x+12,y+12);ctx.rotate(token.angle*.3);ctx.drawImage(glyphs[Math.floor(i/8)],-12,-12,24,24);ctx.restore();
              ctx.fillStyle='#6a4696';ctx.font='11px sans-serif';ctx.fillText('3',x+9,y+31);
            }
            if(nodes[i]) {
              nodes[i].style.transform=`translate(${x}px,${y}px) rotate(${token.angle*.3}rad)`;nodes[i].style.opacity=visible?'1':'0';
              trails[i].setAttribute('points',token.trail.map(p=>`${p.x*75},${p.y*75}`).join(' '));trails[i].style.visibility=visible?'visible':'hidden';
              shadows[i].setAttribute('cx',String(x+12));shadows[i].setAttribute('cy',String(y+20));shadows[i].style.visibility=visible?'visible':'hidden';
              labels[i].style.transform=`translate(${x+9}px,${y+20}px)`;labels[i].style.opacity=visible?'1':'0';
            }
          });
          durations.push(performance.now()-workStart);frames.push(now-previous);previous=now;
          if(now-start<3400)requestAnimationFrame(tick);else resolve();
        };requestAnimationFrame(tick);
      });
      performance.mark(`reward-comparison-${ordinal}-${mode}-end`);
      const sorted=durations.toSorted((a,b)=>a-b),frameSorted=frames.toSorted((a,b)=>a-b);
      rows.push({ordinal,mode,nodes:host.querySelectorAll('*').length,frames:frames.length,workP95:sorted[Math.floor(sorted.length*.95)],
        frameP95:frameSorted[Math.floor(frameSorted.length*.95)],maxFrame:Math.max(...frames),backingBytes:mode==='canvas'?900*900*4:0});
    }
    host.remove(); return {rows,scope:'same24glyph/trail/shadow/group-label/deterministicphysics workload; loaded-host report-only; no GPU/physical-iPad claim'};
  });
  const complete=new Promise(resolve=>cdp.once('Tracing.tracingComplete',resolve));
  await cdp.send('Tracing.end');await complete;await cdp.detach();
  for(const row of result.rows) {
    const start=events.find(e=>e.name===`reward-comparison-${row.ordinal}-${row.mode}-start`)?.ts;
    const end=events.find(e=>e.name===`reward-comparison-${row.ordinal}-${row.mode}-end`)?.ts;
    const paint=events.filter(e=>e.name==='Paint'&&e.ph==='X'&&e.ts>=start&&e.ts<=end);
    row.paintEvents=paint.length;row.paintCpuMs=paint.reduce((sum,e)=>sum+(e.dur||0),0)/1000;
  }
  return result;
}
