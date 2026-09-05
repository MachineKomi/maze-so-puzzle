import type { ReactNode } from "react";
/** Stable scene ownership seam. World, actors and transient effects keep one camera. */
export const MAZE_SCENE_SLOTS = ["world", "actors", "effects", "feedback"] as const;
export const UI_ANCHOR_REVISION = 1;
export function MazeViewport({ name, children }: { name: string; children: ReactNode }) {
  return <section className="maze-panel" data-scene-slot="viewport" data-anchor-revision={UI_ANCHOR_REVISION} aria-label={`${name} maze`}>{children}</section>;
}
export function measuredFlight(board: DOMRect, target: DOMRect, origin: DOMRect, xFraction: number, yFraction: number) {
  const x = board.left - origin.left + board.width * xFraction;
  const y = board.top - origin.top + board.height * yFraction;
  return { left: `${x}px`, top: `${y}px`, "--treasure-fly-x": `${target.left + target.width / 2 - origin.left - x}px`, "--treasure-fly-y": `${target.top + target.height / 2 - origin.top - y}px` };
}
