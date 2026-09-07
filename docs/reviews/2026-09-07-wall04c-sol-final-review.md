# WALL-04C and field-art depth — Sol final independent review

Reviewer: actual GPT-5.6 Sol, read-only except for this authorized review.
Reviewed release source: `e69f3e4191305106e7cc77de6bbfedd2296ccb68` on
`codex/wall-balance-sprite-depth`. Candidate JS SHA-256
`9efdebdfa194e6ed6a084d437ff888550a37b5ff308c43fe5cd3786f9b119148`;
CSS SHA-256
`023de600bfbfde4110d27d4f415797dab41b3058bd505703e26479fa3b32147f`.

## Independent disposition

I find no remaining source, rendered-readability or measured-performance blocker
to one guarded Chromium web release of this exact candidate. This disposition is
bounded to the source and evidence named below. It is not physical-device,
Safari/WebKit, iPad, native, low-end, GPU-time, thermal, universal accessibility
or Human beauty acceptance.

The final geometry is coherent with the Human-authorized refinement: `.81` wall
height, `.47` exposed cap width, `.28` rear overlap, a physical wall footprint
instead of the old flat-W paint, and one separately layered foreground SVG
reusing the same wall paint graph. Logical collision and level identity remain
separate. The actor/item layout uses registered alpha bounds and anchors to give
visible art about 90% tile width while preserving proportions. Cage crops are
presentation offsets rather than invented anatomical landmarks, and the same
crop drives the rescue start.

The final source closes the two review issues I raised. Continuous polygon/arc
coverage checks now protect the top 70% of non-wall cells and constrain every
foreground band to a directly adjacent bottom 30% region across the campaign
and all 512 local 3x3 masks. The field-detail contract freezes the exact 58
reviewed IDs, category counts, canonical source/full geometry and selected
detail source/full geometry. Reward/badge icons cannot silently enter field
detail selection. The final `.36 - rowsAbove` label bound keeps Power inside the
board without changing body or foot grounding.

## Visual and functional evidence reviewed

I inspected all 13 source-matched DSF2 rack images and JSON records under
`C:/GameDev/maze-game-qa/performance/wall04c-racks-reviewed-20260907/wall-sprite-rack`.
They cover 32 friends, 12 enemies, eight weapons, eight items, four cage styles
and 18 light/material frames. Every JSON record has an empty error list and no
broken image. Bunny, Alpaca, Mallowmusk and Tidecurl remain identifiable in all
four cage styles; the earlier Alpaca/Tidecurl crop concern is resolved. Held
weapons remain attached to their reviewed sockets.

At DSF2 the rack actually reports two insufficient source resolutions: Power
Potion at `288/256 = 1.125x` and Science Beaker at
`329.12/256 = 1.286x`. Both remain visually readable in these stills. The wider
five-item exception list is a conservative eligibility boundary for viewports
where Gold Bag, Gold Chest or Science Gears may also upscale; it is not a claim
that those five failed this rack. DPR3 remains unqualified.

I also inspected representative final-source campaign, generated-maze,
interaction and five-follower images under
`C:/GameDev/maze-game-qa/performance/wall04c-qualified-browser-20260907`, plus
both eight-direction grayscale sheets under
`C:/GameDev/maze-game-qa/performance/wall04c-grayscale-20260907`. The old flat-W
wedge is gone. Cap/face silhouettes remain closed across stone, purple, brick,
hedge and dark materials. Foreground volume covers lower feet while faces,
Power, doors, keys, goals, holes and hazards remain readable. All eight light
bearings visibly change cast/rim direction in grayscale. The rim approaches an
outline on the light lavender sheet and the hedge is deliberately dark; neither
is a release blocker in the reviewed captures.

The initial five-follower capture clipped the top of Power `20`. The corrected
captures in
`C:/GameDev/maze-game-qa/performance/wall04c-edge-label-20260907/movement`
show the complete number at 780x312 and 1194x834 while preserving grounding.
The paired route asserts a two-pixel in-board margin at every settled checkpoint.
This resolves that blocker. Dense follower overlap on reversals remains visible,
but full-size followers are the explicit Human choice and the HUD count stays
truthful.

Astra reports the exact candidate passed 664 project tests in 67 files,
TypeScript/build/budgets, CI run `34069961527`, 41 final browser cases and the
two corrected edge-label routes. I reviewed the source and retained outputs; I
did not execute those test or browser jobs.

## Exact-source paired performance

All three reports bind commit `e69f3e4`, candidate JS SHA `9efdebdf...`, frozen
public 0.22.14 baseline source `0856104` and baseline JS SHA `55f4e86b...`.
Each contains 24 rows: four warmups and 20 measured rows, five measured pairs at
780x312 and 1193x833, Chromium 151 at DSF2. Every measured row has the expected
step count and exact return position, zero terrain mutations, page errors and
broken images, maximum frame delta 16.8ms, and zero frames over 20ms or 34ms.

The table uses the median baseline total and median candidate total for each
trace category; percentages are the ratio of those medians. Trace durations
overlap across threads, are not additive, and are not GPU time.

| Route / viewport | RasterTask | Paint | UpdateLayoutTree | Layout |
|---|---:|---:|---:|---:|
| 16 ordinary steps, 780 | 1435.899 -> 1422.643ms (-0.923%) | 487.805 -> 494.943ms (+1.463%) | 130.493 -> 146.111ms (+11.968%) | 28.363 -> 27.465ms (-3.166%) |
| 16 ordinary steps, 1193 | 3889.421 -> 4103.578ms (+5.506%) | 523.959 -> 526.427ms (+0.471%) | 137.567 -> 149.375ms (+8.583%) | 39.489 -> 37.818ms (-4.232%) |
| 8 one-hole jumps, 780 | 2047.928 -> 2160.117ms (+5.478%) | 260.227 -> 276.341ms (+6.192%) | 120.403 -> 151.174ms (+25.557%) | 24.785 -> 24.104ms (-2.748%) |
| 8 one-hole jumps, 1193 | 5692.796 -> 6951.478ms (+22.110%) | 263.912 -> 294.920ms (+11.749%) | 103.608 -> 139.631ms (+34.769%) | 34.389 -> 37.857ms (+10.085%) |
| 8s live-surface idle, 780 | 2675.126 -> 2340.524ms (-12.508%) | 958.828 -> 954.116ms (-0.491%) | 147.675 -> 146.282ms (-0.943%) | 22.233 -> 21.398ms (-3.756%) |
| 8s live-surface idle, 1193 | 7519.104 -> 6656.454ms (-11.473%) | 1020.646 -> 1040.949ms (+1.989%) | 160.071 -> 173.517ms (+8.400%) | 24.876 -> 25.562ms (+2.758%) |

Reports and SHA-256 values:

- `wall04c-release-moving-20260907/report.json`:
  `a2004023b61f90033f4e68fbc98ee6b8a9b838eac7659c327817966e785105e8`.
- `wall04c-release-jump-20260907/report.json`:
  `2fe4720160e157d35ff6e2e93710726d840ea8408a4454e3cc00ba300b06f0dc`.
- `wall04c-release-idle-20260907/report.json`:
  `65d3b9d6b6ca43d0022efdaa673b96962cca191b3db9af2016cc98bafd6d104d`.

The desktop jump RasterTask increase is material and must stay visible. Its five
paired ratios are consistently `+21.185%` to `+27.284%` with a `+22.074%`
paired median. Median RasterTask count rises from 5,186 to 7,345; Paint count
rises from 954 to 1,186. UpdateLayoutTree rises by 36.023ms across the 4.8s
route while count changes only 543 to 552. This is consistent with the second
clipped wall paint graph being translated during the existing travel clock, but
the reports do not causally isolate foreground, enlarged sprites and other
presentation changes.

I accept that cost within this web-release scope. It produces no measured frame
cadence regression, ordinary movement is +5.506% RasterTask at 1193, idle
RasterTask is lower at both viewports, and the added work pays for a directly
requested visible depth/scale change. A foreground-hidden ablation would assign
component share but would not alter this product decision. This acceptance does
not predict battery, thermal, low-end or physical-device behavior; those remain
Plan 07 work.

## Release boundary

WebKit 26.5 could not be used because Windows Application Control blocked its
bundled `libsharpyuv.dll`; no bypass or replacement was attempted. Cross-SVG
paint reuse is therefore proven in Chromium only. Human review queue Q01 and
the broader P13 beauty judgment remain open. Deployment, public-byte identity
and post-deploy gameplay smoke remain Astra-owned final gates.
