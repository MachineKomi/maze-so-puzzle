# v0.22.20 — enemy Gold and Science

Frozen runtime **6f083f416668281c97b2f59101124b4d41261763**, helper/docs checkpoint
ebb2b17, branch `codex/enemy-loot-rewards`, [PR11](https://github.com/MachineKomi/maze-so-puzzle/pull/11).
Local qualification is complete; live remains0.22.19 pending release. Astra
and [actual independent Sol](2026-09-07-enemy20-sol-final-review.md) accept this
bounded web scope with the costs/limits below. Astra is sole runtime writer.

## Scope and correctness

Ordinary enemies scatter both Gold and Science only after final defeat, with
the same physical bounce, visible settling interval and finite-range vacuum as
authored loot. Power retains immediate puzzle authority and per-impact bursts.
The [execution contract](../plans/LOOT-03B-enemy-rewards-execution.md) freezes four
modest Power bands and independent attempt/level/enemy/currency/rules5 rolls.
Reload cannot reroll. Fifty campaign enemies add a theoretical all-enemies
100–200 Gold/63–116 Science envelope, separate from authored44/22 and completion
bonuses. That is optional supply, not guaranteed collection or access currency.

Ledger2/schema5 binds attempt identity and reserves future source channels under
the64-bundle cap. Strict v4/rules4 and v2/v3/rules3 migration preserves grounded
value, accepted claims, old credits and prior defeated enemies without new
awards. Only saturated historical synthetic ledgers need same-source coalescing;
no current campaign's worst old ledger needs it. New key writes precede cleanup;
malformed/future/denied-write records remain protected. Completion remains
idempotent. Existing terrain/topology routes, mandatory Power and16-maze order
are unchanged; rules4 generator goldens are explicitly checked alongside rules5.

Representation protects accepted claims, gives the latest released origin its
burst, and keeps both enemy channels visible together within24/12 Full/Lite
tokens. Visibility/Home cannot age an unseen drop; incomplete reading intervals
restart. Restored rewards stay grounded. Combat emissions are admitted per
actual impact so future bursts cannot consume Lite slots early. Implicit potion
effects begin at first paint; absolute combat clocks and later-stall expiry stay.

735 tests/74 files, TypeScript/build, production audit0 vulnerabilities, budgets
and deployment guard9pass/3explicit historical skips pass. Exact runtime CI
34097768458 passes web verification and Windows compilation. Windows0.22.9 remains
the published native release; native0.22.10 qualification is separately held.

`enemy20-visible-browser` passes54/55:11 camera/map,12 jump/boundary,12 enemy,
10 authored/save,5 number/resize and four of five Power tests. Its stale4200ms
Lite idle assertion was replaced by bounded stable-ledger completion. The
same runtime's `enemy20-loaded-power-browser` passes all5 loaded Power cases,
including exact2 potion/12 combat arrivals and1600ms stable rest. These overlapping
packets cover55 distinct case contracts; they are not a single clean55-case run.
The [retained cold diagnosis](2026-09-07-enemy20-cold-power-diagnostic.md) records
real immediate-entry cosmetic failures reproduced on both19/20. No cold, Apple,
3GB or Human-feel success is inferred from loaded checks. Synthetic visibility
and saturation cases are explicitly distinguished from actual browser input,
Home, reload, migration, approach, completion and fallback journeys.

## Frozen bytes and costs

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| index.html |1070|a683b97a92648a9673613b31930dd042c15398483e79167db9f9a536e061fd28|
| assets/index-B6onfJkA.js |622546|626728c3b8dae0c37c177ce72b4b51b20eaa97f0f40a15f94a5bb6ed8be2e205|
| assets/index-BVffqDNp.css |120280|050565a839dbd47fb285909012a0e2b9a596bbc268f0a4f3b212204b6e501c7b|

Runtime inputs8da5db198e00a00ae3df0864d3d1111c196ccef9b38c8bb25eff8af960cb2257;
dist a4107a89438abe8ed735d827c4538a943349e4e6be3dfa15b17392a2bef012e8.
The build marker names parent ae51a12 because the visibility correction was
built before committing; its actual fingerprints exactly match committed6f083f4.
JSgzip9 **173829**, +1418 over19, under173885 by56 bytes with the named1400
allocation and inherited headroom. CSSgzip924170/public155542751 are unchanged.
No dependency/media growth, new cache, native package or repo/media clone.

## Paired work and frames — completed

Four serial cohorts compare exact frozen19/20: actual enemy defeat/release/
approach and ordinary camera movement, each with separate untraced frame and
traced work runs. Five alternating pairs plus discarded warmups per844x390 DPR3
and1080x810 DPR2, CPU4. Local Chromium/CPU throttling is not Apple/3GB/GPU/thermal
emulation. Enemy20 adds real rewards absent in19; compare and disclose that cost.
No runtime edits or competing local browser workloads during measurement.

All four cohorts completed24 contexts each (four discarded warmups and20
measured rows), serial session53729 returned0. Every route/Power/currency check
passes, with no terrain mutations, broken images or page errors. Separate traced
work durations can overlap and must not be added into a total CPU/GPU cost.

| Untraced frame metric,19→20 |844x390 DPR3|1080x810 DPR2|
| --- | --- | --- |
| Enemy max median / worst,ms |66.554/66.638→49.952/66.700|50.002/83.300→49.980/66.700|
| Enemy intervals >20 / >34ms, five runs |7/5→12/5|8/5→10/5|
| Ordinary max median / worst,ms |33.300/33.400→33.300/33.400|33.300/33.400→33.400/33.400|
| Ordinary intervals >20 / >34ms, five runs |6/0→6/0|8/0→6/0|

All untraced p95 values are<=16.8ms; ordinary rebase-adjacent worst<=16.8ms.
Enemy severe-tail counts are unchanged, with modestly more intervals>20ms.
The lower median maximum is not a broad speed claim:20 adds actual rewards,
and one roughly50–67ms input hitch remains per encounter in this lab.

| Traced work median,ms,19→20 |Phone|Tablet|
| --- | --- | --- |
| Enemy Raster |983.906→1018.774 (+3.54%)|1232.714→1192.023 (-3.30%)|
| Enemy Paint |436.367→443.178|440.319→473.472|
| Enemy Layout / styles |100.751/362.438→103.625/367.606|124.561/359.948→138.063/371.091|
| Ordinary Raster |741.779→742.649 (+0.12%)|1037.374→1043.790 (+0.62%)|
| Ordinary Paint |193.276→197.081|216.288→213.027|
| Ordinary Layout / styles |82.726/362.352→79.359/363.651|127.904/341.522→126.968/333.666|

The traced enemy tablet maximum reaches99.876ms; it is retained separately from
untraced frames. Work is mixed, with added enemy Paint/Layout and effectively
neutral ordinary control in this scope. Grounded loot keeps a bounded backing
surface; ordinary empty-ledger rewards return to1x1/running=false. Heap snapshots
are not measured RAM requirements or Apple working-set evidence. No total
rendering-cost reduction, physical-device success or cold-start cure is claimed.

| External performance report | SHA-256 |
| --- | --- |
| enemy20-enemy-frames/report.json |924502ada755fc362e2cde8151d38dfeaa9cb8701dbde4cba68c4f0ab449c87c|
| enemy20-enemy-work/report.json |1e302a79ff4a657b9ac093d8c2049c1ef23f7559568feebbb642b11501a15c4d|
| enemy20-camera-frames/report.json |680246371d3671ed6ce84196e79f4a457bb6c5e3b10a2a8c0182cb73bb503f54|
| enemy20-camera-work/report.json |1f72f9a399444682e011b2ba1f97daf0bcff53eb3e171926434d2b3a00d6c6ca|
| enemy20-summary/summary.json |e0f1fbe30b3b39479c2f778e4e0ed5fe2c045b44a534c616b5c979dabbd9f803|
| enemy20-summary/integrity.json |3954492d56d7470eb86d3c5b107de94cce70ee97d826b1be174b2313af752e1c|
| enemy20-visible-browser/playwright-report.json |10da45f494c984ece7e5446116e4afb308a961e338de2d095b7dd113109e85f7|
| enemy20-loaded-power-browser/playwright-report.json |b1ad5e01b5bb2988f20947d0422924a452af1af8540359cabdcbb64302b800cd|

The integrity receipt rechecks the frozen runtime/dist and zero runtime/native
diff from6f083f4. Raw reports retain their starting buildIdentity; runner exit0
asserts the final identity too. There is no invented serialized after marker.

## Publication, queue and recovery

Actual Sol independently recommends publication. Exact-head release CI and the
existing Git-integrated Vercel deployment/public verification remain separate
final steps. Q05/P20 owns reward feel; Q08/P19 owns physical affected-device
camera, entry and first-reward observations. Mixed chests/actual disguised Mimics
follow this foundation, then recognition XP and usable inventory before eggs;
DELIGHT/LEARN and the wider roadmap remain intact.

After schema5 is written, any repair must preserve rules5 reward receipts, prior
migrations, grounded/accepted value and completion. Never roll back to a v4-only
writer, clear family saves, or bypass the deployment guard. Raw diagnostics and
qualification packets stay external in the [artifact ledger](../LOCAL_ARTIFACT_LEDGER.md).
