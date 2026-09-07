import { createContext, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { calculateExploreLayout, calculatePlayLayout } from "./layout";
export const CompactPlayContext = createContext(false);

export function PlayShell({ blocked, children, grid, classic = false, folded = false, onViewSize }: { blocked: boolean; children: ReactNode; grid: {width:number;height:number}; classic?: boolean; folded?: boolean; onViewSize: (size:{width:number;height:number})=>void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{width:number;height:number}|null>(null);
  useLayoutEffect(() => {
    const element = ref.current!;
    const style = getComputedStyle(element);
    setSize({width: element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight), height: element.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)});
    const observer = new ResizeObserver(([entry]) => { if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height }); });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const layout = calculatePlayLayout(size?.width ?? 944, size?.height ?? 524);
  const explore = calculateExploreLayout(size?.width ?? 944, size?.height ?? 524, grid, folded);
  const columns = classic ? Math.min(6,grid.width) : explore.columns;
  const rows = classic ? Math.min(6,grid.height) : explore.rows;
  useLayoutEffect(() => { if (size) onViewSize({width:columns,height:rows}); }, [columns,rows,onViewSize,!!size]);
  return <CompactPlayContext.Provider value={layout.compact}><div ref={ref} className="game-layout play-shell" data-mode="maximized"
    data-layout={classic ? layout.compact ? "compact-landscape" : "primary-landscape" : "explore"} data-folded={!classic && folded || undefined} data-emergency={classic && layout.emergency || undefined}
    inert={blocked || undefined} aria-hidden={blocked || undefined}
    style={{ "--board-size": `${layout.board}px`, "--board-width": `${explore.boardWidth}px`, "--board-height": `${explore.boardHeight}px`, "--deck-width": `${explore.deck}px`, "--map-size": `${classic ? layout.map : explore.map}px`, "--shell-gap": `${layout.gap}px` } as CSSProperties}>{children}</div></CompactPlayContext.Provider>;
}
