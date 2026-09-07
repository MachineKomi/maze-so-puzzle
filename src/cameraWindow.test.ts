import { describe, expect, it } from "vitest";
import { boundedWorldWindow, cameraWorldTranslation } from "./cameraMotion";
import type { CameraWindow } from "./game/exploration";

const view = (left: number, top: number, width = 6, height = 6): CameraWindow =>
  ({ left, top, width, height, right: left + width - 1, bottom: top + height - 1 });

describe("camera window rebasing", () => {
  it.each([[23, 23], [31, 17], [5, 9], [6, 6]])("preserves all world pixels through fractional travel and reversal in %i by %i", (width, height) => {
    const grid = { width, height }, w = Math.min(6, width), h = Math.min(6, height);
    let prior: CameraWindow | undefined;
    for (const t of [...Array.from({ length: 121 }, (_, i) => i / 120), ...Array.from({ length: 121 }, (_, i) => 1 - i / 120)]) {
      const camera = view(t * (width - w), t * (height - h), w, h), pane = boundedWorldWindow(grid, camera, prior);
      expect(pane.width).toBeLessThanOrEqual(w + 4); expect(pane.height).toBeLessThanOrEqual(h + 4);
      expect(pane.left).toBeLessThanOrEqual(camera.left); expect(pane.top).toBeLessThanOrEqual(camera.top);
      expect(pane.left + pane.width).toBeGreaterThanOrEqual(camera.left + w);
      expect(pane.top + pane.height).toBeGreaterThanOrEqual(camera.top + h);
      const [dx, dy] = cameraWorldTranslation(pane, camera, pane).split(" ").map(parseFloat);
      for (const [bw, bh] of [[704, 704], [374, 366]]) for (const [x, y] of [[0, 0], [width - 1, height - 1], [3.125, 5.75]]) {
        // Independent direct projection equals local point + parent movement,
        // even across a window rebase or a non-square resized board.
        expect((x! - pane.left) * bw! / w + dx! * pane.width * bw! / w / 100).toBeCloseTo((x! - camera.left) * bw! / w, 4);
        expect((y! - pane.top) * bh! / h + dy! * pane.height * bh! / h / 100).toBeCloseTo((y! - camera.top) * bh! / h, 4);
      }
      prior = pane;
    }
  });
  it("reuses its window on nearby reversals and immediately covers a portal destination", () => {
    const grid = { width: 31, height: 31 }, pane = boundedWorldWindow(grid, view(10, 10));
    for (const at of [10.1, 10.8, 11, 10.4, 9.6, 10]) expect(boundedWorldWindow(grid, view(at, at), pane)).toBe(pane);
    expect(boundedWorldWindow(grid, view(25, 0), pane)).toEqual({ left: 21, top: 0, right: 30, bottom: 9, width: 10, height: 10 });
  });
});
