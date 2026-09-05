import type { Point } from "./game/types";
import type { CameraWindow, GridSize } from "./game/exploration";
import { STEP_TRAVEL_MS } from "./movementControls";

export const TAP_TRAVEL_MS = STEP_TRAVEL_MS;
export const MAX_TRAVEL_LAG_MS = 280;
const EPSILON = 1e-8;
const distance = (a: Point, b: Point) => Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
const equal = (a: Point, b: Point) => distance(a,b) < EPSILON;

/** A presentation-only polyline. It never predicts, commits, or saves a move. */
export class TileTraveller {
  point: Point;
  target: Point;
  private pending: Point[] = [];
  private time: number;
  private speed = 1 / TAP_TRAVEL_MS;

  constructor(point: Point, now: number) { this.point=point; this.target=point; this.time=now; }
  get moving(): boolean { return this.pending.length>0; }
  get pendingDistance(): number {
    let total=0, previous=this.point;
    for (const point of this.pending) { total+=distance(previous,point); previous=point; }
    return total;
  }
  get remainingMs(): number { return this.pendingDistance/this.speed; }
  get bounds(): Pick<CameraWindow,"left"|"top"|"right"|"bottom"> {
    const points=[this.point,...this.pending];
    return {left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),
      top:Math.min(...points.map(p=>p.y)),bottom:Math.max(...points.map(p=>p.y))};
  }
  settle(point=this.target, now=this.time): void {
    this.point=point; this.target=point; this.pending=[]; this.time=now;
  }
  sample(now: number): Point {
    let remaining=Math.max(0,now-this.time)*this.speed;
    this.time=Math.max(this.time,now);
    while (this.pending.length) {
      const next=this.pending[0]!, length=distance(this.point,next);
      if (remaining+EPSILON<length) {
        const fraction=remaining/length;
        this.point={x:this.point.x+(next.x-this.point.x)*fraction,y:this.point.y+(next.y-this.point.y)*fraction};
        break;
      }
      this.point=next; this.pending.shift(); remaining-=length;
    }
    return this.point;
  }
  retarget(target: Point, now: number, durationMs=TAP_TRAVEL_MS): void {
    this.sample(now);
    if (equal(target,this.target)) return;
    // Portals/jumps/reset are explicit discontinuities, never a diagonal tween.
    if (Math.abs(distance(target,this.target)-1)>EPSILON) { this.settle(target,now); return; }
    const previousTarget=this.target;
    this.target=target;
    const earlier=this.pending.findIndex(point=>equal(point,target));
    if (earlier>=0) this.pending=this.pending.slice(0,earlier+1);
    else if (this.pending.length===1 &&
      ((this.point.y===target.y && target.y===previousTarget.y &&
        (target.x-this.point.x)*(previousTarget.x-this.point.x)<=0) ||
       (this.point.x===target.x && target.x===previousTarget.x &&
        (target.y-this.point.y)*(previousTarget.y-this.point.y)<=0))) {
      // Reverse along the painted edge without finishing an unpainted excursion.
      this.pending=[target];
    } else this.pending.push(target);
    this.pending=this.pending.filter((point,index)=>index>0 || !equal(point,this.point));
    const duration=Math.max(64,Math.min(MAX_TRAVEL_LAG_MS,durationMs));
    // Repeat timing already belongs to input. Rapid taps accelerate only enough
    // to keep the complete legal path within a bounded presentation lag.
    this.speed=Math.max(1/duration,this.pendingDistance/Math.min(MAX_TRAVEL_LAG_MS,duration+32));
  }
}

/** Same centring/clamping as getCameraWindow, with presentation fractions. */
export function travelCamera(grid: GridSize, point: Point, camera: CameraWindow): CameraWindow {
  const clamp=(value:number,max:number)=>Math.min(max,Math.max(0,value));
  const left=clamp(point.x-Math.floor((camera.width-1)/2),grid.width-camera.width);
  const top=clamp(point.y-Math.floor((camera.height-1)/2),grid.height-camera.height);
  return {...camera,left,top,right:left+camera.width-1,bottom:top+camera.height-1};
}
