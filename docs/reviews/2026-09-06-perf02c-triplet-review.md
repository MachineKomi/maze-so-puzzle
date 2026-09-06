# PERF-02C: one completed desktop triplet, not efficacy evidence

2026-09-06. Assessment: **share with caveats as an isolation diagnostic only**.
The r4 triplet completed on unchanged v0.22.4 source/build. In this Edge run the
single world hint created an independently mapped layer, and transform-only
restoration preserved camera translation. Paint-event count was lower during the
hint, but summed Paint duration was higher than both surrounding baselines and
rAF p95 did not improve. This does **not** establish a performance improvement,
an iPad/Safari fix, visual equivalence, resource safety or release readiness.

## Identity and bounded procedure

- Frozen source: `C:/GameDev/maze-game-v0224-release`, commit
  `45d843774d0335aa0ae1ee51aa9ca2f70f235b31`; root-owned preview
  `http://127.0.0.1:4196`. Exact clean source, build provenance, served entry JS/CSS
  equality and unchanged final source/build passed. No runtime edit or rebuild.
- Fresh isolated `perf02c-r4` profile; Edge `152.0.4191.62`, headless Windows,
  viewport 1194×834, DPR1, board 682×682 CSS px, world 1250.328125 CSS px square.
- Full quality / Full motion / Regular source duration 200ms; eight keyboard
  taps per row with 260ms automation waits. Duration is pinned from source,
  **not** independently measured travel duration (`observedTravelDurationMs:null`).
- Current frozen engine replays pure legal Maze 2 movement: initial (9,9),
  setup Left, Left, Up, Up, Up to (7,6), then (Down, Up) ×4 per row. Coordinates
  are zero-based. No pickup, rescue, reward or follower event; zero followers.
- Exactly baseline → world `transform:translateZ(0)` → restored baseline.
  Steps **5→13→21→29** intentionally advance. Restoration is not whole-state
  rollback. The clamped segment is **untimed baseline setup only**, not a timed
  clamped-versus-scrolling comparison.
- Five setup intermediate/settled geometry checks are separate from timing.
  Before each row, fonts were loaded and all 28 selected image entries decoded,
  complete, positive-sized and unchanged, including two active 1024px terrain
  sources. Readiness gates took 108 / 1.1 / 1.4ms, outside trace/frame windows.
  These gates intentionally warm relevant resources; rows share cache/state.

## Saved observations, not a speedup estimate

| Row | Steps | Automation window ms | rAF p95 / max ms | Paint events / summed ms | Layer count |
| --- | --- | ---: | ---: | ---: | ---: |
| Baseline | 5→13 | 2259 | 16.8 / 33.2 | 387 / 501.770 | 17 |
| World hint | 13→21 | 2346 | 16.9 / 17.0 | 313 / 524.686 | 18 |
| Restored baseline | 21→29 | 2363 | 16.8 / 17.3 | 408 / 424.301 | 17 |

The hint's recorded inline transform was `translateZ(0px)` and computed transform
`matrix(1, 0, 0, 1, 0, 0)`; the only changed inventory property was
`.camera-world.transform`. Individual translate stayed
`-45.4545% -36.3636%` at the matched endpoints. All ending position/camera checks
passed; restoring removed the inline transform and returned computed transform
to `none`, without overwriting individual translate. Final position (7,6),
camera approximately (5,4), step29, settled. This verifies the sampled geometry,
not every displayed frame or pixels.

Only the hinted row mapped the world backend node to a 1250×1250 CDP layer,
reason `Trivial3DTransform`, paintCount **1→1**. Baselines had no world-layer
mapping, not proof that no compositing occurred. Inventory preserved terrain
filters, fills, opacity and blending, plus image identities; there was **no**
screenshot/pixel/seam inspection. Full-quality assets remained configured, which
is not a demonstrated pixel-equivalence claim.

Raw rAF count/p95/max and Paint count/duration sums were independently recomputed
from each saved `values[].dt` and `trace[]` using PowerShell sorting/filtering and
`Measure-Object`; they match the driver summaries. p95 uses sorted index
`floor(count*0.95)`, not interpolation. Samples were 133 / 140 / 141; no reported
interval exceeded 50ms, no long tasks were reported, and no bounded log overflow
or dropped trace rows were recorded.

## Literal rejected attempts and harness correction

All original output/profile directories r1/r2/r3 remain intact. None contains a
timed row and none is performance evidence:

- r1: `Error: ReferenceError: URL is not defined`; setup/restoration null.
- r2: `Error: Error: Wrong settings, visibility or tester mode`; rejected at
  initial step0 using obsolete tester text.
- r3: same literal error after first setup move, step1: introductory
  `Tester preview: Shiny Sword. Rewards stay unchanged.` toast had disappeared.

Root had corrected sandbox origin/wait compatibility. Astra inspected frozen
`AdventureHud.tsx:97` and the live r3 snapshot, then changed **only** external
tester observation to the persistent `.level-kicker` aria-label suffix
` · Tester preview · not saved`, recording the label. Fixture, geometry tests,
three-row order, readiness gates and transform ownership remained unchanged.
`node --check triplet.mjs` passed. Fresh r4 completed on the first additional
attempt; no fifth attempt or expanded matrix was used.

## Trace limits and remaining gates

The 6.968 seconds of automation windows are a single fixed-order warm-cache
cohort, not equal-duration/cold-start trials or repeatability evidence. Numeric
rAF/long-task callbacks and keyboard events run during timing; DOM geometry,
computed styles and readiness are outside it. Trace boundaries include setup
for instrumentation. Paint totals aggregate the retained page-wide complete
events, not isolated world raster work or an exclusive GPU/CPU cost budget;
durations must not be summed across categories as independent costs.

`CompositeLayers` recorded zero matching events in all rows: that metric is
**unavailable for interpreting compositor cost in this trace configuration**,
not zero work. GPU memory, actual raster/tile memory and displayed frames were
not measured. Layer dimensions and JS heap do not substitute for GPU memory.

Root handed over the exclusive browser/perf slot and reported no concurrent
heavy jobs. Active Codex/OS, previous attempts, unknown thermal/current power
state and low/changing free host memory remain contamination: 977,326,080 bytes
before → 658,948,096 after. Audio was not silently muted or acoustically verified;
CDP AudioHandlers rose 19→35→51→67 across windows. That is observed evolving
page state, **not a diagnosed leak**. No GC/retention/soak claim is possible.

This does not waive the [PERF-02C preflight](2026-09-06-perf02c-layer-preflight.md):
DPR/large-world/follower/visual-seam/resource checks and actual iPad/Safari benefit
remain unrun. No runtime candidate, release or publication was authorized here.

## Reproduction and evidence

Preparation/helper directory:
`C:/GameDev/maze-game-qa/performance/v22-perf-02/c-prep`.
Completed evidence directory:
`C:/GameDev/maze-game-qa/performance/v22-perf-02/c-triplet-r4`.
`identity.json`, `fixture.json`, `geometry-and-setup.json`, three separate
`*-state.json` / `*-frames.json` / `*-cdp.json` sets and generated browser driver
are retained. `summary.json` hashes every listed artifact. The adjacent r1/r2/r3
directories retain original failures and their exact serialized drivers.

Executed from `c-prep`, after fresh-profile snapshot-based tester entry:

```powershell
node C:/GameDev/maze-game-qa/performance/v22-perf-02/c-prep/run.mjs --run C:/GameDev/maze-game-qa/performance/v22-perf-02/c-prep/config-r4.json
```

Do not rerun into r4: the runner rejects existing output. Fresh profile/entry
commands and cached CLI path are in the preparation README/config. This review
does not authorize another run.

- r4 summary SHA256: `8de753f26d818e55762a5bc996e2e0362074c34c353229195fd7c3ab39641e08`.
- r4 identity SHA256: `e3f3266e6c23c59232318a7741261f565426b3bf762e0da833215c499fd3bf08`.
- Adapted triplet SHA256: `d8b9b234e977909ee13924e1eabba1e9a77b6dfe4f5a3e570429f94de8f053a0`.
- Frozen dist fingerprint: `2273be74ed6959ec4f24ea7c314a82d051637f041f90248768fb6fea337e0459`.

Ownership: r3 and r4 CLI browsers closed; r1/r2 confirmed already not open.
Exclusive browser/perf slot returned to root immediately after r4 closure.
Root's preview session41282 was left untouched; root subsequently confirmed
preview4196 closed and handed the heavy slot to Sol for separate qualification. Only external
helper/config/README and this new review were edited; no commit or push.
