import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const audioInstances: FakeAudio[] = [];
let playResult: "resolve" | "reject" = "resolve";

class FakeAudio {
  src: string;
  loop = false;
  preload = "";
  volume = 1;
  muted = false;
  paused = true;
  currentTime = 12;
  readonly play = vi.fn(() => {
    if (playResult === "reject") {
      return Promise.reject(new DOMException("Track unavailable", "NotSupportedError"));
    }
    this.paused = false;
    return Promise.resolve();
  });
  readonly pause = vi.fn(() => {
    this.paused = true;
  });
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
  it("exposes every full OST song as maze BGM but excludes the short friend cue", async () => {
    const { MAZE_MUSIC_TRACKS, MUSIC_TRACKS } = await import("./music");

    expect(MAZE_MUSIC_TRACKS).toHaveLength(13);
    expect(MAZE_MUSIC_TRACKS).toContain(MUSIC_TRACKS.arena);
    expect(MAZE_MUSIC_TRACKS).toEqual(expect.arrayContaining([
      MUSIC_TRACKS.dungeon,
      MUSIC_TRACKS.gallop,
      MUSIC_TRACKS.sanctuary,
      MUSIC_TRACKS.shore,
      MUSIC_TRACKS.throatBass,
      MUSIC_TRACKS.hardBass,
      MUSIC_TRACKS.hardBassOne,
      MUSIC_TRACKS.hardBassTwo,
    ]));
    expect(MAZE_MUSIC_TRACKS.every((track) => track.endsWith(".mp3"))).toBe(true);
    expect(MAZE_MUSIC_TRACKS.some((track) => track.includes("cue_new_friend"))).toBe(false);
  });

  it("assigns stable deterministic maze songs without immediate first-time repeats", async () => {
    const { createMazeMusicPicker } = await import("./music");
    const tracks = ["/music/one.mp3", "/music/two.mp3", "/music/three.mp3"];
    const first = createMazeMusicPicker("run-ame", {
      tracks,
      previousTrackUrl: "/music/one.mp3",
    });
    const second = createMazeMusicPicker("run-ame", {
      tracks,
      previousTrackUrl: "/music/one.mp3",
    });
    const mazeKeys = ["maze-1", "maze-2", "maze-3", "maze-4", "maze-5"];
    const firstSequence = mazeKeys.map((key) => first.trackForMaze(key));
    const secondSequence = mazeKeys.map((key) => second.trackForMaze(key));

    expect(firstSequence).toEqual(secondSequence);
    expect(firstSequence[0]).not.toBe("/music/one.mp3");
    firstSequence.slice(1).forEach((track, index) => {
      expect(track).not.toBe(firstSequence[index]);
    });
    expect(first.trackForMaze("maze-2")).toBe(firstSequence[1]);
  });

  it("can avoid non-maze music when returning from another screen", async () => {
    const { createMazeMusicPicker } = await import("./music");
    const picker = createMazeMusicPicker("returning-run", {
      tracks: ["/music/title.mp3", "/music/adventure.mp3"],
    });

    picker.noteTrackStarted("/music/title.mp3");
    expect(picker.trackForMaze("new-maze")).toBe("/music/adventure.mp3");
  });

  it("handles duplicate, empty, and one-song playlists safely", async () => {
    const { createMazeMusicPicker } = await import("./music");
    const picker = createMazeMusicPicker("tiny-run", {
      tracks: ["", " /music/only.mp3 ", "/music/only.mp3"],
      previousTrackUrl: "/music/only.mp3",
    });

    expect(picker.tracks).toEqual(["/music/only.mp3"]);
    expect(picker.trackForMaze("one")).toBe("/music/only.mp3");
    expect(picker.trackForMaze("two")).toBe("/music/only.mp3");
  });

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

  it("pauses active music while hidden and resumes the same current player", async () => {
    installAudio();
    const { setMusicPageHidden, startMusicFromUserGesture } = await import("./music");
    await startMusicFromUserGesture();
    const audio = audioInstances[0];

    setMusicPageHidden(true);
    expect(audio?.pause).toHaveBeenCalledOnce();
    expect(audio?.paused).toBe(true);

    setMusicPageHidden(false);
    await Promise.resolve();
    expect(audioInstances).toHaveLength(1);
    expect(audio?.play).toHaveBeenCalledTimes(2);
    expect(audio?.paused).toBe(false);
  });

  it("does not turn failed or explicitly stopped playback into visibility autoplay", async () => {
    installAudio();
    playResult = "reject";
    const { setMusicPageHidden, startMusicFromUserGesture, stopMusic } = await import("./music");
    await startMusicFromUserGesture();
    const failedAudio = audioInstances[0];

    setMusicPageHidden(true);
    setMusicPageHidden(false);
    await Promise.resolve();
    expect(failedAudio?.play).toHaveBeenCalledOnce();

    playResult = "resolve";
    await startMusicFromUserGesture();
    stopMusic();
    setMusicPageHidden(true);
    setMusicPageHidden(false);
    await Promise.resolve();
    expect(failedAudio?.play).toHaveBeenCalledTimes(2);
  });

  it("does not resume visibility-paused music while sound is muted", async () => {
    installAudio();
    const { setMusicMuted, setMusicPageHidden, startMusicFromUserGesture } = await import("./music");
    await startMusicFromUserGesture();
    const audio = audioInstances[0];

    setMusicPageHidden(true);
    setMusicMuted(true);
    setMusicPageHidden(false);
    await Promise.resolve();

    expect(audio?.play).toHaveBeenCalledOnce();
    expect(audio?.paused).toBe(true);
  });

  it("never resumes a visibility-paused player after disposal or track replacement", async () => {
    installAudio();
    const {
      configureMusic,
      disposeMusic,
      setMusicPageHidden,
      startMusicFromUserGesture,
    } = await import("./music");
    await startMusicFromUserGesture();
    const disposedAudio = audioInstances[0];
    setMusicPageHidden(true);
    disposeMusic();
    setMusicPageHidden(false);
    await Promise.resolve();
    expect(disposedAudio?.play).toHaveBeenCalledOnce();

    await startMusicFromUserGesture();
    const replacedAudio = audioInstances[1];
    setMusicPageHidden(true);
    configureMusic({ trackUrl: "/music/replacement.ogg" });
    setMusicPageHidden(false);
    await Promise.resolve();

    expect(replacedAudio?.play).toHaveBeenCalledOnce();
    expect(audioInstances).toHaveLength(2);
  });

  it("keeps visibility changes harmless when media accessors or methods throw", async () => {
    installAudio();
    const { setMusicPageHidden, startMusicFromUserGesture } = await import("./music");
    await startMusicFromUserGesture();
    const audio = audioInstances[0];
    expect(audio).toBeDefined();
    if (!audio) return;

    Object.defineProperty(audio, "paused", {
      configurable: true,
      get: () => { throw new DOMException("Detached", "InvalidStateError"); },
    });
    audio.pause.mockImplementationOnce(() => {
      throw new DOMException("Detached", "InvalidStateError");
    });
    expect(() => setMusicPageHidden(true)).not.toThrow();

    audio.play.mockImplementationOnce(() => {
      throw new DOMException("Blocked", "NotAllowedError");
    });
    expect(() => setMusicPageHidden(false)).not.toThrow();
    await Promise.resolve();
  });
});
