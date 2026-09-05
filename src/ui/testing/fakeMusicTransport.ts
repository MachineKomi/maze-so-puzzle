import type { MusicTransportPort, MusicTransportSnapshot } from "../../musicTransport";
/** DEV proof fake: records interface calls, performs no audio/network work. */
export function fakeMusicTransport(record: (call: string) => void): MusicTransportPort {
  let snapshot: MusicTransportSnapshot = {context:"title",currentTrackId:"proof-track",muted:false,canPrevious:true,canNext:true,canShuffle:true,loopAvailable:false};
  const listeners = new Set<(snapshot:MusicTransportSnapshot)=>void>();
  const act=(call:string)=>{record(call);listeners.forEach(listener=>listener(snapshot));return snapshot;};
  return {getSnapshot:()=>snapshot,subscribe:listener=>{listeners.add(listener);return()=>{listeners.delete(listener);};},setContext:context=>{snapshot={...snapshot,context};return act(`context:${context}`);},setMuted:muted=>{snapshot={...snapshot,muted};return act(`muted:${muted}`);},previous:()=>act("previous"),next:()=>act("next"),shuffle:()=>act("shuffle"),startFromUserGesture:async()=>{act("start");return true;},dispose:()=>{act("dispose");}};
}
