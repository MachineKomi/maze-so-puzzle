import type { Point } from "./types";

export const MAX_FOLLOWER_TRAIL_LENGTH = 24;

export interface FollowerProcession {
  readonly trail: readonly Point[];
  readonly steps: number;
  readonly slots: readonly { readonly id: string; readonly joinedAt: number }[];
}

export function createFollowerProcession(point: Point, ids: readonly string[] = []): FollowerProcession {
  return {trail:[point],steps:0,slots:ids.map(id=>({id,joinedAt:0}))};
}

/** Preserve repeated visits: removing them can cut across a different corridor. */
export function recordFollowerStep(
  trail: readonly Point[],
  point: Point,
): readonly Point[] {
  return [point,...trail].slice(0,MAX_FOLLOWER_TRAIL_LENGTH);
}

/** Run-local cosmetic history only; engine IDs remain authoritative and sorted. */
export function advanceFollowerProcession(
  current: FollowerProcession, point: Point, ids: readonly string[], discontinuity=false,
): FollowerProcession {
  const order=[...current.slots.map(s=>s.id),...ids.filter(id=>!current.slots.some(s=>s.id===id))];
  if (discontinuity) return createFollowerProcession(point,order);
  const previous=current.trail[0]!;
  const moved=point.x!==previous.x || point.y!==previous.y;
  const steps=current.steps+(moved ? 1 : 0);
  return {
    trail:moved ? recordFollowerStep(current.trail,point) : current.trail,
    steps,
    slots:order.map(id=>current.slots.find(slot=>slot.id===id) ?? {id,joinedAt:steps}),
  };
}

/** Assign identity before clipping. New/resumed friends gather, then unspool. */
export function followerTargets(current: FollowerProcession): readonly {id:string;point:Point}[] {
  return current.slots.map((slot,index)=>({
    id:slot.id,
    point:current.trail[Math.min(index+1,current.steps-slot.joinedAt)] ?? current.trail.at(-1)!,
  }));
}
