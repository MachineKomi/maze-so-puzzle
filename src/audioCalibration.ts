/** Slider positions are presentation only; persisted values are effective gains. */
export const AUDIO_CALIBRATION_VERSION = 2;
const MUSIC_CURVE_ANCHOR = 0.10;
export const DEFAULT_MUSIC_VOLUME = MUSIC_CURVE_ANCHOR * (.65 / .75) ** 2;
export const DEFAULT_SFX_VOLUME = (4 / 3) * .85;
// Candidate ceiling: publication requires the AUDIO-01V2 rendered-peak review.
export const MAX_SFX_VOLUME = 4 / 3;

export function audioLevel(value: unknown, fallback: number, maximum = 1): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.min(maximum, value)) : fallback;
}
export function sfxLevel(value: unknown): number {
  return audioLevel(value, DEFAULT_SFX_VOLUME, MAX_SFX_VOLUME);
}
export function musicGain(position: number): number {
  const u = audioLevel(position, .75);
  if (u <= .75) return MUSIC_CURVE_ANCHOR * (u / .75) ** 2;
  const x = 4 * u - 3;
  return MUSIC_CURVE_ANCHOR + x / 15 + 5 * x * x / 6;
}
export function musicPosition(gain: number): number {
  const g = audioLevel(gain, DEFAULT_MUSIC_VOLUME);
  if (g <= MUSIC_CURVE_ANCHOR) return .75 * Math.sqrt(g / MUSIC_CURVE_ANCHOR);
  const d = g - MUSIC_CURVE_ANCHOR;
  // Rationalized positive quadratic root retains precision near the join.
  const x = 2 * d / (Math.sqrt(1 / 225 + 10 * d / 3) + 1 / 15);
  return (3 + x) / 4;
}
export function sfxGain(position: number): number {
  return MAX_SFX_VOLUME * audioLevel(position, .75);
}
export function sfxPosition(gain: number): number {
  return sfxLevel(gain) / MAX_SFX_VOLUME;
}
