# v0.22.15 — wall volumes and grounded field artwork

Runtime source **e69f3e4191305106e7cc77de6bbfedd2296ccb68** on
`codex/wall-balance-sprite-depth`, PR6. Astra sole runtime writer; actual Sol
independent source/pixel/performance reviewer. **Published and publicly verified
as web0.22.15**, release source1e8b465 with exact release CI34071195810 passed.
[Public receipt](2026-09-07-v02215-public-verification.md) binds both origins and
two fresh public journeys. All paired runs and the
[actual Sol closeout](2026-09-07-wall04c-sol-final-review.md) are complete.
The published predecessor is
corrected0.22.14/0856104.

## Delivered candidate behavior

WALL-04C preserves the Human-accepted tall3D direction. Exposed horizontal and
vertical cap widths are.47tile, projected height.81, skew.18 and rear overlap.28.
The flat W underlay is unpainted; actual projected cap/side geometry defines the
silhouette. Cast reach.30/opacity.25 and rim.035/opacity.64 respond to eight
normalized light bearings. No logical terrain, collision, solver or save change.

Maze actors, enemies, friends and field items use90% alpha-visible tile width,
with intrinsic proportions and ground anchor.765 midway between wall foot edges.
Taller artwork can extend above its tile. One original paint graph is reused
in a separate foreground SVG, restricted to rear-adjacent tile bottoms and moved
by the existing travel clock. Held equipment, replacement actors, labels and
shadows share registration. Caged friends retain complete original cage frames
and recognizable cropped faces; rescue uses the same starting registration.
Approved512 details improve field resolution without adding any public asset.
Decorative rewards are larger with the same finite pool/credit/timing semantics;
this does not implement the physical LOOT-03 economy or account XP.

## Source and gameplay evidence

- Final664 tests/67files, TypeScript/build, deterministic byte contracts and
  production dependency audit(0vulnerabilities) pass. Deployment guard unchanged;
  nine default cases pass, three history-only cases intentionally skipped in
  that run. Exact runtime-source GitHub CI34069961527 passed.
- Analytic complete side-fill/rounded-cap containment across all512 local masks
  plus campaign geometry; separate SSR foreground-band containment. Rim/AA and
  browser paint are not claimed by analytic tests. Eight normalized lights
  recompute identical gameplay fingerprints and preserve input objects.
-58-ID contract freezes the entire eligible field-detail set, exact canonical
  and selected source/geometry/socket tuples. Future same-class additions fail
  this gate until reviewed. Non-field reward/badge icons are excluded.
-41-case browser matrix at1f8ab73 passed with no skips/flakes:40 campaign scene
  contexts, two maximum23×23 generated journeys, shared-clock jump/quality/resize/
  blur boundaries, doors/battle/portal, five followers, saves/Book/reopen,
 16 real reward contexts, dense24 cap/cleanup and13 complete art racks.
-Actual Sol found a Power-label clip in the five-friend screenshot despite that
  passing matrix. Final change from1f8ab73 is only label board-margin.16→.36tile;
  source behavior/pixels otherwise unchanged. Two complete post-fix five-friend
  journeys plus reversals at780×312/1194×834 assert the complete badge inside the
  board with2px margin at every settled checkpoint. Actual Sol inspected both
  corrected frames and resolved the blocker. Earlier clipped proof is retained.
-Actual source grayscale sheets cover both eight-light stone/hedge sets. Sol
  confirms bounded wall/floor/actor/object separation. This is not Human beauty
  approval or a color-vision/physical-device study.

## Frozen bytes

| Entry | Bytes | SHA-256 |
| --- | ---: | --- |
| index.html |1070|0718f87a9abae6b26bbc57243a876b1eb11f3bd607e7f7654b113753931f530d|
| assets/index-BGe6P2K8.js |598420|9efdebdfa194e6ed6a084d437ff888550a37b5ff308c43fe5cd3786f9b119148|
| assets/index-BMjZ25aw.css |121429|023de600bfbfde4110d27d4f415797dab41b3058bd505703e26479fa3b32147f|

Gzip9 JS165902 against166057 allocated ceiling; CSS24216 against31158.
Public155542751B unchanged. The scoped500-byte JS allocation admits the
registration/foreground seam, not unrelated growth or a frame-time waiver.

## Final paired evidence

Serialized five-pair moving/jump/idle cohorts plus separate warmups at780×312
and1193×833, DPR2, against exact corrected14 HTML/JS/CSS with unchanged media.
Final folders are `wall04c-release-{moving,jump,idle}-20260907` beneath
`C:/GameDev/maze-game-qa/performance/`. Full served hashes, route/return checks,
raw traces and frame intervals are retained. No screenshot occurs inside timing.
Median-of-medians and paired ranges must be named separately; overlapping trace
durations are neither additive nor GPU/frame time.

All three cohorts completed on e69f3e4 with the exact frozen candidate JS hash.
Each has24 rows: four warmups and20 measured samples. Every moving sample makes
16 steps and returns, every jump sample makes eight jumps and returns, and
every idle sample retains zero movement with four visible hazard cells.
No terrain mutations, page errors or broken images. Across all60 measured
samples, maximum frame interval is16.8ms and none exceeds20ms or34ms.

Changes below compare candidate median duration against baseline median duration
within each viewport/mode (not the median of individual paired ratios):

| Route / viewport | RasterTask | Paint | UpdateLayoutTree | Layout |
| --- | ---: | ---: | ---: | ---: |
| Move780 |−0.92%|+1.46%|+11.97%|−3.17%|
| Move1193 |+5.51%|+0.47%|+8.58%|−4.23%|
| Jump780 |+5.48%|+6.19%|+25.56%|−2.75%|
| Jump1193 |+22.11%|+11.75%|+34.77%|+10.08%|
| Idle780 |−12.51%|−0.49%|−0.94%|−3.76%|
| Idle1193 |−11.47%|+1.99%|+8.40%|+2.76%|

The jump increase is real work, not a claim of equal cost. Desktop Raster median
is5692.796→6951.478ms across roughly4.8seconds; parallel trace durations overlap.
Task counts rise, consistent with the added clipped paint graph and travel work
in source. No ablation causally apportions that increase between foreground,
enlarged artwork and other presentation changes. The same travel owner adds one
foreground translation write without a new clock, React frame state or layout
read. Jump styling adds30.771/36.023ms total per
phone/desktop sample (roughly.11/.13ms per displayed frame); desktop Layout adds
3.468ms total. Astra accepts this bounded cost for the requested visible benefit
and clean measured cadence. Sol independently accepts the cost within the same
bounded release scope. A whole-maze
compositor cache was not introduced to conceal the cost with a large GPU surface.
Physical energy/GPU/low-end/thermal results remain unmeasured.

The public verifier also records the observed `data-wall-lighting` value instead
of a stale literal from the previous release. Its assertion already required
`04c-balanced-v1`; this receipt-only correction changes no game bundle bytes.
Scripts remain build-eligible under the deployment guard, so this correction
is included before the single release promotion, not in its docs-only closure.
The release commit may include this helper and the qualification records after
runtime freeze e69f3e4. Public identity must still match all three frozen hashes.

## Scope and follow-through

No physical iPad/Safari/native/thermal/low-end success follows. Windows
Application Control blocked the separately installed WebKit DLL; no bypass or
replacement was attempted. Chromium proves cross-SVG reuse; no second-engine
pass is claimed. Latest published Windows remains0.22.9, native0.22.10 held.
Human wall acceptance applies to13's direction; Q01 owns15's refinements.

Q02 jump remains independent. The Human's14 hazard criticism is revision-required,
not silently accepted or fixed here. Next: reproduce/fix Book-selected completion
flow, then HAZARD-03 floorlip/feather/appropriate motion, then LOOT-03 and the
preserved roadmap. [Routing](2026-09-07-playtest-routing.md),
[Human queue](../HUMAN_REVIEW_QUEUE.md), [artifact ledger](../LOCAL_ARTIFACT_LEDGER.md).
Do not delete/archive retained outputs without explicit Human approval.
