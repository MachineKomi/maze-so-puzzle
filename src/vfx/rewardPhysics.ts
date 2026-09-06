import type { Point, TerrainKind } from "../game/types";

export type RewardKind = "gold" | "science" | "power";
export interface RewardEmission {
  readonly kind: RewardKind;
  readonly at: Point;
  readonly amount: number;
  readonly seed: number;
  /** Shared-clock deadlines, relative to emission. Combat uses its typed steps. */
  readonly arrivals?: readonly number[];
  readonly values?: readonly number[];
  /** Absolute presentation clock: future combat contacts are admitted once. */
  readonly bornAt?: number;
}
export interface RewardToken {
  kind: RewardKind; x: number; y: number; vx: number; vy: number;
  born: number; due: number; homingAt: number; scale: number; angle: number;
  value: number; trail: Point[]; arrived: boolean; expired: boolean; bounced: boolean;
}
export const REWARD_CAP = { full: 24, lite: 12 } as const;
// Display envelope for the enlarged glyph, including its small scale variation.
const RADIUS = .46;

export function rewardSeed(text: string): number {
  let value = 2166136261;
  for (const char of text) value = Math.imul(value ^ char.charCodeAt(0), 16777619);
  return value >>> 0;
}

/** A local stream, never the engine/generator stream. */
function random(seed: number): () => number {
  let value = seed;
  return () => {
    value += 0x6D2B79F5;
    let mixed = Math.imul(value ^ value >>> 15, 1 | value);
    mixed ^= mixed + Math.imul(mixed ^ mixed >>> 7, 61 | mixed);
    return ((mixed ^ mixed >>> 14) >>> 0) / 4294967296;
  };
}

export function makeRewardTokens(event: RewardEmission, now: number, slots: number): RewardToken[] {
  if (!Number.isSafeInteger(event.amount) || event.amount <= 0) return [];
  const count = Math.min(Math.max(0, slots), event.arrivals?.length ?? Math.min(8, event.amount));
  const rng = random(event.seed);
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count + rng() * .16) * Math.PI * 2;
    const speed = 2.4 + rng() * 2.1;
    const first = Math.floor(index * (event.arrivals?.length ?? count) / count);
    const last = Math.floor((index + 1) * (event.arrivals?.length ?? count) / count);
    const duration = event.arrivals?.[last - 1] ?? 720 + index * 42;
    const value = event.values?.slice(first, last).reduce((sum, v) => sum + v, 0)
      ?? Math.floor(event.amount / count) + (index < event.amount % count ? 1 : 0);
    return {
      kind: event.kind, x: event.at.x + .5, y: event.at.y + .5,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      born: now, due: now + duration, homingAt: now + Math.min(240, duration * .42),
      scale: .98 + rng() * .04, angle: rng() * Math.PI,
      value, trail: [], arrived: false, expired: false, bounced: false,
    };
  });
}

export function rewardSpaceOpen(terrain: readonly (readonly TerrainKind[])[], x: number, y: number): boolean {
  for (const dx of [-RADIUS, RADIUS]) for (const dy of [-RADIUS, RADIUS]) {
    const cell = terrain[Math.floor(y + dy)]?.[Math.floor(x + dx)];
    if (cell === undefined || cell === "wall") return false;
  }
  return true;
}

/** Top-down decorative motion: <=.112 tile per8ms at the hard speed cap.
 * Axis separation reflects corner hits without ever crossing a wall. */
export function advanceRewardToken(token: RewardToken, terrain: readonly (readonly TerrainKind[])[],
  target: Point, from: number, to: number): void {
  if (token.arrived || token.expired) return;
  if (to < token.born) return;
  // A stalled/background frame is not permission for a burst of catch-up audio.
  if (!Number.isFinite(to) || to - from > 120) { token.expired = true; return; }
  const end = Math.min(to, token.due);
  for (let time = from; time < end; time += 8) {
    const dt = Math.min(8, end - time) / 1000;
    const dx = target.x - token.x, dy = target.y - token.y;
    if (time >= token.homingAt) {
      const remaining = Math.max(.028, (token.due - time) / 1000);
      const distance = Math.hypot(dx, dy);
      const speed = Math.min(14, distance / remaining * 2.4);
      token.vx = distance ? dx / distance * speed : 0;
      token.vy = distance ? dy / distance * speed : 0;
    } else {
      token.vx *= Math.exp(-2.5 * dt); token.vy *= Math.exp(-2.5 * dt);
    }
    const nextX = token.x + token.vx * dt;
    if (rewardSpaceOpen(terrain, nextX, token.y)) token.x = nextX;
    else { token.vx *= -.64; token.bounced = true; }
    const nextY = token.y + token.vy * dt;
    if (rewardSpaceOpen(terrain, token.x, nextY)) token.y = nextY;
    else { token.vy *= -.64; token.bounced = true; }
    token.angle += dt * 3;
  }
  token.trail.push({ x: token.x, y: token.y });
  if (token.trail.length > 4) token.trail.shift();
  // Collection is acknowledged only at its exact scheduled receipt time and
  // only near the actual rendered recipient. Blocked tokens simply expire.
  if (to >= token.due) {
    token.arrived = Math.hypot(target.x - token.x, target.y - token.y) < .22;
    token.expired = !token.arrived;
  }
}

export function rewardProjection(point: Point, camera: {left: number; top: number; width: number; height: number},
  size: {width: number; height: number}): Point {
  return { x: (point.x - camera.left) * size.width / camera.width,
    y: (point.y - camera.top) * size.height / camera.height };
}
