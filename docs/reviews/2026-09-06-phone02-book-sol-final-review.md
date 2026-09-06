# Sol final review — PHONE-02 / BOOK-02A / default mix

Review date: 2026-09-06

Reviewer: actual Sol (GPT-5.6), independent read-only runtime/evidence review

Disposition: **no blocker to one guarded Web deployment within the bounded scope below**

This disposition covers the v0.22.12 Web candidate using the accepted v0.22.10
wall predecessor. It does not promote the held R1 wall candidate and does not
claim native, physical-device, family-comprehension, acoustic, universal
performance or Human beauty acceptance.

## Exact source and bundle boundary

- Frozen runtime commit: `e18c6eee27fbb26c3a3c76e0ee96e586d593b1bf`.
- Release/test commit: `3ea515ca822786b2c2e520a90f8931161a9d9fe3`.
- Five-pair harness commit: `5013ea7ea2c985487b9824ffd2ffbd6a9fb8079f`.
- The diff from the runtime commit through the harness commit contains only the
  BOOK-02A plan, candidate review and two performance-test files. It contains no
  runtime source.
- Candidate JavaScript: `index-BPKRGxyO.js`, 588,935 raw bytes, SHA-256
  `816505e73976d41499f7abbc2ab74835ea861b7dd7fbec9fb7ef4b8c8cd9aff9`.
- Candidate CSS: `index-CNtPFkFx.css`, 119,742 raw bytes, SHA-256
  `bd96c37fce43dce81d6d5e902bf20a3c13dd007c7bf30c1ac53b4ec215cc1ab4`.
- Frozen baseline JavaScript SHA-256:
  `e4cb4b603e531a4a67da0bab5bae26599bf594237d9005fb699a8b5a043b135a`.

I inspected the final source for the fitted HUD, stage/portal coordinate mapping,
reward canvas, catalogue renditions, progress migration/discovery, Sound defaults
and focus return. I found no static runtime blocker. The HUD now clears stale
fitted columns before the enlarged-reader zero-height return and bounds column
choice against available width before applying the 32/48 logical minimum. The
phone context is an effect dependency. Save schema 7 retains the v6 storage key,
refuses writes over a future profile, derives legacy friend discovery only from
species-specific proof and preserves safe future IDs without counting them.
Recommended Music 65 / SFX 85 changes fresh/default restoration while preserving
saved v2 gains, the legacy implicit `.22/1` fallback, mute state and reset
separation. Portal focus, pointer coordinates, reward targets and the bounded
canvas consistently account for the fitted stage scale.

## Functional and resource evidence

The final-source local project run records 60 test files and 649 tests passing,
followed by a successful TypeScript/Vite build. The production budget gate,
12 deployment guards and production audit also pass. The Vite raw-chunk warning
is covered by the explicit gzip budget; measured gzip9 sizes are 162,449 bytes JS
and 23,916 bytes CSS, with 155,542,751 public bytes.
Root also reports GitHub Actions run `34057314317` passing `verify` and desktop
compile at the latest test head. I did not independently query that remote run
because the local GitHub CLI is not authenticated, and a desktop compile is not
native execution acceptance.

Broad browser r4 retained 79 passes and three stale-probe failures. The three
corrected probes then passed against the unchanged bundle: exact Sound label and
sole playing lane after its 400 ms crossfade, current phone focus return, and
physical presentation size under stage scale. This is 82 distinct functional
cases across retained runs, not a manufactured single 82/82 transcript. The
retina resource case adds one further distinct passing case, for 83 total.

`C:/GameDev/maze-game-qa/performance/phone02-book-retina-20260906/phone-book/retina-book-resources.json`
confirms the root engineering disposition at phone 780x312 DSF3 and tablet
1194x834 DSF2. Mounting Friends fetches all 32 256x256 field sprites, for an
8,388,608-byte RGBA upper bound. Mounting Bestiary fetches all 12, for a
3,145,728-byte bound. Hidden tabs are unmounted and no unknown presentation image
is requested. Browser lazy margins load the full mounted roster, so this evidence
does not claim visible-card-only loading or decoded-cache release after unmount.

Retina record SHA-256:
`4380da712a17ed3c9cc6df7d601e5bec2d726b28477cee4754ec9ae95c0d170a`.

## Final five-pair performance review

Raw report:
`C:/GameDev/maze-game-qa/performance/phone02-book-qualified-five-pairs-20260906/report.json`,
SHA-256 `f150e77191bb3dcfabd0f40a15b84cbe60411e7bf716eaa076a58fd840df9d21`.
Its 24 rows comprise one excluded warmup pair and five measured pairs at each of
780x312 and 1193x833. Each run uses a fresh isolated browser context and no-store
responses; fonts/images are decoded and settled for 500 ms before the fixed
Twilight Treasure Loop route. All rows make the exact 16 accepted moves and
return to the same position, with zero terrain mutations, page errors and broken
images.

I independently recomputed the aggregates from the raw rows. They match every
aggregate stored in `summary.json` at its reported precision:

| Viewport | Mode | Frame median / p95 / worst ms | RasterTask median / p95 / worst / mean ms | Paint median / p95 / worst / mean ms |
| --- | --- | ---: | ---: | ---: |
| 780x312 | baseline | 16.7 / 16.8 / 16.8 | 1085.251 / 1140.098 / 1140.098 / 1090.514 | 456.771 / 461.830 / 461.830 / 458.176 |
| 780x312 | candidate | 16.7 / 16.7 / 16.8 | 1113.500 / 1161.188 / 1161.188 / 1108.727 | 457.179 / 460.794 / 460.794 / 456.925 |
| 1193x833 | baseline | 16.7 / 16.7 / 16.8 | 4352.058 / 4402.188 / 4402.188 / 4305.064 | 507.924 / 527.465 / 527.465 / 508.500 |
| 1193x833 | candidate | 16.7 / 16.7 / 16.8 | 4116.184 / 4187.175 / 4187.175 / 4112.275 | 494.328 / 513.040 / 513.040 / 493.344 |

Candidate RasterTask mean changes are **+1.67%** at 780x312 and **-4.48%** at
1193x833. Paint means change by -0.27% and -2.98%, respectively. No sampled frame
exceeds 20 ms. RasterTask and Paint durations overlap and are workload proxies,
not additive time or GPU measurements.

Summary SHA-256:
`dc9d881ed48ff6eb4e4faf56b54db227eff7da9abeee0d59531afe8a2480803c`.
The post-run host record identifies Windows 11, Ryzen AI 5 340 / Radeon 840M,
Balanced power, while stating that thermal telemetry was not recorded during
sampling. Host-record SHA-256:
`80b3b816d64d88b95c398fbc8b244614265a4620991aec318e02388f963b86e6`.

This closes the five-runs-per-row requirement for this matched, bounded Web
preview comparison. It does not close the full Plan 07 S01-S11, defined-low-end,
native or physical-device matrix.

## Fresh visual review

I inspected these four captures at original source detail in this review:

- `phone02-book-full-20260906-r4/phone-book/game-780-312-0-12.png`, SHA-256
  `b33bd48a8d7823727ee4ceac48c2db19d44b05851b907f1b66ff8db1de10280b`.
- `phone02-book-full-20260906-r4/phone-book/partial-Friends-780.png`, SHA-256
  `01d6598f8bd999fcc040f2fa45b949626ccb0fbd8a68b4aacc54a9d7e722a677`.
- `phone02-book-qualified-five-pairs-20260906/780-candidate.png`, SHA-256
  `49da1239197d7061642ba7481280e6d39362c270434351bf19ee4f7ebde93d9c`.
- `phone02-book-qualified-five-pairs-20260906/1193-candidate.png`, SHA-256
  `d01e8db2d55c72d4684aabab5d0d7026a5a2ce907558bb5faf12fae6e125f0f9`.

The phone gameplay view preserves the desktop composition, full utility set and
map without clipping; the pad is prominent without consuming the lower half.
The partial Friends page keeps all five tabs and the 2/32 state visible, shows
distinct approved silhouettes without visible unknown names and retains a clear
scroll region. Both final travel captures are complete and visually stable at
their recorded sizes. Small phone text and controls remain a deliberate visual
tradeoff and require physical comfort/legibility judgment; these screenshots do
not establish that judgment.

Within this evidence boundary, the bundle is suitable for Astra's guarded,
hash-verified Web deployment. Release records must preserve the exact source,
bundle and evidence hashes above and must leave Windows/native packaging and the
broader performance/device gates open.
