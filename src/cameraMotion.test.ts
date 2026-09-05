import { describe, expect, it } from "vitest";
import { cameraWorldStyle, cameraWorldTranslation, worldLayerStyle } from "./cameraMotion";
import type { LevelDefinition } from "./game/types";

const level = {
  width: 15,
  height: 15,
} as LevelDefinition;

describe("smooth exploration camera geometry", () => {
  it.each([
    { width: 11, height: 11, left: 5, top: 4, viewWidth: 6, viewHeight: 6 },
    { width: 23, height: 15, left: 7.375, top: 2.25, viewWidth: 6, viewHeight: 6 },
    { width: 5, height: 9, left: 0, top: 1.125, viewWidth: 5, viewHeight: 6 },
    { width: 6, height: 6, left: 0, top: 0, viewWidth: 6, viewHeight: 6 },
  ])("composes the same camera pixels before/after resize for $width × $height", row => {
    const [x, y] = cameraWorldTranslation(row, row).split(" ").map(parseFloat);
    // A fractional sample is unchanged while its box resizes; no cached pixel
    // measurement is needed to preserve the world crop in either axis.
    for (const [boardWidth, boardHeight] of [[682, 682], [374, 366]]) {
      const worldWidth = boardWidth! * row.width / row.viewWidth;
      const worldHeight = boardHeight! * row.height / row.viewHeight;
      expect(worldWidth * x! / 100).toBeCloseTo(-row.left * boardWidth! / row.viewWidth, 5);
      expect(worldHeight * y! / 100).toBeCloseTo(-row.top * boardHeight! / row.viewHeight, 5);
    }
  });
  it("sizes the oversized world without rebasing its layout origin", () => {
    expect(cameraWorldStyle(level, {
      left: 4,
      top: 6,
      right: 9,
      bottom: 11,
      width: 6,
      height: 6,
    })).toEqual({
      left: "0%",
      top: "0%",
      width: "250%",
      height: "250%",
    });
  });

  it("keeps layout identical across both camera axes and fractional samples", () => {
    const window = (left: number, top: number) => ({
      left, top, right: left + 5, bottom: top + 5, width: 6, height: 6,
    });
    const fixed = cameraWorldStyle(level, window(0, 0));
    for (const left of [0, 0.25, 4, 8.5, 9]) {
      for (const top of [0, 0.75, 6, 9]) {
        expect(cameraWorldStyle(level, window(left, top))).toEqual(fixed);
      }
    }
  });

  it("changes only world size when the viewport changes, including a full-maze view", () => {
    const camera = { left: 2, top: 3, right: 8, bottom: 9, width: 7, height: 7 };
    expect(cameraWorldStyle(level, camera)).toEqual({
      left: "0%", top: "0%", width: `${1500 / 7}%`, height: `${1500 / 7}%`,
    });
    expect(cameraWorldStyle(level, { left: 0, top: 0, right: 14, bottom: 14, width: 15, height: 15 }))
      .toEqual({ left: "0%", top: "0%", width: "100%", height: "100%" });
  });

  it("keeps the world fixed at a clamped edge so the player tile can glide", () => {
    expect(cameraWorldStyle(level, {
      left: 0,
      top: 0,
      right: 5,
      bottom: 5,
      width: 6,
      height: 6,
    })).toMatchObject({ left: "0%", top: "0%", width: "250%", height: "250%" });
  });

  it("places every object in stable full-world coordinates", () => {
    expect(worldLayerStyle({ x: 3, y: 9 }, level)).toEqual({
      left: "20%",
      top: "60%",
      width: `${100 / 15}%`,
      height: `${100 / 15}%`,
    });
  });
});
