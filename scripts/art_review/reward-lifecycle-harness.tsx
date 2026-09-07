import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { RewardLayer, EMPTY_REWARD_PORT } from "../../src/vfx/RewardLayer";
import { CURATED_LEVELS } from "../../src/game/levels";
import { createInitialGameState } from "../../src/game/engine";
import type { LootView } from "../../src/vfx/useLootCollection";

/** Explicit development-server test module, never imported by runtime. */
export function mountRewardHarness(host: HTMLElement) {
  const root = createRoot(host), port = { current: EMPTY_REWARD_PORT };
  const terrain = Array.from({ length: 8 }, (_, y) => Array.from({ length: 8 }, (_, x) =>
    x === 0 || y === 0 || x === 7 || y === 7 ? "wall" as const : "floor" as const));
  const level = { ...CURATED_LEVELS[0]!, width: 8, height: 8, terrain };
  const loot = { current: { game: createInitialGameState(level), motions: new Map(), animate: true, represented:new Set<string>() } } as {current: LootView};
  const scene = { current: { position: { x: 3, y: 3 }, camera: { left: 0, top: 0, right: 7, bottom: 7, width: 8, height: 8 },
    cameraEnvelope: { left: 0, top: 0, right: 7, bottom: 7 }, contentSize: { width: 480, height: 480 }, followers: [] } };
  const show = (active: boolean) => flushSync(() => root.render(
    <div style={{ position: "relative", width: 480, height: 480 }}>
      <div data-reward-anchor="ame" style={{ position: "absolute", left: 180, top: 180, width: 60, height: 60 }} />
      <RewardLayer port={port} level={level} scene={scene} active={active} quality="full" muted={true} loot={loot} />
    </div>));
  show(true);
  return { show, emit: () => {
    const now = performance.now();
    for (const delay of [200, 600, 1000]) port.current.emit({ kind: "power", at: { x: 2, y: 3 }, amount: 6,
      seed: 2, bornAt: now + delay, arrivals: [240, 260, 280, 300, 320, 340] });
  }, emitDense: () => {
    for (const kind of ["gold", "science", "power"] as const)
      port.current.emit({kind,at:{x:2,y:3},amount:8,seed:3});
  }, cancel: () => port.current.cancel(), unmount: () => flushSync(() => root.unmount()) };
}
