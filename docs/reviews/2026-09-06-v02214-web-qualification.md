# HAZARD-02 — web0.22.14 qualification

**Closed by [corrected public verification](2026-09-07-v02214-public-verification.md),7September.** The pending-publication wording below records the original qualification stage and retained failures.

Astra,2026-09-06. Runtime `ada4cbc9917d4ffe409067a5034ffe34de24873e`,
harness `ebdb9587de4eefe044c2e7ef7ca11b1c4641cba3`, branch
`codex/hazard-surface-polish`. This receipt records the bounded surface pass;
publication requires its separate public receipt. Current live remains0.22.13
until that verification. Windows0.22.9, held native0.22.10, physical iPad and
Human hazard/refined-wall beauty acceptance remain separate. The Human has now explicitly accepted0.22.13's tall3D/lighting direction; [new refinement](../plans/WALL-04C-balanced-caps-and-foreground-depth.md) precedes LOOT-03.

## Implementation and exact payload

[HAZARD-02](../plans/HAZARD-02-readable-living-surfaces.md) keeps approved pixels
and original rounded unions. Water/lava/poison repeats shrink from4.6/4.6/4.2 to
2.4/2.2/2.1tiles. Exact clipping replaces the three eroded/blurred masks. The base
stays opaque and steady; small crest/current/bubble marks animate locally.
Seven deterministic poison marks use own-box percentage translation, fixing
the old5→−15SVG-pixel motion scale. Missing families own no texture or FX pattern.
Lite hides/stops FX; Reduced/Static retain composed still material cues. Walls,
casts, pits, camera, actors, gameplay, saves and reward credit rules are unchanged.

656 project tests in63 files, TypeScript and production build pass. The first
unit attempt exposed a private parser import and insufficient bubble edge
margin; both were corrected before the recorded pass. Sol then identified
unconditional absent-family base textures; these are now gated and tested.
No failed check is silently counted as acceptance.

| Entry | Bytes | gzip9 | SHA-256 |
| --- | ---: | ---: | --- |
| `index.html` |1070|503|`bafe64bf30f3cc5db3c92124a5a80d28204cae1486df8b8f71434426395f49c9`|
| `assets/index-B7flBz-j.js` |594220|164610|`99b9731373134264b64d52d250ebfe03c6086c811870cb1587f115b147be826a`|
| `assets/index-DbOG2xwL.css` |119238|23841|`57c2593d5e7448f4d5b4aaf8795d112c64a4f46fb8ebb2bb59de3c46d49c788d`|

Relative to published0.22.13: +179gzip9JS, −54gzip9CSS, no media/dependency
growth. Public155,542,751B. Existing165557JS/31158CSS limits pass without a new
allowance. Runtime-input fingerprint
`7587240da33c562843edcd24c0b6a9a7dd13f5043e4be3398e2fc65e715840a7`;
dist fingerprint `55c9a0b9804a3f1b41fa53ab1bea33eac1ad88f50ed823af0180b5038f14cde9`.
Both match the frozen build at runtime ada4cbc; later harness/docs do not enter
the payload. `perf:check` passes; deployment guard9 tests pass with3 optional
historical cases skipped by the ordinary command.

## Actual browser and independent review

`C:/GameDev/maze-game-qa/performance/hazard-final-browser-20260906/`:
15 passing cases, including8 hazard cases with24 isolated real campaign
scene/mode contexts,2 airborne camera cases, live Sound quality switching and
door/battle/hole/portal handoffs. Hazard scenes maximize visible material along
legitimate solved routes: Friendship Crown Vault water, Lanternlight Labyrinth
lava, Moonlit Friendship Quest poison. Viewports780×312/1194×834, DSF2.

Each scene proves exact base/FX clips, no morphology/filter, valid HTML images,
zero page errors and immutable terrain markup after two engine-checked steps.
Full samples eight animation times through6700ms and checks poison displacement
is local; Lite has no displayed FX and zero active animation; Reduced/Static
retain material with zero active animation. Full, later poison, Static and
grayscale images are retained. The first15-case packet before absent-owner
correction is separate; these are15 distinct cases, not30 independent tests.

Actual Sol independently inspected source, all12 first-packet material images
and cycle/mode JSON. He found crisp connected flush surfaces, distinct wall
faces/caps, appropriate repeat scale, no visible seam/bleed/halo and readable
poison in the sampled grayscale scene. His absent-texture correction was adopted.
Still images do not prove motion smoothness or GPU cost; one material/theme
sample is not universal colour-vision or device evidence. Q04 requests Human
appearance/motion feedback only once this changed build is published.

## Serialized performance qualification

Two serialized fresh-context comparisons against exact frozen public0.22.13
(e59d0f9 runtime dfe04a93), using the engine-derived Moonlit Friendship Quest
route starting at(9,17), four visible hazard cells. Moving:16 reversible ordinary
steps. Idle:8seconds, zero input, guarded nonempty hazard fixture. Each run has
five measured alternating pairs plus one warmup pair at780×312 and1193×833,
DSF2:24 rows per packet. Raw frame arrays, camera transforms, served hashes and
compressed CDP traces are retained in the external performance folders.

Host: Windows10.0.26200, Ryzen AI5 340/Radeon840M,23.29GiB RAM;
Node24.19.0, Playwright1.62.1, headless Chromium151.0.7922.34. No competing
agent browser/build work during timing. Trace durations overlap across threads;
RasterTask totals are a work proxy, not elapsed GPU time or player latency.

| Comparison | Viewport | Median baseline/candidate RasterTask ms | Median paired change |
| --- | --- | ---: | ---: |
| Moving |780×312|1782.636 /1506.006|−22.10%|
| Moving |1193×833|7234.457 /3931.759|−45.20%|
| Idle8s |780×312|4389.117 /3096.580|−22.71%|
| Idle8s |1193×833|22448.834 /8169.672|−64.29%|

Moving candidate measured pooled p99/max16.8ms, zero intervals over20ms at
both sizes. Baseline tablet has12 measured intervals over20ms,3 over34ms,
max50.1ms; its warmup has11 over20ms, max50.1ms. Other moving warmups have
max16.8ms. All24 routes match accepted steps/end position with zero terrain
mutations, page errors and broken HTML images. Warmups are retained separately.
This supports a scoped rendering improvement, not a universal device claim.

Idle candidate measured and warmup frame maxima are16.8ms, zero intervals over20ms.
The baseline1193 measured pooled p95 is33.4ms/p99 50ms/max66.7ms,288 intervals
over20ms and28 over34ms; its warmup has one33.3ms interval. All24 idle rows retain
zero steps, unchanged position, one camera transform and zero terrain mutations,
errors or broken HTML images. The raw baseline stalls are not removed or
explained away by the laptop. The candidate has a clear bounded improvement on
this exact four-hazard scene, not a universal frame-time guarantee.

The final idle harness bd54001 explicitly requires and records nonempty visible
hazards. Both paired reports and independently recomputed summaries are retained
under `hazard-five-pairs-20260906/` and `hazard-idle-five-pairs-20260906/`.
[Actual Sol](2026-09-06-hazard02-sol-final-review.md) independently recomputed both reports and qualifies bounded web publication. Exact-source CI34065352834 passed verify/desktop; compilation is not native acceptance. Source bd54001 was fast-forwarded to main for one Git-integrated production deployment. Public identity/smoke remains the final verification.

## Product continuation

[LOOT-03](../plans/LOOT-03-physical-collection-and-progression.md) adopts the
Human's physical reward/account-XP request in dependency order. No physical
pickup ledger, enemy currency, mixed chest, Mimic lifecycle, egg or account XP
is claimed by0.22.14. [Human queue](../HUMAN_REVIEW_QUEUE.md) keeps wall/jump
feedback, hazard appearance, reward feel and two nonblocking direction checks
visible. No Human agreement is inferred from engineering qualification.

## Release label correction and retained deployment failure

The first public payload matched every frozen entry hash but still displayed
0.22.13: Astra missed the separate `src/ui/version.ts` constant. Public smoke
correctly stopped. The label correction and new web/package/lock consistency
test now pass657 tests and build. A first test used Node filesystem types absent
from the app compiler; corrected JSON imports passed locally/CI but its native
JSON import was excluded by `.vercelignore`, so Vercel failed deployment
`2mVQmLtx5nzzajeBvbbAxn4Atkfd` with TS2307. The log was read in the authenticated
Vercel UI. No production alias changed on that failed build. Final correction
0856104 keeps the test within web inputs. This is a necessary corrective build,
not a duplicate preview or guard bypass.

The corrected JS `index-CIfNZ8r7.js` is594220B/164609gzip9, SHA-256
`55f4e86b5cd9991e19b670d15a05aeb9d85df5c91ff3e73a4a28dfc2f47c8830`.
An exact compiled comparison proves its only difference from the traced/rendered
JS is the single version-literal character0.22.13→0.22.14. CSS/media are identical.
The correction receipt and failed first smoke are retained under
`hazard-public-20260906/`; performance is not rerun for an otherwise byte-identical
renderer. Final public verification must confirm the correct visible label and
complete both journeys.
