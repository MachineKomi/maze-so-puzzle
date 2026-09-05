import { movePlayer } from "../../game/engine";
import { progressionStateSignature } from "../../game/solver";
import { DIRECTIONS, type GameState, type LevelDefinition, type LevelObject } from "../../game/types";

export type PowerOpportunity = Extract<LevelObject, {kind: "enemy" | "potion"}>;
export interface PowerSearchResult { readonly opportunities: readonly PowerOpportunity[]; readonly admitted: number; readonly expanded: number; readonly transitions: number; readonly exhausted: boolean }
/** Read-only UI evidence, never a new movement rule. Every suggestion has an
 * engine-replayed witness that excludes the blocking guardian. A bounded search
 * may omit an opportunity; absence must lead to Required Path, not "none exist".
 * Gameplay owns any later shared/generalized suggestion service. */
export function* createPowerOpportunitySearch(level: LevelDefinition, initial: GameState, blockerId: string, maxStates = 2048): Generator<void,PowerSearchResult> {
  const potionIds = new Set(level.objects.filter(o => o.kind === "potion").map(o => o.id));
  const signature = (state: GameState) => progressionStateSignature(state, false, potionIds);
  const queue = [initial], seen = new Set([signature(initial)]);
  const found = new Map<string, PowerOpportunity>();
  const candidates = level.objects.filter((o): o is PowerOpportunity =>
    o.kind === "enemy" ? initial.hasSword && o.power <= initial.power && !initial.defeatedEnemyIds.includes(o.id)
      : o.kind === "potion" && !initial.collectedObjectIds.includes(o.id));
  let expanded=0, transitions=0;
  const result=():PowerSearchResult=>({opportunities:[...found.values()],admitted:seen.size,expanded,transitions,exhausted:seen.size>=maxStates});
  for (let head = 0; head < queue.length && seen.size < maxStates; head++) {
    expanded++;
    for (const direction of DIRECTIONS) {
      transitions++;
      const next = movePlayer(level, queue[head]!, direction).state;
      if (next.defeatedEnemyIds.includes(blockerId)) { yield; continue; }
      for (const object of candidates) {
        if (object.kind === "enemy" && next.defeatedEnemyIds.includes(object.id)) found.set("enemy", found.get("enemy") ?? object);
        if (object.kind === "potion" && next.collectedObjectIds.includes(object.id)) found.set("potion", found.get("potion") ?? object);
      }
      if (found.size === 2) return result();
      const key = signature(next);
      if (!seen.has(key) && next.status === "playing" && seen.size < maxStates) { seen.add(key); queue.push(next); }
      yield;
    }
  }
  return result();
}

/** Synchronous witness/reference API; production UI drains the same iterator in slices. */
export function findPowerOpportunities(level: LevelDefinition, initial: GameState, blockerId: string, maxStates = 2048): readonly PowerOpportunity[] {
  const search=createPowerOpportunitySearch(level,initial,blockerId,maxStates);
  let step=search.next();while(!step.done)step=search.next();return step.value.opportunities;
}

/** At most 4ms per slice plus one indivisible engine transition; no timers after cancel. */
export function schedulePowerOpportunitySearch(search: Generator<void,PowerSearchResult>, done: (result:PowerSearchResult)=>void, observeSlice?: (milliseconds:number)=>void) {
  let cancelled=false,frame=0,timer:ReturnType<typeof setTimeout>;
  const slice=()=>{
    if(cancelled)return;
    const start=performance.now();let step;
    do {step=search.next();} while(!step.done&&performance.now()-start<4);
    observeSlice?.(performance.now()-start);
    if(step.done)done(step.value);else timer=setTimeout(slice,0);
  };
  // Double rAF separates the exact feedback commit from optional work, even
  // when React flushes passive effects before a paint following discrete input.
  frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{timer=setTimeout(slice,0);});});
  return ()=>{cancelled=true;cancelAnimationFrame(frame);clearTimeout(timer);};
}
