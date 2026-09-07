import type { CSSProperties } from "react";

/** Solid sprites share one retained plane and sort by their ground contact,
 * never by asset family or sprite height. Ties keep Ame readable. The wall
 * cap pass, airborne poses and labels are deliberate separate layers. */
export function sceneDepth(y: number, rank = 2): number {
  return 100 + Math.round(y * 16) * 8 + rank;
}
export const depthStyle = (y: number, rank = 2): CSSProperties => ({ zIndex: sceneDepth(y,rank) });
