import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type EndListener = () => void;

class FakeOscillator {
  type: OscillatorType = "sine";
  readonly frequency = {
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  };
  readonly connect = vi.fn();
  readonly disconnect = vi.fn();
  readonly start = vi.fn();
  readonly stop = vi.fn();
  private endListener: EndListener | undefined;

  readonly addEventListener = vi.fn(
    (event: string, listener: EventListenerOrEventListenerObject) => {
      if (event !== "ended") return;
      this.endListener = () => {
        if (typeof listener === "function") listener(new Event("ended"));
        else listener.handleEvent(new Event("ended"));
      };
    },
  );

  finish(): void {
    this.endListener?.();
  }
}

class FakeGain {
  readonly gain = {
    setValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  };
  readonly connect = vi.fn();
  readonly disconnect = vi.fn();
}

const contexts: FakeAudioContext[] = [];

class FakeAudioContext {
  state: AudioContextState = "suspended";
  currentTime = 4;
  readonly destination = {};
  readonly oscillators: FakeOscillator[] = [];
  readonly gains: FakeGain[] = [];
  readonly resume = vi.fn(async () => {
    this.state = "running";
  });

  constructor() {
    contexts.push(this);
  }

  createOscillator(): FakeOscillator {
    const oscillator = new FakeOscillator();
    this.oscillators.push(oscillator);
    return oscillator;
  }

  createGain(): FakeGain {
    const gain = new FakeGain();
    this.gains.push(gain);
    return gain;
  }
}

function installAudioContext(): void {
  vi.stubGlobal("AudioContext", FakeAudioContext);
  vi.stubGlobal("window", { AudioContext: FakeAudioContext });
}

beforeEach(() => {
  contexts.length = 0;
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

    playSound("title", false);

    const ctx = contexts[0];
    expect(ctx).toBeDefined();
    expect(ctx?.resume).toHaveBeenCalledOnce();
    expect(ctx?.oscillators).toHaveLength(5);
    expect(ctx?.gains).toHaveLength(5);
    expect(ctx?.oscillators.every((voice) => voice.start.mock.calls.length === 1)).toBe(true);
    expect(ctx?.oscillators.every((voice) => voice.stop.mock.calls.length === 1)).toBe(true);

    ctx?.oscillators.forEach((voice) => voice.finish());
    expect(ctx?.oscillators.every((voice) => voice.disconnect.mock.calls.length === 1)).toBe(true);
    expect(ctx?.gains.every((gain) => gain.disconnect.mock.calls.length === 1)).toBe(true);
  });

  it("caps overlapping voices and admits new ones after earlier notes end", async () => {
    installAudioContext();
    const { playSound } = await import("./sound");

    for (let index = 0; index < 30; index += 1) playSound("step", false);

    const ctx = contexts[0];
    expect(ctx?.oscillators).toHaveLength(24);
    ctx?.oscillators.slice(0, 3).forEach((voice) => voice.finish());

    for (let index = 0; index < 5; index += 1) playSound("menu", false);
    expect(ctx?.oscillators).toHaveLength(27);
  });

  it("synthesizes an unmistakable pitch-swept jump without media assets", async () => {
    installAudioContext();
    const { playSound } = await import("./sound");

    playSound("jump", false);

    const voices = contexts[0]?.oscillators ?? [];
    expect(voices).toHaveLength(3);
    expect(voices.map((voice) => voice.type)).toEqual(["triangle", "sine", "sine"]);
    expect(
      voices.every((voice) => voice.frequency.exponentialRampToValueAtTime.mock.calls.length === 1),
    ).toBe(true);
  });

  it("provides schedulable atomic cues for rescues and each combat beat", async () => {
    installAudioContext();
    const { playSound } = await import("./sound");
    const cues = [
      "friendRescue",
      "combatClash",
      "combatSparks",
      "combatImpact",
      "combatPowerUp",
      "combatVictory",
      "powerTick",
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
    const createOscillator = vi
      .spyOn(FakeAudioContext.prototype, "createOscillator")
      .mockImplementation(() => {
        throw new Error("audio device unavailable");
      });

    expect(() => playSound("achievement", false)).not.toThrow();
    expect(createOscillator).toHaveBeenCalledTimes(4);
  });
});
