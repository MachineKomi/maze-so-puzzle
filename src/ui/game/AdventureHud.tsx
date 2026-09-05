import { useContext, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type PointerEvent, type ButtonHTMLAttributes } from "react";
import { ThumbPad } from "./ThumbPad";
import { FRIEND_BOOK_LORE } from "../../bookLore";
import { CompactPlayContext } from "./PlayShell";
import type { Direction } from "../../game/types";
import { NAVIGATION_ART, STORY_ART, TREASURE_CATALOG_ART } from "../../artCatalog";
import { CatalogueImage } from "../CatalogueImage";
import { TabularNumber } from "../TabularNumber";
import type { UiArt } from "../art";
import type { AdventureHudModel } from "./hudModel";

export interface ArtDetail { readonly art: UiArt | string; readonly label: string; readonly description: string }
export interface UtilityAction { readonly id: string; readonly label: string; readonly art?: string; readonly pressed?: boolean; readonly run: (trigger: HTMLButtonElement) => void }
function StatusCell({ compact, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { compact: boolean }) {
  // Compact cells communicate status, never masquerade as undersized controls.
  return compact ? <span className={props.className} role="img" aria-label={props["aria-label"]}>{props.children}</span> : <button {...props} />;
}

export function AdventureHud({ model, name, chapter, power, gold, science, steps, map, actions, onMore, onHint, onDetail, onMove, onRead, startHold, steerHold, stopHold, enabled, suggested, tester, feedback }: {
  model: AdventureHudModel; name: string; chapter: string; power: number; gold: number; science: number; steps: number;
  map: ReactNode; actions: readonly UtilityAction[]; onHint: (trigger: HTMLButtonElement) => void;
  onMore: (trigger: HTMLButtonElement) => void;
  onRead?: () => void;
  onDetail: (detail: ArtDetail, trigger: HTMLButtonElement) => void; onMove: (direction: Direction) => void;
  startHold: (event: PointerEvent<HTMLElement>, direction: Direction | null) => void;
  steerHold?: (event: PointerEvent<HTMLElement>, direction: Direction | null) => void;
  stopHold: (event: PointerEvent<HTMLElement>) => void; enabled?: boolean; suggested: Direction | null; tester: boolean; feedback: ReactNode;
}) {
  const compact = useContext(CompactPlayContext);
  const hudRef = useRef<HTMLElement>(null);
  const objectiveRef = useRef<HTMLParagraphElement>(null);
  const [reader, setReader] = useState(false);
  useLayoutEffect(() => {
    const paragraph = objectiveRef.current!;
    const update = () => setReader(compact && (parseFloat(getComputedStyle(paragraph).fontSize) >= 24 || model.objective.length > 160));
    // Inline paragraphs have no ResizeObserver box; observe their block parent.
    update(); const observer = new ResizeObserver(update); observer.observe(paragraph.parentElement!);
    return () => observer.disconnect();
  }, [compact, model.objective]);
  useLayoutEffect(() => {
    const hud = hudRef.current!;
    const overview = hud.querySelector<HTMLElement>(".adventure-overview")!;
    const equipment = hud.querySelector<HTMLElement>(".adventure-equipment")!;
    const update = () => {
      const map = hud.querySelector<HTMLElement>(".maze-map-card")!;
      const minimap = map.querySelector<HTMLElement>(".maze-minimap")!;
      const width = overview.clientWidth, height = overview.clientHeight;
      const idealMap = parseFloat(getComputedStyle(hud.parentElement!).getPropertyValue("--map-size"));
      if (!Number.isFinite(idealMap) || height <= 0) return;
      const mapChrome = map.getBoundingClientRect().height - minimap.getBoundingClientRect().height;
      if (compact) {
        const minimum = innerWidth < 650 ? 96 : 128;
        const available = height - equipment.getBoundingClientRect().height - 3 - mapChrome - 2;
        hud.style.setProperty("--map-size", `${Math.max(minimum, Math.min(idealMap, Math.floor(available)))}px`);
        return;
      }
      const enlarged = parseFloat(getComputedStyle(document.documentElement).fontSize) >= 24;
      hud.toggleAttribute("data-enlarged", enlarged);
      if (enlarged) { hud.style.removeProperty("--map-size"); overview.style.removeProperty("--fitted-slot-size"); overview.style.removeProperty("--fitted-columns"); return; }
      const minimumMap = innerWidth >= 1280 ? 192 : 164;
      let mapSize = Math.max(minimumMap, Math.min(idealMap, Math.floor(height - mapChrome)));
      const headers = [...equipment.querySelectorAll<HTMLElement>("h3")].reduce((sum, heading) => sum + heading.getBoundingClientRect().height + parseFloat(getComputedStyle(heading).marginBottom), 0);
      const fit = (mapWidth: number) => {
      const equipmentWidth = width - mapWidth - 14;
      let best = { columns: 1, size: 48 };
      for (let columns = 1; columns <= Math.max(model.friends.length, model.slots.length, 1); columns++) {
        const friendRows = Math.ceil(model.friends.length / columns), bagRows = Math.ceil(model.slots.length / columns);
        const rows = friendRows + bagRows;
        const emptyBag = model.slots.length ? 0 : equipment.querySelector(".bag-card p")?.getBoundingClientRect().height ?? 0;
        const size = Math.min(112, (equipmentWidth - (columns - 1) * 6) / columns, (height - headers - 16 - Math.max(0, friendRows - 1) * 6 - Math.max(0, bagRows - 1) * 6 - emptyBag) / Math.max(1, rows));
        if (size > best.size) best = { columns, size };
      }
      return best;
      };
      let best = fit(mapSize);
      // Trade only surplus map width for legible collection art. Prefer the
      // largest map that allows 64px portraits, retaining 48px real controls.
      while (best.size < 64 && mapSize > minimumMap) { mapSize--; best = fit(mapSize); }
      hud.style.setProperty("--map-size", `${mapSize}px`);
      overview.style.setProperty("--fitted-slot-size", `${Math.max(48, Math.floor(best.size))}px`);
      overview.style.setProperty("--fitted-columns", `${best.columns}`);
    };
    hud.style.removeProperty("--map-size"); overview.style.removeProperty("--fitted-slot-size"); overview.style.removeProperty("--fitted-columns");
    const observer = new ResizeObserver(update);
    for (const element of [overview, ...hud.querySelectorAll<HTMLElement>(".hud-header,.objective-card,.deck-controls,.rescue-card h3,.bag-card h3")]) observer.observe(element);
    update();
    return () => observer.disconnect();
  }, [compact, model.friends.length, model.slots.length]);
  const hint = <button className="objective-hint-button" data-focus-id="hint" onClick={e => onHint(e.currentTarget)} aria-label="Show objective and a gentle hint for this maze"><CatalogueImage art={NAVIGATION_ART["nav-help"]} alt="" /><span>{reader ? "Objective & Hint" : "Hint"}</span></button>;
  return <aside ref={hudRef} className="adventure-hud" aria-label="Ame and adventure bag" data-focus-group="adventure-deck" data-reader={reader || undefined} data-scroll-region={reader ? undefined : "adventure-deck"}>
    {reader && <div className="objective-dock">{hint}</div>}
    <div className="hud-reader" data-scroll-region={reader ? "adventure-deck" : undefined} role={reader ? "region" : undefined} aria-label={reader ? "Full objective and adventure status" : undefined} tabIndex={reader ? 0 : undefined}
      onFocus={e => { if (reader && e.target === e.currentTarget) onRead?.(); }}
      onKeyDown={e => { if (reader && e.target === e.currentTarget && ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","PageUp","PageDown","Home","End"," "].includes(e.key)) e.stopPropagation(); }}>
    <header className="hud-header">
      <div className="hud-title"><span className="level-kicker" aria-label={tester ? `${chapter} · Tester preview · not saved` : chapter}>{compact ? chapter.replace(/^Story maze /,"Maze ") : chapter}{tester ? compact ? " · Test" : " · Preview · not saved" : ""}</span><h2>{name}</h2></div>
      <div className="hud-counters">
        <div className="power-counter" data-ui-anchor="power"><CatalogueImage art={STORY_ART.amePortrait} alt="Ame" /><span><small>Power</small><TabularNumber value={power} /></span></div>
        <div className="wallet-pill" data-ui-anchor="gold"><CatalogueImage art={TREASURE_CATALOG_ART["gold-bag"]} alt="" /><span><small>Gold</small><TabularNumber value={gold} /></span></div>
        <div className="wallet-pill science-wallet" data-ui-anchor="science"><CatalogueImage art={TREASURE_CATALOG_ART["science-gears"]} alt="" /><span><small>Science</small><TabularNumber value={science} /></span></div>
        <span className="step-pill" aria-label={`${steps} ${steps === 1 ? "step" : "steps"}`}>{steps} steps</span>
      </div>
      {compact && !reader && <div className="phone-hint">{hint}</div>}
      {compact && <button className="phone-more" data-focus-id="more" onClick={e => onMore(e.currentTarget)}>More <span aria-hidden="true">···</span></button>}
    </header>
    <section className="objective-card" aria-labelledby="objective-title"><div><h3 id="objective-title">Right now</h3><p ref={objectiveRef}>{model.objective}</p></div>{!compact && hint}</section>
    <div className="adventure-overview" data-dense={Math.max(model.friends.length,model.slots.length) > 6 || undefined} style={{"--collection-columns": Math.min(3,Math.max(1,Math.max(model.friends.length,model.slots.length)))} as CSSProperties}>
      {map}
      <div className="adventure-equipment">
        <section className="rescue-card" aria-labelledby="rescue-title"><h3 id="rescue-title">Friends <span>{model.rescued}/{model.rescueTotal}</span><small>Optional</small></h3>
          <ul className="rescue-list">{model.friends.map(friend => <li key={friend.id}><StatusCell compact={compact} className={`rescue-friend ${friend.rescued ? "rescued" : "waiting"}`} data-focus-id={`friend:${friend.id}`} aria-label={`${friend.label}: ${friend.rescued ? "rescued" : "waiting in the maze"}`} onClick={e => onDetail({ art: friend.art as UiArt, label: friend.label, description: `${FRIEND_BOOK_LORE[friend.species ?? "bunny"]} ${friend.rescued ? "Safe with Ame!" : "Waiting in the maze. You can always return to help."}` }, e.currentTarget)}>
            <CatalogueImage art={friend.art as UiArt} alt="" />{!friend.rescued && <CatalogueImage className="rescue-cage" src={friend.cage.src} alt="" />}
          </StatusCell></li>)}</ul>
        </section>
        <section className="bag-card" aria-labelledby="bag-title" data-ui-anchor="bag"><h3 id="bag-title">{compact ? "Bag" : "Adventure bag"} <span>{model.bagFound}/{model.bagTotal}</span></h3>
          <ul className="inventory-grid">{model.slots.map(slot => <li key={slot.id} data-ui-anchor={`bag:${slot.id}`}><StatusCell compact={compact} className={`inventory-slot ${slot.found ? "found" : "missing"}`} data-focus-id={`bag:${slot.id}`} aria-label={`${slot.label}: ${slot.found ? "found" : "not found"}`} onClick={e => onDetail({ art: slot.art, label: slot.label, description: `${slot.found ? "Found." : "Still to find."} ${slot.description}` }, e.currentTarget)}><CatalogueImage art={slot.art} alt="" /></StatusCell></li>)}</ul>
          {model.bagTotal === 0 && <p>Bag ready!</p>}
        </section>
      </div>
    </div>
    </div>
    <div className="deck-feedback" aria-live="off">{feedback}</div>
    <div className="deck-controls">
    <section className="controls-card" aria-label="Movement buttons" data-focus-group="movement"><ThumbPad onMove={onMove} startHold={startHold} steerHold={steerHold ?? (()=>{})} stopHold={stopHold} suggested={suggested} enabled={enabled} /><p>Arrows · WASD<br /><span>Tap, hold or drag</span></p></section>
    {!compact && <nav className="utility-row" aria-label="Game" data-focus-group="utilities">{actions.map(action => <button key={action.id} data-focus-id={action.id} aria-pressed={action.pressed} onClick={e => action.run(e.currentTarget)}>{action.art && <CatalogueImage art={action.art} alt="" />}<span>{action.label}</span></button>)}</nav>}
    </div>
  </aside>;
}
