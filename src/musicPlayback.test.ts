import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { contexts, installAudioContext, resetAudioFakes } from "./test/audioFakes";

const media: Media[] = [];
class Media extends EventTarget {
  src = ""; loop = false; preload = ""; muted = false; volume = 1; currentTime = 17; paused = true;
  readonly play = vi.fn(async () => { this.paused = false; });
  readonly pause = vi.fn(() => { this.paused = true; });
  readonly load = vi.fn(); readonly setAttribute = vi.fn();
  readonly removeAttribute = vi.fn((name: string) => { if (name === "src") this.src = ""; });
  constructor() { super(); media.push(this); }
}
const deferred = () => { let resolve!: () => void, reject!: (error: Error) => void;
  const promise = new Promise<void>((r, j) => { resolve = r; reject = j; }); return { promise, resolve, reject }; };
const flush = async () => { await vi.advanceTimersByTimeAsync(0); };
beforeEach(() => {
  vi.useFakeTimers(); vi.resetModules(); resetAudioFakes(); installAudioContext();
  media.length = 0; vi.stubGlobal("Audio", Media);
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });
async function create() { return (await import("./musicPlayback")).createMusicPlayback("/a.mp3"); }
const live = () => media.filter(player => player.src);

describe("bounded streamed music readiness", () => {
  it("does not speculate before playback, reserves exactly one source, and reuses it", async () => {
    const player = await create(); player.prepare("/b.mp3"); expect(media).toHaveLength(0);
    await player.start(); expect(live().map(m => m.src)).toEqual(["/a.mp3", "/b.mp3"]);
    expect(media[1]!.preload).toBe("auto"); expect(media[1]!.play).not.toHaveBeenCalled();
    player.prepare("/b.mp3"); expect(media).toHaveLength(2);
    player.configure("/b.mp3"); const transition = player.start(); expect(media).toHaveLength(2);
    await vi.advanceTimersByTimeAsync(400); await transition; expect(player.snapshot().playingUrl).toBe("/b.mp3");
    expect(live()).toHaveLength(1); player.dispose(); expect(live()).toHaveLength(0);
  });

  it("keeps current music alive through a cold delayed play and complementary fade", async () => {
    const player = await create(); await player.start(); const a = media[0]!;
    player.prepare("/b.mp3"); const b = media[1]!, wait = deferred(); b.play.mockImplementationOnce(() => wait.promise);
    player.configure("/b.mp3"); const transition = player.start();
    await vi.advanceTimersByTimeAsync(1800);
    expect(a.pause).not.toHaveBeenCalled(); expect(a.src).toBe("/a.mp3");
    expect(contexts[0]!.gains[3]!.gain.value).toBe(0);
    wait.resolve(); await flush();
    const [outgoing, incoming] = contexts[0]!.gains.slice(2);
    expect(outgoing!.gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(0, 4.4);
    expect(incoming!.gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(1, 4.4);
    expect(a.pause).not.toHaveBeenCalled(); await vi.advanceTimersByTimeAsync(400); expect(await transition).toBe(true);
    expect(a.src).toBe(""); expect(contexts[0]!.sources[0]!.disconnect).toHaveBeenCalledOnce();
    expect(outgoing!.disconnect).toHaveBeenCalledOnce(); player.dispose();
  });

  it("deduplicates simultaneous starts, keeps looping, and never seeks a current song", async () => {
    const player = await create(); await Promise.all([player.start(), player.start(), player.start()]);
    expect(media[0]!.play).toHaveBeenCalledOnce(); expect(media[0]!.currentTime).toBe(17); expect(media[0]!.loop).toBe(true);
    player.configure("/a.mp3", .2); await player.start(); expect(media[0]!.play).toHaveBeenCalledOnce();
    player.dispose();
  });

  it("cancels loading B for C without a third live resource or late B playback", async () => {
    const player = await create(); await player.start(); player.prepare("/b.mp3");
    const wait = deferred(), b = media[1]!; b.play.mockImplementationOnce(() => wait.promise);
    player.configure("/b.mp3"); const old = player.start(); player.configure("/c.mp3");
    const latest = player.start(); expect(live().length).toBeLessThanOrEqual(2);
    wait.resolve(); expect(await old).toBe(false); await vi.advanceTimersByTimeAsync(400); await latest;
    expect(b.src).toBe(""); expect(player.snapshot().playingUrl).toBe("/c.mp3"); player.dispose();
  });

  it("reverses obsolete fading B over20ms before C occupies the second lane", async () => {
    const player = await create(); await player.start(); player.configure("/b.mp3"); const b = player.start();
    await vi.advanceTimersByTimeAsync(100); player.configure("/c.mp3"); const c = player.start();
    expect(live().map(m => m.src)).toEqual(["/a.mp3", "/b.mp3"]);
    await vi.advanceTimersByTimeAsync(20); expect(await b).toBe(false);
    expect(live().map(m => m.src)).toEqual(["/a.mp3", "/c.mp3"]);
    await vi.advanceTimersByTimeAsync(400); await c; expect(player.snapshot().playingUrl).toBe("/c.mp3"); player.dispose();
  });

  it("uses one clock sample and decreases before increasing both fade directions", async () => {
    const player = await create(); await player.start();
    const context = contexts[0]!;
    let clock = 4;
    Object.defineProperty(context, "currentTime", { configurable: true, get: () => (clock += 128 / 48000) });
    player.configure("/b.mp3"); const transition = player.start(); await flush();
    const [a, b] = context.gains.slice(2);
    const end = (gain: typeof a) => gain!.gain.linearRampToValueAtTime.mock.lastCall![1];
    const order = (gain: typeof a) => gain!.gain.linearRampToValueAtTime.mock.invocationCallOrder.at(-1)!;
    expect(end(a)).toBe(end(b)); expect(order(a)).toBeLessThan(order(b));
    player.configure("/c.mp3");
    expect(end(a)).toBe(end(b)); expect(order(b)).toBeLessThan(order(a));
    await vi.advanceTimersByTimeAsync(20); expect(await transition).toBe(false); player.dispose();
  });

  it("disconnects a failed incoming lane before a20ms survivor restore, without a unity step", async () => {
    const player = await create(); await player.start(); player.configure("/b.mp3");
    const transition = player.start(); await flush();
    const context = contexts[0]!, outgoing = context.gains[2]!, incoming = context.gains[3]!;
    outgoing.gain.setValueAtTime.mockClear(); outgoing.gain.linearRampToValueAtTime.mockClear();
    media[1]!.dispatchEvent(new Event("waiting"));
    expect(outgoing.gain.setValueAtTime).not.toHaveBeenCalled();
    expect(outgoing.gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(1, 4.02);
    expect(incoming.disconnect.mock.invocationCallOrder[0]).toBeLessThan(outgoing.gain.linearRampToValueAtTime.mock.invocationCallOrder[0]!);
    expect(await transition).toBe(false); player.dispose();
  });

  it.each(["waiting", "error"])("restores outgoing if incoming emits %s during fade", async event => {
    const player = await create(); await player.start(); player.configure("/b.mp3"); const transition = player.start(); await flush();
    media[1]!.dispatchEvent(new Event(event)); await vi.advanceTimersByTimeAsync(1000);
    expect(live().map(m => m.src)).toEqual(["/a.mp3"]); expect(media[0]!.paused).toBe(false);
    expect(player.snapshot().phase).toBe("failed"); player.dispose();
    expect(await transition).toBe(false);
  });

  it("does not let a timed-out promise pause a newer retry on the same lane", async () => {
    const player = await create(), wait = deferred();
    const first = player.start();
    await first; player.prepare("/b.mp3"); const b = media[1]!; b.play.mockImplementationOnce(() => wait.promise);
    player.configure("/b.mp3"); const timed = player.start(); await vi.advanceTimersByTimeAsync(6000);
    expect(await timed).toBe(false); expect(media[0]!.paused).toBe(false);
    const retry = player.start(); await vi.advanceTimersByTimeAsync(400); await retry; const pauses = b.pause.mock.calls.length;
    wait.resolve(); await flush(); expect(b.pause).toHaveBeenCalledTimes(pauses);
    expect(player.snapshot().playingUrl).toBe("/b.mp3"); player.dispose();
  });

  it("recovers an autoplay-rejected desired track only on an explicit recovery", async () => {
    const player = await create(); await player.start(); player.prepare("/b.mp3"); const b = media[1]!;
    b.play.mockRejectedValueOnce(new DOMException("activation required", "NotAllowedError"));
    player.configure("/b.mp3"); expect(await player.start()).toBe(false);
    await vi.advanceTimersByTimeAsync(10000); expect(b.play).toHaveBeenCalledOnce();
    expect(player.snapshot().phase).toBe("blocked"); player.recover(); await flush();
    await vi.advanceTimersByTimeAsync(400); expect(player.snapshot().playingUrl).toBe("/b.mp3"); player.dispose();
  });

  it("keeps mute idempotent with position and gain choices intact; hidden stops speculation", async () => {
    const player = await create(); player.prepare("/b.mp3"); await player.start(); const a = media[0]!;
    player.setMuted(true); player.setMuted(true); await player.start();
    expect(a.play).toHaveBeenCalledOnce(); expect(a.paused).toBe(false); expect(a.currentTime).toBe(17);
    expect(live()).toHaveLength(1); player.setMuted(false); await player.start(); expect(live()).toHaveLength(2);
    player.setHidden(true); expect(live()).toHaveLength(1); expect(a.paused).toBe(true);
    player.setHidden(false); await flush(); expect(a.paused).toBe(false); expect(live()).toHaveLength(2); player.dispose();
  });

  it.each(["hidden", "mute", "suspend"])("settles only confirmed desired music on %s mid-fade", async gate => {
    const player = await create(); await player.start(); player.configure("/b.mp3"); const transition = player.start(); await flush();
    if (gate === "hidden") player.setHidden(true);
    if (gate === "mute") player.setMuted(true);
    if (gate === "suspend") contexts[0]!.setState("suspended");
    await vi.advanceTimersByTimeAsync(800); await transition;
    expect(live().map(m => m.src)).toEqual(["/b.mp3"]);
    if (gate === "hidden") player.setHidden(false);
    if (gate === "mute") player.setMuted(false);
    if (gate === "suspend") player.recover();
    await flush(); expect(player.snapshot().playingUrl).toBe("/b.mp3"); player.dispose();
  });

  it("stop/dispose cancel pending work and all listeners/resources without later revival", async () => {
    const player = await create(); await player.start(); player.prepare("/b.mp3");
    const wait = deferred(); media[1]!.play.mockImplementationOnce(() => wait.promise);
    player.configure("/b.mp3"); const attempt = player.start(); player.stop(); player.dispose();
    wait.resolve(); await attempt; await vi.advanceTimersByTimeAsync(10000); player.recover();
    expect(live()).toHaveLength(0); expect(vi.getTimerCount()).toBe(0);
    expect(contexts[0]!.sources.every(source => source.disconnect.mock.calls.length === 1)).toBe(true);
  });

  it.each([false, true])("starts only the requested hidden-page destination; blocked=%s", async blocked => {
    const player = await create(); await player.start(); player.setHidden(true);
    player.configure("/b.mp3"); expect(await player.start()).toBe(false);
    if (blocked) { contexts[0]!.setState("suspended"); contexts[0]!.resume.mockRejectedValueOnce(new DOMException("gesture", "NotAllowedError")); }
    player.setHidden(false);
    await vi.advanceTimersByTimeAsync(400);
    if (blocked) { player.recover(); await vi.advanceTimersByTimeAsync(400); }
    expect(player.snapshot().playingUrl).toBe("/b.mp3"); expect(live().map(m => m.src)).toEqual(["/b.mp3"]); player.dispose();
  });

  it("recovers an unexpected element pause even while the context is running", async () => {
    const player = await create(); await player.start(); const audio = media[0]!;
    audio.paused = true; audio.dispatchEvent(new Event("pause"));
    expect(player.snapshot().phase).toBe("paused"); player.recover(); await flush();
    expect(audio.paused).toBe(false); expect(audio.currentTime).toBe(17); player.dispose();
  });

  it.each(["reject", "timeout", "fade-error", "blocked"])("transport fallback is bounded for %s", async failure => {
    const { createCurrentMusicTransport } = await import("./musicTransport");
    const port = createCurrentMusicTransport(); port.setContext("title"); await port.startFromUserGesture();
    const story = media[1]!; port.setContext("story");
    if (failure === "reject") story.play.mockRejectedValueOnce(new DOMException("decode", "NotSupportedError"));
    if (failure === "timeout") story.play.mockImplementationOnce(() => new Promise<void>(() => {}));
    if (failure === "blocked") story.play.mockRejectedValueOnce(new DOMException("gesture", "NotAllowedError"));
    const transition = port.startFromUserGesture(); await flush();
    if (failure === "fade-error") { await vi.advanceTimersByTimeAsync(200); story.dispatchEvent(new Event("error")); }
    await vi.advanceTimersByTimeAsync(6800); const ready = await transition;
    expect(ready).toBe(failure !== "blocked");
    expect(port.getSnapshot().playback?.phase).toBe(failure === "blocked" ? "blocked" : "playing");
    // At most title + rejected story + one alternate + one prepared maze.
    expect(media.filter(m => m.play.mock.calls.length)).toHaveLength(failure === "blocked" ? 2 : 3);
    expect(live().length).toBeLessThanOrEqual(2); port.dispose();
  });

  it("does not accumulate live media or graph nodes across25 transitions", async () => {
    const player = await create(); await player.start();
    for (let i = 0; i < 25; i++) {
      player.configure(`/song-${i}.mp3`); const transition = player.start(); expect(live().length).toBeLessThanOrEqual(2);
      await vi.advanceTimersByTimeAsync(400); await transition;
      expect(contexts[0]!.sources.filter(source => !source.disconnect.mock.calls.length)).toHaveLength(1);
    }
    player.dispose(); expect(live()).toHaveLength(0); expect(vi.getTimerCount()).toBe(0);
  });

  it("never revives explicit stop/dispose through visibility or trusted recovery", async () => {
    const player = await create(); await player.start(); player.stop();
    const calls = media[0]!.play.mock.calls.length;
    player.setHidden(true); player.setHidden(false); player.recover(); await flush();
    expect(media[0]!.play).toHaveBeenCalledTimes(calls);
    player.dispose(); player.setHidden(true); player.setHidden(false); player.recover();
    expect(live()).toHaveLength(0);
  });

  it("reuses the actual Title→Story→Maze→Victory prediction chain without extra construction", async () => {
    const { createCurrentMusicTransport } = await import("./musicTransport");
    const { musicTrackById, MUSIC_POOLS } = await import("./musicCatalogue");
    const port = createCurrentMusicTransport(); port.setContext("title"); await port.startFromUserGesture();
    expect(live().map(m => m.src)).toContain(MUSIC_POOLS.story[0]!.url);
    for (const context of ["story", "maze", "victory"] as const) {
      const reserved = live().find(m => !m.play.mock.calls.length)!;
      expect(reserved).toBeDefined(); const count = media.length;
      const selection = port.setContext(context);
      expect(musicTrackById(selection.currentTrackId)?.url).toBe(reserved.src);
      const transition = port.startFromUserGesture(); expect(media).toHaveLength(count);
      await vi.advanceTimersByTimeAsync(400); expect(await transition).toBe(true);
      expect(reserved.play).toHaveBeenCalledOnce(); expect(live().length).toBeLessThanOrEqual(2);
    }
    port.dispose(); expect(live()).toHaveLength(0);
  });
});
