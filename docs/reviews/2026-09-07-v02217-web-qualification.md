# v0.22.17 — bounded camera rendering

Frozen runtime **eff0530820760fa7a5f22ac5ae68327dad626653**, PR8,
`codex/bounded-camera-performance`. Astra writes runtime; actual Sol reviews
independently. **Qualified for scoped web publication; public verification pending.**
The [plan](../plans/CAMERA-17-bounded-scene-performance.md) preserves the Human
report, Claude-report source/hash, research, implementation and acceptance.

The world/foreground/masks now use at most FOV+4 tiles per axis, rather than the
whole maze. The same travel owner synchronizes origins, viewBoxes and fractional
translation before paint. Stable full-world wall geometry/texture phase remains.
Animated liquid paint has a separate lower SVG; dry floor, banks, wall shade and
the tall walls remain above it. Grouped minimap terrain retains original palette,
fog, current/remembered distinction, guidance, markers and accessible text.
No engine/save, art scale, field of view, dependency or public-asset changes.

## Source, correctness and visual evidence

672 project tests, TypeScript/build, budget/contracts/evidence schemas, production
dependency audit and deployment guard pass on the candidate path. The guard's
nine default cases pass, with three explicitly opt-in history cases skipped.
Exact eff0530 CI34079400584 passes Linux verify and Windows compilation.
Windows compilation is separate from native release acceptance: Windows0.22.9
remains published, native0.22.10 separately held. No new native package is built.

There are78 distinct passing browser cases across retained source-matched runs:
14Book/MOVE comfort,18movement/input/follower/save,12jump/shared-clock boundary,
10hazard/material/mode,13wall/art racks,6camera/map/resize,3controlled adjacent
rebase and2actual map-palette cases. The expanded first run passed72/73; one
follower computed-layout difference was0.011px, below a1/64 CSS-pixel quantum.
Both complete five-friend journeys passed with a strict0.025 painted-pixel bound.

Root subsequently found black minimap terrain that structural tests and Sol's
initial visual review missed. Direct pixels reproduced the blocker at DPR1/3.
Intrinsic shared-path fill repaired SVG use-instance paint; final eff0530 reruns
all11camera/map/resize/rebase/palette cases. Both densities now exactly show
floor246/217/145, wall116/115/162, mystery58/55/79 and remembered189/176/148.
The [diagnostic trail](2026-09-07-camera17-diagnostics.md) preserves the rejected
palette, quantization/probe failures and stopped old-source comparison.

Actual before/after rebase frames at DPR1/2/3 preserve floor/wall/liquid phase,
cast/rim lines, actors/followers/items/cage/hole alignment. The camera advances
.08tile while retained origins move two tiles; all three SVG roots agree.
These use a controlled16ms clock and paused ambient/poses for visual review,
not frame-performance measurements. Real-time six-maze/layout samples separately
check shared origins/geometry across every sampled ordinary movement and resize.
Sol's initial palette impression is explicitly superseded by his fresh review
of the corrected images and exact pixels. His [independent final review](2026-09-07-camera17-sol-final-review.md)
accepts the exact frozen candidate within the documented Chromium web scope.

## Exact frozen entry

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| index.html |1070|8bc65a2ac96e3dc6de94ac7b968c0a4dea3abd5853f57df7d0340b056b85dfcf|
| assets/index-CTYfMU9E.js |602800|060cd653186d4888965c047858c1a6e1eae64282da478e89c115646f513118fe|
| assets/index-BVffqDNp.css |120280|050565a839dbd47fb285909012a0e2b9a596bbc268f0a4f3b212204b6e501c7b|

Gzip9 JS167081/167157 ceiling, CSS24170/31158; public155542751B unchanged.
Versus live16, +1009JS/+96CSS. The named900JS allocation covers824 bytes over
the old ceiling and76 bytes of compression variation; no new media/dependency.
Runtime fingerprint63df7943d79b2bceb7ff54bb73cba2c01fc5cf2e47c93e7b0c6a6d27ca7dac80;
distd87ba46a9bbb58d50a2b41274d786cc7107ae9aade63158ee5ae7750609da7d0.

## Measurement and release boundary

Final five-pair CPU4 cohorts completed on eff0530 against verified public16 entry
815deb0/runtime09d5475, sharing unchanged media. Frame cohorts disable trace and
LayerTree; work cohorts use normal Paint/Raster tracing without picture snapshots.
Each uses alternating order, separate warmups, same current-engine save, exact
sixteen-step return and matching served hashes. CPU4 is a defined Windows CPU
throttle, not Apple/low-memory/GPU emulation. Balanced power plan was observed;
host power/thermal/background conditions are not fully controlled. No full
Plan07/physical-device acceptance is claimed. These restored normal routes use
Full quality, Regular pace and matching muted preferences. They test scene work,
not combined sustained audio/thermal load on the affected hardware.

All30 untraced candidate samples (three routes ×two layouts ×five runs) have
p95≤16.8ms, worst≤33.4ms, no intervals over34ms. Counts below include all five
measured runs; raw denominators remain in the reports. Maze2 is essentially
parity on this host, not evidence that its reported Apple defect is resolved.

| Route / profile | Intervals>20ms,16→17 | Frames,16→17 | Median Raster ms,16→17 (separate traces) |
| --- | ---: | ---: | ---: |
| Four visible hazards,844×390/DPR3 |47→12|1329→1322|2177.299→1602.918 (−26.380%)|
| Four visible hazards,1080×810/DPR2 |77→9|1317→1324|3999.052→1822.382 (−54.430%)|
| Shiny Sword,844×390/DPR3 |4→6|1285→1282|1796.390→742.564 (−58.664%)|
| Shiny Sword,1080×810/DPR2 |7→7|1289→1284|3054.273→1044.086 (−65.816%)|
| Lanternlight,844×390/DPR3 |4→4|1330→1292|2110.384→952.185 (−54.881%)|
| Lanternlight,1080×810/DPR2 |11→6|1332→1287|3952.168→1171.719 (−70.353%)|

The hazard trace cohort has one candidate tablet50ms outlier versus that
baseline's33.4ms worst. Do not hide it or pool it with untraced frames. Candidate
traced tablet p95 remains≤16.8ms versus baseline33.3ms; no repeating>34ms cluster
was observed. Hazard Paint median is+1.61% phone/−3.01% tablet; Lanternlight Paint
is−20.81%/−18.24%. Trace categories overlap and are not additive, GPU time or
user-perceived latency percentages. The initial25% raster target is exceeded in
all six measured work rows, but no isolated minimap attribution is claimed.
Shiny Sword Paint falls41.59% phone/42.91% tablet in its separate trace cohort;
its traced>20ms counts are11/1297→6/1283 phone and6/1300→8/1290 tablet,
with both versions worst≤33.4ms and no>34ms. Trace and untraced counts differ
and are deliberately not pooled. Some other work categories increase: hazard
UpdateLayoutTree medians+17.30%/+8.81% and Layout−7.53%/+23.91%. These overlap
with other categories and do not erase the measured Raster reductions.

Each route has exact expected steps/return, zero page/broken-image errors and no
wall-path mutation. Window/mask rebases are allowed and explicitly counted.
During hazard journeys, whole-document nodes fall856→361; Lanternlight886→386;
Shiny Sword348→246. The large minimap has26nodes in the inspected final fixture,
with no per-tile DOM. The unthrottled Chromium reference uses the same hazard
route at844×390/DPR3 and1280×720/DPR1, five pairs each. All20 measured baseline/
candidate samples have worst≤16.8ms, zero>20/34ms. This is a browser reference,
not a native Windows application test.

The separate final layer inspection (one pair, no trace) measures largest maze
content extents2668²→1160² CSS pixels phone and2177²→947² tablet. However total
layers increase20→26 and19→25: five bounded content surfaces replace the largest
one. Summed drawsContent rectangles are9809349→9474390 and6454028→6224385 CSS
square pixels (only−3.41%/−3.56%). These include overlapping/root/filtered surfaces
and are not allocations; neither81% total RAM reduction nor a precise memory
budget is supported. The intended win is bounded largest paint extent and less
raster work, with a disclosed extra-layer cost.

On Shiny Sword (maze 2), layers increase 13→20 phone and 12→19 tablet.
Summed content rectangles increase 4213585→6681536 (+58.57%) and
2715244→4363000 (+60.69%) CSS square pixels. Three bounded content planes
replace the old arrangement. This is a material compositing tradeoff, not
measured allocated RAM. It prevents claiming that every maze uses less memory.
The [promotion controls](2026-09-07-camera17-diagnostics.md#compositor-cost-controls-on-the-corrected-source)
show why the extra caching is retained. Dropping all hints saves layer rectangle
area but increases phone Raster138.23% across five pairs. Removing only the
parent/foreground hints increases Raster22.44% phone/47.13% tablet in a diagnostic
pair. Removing child hints makes hazard Raster52.87%/26.74% worse. The direct
five-pair16→17 maze-2 comparison above measures58.66%/65.82% less Raster work.
Astra and Sol accept the bounded extra-layer cost for this measured camera-work
benefit; no conditional maze/UA/RAM downgrade is introduced. Their engineering
acceptance does not close physical efficacy or residency.

The sustained diagnostic uses one pair plus separate warmups, 16 repetitions
of the ordinary 16-step route: exactly 256 steps and return, 128 candidate
window rebases, no path mutation, broken image or page error. Measured duration
is 72.397s for16 and 69.331s for17. Intervals over20ms fall61/4283→4/4156;
both worst33.4ms, neither over34ms. Candidate rebase-adjacent worst is16.8ms.
Nodes350→361 and images36→39 match the endpoint of the short journey, rather
than growing with cycle count. This supports bounded repeated-route behavior;
69seconds and rounded JS heap are not a physical thermal/cache-memory soak.

Theoretical10×10 versus23×23 moving backing area is81.10% smaller per equal-scale
surface; versus31×31 it is89.59% smaller. This is not total RAM saved or actual
Apple compositor residency. Raw report heap readings are privacy-rounded and do
not establish memory sufficiency. Q08/P19 owns the affected-iPhone13/iPad8 changed-build check;
the iPhone17 successful control does not establish a RAM floor.

All outputs are under `C:/GameDev/maze-game-qa/performance/` and belong in the
[artifact ledger](../LOCAL_ARTIFACT_LEDGER.md). No files are deleted or archived.
Revert the complete CAMERA-17 seam to16 if necessary, preserving saves/media and
the Vercel guard. Continue LOOT-03 in dependency order after this correction;
physical efficacy remains open until actually tested.

## Raw final report identities

All paths below are relative to `C:/GameDev/maze-game-qa/performance/` and name
`report.json`. Recompute with `node scripts/performance/summarize-camera-review.mjs`;
never combine instrumented work, layer snapshots and untraced frame populations.

| Folder | SHA-256 |
| --- | --- |
| camera17-reviewed-hazard-frames | 67b62204379eb7263a9177ac019cfabfeec77b012454b49fb720667317620af5 |
| camera17-reviewed-hazard-work | 3b6d05fdd688491989694655e5efe9d57a936eb72de44232b195abc2e78131fd |
| camera17-reviewed-layers | 9d2c3846a41d05b36c90a1affdf14cf8cc04018b8a41d2af79690f04cc66b993 |
| camera17-reviewed-maze10-frames | 09bb4064e6562843a1b364984665dc9261fa16a6e915b23755c2abf8de9c5f03 |
| camera17-reviewed-maze10-work | 18ce6cc78228ad7176ff321a3794410aeeb53d02ff711d611f423c78646e5ef9 |
| camera17-reviewed-maze2-frames | 1d547d0aaf585d56b96d5012231b724d5d38d88efad3637302437ce3529e9105 |
| camera17-reviewed-maze2-layers | 1c7efbd00af24344711d8ca06f7529248d7364e279bb9ba8b7a9ba5a87c1e7ec |
| camera17-reviewed-maze2-work | 181919cb988e5846ed5ffb80f602ffe9bf5d3465cbb3b01d1289a6a7562f9d08 |
| camera17-reviewed-reference | d1c4d4cf11fe7364f1e10fb7e4f9b4d1a41a27d70be670a42564958dce99dd0d |
| camera17-reviewed-sustained | a39fc7926dc93cd58800e96e94ca80613a0b5a3db6d9bcc1934c78e0381f8223 |
