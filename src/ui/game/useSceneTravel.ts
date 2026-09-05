import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";
import type { CameraWindow, GridSize } from "../../game/exploration";
import type { Point } from "../../game/types";
import { TileTraveller, travelCamera } from "../../tileTravel";

export interface SceneTravelSnapshot {
  readonly position: Point;
  readonly camera: CameraWindow;
  readonly cameraEnvelope: Pick<CameraWindow,"left"|"top"|"right"|"bottom">;
  readonly contentSize: {width:number;height:number};
  readonly followers: readonly {id:string;point:Point}[];
}
interface TravelInput {
  readonly boardRef: RefObject<HTMLDivElement | null>;
  readonly grid: GridSize;
  readonly position: Point;
  readonly camera: CameraWindow;
  readonly followers: readonly {id:string;point:Point}[];
  readonly runKey: string;
  readonly enabled: boolean;
  readonly discontinuity: boolean;
  readonly durationMs: number;
  readonly onGeometryReset: () => void;
}
interface Binding {
  input: TravelInput;
  board: HTMLDivElement;
  world: HTMLElement;
  player: HTMLElement;
  replacement: HTMLElement | null;
  anchors: HTMLElement[];
  followers: {id:string;point:Point;node:HTMLElement}[];
  width: number;
  height: number;
}

/** One rAF owner for travel. `translate` belongs here; sprite `transform`/poses
 * and VFX timelines remain independent. No frame writes to React/game state. */
export function useSceneTravel(input: TravelInput): RefObject<SceneTravelSnapshot> {
  const snapshot=useRef<SceneTravelSnapshot>({position:input.position,camera:input.camera,cameraEnvelope:input.camera,
    contentSize:{width:0,height:0},followers:input.followers});
  const leader=useRef<TileTraveller | null>(null);
  const followers=useRef(new Map<string,TileTraveller>());
  const binding=useRef<Binding | null>(null);
  const frame=useRef<number | undefined>(undefined);
  const generation=useRef(0);
  const observer=useRef<ResizeObserver | null>(null);

  const cancelFrame=useCallback(()=>{
    generation.current++;
    if(frame.current!==undefined) cancelAnimationFrame(frame.current);
    frame.current=undefined;
  },[]);

  const paint=useCallback((now:number)=>{
    const b=binding.current, actor=leader.current;
    if(!b || !actor) return;
    const point=actor.sample(now);
    const camera=b.input.discontinuity ? b.input.camera : travelCamera(b.input.grid,point,b.input.camera);
    const cellX=b.width/camera.width, cellY=b.height/camera.height;
    const dx=(b.input.camera.left-camera.left)*cellX;
    const dy=(b.input.camera.top-camera.top)*cellY;
    const translate=(node:HTMLElement,x:number,y:number)=>{node.style.translate=`${x.toFixed(5)}px ${y.toFixed(5)}px`;};
    translate(b.world,dx,dy);
    translate(b.player,dx+(point.x-b.input.position.x)*cellX,dy+(point.y-b.input.position.y)*cellY);
    if(b.replacement) translate(b.replacement,dx+(point.x-b.input.position.x)*cellX,dy+(point.y-b.input.position.y)*cellY);
    for(const node of b.anchors) translate(node,dx,dy);
    let moving=actor.moving;
    const positions=b.followers.map(follower=>{
      const travel=followers.current.get(follower.id)!;
      const at=travel.sample(now); moving ||= travel.moving;
      translate(follower.node,(at.x-follower.point.x)*cellX,(at.y-follower.point.y)*cellY);
      return {id:follower.id,point:at};
    });
    const bounds=actor.bounds;
    const first=travelCamera(b.input.grid,{x:bounds.left,y:bounds.top},b.input.camera);
    const last=travelCamera(b.input.grid,{x:bounds.right,y:bounds.bottom},b.input.camera);
    snapshot.current={position:point,camera,followers:positions,contentSize:{width:b.width,height:b.height},
      cameraEnvelope:{left:first.left,top:first.top,right:last.right,bottom:last.bottom}};
    b.board.dataset.travelState=moving ? "moving" : "settled";
    if(moving && frame.current===undefined && b.input.enabled && !document.hidden) {
      const token=generation.current;
      frame.current=requestAnimationFrame(at=>{
        frame.current=undefined;
        if(token===generation.current) paint(at);
      });
    }
  },[]);

  const settle=useCallback(()=>{
    cancelFrame();
    const b=binding.current;
    if(!b) return;
    const now=performance.now();
    leader.current?.settle(b.input.position,now);
    for(const f of b.followers) followers.current.get(f.id)?.settle(f.point,now);
    paint(now);
  },[cancelFrame,paint]);

  useLayoutEffect(()=>{
    const board=input.boardRef.current;
    if(!board) { cancelFrame(); binding.current=null; observer.current?.disconnect(); return; }
    const prior=binding.current, now=performance.now();
    const boundary=!prior || prior.board!==board || prior.input.runKey!==input.runKey ||
      prior.input.discontinuity!==input.discontinuity || !input.enabled || document.hidden;
    if(boundary) { cancelFrame(); leader.current=new TileTraveller(input.position,now); followers.current.clear(); }
    else leader.current!.retarget(input.position,now,input.durationMs);
    const nodes=Array.from(board.querySelectorAll<HTMLElement>("[data-follower-id]"));
    const boundFollowers=input.followers.flatMap(f=>{
      const node=nodes.find(n=>n.dataset.followerId===f.id);
      if(!node) return [];
      const existing=followers.current.get(f.id);
      if(existing) existing.retarget(f.point,now,input.durationMs);
      else followers.current.set(f.id,new TileTraveller(f.point,now));
      return [{...f,node}];
    });
    for(const id of followers.current.keys()) if(!boundFollowers.some(f=>f.id===id)) followers.current.delete(id);
    binding.current={input,board,world:board.querySelector<HTMLElement>(".camera-world")!,
      player:board.querySelector<HTMLElement>(".player-layer")!,
      replacement:board.querySelector<HTMLElement>('[data-travel-actor="replacement"]'),
      anchors:Array.from(board.querySelectorAll<HTMLElement>("[data-travel-camera-anchor]")),followers:boundFollowers,
      width:prior?.board===board ? prior.width : board.clientWidth,
      height:prior?.board===board ? prior.height : board.clientHeight};
    if(prior?.board!==board) {
      observer.current?.disconnect();
      observer.current=new ResizeObserver(entries=>{
        const b=binding.current, entry=entries[0];
        if(!b || b.board!==board || !entry) return;
        const {width,height}=entry.contentRect;
        const changed=Math.abs(width-b.width)>.25 || Math.abs(height-b.height)>.25;
        b.width=width;b.height=height;
        if(changed) { b.input.onGeometryReset(); settle(); } else paint(performance.now());
      });
      observer.current.observe(board);
    }
    paint(now);
  });

  useLayoutEffect(()=>{
    const hide=()=>{ if(document.hidden) settle(); };
    document.addEventListener("visibilitychange",hide);
    window.addEventListener("blur",settle);
    return ()=>{
      cancelFrame();observer.current?.disconnect();binding.current=null;
      document.removeEventListener("visibilitychange",hide);window.removeEventListener("blur",settle);
    };
  },[cancelFrame,settle]);
  return snapshot;
}
