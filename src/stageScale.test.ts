import { describe, expect, it } from "vitest";
import {
  LOGICAL_STAGE_ASPECT_RATIO,
  calculateStageScale,
  getScaledStageSize,
} from "./stageScale";

describe("fixed logical stage scaling", () => {
  it.each([
    [1920, 1080],
    [1280, 720],
    [1024, 768],
    [844, 390],
    [667, 375],
    [568, 320],
  ])("fits a 16:9 stage inside %sx%s without stretching", (availableWidth, availableHeight) => {
    const stage = getScaledStageSize(availableWidth, availableHeight);

    expect(stage.scale).toBeGreaterThan(0);
    expect(stage.width).toBeLessThanOrEqual(availableWidth + 0.001);
    expect(stage.height).toBeLessThanOrEqual(availableHeight + 0.001);
    expect(stage.width / stage.height).toBeCloseTo(LOGICAL_STAGE_ASPECT_RATIO, 8);
  });

  it("letterboxes a classic iPad by width", () => {
    const stage = getScaledStageSize(1024, 768);

    expect(stage.scale).toBeCloseTo(1024 / 960, 8);
    expect(stage.width).toBeCloseTo(1024, 8);
    expect(stage.height).toBeCloseTo(576, 8);
  });

  it("letterboxes a wide phone by height", () => {
    const stage = getScaledStageSize(844, 390);

    expect(stage.scale).toBeCloseTo(390 / 540, 8);
    expect(stage.width).toBeCloseTo(693.333333, 5);
    expect(stage.height).toBeCloseTo(390, 8);
  });

  it.each([
    [0, 540],
    [960, 0],
    [-1, 540],
    [Number.NaN, 540],
    [960, Number.POSITIVE_INFINITY],
  ])("returns a safe zero scale for invalid space (%s, %s)", (width, height) => {
    expect(calculateStageScale(width, height)).toBe(0);
  });
});
