# Tall walls, crisp dressing and jump camera — web0.22.13 qualification

Astra,2026-09-06. Runtime `dfe04a93bcfd06a5548d51a4523b3625382ab0f1` on
`codex/jump-camera-delight`. This record tracks engineering qualification;
publication is now verified in the [public receipt](2026-09-06-v02213-public-verification.md)
at final source e59d0f9. The Human's wall beauty
judgment remains unresolved/P13. Windows remains0.22.9; staged native0.22.10,
physical iPad, acoustic and full sustained-device acceptance remain separate.

## Implementation and source

[Candidate contract](2026-09-06-tall-wall-integration-candidate.md) and
[WALL-04B](../plans/WALL-04B-tall-walls-and-readable-paths.md) explain the actual
geometry. Height is0.88814140625tile,1.15×unchanged Ame visible standing height.
Sectioned caps retain tall front faces while protecting every non-wall cell;
fixed face-light groups, cap/side texture mapping and restrained floor cast
establish depth. Dressing is sparse, seeded, small and crisp with no added fade
or blur; intact approved source sheets are unchanged. The existing travel clock
now drives airborne ground position and camera together. No gameplay rules,
save schema, dependencies, new media or extra rendering loop.

654 project tests pass, including every authored cap boundary, height/geometry
and deterministic dressing contracts. TypeScript and production build pass.
JS594,615B/164,431gzip9; CSS119,481B/23,895gzip9. Relative to qualified0.22.12:
+1,982gzip9JS, -21gzip9CSS, unchanged public media155,542,751B. `perf:check`
passes the bounded500JS jump plus2,000JS wall/dressing allocation. This does not
substitute for moving performance. Frozen entries are
`index-DbTd2mCo.js` and `index-B-a8vIxf.css`; the build provenance identifies
the runtime above. Subsequent harness/docs edits do not enter these payloads.

## Three serialized paired movement comparisons

Raw packets live under `C:/GameDev/maze-game-qa/performance/`:

1. `wall-jump-five-pairs-20260906`:8 reversible Wishing Woods hole jumps against
   exact frozen public0.22.12. The baseline camera stays still during each jump;
   the candidate smoothly moves throughout it.
2. `wall-ordinary-five-pairs-20260906`:16 reversible ordinary Twilight Treasure
   Loop steps against the same qualified public baseline.
3. `wall-only-jump-attribution-20260906`:same8 jumps, comparing the candidate
   against a diagnostic copy of its own JS with only the default wall-mode
   literal changed from `tall` to `depth`. New jump clock, dressing, media and
   scene are identical. This instrumented control is **not a published version**.

Each packet has five measured baseline/candidate pairs plus one warmup pair per
780×312 and1193×833 viewport, DSF2:24 rows each,72 rows total. Order alternates.
The owned server verifies exact served entry hashes; public media identity is
checked against baseline source. The attribution helper requires exactly one
observed compiled expression and records its replacement and both hashes in
`wall-only-depth-control-20260906/identity.json`. No production source override
or broad substitution is used. Only HTML/JS/CSS and identity are copied.

Host: Windows10.0.26200, AMD Ryzen AI5 340/Radeon840M,23.29GiB visible RAM.
Headless Chromium151.0.7922.34, installed Playwright1.62.1, Node24.19.0. Timing
runs were serialized with no other agent browser/build work. These are local
browser viewport cohorts, not physical phone/tablet tests or GPU-time readings.
Trace durations overlap across threads and cannot be added as frame cost.

| Comparison | Viewport | Median baseline/candidate RasterTask ms per route | Median paired change |
| --- | --- | ---: | ---: |
| Jump vs public0.22.12 |780×312|1,586.461 /2,138.995|+34.83%|
| Jump vs public0.22.12 |1193×833|6,180.064 /7,542.230|+21.78%|
| Ordinary vs public0.22.12 |780×312|1,689.476 /1,809.767|+9.19%|
| Ordinary vs public0.22.12 |1193×833|4,689.080 /4,453.995|-4.78%|
| Wall-only jump attribution |780×312|1,906.833 /1,879.219|+0.06%|
| Wall-only jump attribution |1193×833|5,947.479 /5,912.625|-3.52%|

The paired change is the median of five individual candidate/baseline ratios,
not a ratio of independent medians. For every measured cohort, pooled p95 is
16.7–16.8ms, p99/max16.8ms, zero intervals over25ms. All72 routes have identical
accepted movement/end position, zero terrain mutations, zero page errors and
zero broken HTML images. All warmups are retained separately: the ordinary
1193×833 candidate warmup had one33.4ms interval; the other11 warmup rows had
max16.8ms. No warmup is silently counted as a measured pass or discarded failure.

The candidate spends more raster work than the old fixed-camera jump. The
same-clock wall control does not show a comparable wall-specific increase on
this host/route. This supports a bounded camera-smoothness tradeoff, not a
universal performance improvement or proof that the old laptop caused R1's
problem. Ordinary small-viewport cost also rises and remains recorded. R1's
earlier+37.4% new-host result and the non-diagnostic shadow isolation remain
valid historical evidence; this is a different implementation with a visible
height change. Full Plan07/device coverage stays open.

## Gameplay and independent review

Final production-browser matrix passed28/28 in
`tall-wall-release-browser-20260906`: airborne camera/mode handoffs, delayed
commit and logical resize, isolated compound portal, rapid approach and actual
Sound Static→Full, held routes, seven viewport/input cancellation cohorts and
real door/battle/hole/portal transitions. The two material/actor cases capture
20 scenes each across all16 authored mazes, including late equipped/follower
states. Eight detached raster proofs use the actual mounted SVG/clip IDs:
zero pixels outside the original wall footprint at610² and1380², covering
rounded corners, holes and diagonal contacts. Gameplay terrain stays immutable.

Another5/5 pass in `tall-wall-generated-book-20260906`: caged-encounter discovery
and reload, scaled phone input/modal/rotation, explicit audio reset, and two
maximum generated23×23 scenes. Only Date.now is fixed to select a reproducible
normal Surprise seed (`ame-mtqh4w05`); movement/rAF timers remain live. Both
routes replay24 engine attempts, retain unchanged terrain and have zero errors
or broken images;79 SVG descendant nodes, sampled JS heap about76MB. Heap is
a point observation, not a memory ceiling or leak study. The absolute game
ceiling24 is distinct from the largest supported odd generated dimension23.
Total33 distinct current-source browser cases; predecessor83-case evidence is
not relabeled as a fresh33+83 run.12 deployment guards including real history
pass; production dependency audit reports zero vulnerabilities.

Sol independently inspected integrated source and rendered comparison panels,
then recomputed all three paired reports and freshly viewed six production
frames with held swords/followers, goal, doors, pits, lava/water and compact
layout. His actual recommendation is **release-ready for this bounded web
preview**, contingent on the28-case pass and deployed-byte parity. The pass is
now complete; publication remains separate. He found clear bounded volumes
and unambiguous floor topology. Nonblocking observations: pale cap bands can
look slightly translucent on icy material; small autumn acorns are the most
item-like dressing. Keep P13 open rather than speculate about Human acceptance.
Sol explicitly retains the higher jump work, warmup spike and device limits.

Root admits this bounded web release: the wall-only attribution is approximately
flat, real route/frame evidence is stable, and the continuous jump-camera cost
buys the requested visible motion. No universal performance/beauty claim follows.

## Release boundary

Keep the existing Vercel guard. Finish final checks and independent review,
commit/push the exact checkpoint, confirm CI and unchanged remote main, then
one Git-integrated deployment. Verify canonical/alias bytes and public browser
smoke. Documentation-only closure must skip a second build. No deletion,
archive, dependency environment, full worktree copy or native package is part
of this slice. [Artifact ledger](../LOCAL_ARTIFACT_LEDGER.md) owns retained outputs.
