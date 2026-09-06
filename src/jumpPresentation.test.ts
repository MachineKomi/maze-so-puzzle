import { describe, expect, it } from "vitest";
import { getJumpPresentationMotion, jumpGroundPosition } from "./jumpPresentation";
import { getCameraWindow } from "./game/exploration";
import { travelCamera } from "./tileTravel";

describe("Spring Boots jump presentation", () => {
  it("tracks the same ground point through all directions, with exact clamped endpoints", () => {
    const grid={width:15,height:15};
    for(const [x,y] of [[2,0],[-2,0],[0,2],[0,-2]]) {
      const jump={from:{x:6,y:6},to:{x:6+x!,y:6+y!},startedAt:100,durationMs:460};
      expect(jumpGroundPosition(jump,0)).toEqual(jump.from);
      expect(jumpGroundPosition(jump,1000)).toEqual(jump.to);
      let previous=0;
      for(const time of [101,116,173,230,330,440,559,560]) {
        const point=jumpGroundPosition(jump,time);
        const distance=Math.abs(point.x-jump.from.x)+Math.abs(point.y-jump.from.y);
        expect(distance).toBeGreaterThanOrEqual(previous);previous=distance;
        const camera=travelCamera(grid,point,getCameraWindow(grid,jump.to));
        expect(point.x-camera.left).toBeCloseTo(2,8);
        expect(point.y-camera.top).toBeCloseTo(2,8);
      }
    }
    const edge={from:{x:1,y:1},to:{x:3,y:1},startedAt:0,durationMs:460};
    expect(travelCamera(grid,jumpGroundPosition(edge,230),getCameraWindow(grid,edge.to)).left).toBe(0);
    expect(jumpGroundPosition(edge,230)).toEqual({x:2,y:1});
  });
  it("has one readable single-hole arc, independent of walking pace", () => {
    expect(getJumpPresentationMotion()).toEqual({
      holeCount: 1, durationMs: 460, apexPercent: -58, descentPercent: -30,
    });
  });
});
