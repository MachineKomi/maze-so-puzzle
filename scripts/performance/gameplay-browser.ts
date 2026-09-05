/** Shared semantic interaction drivers. Routes are derived from the current engine. */
import { expect, type Page } from "@playwright/test";
import { createInitialGameState, movePlayer } from "../../src/game/engine";
import type { Direction, GameState, LevelDefinition, MoveResult, Point } from "../../src/game/types";

export async function selectTesterLevel(page: Page, level: LevelDefinition): Promise<void> {
  await page.goto("/?debug=mazes&performance-cohort=tester", { waitUntil: "domcontentloaded" });
  const escapedName = level.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pickerButton = page.getByRole("button", {
    name: new RegExp(`^Test story maze \\d+: ${escapedName}, ${level.width} by ${level.height}$`),
  });
  await expect(pickerButton).toBeVisible();
  await pickerButton.click();
  await expect(page.getByRole("region", { name: `${level.name} maze` })).toBeVisible();
}

export const keyForDirection: Readonly<Record<Direction, string>> = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
};

export interface DerivedRouteStep {
  readonly direction: Direction;
  readonly before: GameState;
  readonly result: MoveResult;
}

export function deriveRoute(level: LevelDefinition, directions: readonly Direction[]): readonly DerivedRouteStep[] {
  let state = createInitialGameState(level);
  return directions.map((direction) => {
    const before = state;
    const result = movePlayer(level, state, direction);
    state = result.state;
    return { direction, before, result };
  });
}

export function heldSegment(level: LevelDefinition, route: readonly DerivedRouteStep[]) {
  let best: {
    start: number;
    length: number;
    direction: Direction;
    before: GameState;
    after: GameState;
  } | null = null;
  for (let start = 0; start < Math.min(route.length, 80);) {
    const first = route[start]!;
    const pureMove = first.result.moved
      && first.result.events.length === 1
      && first.result.events[0]?.type === "moved";
    if (!pureMove) {
      start += 1;
      continue;
    }
    let end = start + 1;
    while (
      end < route.length
      && route[end]!.direction === first.direction
      && route[end]!.result.moved
      && route[end]!.result.events.length === 1
      && route[end]!.result.events[0]?.type === "moved"
    ) end += 1;
    const after = route[end - 1]!.result.state;
    const stopProbe = movePlayer(level, after, first.direction);
    const stopsAtOrdinaryBoundary = !stopProbe.moved && stopProbe.events.some((event) => (
      event.type === "blocked" && (event.reason === "wall" || event.reason === "out-of-bounds")
    ));
    if (stopsAtOrdinaryBoundary && (best === null || end - start > best.length)) {
      best = {
        start,
        length: end - start,
        direction: first.direction,
        before: first.before,
        after,
      };
    }
    start = end;
  }
  if (best === null) throw new Error("No safe solver-derived held-movement segment was found.");
  return best;
}

export interface UiRouteState {
  readonly steps: number;
  readonly position: Point;
}

export async function readUiRouteState(page: Page): Promise<UiRouteState> {
  const stepLabel = await page.locator(".step-pill").getAttribute("aria-label");
  const positionText = await page.locator(".maze-map-card .sr-only").first().textContent();
  const stepMatch = /^(\d+) steps?$/.exec(stepLabel?.trim() ?? "");
  const positionMatch = /Ame is at column (\d+), row (\d+)/.exec(positionText ?? "");
  if (!stepMatch || !positionMatch) {
    throw new Error(`Could not read semantic route state: steps=${stepLabel}; position=${positionText}`);
  }
  return {
    steps: Number(stepMatch[1]),
    position: { x: Number(positionMatch[1]) - 1, y: Number(positionMatch[2]) - 1 },
  };
}

export async function expectUiRouteState(page: Page, expected: GameState): Promise<void> {
  await expect.poll(async () => readUiRouteState(page), { timeout: 8_000 }).toEqual({
    steps: expected.steps,
    position: expected.position,
  });
}

const blockingPresentationSelector = [
  ".battle-presentation",
  ".rescue-presentation",
  ".jump-presentation",
  ".portal-presentation",
  ".door-opening-presentation",
].join(", ");
const blockingEventTypes = new Set(["enemy-defeated", "animal-rescued", "hole-jumped", "portal-warped", "door-opened"]);

export async function replayRouteStep(page: Page, step: DerivedRouteStep): Promise<void> {
  await expectUiRouteState(page, step.before);
  await page.keyboard.press(keyForDirection[step.direction]);
  await expectUiRouteState(page, step.result.state);
  if (step.result.events.some((event) => blockingEventTypes.has(event.type))) {
    const presentation = page.locator(blockingPresentationSelector);
    await expect.poll(async () => presentation.count(), { timeout: 1_500 }).toBeGreaterThan(0);
    await expect.poll(async () => presentation.count(), { timeout: 8_000 }).toBe(0);
  }
  await page.waitForTimeout(90);
  await expectUiRouteState(page, step.result.state);
}
