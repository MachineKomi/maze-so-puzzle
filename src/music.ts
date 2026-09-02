/** Suno-generated tracks shipped from `public/assets/ost/` in both builds. */
export const MUSIC_TRACKS = {
  title: "/assets/ost/bgm_harbour_morning_v04.mp3",
  earlyStory: "/assets/ost/bgm_tiles_in_the_sun_v04.mp3",
  laterStory: "/assets/ost/bgm_little_champions_v04.mp3",
  surprise: "/assets/ost/BG_Music_01_PixelSkywayRally.mp3",
  arena: "/assets/ost/bgm_arena_overdrive_v04.mp3",
  dungeon: "/assets/ost/Dungeon - Teeth Beneath the Temple.mp3",
  gallop: "/assets/ost/Iron Heart Gallop.mp3",
  sanctuary: "/assets/ost/Sanctuary - Warm Stone After Midnight.mp3",
  shore: "/assets/ost/Shore - Saltfire Horizon.mp3",
  throatBass: "/assets/ost/Throat Bass.mp3",
  hardBass: "/assets/ost/Violent Hard Bass Throat Step.mp3",
  hardBassOne: "/assets/ost/Violent Hard Bass Throat Step (1).mp3",
  hardBassTwo: "/assets/ost/Violent Hard Bass Throat Step (2).mp3",
} as const;

/**
 * Full-length songs that are safe to loop during a maze. The short
 * `cue_new_friend...` file in the OST folder is deliberately excluded.
 */
export const MAZE_MUSIC_TRACKS: readonly string[] = Object.freeze([
  MUSIC_TRACKS.earlyStory,
  MUSIC_TRACKS.laterStory,
  MUSIC_TRACKS.surprise,
  MUSIC_TRACKS.arena,
  MUSIC_TRACKS.title,
  MUSIC_TRACKS.dungeon,
  MUSIC_TRACKS.gallop,
  MUSIC_TRACKS.sanctuary,
  MUSIC_TRACKS.shore,
  MUSIC_TRACKS.throatBass,
  MUSIC_TRACKS.hardBass,
  MUSIC_TRACKS.hardBassOne,
  MUSIC_TRACKS.hardBassTwo,
]);

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

  return {
    runSeed: normalizedSeed,
    tracks,
    noteTrackStarted(nextTrackUrl: string): void {
      previousTrackUrl = nextTrackUrl.trim() || previousTrackUrl;
    },
    trackForMaze(mazeKey: MazeMusicKey): string {
      if (deck.length === 0) refillDeck(mazeKey);
      if (tracks.length > 1 && deck[0] === previousTrackUrl) {
        const alternativeIndex = deck.findIndex((candidate) => candidate !== previousTrackUrl);
        if (alternativeIndex > 0) {
          [deck[0], deck[alternativeIndex]] = [deck[alternativeIndex]!, deck[0]!];
        }
      }
      const selected = deck.shift() ?? DEFAULT_MUSIC_TRACK_URL;
      previousTrackUrl = selected;
      return selected;
    },
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

export const DEFAULT_MUSIC_TRACK_URL = MUSIC_TRACKS.earlyStory;
export const DEFAULT_MUSIC_VOLUME = 0.22;

export interface MusicOptions {
  readonly trackUrl?: string;
  readonly volume?: number;
}

let trackUrl: string = DEFAULT_MUSIC_TRACK_URL;
let volume = DEFAULT_MUSIC_VOLUME;
let muted = false;
let player: HTMLAudioElement | undefined;
let generation = 0;
let pageHidden = false;
let activelyPlayingPlayer: HTMLAudioElement | undefined;
let visibilityPausedPlayer: {
  readonly audio: HTMLAudioElement;
  readonly generation: number;
} | undefined;

function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_MUSIC_VOLUME;
  return Math.min(1, Math.max(0, value));
}

function safelyPause(audio: HTMLAudioElement): void {
  try {
    audio.pause();
  } catch {
    // Background music is optional and must never interrupt gameplay.
  }
}

function createPlayer(): HTMLAudioElement | undefined {
  if (typeof Audio === "undefined") return undefined;

  try {
    const audio = new Audio(trackUrl);
    audio.loop = true;
    audio.preload = "none";
    audio.volume = volume;
    audio.muted = muted;
    audio.setAttribute("playsinline", "");
    player = audio;
    return audio;
  } catch {
    return undefined;
  }
}

/**
 * Changes the track or volume before playback. Reconfiguring an active player
 * disposes it; the replacement still waits for the next user gesture.
 */
export function configureMusic(options: MusicOptions = {}): void {
  const nextTrackUrl = options.trackUrl?.trim() || trackUrl;
  const nextVolume = options.volume === undefined ? volume : clampVolume(options.volume);
  const trackChanged = nextTrackUrl !== trackUrl;

  trackUrl = nextTrackUrl;
  volume = nextVolume;

  if (trackChanged) {
    disposeMusic();
    return;
  }

  if (player) player.volume = volume;
}

/**
 * Call synchronously from a click, tap, or key handler. Nothing in this module
 * attempts autoplay, so browser gesture policies remain respected. A missing
 * track or rejected play request resolves to `false` instead of throwing.
 */
export async function startMusicFromUserGesture(): Promise<boolean> {
  const audio = player ?? createPlayer();
  if (!audio || pageHidden) return false;

  audio.loop = true;
  audio.volume = volume;
  audio.muted = muted;
  const attemptGeneration = generation;

  try {
    await audio.play();
    if (attemptGeneration !== generation || player !== audio) {
      safelyPause(audio);
      return false;
    }
    if (pageHidden) {
      activelyPlayingPlayer = undefined;
      visibilityPausedPlayer = { audio, generation: attemptGeneration };
      safelyPause(audio);
      return true;
    }
    activelyPlayingPlayer = audio;
    return true;
  } catch {
    // Includes autoplay denial, an absent file, and unsupported codecs.
    return false;
  }
}

/** Keeps the music position while muted so toggling sound feels instant. */
export function setMusicMuted(nextMuted: boolean): void {
  muted = nextMuted;
  if (player) player.muted = nextMuted;
}

async function resumeVisibilityPausedPlayer(
  audio: HTMLAudioElement,
  expectedGeneration: number,
): Promise<void> {
  try {
    await audio.play();
    if (
      expectedGeneration !== generation
      || player !== audio
      || muted
      || pageHidden
    ) {
      safelyPause(audio);
      if (pageHidden && !muted && expectedGeneration === generation && player === audio) {
        visibilityPausedPlayer = { audio, generation: expectedGeneration };
      }
      return;
    }
    activelyPlayingPlayer = audio;
  } catch {
    // Visibility-driven playback is optional and browser policy may reject it.
  }
}

/**
 * Pause active BGM while its page is hidden, then resume only that exact
 * still-current player when the page returns. This never creates a player or
 * turns a previously stopped/failed track into autoplay.
 */
export function setMusicPageHidden(hidden: boolean): void {
  if (pageHidden === hidden) return;
  pageHidden = hidden;

  if (hidden) {
    const audio = player;
    let wasPlaying = audio !== undefined && activelyPlayingPlayer === audio;
    if (audio && wasPlaying) {
      try {
        wasPlaying = !audio.paused;
      } catch {
        // The successful play result tracked above is the safe fallback.
      }
    }
    activelyPlayingPlayer = undefined;
    visibilityPausedPlayer = wasPlaying && audio
      ? { audio, generation }
      : undefined;
    if (wasPlaying && audio) safelyPause(audio);
    return;
  }

  const paused = visibilityPausedPlayer;
  visibilityPausedPlayer = undefined;
  if (!paused || muted || paused.generation !== generation || player !== paused.audio) return;
  void resumeVisibilityPausedPlayer(paused.audio, paused.generation);
}

/** Pauses and rewinds while retaining the reusable audio element. */
export function stopMusic(): void {
  if (!player) return;
  generation += 1;
  activelyPlayingPlayer = undefined;
  visibilityPausedPlayer = undefined;
  safelyPause(player);
  try {
    player.currentTime = 0;
  } catch {
    // Some browsers reject seeks before media metadata is available.
  }
}

/** Releases the media request and audio element, suitable for React cleanup. */
export function disposeMusic(): void {
  generation += 1;
  const audio = player;
  player = undefined;
  activelyPlayingPlayer = undefined;
  visibilityPausedPlayer = undefined;
  if (!audio) return;

  safelyPause(audio);
  try {
    audio.removeAttribute("src");
    audio.load();
  } catch {
    // The media element may already have been detached by its host environment.
  }
}
