import { memo, useMemo, type CSSProperties } from "react";
import { WALL_REAR_OVERLAP } from "../../game/tallWalls";
import type { LevelDefinition } from "../../game/types";

/** Only the genuine cap spill can cover actors. Reuse the opaque volume's
 * paint graph; no second texture, topology, camera clock or per-actor cutaway. */
export const MazeForeground = memo(function MazeForeground({ level, volumeId, style }: {
  level: LevelDefinition; volumeId: string; style: CSSProperties;
}) {
  const band = useMemo(() => {
    const paths: string[] = [];
    for (let y = 1; y < level.height; y++) for (let x = 0; x < level.width; x++) {
      if (level.terrain[y]?.[x] === "wall" && level.terrain[y - 1]?.[x] !== "wall")
        paths.push(`M${x} ${y - WALL_REAR_OVERLAP}h1v${WALL_REAR_OVERLAP}h-1Z`);
    }
    return paths.join("");
  }, [level]);
  return <svg className="maze-foreground" style={style} aria-hidden="true"
    viewBox={`0 0 ${level.width} ${level.height}`} preserveAspectRatio="none">
    <defs><clipPath id={`${volumeId}-foreground`}><path d={band} /></clipPath></defs>
    <use href={`#${volumeId}`} clipPath={`url(#${volumeId}-foreground)`} />
  </svg>;
});
