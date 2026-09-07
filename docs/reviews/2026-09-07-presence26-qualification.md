# DELIGHT26 A — calm pickup presence qualification

Frozen runtime **fd1f9e64abe93135a58c810e461f9efe0f52618a**, candidate web0.22.26.
Published25 runtime c931bc3 is the comparison. [Contract](../plans/DELIGHT-26-calm-pickup-presence.md)
and [actual independent Sol review](2026-09-07-presence26-sol-review.md) govern
this bounded checkpoint. **Status: published web0.22.26 after local qualification,
actual independent Sol support and successful exact reviewed-head CI.** The
[public receipt](2026-09-07-v02226-public-verification.md) binds both origins.

## Delivered candidate behavior

Seven authored collectible families retain a steady tile-local light: sword,
potion, ordinary boots, spring boots, antidote leaf, key and legacy treasure.
The existing wrapper paints a static radial backing behind the approved art;
a static silhouette edge replaces the old animated filter/brightness states.
Lite removes the image filter but retains the backing. Reduced/Static retain
the same readable calm presentation. No pickup breathing, twinkle or new clock.

Field registration, ground-depth ordering and labels are unchanged. Chests and
Mimics, physical Gold/Science/Power/XP drops, held weapons, doors, enemies, goal
and portal are excluded. Gameplay, rewards, receipts, sound, save schemas,
discovery and accepted walls/HUD remain unchanged. C post-write keepsake fanfare
is the next independently reviewable slice; this does not close all DELIGHT-02B.

## Correctness and retained evidence

All raw evidence lives under C:/GameDev/maze-game-qa/performance.

- `presence26-baseline`:14/14 matched Full phone/desktop counterpart captures
  and actual collection routes for seven pickup kinds, before runtime edits.
- `presence26-browser`:56/56 initial candidate cases across seven kinds,
  phone/desktop and Full/Lite/Reduced/Static. Computed phase samples prove
  constant art opacity/geometry, static backing, no pickup subtree animation,
  successful collection, object/backing removal and unchanged saved Power.
- `presence26-final-browser`:90 passed plus one fixture-preparation failure.
  The passing cases include all72 pickup cases with extra blue/yellow keys,
  four depth/door/held-weapon checks, ten physical-loot/save/capacity cases and
  four Explore touch/Classic/fog/jump checks on frozen runtime bytes.
- The failed dense fixture initially treated visibleKeysInWindow's array as a
  Set. Its corrected follow-up `presence26-dense` then exposed an overconstrained
  test request: no four-step authored checkpoint had both three pickups and live
  hazards within six cells; the maximum with hazards was two. Neither failure
  is a runtime defect or a passing release result.
- `presence26-dense-r2`:1/1 corrected fixture proof selects the most pickup-dense
  real four-step route independently of hazards. Moonlit, position(1,13), step10
  has three nearby authored pickups and zero hazards in the six-cell view.
  Expanded/folded/Classic screenshots retain wall overlap and camera boundaries;
  all four real moves pass. Idle qualification checks authored pickups rather
  than inventing a hazard workload. Fixture bytes remain in this packet.

The union is **91 distinct affected contracts with passing latest results**,
not one clean91-case run. Full project suite: **769 tests in78 files**.
Frozen runtime CI34145915910 passed. Final reviewed head
2433171a3c779bfb248312c50a9f61981e70e98d passed Browser build236,
[CI34147305567](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/34147305567),
before PR17 merged as fc32f8631404e5a8ebcc5d73cbdcfa89c48cda2f.
The release and reviewed trees are identical. Windows compilation does not
establish native acceptance.

## Resources and source identity

CSS-only runtime presentation: zero added JavaScript, DOM nodes, canvas owners,
timers, media or image decodes. One static pseudo-element per existing mounted
eligible object; the existing bounded retained scene clips and removes it.
There is no animation to accumulate or restart on hide/navigation/collection.

Official Node gzip budgets pass: JavaScript180083/181169 bytes, CSS26582/31622,
public media155555324/165031011. CSS is six compressed bytes smaller than25;
no allocation increase was required. One in-place dist, four frozen25 entry
files with shared unchanged media, external bounded proofs only.

Runtime inputs SHA256: `bb4d917ec5b9feaa0fabbfcd0baf9c559df08d249739d41d45272ae845e92381`.
Dist fingerprint: `4095859750cb36f88141ff881513931b1eef24402010b043630af7ef2e67de4a`.

## Timing method and completed result

Run one Edge workload at a time, DPR2/CPU4 at844×390 and2560×1080. Both25 and26
actually fold their sidebar before measurement, keeping the viewport comparison
equal. Five alternating pairs per profile plus excluded warmups; moving and idle
frame timing are separate from traced Paint/Raster/Layout/style work and layer
dimensions. The saved current-engine fixture makes four reversible legs of four
moves; idle lasts eight seconds. Record visible pickup count and animation count
in each row, source/dist/served identity, route results and page/image errors.

All four cohorts complete: **96 rows,80 measured**, with the same frozen source
and both sidebars folded. All measured rows preserve position after the route,
moving makes16 engine steps and idle0; there are zero page errors, broken images
or terrain mutations. Three visible authored pickups and351 DOM nodes remain
on each side. Pickup animation handles fall from two to zero.

Median per-run p95 is16.8ms in every profile/cohort. Untraced idle has zero
intervals over20ms in all20 measured rows (worst17.2ms baseline/17.3ms candidate).
Untraced moving phone has four over20 intervals on each side, worst50ms baseline
versus33.4ms candidate. Ultrawide pair1 has p95≈33.3ms and worst50.1ms in both
builds, with baseline15/1 versus candidate18/3 intervals over20/34ms. The other
four ultrawide pairs have baseline5/0 versus candidate2/0. Retain this isolated
shared cluster and its small candidate count disadvantage; its cause is unknown.
Traced idle has one candidate ultrawide33.4ms interval; all other traced idle
rows have no over20 interval. No sustained candidate-specific regression appears.

Median traced totals in milliseconds (overlapping categories, not additive):

| Route/profile | Paint25→26 | Raster25→26 | Layout25→26 | Style25→26 |
| --- | --- | --- | --- | --- |
| Moving phone |808.382→791.287|46.395→46.087|84.622→82.729|582.057→536.399|
| Moving ultrawide |768.829→777.844|24.457→24.237|121.376→122.171|502.631→490.013|
| Idle phone |953.692→958.229|26.226→26.187|82.278→83.341|646.658→569.549|
| Idle ultrawide |999.031→995.040|26.097→24.976|87.001→83.882|677.861→584.887|

Layer count falls26→22 in the trace samples. Largest reported CSS layer area is
unchanged:2,152,960 on phone and5,655,040 on ultrawide. This is not an allocated
GPU-memory measurement. Mixed small Paint/Layout movements remain alongside
lower style work; do not describe every metric as a reduction.

Timing and trace totals are report-only diagnostics, not physical Apple/WebKit,
GPU allocation, low-memory, thermal endurance or minimum-RAM acceptance. Preserve
all tails and any failed attempts. The exact reports and entry hashes below,
actual Sol disposition, reviewed-head CI and subsequent public receipt bind
the final bounded web promotion.

## Follow-up

Q12/P26 asks whether pickup presence feels inviting and calm. Q11 spacious UI,
Q10 victory, Q09 scene/XP and Q08 affected Apple/cold first-Power remain open.
Latest fully published Windows remains0.22.9; native0.22.10 is unfinished.
Next C must derive actual old→new award IDs only after successful progress write,
replace the precommit rewardSoundTimer and avoid replay on failed/unsupported
profiles, Stay, retry or reload. Then LEARN-01, preserving the wider roadmap.

## Frozen reports and entries

| Packet | SHA256 |
| --- | --- |
| presence26-moving-frames |c68f231f4e66adc1688643a26241cab754080e87b5819bd37258beb0c15a0711|
| presence26-moving-work |864d5eec3de6dcab8785f0002e4885f2d5ab8b8e9af26a65f5930d79e566fa7c|
| presence26-idle-frames |e02c2751793581416a59bcb0bfb49a7186e73e8e6a8b2cb8156c417a01a13ef4|
| presence26-idle-work |f4a25bcf04046c482b0c472223ad74c2fa86dbad18c1bd05c9deebfbe9cccc56|

| Entry | Bytes | SHA256 |
| --- | ---: | --- |
| index.html |1070|a06fcd57463f943f1742dc617c314a157c0a4793b26019f5bec897f227134773|
| assets/index-CD6FaZjH.js |641570|cbb7f1f4aac77c4705e7cd978a88f3bc7b397aa00cb7a66d6e5079df0e37d2d9|
| assets/index-0pb2f3Qi.css |135867|599ad9001f217cf56b021df4ce9286d467fc9c33f1abdbc2ed2c91ebfb8a3d6d|
