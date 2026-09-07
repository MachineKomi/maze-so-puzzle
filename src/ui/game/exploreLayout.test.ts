import { describe, expect, it } from "vitest";
import { calculateExploreLayout } from "./layout";
import { stageFit } from "../stageFit";
import { getCameraWindow, visibleKeysInWindow } from "../../game/exploration";
import { boundedWorldWindow, cameraWorldStyle } from "../../cameraMotion";
import { travelCamera } from "../../tileTravel";
import { enemyDiscoveriesForView, friendDiscoveriesForView } from "../../game/discovery";
import { CURATED_LEVELS } from "../../game/levels";

describe("spacious exploration geometry", () => {
  it.each([[780,312],[844,390],[568,320],[960,540],[1080,810],[1194,834],[1280,720],[1920,1080],[3440,1440]])("keeps square cells and bounded backing at %sx%s", (width,height) => {
    const stage=stageFit(width,height), grid={width:23,height:23};
    const wide=calculateExploreLayout(stage.width-16,stage.height-16,grid);
    const folded=calculateExploreLayout(stage.width-16,stage.height-16,grid,true);
    expect(folded.boardWidth).toBeGreaterThan(wide.boardWidth);
    for(const layout of [wide,folded]) {
      expect((layout.boardWidth-8)/layout.columns).toBeCloseTo((layout.boardHeight-8)/layout.rows,8);
      expect(Math.max(layout.columns,layout.rows)).toBeLessThanOrEqual(12+1e-10);
      for(const point of [{x:0,y:0},{x:11,y:11},{x:22,y:22}]) {
        const camera=getCameraWindow(grid,point,{width:layout.columns,height:layout.rows});
        expect(travelCamera(grid,point,camera)).toEqual(camera);
        const paint=boundedWorldWindow(grid,camera);
        expect(Number.isInteger(paint.width)&&Number.isInteger(paint.height)&&Number.isInteger(paint.left)&&Number.isInteger(paint.top)).toBe(true);
        expect(paint.width).toBeLessThanOrEqual(16);
        expect(paint.height).toBeLessThanOrEqual(16);
        expect(paint.left).toBeLessThanOrEqual(camera.left);
        expect(paint.top+paint.height).toBeGreaterThanOrEqual(camera.top+camera.height-1e-10);
        const css=cameraWorldStyle(grid as typeof CURATED_LEVELS[number],camera);
        expect(parseFloat(css.width as string)/100*camera.width).toBeCloseTo(paint.width,8);
      }
    }
  });
  it("fits tiny lessons intact with square cells",()=>{
    for(const grid of [{width:5,height:5},{width:4,height:6},{width:6,height:3}]) {
      const fit=calculateExploreLayout(1280,720,grid,true);
      expect([fit.columns,fit.rows]).toEqual([grid.width,grid.height]);
      expect(fit.boardHeight).toBeLessThanOrEqual(720);
      expect(fit.boardWidth).toBeLessThanOrEqual(fit.paneWidth);
    }
  });
  it("only exposes tile centres, never numerical slivers or fractional keys",()=>{
    const grid={width:20,height:20};
    const camera={left:2.50000000001,top:1.25,width:6.2,height:6,right:7.7,bottom:6.25};
    const keys=visibleKeysInWindow(grid,camera);
    expect(keys).toContain("2,1");
    expect(keys).not.toContain("1,1");
    expect(keys).not.toContain("9,1");
    expect(keys.every(k=>/^\d+,\d+$/.test(k))).toBe(true);
    expect(new Set(keys).size).toBe(keys.length);
  });
  it("Book discovery consumes the supplied real view rather than a hidden six-square recomputation",()=>{
    const level=CURATED_LEVELS.find(l=>l.objects.some(o=>o.kind==="enemy")&&l.objects.some(o=>o.kind==="animal"))!;
    const enemy=level.objects.find(o=>o.kind==="enemy")!;
    const friend=level.objects.find(o=>o.kind==="animal")!;
    expect(enemyDiscoveriesForView(level,level.start,[],[])).toEqual([]);
    expect(friendDiscoveriesForView(level,level.start,[],[])).toEqual([]);
    expect(enemyDiscoveriesForView(level,level.start,[],[`${enemy.at.x},${enemy.at.y}`])).toHaveLength(1);
    expect(friendDiscoveriesForView(level,level.start,[],[`${friend.at.x},${friend.at.y}`])).toHaveLength(1);
  });
});
