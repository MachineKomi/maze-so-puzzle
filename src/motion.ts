/** Durable comfort preferences, kept separate from campaign progress. */
export type MotionPreference = "system" | "full" | "reduced";
export type MotionMode = "full" | "reduced";
export type SurfaceQuality = "full" | "lite" | "static";
export type MovementPace = "chill" | "regular" | "zippy";
export const PRESENTATION_PREFERENCES_KEY = "maze-so-puzzle-presentation-v1";
export interface PresentationPreferences {
  readonly motion: MotionPreference;
  readonly quality: SurfaceQuality;
  readonly pace: MovementPace;
}
export const DEFAULT_PRESENTATION_PREFERENCES: PresentationPreferences = { motion: "system", quality: "full", pace: "regular" };
export function resolveMotion(preference: MotionPreference, systemReduced: boolean): MotionMode {
  return preference === "system" ? systemReduced ? "reduced" : "full" : preference;
}
export function readPresentationPreferences(storage?: Pick<Storage, "getItem">): PresentationPreferences {
  try {
    const value = JSON.parse((storage ?? window.localStorage).getItem(PRESENTATION_PREFERENCES_KEY) ?? "null");
    return {
      motion: ["system", "full", "reduced"].includes(value?.motion) ? value.motion : "system",
      quality: ["full", "lite", "static"].includes(value?.quality) ? value.quality : "full",
      pace: ["chill", "regular", "zippy"].includes(value?.pace) ? value.pace : "regular",
    };
  } catch { return DEFAULT_PRESENTATION_PREFERENCES; }
}
export function writePresentationPreferences(value: PresentationPreferences, storage?: Pick<Storage, "setItem">): boolean {
  try { (storage ?? window.localStorage).setItem(PRESENTATION_PREFERENCES_KEY, JSON.stringify(value)); return true; }
  catch { return false; }
}
