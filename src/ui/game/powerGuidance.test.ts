import { expect, it, vi } from "vitest";
import { parseAsciiLevel } from "../../game/levels";
import { createInitialGameState } from "../../game/engine";
import { createPowerOpportunitySearch, findPowerOpportunities, schedulePowerOpportunitySearch, type PowerSearchResult } from "./powerGuidance";

const level = parseAsciiLevel({id:"power-proof",name:"Power proof",objective:"Exit",map:["#########","#@.1.9.E#","#..p.#..#","#########"]});
const blocker = level.objects.find(o => o.kind === "enemy" && o.power === 9)!;
it("suggests only engine-reachable, still-present help and enemies beatable at current Power", () => {
  const initial = {...createInitialGameState(level),hasSword:true};
  expect(findPowerOpportunities(level,initial,blocker.id).map(o=>o.kind).sort()).toEqual(["enemy","potion"]);
  expect(findPowerOpportunities(level,{...initial,hasSword:false},blocker.id).map(o=>o.kind)).toEqual(["potion"]);
  expect(findPowerOpportunities(level,{...initial,collectedObjectIds:level.objects.filter(o=>o.kind==="potion").map(o=>o.id),defeatedEnemyIds:level.objects.filter(o=>o.kind==="enemy"&&o.power===1).map(o=>o.id)},blocker.id)).toEqual([]);
});
it("uses the same witnesses with a hard admitted-state bound when drained incrementally",()=>{
  const initial={...createInitialGameState(level),hasSword:true};
  const search=createPowerOpportunitySearch(level,initial,blocker.id,20);
  let step=search.next();while(!step.done)step=search.next();
  expect(step.value.admitted).toBeLessThanOrEqual(20);
  expect(step.value.opportunities).toEqual(findPowerOpportunities(level,initial,blocker.id,20));
});
it("defers work until after the first painted frame and cancels both before and between slices",()=>{
  vi.useFakeTimers();
  vi.stubGlobal("requestAnimationFrame",(callback:()=>void)=>setTimeout(callback,16));
  vi.stubGlobal("cancelAnimationFrame",clearTimeout);
  let time=0;vi.spyOn(performance,"now").mockImplementation(()=>time++);
  const result:PowerSearchResult={opportunities:[],admitted:2048,expanded:2048,transitions:8192,exhausted:true};
  let work=0;
  function* search(){for(let i=0;i<100;i++){work++;yield;}return result;}
  try {
    const done=vi.fn(),cancel=schedulePowerOpportunitySearch(search(),done);
    vi.advanceTimersByTime(31);expect(work).toBe(0);cancel();vi.runAllTimers();expect(work).toBe(0);
    const cancelLater=schedulePowerOpportunitySearch(search(),done);
    vi.advanceTimersByTime(33);expect(work).toBeGreaterThan(0);expect(work).toBeLessThan(100);
    cancelLater();vi.runAllTimers();expect(done).not.toHaveBeenCalled();
    schedulePowerOpportunitySearch(search(),done);vi.runAllTimers();expect(done).toHaveBeenCalledExactlyOnceWith(result);
  } finally {vi.useRealTimers();vi.unstubAllGlobals();vi.restoreAllMocks();}
});
it("does not advertise a potion behind the blocker or invent a result when budget exhausted", () => {
  const corridor=parseAsciiLevel({id:"blocked-proof",name:"Blocked proof",objective:"Exit",map:["########","#@9.p.E#","########"]});
  const enemy=corridor.objects.find(o=>o.kind==="enemy")!;
  expect(findPowerOpportunities(corridor,{...createInitialGameState(corridor),hasSword:true},enemy.id)).toEqual([]);
  expect(findPowerOpportunities(level,createInitialGameState(level),blocker.id,1)).toEqual([]);
});
