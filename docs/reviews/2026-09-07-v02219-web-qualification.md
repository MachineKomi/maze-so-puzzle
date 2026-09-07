# v0.22.19 — cold reward draw and settled-loot resizing

Frozen runtime **d4720370a7e6d6407f35e5c5188e86817e71259c**, branch
`codex/cold-reward-performance`, [PR10](https://github.com/MachineKomi/maze-so-puzzle/pull/10).
All local gates and independent review are complete. Web18 remains live pending
the qualified PR merge, guarded deployment and public verification.
Astra is sole runtime writer; actual Sol independently reviews source/images/data.

## Scope and correctness

Physical Gold/Science count drawing uses one shared digit atlas and existing
stage scale, avoiding first-draw bounds/font work. An auxiliary-atlas failure
uses the original text path; main-Canvas failure retains SVG. Power keeps its
existing immediate rule credit, text and actual-Ame targeting. A board observer
refreshes resting loot after real size changes, ignoring unchanged initial
notifications so a synchronous Power burst is preserved. No value, save, drop
timing, motion mode, wall, camera geometry, media or dependency changes.

700 tests, TypeScript/Vite, budget/contracts and exact d472037 CI34090943602 pass.
`reward-cold-corrected-browser` passes **43 cases**:11 camera/map,12 jump/boundary,
10 physical loot/save,5 number/cache/resize and5 Power/overlay. This supersedes
the42/43 earlier067ee53 matrix whose dense-Power failure led to the correction;
do not pool those as85 distinct cases. New tests include empty-ledger resize
remaining1x1 without a reward running transition, DPR1/2/3 backing-size parity,
grounded-save conservation, missing auxiliary/main Canvas and digit clipping.
Windows CI is compilation only: published Windows0.22.9/native0.22.10 hold remain.

## Frozen bytes and explicit costs

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| index.html |1070|c3b4fe59a7757e13533aee6d44b435b57e01f60f587e16159ce0fd2da95e3daf|
| assets/index-CSATG8jl.js |618310|2db1f61dc2dc9b08b5ea6e879e9e0c79e8cfdf5dda7688f4a67fe4bec2029aa3|
| assets/index-BVffqDNp.css |120280|050565a839dbd47fb285909012a0e2b9a596bbc268f0a4f3b212204b6e501c7b|

Runtime inputs8ad63a5bab828854922f9a7ae5949db0e03e8b3d5302e4dcd0cb5c94d31690c0;
dist214d7e76fe9033759d6964e85d90e8dba5dc9a3e15f09477d4ad454412c91d2d.
JSgzip9 **172411**, +408 over18, ceiling172485 after the named128-byte additional
allowance and existing headroom. CSS24170/public155542751 remain unchanged.
The720x128 atlas is368640 ideal RGBA bytes plus implementation overhead, once per
page. It is a small added cache, not measured RAM saving. The main reward Canvas
still shrinks to1x1 when empty; no persistent reward frame/timer is added.

## First interaction versus entry tradeoff

Exact public18 entry versus frozen19; five alternating pairs plus separate
warmups per profile, CPU4, Chromium151 on the same Windows host. No parallel
browser workload. CPU4 is not Apple/3GB/GPU/thermal emulation. The loot frame
cohort has no traces or prototype wrappers, but adds a separate800ms Continue
rAF/DOM sampler. Its small observer/sampling overhead applies equally; it is a
same-harness diagnostic comparison, not pristine timing or presented GPU pixels.
The two sampled windows exclude the intervening wait and cannot establish total
end-to-end journey duration. All route endpoints conserve Gold8/steps/position.

| Metric,18→19 |844x390 DPR3|1080x810 DPR2|
| --- | --- | --- |
| Opening max median / worst,ms |66.7/66.7→50/50.1|66.7/66.734→50/50|
| Opening intervals >34ms, five runs |5→5|5→4|
| Mount max median / worst,ms |270.4/287.2→282.9/293.7|253.6/257.6→281.5/313.7|
| Mount terrain-DOM median,ms |250.9→257.2|237.6→256.6|
| Combined sampled intervals >34ms |20→17|20→19|
| Combined sampled intervals >20ms |31→34|27→27|

Opening p95 stays<=16.8ms. Phone improves every paired maximum by about16.5–16.7ms;
tablet improves four pairs, with one50→50 pair. Entry is slower, especially the
retained tablet313.7ms pair0. This is a deliberate slower-entry/better-first-input
trade, **not a net cold-start speed win or elimination of the remaining hitch**.
Actual Sol independently recomputed and conditionally supports that distinction.
Raw `reward-cold-loot-frames/report.json` SHA-256:
525101e42cc8ada062236f10cdbb4a562d5a4920f64be245127a7dec8d186b21.

## Separate work and ordinary-camera controls

All four cohorts completed,24 contexts each (five pairs plus warmups/profile).
The work cohorts enable timeline traces only after maze entry; they have no
mount/prototype wrappers. Trace work can overlap and is not additive CPU/GPU time.
Ordinary movement is16 reversible steps in Shiny Sword with an empty ledger.
The loot route is the same4.3s authored Gold8 journey on both18 and19.

| Traced work median,ms,18→19 |Phone|Tablet|
| --- | --- | --- |
| Loot Raster |614.060→629.297 (+2.48%)|892.866→886.890 (-0.67%)|
| Loot Paint |186.289→186.028|189.979→192.718|
| Loot Layout / styles |45.992/322.610→45.889/345.018|61.510/324.669→63.818/313.899|
| Ordinary Raster |751.093→767.148 (+2.14%)|1058.777→1062.004 (+0.30%)|
| Ordinary Paint |199.878→201.771|217.082→218.612|
| Ordinary Layout / styles |81.393/362.957→87.462/361.684|126.847/338.658→126.098/343.737|

The separate **untraced ordinary** control has p95<=16.8ms, worst33.5→33.4ms
phone/33.4→33.5 tablet, zero>34ms on both sides and five-run>20 counts7→5 in both
layouts. Rebase-adjacent worst<=16.8ms. Candidate main reward backing stays1x1,
running=false before/after. No route/state/terrain-mutation/page-error/broken-image
failure in any cohort. These small work differences do not establish a total
rendering-cost reduction; they support a bounded first-interaction optimization.

| Raw report under external `performance/` | SHA-256 |
| --- | --- |
| reward-cold-loot-work/report.json |b385fdc2cfd72dfd1ecae0fcaee48ccdbd23b18d9f100136b06836cc78f139e1|
| reward-cold-camera-frames/report.json |91ebf3863de28fd6273cd18850e39d4b934c8abb46864b90dfc00971bfc49478|
| reward-cold-camera-work/report.json |4bbda92d17499aa556fa4e4016dd3b1fa7a7b5676d2ffa1f97c72111b7bf0c32|
| reward-cold-summary/summary.json |16c288f23de3f1b6475d5e6892da9da260e9bdc1b4c45305a69a8eb1abc1a89d|
| reward-cold-summary/integrity.json |f2e4a50cedd2203476c42d4ec703eb97fca0dff71d667c93efac5180159f753c|

Each runner asserts final source/dist identity before returning; all returned0
in serial session10963. Raw reports serialize the starting buildIdentity, not an
invented buildIdentityAfter. The final integrity receipt rechecks the same
frozen d472037 inputs/dist and zero runtime/native diff. All owned browsers and
servers stopped. Astra and [actual Sol](2026-09-07-cold-reward-sol-final-review.md)
accept this limited web trade; publication remains a separate verified step.
[Phase diagnosis](2026-09-07-cold-reward-opening.md)
retains failed hypotheses and prior attempts.

## Remaining work and recovery

Q08/P19 still owns affected iPhone13/iPad8 camera/entry/first-opening observation;
the successful iPhone17 control does not establish a RAM floor. No WebKit/native/
physical-device or Human feel acceptance. Keep the tablet startup tail visible.
Next independent delivery is LOOT-03 B's deterministic final-defeat enemy reward
tables/campaign-total audit, then mixed chests/Mimics, recognition XP and inventory
before eggs. Preserve the wider roadmap.

A corrective release may restore only this presentation seam to18 if needed;
retain v4 ledger/migration/claims/completion receipts and CAMERA-17. Never deploy
a v3-only writer, clear family saves or bypass the Vercel guard. Artifacts remain
outside the repository in the [ledger](../LOCAL_ARTIFACT_LEDGER.md); no deletion,
archive, native package or repository/media clone.
