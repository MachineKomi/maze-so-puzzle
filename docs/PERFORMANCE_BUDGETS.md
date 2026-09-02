# Performance budgets and evidence contract

Status: Pass 07A measurement infrastructure, 2026-09-02. Timing thresholds are
provisional and report-only. Deterministic fixture and byte non-regression
checks are active.

This document is the operational companion to
`docs/plans/07-performance-web-tauri-plan.md`. It separates historical release
facts, current static evidence, contaminated diagnostic measurements,
provisional targets, and unavailable cohorts. A number must not move between
those classes without a new reviewed artifact manifest.

## Evidence classes

| Class | Meaning | May support a release claim? |
| --- | --- | --- |
| Historical 0.19.0 | Evidence recorded for the released 0.19.0 artifact/source pair. It is useful for continuity, not a current-HEAD timing baseline. | Only for the named 0.19.0 artifact. |
| Newly measured static | Recomputed bytes, hashes, dimensions, reachability, and source signals for the named commit/build. Machine speed does not affect the result. | Yes, for those static properties. |
| Newly measured host-gated | A production/release cohort with complete provenance and a clean-host attestation. | Yes, within the recorded hardware/profile scope after variance qualification. |
| Contaminated report-only | A useful diagnostic run with an explicit contamination reason. It may find harness defects and prioritize clean reruns. | No. |
| Provisional target | A design budget awaiting accepted baselines and variance qualification. | No; it is a planning guardrail. |
| Pending hardware | The harness exists, but the required device, WebView, clean host, or duration was unavailable. | No. |

Development-server, production-preview, and packaged-release values are
different cohorts. They must never share a baseline row.

## Reproducibility identity

The current measurement identity is:

| Field | Value |
| --- | --- |
| HEAD | `a34de2f783d2f11c2b543541b4f46ffdf8b13fe0` |
| Commit time | `2026-09-02T15:44:52+01:00` |
| Commit subject | `Integrate expert implementation roadmap` |
| Product version | `0.19.0` |
| Package lock SHA-256 | `817415d527edc16486b49583be02b9a3c99864b60cec4ff9b629f69e462c80c4` |
| Cargo lock SHA-256 | `175bac57da74fbb43c9a99cb95f99834a8b750db051f6ddd9c39e63b77fac6b5` |
| Build command/mode | `npm run build`; Vite 8.2.2 production build and `vite preview` |
| Node/npm | Node 24.13.1; npm/npx 11.8.0 |
| Rust | rustc/cargo 1.96.0; stable x86_64-pc-windows-msvc |
| Host | Lenovo 81X7; Core i7-1165G7; 4 cores/8 logical processors; 8,379,490,304 bytes RAM; Intel Iris Xe driver 30.0.101.1692 |
| OS | Windows 11 Home 10.0.26200 build 26200, x64 |
| Browser cohort | Microsoft Edge 152.0.4191.53; Playwright 1.62.1; headless; 1280×720; device scale factor 1; no throttle; Balanced power mode |
| WebView2 versions present | 151.0.4129.107 and 152.0.4191.53; no accepted runtime cohort yet |

The working tree was clean at the start of Pass 07A. The production build was
created before infrastructure edits. Later inventories record the measurement
files as dirty while the product `src/`, `public/`, HTML, Vite, TypeScript, and
Tauri Git-status set remains clean. The canonical build marker also fingerprints
`package.json`, the npm lockfile, and build configuration. Its dist fingerprint
is `89918548a3fecac241e354ea7eaa4839658d5a346c9f9e48941634bc6f2a91e8`;
the initial browser report's legacy dist-relative form is
`ba8a5ba828f9efb830d32305212df12a975e8e627a05704783c6762b59abd9ed`.

## Baseline versus target budgets

| Measure | Historical 0.19.0 | Measurement baseline `a34de2f` | Provisional target | Enforcement now |
| --- | ---: | ---: | ---: | --- |
| JS, raw | 384,157 B | 384,157 B | Report; prefer reduction | Report-only |
| JS, gzip level 9 | 115,820 B | 115,820 B | ≤115,820 B plus an explicit ledger allocation | Deterministic blocking gate |
| JS, Brotli | 99,302 B | 99,302 B | Report; no unexplained growth | Review gate |
| CSS, raw | 136,287 B | 136,287 B | Report; prefer reduction | Report-only |
| CSS, gzip level 9 | 29,107 B | 29,107 B | ≤29,107 B plus an explicit ledger allocation | Deterministic blocking gate |
| CSS, Brotli | 24,332 B | 24,332 B | Report; no unexplained growth | Review gate |
| Catalog assets (`public/assets`) | 139 / 89,330,098 B | 139 / 89,330,098 B | ≤66,997,573 B, or a measured alternative accepted by review | Reduction target provisional |
| All public runtime files | 141 / 89,394,012 B | 141 / 89,394,012 B | ≤89,394,012 B plus an explicit ledger allocation | Deterministic blocking gate |
| Dist | 144 / 89,915,499 B | 144 / 89,915,499 B | Report by loading phase; static-host compatible | Report-only |
| Portable EXE | 97,871,360 B | Historical artifact only | Rebaseline after asset work; offline bundle required | Pending current build |
| NSIS installer | 91,784,124 B | Historical artifact only | Rebaseline after asset work | Pending current build |
| Lighthouse desktop median | unavailable | unavailable | ≥95 | Report-only after accepted cohort |
| Lighthouse mobile median | unavailable | unavailable | ≥90 | Report-only after accepted cohort |
| LCP | unavailable | contaminated diagnostics only | ≤2.5 s | Report-only |
| CLS | unavailable | contaminated diagnostics only | ≤0.1 | Report-only |
| INP/design response | unavailable | unavailable | ≤200 ms | Report-only |
| Lab TBT | unavailable | unavailable | ≤200 ms | Report-only |
| Gameplay long task | unavailable | contaminated diagnostics only | no task >50 ms during sustained movement | Report-only |
| Reference 60 Hz p95 frame time | unavailable | contaminated diagnostics only | ≤20 ms | Report-only |
| Defined low-end p95 frame time | unavailable | unavailable | ≤33.3 ms | Report-only |
| Ten-minute retained heap | unavailable | unavailable | no unexplained growth >10% after settling and forced GC where supported | Report-only |
| Tauri cold interactive median | unavailable | pending hardware | ≤2 s | Report-only |
| Tauri warm interactive median | unavailable | pending hardware | ≤1 s | Report-only |

The byte gate sums every emitted JS/CSS chunk and every file under `public/`, so
future code splitting or placing files outside `public/assets/` cannot hide
growth. Reductions pass. Growth needs
a positive, reviewed allocation in
`scripts/performance/feature-allocations.json`, supporting evidence, an owner,
and a rollback point.

The two current 0.19.0 executables match their entries in
`release/SHA256SUMS.txt`. The command example labelled “Expected hashes” in
`release/README.md` still contains the older 0.17.0 values and is rejected as a
0.19.0 verification source. This pass does not rewrite historical release
documentation; use the actual artifact hashes and checksum manifest above.

## Current resource inventory

The reviewed static inventory is
`docs/performance/evidence/pass-07a-a34de2f-inventory.json` (SHA-256
`6c6f8be071eed8a2dd595e96c6e95c25ec9b4aa31034b17a885836a040a8a827`).
Its per-file records include bytes, SHA-256, static-literal reachability,
loading-phase classification, dimensions, decoded-image upper bounds, and MP3
frame-scan data.

### By format

| Format | Count | Encoded bytes | Decoded-memory concern |
| --- | ---: | ---: | --- |
| MP3 | 14 | 50,156,671 | Browser-managed decode and stream buffers; frame-scan duration 2,074.656 s. Do not treat that duration as listening QA. |
| PNG | 87 | 31,608,825 | 144,703,488 B RGBA upper bound if all were decoded simultaneously. |
| WebP | 38 | 7,564,602 | 38,307,744 B RGBA upper bound if all were decoded simultaneously. |
| All images | 125 | 39,173,427 | 183,011,232 B theoretical RGBA upper bound; actual residency requires memory profiling. |

### By currently inferred loading phase

| Phase | Count | Encoded bytes | Confidence/use |
| --- | ---: | ---: | --- |
| Title or navigation | 9 | 1,265,521 | High static-literal confidence; runtime requests still need network capture. |
| Title, level entry, or music change | 13 | 49,484,030 | Music catalog references; phase boundaries require browser/audio observation. |
| Level-entry warmup or first use | 100 | 33,198,917 | Static references exist; not proof that every item is fetched on entry. |
| Unclassified/unreferenced | 17 | 5,381,630 | No exact `/assets/...` literal found. This is a review queue, not permission to delete. |

Static-literal reachability finds 122 files / 83,948,468 bytes referenced and 17
files / 5,381,630 bytes unclassified. Dynamic construction and packaged/offline
use must be ruled out before any removal proposal.

## Browser diagnostics from Pass 07A

The five-run production-preview cohort is intentionally rejected as a clean
baseline. The Codex session remained active, only 765,657,088 bytes of RAM were free when
the report closed, and thermal state was unavailable. The numbers below are
diagnostic medians/worst cases, not release claims or evidence that a target is
met.

| Scenario | Semantic-ready median / worst | LCP median / worst | Longest task worst | Frame p95 median | Longest frame worst | Notable checkpoint |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| S01 cold title | 150.0 / 162.2 ms | 172 / 476 ms | 0 ms | 17.0 ms | 233.3 ms | Fresh context, cache disabled |
| S02 warm title | 81.0 / 84.8 ms | 92 / 120 ms | 0 ms | 16.9 ms | 17.1 ms | Shared context; 3,300 B median transfer |
| S03 title to playable | 951.6 / 1,350.9 ms | 152 / 168 ms* | 299 ms | 17.0 ms | 599.5 ms | Includes Chapter 1 and semantic `Start the maze` transition |
| S04 held movement/map | 1,995.4 / 2,014.9 ms hold window | 200 / 224 ms | 0 ms | 16.9 ms | 17.1 ms | Exact solver state verified: steps 18→26; 529 minimap tiles |
| S05 23×23 entry/idle | 608.0 / 706.3 ms | 224 / 296 ms | 58 ms | 33.3 ms | 116.9 ms | `moonlit-friendship-quest`; 529 minimap tiles |
| S08 Book open/scroll | 243.0 / 299.5 ms | 156 / 184 ms* | 105 ms | 16.9 ms | 99.9 ms | Accessible heading checkpoint |

\* S03 and S08 LCP values belong to the initial navigation, not the later click
transition. They are retained as contaminated diagnostics, not transition-LCP
claims.

The compact reviewed summary is
`docs/performance/evidence/pass-07a-browser-summary.json`. The raw report and
artifact manifest remain under the external evidence path recorded in that
summary. The in-app Browser independently inspected the production preview at
1280×720: the title had 77 elements and nine complete images; the 23×23 maze
had 785 elements, 529 minimap tiles, 46 images, one SVG with 16 paths, and an
inline camera style using `left` and `top`.

The first browser attempt is rejected in full. It stopped at the Chapter 1
story because the initial S03 fixture omitted the semantic `Start the maze`
checkpoint. The first S04 implementation is also rejected because a 35 ms
prelude registered only 2–4 of 19 inputs and never reached its claimed solver
state. The manager-reviewed rerun waits for and verifies exact semantic position
and steps; no sample from either rejected attempt was reused.

## Tauri status

`scripts/performance/tauri-baseline.ps1` records artifact identity, OS,
hardware, installed WebView2 versions, power mode, a native-window-ready launch
proxy, root-process memory, and explicit rejection reasons. That proxy only
means the root process is responding with a nonzero window handle; it does not
establish visible or semantically interactive WebView content, cold/warm
classification, process-tree memory, or any other S11 lifecycle checkpoint. It
writes outside the repository and can run in inventory-only mode.

This pass created only an inventory-only pending row for the historical 0.19.0
portable executable. No process was launched and `runCount` is zero. A current
clean Tauri/WebView2 cohort therefore remains pending. See
`docs/performance/evidence/pass-07a-tauri-pending.json`.

## Measurement matrix

Accepted release qualification must use at least five runs per row and report
median, p95 where meaningful, and worst case. Ten runs are preferred for timing
gates after the harness stabilizes.

| Profile | Viewports | CPU/network | Required use |
| --- | --- | --- | --- |
| Reference desktop | 1280×720, 1024×768 | Native CPU, native network | Web and Tauri ordinary-play reference |
| Compact/mobile layout | 844×390, 568×320 | Native CPU and defined low-end | Responsive layout, touch-sized controls, title/Book/gameplay |
| Defined low-end lab | All four required viewports | CDP CPU 4×; 150 ms RTT; 1.6 Mbit/s down; 0.75 Mbit/s up | Cold/warm load and sustained play |
| Additional roadmap coverage | 1920×1080, 1194×834, 960×540 | Recorded profile | Desktop/tablet/window-resize guardrails |

Each cohort must record cache state, cold/warm definition, level ID or fixed
seed, semantic checkpoint, power mode, thermal availability, build mode,
browser/WebView version, and all rejection reasons. S01–S11 are defined in
`scripts/performance/fixtures/scenarios.json`.

## Guardrails for later agents

- UI: preserve legibility, accessible names, focus order, 960×540 logical-stage
  behavior, all required viewports, and reduced motion. Measure DOM and layout
  deltas for overlays and the Adventure Book.
- Art: report encoded bytes, dimensions, decoded-memory upper bound, sharpness
  at intended display size, alpha/color changes, loading phase, and offline
  reachability before replacing or removing anything.
- Lighting: retain material identity and directional readability. Test water,
  lava, poison, holes, fog, shadows, masks, and reduced motion on S06.
- VFX/animation: preserve meaningful feedback and delight. Measure overlapping
  combat, rescue, jump, portal, door, treasure, ambient, and reduced-motion
  states; do not judge an isolated idle scene only.
- Gameplay/controls: routes come from the current engine and solver. Preserve
  held cadence, combat interaction semantics, portals, hazards, saves,
  accessibility, and correctness before accepting a speed change.
- Audio: preserve local/offline playback and perceptual quality. Measure title,
  entry, track change, hide/show, and repeated transitions; do not infer decode
  cost from encoded bytes alone.
- Campaign: every level or asset addition needs a loading-phase classification,
  reachability evidence, and a ledger allocation if compressed/runtime bytes
  grow.
- Tauri: never replace a WebView2 result with Edge browser timing. Record the
  executable hash, WebView2 runtime actually used, cold/warm definition, window
  readiness condition, and process-tree memory.

## Do not optimize yet

Pass 07A authorizes measurement infrastructure only. It does not authorize
memoization changes, camera transforms, minimap virtualization, persistence
debouncing, media conversion, asset deletion, audio policy changes, cache
changes, code splitting, animation removal, or Tauri runtime changes. Do not
remove valuable ambient delight or one-off effects based on static source
counts. Confirm player-visible benefit and regression risk in Pass 07B first.

## Handoff contract

Every later Plan 07 agent must:

1. Record HEAD, dirty-tree state, lockfile hashes, tool versions, build mode,
   artifact hashes, OS/hardware, browser/WebView, viewport, throttle, power,
   thermal availability, scenario, and timestamps before comparing results.
2. Run `npm run build`, `npm run perf:check`, the focused scenario fixture test,
   and `npm run perf:inventory` before and after a candidate change.
3. Keep raw traces outside runtime delivery. Retain a compact reviewed summary
   with the raw artifact path and SHA-256.
4. Use stable level IDs and semantic checkpoints. Generate long routes from the
   current engine; never paste direction strings or pixel coordinates into a
   fixture.
5. Keep timing report-only until an accepted clean cohort establishes variance
   over at least two sessions and the Manager explicitly promotes a gate.
6. Update the feature-allocation ledger before accepting compressed JS/CSS or
   public-runtime growth. Include owner, reason, evidence, expiry/review date,
   dependencies, and rollback point.
7. Mark missing Tauri, low-end, mobile, memory, Lighthouse, or field evidence as
   pending. Do not infer it from a different surface.

## Commands

```powershell
npm run build
npm run perf:check
npx vitest run scripts/performance/scenario-fixtures.test.ts
npm run perf:inventory -- --output C:\evidence\inventory.json

npm install --no-save --package-lock=false --ignore-scripts @playwright/test@1.62.1
$env:MAZE_PERF_EVIDENCE_DIR = "C:\evidence\browser-run"
$env:MAZE_PERF_HOST_GATE = "clean"
$env:MAZE_PERF_VIEWPORT = "1280x720"
$env:MAZE_PERF_RUNS = "5"
npm run perf:browser

npm run perf:tauri -- -Executable C:\build\maze-so-puzzle.exe -Output C:\evidence\tauri.json -HostGate clean
```

The Playwright install is ephemeral and must not change `package.json`,
`package-lock.json`, or Cargo manifests.
