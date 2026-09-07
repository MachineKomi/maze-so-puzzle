# Reward-first VFX contract — VFX-02A

## DELIGHT24 — candidate finite victory staging

VictoryParade consumes the existing won result with at most five rescued friends
and twelve decorative pieces. Existing species gestures play twice at most,
ending by9.88 seconds. A pure run-ID hash selects an occasional suitable flip
without advancing reward randomness. Lite uses one gesture cycle and six pieces;
Reduced/Static show calm large artwork. Hiding or switching to calm motion latches
that mounted stage quiet, so returning cannot replay it. No new media, timer,
animation-frame owner or save schema. The projected victory sound is anticipation;
it is not a durable-earned fanfare. [B contract](plans/DELIGHT-24-friend-victory.md)
keeps A pickup presence and C successful-write fanfare distinct and queued.

## Current hazard and loot continuation — 2026-09-06

HAZARD-02 candidate0.22.14 replaces whole-surface pulsing and filtered masks with
local water crests, small molten cores/currents and seven deterministic poison
bubble owners per pattern. Bubbles vary duration3.8–6.2s, phase, size and drift;
translation uses each mark's own bounding box. Full has local motion, Lite no FX,
Reduced/Static composed still marks. No new JS animation loop or media. See
[contract](plans/HAZARD-02-readable-living-surfaces.md).

The Human now requests real physical collection and persistent rainbow XP.
[LOOT-03](plans/LOOT-03-physical-collection-and-progression.md) supersedes the older
presentation-only restriction for its explicit future slices, but today's reward
renderer still credits through the old immediate engine behavior. Do not describe
decorative particles as persistent pickups until the run/save/claim owner ships.


Candidate, 2026-09-06. Root Astra implements; actual Sol independently reviews.
Baseline is published v0.22.9, source cbe8ab8, current docs 7ad3816.
This is a bounded first Plan02 slice, not the whole VFX overhaul.

## What the player gets

Gold and Science pickups scatter chunky stars/atoms into navigable space,
bounce against static walls, then gather into Ame's current presented position.
Potions and each meaningful combat bash release rose Power beads. Short coloured
trails, local sparkle and a restrained ascending collection cue make arrival
legible. These are original code-native effect glyphs, not regenerated world
sprites or permanent EXP crystals. Existing exact notices explain every amount.

## Authority and boundaries

- Consume immutable committed events only. No engine, drop table, solver,
  campaign, save, RNG-stream, enemy reward or permanent progression change.
- Large amounts use representative tokens, never one object per point. Reward
  credit and object resolution never wait for presentation. Cancellation keeps
  the existing final game state, exact feedback and persisted run.
- Combat keeps its three contact times and 2220ms lock. Its existing typed
  transfer steps remain the sole exact-number authority; the transfer window
  begins 200ms after each contact to make room for roughly80–140ms of release
  and the following homing travel. All three bursts are admitted on that same
  absolute clock at battle start, not spawned by independent delayed callbacks.
  Every displayed pair conserves Power. Reduced mode keeps its existing180ms
  result; no physics is required to understand or earn a reward.
- Replace the old chest-to-wallet flight, not the notice or wallet ledger.
  No new enemy/rescue currency is implied by Power or pickup effects.
- One transient owner, at most24 Full/12Lite tokens and one animation callback.
  No React frame state, world transform writes, particle filters, per-token
  timers, dependency or downloaded effect art. Hidden, blurred, navigated,
  resized, discontinuous, cancelled or static/reduced contexts clear work.
- Compare a reused DOM pool with a viewport Canvas using the same glyphs and
  simulation. Canvas, if selected, is clipped to the visible board, DPR capped
  at1.5 and each axis1536px (9MiB maximum backing buffer), allocated only while
  a burst is alive, then released. Never a level-sized backing surface. The
  same24-glyph/trail/shadow/group-label comparison selected Canvas:1 node versus
  97 reused DOM/SVG nodes, p95 drawing work0.8ms versus1.0–1.6ms locally. Both
  had approximately17ms p95 frame intervals. Recorded browser Paint events were
  2 versus670/674, but Canvas drawing/GPU work is not counted by that event and
  is not free. This is loaded-host local evidence, not physical qualification.
- Physics uses tile coordinates, deterministic presentation-only seeds,
  <=8ms collision substeps and bounded elapsed time. Tokens cannot tunnel into
  walls. No actor/hazard collision or gameplay occupancy is invented. If a
  moving recipient cannot be reached safely, expire the decorative token;
  preserve exact receipt and never fake an audible arrival through a wall.
- Arrivals use the calibrated SFX bus, at most one short grouped cue per80ms,
  no per-point audio. Mute/hide/navigation cancel the owned cue handle. Existing
  global24-voice cap and unsupported-audio safety remain.

## Acceptance and release

Pure tests cover grouping, conservation, deterministic seeds, wall/corner
collision, frame stalls, lifetime/cap and render-space projection. Integration
tests cover real engine-derived treasure/potion/combat routes, moving camera,
Full/Lite/Static/reduced, interruption, subsequent input and unchanged rewards.
Inspect actual-size scenes, transitions, bounded resource teardown and native
save/reopen. Loaded-host timings remain report-only, not iPad acceptance.
Prototype cap: +6500 gzip9 JS / +600 CSS, zero public bytes; measured allocation
and independent review are required before publishing. Rollback the complete
reward rendering/audio/typed-timing seam to v0.22.9; no data migration needed.

Deferred: new drop tables/Mimics/rescue Gold, permanent XP, richer hazards,
continuous pickup-glow correction, connected pit art and remaining Plan04.

The current exact notice surface is retained, including its pre-existing
single-visible-notice replacement behavior. A multi-receipt queue is remaining
Plan02 work; the first slice does not claim to have delivered that overhaul.
On interrupted or unreachable homing the receipt/wallet remains, but no false
arrival sound is played. Potions keep immediate existing numeric truth; combat
uses its exact two-counter presentation. Neither is a second reward ledger.
