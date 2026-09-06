import React from "react";
import { it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { TERRAIN_THEMES } from "../../src/artCatalog";
import { CURATED_LEVELS } from "../../src/game/levels";
import { MazeTerrain } from "../../src/ui/game/MazeTerrain";
import { solveLevel } from "../../src/game/solver";
import { createInitialGameState, movePlayer } from "../../src/game/engine";
import { revealVisibleTiles } from "../../src/game/exploration";
import { savedFixture, isOrdinaryMove } from "../performance/v22-input-fixtures";
import { ACTIVE_RUN_STORAGE_KEY } from "../../src/session";
import { PLAYER_PROGRESS_STORAGE_KEY, createDefaultPlayerProgress } from "../../src/progress";
import { PRESENTATION_PREFERENCES_KEY, DEFAULT_PRESENTATION_PREFERENCES } from "../../src/motion";

it("keeps frame vignette and themed ornament selectors separate", () => {
  const css=readFileSync('src/ui/styles/scene.css','utf8');
  expect(css).not.toMatch(/data-terrain-theme[^\n]+\]\s*::after/);
  const vignette=css.match(/\.maze-board\.exploration-camera::after\s*\{([^}]+)\}/)![1]!;
  for(const rule of ['width: auto','height: auto','animation: none','transform: none','opacity: 1']) expect(vignette).toContain(rule);
  expect(readFileSync('src/App.tsx','utf8')).toContain('<span className="terrain-ambient-decoration" aria-hidden="true" />');
});

it("derives opt-in moving-camera checkpoints from current legal routes", () => {
  const directory=process.env.MAZE_WALL_PROOF_DIR;
  if(!directory) return;
  const fixtures=[8,10,15].map(index=> {
    const level=CURATED_LEVELS[index]!;
    const solved=solveLevel(level,{requireAllAnimals:true});
    expect(solved.solvable).toBe(true);
    let before=createInitialGameState(level);
    let revealed=revealVisibleTiles([],level,before.position);
    for(const direction of solved.directions) {
      let next=before, count=0;
      while(count<5) {
        const result=movePlayer(level,next,direction);
        if(!isOrdinaryMove(result))break;
        next=result.state; count++;
      }
      if(count>=3 && before.position.x>3 && before.position.y>3) return {
        id:level.id,index:index+1,name:level.name,direction,count,
        snapshot:savedFixture({level,before,revealed},`wall-${index}`)
      };
      before=movePlayer(level,before,direction).state;
      revealed=revealVisibleTiles(revealed,level,before.position);
    }
    throw new Error(`No safe ordinary camera segment in ${level.name}`);
  });
  mkdirSync(directory,{recursive:true});
  writeFileSync(join(directory,'fixtures.json'),JSON.stringify({fixtures,
    keys:{run:ACTIVE_RUN_STORAGE_KEY,progress:PLAYER_PROGRESS_STORAGE_KEY,preferences:PRESENTATION_PREFERENCES_KEY},
    progress:createDefaultPlayerProgress(16),preferences:DEFAULT_PRESENTATION_PREFERENCES},null,2));
});

it("generates an opt-in actual-component rack outside runtime delivery", () => {
  const directory=process.env.MAZE_WALL_PROOF_DIR;
  if(!directory) return;
  const terrain=["########", "#......#", "#.##.#.#", "#.#..#.#", "#....#.#", "##.#...#", "#......#", "########"].map(row=>[...row].map(c=>c==="#"?"wall":"floor" as const));
  const camera={left:0,top:0,right:7,bottom:7,width:8,height:8};
  const scenes=Object.values(TERRAIN_THEMES).flatMap(theme=>(theme.id === 'sunny-stone' ? ["top","right","bottom","left"] as const : ["top"] as const).map(lightDirection=>{
    const level={...CURATED_LEVELS[0]!, id:`rack-${theme.id}`, width:8,height:8,terrain,terrainThemeId:theme.id,exit:{x:6,y:6},lightDirection};
      return `<section><h2>${theme.label} / ${lightDirection}</h2><div class="pair">${["legacy","depth"].map(mode=>`<figure><figcaption>${mode}</figcaption><div class="board">${renderToStaticMarkup(<MazeTerrain level={level} camera={camera} wallMode={mode as "legacy"|"depth"}/>, {identifierPrefix: `${theme.id}-${lightDirection}-${mode}-`})}</div></figure>`).join("")}</div></section>`;
  })).join("");
  mkdirSync(directory,{recursive:true});
  const assetOrigin=process.env.MAZE_WALL_ASSET_ORIGIN ?? "http://127.0.0.1:4195";
  const ids=[...scenes.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
  expect(new Set(ids).size).toBe(ids.length);
  writeFileSync(join(directory,"index.html"),`<!doctype html><html lang="en"><meta charset="utf-8"><title>04-A material rack</title><style>body{background:#eee7ed;color:#443553;font:16px system-ui;margin:24px}section{margin-bottom:30px}.pair{display:flex;gap:16px;flex-wrap:wrap}figure{margin:0}.board{position:relative;width:448px;height:448px;overflow:hidden;border:2px solid #655775;border-radius:12px}.maze-terrain-svg{width:100%;height:100%;position:absolute;inset:0}.goal-layer{display:none}</style><h1>04-A: unchanged pixels, smaller repeats; legacy vs raised walls</h1><p>Comparison uses the new repeat/palette calibration in both columns. Not a v0.22.8 pixel baseline.</p>${scenes.replaceAll('"/assets/',`"${assetOrigin}/assets/`)}</html>`);
});
