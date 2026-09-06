import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";
import type { CameraWindow, GridSize } from "../../game/exploration";
import type { Point } from "../../game/types";
import { TileTraveller, travelCamera } from "../../tileTravel";
import { cameraWorldTranslation } from "../../cameraMotion";
import { jumpGroundPosition, type JumpTravel } from "../../jumpPresentation";

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
  /** Changes only when a replacement actor or camera-anchored node mounts. */
  readonly bindingKey: string;
  readonly runKey: string;
  readonly enabled: boolean;
  readonly discontinuity: boolean;
  readonly jump: JumpTravel | null;
  readonly animateJump: boolean;
  readonly durationMs: number;
  readonly onGeometryReset: () => void;
}
interface Binding {
  input: TravelInput;
  board: HTMLDivElement;
  world: HTMLElement;
  foreground: SVGSVGElement | null;
  player: HTMLElement;
  replacement: HTMLElement | null;
  jumper: HTMLElement | null;
  jumpAnimations: Animation[];
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
  const settledJump=useRef<JumpTravel | null>(null);

  const cancelFrame=useCallback(()=>{
    generation.current++;
    if(frame.current!==undefined) cancelAnimationFrame(frame.current);
    frame.current=undefined;
  },[]);

  const paint=useCallback((now:number)=>{
    const b=binding.current, actor=leader.current;
    if(!b || !actor) return;
    const jump=b.input.jump;
    const jumping=jump!==null && settledJump.current!==jump && b.input.enabled && b.input.animateJump;
    const point=jump ? (jumping ? jumpGroundPosition(jump,now) : jump.to) : actor.sample(now);
    const camera=b.input.discontinuity ? b.input.camera : travelCamera(b.input.grid,point,b.input.camera);
    const cellX=b.width/camera.width, cellY=b.height/camera.height;
    const dx=(b.input.camera.left-camera.left)*cellX;
    const dy=(b.input.camera.top-camera.top)*cellY;
    const translate=(node:HTMLElement,x:number,y:number)=>{node.style.translate=`${x.toFixed(5)}px ${y.toFixed(5)}px`;};
    // Percentages use the full-world box, so even pre-ResizeObserver layout
    // changes keep the crop correct. Actors/anchors still need the pixel delta.
    b.world.style.translate=cameraWorldTranslation(b.input.grid,camera);
    if(b.foreground) b.foreground.style.translate=b.world.style.translate;
    translate(b.player,dx+(point.x-b.input.position.x)*cellX,dy+(point.y-b.input.position.y)*cellY);
    if(b.replacement) translate(b.replacement,dx+(point.x-b.input.position.x)*cellX,dy+(point.y-b.input.position.y)*cellY);
    if(b.jumper && jump) translate(b.jumper,dx+(point.x-jump.from.x)*cellX,dy+(point.y-jump.from.y)*cellY);
    // Local CSS poses use this same clock, including a delayed React mount or
    // cancellation. These are three cached animation handles, never layout reads.
    if(jump) for(const animation of b.jumpAnimations) animation.currentTime=jumping
      ? Math.max(0,Math.min(jump.durationMs,now-jump.startedAt)) : jump.durationMs;
    for(const node of b.anchors) translate(node,dx,dy);
    let moving=jump ? jumping && now<jump.startedAt+jump.durationMs : actor.moving;
    const positions=b.followers.map(follower=>{
      const travel=followers.current.get(follower.id)!;
      const at=travel.sample(now); moving ||= travel.moving;
      translate(follower.node,(at.x-follower.point.x)*cellX,(at.y-follower.point.y)*cellY);
      return {id:follower.id,point:at};
    });
    const bounds=jump ? {left:Math.min(jump.from.x,jump.to.x),top:Math.min(jump.from.y,jump.to.y),
      right:Math.max(jump.from.x,jump.to.x),bottom:Math.max(jump.from.y,jump.to.y)} : actor.bounds;
    const first=travelCamera(b.input.grid,{x:bounds.left,y:bounds.top},b.input.camera);
    const last=travelCamera(b.input.grid,{x:bounds.right,y:bounds.bottom},b.input.camera);
    snapshot.current={position:point,camera,followers:positions,contentSize:{width:b.width,height:b.height},
      cameraEnvelope:{left:first.left,top:first.top,right:last.right,bottom:last.bottom}};
    b.board.dataset.travelState=moving ? "moving" : "settled";
    if(moving && frame.current===undefined && b.input.enabled && !document.hidden) {
      const token=generation.current;
      frame.current=requestAnimationFrame(()=>{
        frame.current=undefined;
        // React commits retarget against performance.now(). Use that same
        // clock when this callback actually runs: a busy frame's rAF timestamp
        // may be old, which otherwise paints an old fraction then jerks ahead
        // on the next healthy frame after the main thread becomes available.
        if(token===generation.current) paint(performance.now());
      });
    }
  },[]);

  const settle=useCallback(()=>{
    cancelFrame();
    const b=binding.current;
    if(!b) return;
    const now=performance.now();
    settledJump.current=b.input.jump;
    leader.current?.settle(b.input.position,now);
    for(const f of b.followers) followers.current.get(f.id)?.settle(f.point,now);
    paint(now);
  },[cancelFrame,paint]);

  useLayoutEffect(()=>{
    const board=input.boardRef.current;
    if(!board) { cancelFrame(); binding.current=null; observer.current?.disconnect(); return; }
    const prior=binding.current, now=performance.now();
    if(prior?.input.jump!==input.jump) settledJump.current=null;
    if(!input.enabled || !input.animateJump || document.hidden) settledJump.current=input.jump;
    const boundary=!prior || prior.board!==board || prior.input.runKey!==input.runKey ||
      prior.input.discontinuity!==input.discontinuity || prior.input.jump!==input.jump || !input.enabled || document.hidden;
    if(boundary) { cancelFrame(); leader.current=new TileTraveller(input.position,now); followers.current.clear(); }
    else leader.current!.retarget(input.position,now,input.durationMs);
    const discover=!prior || prior.board!==board || prior.input.runKey!==input.runKey ||
      prior.input.bindingKey!==input.bindingKey || prior.input.animateJump!==input.animateJump ||
      prior.input.followers.map(f=>f.id).join(":")!==input.followers.map(f=>f.id).join(":");
    const nodes=discover ? Array.from(board.querySelectorAll<HTMLElement>("[data-follower-id]")) : prior.followers.map(f=>f.node);
    const boundFollowers=input.followers.flatMap(f=>{
      const node=nodes.find(n=>n.dataset.followerId===f.id);
      if(!node) return [];
      const existing=followers.current.get(f.id);
      if(existing) existing.retarget(f.point,now,input.durationMs);
      else followers.current.set(f.id,new TileTraveller(f.point,now));
      return [{...f,node}];
    });
    for(const id of followers.current.keys()) if(!boundFollowers.some(f=>f.id===id)) followers.current.delete(id);
    const jumper=discover ? board.querySelector<HTMLElement>('[data-travel-actor="jump"]') : prior.jumper;
    const jumpAnimations=discover ? (jumper?.getAnimations({subtree:true})??[])
      .filter(animation=>animation instanceof CSSAnimation && animation.animationName.startsWith("spring-jump-")) : prior.jumpAnimations;
    if(discover) for(const animation of jumpAnimations) animation.pause();
    binding.current={input,board,world:discover ? board.querySelector<HTMLElement>(".camera-world")! : prior.world,
      foreground:discover ? board.querySelector<SVGSVGElement>(".maze-foreground") : prior.foreground,
      player:discover ? board.querySelector<HTMLElement>(".player-layer")! : prior.player,
      replacement:discover ? board.querySelector<HTMLElement>('[data-travel-actor="replacement"]') : prior.replacement,
      jumper,jumpAnimations,
      anchors:discover ? Array.from(board.querySelectorAll<HTMLElement>("[data-travel-camera-anchor]")) : prior.anchors,followers:boundFollowers,
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
  },[input.boardRef,input.grid,input.position,input.camera,input.followers,input.bindingKey,input.runKey,
    input.enabled,input.discontinuity,input.jump,input.animateJump,input.durationMs,input.onGeometryReset,cancelFrame,paint,settle]);

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
