// Dev-only actual renderer fixture. Never imported into the shipped application.
import { createRoot } from "react-dom/client";
import { MazeTerrain } from "../../src/ui/game/MazeTerrain";
import { CURATED_LEVELS } from "../../src/game/levels";
import type { LightDirection, TerrainKind, TerrainThemeId } from "../../src/game/types";
import "../../src/ui/styles/scene.css";
import "../../src/ui/styles/comfort.css";
const params = new URLSearchParams(location.search);
const tile = Number(params.get("tile") ?? 40);
const terrainThemeId = (params.get("theme") ?? "sunny-stone") as TerrainThemeId;
const lightDirection = (params.get("light") ?? "top-left") as LightDirection;
const shapes = {
  single: [".....", ".....", "..~..", ".....", "....."],
  strip: [".....", ".....", ".~~~.", ".....", "....."],
  vertical: [".....", "..~..", "..~..", "..~..", "....."],
  L: [".....", ".~...", ".~...", ".~~~.", "....."],
  T: [".....", ".~~~.", "..~..", "..~..", "....."],
  cross: [".....", "..~..", ".~~~.", "..~..", "....."],
  ring: [".....", ".~~~.", ".~.~.", ".~~~.", "....."],
  diagonal: [".....", ".~...", "..~..", ".....", "....."],
};
function board(rows: string[], kind: TerrainKind, name: string) {
  const terrain = rows.map(row => [...row].map(c => c === "#" ? "wall" : c === "h" ? "hole" : c === "~" ? kind : c === "^" ? "lava" : c === "%" ? "poison" : "floor") as TerrainKind[]);
  const width = rows[0]!.length, height = rows.length;
  const level = { ...CURATED_LEVELS[0]!, id: `hazard-rack-${name}-${kind}`, width, height, terrain, objects: [],
    start: { x: 99, y: 99 }, exit: { x: 99, y: 99 }, terrainThemeId, lightDirection };
  return <section key={`${kind}-${name}`} data-shape={name} data-kind={kind}><h2>{kind} · {name}</h2>
    <div className="rack-board" style={{ width: width * tile, height: height * tile }}>
      <MazeTerrain level={level} camera={{ left: 0, top: 0, right: width - 1, bottom: height - 1, width, height }} />
    </div></section>;
}
const style = document.createElement("style");
style.textContent = `body{background:#eee8e2;color:#493651;font:13px system-ui;margin:16px}h1{font-size:18px}h2{font-size:12px;margin:8px 0 3px}main{display:grid;grid-template-columns:repeat(8,${tile * 5}px);gap:6px}.rack-board{position:relative;overflow:hidden}.maze-terrain-svg{width:100%;height:100%;position:absolute;inset:0}.terrain-hole-layer{position:absolute}.terrain-hole-layer img{width:100%;height:100%;object-fit:contain}`;
document.head.append(style);
createRoot(document.getElementById("root")!).render(<><h1>HAZARD-03 · {terrainThemeId} · {lightDirection} · {tile}px/tile</h1><main>
  {(["water", "lava", "poison"] as const).flatMap(kind => Object.entries(shapes).map(([name, rows]) => board(rows, kind, name)))}
  {(["water", "lava", "poison"] as const).map(kind => board([".......", ".##....", ".~~~~h.", ".~~~~..", "......."], kind, "receiver"))}
  {board([".......", ".##....", ".~^%%h.", ".~^%%..", "......."], "water", "mixed")}
</main></>);
