import { useEffect, useLayoutEffect, useMemo, useRef, type Dispatch, type RefObject, type SetStateAction } from "react";
import type { GameState, LevelDefinition, Point } from "../game/types";
import { beginLootClaims, finishLootClaims, lootClaimDuration, lootLandingPaths, lootLineClear, LOOT_SETTLE_MS } from "../game/loot";
import type { SceneTravelSnapshot } from "../ui/game/useSceneTravel";
import type { RewardPort } from "./RewardLayer";
import { rewardSeed } from "./rewardPhysics";

export interface LootMotion {
  born: number; path: readonly Point[]; angle: number; scatterMs: number;
  claimAt?: number; claimMs?: number;
  shownAt?: number;
}
export interface LootView { game: GameState; motions: Map<string, LootMotion>; animate: boolean; represented: Set<string>; canvasAvailable?: boolean }

export function lootReadableDelay(motion: LootMotion): number {
  return motion.path.length>1 ? Math.max(LOOT_SETTLE_MS,motion.scatterMs+250) : LOOT_SETTLE_MS;
}

export function representedLoot(game: GameState, prior: ReadonlySet<string>, ground: Point, limit: number, withheldObjectId?: string, priorityObjectId?: string): Set<string> {
  const drops=game.loot.sources.filter(s=>s.objectId!==withheldObjectId).flatMap(s=>s.drops);
  const priority = new Set(game.loot.sources.filter(s=>s.objectId===priorityObjectId).flatMap(s=>s.drops.map(d=>d.id)));
  // Stable within the nearby view. Accepted IDs retain their slot until credit;
  // approaching distant drops frees offscreen slots without hiding an attraction.
  const candidates=drops.filter(d=>d.phase==="claiming" || Math.abs(d.at.x-ground.x)<=5 && Math.abs(d.at.y-ground.y)<=5);
  candidates.sort((a,b)=>Number(b.phase==="claiming")-Number(a.phase==="claiming")
    || Number(priority.has(b.id))-Number(priority.has(a.id))
    || Number(prior.has(b.id))-Number(prior.has(a.id))
    || Math.hypot(a.at.x-ground.x,a.at.y-ground.y)-Math.hypot(b.at.x-ground.x,b.at.y-ground.y));
  return new Set(candidates.slice(0,limit).map(d=>d.id));
}

/** Semantic deadlines belong to the run, never to a Canvas frame. At rest this
 * owner has no timer; ordinary movement/ledger changes wake admission again. */
export function useLootCollection({ game, setGame, level, runId, scene, port, enabled, animate, limit, withheldObjectId }: {
  game: GameState; setGame: Dispatch<SetStateAction<GameState>>; level: LevelDefinition; runId: string;
  scene: RefObject<SceneTravelSnapshot>; port: RefObject<RewardPort>; enabled: boolean; animate: boolean;
  limit: number; withheldObjectId?: string;
}): RefObject<LootView> {
  const view = useMemo<{current:LootView}>(() => ({ current: { game, motions: new Map<string, LootMotion>(), animate, represented: new Set<string>() } }), [runId]);
  const owner = useRef(runId); owner.current = runId;
  const presentation = useRef({animate,limit});
  useLayoutEffect(()=>{
    if(presentation.current.animate!==animate || presentation.current.limit!==limit) setGame(finishLootClaims);
    presentation.current={animate,limit};
  },[animate,limit,setGame]);
  const first = useRef(view);
  const fresh = useRef(true);
  const encounter = useRef<{ withheld?: string; priority?: string; runId: string }>({runId});
  if (encounter.current.runId !== runId) encounter.current = {runId};
  if (first.current !== view) { first.current = view; fresh.current = true; }
  useLayoutEffect(() => {
    const now = performance.now(), ids = new Set<string>();
    if (encounter.current.withheld && !withheldObjectId) encounter.current.priority = encounter.current.withheld;
    encounter.current.withheld = withheldObjectId;
    view.current.represented=representedLoot(game,view.current.represented,game.position,limit,withheldObjectId,encounter.current.priority);
    for (const source of game.loot.sources) {
      if (source.objectId === withheldObjectId) continue;
      const object = level.objects.find(o => o.id === source.objectId);
      if (!object) continue;
      for (const drop of source.drops) {
        ids.add(drop.id);
        let motion = view.current.motions.get(drop.id);
        if (!motion) {
          const seed = rewardSeed(`${runId}:${drop.id}`);
          motion = { born: now, path: fresh.current ? [drop.at]
            : lootLandingPaths(level, game, object.at).find(p => p.at(-1)!.x === drop.at.x && p.at(-1)!.y === drop.at.y) ?? [drop.at],
            angle: (seed % 628) / 100, scatterMs: 350 + seed % 201 };
          view.current.motions.set(drop.id, motion);
        }
        if(view.current.represented.has(drop.id) && motion.shownAt===undefined) motion.shownAt=now;
        if (drop.phase === "claiming" && motion.claimAt === undefined) {
          motion.claimAt = now; motion.claimMs = lootClaimDuration(Math.hypot(drop.at.x-scene.current.position.x, drop.at.y-scene.current.position.y));
        }
      }
    }
    for (const id of view.current.motions.keys()) if (!ids.has(id)) view.current.motions.delete(id);
    fresh.current = false;
    view.current.game = game; view.current.animate = animate;
    port.current.wake();
  }, [game, level, runId, view, scene, port, animate, limit, withheldObjectId]);

  useEffect(() => {
    if (!view.current.motions.size) return;
    let timer: number | undefined, stopped = false;
    const commit = (reduce: (current: GameState) => GameState) => setGame(current =>
      owner.current === runId && current.levelId === level.id ? reduce(current) : current);
    const interrupt = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
      commit(finishLootClaims);
    };
    const tick = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
      if (stopped) return;
      const current = view.current.game, now = performance.now(), ground = scene.current.position;
      if (!enabled || document.hidden || !document.hasFocus()) { interrupt(); return; }
      const ready: { id: string; elapsedMs: number }[] = [], due = new Set<string>();
      let waiting = false;
      for (const source of current.loot.sources) for (const drop of source.drops) {
        const motion = view.current.motions.get(drop.id);
        if (!motion) continue;
        if (drop.phase === "claiming") {
          if (!animate || view.current.canvasAvailable===false || now >= (motion.claimAt ?? now) + (motion.claimMs ?? 0)
            || !lootLineClear(level, current, drop.at, ground)) due.add(drop.id);
          else waiting = true;
        } else {
          if (!view.current.represented.has(drop.id) || motion.shownAt===undefined) continue;
          const elapsedMs = now-Math.max(motion.born,motion.shownAt);
          if (elapsedMs < lootReadableDelay(motion)) waiting = true;
          else ready.push({ id: drop.id, elapsedMs });
        }
      }
      if (due.size) commit(state => finishLootClaims(state, due));
      if (ready.length) commit(state => {
        const next = beginLootClaims(level, state, ready, ground);
        return animate && view.current.canvasAvailable!==false ? next : finishLootClaims(next);
      });
      const moving = Math.hypot(ground.x-current.position.x, ground.y-current.position.y) > .001;
      if (waiting || (moving && view.current.motions.size)) timer = window.setTimeout(tick, 40);
      port.current.wake();
    };
    tick();
    document.addEventListener("visibilitychange", tick);
    window.addEventListener("focus", tick);
    window.addEventListener("blur", interrupt);
    window.addEventListener("resize", interrupt);
    return () => {
      stopped = true; if (timer !== undefined) window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", tick); window.removeEventListener("focus", tick);
      window.removeEventListener("blur", interrupt); window.removeEventListener("resize", interrupt);
    };
  }, [game, level, runId, view, scene, port, enabled, animate, setGame, withheldObjectId]);
  return view;
}

/** A cardinal path preserves the swept footprint at corners; the vertical
 * bounce is a small in-tile lift rather than a chord through a wall. */
export function lootPose(motion: LootMotion, at: Point, target: Point, now: number, animate: boolean) {
  if (!animate) return { x: at.x+.5, y: at.y+.5, lift: 0, angle: 0, moving: false, scale: 1 };
  if (motion.claimAt !== undefined) {
    const t = Math.min(1, Math.max(0, (now-motion.claimAt)/(motion.claimMs ?? 250))), pull = t*t;
    return { x: at.x+.5+(target.x-at.x)*pull, y: at.y+.5+(target.y-at.y)*pull,
      lift: 0, angle: motion.angle*(1-t), moving: t<1, scale: 1-.65*t*t*t };
  }
  const t = Math.min(1, Math.max(0, (now-motion.born)/motion.scatterMs));
  const distance = (1-(1-t)**2)*(motion.path.length-1), i = Math.min(motion.path.length-1, Math.floor(distance));
  const a = motion.path[i]!, b = motion.path[Math.min(i+1,motion.path.length-1)]!;
  return { x: a.x+.5+(b.x-a.x)*(distance-i), y: a.y+.5+(b.y-a.y)*(distance-i),
    lift: Math.abs(Math.sin(t*Math.PI*2))*.11*(1-t), angle: motion.angle+(1-t)*2.8,
    moving: t<1 && motion.path.length>1, scale: 1 };
}
