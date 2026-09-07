// Diagnostic wrappers only. They perturb scheduling and must never be enabled
// in qualifying frame/work cohorts. No production import or Human save access.
// This separate bounded sampler has no prototype wrappers. Include it when
// comparing the startup/interaction trade, and report its own sampling overhead.
export async function installMountSample(page) {
  await page.evaluate(()=>{
    window.addEventListener('click',event=>{
      if(!event.target.closest('button')?.textContent?.trim().startsWith('Continue'))return;
      const start=performance.now(),sample={start,frames:[start],done:false,terrainAt:null};
      window.__mazeMountSample=sample;
      const observer=new MutationObserver(()=>{
        if(document.querySelector('.maze-terrain-svg')) {sample.terrainAt=performance.now()-start;observer.disconnect();}
      });observer.observe(document.body,{childList:true,subtree:true});
      const tick=()=>{
        sample.frames.push(performance.now());
        if(performance.now()-start<800)requestAnimationFrame(tick);
        else {sample.done=true;observer.disconnect();}
      };requestAnimationFrame(tick);
    },{capture:true,once:true});
  });
}

export async function installColdOpeningProbe(page) {
  await page.evaluate(() => {
    const records=[], start=performance.now();
    const record=(name,at,duration,detail)=>{
      if(records.length<20000) records.push({name,at:at-start,ms:duration,...detail});
    };
    const invoke=(name,original,receiver,args,detail)=>{
      const at=performance.now();
      try{return original.apply(receiver,args);}
      finally{record(name,at,performance.now()-at,detail);}
    };
    const surface=canvas=>canvas.classList.contains('vfx-rewards')?'canvas'
      :canvas.width===720&&canvas.height===128?'number-atlas':null;
    const rect=Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect=function(...args) {
      return this.matches('.vfx-rewards,[data-reward-anchor="ame"]')
        ?invoke('bounds',rect,this,args,{element:this.className}):rect.apply(this,args);
    };
    for(const name of ['width','height']) {
      const descriptor=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,name);
      Object.defineProperty(HTMLCanvasElement.prototype,name,{...descriptor,set(value){
        if(this.classList.contains('vfx-rewards'))invoke(`canvas.${name}`,descriptor.set,this,[value],{value});
        else descriptor.set.call(this,value);
      }});
    }
    for(const name of ['clearRect','setTransform','drawImage','strokeText','fillText','stroke','fill']) {
      const original=CanvasRenderingContext2D.prototype[name];
      CanvasRenderingContext2D.prototype[name]=function(...args){
        const target=surface(this.canvas);
        return target?invoke(`${target}.${name}`,original,this,args):original.apply(this,args);
      };
    }
    const font=Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype,'font');
    Object.defineProperty(CanvasRenderingContext2D.prototype,'font',{...font,set(value){
      const target=surface(this.canvas);
      if(target)invoke(`${target}.font`,font.set,this,[value],{value});
      else font.set.call(this,value);
    }});
    for(const name of ['getItem','setItem','removeItem']) {
      const original=Storage.prototype[name];
      Storage.prototype[name]=function(...args){
        return invoke(`storage.${name}`,original,this,args,{key:args[0],bytes:name==='setItem'?args[1]?.length:undefined});
      };
    }
    const raf=requestAnimationFrame;
    window.addEventListener('click',event=>{
      if(!event.target.closest('button')?.textContent?.trim().startsWith('Continue'))return;
      record('mount.click',performance.now(),0);
      const observer=new MutationObserver(()=>{
        if(document.querySelector('.maze-terrain-svg')) {
          record('mount.terrain-dom',performance.now(),0); observer.disconnect();
        }
      });
      observer.observe(document.body,{childList:true,subtree:true});
      raf.call(window,()=>raf.call(window,()=>record('mount.second-frame',performance.now(),0)));
    },true);
    window.requestAnimationFrame=function(callback){return raf.call(window,timestamp=>
      invoke('raf',callback,window,[timestamp],{callback:callback.name,source:callback.toString().slice(0,90)}));};
    window.addEventListener('keydown',event=>record('keydown',performance.now(),0,{key:event.key}),true);
    window.__mazeColdProbe=records;
  });
}
