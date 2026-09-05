import { describe, expect, it } from "vitest";
import { getCameraWindow } from "./game/exploration";
import { MAX_TRAVEL_LAG_MS, TAP_TRAVEL_MS, TileTraveller, travelCamera } from "./tileTravel";

describe("committed tile presentation",()=>{
  it("animates the first tap and a repeated tile through the same intermediate positions",()=>{
    const tap=new TileTraveller({x:3,y:3},0);
    tap.retarget({x:4,y:3},0);
    const repeated=new TileTraveller({x:2,y:3},-TAP_TRAVEL_MS);
    repeated.retarget({x:3,y:3},-TAP_TRAVEL_MS);
    repeated.retarget({x:4,y:3},0);
    for(const time of [16,40,80,120]) {
      const single=tap.sample(time), held=repeated.sample(time);
      expect(single).toEqual(held);
      expect(single.x).toBeGreaterThan(3);
      expect(single.x).toBeLessThan(4);
      expect(travelCamera({width:15,height:15},single,getCameraWindow({width:15,height:15},{x:4,y:3})).left)
        .toBeCloseTo(single.x-2,8);
    }
    expect(tap.sample(TAP_TRAVEL_MS)).toEqual({x:4,y:3});
    expect(repeated.sample(TAP_TRAVEL_MS)).toEqual({x:4,y:3});
  });
  it("keeps corners, acknowledges early reversal, and lands exactly",()=>{
    const t=new TileTraveller({x:1,y:1},0);
    t.retarget({x:2,y:1},0,160); t.retarget({x:2,y:2},64,160);
    expect(t.sample(80).y).toBe(1);
    expect(t.sample(400)).toEqual({x:2,y:2}); expect(t.moving).toBe(false);
    t.retarget({x:3,y:2},500); const before=t.sample(540).x;
    t.retarget({x:2,y:2},540); expect(t.sample(560).x).toBeLessThan(before);
    expect(t.sample(800)).toEqual({x:2,y:2});
  });
  it("is independent of 30/60/120Hz and variable frames",()=>{
    for(const hz of [30,60,120]) {
      const t=new TileTraveller({x:0,y:0},0);t.retarget({x:1,y:0},0,160);
      for(let time=1000/hz;time<100;time+=1000/hz)t.sample(time);
      expect(t.sample(100).x).toBeCloseTo(.625,8);
    }
    const t=new TileTraveller({x:0,y:0},0);t.retarget({x:1,y:0},0,160);
    for(const at of [1,6,23,71,72,100])t.sample(at);
    expect(t.point.x).toBeCloseTo(.625,8);
    expect(t.sample(10000)).toEqual({x:1,y:0});
  });
  it("bounds lag under rapid legal inputs without cutting corners",()=>{
    const t=new TileTraveller({x:0,y:0},0);let target={x:0,y:0};
    for(let n=1;n<=1000;n++) {
      target=n%2 ? {...target,x:target.x+1} : {...target,y:target.y+1};
      t.retarget(target,n*64);
      expect(t.remainingMs).toBeLessThanOrEqual(MAX_TRAVEL_LAG_MS+.001);
      // Deliberately oversupply at 64ms (normal input now commits at 160ms).
      // A 192ms recovery window approaches three tiles; retain the time and
      // cardinal-path bounds while allowing floating-point equality here.
      expect(t.pendingDistance).toBeLessThanOrEqual(3+1e-8);
      expect(Number.isInteger(t.point.x)||Number.isInteger(t.point.y)).toBe(true);
    }
    expect(t.sample(65000)).toEqual(target);
  });
  it("keeps velocity continuous at the repeat boundary",()=>{
    const t=new TileTraveller({x:3,y:3},0);t.retarget({x:4,y:3},0,160);
    const a=t.sample(150).x;t.retarget({x:5,y:3},160,160);const b=t.sample(170).x;
    expect(b-a).toBeCloseTo(20/160,8);
  });
  it("reports the swept envelope under mixed-source cadence and rapid turns",()=>{
    const t=new TileTraveller({x:3,y:3},0);let target={x:3,y:3};
    for(let n=1;n<=100;n++) {
      target=n%2 ? {...target,x:target.x+1} : {...target,y:target.y+1};
      t.retarget(target,n*64,260);
      expect(t.remainingMs).toBeLessThanOrEqual(MAX_TRAVEL_LAG_MS+.001);
      const bounds=t.bounds;
      for(const time of [n*64+1,n*64+17,n*64+40]) {
        const point=t.sample(time);
        expect(point.x).toBeGreaterThanOrEqual(bounds.left);
        expect(point.x).toBeLessThanOrEqual(bounds.right);
        expect(point.y).toBeGreaterThanOrEqual(bounds.top);
        expect(point.y).toBeLessThanOrEqual(bounds.bottom);
      }
    }
  });
  it("snaps discontinuities and cancels without stale motion",()=>{
    const t=new TileTraveller({x:0,y:0},0);t.retarget({x:1,y:0},0);t.sample(25);
    t.settle(undefined,25);expect(t.sample(60)).toEqual({x:1,y:0});
    t.retarget({x:20,y:20},80);expect(t.sample(100)).toEqual({x:20,y:20});
  });
  it("derives edge clamping and a static small-maze camera from the actor",()=>{
    const grid={width:15,height:15}, target=getCameraWindow(grid,{x:3,y:3});
    expect(travelCamera(grid,{x:2.5,y:3},target).left).toBe(.5);
    expect(travelCamera(grid,{x:14,y:14},target)).toEqual(getCameraWindow(grid,{x:14,y:14}));
    const small={width:5,height:5};expect(travelCamera(small,{x:3.2,y:2.4},getCameraWindow(small,{x:3,y:2})).left).toBe(0);
  });
});
