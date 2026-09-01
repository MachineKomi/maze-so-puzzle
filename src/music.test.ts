import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const audioInstances: FakeAudio[] = [];
let playResult: "resolve" | "reject" = "resolve";

class FakeAudio {
  src: string;
  loop = false;
  preload = "";
  volume = 1;
  muted = false;
  currentTime = 12;
  readonly play = vi.fn(() =>
    playResult === "resolve"
      ? Promise.resolve()
      : Promise.reject(new DOMException("Track unavailable", "NotSupportedError")),
  );
  readonly pause = vi.fn();
  readonly load = vi.fn();
  readonly setAttribute = vi.fn();
  readonly removeAttribute = vi.fn((name: string) => {
    if (name === "src") this.src = "";
  });

  constructor(src: string) {
    this.src = src;
    audioInstances.push(this);
  }
}

function installAudio(): void {
  vi.stubGlobal("Audio", FakeAudio);
}

beforeEach(() => {
  audioInstances.length = 0;
  playResult = "resolve";
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("background music", () => {
  it("does not construct or play audio before a user gesture", async () => {
    installAudio();
    const { setMusicMuted } = await import("./music");

    setMusicMuted(true);

    expect(audioInstances).toHaveLength(0);
  });

  it("starts the standard looping track only when explicitly requested", async () => {
    installAudio();
    const { DEFAULT_MUSIC_TRACK_URL, startMusicFromUserGesture } = await import("./music");

    await expect(startMusicFromUserGesture()).resolves.toBe(true);

    const audio = audioInstances[0];
    expect(audio?.src).toBe(DEFAULT_MUSIC_TRACK_URL);
    expect(DEFAULT_MUSIC_TRACK_URL).toBe("/assets/ost/bgm_tiles_in_the_sun_v04.mp3");
    expect(audio?.loop).toBe(true);
    expect(audio?.preload).toBe("none");
    expect(audio?.volume).toBe(0.22);
    expect(audio?.setAttribute).toHaveBeenCalledWith("playsinline", "");
    expect(audio?.play).toHaveBeenCalledOnce();
  });

  it("applies mute state before creation and updates it in place", async () => {
    installAudio();
    const { setMusicMuted, startMusicFromUserGesture } = await import("./music");

    setMusicMuted(true);
    await startMusicFromUserGesture();
    expect(audioInstances[0]?.muted).toBe(true);

    setMusicMuted(false);
    expect(audioInstances[0]?.muted).toBe(false);
  });

  it("gracefully handles a missing track or blocked playback", async () => {
    installAudio();
    playResult = "reject";
    const { startMusicFromUserGesture } = await import("./music");

    await expect(startMusicFromUserGesture()).resolves.toBe(false);
  });

  it("pauses, rewinds, and reuses the player when stopped", async () => {
    installAudio();
    const { startMusicFromUserGesture, stopMusic } = await import("./music");

    await startMusicFromUserGesture();
    const audio = audioInstances[0];
    stopMusic();

    expect(audio?.pause).toHaveBeenCalledOnce();
    expect(audio?.currentTime).toBe(0);

    await startMusicFromUserGesture();
    expect(audioInstances).toHaveLength(1);
    expect(audio?.play).toHaveBeenCalledTimes(2);
  });

  it("fully disposes the player and creates a fresh one on a later gesture", async () => {
    installAudio();
    const { disposeMusic, startMusicFromUserGesture } = await import("./music");

    await startMusicFromUserGesture();
    const first = audioInstances[0];
    disposeMusic();

    expect(first?.pause).toHaveBeenCalledOnce();
    expect(first?.removeAttribute).toHaveBeenCalledWith("src");
    expect(first?.load).toHaveBeenCalledOnce();

    await startMusicFromUserGesture();
    expect(audioInstances).toHaveLength(2);
  });

  it("remains safe during server rendering where Audio is unavailable", async () => {
    vi.stubGlobal("Audio", undefined);
    const { startMusicFromUserGesture } = await import("./music");

    await expect(startMusicFromUserGesture()).resolves.toBe(false);
  });

  it("supports a custom track and clamps an excessive configured volume", async () => {
    installAudio();
    const { configureMusic, startMusicFromUserGesture } = await import("./music");

    configureMusic({ trackUrl: "/music/ame-theme.ogg", volume: 8 });
    await startMusicFromUserGesture();

    expect(audioInstances[0]?.src).toBe("/music/ame-theme.ogg");
    expect(audioInstances[0]?.volume).toBe(1);
  });
});
