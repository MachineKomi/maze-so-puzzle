import {useEffect,useRef,useState} from 'react';
import {CatalogueImage} from './CatalogueImage';
import {playSound} from '../sound';
import type {EarnedKeepsake as Keepsake} from './earnedKeepsakes';

/** One ephemeral post-write event. Waiting is silent; interruption never replays. */
export function EarnedKeepsake({items,available,muted,onClose,corner,animated}: {
 items:readonly Keepsake[];available:boolean;muted:boolean;onClose:()=>void;
 corner:{right:boolean;bottom:boolean;width:number;height:number};animated:boolean;
}) {
 const started=useRef(false),deadline=useRef(0);
 const [active,setActive]=useState(false);
 const [quiet,setQuiet]=useState(!animated);
 useEffect(()=>{if(!animated)setQuiet(true);},[animated]);
 useEffect(()=>{
  if(!available){if(started.current)onClose();return;}
  if(!started.current){
   started.current=true;deadline.current=performance.now()+4500;
   playSound(items.some(i=>i.kind==='Badge')?'stamp':'reward',muted);
  }
  setActive(true);
  const timer=window.setTimeout(onClose,Math.max(0,deadline.current-performance.now()));
  return ()=>window.clearTimeout(timer);
 },[available,items,muted,onClose]);
 useEffect(()=>{const cancel=()=>{if(started.current)onClose();};window.addEventListener('resize',cancel);return()=>window.removeEventListener('resize',cancel);},[onClose]);
 if(!active)return null;
 const item=items[0]!;
 return <div className="earned-keepsake" data-quiet={quiet} data-right={corner.right} data-bottom={corner.bottom}
  style={{width:`${corner.width*100}%`,height:`${corner.height*100}%`}} data-wide={corner.width>.36}
  data-earned-ids={items.map(i=>i.id).join(',')} role="status" aria-live="polite" aria-atomic="true">
  <CatalogueImage src={item.art} alt="" displayPx={128}/>
  <div><small>Saved in your Book</small><strong>{item.label}</strong>
   <span>{items.length>1?`And ${items.length-1} more keepsake${items.length===2?'':'s'}!`:'A little treasure from your adventure.'}</span></div>
 </div>;
}
