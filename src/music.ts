import { DEFAULT_MAZE_TRACK, DEFAULT_TITLE_TRACK, MUSIC_POOLS } from "./musicCatalogue";
import { createMusicPlayback } from "./musicPlayback";

/** Transitional aliases retained only for the current v0.19 player call sites. */
export const MUSIC_TRACKS = {
  title: DEFAULT_TITLE_TRACK.url,
} as const;

/**
 * Full-length songs that are safe to loop during a maze. The short
 * `cue_new_friend...` file in the OST folder is deliberately excluded.
 */
export const MAZE_MUSIC_TRACKS: readonly string[] = Object.freeze(
  MUSIC_POOLS.maze.map((candidate) => candidate.url),
);

export type MazeMusicKey = string | number;

export interface MazeMusicPickerOptions {
  /** Override in tests or for a future themed chapter playlist. */
  readonly tracks?: readonly string[];
  /** A currently playing song that the first maze should avoid if possible. */
  readonly previousTrackUrl?: string;
}

export interface MazeMusicPicker {
  readonly runSeed: string;
  readonly tracks: readonly string[];
  /** Keep repeat avoidance accurate after title/achievement music plays. */
  noteTrackStarted(trackUrl: string): void;
  /** Draw the next song from the session's shuffled, no-repeat playlist. */
  trackForMaze(mazeKey: MazeMusicKey): string;
  /** Reserve without consuming a song or listening/history entry. */
  peekForMaze(mazeKey: MazeMusicKey): string;
}

function stableHash(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function usableTracks(tracks: readonly string[] | undefined): readonly string[] {
  const unique = [...new Set(
    tracks
      ?.map((candidate) => candidate.trim())
      .filter((candidate) => candidate.length > 0),
  )];
  return Object.freeze(unique.length > 0 ? unique : [...MAZE_MUSIC_TRACKS]);
}

function shuffledCycle(tracks: readonly string[], seed: number): string[] {
  const shuffled = [...tracks];
  let state = seed || 0x9e3779b9;
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex]!, shuffled[index]!];
  }
  return shuffled;
}

/**
 * Creates a deterministic-random shuffle bag for one play session. Every
 * full-length track is heard once before the bag refills, entering or revisiting
 * a maze advances the bag, and cycle boundaries avoid an immediate repeat.
 */
export function createMazeMusicPicker(
  runSeed: string | number,
  options: MazeMusicPickerOptions = {},
): MazeMusicPicker {
  const normalizedSeed = String(runSeed).trim() || "ame-maze-run";
  const tracks = usableTracks(options.tracks);
  let previousTrackUrl = options.previousTrackUrl?.trim() || undefined;
  let cycle = 0;
  let deck: string[] = [];

  const refillDeck = (mazeKey: MazeMusicKey) => {
    deck = shuffledCycle(
      tracks,
      stableHash(`${normalizedSeed}\u0000${cycle}\u0000${String(mazeKey)}`),
    );
    cycle += 1;
  };

  const choose = (mazeKey: MazeMusicKey, consume: boolean): string => {
      if (deck.length === 0) refillDeck(mazeKey);
      if (tracks.length > 1 && deck[0] === previousTrackUrl) {
        const alternativeIndex = deck.findIndex((candidate) => candidate !== previousTrackUrl);
        if (alternativeIndex > 0) {
          [deck[0], deck[alternativeIndex]] = [deck[alternativeIndex]!, deck[0]!];
        }
      }
      const selected = deck[0] ?? DEFAULT_MUSIC_TRACK_URL;
      if (consume) { deck.shift(); previousTrackUrl = selected; }
      return selected;
  };
  return {
    runSeed: normalizedSeed,
    tracks,
    noteTrackStarted(nextTrackUrl: string): void { previousTrackUrl = nextTrackUrl.trim() || previousTrackUrl; },
    trackForMaze: key => choose(key, true),
    peekForMaze: key => choose(key, false),
  };
}

let fallbackRunSeedSequence = 0;

/** Makes a session seed without touching audio or triggering autoplay. */
export function createMusicRunSeed(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
      const values = new Uint32Array(2);
      crypto.getRandomValues(values);
      return `ame-${values[0]?.toString(36)}-${values[1]?.toString(36)}`;
    }
  } catch {
    // A privacy-restricted WebView may block crypto; the fallback is sufficient.
  }
  fallbackRunSeedSequence += 1;
  return `ame-${Date.now().toString(36)}-${fallbackRunSeedSequence.toString(36)}`;
}

export const DEFAULT_MUSIC_TRACK_URL = DEFAULT_MAZE_TRACK.url;
export { DEFAULT_MUSIC_VOLUME } from "./audioMix";

export interface MusicOptions {
  readonly trackUrl?: string;
  readonly volume?: number;
}

const playback = createMusicPlayback(DEFAULT_MUSIC_TRACK_URL);
export function configureMusic(options: MusicOptions = {}): void {
  playback.configure(options.trackUrl?.trim() || playback.snapshot().requestedUrl, options.volume);
}
export const prepareMusic = playback.prepare;
export const musicPlaybackSnapshot = playback.snapshot;
/** Also used after established activation for semantic screen transitions.
 * The name does not assert that a repeat timer creates a browser gesture. */
export const startMusicFromUserGesture = playback.start;
export const setMusicMuted = playback.setMuted;
export const recoverMusicFromUserGesture = playback.recover;
export const setMusicPageHidden = playback.setHidden;
export const stopMusic = playback.stop;
export const disposeMusic = playback.dispose;
