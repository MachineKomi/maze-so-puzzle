/** Durable comfort preferences, kept separate from campaign progress. */
import { audioLevel, DEFAULT_MUSIC_VOLUME, DEFAULT_SFX_VOLUME, type AudioLevels } from "./audioMix";
import { AUDIO_CALIBRATION_VERSION, sfxLevel } from "./audioCalibration";
export type MotionPreference = "system" | "full" | "reduced";
export type MotionMode = "full" | "reduced";
export type SurfaceQuality = "full" | "lite" | "static";
export type MovementPace = "chill" | "regular" | "zippy";
export const PRESENTATION_PREFERENCES_KEY = "maze-so-puzzle-presentation-v1";
export interface PresentationPreferences extends AudioLevels {
  readonly audioCalibrationVersion: typeof AUDIO_CALIBRATION_VERSION;
  readonly motion: MotionPreference;
  readonly quality: SurfaceQuality;
  readonly pace: MovementPace;
}
export const DEFAULT_PRESENTATION_PREFERENCES: PresentationPreferences = { audioCalibrationVersion: AUDIO_CALIBRATION_VERSION, motion: "system", quality: "full", pace: "regular", musicVolume: DEFAULT_MUSIC_VOLUME, sfxVolume: DEFAULT_SFX_VOLUME };
export type PresentationPatch = Partial<Omit<PresentationPreferences, "audioCalibrationVersion">>;
export function resolveMotion(preference: MotionPreference, systemReduced: boolean): MotionMode {
  return preference === "system" ? systemReduced ? "reduced" : "full" : preference;
}
function parsePreferences(raw: string | null): Record<string, unknown> | undefined {
  try {
    const value: unknown = JSON.parse(raw ?? "null");
    return value !== null && typeof value === "object" && !Array.isArray(value)
      ? value as Record<string, unknown> : undefined;
  } catch { return undefined; }
}
function normalizePreferences(value?: Record<string, unknown>): PresentationPreferences {
  const motion = value?.motion === "full" || value?.motion === "reduced" || value?.motion === "system" ? value.motion : undefined;
  const quality = value?.quality === "full" || value?.quality === "lite" || value?.quality === "static" ? value.quality : undefined;
  const pace = value?.pace === "chill" || value?.pace === "regular" || value?.pace === "zippy" ? value.pace : undefined;
  const current = value?.audioCalibrationVersion === AUDIO_CALIBRATION_VERSION;
  const recognizable = current || motion || quality || pace
    || [value?.musicVolume, value?.sfxVolume].some(v => typeof v === "number" && Number.isFinite(v));
  if (!recognizable) return DEFAULT_PRESENTATION_PREFERENCES;
  return {
    audioCalibrationVersion: AUDIO_CALIBRATION_VERSION,
    motion: motion ?? "system", quality: quality ?? "full", pace: pace ?? "regular",
    musicVolume: audioLevel(value?.musicVolume, current ? DEFAULT_MUSIC_VOLUME : .22),
    sfxVolume: current ? sfxLevel(value?.sfxVolume) : audioLevel(value?.sfxVolume, DEFAULT_SFX_VOLUME),
  };
}
export function readPresentationPreferences(storage?: Pick<Storage, "getItem">): PresentationPreferences {
  try { return normalizePreferences(parsePreferences((storage ?? window.localStorage).getItem(PRESENTATION_PREFERENCES_KEY))); }
  catch { return DEFAULT_PRESENTATION_PREFERENCES; }
}
export function writePresentationPreferences(value: PresentationPreferences, storage?: Pick<Storage, "getItem" | "setItem">): boolean {
  try {
    const target = storage ?? window.localStorage;
    const version = parsePreferences(target.getItem(PRESENTATION_PREFERENCES_KEY))?.audioCalibrationVersion;
    // Recheck storage at write time: another tab/newer build may have replaced it.
    if (version !== undefined && version !== 1 && version !== AUDIO_CALIBRATION_VERSION) return false;
    target.setItem(PRESENTATION_PREFERENCES_KEY, JSON.stringify(normalizePreferences({ ...value, audioCalibrationVersion: AUDIO_CALIBRATION_VERSION })));
    return true;
  }
  catch { return false; }
}
