import { createContext, useLayoutEffect, useRef, useState, type CSSProperties, type HTMLAttributes } from "react";
import { stageFit } from "./stageFit";

export const StageFitContext = createContext({ scale: 1, phone: false, width: 0, height: 0, left: 0, top: 0 });

export function ResponsiveStage(props: HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  const [fit, setFit] = useState({ ...stageFit(innerWidth, innerHeight), left: 0, top: 0 });
  useLayoutEffect(() => {
    const slot = ref.current!.parentElement!;
    const update = () => {
      const bounds = slot.getBoundingClientRect();
      const next = { ...stageFit(slot.clientWidth, slot.clientHeight, innerWidth > innerHeight && innerHeight < 450), left: bounds.left, top: bounds.top };
      setFit(old => Object.keys(next).every(key => old[key as keyof typeof old] === next[key as keyof typeof next]) ? old : next);
    };
    const observer = new ResizeObserver(update); observer.observe(slot); update();
    window.addEventListener("resize", update);
    return () => { observer.disconnect(); window.removeEventListener("resize", update); };
  }, []);
  const style: CSSProperties = fit.phone ? { width: fit.width, height: fit.height, transform: `scale(${fit.scale})`, transformOrigin: "top left", "--stage-scale": fit.scale, "--phone-note-font": `${11 / fit.scale}px` } as CSSProperties : {};
  return <StageFitContext.Provider value={fit}><section {...props} ref={ref} data-phone-fit={fit.phone || undefined} style={{ ...style, ...props.style }} /></StageFitContext.Provider>;
}
