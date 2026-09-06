/** One lazy output graph. Music remains streamed, never whole-file decoded. */
import { audioLevel, sfxLevel, DEFAULT_MUSIC_VOLUME, DEFAULT_SFX_VOLUME } from "./audioCalibration";
export { audioLevel, DEFAULT_MUSIC_VOLUME, DEFAULT_SFX_VOLUME } from "./audioCalibration";
export interface AudioLevels { readonly musicVolume: number; readonly sfxVolume: number }

interface MixGraph { context: AudioContext; music: GainNode; sfx: GainNode; resume?: Promise<boolean> }
let graph: MixGraph | undefined;
let levels: AudioLevels = { musicVolume: DEFAULT_MUSIC_VOLUME, sfxVolume: DEFAULT_SFX_VOLUME };
let muted = false;
let hidden = false;
let epoch = 0;
const silenceListeners = new Set<() => void>();
export function onAudioSilence(listener: () => void): () => void {
  silenceListeners.add(listener);
  return () => { silenceListeners.delete(listener); };
}
function cancelCues(): void { epoch++; silenceListeners.forEach(listener => listener()); }
export function audioEpoch(): number { return epoch; }
export function disconnectAudio(node: AudioNode | undefined): void {
  try { node?.disconnect(); } catch { /* Detached device graph. */ }
}

function applyGain(node: GainNode, value: number, immediate: boolean): void {
  const param = node.gain, now = node.context.currentTime;
  try {
    if (typeof param.cancelAndHoldAtTime === "function") param.cancelAndHoldAtTime(now);
    else { const current = param.value; param.cancelScheduledValues(now); param.setValueAtTime(current, now); }
    if (immediate) param.setValueAtTime(value, now);
    else param.linearRampToValueAtTime(value, now + 0.02);
  } catch { try { param.value = value; } catch { /* Audio never blocks play. */ } }
}
function applyLevels(immediate = false): void {
  if (!graph || graph.context.state === "closed") return;
  const silent = muted || hidden;
  applyGain(graph.music, silent ? 0 : levels.musicVolume, immediate || silent || levels.musicVolume === 0);
  applyGain(graph.sfx, silent ? 0 : levels.sfxVolume, immediate || silent || levels.sfxVolume === 0);
}

function ensureGraph(): MixGraph | undefined {
  if (graph?.context.state === "closed") { cancelCues(); graph = undefined; }
  if (graph) return graph;
  if (typeof window === "undefined" || !window.AudioContext) return undefined;
  let context: AudioContext | undefined;
  let music: GainNode | undefined, sfx: GainNode | undefined;
  try {
    context = new window.AudioContext();
    music = context.createGain(); sfx = context.createGain();
    music.gain.value = muted || hidden ? 0 : levels.musicVolume;
    sfx.gain.value = muted || hidden ? 0 : levels.sfxVolume;
    music.connect(context.destination); sfx.connect(context.destination);
    const created: MixGraph = { context, music, sfx };
    graph = created;
    context.addEventListener("statechange", () => {
      if (graph === created && context!.state !== "running") cancelCues();
    });
    return created;
  } catch {
    disconnectAudio(music); disconnectAudio(sfx);
    try { void context?.close().catch(() => undefined); } catch { /* Unavailable device. */ }
    graph = undefined;
    return undefined;
  }
}

/** Call in a real activation handler. Rejected/suspended activation never queues SFX. */
export function activateAudioFromUserGesture(): Promise<boolean> {
  if (hidden) return Promise.resolve(false);
  const current = ensureGraph();
  if (!current) return Promise.resolve(false);
  if (current.context.state === "running") return Promise.resolve(true);
  if (current.resume) {
    // Retry native activation in a fresh gesture, retaining one JS recovery chain.
    try { void current.context.resume().catch(() => undefined); } catch { /* Later gesture may recover. */ }
    return current.resume;
  }
  try {
    current.resume = current.context.resume().then(
      () => graph === current && !hidden && current.context.state === "running",
      () => false,
    ).finally(() => { current.resume = undefined; });
    return current.resume;
  } catch { return Promise.resolve(false); }
}

/** Caller retains one connection per media element; track disposal is not graph disposal. */
export function connectMusicElement(audio: HTMLMediaElement): { context: AudioContext; source: MediaElementAudioSourceNode } | undefined {
  const current = ensureGraph();
  if (!current) return undefined; // Legacy media-only environment; volume is best-effort there.
  let source: MediaElementAudioSourceNode | undefined;
  try {
    try { source = current.context.createMediaElementSource(audio); }
    catch { return undefined; } // No source exists: direct media is a safe best-effort fallback.
    source.connect(current.music);
    audio.volume = 1; // Exactly one attenuation owner, including on iPad.
    return { context: current.context, source };
  } catch (error) { disconnectAudio(source); throw error; }
}

export function readyEffectsOutput(): { context: AudioContext; output: GainNode } | undefined {
  return !muted && !hidden && levels.sfxVolume > 0 && graph?.context.state === "running"
    ? { context: graph.context, output: graph.sfx } : undefined;
}
export function setAudioLevels(next: AudioLevels): void {
  levels = { musicVolume: audioLevel(next.musicVolume, DEFAULT_MUSIC_VOLUME), sfxVolume: sfxLevel(next.sfxVolume) };
  if (levels.sfxVolume === 0) cancelCues();
  applyLevels();
}
export function setAudioMusicLevel(value: number): void {
  levels = { ...levels, musicVolume: audioLevel(value, DEFAULT_MUSIC_VOLUME) };
  applyLevels();
}
export function setAudioMuted(value: boolean): void {
  muted = value;
  if (value) cancelCues();
  applyLevels();
}
export function setAudioPageHidden(value: boolean): void {
  hidden = value;
  if (value) cancelCues();
  applyLevels();
}
/** App teardown only; keep user levels for a StrictMode/remount recovery. */
export function disposeAudioMix(): void {
  const current = graph;
  graph = undefined;
  cancelCues();
  if (!current) return;
  disconnectAudio(current.music); disconnectAudio(current.sfx);
  try { void current.context.close().catch(() => undefined); } catch { /* Already closed. */ }
}
