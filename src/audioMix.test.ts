import { DEFAULT_MUSIC_VOLUME, DEFAULT_SFX_VOLUME } from "./audioCalibration";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { contexts, installAudioContext, resetAudioFakes } from "./test/audioFakes";

const players: FakeAudio[] = [];
class FakeAudio extends EventTarget {
  loop = false; preload = ""; volume = 1; muted = false; paused = true; currentTime = 12;
  readonly play = vi.fn(async () => { this.paused = false; });
  readonly pause = vi.fn(() => { this.paused = true; });
  readonly load = vi.fn(); readonly setAttribute = vi.fn();
  readonly removeAttribute = vi.fn((name: string) => { if (name === "src") this.src = ""; });
  constructor(public src = "") { super(); players.push(this); }
}
beforeEach(() => { resetAudioFakes(); players.length = 0; vi.resetModules(); installAudioContext(); vi.stubGlobal("Audio", FakeAudio); });
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); vi.useRealTimers(); });

describe("independent device audio mix", () => {
  it("uses calibrated defaults and real SFX headroom through the existing graph", async () => {
    const mix = await import("./audioMix"), calibration = await import("./audioCalibration"), music = await import("./music");
    await music.startMusicFromUserGesture();
    const ctx = contexts[0]!, audio = players[0]!;
    expect(ctx.gains.slice(0, 2).map(node => node.gain.value)).toEqual([DEFAULT_MUSIC_VOLUME, DEFAULT_SFX_VOLUME]);
    mix.setAudioLevels({musicVolume:calibration.musicGain(1),sfxVolume:calibration.sfxGain(1)});
    music.configureMusic({volume:calibration.musicGain(1)});
    expect(ctx.gains.slice(0, 2).map(node => node.gain.value)).toEqual([1, 4/3]);
    expect(audio.volume).toBe(1); expect(audio.currentTime).toBe(12);
    expect(audio.play).toHaveBeenCalledOnce(); expect(ctx.sources).toHaveLength(1);
    mix.setAudioMuted(true); mix.setAudioLevels({musicVolume:.1,sfxVolume:1.2});
    expect(ctx.gains.slice(0, 2).map(node => node.gain.value)).toEqual([0,0]);
    mix.setAudioMuted(false);
    expect(ctx.gains.slice(0, 2).map(node => node.gain.value)).toEqual([.1,1.2]);
    mix.setAudioLevels({musicVolume:9,sfxVolume:9});
    expect(ctx.gains.slice(0, 2).map(node => node.gain.value)).toEqual([1,4/3]);
    mix.setAudioLevels({musicVolume:NaN,sfxVolume:NaN});
    expect(ctx.gains.slice(0, 2).map(node => node.gain.value)).toEqual([DEFAULT_MUSIC_VOLUME, DEFAULT_SFX_VOLUME]);
  });
  it("does not allocate or play while preferences and mute are initialized", async () => {
    const mix = await import("./audioMix");
    mix.setAudioLevels({ musicVolume: .4, sfxVolume: .6 }); mix.setAudioMuted(true); mix.setAudioPageHidden(true);
    expect(contexts).toHaveLength(0); expect(players).toHaveLength(0);
    expect(await mix.activateAudioFromUserGesture()).toBe(false);
  });
  it("routes streamed music once at unity media volume through the selected gain", async () => {
    const music = await import("./music");
    expect(await music.startMusicFromUserGesture()).toBe(true);
    const ctx = contexts[0]!, audio = players[0]!;
    expect(ctx.sources).toHaveLength(1); expect(ctx.gains).toHaveLength(3);
    expect(ctx.sources[0]!.connect).toHaveBeenCalledWith(ctx.gains[2]);
    expect(ctx.gains[2]!.connect).toHaveBeenCalledWith(ctx.gains[0]);
    expect(audio.volume).toBe(1); expect(ctx.gains[0]!.gain.value).toBe(DEFAULT_MUSIC_VOLUME);
    music.configureMusic({ volume: .08 });
    expect(ctx.gains[0]!.gain.value).toBe(.08); expect(audio.volume).toBe(1);
    expect(audio.currentTime).toBe(12); expect(audio.play).toHaveBeenCalledTimes(1);
    await music.startMusicFromUserGesture(); expect(ctx.sources).toHaveLength(1);
  });
  it("retains the old source until confirmed handover; app disposal closes the graph", async () => {
    vi.useFakeTimers();
    const music = await import("./music"), mix = await import("./audioMix");
    await music.startMusicFromUserGesture(); const ctx = contexts[0]!, old = players[0]!;
    music.configureMusic({ trackUrl: "/next.mp3" });
    expect(ctx.sources[0]!.disconnect).not.toHaveBeenCalled(); expect(old.src).not.toBe(""); expect(ctx.close).not.toHaveBeenCalled();
    const transition = music.startMusicFromUserGesture(); expect(contexts).toHaveLength(1); expect(ctx.sources).toHaveLength(2);
    await vi.advanceTimersByTimeAsync(400); await transition;
    expect(ctx.sources[0]!.disconnect).toHaveBeenCalledOnce(); expect(ctx.gains[2]!.disconnect).toHaveBeenCalledOnce(); expect(old.src).toBe("");
    music.disposeMusic(); mix.disposeAudioMix(); expect(ctx.close).toHaveBeenCalledOnce();
    await music.startMusicFromUserGesture(); expect(contexts).toHaveLength(2); expect(players).toHaveLength(3);
  });
  it("recreates the media element if its one-shot graph has closed", async () => {
    const music = await import("./music"); await music.startMusicFromUserGesture();
    await contexts[0]!.close(); expect(await music.startMusicFromUserGesture()).toBe(true);
    expect(players).toHaveLength(2); expect(contexts).toHaveLength(2); expect(players[0]!.src).toBe("");
  });
  it("discards an element diverted into a failed connection instead of claiming direct fallback", async () => {
    const mix = await import("./audioMix"), music = await import("./music");
    await mix.activateAudioFromUserGesture();
    const ctx = contexts[0]!;
    const create = ctx.createMediaElementSource.bind(ctx);
    vi.spyOn(ctx, "createMediaElementSource").mockImplementation(audio => {
      const source = create(audio); source.connect.mockImplementationOnce(() => { throw Error("device detached"); }); return source;
    });
    expect(await music.startMusicFromUserGesture()).toBe(false);
    expect(players[0]!.src).toBe(""); expect(players[0]!.play).not.toHaveBeenCalled();
    expect(ctx.sources[0]!.disconnect).toHaveBeenCalledOnce();
    vi.restoreAllMocks(); expect(await music.startMusicFromUserGesture()).toBe(true); expect(players).toHaveLength(2);
  });
  it("uses media volume exactly once only when WebAudio is unavailable", async () => {
    vi.stubGlobal("window", {});
    const music = await import("./music"); music.configureMusic({ volume: .12 });
    expect(await music.startMusicFromUserGesture()).toBe(true); expect(players[0]!.volume).toBe(.12); expect(contexts).toHaveLength(0);
  });
  it("starts media play and context resume synchronously before either settles", async () => {
    const mix = await import("./audioMix"), music = await import("./music");
    await mix.activateAudioFromUserGesture(); const ctx = contexts[0]!; ctx.setState("suspended");
    let resolve!: () => void; ctx.resume.mockImplementationOnce(() => new Promise<void>(r => { resolve = r; }));
    const pending = music.startMusicFromUserGesture(); expect(players[0]!.play).toHaveBeenCalledOnce();
    ctx.setState("running"); resolve(); expect(await pending).toBe(true);
  });
  it("keeps music available when media source creation is unsupported before diversion", async () => {
    const mix = await import("./audioMix"), music = await import("./music");
    await mix.activateAudioFromUserGesture();
    vi.spyOn(contexts[0]!, "createMediaElementSource").mockImplementation(() => { throw new DOMException("unsupported", "NotSupportedError"); });
    music.configureMusic({volume: .15}); expect(await music.startMusicFromUserGesture()).toBe(true);
    expect(players[0]!.volume).toBe(.15); expect(contexts[0]!.sources).toHaveLength(0);
  });
  it("retries only the interrupted current song on a gesture after rejected foreground resume", async () => {
    const music = await import("./music"); await music.startMusicFromUserGesture(); const ctx = contexts[0]!, audio = players[0]!;
    music.setMusicPageHidden(true); ctx.setState("suspended"); ctx.resume.mockRejectedValueOnce(Error("gesture required"));
    music.setMusicPageHidden(false); await new Promise(r => setTimeout(r, 0)); expect(audio.paused).toBe(true);
    music.recoverMusicFromUserGesture(); await new Promise(r => setTimeout(r, 0)); expect(audio.paused).toBe(false);
    expect(audio.currentTime).toBe(12); expect(players).toHaveLength(1);
    music.stopMusic(); const count = audio.play.mock.calls.length; music.recoverMusicFromUserGesture();
    expect(audio.play.mock.calls.length).toBe(count);
  });
  it("drops incidental effects when suspended or activation is denied, with no delayed burst", async () => {
    const mix = await import("./audioMix"), sound = await import("./sound");
    sound.playSound("win", false); expect(contexts).toHaveLength(0);
    await mix.activateAudioFromUserGesture(); const ctx = contexts[0]!; ctx.setState("suspended");
    ctx.resume.mockRejectedValueOnce(Error("denied")); sound.playSound("win", false);
    expect(await mix.activateAudioFromUserGesture()).toBe(false); expect(ctx.oscillators).toHaveLength(0);
    await mix.activateAudioFromUserGesture(); expect(ctx.oscillators).toHaveLength(0);
    sound.playSound("step", false); expect(ctx.oscillators).toHaveLength(1);
  });
  it.each(["mute", "hidden", "zero", "suspend"] as const)("cancels all active and future cue notes on %s", async gate => {
    const mix = await import("./audioMix"), sound = await import("./sound");
    await mix.activateAudioFromUserGesture(); const ctx = contexts[0]!;
    sound.playSound("doorOpen", false); expect(ctx.oscillators.length).toBeGreaterThan(1);
    if (gate === "mute") mix.setAudioMuted(true);
    if (gate === "hidden") mix.setAudioPageHidden(true);
    if (gate === "zero") mix.setAudioLevels({ musicVolume: .22, sfxVolume: 0 });
    if (gate === "suspend") ctx.setState("suspended");
    const count = ctx.oscillators.length;
    expect(ctx.oscillators.every(n => n.stop.mock.calls.length === 2 && n.disconnect.mock.calls.length === 1)).toBe(true);
    sound.playSound("win", false); expect(ctx.oscillators).toHaveLength(count);
    mix.setAudioMuted(false); mix.setAudioPageHidden(false); mix.setAudioLevels({ musicVolume: .1, sfxVolume: .5 });
    await mix.activateAudioFromUserGesture(); expect(ctx.oscillators).toHaveLength(count);
    sound.playSound("step", false); expect(ctx.oscillators).toHaveLength(count + 1);
  });
  it("applies exact zero immediately and preserves chosen channel levels through master mute", async () => {
    const mix = await import("./audioMix"); await mix.activateAudioFromUserGesture(); const ctx = contexts[0]!;
    mix.setAudioLevels({ musicVolume: 0, sfxVolume: .4 });
    expect(ctx.gains[0]!.gain.setValueAtTime).toHaveBeenLastCalledWith(0, 4);
    mix.setAudioMuted(true); mix.setAudioLevels({ musicVolume: .1, sfxVolume: .8 });
    expect(ctx.gains.map(n => n.gain.value)).toEqual([0, 0]);
    mix.setAudioMuted(false); expect(ctx.gains.map(n => n.gain.value)).toEqual([.1, .8]);
    expect(ctx.gains[1]!.gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(.8, 4.02);
  });
  it("drops an aborted or invalidated explicit Test sound request but allows slow activation", async () => {
    vi.useFakeTimers(); const mix = await import("./audioMix"), sound = await import("./sound");
    await mix.activateAudioFromUserGesture(); const ctx = contexts[0]!;
    for (const invalidation of ["abort", "mute"] as const) {
      ctx.setState("suspended"); let resolve!: () => void;
      ctx.resume.mockImplementationOnce(() => new Promise<void>(r => { resolve = r; }));
      const request = new AbortController();
      const pending = sound.testSoundFromUserGesture(false, request.signal);
      if (invalidation === "abort") request.abort(); else mix.setAudioMuted(true);
      ctx.setState("running"); resolve(); await pending; expect(ctx.oscillators).toHaveLength(0);
      mix.setAudioMuted(false);
    }
    await sound.testSoundFromUserGesture(false); expect(ctx.oscillators.length).toBeGreaterThan(0);
  });
});
