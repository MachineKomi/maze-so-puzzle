# EXPLORE25 — qualification record

Candidate web0.22.25, frozen runtime **c931bc3c8b69c1f52d8c7dacdd21771cd6b5ae5c**.
Baseline is published24 runtime d880b223. [Contract](../plans/EXPLORE-25-spacious-maze.md),
[Human request](../user-playtests/2026-09-07-spacious-maze-request.md), and actual
[independent Sol review](2026-09-07-explore25-sol-review.md) govern this slice.
**Status: published0.22.25 after actual independent Sol support and exact reviewed-head CI34144445337. [Public receipt](2026-09-07-v02225-public-verification.md) binds both origins.**

## What changed

The default rail starts at34% of logical available width, bounded360–520px.
Folding narrows it to240px, or288px in short windows for a side-by-side map/pad
dock. The maze fills the remainder with square cells and a bounded continuous
viewport. Whole-map lessons stay intact. Ultrawide zoom respects the12-cell
long-axis cap; six cells is a starting scale, not a minimum field of view.

Real viewport tile centres own fog, minimap and Book discovery. Wider viewing
can reveal more; switching back never erases knowledge or changes moves/rewards.
The held-input and existing scene/canvas resize owners remain authoritative.
Classic presentation is available in More, with a reachable return action.
Phone/short collections are labelled status icons, with full detail controls
in More. Phone toolbar targets are at least28 physical pixels; detail rows44
with subpixel rounding. Enlarged text has a real scroll reader containing its
objective and collections, with fixed navigation and movement controls.

Accepted wall geometry, scene depth, physical loot, saved game/profile schemas,
artwork, dependencies and deployment guard remain unchanged. No map/control
overlay obscures gameplay. No new animation loop or full-repository/media clone.

## Correctness and retained development evidence

All packets below are external under `C:/GameDev/maze-game-qa/performance`.
The complete local project suite passes **769 tests in78 files**. The frozen
runtime's exact-head CI34142703900 passes; Windows compilation is not native
release acceptance. Final reviewed-head CI34144445337 subsequently passed before promotion.

- `explore25-frozen-browser`:27 passed plus the retained phone More-target failure.
  It covers nine screen sizes, all Friends/Bag cells, square-cell geometry,
  Classic and keyboard return focus, actual-view monotonic fog,8 walk/jump
  Full/Lite/Reduced/Static fold cases, and four existing door/weapon/depth checks.
- `explore25-touch-r2`:5/5 on final c931 bytes. Real touch with safe-area insets,
  seven full-size Bag details and four enlarged reader cases pass. This resolves
  the portal target failure: the portal must carry stage scale and the sizing
  rule must live in the dialog CSS layer.44px may measure43.9947 after transforms;
  the probe uses a0.1px tolerance, not a reduced target specification.
- `explore25-camera-r1`:34 passed plus a retained stale direct-Sound selector.
  Covers actual adjacent rebase pixels at DPR1/2/3, minimap palette, six travelling
  maze/profile cases, hole-jump planes/shared clock/resize/portal boundaries and
  physical reward/save contracts. Camera probes now read both viewport axes.
- `explore25-access-final`: corrected rapid-approach → More → Sound jump contract
  passes. Its earlier phone composition failures are superseded by the final
  nine-size composition proof, not ignored.
- `explore25-functional-final`:17 passes plus the superseded portal target check.
  Actual Gold and Science remain conserved and visible through fold/expand
  Canvas resize on phone and tablet, then collect normally on approach. It also
  supplies a current-engine four-step hazard fixture and the mounted Full
  water/lava/poison proof.

The first r1–r4 layout/access packets remain available. They exposed and drove
fixes for clipped collections, tiny interactive phone cells, short-height rail
composition, hidden-reader semantics and physical detail targets. They are not
passing release evidence. Source-matched follow-ups name each resolution.

## Timing method and initial variance

Compare frozen24 entry files with source-matched25, sharing only verified
unchanged public media. One headless Edge workload at a time, DPR2, CPU4 throttle,
844×390 and2560×1080, candidate actually folded using its button. Five alternating
pairs per profile plus an excluded warmup pair. Timing is separate from traced
work; trace totals overlap and are not additive. These are same-host diagnostics,
not physical Apple/3GB/GPU-time/native acceptance or a minimum RAM specification.

Initial `explore25-moving-frames` has24 rows/20 measured. Both profiles have median
per-run p95≈16.8ms, but two adjacent phone candidate runs have p95≈33.4ms and
21/23 frames above20ms. Later candidate phone runs return to1–2 such frames.
Ultrawide pair4 slows on both sides (baseline26/candidate23 frames above20ms).
Retain these tails; they do not by themselves identify a gutter or device cause.

`explore25-moving-work` has24 rows/20 measured. Median traced Paint/Layout totals
are lower in the candidate: phone763.0/103.0ms versus883.4/148.5ms; ultrawide
838.1/308.9ms versus911.0/349.6ms. Candidate DOM starts347 versus354; its maximum
observed layer count is reviewed separately. No runtime optimization is inferred
necessary from the initial clustered timing tail. A repeated untraced phone
cohort and separate jump/idle cohorts determine the final recommendation.

## Completed comparison and bounded recommendation

All five cohorts completed against frozen c931: **108 rows, 90 measured** after
excluding warmups. `explore25-summary/paired-summary.json` binds each full report
SHA256, per-run tails and medians. The repeated phone cohort has candidate
over20 counts1/1/1/1/1 versus baseline0/0/4/2/3; all ten p95 values are16.8ms.
Jumping has p95≈16.8ms in every measured run: candidate phone over20 counts
0/0/0/1/1, ultrawide0/0/0/0/0, versus baseline1/0/1/0/1 and3/1/3/0/1.
Idle beside live hazards has no over20 frames on either side, both profiles.
Every measured moving row makes16 real engine steps, jumping8 and idle0;
all90 measured rows have zero page errors, broken images or terrain mutations.

The trace samples one extra compositor layer (phone31 versus30; ultrawide30
versus29). The largest reported CSS layer area increases from1,345,600 to
2,152,960 on phone and2,913,849 to5,655,040 on ultrawide. These are compositor
dimensions, not measured GPU memory. Traced work is mixed: median RasterTask
rises43.213→52.218ms on phone and50.577→53.034ms on ultrawide; ultrawide
UpdateLayoutTree rises489.263→516.809ms. Sol's review records those costs beside
the reduced Paint/Layout totals. The larger view therefore retains a real
surface cost even though this host's traced Paint/Layout totals fall. Keep the
12-cell axis cap and Classic fallback; do not infer low-memory acceptance.

No sustained candidate frame regression reproduces in the confirmation, jump
or idle cohorts. The initial clustered tails remain in the evidence and are
not attributed to laptop age, RAM or gutters. No speculative gutter alteration
was made. This supports bounded web promotion subject to actual independent
review and CI, while physical affected-device qualification remains open.

The browser union contains **64 distinct affected contracts with passing latest
results**, listed with their supplying packets in
`explore25-summary/browser-contracts.json`. This is a union of corrected packets,
not one clean64-case run. The complete unit suite remains769/78.

Official `npm run perf:check` passes: Node gzip JavaScript180083/181169 bytes,
CSS26588/31622, public media155555324/165031011. Runtime inputs SHA256
`29ad749020187674b297951cde0095c97b79cbe354ce0252d4278a756d06b91a`;
dist fingerprint `2d36f270def90ae2730c58d6d2832f15b9d4a3bfa20d9ec3c1ac6524fe4438e6`.
Entry files are bound in `explore25-summary/entry-identity.json`:

| File | Bytes | SHA256 |
| --- | ---: | --- |
| index.html |1070|2eb59921ec6173156dacc0229cc082c36e98100c655d25de0b67405f126c682c|
| index-CWYizNHt.js |641570|40c06e13887d489126f5e25685f7a10666763c6ce88171e96c66f604a1699492|
| index-DX5X-e50.css |135888|ed7a18dda85e83e9e9dc47df9b36160e39dbb67cd9024ca56d946216307604ba|

## Publication and Human follow-up

The independent review and subsequent public receipt bind final promotion,
exact reviewed-head CI and served journeys. The artifact ledger lists retained
packets; no files are deleted or archived.
Q11/P25 is the requested family comparison. Q08/P19 physical iPhone13/iPad8/cold
Power remains open; latest fully published Windows stays0.22.9 and0.22.10 native
qualification is separately unfinished. After this direct UI request, resume
DELIGHT A/C then LEARN-01; preserve usable Garden dependencies before rare eggs.

## Frozen timing report hashes

| Packet | SHA256 |
| --- | --- |
| explore25-moving-frames | f6be476207acd0136cee1e403a4b971521aef2cd1385f4d90de8416658461987 |
| explore25-moving-work | 2eb0cd2f38cbc050ea0ea8af5f4fa2089a6f5af8b581bad475d7cda793b1bad7 |
| explore25-phone-confirmation | d38e050d4531749e593a197b90d23b789806aed75ad4b4b33591a8306da6b6fc |
| explore25-jump-frames | e1a18d7637d4aea7db08ccb1184e05d77885c53e005bfe3a7ed5fd5119d0e2a7 |
| explore25-idle-frames | 0e12f978eace2a0eafe7c61cd69ed790fe55777cc27821338e59addfdd3657c3 |
