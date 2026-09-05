import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { Direction } from "../../game/types";

const arrows = { up: "▲", left: "◀", right: "▶", down: "▼" } as const;
/** A small angular overlap keeps a resting thumb from chattering at diagonals. */
export function thumbDirection(x: number, y: number, previous: Direction | null): Direction | null {
  if (Math.max(Math.abs(x),Math.abs(y)) < .20) return null;
  if ((previous === "left" || previous === "right") && Math.abs(x) > Math.abs(y) * .8) return x < 0 ? "left" : "right";
  if ((previous === "up" || previous === "down") && Math.abs(y) > Math.abs(x) * .8) return y < 0 ? "up" : "down";
  return Math.abs(x) > Math.abs(y) ? x < 0 ? "left" : "right" : y < 0 ? "up" : "down";
}
export function ThumbPad({ onMove, startHold, steerHold, stopHold, suggested, enabled = true }: {
  onMove: (direction: Direction) => void;
  startHold: (event: PointerEvent<HTMLElement>, direction: Direction | null) => void;
  steerHold: (event: PointerEvent<HTMLElement>, direction: Direction | null) => void;
  stopHold: (event: PointerEvent<HTMLElement>) => void;
  suggested: Direction | null; enabled?: boolean;
}) {
  const gesture = useRef<{id:number; x:number; y:number; startX:number; startY:number; width:number; height:number; dragging:boolean; direction:Direction|null} | null>(null);
  const [direction, setDirection] = useState<Direction | null>(null);
  const [dragging, setDragging] = useState(false);
  const reset = () => { gesture.current=null; setDirection(null); setDragging(false); };
  useEffect(() => { if (!enabled) reset(); }, [enabled]);
  useEffect(() => { window.addEventListener("blur",reset); return () => window.removeEventListener("blur",reset); }, []);
  return <div className="dpad thumb-pad" role="group" aria-label="Directional thumb pad: tap arrows or drag to steer"
    data-steering={dragging || undefined} data-direction={direction ?? undefined}
    onPointerDown={event => {
      if (!enabled || !event.isPrimary || event.button !== 0) return;
      event.preventDefault();
      const rect=event.currentTarget.getBoundingClientRect();
      const target=(event.target as HTMLElement).closest<HTMLElement>("button[data-direction]");
      const next=target?.dataset.direction as Direction | undefined;
      gesture.current={id:event.pointerId,x:rect.left+rect.width/2,y:rect.top+rect.height/2,startX:event.clientX,startY:event.clientY,width:rect.width,height:rect.height,dragging:false,direction:next ?? null};
      event.currentTarget.setPointerCapture(event.pointerId);
      setDirection(next ?? null); startHold(event,next ?? null);
    }}
    onPointerMove={event => {
      const active=gesture.current;
      if (!active || active.id!==event.pointerId) return;
      event.preventDefault();
      if (!active.dragging && Math.hypot(event.clientX-active.startX,event.clientY-active.startY) < 6) return;
      const x=(event.clientX-active.x)/(active.width/2), y=(event.clientY-active.y)/(active.height/2);
      const next=thumbDirection(x,y,active.direction);
      active.dragging=true; setDragging(true);
      event.currentTarget.style.setProperty("--stick-x",`${Math.max(-28,Math.min(28,x*28))}px`);
      event.currentTarget.style.setProperty("--stick-y",`${Math.max(-28,Math.min(28,y*28))}px`);
      if(next!==active.direction) { active.direction=next; setDirection(next); steerHold(event,next); }
    }}
    onPointerUp={event => { if(gesture.current?.id===event.pointerId) { stopHold(event); reset(); if(event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); } }}
    onPointerCancel={event => { if (gesture.current?.id === event.pointerId) { stopHold(event); reset(); } }}
    onLostPointerCapture={event => { if (gesture.current?.id === event.pointerId) { stopHold(event); reset(); } }}>
    {(["up","left","right","down"] as const).map(item => <button key={item} type="button" data-direction={item}
      data-focus-id={`move:${item}`} className={`dpad-${item}${suggested===item ? " suggested-move":""}`}
      aria-label={`Move ${item}`}
      onKeyDown={event => {
        // Native repeated Enter clicks look like deliberate keyboard taps.
        // Suppress them before they can leave a queued step after key release.
        if (event.key === "Enter" && event.repeat) event.preventDefault();
      }}
      onClick={event => { if(event.detail===0 && enabled) onMove(item); }}>{arrows[item]}</button>)}
    <span className="thumb-stick" aria-hidden="true"><i /></span>
  </div>;
}
