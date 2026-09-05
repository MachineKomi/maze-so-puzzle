/** Neutral presentation contract; input/haptics preferences belong to Plan 08. */
export type MotionPreference = "system" | "full" | "reduced";
export type MotionMode = "full" | "reduced";
export type SurfaceQuality = "full" | "lite" | "static";
export const PRESENTATION_PREFERENCES_KEY = "maze-so-puzzle-presentation-v1";
export interface PresentationPreferences {
  readonly motion: MotionPreference;
  readonly quality: SurfaceQuality;
}
export const DEFAULT_PRESENTATION_PREFERENCES: PresentationPreferences = { motion: "system", quality: "full" };
export function resolveMotion(preference: MotionPreference, systemReduced: boolean): MotionMode {
  return preference === "system" ? systemReduced ? "reduced" : "full" : preference;
}
export function readPresentationPreferences(storage?: Pick<Storage, "getItem">): PresentationPreferences {
  try {
    const value = JSON.parse((storage ?? window.localStorage).getItem(PRESENTATION_PREFERENCES_KEY) ?? "null");
    return {
      motion: ["system", "full", "reduced"].includes(value?.motion) ? value.motion : "system",
      quality: ["full", "lite", "static"].includes(value?.quality) ? value.quality : "full",
    };
  } catch { return DEFAULT_PRESENTATION_PREFERENCES; }
}
export function writePresentationPreferences(value: PresentationPreferences, storage?: Pick<Storage, "setItem">): boolean {
  try { (storage ?? window.localStorage).setItem(PRESENTATION_PREFERENCES_KEY, JSON.stringify(value)); return true; }
  catch { return false; }
}
