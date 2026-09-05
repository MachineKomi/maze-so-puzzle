import { useContext, useLayoutEffect, useRef, useState, type ReactNode, type PointerEvent, type ButtonHTMLAttributes } from "react";
import { CompactPlayContext } from "./PlayShell";
import type { Direction } from "../../game/types";
import { NAVIGATION_ART, PICKUP_ART, TREASURE_CATALOG_ART } from "../../artCatalog";
import { CatalogueImage } from "../CatalogueImage";
import { TabularNumber } from "../TabularNumber";
import type { UiArt } from "../art";
import type { AdventureHudModel } from "./hudModel";

export interface ArtDetail { readonly art: UiArt | string; readonly label: string; readonly description: string }
export interface UtilityAction { readonly id: string; readonly label: string; readonly art?: string; readonly pressed?: boolean; readonly run: (trigger: HTMLButtonElement) => void }
const arrows = { up: "▲", left: "◀", right: "▶", down: "▼" } as const;
function StatusCell({ compact, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { compact: boolean }) {
  // Compact cells communicate status, never masquerade as undersized controls.
  return compact ? <span className={props.className} role="img" aria-label={props["aria-label"]}>{props.children}</span> : <button {...props} />;
}

export function AdventureHud({ model, name, chapter, power, gold, science, steps, map, actions, onMore, onHint, onDetail, onMove, onRead, startHold, stopHold, suggested, tester, feedback }: {
  model: AdventureHudModel; name: string; chapter: string; power: number; gold: number; science: number; steps: number;
  map: ReactNode; actions: readonly UtilityAction[]; onHint: (trigger: HTMLButtonElement) => void;
  onMore: (trigger: HTMLButtonElement) => void;
  onRead?: () => void;
  onDetail: (detail: ArtDetail, trigger: HTMLButtonElement) => void; onMove: (direction: Direction) => void;
  startHold: (event: PointerEvent<HTMLButtonElement>, direction: Direction) => void;
  stopHold: (event: PointerEvent<HTMLButtonElement>) => void; suggested: Direction | null; tester: boolean; feedback: ReactNode;
}) {
  const compact = useContext(CompactPlayContext);
  const objectiveRef = useRef<HTMLParagraphElement>(null);
  const [reader, setReader] = useState(false);
  useLayoutEffect(() => {
    const paragraph = objectiveRef.current!;
    const update = () => setReader(compact && (parseFloat(getComputedStyle(paragraph).fontSize) >= 24 || model.objective.length > 160));
    // Inline paragraphs have no ResizeObserver box; observe their block parent.
    update(); const observer = new ResizeObserver(update); observer.observe(paragraph.parentElement!);
    return () => observer.disconnect();
  }, [compact, model.objective]);
  const hint = <button className="objective-hint-button" data-focus-id="hint" onClick={e => onHint(e.currentTarget)} aria-label="Show objective and a gentle hint for this maze"><CatalogueImage art={NAVIGATION_ART["nav-help"]} alt="" /><span>{reader ? "Objective & Hint" : "Hint"}</span></button>;
  return <aside className="adventure-hud" aria-label="Ame and adventure bag" data-focus-group="adventure-deck" data-reader={reader || undefined} data-scroll-region={reader ? undefined : "adventure-deck"}>
    {reader && <div className="objective-dock">{hint}</div>}
    <div className="hud-reader" data-scroll-region={reader ? "adventure-deck" : undefined} role={reader ? "region" : undefined} aria-label={reader ? "Full objective and adventure status" : undefined} tabIndex={reader ? 0 : undefined}
      onFocus={e => { if (reader && e.target === e.currentTarget) onRead?.(); }}
      onKeyDown={e => { if (reader && e.target === e.currentTarget && ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","PageUp","PageDown","Home","End"," "].includes(e.key)) e.stopPropagation(); }}>
    <header className="hud-header">
      <div className="hud-title"><span className="level-kicker" aria-label={tester ? `${chapter} · Tester preview · not saved` : chapter}>{compact ? chapter.replace(/^Story maze /,"Maze ") : chapter}{tester ? compact ? " · Test" : " · Preview · not saved" : ""}</span><h2>{name}</h2></div>
      <div className="hud-counters">
        <div className="power-counter" data-ui-anchor="power"><CatalogueImage art={PICKUP_ART.potion} alt="" /><span>Power <TabularNumber value={power} /></span></div>
        <div className="wallet-pill" data-ui-anchor="gold"><CatalogueImage art={TREASURE_CATALOG_ART["gold-bag"]} alt="" /><span><small>Gold</small><TabularNumber value={gold} /></span></div>
        <div className="wallet-pill science-wallet" data-ui-anchor="science"><CatalogueImage art={TREASURE_CATALOG_ART["science-gears"]} alt="" /><span><small>Science</small><TabularNumber value={science} /></span></div>
        <span className="step-pill" aria-label={`${steps} ${steps === 1 ? "step" : "steps"}`}>{steps} steps</span>
      </div>
      {compact && !reader && <div className="phone-hint">{hint}</div>}
      {compact && <button className="phone-more" data-focus-id="more" onClick={e => onMore(e.currentTarget)}>More <span aria-hidden="true">···</span></button>}
    </header>
    <section className="objective-card" aria-labelledby="objective-title"><div><h3 id="objective-title">Right now</h3><p ref={objectiveRef}>{model.objective}</p></div>{!compact && hint}</section>
    <div className="adventure-overview">
      {map}
      <div className="adventure-equipment">
        <section className="rescue-card" aria-labelledby="rescue-title"><h3 id="rescue-title">Friends <span>{model.rescued}/{model.rescueTotal}</span><small>Optional</small></h3>
          <ul className="rescue-list">{model.friends.map(friend => <li key={friend.id}><StatusCell compact={compact} className={`rescue-friend ${friend.rescued ? "rescued" : "waiting"}`} data-focus-id={`friend:${friend.id}`} aria-label={`${friend.label}: ${friend.rescued ? "rescued" : "waiting in the maze"}`} onClick={e => onDetail({ art: friend.art as UiArt, label: friend.label, description: friend.rescued ? "Safe with Ame! Friends are optional and never block the star goal." : "Waiting in the maze. Helping friends is optional; you can always return." }, e.currentTarget)}>
            <CatalogueImage art={friend.art as UiArt} alt="" /><span className="item-state" aria-hidden="true">{friend.rescued ? "✓" : "♡"}</span>
          </StatusCell></li>)}</ul>
        </section>
        <section className="bag-card" aria-labelledby="bag-title" data-ui-anchor="bag"><h3 id="bag-title">Adventure bag <span>{model.bagFound}/{model.bagTotal}</span></h3>
          <ul className="inventory-grid">{model.slots.map(slot => <li key={slot.id} data-ui-anchor={`bag:${slot.id}`}><StatusCell compact={compact} className={`inventory-slot ${slot.found ? "found" : "missing"}`} data-focus-id={`bag:${slot.id}`} aria-label={`${slot.label}: ${slot.found ? "found" : "not found"}`} onClick={e => onDetail({ art: slot.art, label: slot.label, description: `${slot.found ? "Found." : "Still to find."} ${slot.description}` }, e.currentTarget)}><CatalogueImage art={slot.art} alt="" /><span className="item-state" aria-hidden="true">{slot.found ? "✓" : "?"}</span></StatusCell></li>)}</ul>
          {model.bagTotal === 0 && <p>Bag ready!</p>}
        </section>
      </div>
    </div>
    </div>
    <section className="controls-card" aria-label="Movement buttons" data-focus-group="movement"><div className="dpad">{(["up", "left", "right", "down"] as const).map(direction => <button key={direction} data-focus-id={`move:${direction}`} className={`dpad-${direction}${suggested === direction ? " suggested-move" : ""}`} onPointerDown={e => startHold(e, direction)} onPointerUp={stopHold} onPointerCancel={stopHold} onLostPointerCapture={stopHold} onClick={e => { if (e.detail === 0) onMove(direction); }} aria-label={`Move ${direction}`}>{arrows[direction]}</button>)}</div><p>Arrows · WASD<br /><span>Press, hold or steer</span></p></section>
    {!compact && <nav className="utility-row" aria-label="Game" data-focus-group="utilities">{actions.map(action => <button key={action.id} data-focus-id={action.id} aria-pressed={action.pressed} onClick={e => action.run(e.currentTarget)}>{action.art && <CatalogueImage art={action.art} alt="" />}<span>{action.label}</span></button>)}</nav>}
    {feedback && <div className="deck-feedback">{feedback}</div>}
  </aside>;
}
