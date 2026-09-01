import { describe, expect, it } from "vitest";
import {
  MAX_FOLLOWER_TRAIL_LENGTH,
  getVisibleFollowerPoints,
  recordFollowerStep,
} from "./followerTrail";
import type { CameraWindow } from "./exploration";

const camera: CameraWindow = {
  left: 2,
  top: 2,
  right: 7,
  bottom: 7,
  width: 6,
  height: 6,
};

describe("rescued friend trail", () => {
  it("keeps the square Ame just left at the front and removes loops", () => {
    const next = recordFollowerStep(
      [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 4, y: 3 }],
      { x: 2, y: 3 },
    );

    expect(next).toEqual([{ x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }]);
  });

  it("bounds the visual history for long play sessions", () => {
    const trail = Array.from({ length: 40 }, (_, x) => ({ x, y: 1 }));
    expect(recordFollowerStep(trail, { x: 50, y: 1 })).toHaveLength(MAX_FOLLOWER_TRAIL_LENGTH);
  });

  it("selects distinct visible footprints and never stacks a pet on Ame", () => {
    expect(getVisibleFollowerPoints(
      [
        { x: 4, y: 4 },
        { x: 3, y: 4 },
        { x: 3, y: 4 },
        { x: 1, y: 4 },
        { x: 4, y: 5 },
      ],
      { x: 4, y: 4 },
      camera,
      3,
    )).toEqual([{ x: 3, y: 4 }, { x: 4, y: 5 }]);
  });
});
