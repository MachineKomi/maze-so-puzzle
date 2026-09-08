import { describe, expect, it } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { CANARIES } from './fixtures';
import { CURATED_LEVELS } from '../../../src/game/levels';
import { createInitialGameState, movePlayer, pointKey } from '../../../src/game/engine';
import { solveLevel, getLevelStructureErrors, progressionStateSignature } from '../../../src/game/solver';
import { getProgressiveHint, hintStateKey } from '../../../src/game/hints';
import { measureLevel } from '../../../src/game/metrics';
import { revealVisibleTiles, type TileKey } from '../../../src/game/exploration';
import { createActiveRunSnapshot, sanitizeActiveRunSnapshot } from '../../../src/session';
import { DIRECTIONS, type GameState, type LevelDefinition, type Direction } from '../../../src/game/types';

const out = process.env.MAZE_P1_EVIDENCE;
if (!out || !resolve(out).startsWith('C:\\GameDev\\maze-game-qa\\')) throw Error('External P1 evidence directory required');
mkdirSync(out, { recursive: true });
const report: unknown[] = [];
function replay(level: LevelDefinition, directions: readonly Direction[], initial = createInitialGameState(level, 'run-plan09-p1-proof')) {
  let game = initial;
  for (const d of directions) game = movePlayer(level, game, d).state;
  return game;
}
function blockedWitness(level: LevelDefinition, targetId = level.id === 'wishing-woods'
  ? 'wishing-woods-enemy-kitten-guardian'
  : `${level.id}-enemy-power-${level.id === 'lanternlight-labyrinth' ? 6 : 9}`, requireUnderpowered = true) {
  const initial = createInitialGameState(level, 'run-plan09-p1-proof');
  const queue: {game: GameState; route: Direction[]}[] = [{ game: initial, route: [] }];
  const pots = new Set(level.objects.filter(o => o.kind === 'potion').map(o => o.id));
  const seen = new Set([progressionStateSignature(initial, pots)]);
  for (let head = 0; head < queue.length && head < 20000; head++) {
    const { game, route } = queue[head]!;
    for (const d of DIRECTIONS) {
      const r = movePlayer(level, game, d);
      const target = level.objects.find(o => o.id === targetId)!;
      const attemptedPoint = { x: game.position.x + (d === 'left' ? -1 : d === 'right' ? 1 : 0), y: game.position.y + (d === 'up' ? -1 : d === 'down' ? 1 : 0) };
      if (game.hasSword && pointKey(attemptedPoint) === pointKey(target.at) && r.events.some(e => e.type === 'enemy-too-strong' || (!requireUnderpowered && e.type === 'enemy-defeated'))) return { game, direction: d, route, targetId: target.id, contactEvents: r.events };
      const sig = progressionStateSignature(r.state, pots);
      if (!seen.has(sig) && r.state.status === 'playing') { seen.add(sig); queue.push({ game: r.state, route: [...route, d] }); }
    }
  }
  throw Error('No armed underpowered encounter: ' + level.id);
}
function returnRoute(level: LevelDefinition, initial: GameState, direction: Direction, targetId: string): Direction[] {
  const queue = [{ game: initial, route: [] as Direction[] }];
  const pots = new Set(level.objects.filter(o => o.kind === 'potion').map(o => o.id));
  const seen = new Set([progressionStateSignature(initial, pots)]);
  for (let head = 0; head < queue.length && head < 50000; head++) {
    const { game, route } = queue[head]!;
    if (pointKey(game.position) === pointKey(initial.position) && movePlayer(level, game, direction).state.defeatedEnemyIds.includes(targetId)) return route;
    for (const d of DIRECTIONS) {
      const next = movePlayer(level, game, d).state;
      if (next.status !== 'playing' || next.defeatedEnemyIds.includes(targetId) || next.rescuedAnimalIds.length) continue;
      const sig = progressionStateSignature(next, pots);
      if (!seen.has(sig)) { seen.add(sig); queue.push({ game: next, route: [...route, d] }); }
    }
  }
  throw Error('No zero-rescue growth and return witness: ' + level.id);
}
describe('Plan09-P1 isolated existing-rule canaries', () => {
  for (const level of [...CANARIES, CURATED_LEVELS[6]!, CURATED_LEVELS[9]!]) it(level.id, () => {
    expect(getLevelStructureErrors(level)).toEqual([]);
    const started = performance.now();
    const ordinary = solveLevel(level, { avoidAnimals: true });
    const perfect = solveLevel(level, { requireAllAnimals: true });
    const solverMs = performance.now() - started;
    expect(ordinary.solvable).toBe(true); expect(perfect.solvable).toBe(true);
    expect(replay(level, ordinary.directions).rescuedAnimalIds).toHaveLength(0);
    expect(replay(level, perfect.directions).rescuedAnimalIds).toHaveLength(level.objects.filter(o => o.kind === 'animal').length);
    const blocked = blockedWitness(level);
    const attempted = movePlayer(level, blocked.game, blocked.direction);
    expect(attempted.state.position).toEqual(blocked.game.position);
    expect(attempted.state.power).toBe(blocked.game.power);
    // Targeted comparison: return to this exact blocker, even where the ordinary
    // campaign exit route can skip this optional encounter.
    const route = { directions: returnRoute(level, blocked.game, blocked.direction, blocked.targetId) };
    let returned: GameState | undefined;
    let branch: GameState | undefined;
    let state = blocked.game;
    for (const d of route.directions) {
      state = movePlayer(level, state, d).state;
      if (!branch && state.power > blocked.game.power) branch = state;
      if (branch && pointKey(state.position) === pointKey(blocked.game.position) && movePlayer(level, state, blocked.direction).state.defeatedEnemyIds.includes(blocked.targetId)) { returned = state; break; }
    }
    expect(branch).toBeDefined(); expect(returned).toBeDefined();
    if (level.id.startsWith('p1-')) { expect(branch?.power).toBe(11); expect(returned?.power).toBe(11); }
    const payoff = movePlayer(level, returned!, blocked.direction);
    expect(payoff.state.defeatedEnemyIds).toContain(blocked.targetId);
    expect(payoff.events.some(e => e.type === 'enemy-defeated')).toBe(true);
    expect(payoff.state.position).toEqual(returned!.position);
    const enter = movePlayer(level, payoff.state, blocked.direction);
    expect(enter.moved).toBe(true);
    expect(solveLevel(level, { initialState: enter.state, avoidAnimals: true }).solvable).toBe(true);
    const checkpoints = { clue: blocked.game, branch, return: returned };
    // Real route history under the existing default six-tile view, not an
    // omniscient map or a cleared map on return. Mounted views add their own area.
    let cursor = createInitialGameState(level, 'run-plan09-p1-proof');
    let revealed: ReadonlySet<TileKey> = revealVisibleTiles([], level, cursor.position);
    for (const d of blocked.route) { cursor = movePlayer(level, cursor, d).state; revealed = revealVisibleTiles(revealed, level, cursor.position); }
    const explored: Record<string, readonly TileKey[]> = { clue: [...revealed] };
    for (const d of route.directions) {
      cursor = movePlayer(level, cursor, d).state; revealed = revealVisibleTiles(revealed, level, cursor.position);
      for (const [name, checkpoint] of Object.entries(checkpoints)) if (checkpoint && cursor.steps === checkpoint.steps && cursor.power === checkpoint.power && pointKey(cursor.position) === pointKey(checkpoint.position)) explored[name] = [...revealed];
      if (returned && cursor.steps === returned.steps) break;
    }
    const hintProof: unknown[] = [];
    expect(new Set(Object.values(checkpoints).map(s => hintStateKey(s!))).size).toBe(3);
    for (const [name, game] of Object.entries(checkpoints).filter((entry): entry is [string, GameState] => !!entry[1])) {
      const hints = [0, 1, 2, 3].map(t => getProgressiveHint(level, game, t));
      for (const hint of hints.slice(0, 2)) { expect(hint.direction).toBeUndefined(); expect(hint.targetObjectId).toBeUndefined(); }
      expect(hints[3]!.direction).toBeDefined();
      const hinted = movePlayer(level, game, hints[3]!.direction!).state;
      expect(solveLevel(level, { initialState: hinted, avoidAnimals: true }).solvable).toBe(true);
      const saved = createActiveRunSnapshot({ runId: game.loot.runId, mode: 'normal', level, game, revealedTiles: explored[name] ?? [], hintUsesByState: { [hintStateKey(game)]: 4 } });
      expect(saved).not.toBeNull();
      const restored = sanitizeActiveRunSnapshot(JSON.parse(JSON.stringify(saved)), [level]);
      expect(restored?.game).toEqual(game);
      expect(restored?.hintUsesByState[hintStateKey(game)]).toBe(4);
      hintProof.push(hints);
    }
    const metrics = measureLevel(level);
    let wrongTurn;
    if (level.id.startsWith('p1-')) {
      const wrongRoute: Direction[] = level.id === 'p1-first-use' ? ['left', 'left', 'left'] : ['left', 'left', 'left', 'down', 'down'];
      const wrongGame = replay(level, wrongRoute);
      expect(wrongGame.power).toBe(6); expect(wrongGame.rescuedAnimalIds).toHaveLength(0);
      expect(wrongGame.collectedObjectIds.some(id => id.includes('treasure'))).toBe(true);
      expect(solveLevel(level, { initialState: wrongGame, avoidAnimals: true }).solvable).toBe(true);
      // Actually follow repeated tier-four suggestions all the way out.
      let guided = wrongGame; let inputs = 0;
      while (guided.status !== 'won' && inputs < 100) {
        const hint = getProgressiveHint(level, guided, 3); expect(hint.direction).toBeDefined();
        guided = movePlayer(level, guided, hint.direction!).state; inputs++;
      }
      expect(guided.status).toBe('won'); expect(guided.rescuedAnimalIds).toHaveLength(0);
      wrongTurn = { directions: wrongRoute, state: wrongGame, guidedInputs: inputs };
    }
    const roomContact = level.id === 'lanternlight-labyrinth' ? blockedWitness(level, 'lanternlight-labyrinth-enemy-power-10', false) : undefined;
    report.push({ id: level.id, fingerprint: level.gameplayFingerprint, solverMs, ordinaryStates: ordinary.visitedStates, perfectStates: perfect.visitedStates, metrics, blocked, checkpoints, explored, hintProof, wrongTurn, roomContact, returnRoute: route.directions, payoff: payoff.events, ordinaryRoute: ordinary.directions, perfectRoute: perfect.directions });
    writeFileSync(resolve(out, 'engine-report.json'), JSON.stringify(report, null, 2));
    writeFileSync(resolve(out, 'canaries.json'), JSON.stringify(CANARIES));
  }, 120000);
});
