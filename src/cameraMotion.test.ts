import { describe, expect, it } from "vitest";
import { cameraWorldStyle, worldLayerStyle } from "./cameraMotion";
import type { LevelDefinition } from "./game/types";

const level = {
  width: 15,
  height: 15,
} as LevelDefinition;

describe("smooth exploration camera geometry", () => {
  it("slides an oversized world while the player remains camera-relative", () => {
    expect(cameraWorldStyle(level, {
      left: 4,
      top: 6,
      right: 9,
      bottom: 11,
      width: 6,
      height: 6,
    })).toEqual({
      left: `${(-4 / 6) * 100}%`,
      top: "-100%",
      width: "250%",
      height: "250%",
    });
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
