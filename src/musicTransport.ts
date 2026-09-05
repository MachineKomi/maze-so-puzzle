import {
  DEFAULT_TITLE_TRACK,
  MUSIC_CATALOGUE,
  MUSIC_CONTEXTS,
  MUSIC_POOLS,
  musicTrackById,
  musicTrackByUrl,
  type MusicContext,
  type MusicTrackDefinition,
} from "./musicCatalogue";
import {
  configureMusic,
  createMazeMusicPicker,
  createMusicRunSeed,
  disposeMusic,
  setMusicMuted,
  startMusicFromUserGesture,
} from "./music";

export interface MusicTransportSnapshot {
  readonly context: MusicContext;
  readonly currentTrackId: string;
  readonly muted: boolean;
  readonly canPrevious: boolean;
  readonly canNext: boolean;
  readonly canShuffle: boolean;
  /** Loop controls remain deliberately unavailable until the Human policy gate. */
  readonly loopAvailable: false;
}

export interface MusicTransportPort {
  getSnapshot(): MusicTransportSnapshot;
  subscribe(listener: (snapshot: MusicTransportSnapshot) => void): () => void;
  setContext(context: MusicContext): MusicTransportSnapshot;
  setMuted(muted: boolean): MusicTransportSnapshot;
  previous(): MusicTransportSnapshot;
  next(): MusicTransportSnapshot;
  shuffle(): MusicTransportSnapshot;
  startFromUserGesture(): Promise<boolean>;
  dispose(): void;
}

interface MusicTransportEffects {
  readonly selectTrack?: (track: MusicTrackDefinition) => void;
  readonly setMuted?: (muted: boolean) => void;
  readonly start?: () => Promise<boolean>;
  readonly dispose?: () => void;
}

function hash(value: string): number {
  let result = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 0x01000193);
  }
  return result >>> 0;
}

class MusicTransportAdapter implements MusicTransportPort {
  private context: MusicContext = "title";
  private currentTrackId = DEFAULT_TITLE_TRACK.id;
  private muted = false;
  private shuffleSequence = 0;
  private mazeEntry = 0;
  private lastMazeTrackId: string | undefined;
  private readonly mazePicker;
  private readonly history: string[] = [DEFAULT_TITLE_TRACK.id];
  private historyIndex = 0;
  private readonly listeners = new Set<(snapshot: MusicTransportSnapshot) => void>();

  constructor(private readonly effects: MusicTransportEffects = {}, seed = "transport-test") {
    this.mazePicker = createMazeMusicPicker(seed);
  }

  getSnapshot(): MusicTransportSnapshot {
    const pool = MUSIC_POOLS[this.context];
    return Object.freeze({
      context: this.context,
      currentTrackId: this.currentTrackId,
      muted: this.muted,
      canPrevious: this.historyIndex > 0 && musicTrackById(this.history[this.historyIndex-1]!)?.context === this.context,
      canNext: pool.length > 1,
      canShuffle: pool.length > 1,
      loopAvailable: false,
    });
  }

  subscribe(listener: (snapshot: MusicTransportSnapshot) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private publish(): MusicTransportSnapshot {
    const snapshot = this.getSnapshot();
    this.listeners.forEach((listener) => listener(snapshot));
    return snapshot;
  }

  private select(track: MusicTrackDefinition, addToHistory = true): MusicTransportSnapshot {
    this.currentTrackId = track.id;
    if (track.context === "maze") { this.lastMazeTrackId = track.id; this.mazePicker.noteTrackStarted(track.url); }
    if (addToHistory) {
      this.history.splice(this.historyIndex + 1);
      if (this.history[this.history.length - 1] !== track.id) this.history.push(track.id);
      this.historyIndex = this.history.length - 1;
    }
    this.effects.selectTrack?.(track);
    return this.publish();
  }

  setContext(context: MusicContext): MusicTransportSnapshot {
    const current = musicTrackById(this.currentTrackId);
    this.context = context;
    // Each explicit maze context is an entry/revisit, as in the original picker.
    if (context === "maze") {
      const entry = ++this.mazeEntry;
      let track = musicTrackByUrl(this.mazePicker.trackForMaze(entry))!;
      // Manual transport may already have played the bag's sole remaining item.
      if (track.id === this.lastMazeTrackId && MUSIC_POOLS.maze.length > 1) track = musicTrackByUrl(this.mazePicker.trackForMaze(entry))!;
      return this.select(track);
    }
    if (current?.context === context) return this.select(current, false);
    return this.select(MUSIC_POOLS[context][0]!);
  }

  setMuted(muted: boolean): MusicTransportSnapshot {
    this.muted = muted;
    this.effects.setMuted?.(muted);
    return this.publish();
  }

  previous(): MusicTransportSnapshot {
    if (this.historyIndex <= 0) return this.publish();
    this.historyIndex -= 1;
    const track = musicTrackById(this.history[this.historyIndex]!);
    if (!track || track.context !== this.context) {
      this.historyIndex += 1;
      return this.publish();
    }
    return this.select(track, false);
  }

  next(): MusicTransportSnapshot {
    const pool = MUSIC_POOLS[this.context];
    const currentIndex = pool.findIndex((track) => track.id === this.currentTrackId);
    return this.select(pool[(currentIndex + 1 + pool.length) % pool.length]!);
  }

  shuffle(): MusicTransportSnapshot {
    const pool = MUSIC_POOLS[this.context];
    if (pool.length <= 1) return this.publish();
    this.shuffleSequence += 1;
    const alternatives = pool.filter((track) => track.id !== this.currentTrackId);
    const selected = alternatives[hash(`${this.context}\u0000${this.shuffleSequence}`) % alternatives.length]!;
    return this.select(selected);
  }

  async startFromUserGesture(): Promise<boolean> {
    this.effects.selectTrack?.(musicTrackById(this.currentTrackId)!);
    this.effects.setMuted?.(this.muted);
    return this.effects.start?.() ?? true;
  }

  dispose(): void {
    this.listeners.clear();
    this.effects.dispose?.();
  }
}

export function createMusicTransportFake(): MusicTransportPort {
  return new MusicTransportAdapter();
}

export function createCurrentMusicTransport(): MusicTransportPort {
  return new MusicTransportAdapter({
    selectTrack: (track) => configureMusic({ trackUrl: track.url }),
    setMuted: setMusicMuted,
    start: startMusicFromUserGesture,
    dispose: disposeMusic,
  }, createMusicRunSeed());
}

export const CURRENT_MUSIC_TRANSPORT = createCurrentMusicTransport();

/** Build-time/runtime assertion helper used by tests and release checks. */
export function validateMusicCatalogue(): readonly string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const urls = new Set<string>();
  for (const candidate of MUSIC_CATALOGUE) {
    if (ids.has(candidate.id)) errors.push(`Duplicate music ID: ${candidate.id}`);
    if (urls.has(candidate.url)) errors.push(`Duplicate music URL: ${candidate.url}`);
    if (!candidate.url.startsWith(`/assets/ost/${candidate.context}/`)) {
      errors.push(`Track ${candidate.id} is outside its ${candidate.context} pool.`);
    }
    ids.add(candidate.id);
    urls.add(candidate.url);
  }
  for (const context of MUSIC_CONTEXTS) {
    if (MUSIC_POOLS[context].length === 0) errors.push(`Empty music pool: ${context}`);
  }
  return errors;
}
