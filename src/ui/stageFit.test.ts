import { expect, it } from "vitest";
import { physicalContentRect, stageFit } from "./stageFit";
import { calculatePlayLayout } from "./game/layout";

it("fits a coordinated desktop composition without changing physical board extent", () => {
  for (const [w, h] of [[780,312], [844,390], [568,320], [756,288]]) {
    const fit = stageFit(w!, h!);
    expect(fit.width * fit.scale).toBeCloseTo(w!, 10);
    expect(fit.height * fit.scale).toBe(h);
    const play = calculatePlayLayout(fit.width - 16, fit.height - 16);
    expect(play.compact).toBe(false);
    expect(play.board * fit.scale).toBeLessThanOrEqual(h!);
  }
  for (const [w,h] of [[1194,834], [1280,720], [960,540], [390,844]]) expect(stageFit(w!,h!).scale).toBe(1);
});
it("uses physical content bounds for taps inside a transformed bordered board", () => {
  const element = { getBoundingClientRect: () => ({ left: 10, top: 20, width: 300, height: 300 }),
    offsetWidth: 600, offsetHeight: 600, clientLeft: 4, clientTop: 4, clientWidth: 592, clientHeight: 592 } as HTMLElement;
  expect(physicalContentRect(element)).toEqual({ left: 12, top: 22, width: 296, height: 296 });
});
