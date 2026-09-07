# Sol independent final review — enemy Gold and Science

Date: 2026-09-07. This is my independent source, visual and local web-evidence
review of frozen runtime `6f083f416668281c97b2f59101124b4d41261763` on
`codex/enemy-loot-rewards`. It is a bounded web-engineering disposition. It is
not Human acceptance, physical iPhone/iPad evidence, native acceptance, or a
claim about 3 GB memory, GPU cost or thermal behaviour.

## Disposition

I find no source, save-integrity, visual-readability or measured web-performance
blocker to publishing this bounded LOOT-03 B slice. I recommend release of the
frozen runtime with the exact limitations below retained in the qualification
and follow-up queue.

The trade is real rather than free. The enemy route now performs and paints two
persistent physical reward channels that v0.22.19 did not have. In the untraced
five-pair runs, intervals above 20 ms increase modestly, while intervals above
34 ms remain exactly five per five runs in both versions and both layouts. The
ordinary-camera control is neutral within this evidence. The local result is
proportionate to the visible feature; it does not close the affected-Apple-device
question.

## Source and persistence review

I reviewed the final owners in `src/game/enemyRewards.ts`, `src/game/loot.ts`,
`src/game/engine.ts`, `src/session.ts`, `src/App.tsx`,
`src/vfx/useLootCollection.ts`, `src/vfx/RewardLayer.tsx` and
`src/vfx/rewardPhysics.ts`. The resulting contract is coherent:

- Rules 5 derives Gold and Science independently from the framed
  `[rules, runId, levelId, enemyId, currency]` tuple. A reload retains the roll;
  another attempt receives its own run-bound roll.
- The pure engine creates both channels only in the successful final-defeat
  transaction. Blocked, too-strong and already-defeated encounters create no
  new currency. Existing Power remains immediate puzzle authority.
- Ledger 2/schema 5 validates source kind, object identity, exact deterministic
  amount, positive bundles, legal landings, credit conservation, run binding
  and the 64-bundle reservation. Potential source-key collisions and unsupported
  authored reward capacity fail level validation.
- Migration validates a v4 authored ledger under its old rules, settles accepted
  claims, retires already-defeated legacy enemies without retroactive rewards,
  and preserves grounded value. Only a saturated legacy ledger may coalesce
  same-source grounded bundles at an existing legal landing and ID. The current
  campaign does not need that compaction. The authoritative v5 write precedes
  old-key cleanup; malformed and future records retain the established protected
  handling.
- Accepted claims remain the sole credit boundary. Save/reload, completion and
  retry do not duplicate an enemy channel. Completion finalization remains
  idempotent and does not infer credit from merely grounded loot.
- Gold and Science remain withheld through battle presentation. Power batches
  enter the shared presentation limit at their actual impacts, so future bashes
  do not occupy Lite slots early. Released enemy channels and the next newly
  opened treasure receive source-generic representation priority without
  displacing accepted claims.
- A grounded drop starts its 750 ms readable interval only in an enabled,
  visible and focused collection tick. Hidden, Home and interrupted incomplete
  intervals restart; a fully read grounded interval is not erased. The current
  timer is semantic and goes idle at rest.

I do not see a remaining loss or duplication route in these final owners. The
first-paint adjustment applies only to emissions without an explicit `bornAt`;
the combat schedule keeps its absolute clock. Later stalls still use the prior
bounded-expiry policy, which is relevant to the cold limitation below.

## Fresh visual review

I freshly inspected the exact packet's Full 1080 burst/settled and Lite 844
burst/settled captures under
`C:/GameDev/maze-game-qa/performance/enemy20-visible-browser/enemy-loot/`.
Gold uses a warm angular star and Science a cyan atom, so the channels are
recognisably different against the bright floor and dark walls. Settled rewards
remain readable at different distances; the HUD counters advance only after the
near bundles claim. Full and Lite retain the same semantic result.

At the photographed burst peak, the large foreground Science mark and Gold star
cover part of Ame's lower body. That is a brief, forceful reward beat rather than
a persistent navigation obstruction, so I do not treat it as a blocker in this
scope. This visual judgment does not infer Human beauty approval.

## Browser correctness boundary

The source-matched `enemy20-visible-browser` report contains 54 passes and one
failure. The failure was the test's fixed 4200 ms idle snapshot: a newly admitted
Lite slot correctly owed its own readable interval and was still claiming. The
replacement bounded wait and stable-ledger check passes in the same runtime's
five-case `enemy20-loaded-power-browser` packet. Together the overlapping
packets exercise 55 distinct contracts, but they are not one clean 55-case run.

The covered routes include real enemy defeat, mid-battle reload, migration,
capacity/representation, authored loot, completion, camera/rebase, Full/Lite,
Reduced/Static, Canvas fallback, hidden battle interruption, restored Home delay
and exact Power/currency conservation. Synthetic saturation and visibility
signals remain synthetic evidence and are not described as physical input.

The supplied project evidence also records 735 tests across 74 files, build and
type checks, budget/guard checks, production audit with zero vulnerabilities and
CI `34097768458` passing web verification and Windows compilation. I did not
rerun those checks; my independent verification here concerns the reviewed
source, captures and raw report contents.

## Five-pair performance audit

I independently parsed all four final reports. Each has 24 rows: four retained
warmups and 20 measured rows, giving five alternating pairs at 844x390 DPR3 and
1080x810 DPR2 under Chromium 151 with CPU throttling 4. All measured routes
preserve their expected step/return contract and report zero terrain mutations,
page errors and broken images. Traced categories overlap and are not additive.

### Enemy defeat, release, approach and return

| Untraced frames, v19 to v20 | 844x390 DPR3 | 1080x810 DPR2 |
| --- | ---: | ---: |
| Worst p95 | 16.8 to 16.8 ms | 16.8 to 16.8 ms |
| Median run maximum | 66.554 to 49.952 ms | 50.002 to 49.980 ms |
| Worst interval | 66.638 to 66.700 ms | 83.300 to 66.700 ms |
| Intervals above 20 ms | 7 to 12 | 8 to 10 |
| Intervals above 34 ms | 5 to 5 | 5 to 5 |

The lower median maximum is not a general speed improvement: the route has a
roughly 50–67 ms encounter/input hitch in this lab, and v20 performs additional
visible work. The stable fact is that severe-tail counts do not increase while
moderate-tail counts do.

| Traced median work, v19 to v20 | 844x390 DPR3 | 1080x810 DPR2 |
| --- | ---: | ---: |
| RasterTask | 983.906 to 1018.774 ms (+3.544%) | 1232.714 to 1192.023 ms (-3.301%) |
| Paint | 436.367 to 443.178 ms (+1.561%) | 440.319 to 473.472 ms (+7.529%) |
| Layout | 100.751 to 103.625 ms (+2.853%) | 124.561 to 138.063 ms (+10.840%) |
| UpdateLayoutTree | 362.438 to 367.606 ms (+1.426%) | 359.948 to 371.091 ms (+3.096%) |

Raster paired-change medians are +3.319% on phone-sized layout, with a
-4.107% to +9.107% range, and -4.341% on tablet-sized layout, with a -8.889%
to +5.723% range. The traced tablet candidate has a retained 99.876 ms maximum
versus 83.4 ms baseline. This trace-instrumented maximum is disclosed separately
from the untraced frame authority.

### Ordinary camera control

| Control, v19 to v20 | 844x390 DPR3 | 1080x810 DPR2 |
| --- | ---: | ---: |
| Untraced median maximum / worst | 33.3/33.4 to 33.3/33.4 ms | 33.3/33.4 to 33.4/33.4 ms |
| Intervals above 20 / 34 ms | 6/0 to 6/0 | 8/0 to 6/0 |
| Traced RasterTask median | 741.779 to 742.649 ms (+0.117%) | 1037.374 to 1043.790 ms (+0.618%) |
| Traced Paint median | 193.276 to 197.081 ms | 216.288 to 213.027 ms |
| Traced Layout median | 82.726 to 79.359 ms | 127.904 to 126.968 ms |
| Traced UpdateLayoutTree median | 362.352 to 363.651 ms | 341.522 to 333.666 ms |

Every control p95 is at most 16.8 ms, every rebase-adjacent interval is at most
16.8 ms, and neither side records an interval above 34 ms. These figures support
ordinary-camera neutrality on this host and route only.

The measured candidate asset is `assets/index-B6onfJkA.js`, 622546 bytes, SHA-256
`626728c3b8dae0c37c177ce72b4b51b20eaa97f0f40a15f94a5bb6ed8be2e205`.
Its runtime-input SHA-256 is
`8da5db198e00a00ae3df0864d3d1111c196ccef9b38c8bb25eff8af960cb2257`
and dist fingerprint is
`a4107a89438abe8ed735d827c4538a943349e4e6be3dfa15b17392a2bef012e8`.
The build marker names `ae51a12` because the final visibility bytes were built
before their `6f083f4` commit; the final integrity receipt matches those runtime
inputs and dist to committed `6f083f4` and reports no runtime/native diff.

| Report | SHA-256 |
| --- | --- |
| `enemy20-enemy-frames/report.json` | `924502ada755fc362e2cde8151d38dfeaa9cb8701dbde4cba68c4f0ab449c87c` |
| `enemy20-enemy-work/report.json` | `1e302a79ff4a657b9ac093d8c2049c1ef23f7559568feebbb642b11501a15c4d` |
| `enemy20-camera-frames/report.json` | `680246371d3671ed6ce84196e79f4a457bb6c5e3b10a2a8c0182cb73bb503f54` |
| `enemy20-camera-work/report.json` | `1f72f9a399444682e011b2ba1f97daf0bcff53eb3e171926434d2b3a00d6c6ca` |
| `enemy20-summary/summary.json` | `e0f1fbe30b3b39479c2f778e4e0ed5fe2c045b44a534c616b5c979dabbd9f803` |
| `enemy20-summary/integrity.json` | `3954492d56d7470eb86d3c5b107de94cce70ee97d826b1be174b2313af752e1c` |

## Retained limitation and release conditions

Fresh-process immediate-entry potion cosmetics can still disappear after a
later 156–203 ms gap. The fresh-Edge discriminator reproduces zero cosmetic
arrivals in all four v19 and all four v20 rows while preserving exact Power,
route return and error-free execution. This is an inherited limitation, not a
v20 regression and not a successful cold-appearance test. The five loaded
checks use an explicit 500 ms post-entry stabilization and therefore establish
loaded behaviour only.

Keep the cold Power investigation and Q08 affected-device testing open. A public
release should verify the exact v20 bytes and normal enemy/camera journeys on
both web origins. It must not be described as solving iPhone 13/iPad 8 comfort,
cold-process cosmetic cancellation, native parity, RAM use or Human reward-feel
acceptance. Any later rollback or repair must keep schema 5/rules 5 receipts and
migrations; a v4-only writer would abandon valid new saves.
