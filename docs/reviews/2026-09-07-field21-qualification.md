# FIELD-21 / v0.22.21 qualification

Candidate frozen runtime **6cc9f86bf6f21f741c3fc75f40ea408612e2726f**,
branch `codex/field-scale-refinement`, [PR12](https://github.com/MachineKomi/maze-so-puzzle/pull/12).
Now [published as web0.22.21](2026-09-07-v02221-public-verification.md); the receipt binds identity and public behavior.
[Human intake](../user-playtests/2026-09-07-balanced-wall-acceptance-and-relative-scale.md)
explicitly accepts balanced interior walls. [Execution contract](../plans/FIELD-21-scale-jump-and-perimeter.md).
Astra is sole runtime writer; Sol independently reviews actual source and visuals.

## What changed

Width is now an upper clearance limit rather than a demand to inflate a narrow
silhouette. Actors retain at most0.9 tile width and1.35 height; ground items at
most0.9 width/height. Ame changes from1.7763 high to1.35 (about24% smaller), with
roughly0.684 visible width. Most enemies/friends retain their existing size;
only unusually tall friends are capped. The audit covers61 catalogue entries:
1 player,12 enemies,32 friends,8 pickups/treasures and8 weapons. Actual corridor
racks show both orientations beside Ame. Cage crops, held sockets, jump boots,
badges and rendition demand use the same registered sizing owner.

Reward diameters change from roughly0.90 tile to0.28 Gold/Science and0.22 Power.
Shadows, trails and count placement follow the smaller presentation; SVG fallback
shrinks too. These are still original code-drawn glyphs, not the requested final
generated artwork: **ART-REWARD-01 remains open**. Quantities, timing, landing/
vacuum/collision safety, capacities, rules5 and schema5 remain unchanged.

Airborne Ame/boots/weapon/badge use layer27; foreground walls remain26. Ground
shadow/ring stay25. One existing travel owner translates both jump elements from
the same point and samples all three cached animation handles on the same clock.
Landing/cancellation restores normal grounded occlusion; no extra animation loop.

Only map-exterior strips extend past the clipped frame, closing side gutters and
the south cap; interior0.81 height/0.47 cap/0.28 rear overlap and lighting remain.
The wall revision is04c-balanced-v2. Existing open boundary tiles remain open;
512 local masks plus all campaign geometry satisfy continuous forbidden-area
coverage. Native SVG membership checks and DPR1/2/3 screenshots cover all four
frame edges/corners under all eight lights. This is distinct from timing evidence.

## Checks and exact-source identity

736 tests in74 files, TypeScript/build, production audit0 vulnerabilities,
performance contracts/budgets and deployment guard9pass/3historical skips pass.
An old test's137.0274% held-size literal correctly failed after resizing; its
updated104.1408% expectation accompanies unchanged all-weapon socket assertions.

The initial `field21-browser` packet passed73/73 before the ground-shadow split.
Final `field21-final-browser` passes46/46:11 camera/map/rebase,14 jump including
controlled-clock departure/apex/landing, and21 artwork/perimeter cases. The
controlled captures prove depth/clock alignment, not real-time frame performance.
The final loot/Power/count matrix passes32/32. A separate source-identical key/
door/portal/goal rack passes2/2: all three keys and seven unchanged square markers
are loaded and freshly inspected in both corridor orientations. These packets
cover80 distinct final browser contracts (46+32+2), not one single80-case run.
The original61-entry numeric audit is supplemented by the three-key rack;
unchanged doors/portals/goals retain their square layout. Exact runtime CI
[34104347051](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/34104347051)
passed. Final reviewed checkpoint4bd97e7 also passed exact-head CI34106603183 before merge.

Runtime-input SHA-256 **fe526de999fdee6d036d99bd0f1aba088c125f26c1d5e6eb8d12d543cd68be6e**.
Dist fingerprint **7b42516916d0b991c8917838787d40dfddd9dd580ec7f9df65757657ccd70d38**.
The marker names pre-commit e9b25db; both actual fingerprints match frozen6cc9f86.
JSgzip9 **174011**, CSSgzip9 **24191**: +182/+21 bytes versus20. The bounded
allocation is384JS/64CSS; final totals remain below174269/31222. Public runtime
bytes155542751 are unchanged. No new dependency, media or persistent cache.

## Paired performance and independent review

Four serial, source-matched five-pair cohorts completed against frozen20:
ordinary camera and real enemy reward routes, each with separate untraced frames
and traced work. Same browser host, phone/tablet profiles and CPU throttle;
no competing owned QA/browser workloads or source edits during measurement.
Each report has24 contexts: four warmups and five measured pairs per profile,
CPU4,844x390/DPR3 and1080x810/DPR2, with500ms entry settle. All report exact6cc,
matching source/dist identities and no browser errors or broken images.

Untraced p95 stays at most16.8ms. Ordinary camera has no frames above34ms.
The enemy route retains its roughly50–67ms hitch; this is not a cold-entry cure.

| Route / width | Max median20→21 ms | Worst20→21 ms | >20ms counts20→21 | >34ms counts20→21 |
| --- | ---: | ---: | ---: | ---: |
| Enemy844 |66.60→49.94|66.70→66.70|14→12|5→5|
| Enemy1080 |49.95→49.94|66.70→50.01|10→12|5→5|
| Camera844 |33.30→33.40|33.40→33.40|11→7|0→0|
| Camera1080 |33.30→33.40|33.40→33.40|9→8|0→0|

Separate traced work medians below are milliseconds per measured route. They
are overlapping trace categories and must not be added as total CPU/GPU work.
Costs are mixed: phone enemy raster grows6%; ordinary phone layout grows12%
(about12ms across the route), with stable counts and unchanged untraced tails.
This supports the bounded visual correction, not a broad performance win.

| Route / width | Paint20→21 | Raster20→21 | Layout20→21 | Style20→21 |
| --- | ---: | ---: | ---: | ---: |
| Enemy844 |427.91→426.24|943.73→1000.28|108.20→105.84|366.28→357.57|
| Enemy1080 |446.25→453.96|1175.43→1139.87|133.02→135.10|336.72→329.27|
| Camera844 |197.93→203.38|734.57→738.12|95.57→107.31|378.04→372.57|
| Camera1080 |218.89→218.33|1025.86→1005.48|154.06→161.09|334.25→338.17|

Raw report SHA-256, under external `performance/field21-*`:

- enemy-frames:cb72d5a41ca844ae81794e40f922819b2a1d659895044d5f53a8f235344abe2e
- enemy-work:3e8d4d0686a2ea5e6f44f81ea7df54b527802ae53bce40e9b4e8d3fad9a5e57c
- camera-frames:360674c16bed5fce0f9769d45ad0faa62332441e160eebb337940c600592b876
- camera-work:7deeb4b962ce03c5889d9d92122c5ce21553e7f9498f7fc5bb3a6ffb2c1d866d

`field21-summary/paired-summary.json` and `integrity.json` retain aggregates,
source identities and final fingerprint checks. [Actual Sol review](2026-09-07-field21-sol-final-review.md)
owns the independent recommendation; do not infer it from Astra's analysis.
Sol's final review independently supports bounded web publication of exact6cc,
subject to normal release identity/public verification. It also discloses the
trace-only50.1ms candidate phone/50ms baseline tablet camera outliers, without
substituting those instrumented intervals for the untraced timing authority.

The inherited immediate-entry Power cosmetic expiry, first-opening hitch and
physical iPhone13/iPad8 camera observation remain open. Local Chromium does not
establish a3GB/RAM floor, Apple/WebKit/thermal success or native acceptance.
Published Windows remains0.22.9; native0.22.10 qualification remains separate.

Evidence lives in the [artifact ledger](../LOCAL_ARTIFACT_LEDGER.md). No deletion,
archive, native package or repository/media clone. Continue mixed chests/Mimics
after this correction, with proper reward artwork explicitly queued.
