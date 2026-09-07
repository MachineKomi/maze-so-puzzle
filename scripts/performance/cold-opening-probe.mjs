// Diagnostic wrappers only. They perturb scheduling and must never be enabled
// in qualifying frame/work cohorts. No production import or Human save access.
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
        return this.canvas.classList.contains('vfx-rewards')
          ?invoke(`canvas.${name}`,original,this,args):original.apply(this,args);
      };
    }
    for(const name of ['getItem','setItem','removeItem']) {
      const original=Storage.prototype[name];
      Storage.prototype[name]=function(...args){
        return invoke(`storage.${name}`,original,this,args,{key:args[0],bytes:name==='setItem'?args[1]?.length:undefined});
      };
    }
    const raf=requestAnimationFrame;
    window.requestAnimationFrame=function(callback){return raf.call(window,timestamp=>
      invoke('raf',callback,window,[timestamp],{callback:callback.name,source:callback.toString().slice(0,90)}));};
    window.addEventListener('keydown',event=>record('keydown',performance.now(),0,{key:event.key}),true);
    window.__mazeColdProbe=records;
  });
}
