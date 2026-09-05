import { createContext, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { calculatePlayLayout } from "./layout";
export const CompactPlayContext = createContext(false);

export function PlayShell({ big, blocked, children }: { big: boolean; blocked: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 944, height: 524 });
  useLayoutEffect(() => {
    const element = ref.current!;
    const style = getComputedStyle(element);
    setSize({width: element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight), height: element.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)});
    const observer = new ResizeObserver(([entry]) => { if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height }); });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const layout = calculatePlayLayout(size.width, size.height, big);
  return <CompactPlayContext.Provider value={layout.compact}><div ref={ref} className="game-layout play-shell" data-mode={big ? "big" : "normal"}
    data-layout={layout.compact ? "compact-landscape" : "primary-landscape"} data-emergency={layout.emergency || undefined}
    inert={blocked || undefined} aria-hidden={blocked || undefined}
    style={{ "--board-size": `${layout.board}px`, "--map-size": `${layout.map}px`, "--shell-gap": `${layout.gap}px` } as CSSProperties}>{children}</div></CompactPlayContext.Provider>;
}
