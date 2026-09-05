/** V22-PERF-01: derive normal saved states only by legal current-engine play. */
import { createServer } from "vite";
import { existsSync, readFileSync } from "node:fs";
import { resolve, relative } from "node:path";

export function frozenSourcePlugin(root, sourceDirectory) {
  return {
    name: "v22-frozen-source",
    enforce: "pre",
    load(id) {
      if (!sourceDirectory) return null;
      const path = id.split("?")[0];
      const local = relative(resolve(root, "src"), path);
      if (local.startsWith("..") || local.includes(":")) return null;
      const frozen = resolve(sourceDirectory, local);
      if (!existsSync(frozen)) return null;
      let source = readFileSync(frozen, "utf8");
      if (local.replaceAll("\\", "/") === "styles.css") {
        // Vite's CSS import resolver reads imports directly from disk rather
        // than invoking Rollup load. Expand the frozen layer imports here.
        source = source.replace(/@import\s+"\.\/([^"]+)"\s+layer\(([^)]+)\);/g,
          (_match, child, layer) => `@layer ${layer} {\n${readFileSync(resolve(sourceDirectory, child), "utf8")}\n}`);
      }
      return source;
    },
  };
}

export async function deriveNormalFixtures(root, sourceDirectory) {
  const server = await createServer({ root, configFile: resolve(root, "vite.config.ts"),
    server: { middlewareMode: true }, plugins: [frozenSourcePlugin(root, sourceDirectory)] });
  try {
    const { CURATED_LEVELS } = await server.ssrLoadModule("/src/game/levels.ts");
    const { solveLevel } = await server.ssrLoadModule("/src/game/solver.ts");
    const { createInitialGameState, movePlayer } = await server.ssrLoadModule("/src/game/engine.ts");
    const { revealVisibleTiles, DEFAULT_FOV_SIZE } = await server.ssrLoadModule("/src/game/exploration.ts");
    const { createActiveRunSnapshot, ACTIVE_RUN_STORAGE_KEY } = await server.ssrLoadModule("/src/session.ts");
    const { createDefaultPlayerProgress, PLAYER_PROGRESS_STORAGE_KEY } = await server.ssrLoadModule("/src/progress.ts");
    const { PRESENTATION_PREFERENCES_KEY } = await server.ssrLoadModule("/src/motion.ts");
    const level = CURATED_LEVELS.find(level => level.id === "moonlit-friendship-quest");
    if (!level || level.objects.filter(object => object.kind === "animal").length !== 5) {
      throw new Error("The authored five-friend fixture has changed; reselect explicitly.");
    }
    const solution = solveLevel(level, { requireAllAnimals: true });
    if (!solution.solvable) throw new Error(`Perfect fixture route failed: ${solution.reason}`);
    let game = createInitialGameState(level);
    let revealed = revealVisibleTiles([], level, game.position, DEFAULT_FOV_SIZE);
    const prefixes = new Map([[0, { game, revealed, directions: [] }]]);
    const prefix = [];
    for (const direction of solution.directions) {
      const result = movePlayer(level, game, direction);
      game = result.state; prefix.push(direction);
      revealed = revealVisibleTiles(revealed, level, game.position, DEFAULT_FOV_SIZE);
      if ([2, 5].includes(game.rescuedAnimalIds.length) && game.status === "playing"
          && !prefixes.has(game.rescuedAnimalIds.length)) {
        prefixes.set(game.rescuedAnimalIds.length, { game, revealed, directions: [...prefix] });
      }
    }
    if (prefixes.size !== 3) throw new Error("Cannot establish all 0/2/5 playing checkpoints.");
    const directions = ["up", "right", "down", "left"];
    const reverse = { up: "down", down: "up", left: "right", right: "left" };
    const key = point => `${point.x},${point.y}`;
    const pure = result => result.moved && result.state.status === "playing"
      && result.events.length === 1 && result.events[0].type === "moved";
    const safeSetup = result => result.moved && result.state.status === "playing"
      && result.events.every(event => ["moved", "hole-jumped", "portal-warped"].includes(event.type));
    const reachable = initial => {
      const points = new Map([[key(initial.position), { game: initial, path: [] }]]);
      const queue = [...points.values()];
      for (let i = 0; i < queue.length; i++) for (const direction of directions) {
        const result = movePlayer(level, queue[i].game, direction);
        if (!safeSetup(result) || points.has(key(result.state.position))) continue;
        const next = { game: result.state, path: [...queue[i].path, direction] };
        points.set(key(next.game.position), next); queue.push(next);
      }
      return points;
    };
    const access = new Map([...prefixes].map(([count, state]) => [count, reachable(state.game)]));
    let corridor = null;
    for (const [pointKey, point] of access.get(0)) {
      if (![2, 5].every(count => access.get(count).has(pointKey))) continue;
      for (const direction of directions) {
        const states = [0, 2, 5].map(count => access.get(count).get(pointKey).game);
        const wallBlocked = result => !result.moved && result.events.some(event => event.type === "blocked"
          && ["wall", "out-of-bounds"].includes(event.reason));
        let length = 0;
        while (length < 20) {
          const results = states.map(state => movePlayer(level, state, direction));
          if (!results.every(pure)) break;
          for (let i = 0; i < states.length; i++) states[i] = results[i].state;
          length++;
        }
        if (length >= 3 && states.every(state => wallBlocked(movePlayer(level, state, direction)))
            && (!corridor || length > corridor.length)) corridor = {
          start: point.game.position, direction, length, pointKey,
        };
      }
    }
    if (!corridor) throw new Error("No common >=3-step pure reversible corridor. Do not manufacture a fixture.");
    const outward = Array(corridor.length).fill(corridor.direction);
    const inward = Array(corridor.length).fill(reverse[corridor.direction]);
    const cycle = [...outward, ...inward];
    const fixtures = [];
    for (const count of [0, 2, 5]) {
      const checkpoint = prefixes.get(count);
      game = checkpoint.game; revealed = checkpoint.revealed;
      const setup = access.get(count).get(corridor.pointKey).path;
      for (const direction of setup) {
        const result = movePlayer(level, game, direction);
        if (!safeSetup(result)) throw new Error("Setup acquired an unexpected gameplay effect.");
        game = result.state; revealed = revealVisibleTiles(revealed, level, game.position, DEFAULT_FOV_SIZE);
      }
      const validationStart = game;
      for (const direction of cycle) {
        const result = movePlayer(level, game, direction);
        if (!pure(result)) throw new Error("The common corridor is not pure/reversible.");
        game = result.state;
      }
      if (key(game.position) !== key(validationStart.position)) throw new Error("Cycle failed to return.");
      const snapshot = createActiveRunSnapshot({
        runId: `run-v22-perf-normal-${count}-followers`, mode: "normal", level,
        game: validationStart, revealedTiles: revealed, hintUsesByState: {},
      });
      if (!snapshot) throw new Error(`Normal snapshot sanitizer rejected ${count} followers.`);
      fixtures.push({ count, snapshot, solutionPrefix: checkpoint.directions, setup,
        semanticState: { position: snapshot.game.position, steps: snapshot.game.steps,
          power: snapshot.game.power, rescuedAnimalIds: snapshot.game.rescuedAnimalIds } });
    }
    return {
      level: { id: level.id, name: level.name, revision: level.contentRevision,
        fingerprint: level.gameplayFingerprint, width: level.width, height: level.height },
      storage: { active: ACTIVE_RUN_STORAGE_KEY, progress: PLAYER_PROGRESS_STORAGE_KEY,
        presentation: PRESENTATION_PREFERENCES_KEY },
      progress: createDefaultPlayerProgress(CURATED_LEVELS.length),
      route: { ...corridor, cycle, explanation: "Intersection of ordinary engine-moved reachable tiles at 0/2/5 legal perfect-route prefixes; no synthetic content or rescue IDs." },
      fixtures,
    };
  } finally { await server.close(); }
}
