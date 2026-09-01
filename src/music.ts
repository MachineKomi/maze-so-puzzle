/** Suno-generated tracks shipped from `public/assets/ost/` in both builds. */
export const MUSIC_TRACKS = {
  title: "/assets/ost/bgm_harbour_morning_v04.mp3",
  earlyStory: "/assets/ost/bgm_tiles_in_the_sun_v04.mp3",
  laterStory: "/assets/ost/bgm_little_champions_v04.mp3",
  surprise: "/assets/ost/BG_Music_01_PixelSkywayRally.mp3",
} as const;

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
  if (!audio) return false;

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

/** Pauses and rewinds while retaining the reusable audio element. */
export function stopMusic(): void {
  if (!player) return;
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
  if (!audio) return;

  safelyPause(audio);
  try {
    audio.removeAttribute("src");
    audio.load();
  } catch {
    // The media element may already have been detached by its host environment.
  }
}
