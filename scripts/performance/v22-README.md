# V22-PERF-01 normal-run evidence

These Node/Playwright scripts use the repository's existing ephemeral browser
dependency convention. They do not require a product dependency or runtime probe.
Do not run a competing build/browser cohort during measured rows.

The baseline was built at `461cab02b065a1d0f654c49189ed24108c22c5a8` and frozen
outside the repository at
`C:/GameDev/maze-game-qa/performance/v22-perf-01/baseline/{src,dist}`. Its original
`build-provenance.json` is preserved there. The harness also writes complete
SHA-256 manifests of the delivered files and frozen source tree.

## Running

```powershell
node scripts/performance/v22-cohort.mjs --phase=baseline --dist=C:/GameDev/maze-game-qa/performance/v22-perf-01/baseline/dist --source=C:/GameDev/maze-game-qa/performance/v22-perf-01/baseline/src
```

For a candidate, build and freeze its source/dist first, then supply those paths
and a new phase/output directory. Each phase has a separate output directory.
Never compare a frozen baseline against a candidate edited during measurement.

Options use `--name=value`:

- `--only=smoke`: three representative rows.
- `--only=isolation`: five-follower normal Full plus six one-factor experiments.
- `--only=matrix`: the twelve input/follower/quality/motion rows, omitting isolation experiments.
- `--only=counters --instrumented=true`: separate diagnostic production build,
  three input rows, a coordinate-only trusted-touch probe and Sound-overlay
  toggles. Vite injects
  counters into source during this build; nothing is added to runtime source.
- `--only=soak --soak-ms=600000`: ten minutes in the same normal large-maze run.
- `--soak-quality=full` or `--soak-quality=lite`: quality for a dedicated soak.
- `--trace=true`: optional external CDP trace with paint/raster/layout summaries.
- `--row-ms=12000 --repetitions=3`: default short-row sample settings.
- `--soak-ms=0`: omit the soak for a short run.
- `--out=C:/external/fresh-directory`: override the default external directory.
- `--screenshots=true`: capture a final image per row outside the repository.

Default matrix: 0/2/5 friends with board touch under Full/Lite, five friends with
keyboard/fixed pad under both quality settings, five friends with Reduced motion
under both qualities, six effect/storage experiments, and one ten-minute soak.
The browser is Edge at 1194×834 CSS pixels, DPR 2, with trusted CDP touch input.
This is desktop emulation, not physical iPad evidence.

## Fixture authority

`v22-fixtures.mjs` solves Moonlit Friendship Quest with every friend required,
then replays the solution through the engine. It selects genuine playing-state
prefixes with zero, two and five rescues, computes a common reachable corridor,
and validates a reversible ordinary-move cycle for every state. Setup may cross
an already-traversable hole/portal but cannot acquire tools, open doors, collect
loot, fight or rescue additional friends. The cycle itself contains only ordinary
moves. The existing sanitizer creates schema-v3 normal active-run saves.

Each browser context resumes one such normal save. No tester path, rescue-ID
injection, synthetic enemy or changed terrain is involved. A pre-measurement cycle
unspools followers. The runner asserts exact steps/positions and follower count.
The persisted profile uses the normal existing default-progress factory with the
campaign unlocked only to permit normal navigation in this isolated test profile.

## Interpretation

Every result is contaminated/report-only on the active development host. Frame
tails, long tasks, supported heap/resource trends, CDP task/style/layout deltas,
semantic final state and active effects are retained. rAF input proxies do not
prove when the screen displayed pixels. Counters/tracing have explicit overhead;
use ordinary production rows as the primary timing comparison.

The storage experiment bypasses `setItem` for the active-run key only. It retains
normalization and serialization and is **not** a total autosave bypass. The
instrumented build separately times the complete `writeActiveRun` call. Shipping
persistence and loss windows remain unchanged.

The cursor-only probe starts a touch at Ame's settled centre, samples thirty
one-pixel neutral jitters, and requires zero engine movement. Initial mount and
release occur outside its counter window. This tests redundant App/MiniMap/scene
work without confusing ordinary movement commits with cursor-coordinate commits.

Follower-count comparisons necessarily also change legally resolved world state.
Presentation-only follower hiding is a separate experiment. The soak tests
sustained play in the same large maze; it does not qualify all multi-maze asset
transition behavior. Minute-level resource samples and raw frame timestamps allow
session-window comparisons without per-frame bounding-box/style reads.

Heavy JSON, traces and screenshots stay external. `summary.json` retains artifact
hashes; only compact reviewed evidence should later enter repository documentation.

The reviewed V22 matrix used `--row-ms=6000 --repetitions=3 --soak-ms=0`:
every row completed two whole cycles/40 moves, extending the requested minimum.
Do not describe those rows as twelve-second samples. Full sustained runs request
600,000 ms; the separate Lite diagnostic requests 180,000 ms. These are repeated
same-maze routes, not transition or retained-heap qualification.

On a segment timeout the harness now writes `failed-segment.json` **before**
releasing the gesture, with semantic state, focus/visibility, cursor/dialog state
and collected metrics. This capture runs only after failure; successful timing,
the ten-second timeout and exact-route assertions are unchanged. A failure summary
or a crash directory containing only manifests is not a completed cohort. Preserve
it and use a fresh output directory when investigating; never replace it with a
successful retry. Captured LongTask `self` names are not causal stack attribution.

## Input and Full-visual regressions

With the same ephemeral Playwright packages available:

```powershell
node node_modules/@playwright/test/cli.js test --config scripts/performance/v22-input.config.mjs
node node_modules/@playwright/test/cli.js test --config scripts/performance/v22-shared.config.mjs
node scripts/performance/v22-visual.mjs
```

Set a different external `MAZE_PERF_EVIDENCE_DIR` per run. Both test configs serve
production preview only, with no competing development server. The shared config
runs the unchanged six-scenario/five-sample browser cohort. The visual script
compares Title/Home/maze at four viewports; exact geometry and pixel results are
reported separately, and the screenshots still require visual inspection.
