import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { contexts, FakeAudioContext, installAudioContext, resetAudioFakes } from "./test/audioFakes";

async function activate(): Promise<void> {
  await (await import("./audioMix")).activateAudioFromUserGesture();
}

beforeEach(() => {
  resetAudioFakes();
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("playSound", () => {
  it("keeps muted and unsupported environments silent", async () => {
    const { playSound } = await import("./sound");

    expect(() => playSound("title", true)).not.toThrow();
    expect(() => playSound("title", false)).not.toThrow();
    expect(contexts).toHaveLength(0);
  });

  it("schedules the new gentle title cue and releases its audio nodes", async () => {
    installAudioContext();
    const { playSound } = await import("./sound");
    await activate();

    playSound("title", false);

    const ctx = contexts[0];
    expect(ctx).toBeDefined();
    expect(ctx?.resume).toHaveBeenCalledOnce();
    expect(ctx?.oscillators).toHaveLength(5);
    expect(ctx?.gains).toHaveLength(7);
    expect(ctx?.oscillators.every((voice) => voice.start.mock.calls.length === 1)).toBe(true);
    expect(ctx?.oscillators.every((voice) => voice.stop.mock.calls.length === 1)).toBe(true);

    ctx?.oscillators.forEach((voice) => voice.finish());
    expect(ctx?.oscillators.every((voice) => voice.disconnect.mock.calls.length === 1)).toBe(true);
    expect(ctx?.gains.slice(2).every((gain) => gain.disconnect.mock.calls.length === 1)).toBe(true);
  });

  it("caps overlapping voices and admits new ones after earlier notes end", async () => {
    installAudioContext();
    const { playSound } = await import("./sound");
    await activate();

    for (let index = 0; index < 30; index += 1) playSound("step", false);

    const ctx = contexts[0];
    expect(ctx?.oscillators).toHaveLength(24);
    ctx?.oscillators.slice(0, 3).forEach((voice) => voice.finish());

    for (let index = 0; index < 5; index += 1) playSound("menu", false);
    expect(ctx?.oscillators).toHaveLength(27);
  });

  it("synthesizes a short layered spring-boots boing without media assets", async () => {
    installAudioContext();
    const { playSound } = await import("./sound");
    await activate();

    playSound("jump", false);

    const voices = contexts[0]?.oscillators ?? [];
    expect(voices).toHaveLength(4);
    expect(voices.map((voice) => voice.type)).toEqual(["triangle", "sine", "sine", "sine"]);
    expect(voices.map((voice) => voice.frequency.setValueAtTime.mock.calls[0])).toEqual([
      [165, 4],
      [330, 4.012],
      [1175, 4.035],
      [660, 4.09],
    ]);
    expect(voices.map((voice) => voice.frequency.exponentialRampToValueAtTime.mock.calls[0]?.[0]))
      .toEqual([660, 990, 880, 300]);
    expect(
      voices.every((voice) => voice.frequency.exponentialRampToValueAtTime.mock.calls.length === 1),
    ).toBe(true);
    expect(Math.max(...voices.map((voice) => voice.stop.mock.calls[0]?.[0] as number)))
      .toBeCloseTo(4.3, 5);
  });

  it("does not allocate a jump voice while sound is muted", async () => {
    installAudioContext();
    const { playSound } = await import("./sound");

    playSound("jump", true);

    expect(contexts).toHaveLength(0);
  });

  it("provides schedulable atomic cues for rescues and each combat beat", async () => {
    installAudioContext();
    const { playSound } = await import("./sound");
    await activate();
    const cues = [
      "friendRescue",
      "combatClash",
      "combatSparks",
      "combatImpact",
      "combatPowerUp",
      "combatVictory",
      "powerTick",
      "portal",
    ] as const;

    for (const cue of cues) {
      const ctx = contexts[0];
      const before = ctx?.oscillators.length ?? 0;
      playSound(cue, false);
      const activeContext = contexts[0];
      expect(activeContext?.oscillators.length).toBeGreaterThan(before);
      activeContext?.oscillators.slice(before).forEach((voice) => voice.finish());
    }
  });

  it("never lets a browser audio failure interrupt play", async () => {
    installAudioContext();
    const { playSound } = await import("./sound");
    await activate();
    const createOscillator = vi
      .spyOn(FakeAudioContext.prototype, "createOscillator")
      .mockImplementation(() => {
        throw new Error("audio device unavailable");
      });

    expect(() => playSound("achievement", false)).not.toThrow();
    expect(createOscillator).toHaveBeenCalledTimes(4);
  });
});
