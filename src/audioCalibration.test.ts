import { describe, expect, it } from "vitest";
import { MAX_SFX_VOLUME, musicGain, musicPosition, sfxGain, sfxPosition } from "./audioCalibration";

describe("calibrated controls with raw-gain authority", () => {
  it("has exact silence, 75-percent defaults and real upper headroom", () => {
    expect([musicGain(0), musicGain(.75), musicGain(1)]).toEqual([0, .1, 1]);
    expect([musicPosition(0), musicPosition(.1), musicPosition(1)]).toEqual([0, .75, 1]);
    expect([sfxGain(0), sfxGain(.75), sfxGain(1)]).toEqual([0, 1, MAX_SFX_VOLUME]);
    expect([sfxPosition(0), sfxPosition(1), sfxPosition(MAX_SFX_VOLUME)]).toEqual([0, .75, 1]);
    expect(sfxGain(.99)).toBeGreaterThan(sfxGain(.98));
    expect(musicGain(.5)).toBeCloseTo(.04444444444444444, 14);
  });
  it("is monotone and reversible across range steps and fractional positions", () => {
    for (const [forward, inverse] of [[musicGain, musicPosition], [sfxGain, sfxPosition]] as const) {
      let previous = -1;
      for (let i = 0; i <= 10000; i++) {
        const u = i / 10000, gain = forward(u);
        expect(gain).toBeGreaterThan(previous);
        expect(inverse(gain)).toBeCloseTo(u, 12);
        previous = gain;
      }
    }
    for (const gain of [1e-24, 1e-12, .010123456789, .09999999999, .10000000001, .22, .87654321]) {
      expect(musicGain(musicPosition(gain)) / gain).toBeCloseTo(1, 12);
      expect(sfxGain(sfxPosition(gain)) / gain).toBeCloseTo(1, 12);
    }
  });
  it("keeps the music slope continuous at the default and clamps invalid input", () => {
    const h = 1e-7;
    expect((musicGain(.75) - musicGain(.75 - h)) / h).toBeCloseTo((musicGain(.75 + h) - musicGain(.75)) / h, 5);
    for (const forward of [musicGain, sfxGain]) {
      expect(forward(-1)).toBe(0);
      expect(forward(2)).toBe(forward(1));
      expect(forward(NaN)).toBe(forward(.75));
      expect(forward(Infinity)).toBe(forward(.75));
    }
  });
});
