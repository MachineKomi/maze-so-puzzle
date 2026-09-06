import { activateAudioFromUserGesture, connectMusicElement, disconnectAudio, setAudioMusicLevel, setAudioMuted, setAudioPageHidden, DEFAULT_MUSIC_VOLUME } from "./audioMix";

export const MUSIC_FADE_MS = 400;
export const MUSIC_START_TIMEOUT_MS = 6000;
export type MusicPlaybackPhase = "idle" | "loading" | "playing" | "blocked" | "failed" | "paused";
export interface MusicPlaybackState { requestedUrl: string; playingUrl?: string; phase: MusicPlaybackPhase }
interface Lane {
  audio: HTMLAudioElement;
  url: string;
  connection?: ReturnType<typeof connectMusicElement>;
  confirmed: boolean;
  released: boolean;
  attempt?: Promise<boolean>;
  attemptId?: number;
  cancel?: () => void;
  disconnectState?: () => void;
  disconnectMedia?: () => void;
  expectedPause?: boolean;
}

/** Two streamed media resources; no PCM buffers, playlist download or frame loop. */
export function createMusicPlayback(initialUrl: string) {
  let requested = initialUrl, prepared: string | undefined;
  let current: Lane | undefined, standby: Lane | undefined;
  let volume = DEFAULT_MUSIC_VOLUME, muted = false, hidden = false;
  let generation = 0, resumeOnVisible = false, requestedPlayback = false;
  let phase: MusicPlaybackPhase = "idle";
  let fade: { timer: ReturnType<typeof setTimeout>; finish: (ready: boolean) => void; promise: Promise<boolean> } | undefined;
  const publish = (next: MusicPlaybackPhase) => { phase = next; };
  const snapshot = (): MusicPlaybackState => ({ requestedUrl: requested, playingUrl: current?.confirmed ? current.url : undefined, phase });
  const pause = (lane: Lane) => { lane.expectedPause = true; try { lane.audio.pause(); } catch { /* Detached media never blocks play. */ } };
  const weight = (lane: Lane, value: number, seconds = 0, at?: number) => {
    const connection = lane.connection;
    if (connection) {
      const param = connection.envelope.gain, now = at ?? connection.context.currentTime;
      try {
        if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(now);
        else { const previous = param.value; param.cancelScheduledValues(now); param.setValueAtTime(previous, now); }
        if (seconds) param.linearRampToValueAtTime(value, now + seconds);
        else param.setValueAtTime(value, now);
      } catch { /* Closed graph is recovered on the next start. */ }
    } else { try { lane.audio.volume = value * volume; } catch { /* Best-effort legacy path. */ } }
  };
  const crossfade = (from: Lane, to: Lane, seconds: number) => {
    const at = from.connection?.context.currentTime;
    // One timeline, decreasing lane first: a render-queue split can underlap,
    // but must not briefly add a raised lane to an undiminished outgoing lane.
    weight(from, 0, seconds, at); weight(to, 1, seconds, at);
  };
  const release = (lane: Lane | undefined) => {
    if (!lane || lane.released) return;
    lane.released = true; lane.cancel?.(); lane.disconnectState?.(); lane.disconnectMedia?.(); pause(lane);
    disconnectAudio(lane.connection?.source); disconnectAudio(lane.connection?.envelope);
    try { lane.audio.removeAttribute("src"); lane.audio.load(); } catch { /* Detached media. */ }
  };
  const cancelFade = () => {
    if (!fade) return;
    clearTimeout(fade.timer); fade.finish(false); fade = undefined;
  };
  const clearStandby = () => {
    const wasFading = !!fade;
    cancelFade(); release(standby); standby = undefined;
    // Disconnect the failed/obsolete lane before gently restoring the survivor.
    if (wasFading && current) weight(current, 1, .02);
  };
  const retargetFade = () => {
    if (!fade || !current || !standby) return;
    clearTimeout(fade.timer); fade.finish(false);
    const obsolete = standby;
    crossfade(obsolete, current, .02);
    let finish!: (ready: boolean) => void;
    const promise = new Promise<boolean>(resolve => { finish = resolve; });
    const timer = setTimeout(() => {
      release(obsolete); if (standby === obsolete) standby = undefined;
      fade = undefined; finish(true);
    }, 20);
    fade = { timer, finish, promise };
  };
  const settleSilent = () => {
    // Hidden/mute output is already zero: retain a confirmed authoritative
    // successor, never resume the previous screen's outgoing tail.
    if (fade && standby?.confirmed && standby.url === requested) {
      cancelFade(); release(current); current = standby; standby = undefined; weight(current, 1);
    } else clearStandby();
  };
  const create = (url: string, preload: boolean): Lane | undefined => {
    if (typeof Audio === "undefined") return;
    try {
      // Set preload before src: even an aborted obsolete candidate must not
      // accidentally start a default-auto request in a new Audio(url) constructor.
      const audio = new Audio();
      audio.preload = preload ? "auto" : "none"; audio.loop = true;
      audio.volume = volume; audio.muted = muted; audio.setAttribute("playsinline", "");
      audio.src = url;
      const lane: Lane = { audio, url, confirmed: false, released: false };
      const interrupted = () => {
        if (lane.released || lane.expectedPause || hidden || current !== lane || !lane.confirmed || !isPaused(lane)) return;
        generation++; clearStandby(); publish("paused");
      };
      const failed = () => {
        if (current === lane && lane.confirmed && !lane.released) { lane.confirmed = false; publish("failed"); }
      };
      audio.addEventListener("pause", interrupted); audio.addEventListener("error", failed);
      lane.disconnectMedia = () => { audio.removeEventListener("pause", interrupted); audio.removeEventListener("error", failed); };
      if (preload) audio.load();
      return lane;
    } catch { return; }
  };
  const prepare = () => {
    if (hidden || muted || !current?.confirmed || current.url !== requested || fade || standby?.attempt) return;
    if (!prepared || prepared === current.url) { clearStandby(); return; }
    if (standby?.url === prepared) return;
    clearStandby(); standby = create(prepared, true);
  };
  const isPaused = (lane: Lane) => { try { return lane.audio.paused; } catch { return !lane.confirmed; } };

  const play = (lane: Lane, token: number): Promise<boolean> => {
    if (lane.attempt) return lane.attempt;
    const attemptId = (lane.attemptId ?? 0) + 1;
    lane.attemptId = attemptId;
    let finish!: (ready: boolean) => void;
    const settled = new Promise<boolean>(resolve => { finish = resolve; });
    let done = false;
    const complete = (ready: boolean, failure?: MusicPlaybackPhase) => {
      if (done) return;
      done = true; clearTimeout(timeout); lane.audio.removeEventListener("error", mediaError); lane.cancel = undefined;
      if (!ready) { pause(lane); if (token === generation && !lane.released && failure) publish(failure); }
      finish(ready);
    };
    const timeout = setTimeout(() => complete(false, "failed"), MUSIC_START_TIMEOUT_MS);
    const mediaError = () => complete(false, "failed");
    lane.audio.addEventListener("error", mediaError);
    lane.cancel = () => complete(false);
    lane.attempt = settled.finally(() => { lane.attempt = undefined; });
    try {
      lane.connection ??= connectMusicElement(lane.audio, current && current !== lane ? 0 : 1);
      if (lane.connection && !lane.disconnectState) {
        const context = lane.connection.context;
        const interrupted = () => {
          if (lane.released || hidden || context.state === "running") return;
          generation++; current?.cancel?.(); settleSilent();
          if (current) pause(current); publish("paused");
        };
        context.addEventListener("statechange", interrupted);
        lane.disconnectState = () => context.removeEventListener("statechange", interrupted);
      }
      lane.audio.volume = lane.connection ? 1 : volume;
      lane.audio.muted = muted || (!lane.connection && !!current && current !== lane);
      const activation = lane.connection ? activateAudioFromUserGesture() : Promise.resolve(true);
      // Do not await activation first: real click/key activation expires.
      lane.expectedPause = false;
      const playback = lane.audio.play();
      void Promise.all([activation, playback]).then(([ready]) => {
        if (done || lane.released || token !== generation || hidden) {
          if (lane.attemptId === attemptId) pause(lane);
          complete(false); return;
        }
        complete(ready, ready ? undefined : "blocked");
      }, error => complete(false, error?.name === "NotAllowedError" ? "blocked" : "failed"));
    } catch {
      complete(false, "failed"); release(lane);
      if (current === lane) current = undefined;
      if (standby === lane) standby = undefined;
    }
    return lane.attempt;
  };

  const start = async (): Promise<boolean> => {
    requestedPlayback = true;
    if (hidden) { resumeOnVisible ||= !!current?.confirmed; publish("paused"); return false; }
    const token = generation;
    if (fade) { await fade.promise; if (token !== generation || hidden) return false; }
    if (current?.connection?.context.state === "closed") { clearStandby(); release(current); current = undefined; }
    if (current?.url === requested && current.confirmed && !isPaused(current)
      && (!current.connection || current.connection.context.state === "running")) { publish("playing"); prepare(); return true; }
    if (current && !current.confirmed && current.url !== requested) { release(current); current = undefined; }
    let target = current?.url === requested ? current : standby?.url === requested ? standby : undefined;
    if (!target) {
      clearStandby(); target = create(requested, false);
      if (!target) { publish("failed"); return false; }
      if (!current) current = target; else standby = target;
    }
    publish("loading");
    if (!await play(target, token)) return false;
    if (token !== generation || hidden || target.released) return false;
    if (target.confirmed && fade) return fade.promise;
    target.confirmed = true;
    const outgoing = current;
    if (!outgoing || outgoing === target || !outgoing.confirmed) {
      if (outgoing !== target) release(outgoing);
      current = target; if (standby === target) standby = undefined;
      target.audio.muted = muted; weight(target, 1); publish("playing"); prepare(); return true;
    }
    if (!outgoing.connection || !target.connection || muted) {
      // No graph: confirmed-playback cutover, never pretend element-volume
      // fades are reliable on every iPad. Normal supported path is Web Audio.
      release(outgoing); current = target; standby = undefined; target.audio.muted = muted; weight(target, 1);
      publish("playing"); prepare(); return true;
    }
    let finish!: (ready: boolean) => void;
    target.audio.muted = muted;
    const promise = new Promise<boolean>(resolve => { finish = resolve; });
    // Complementary linear weights: two songs never double the Music bus gain.
    crossfade(outgoing, target, MUSIC_FADE_MS / 1000);
    const recover = () => {
      if (standby !== target || !fade) return;
      clearStandby(); publish("failed");
    };
    target.audio.addEventListener("waiting", recover);
    target.audio.addEventListener("error", recover);
    const removeListeners = () => {
      target.audio.removeEventListener("waiting", recover); target.audio.removeEventListener("error", recover);
    };
    const timer = setTimeout(() => {
      removeListeners(); fade = undefined;
      release(outgoing); current = target; standby = undefined;
      publish(current.url === requested ? "playing" : "loading"); finish(true); prepare();
    }, MUSIC_FADE_MS);
    fade = { timer, finish: ready => { removeListeners(); finish(ready); }, promise };
    return promise;
  };

  return {
    snapshot,
    configure(url: string, nextVolume = volume) {
      volume = Number.isFinite(nextVolume) ? Math.min(1, Math.max(0, nextVolume)) : DEFAULT_MUSIC_VOLUME;
      setAudioMusicLevel(volume);
      if (url !== requested) {
        requested = url; generation++; resumeOnVisible = false;
        if (fade) retargetFade();
        else {
          current?.cancel?.();
          if (standby?.url !== url) clearStandby();
          else standby.cancel?.();
        }
        publish("idle");
      }
      for (const lane of [current, standby]) if (lane && !lane.connection) lane.audio.volume = volume;
    },
    prepare(url?: string) { prepared = url; prepare(); },
    start,
    setMuted(value: boolean) {
      setAudioMuted(value);
      if (muted === value) return;
      muted = value;
      for (const lane of [current, standby]) if (lane) lane.audio.muted = value;
      if (value) { generation++; current?.cancel?.(); settleSilent(); }
    },
    setHidden(value: boolean) {
      setAudioPageHidden(value);
      if (hidden === value) return;
      hidden = value;
      if (value) {
        settleSilent();
        resumeOnVisible = !!current?.confirmed && !isPaused(current) && current.url === requested;
        generation++; current?.cancel?.(); clearStandby();
        if (current) pause(current); publish("paused");
      } else if (resumeOnVisible && !muted) { resumeOnVisible = false; void start(); }
    },
    recover() { if (requestedPlayback && !hidden && !muted && (phase === "blocked" || phase === "paused")) void start(); },
    stop() {
      requestedPlayback = false;
      generation++; resumeOnVisible = false; current?.cancel?.(); clearStandby();
      if (current) { pause(current); current.confirmed = false; try { current.audio.currentTime = 0; } catch { /* No metadata yet. */ } }
      publish("idle");
    },
    dispose() {
      requestedPlayback = false;
      generation++; resumeOnVisible = false; clearStandby(); release(current); current = undefined; prepared = undefined;
      publish("idle");
    },
  };
}
