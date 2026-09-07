# v0.22.20 — public enemy rewards verification

Published September7,2026. Release **135bb3a322d300cc528e977d5f09784f06f9d5b9**,
reviewed checkpoint **5dc99c3d07b8db82ab03c3f97f9cb06a75a512ae**, frozen runtime
**6f083f416668281c97b2f59101124b4d41261763**. The merge tree exactly matches the
reviewed checkpoint. [PR11](https://github.com/MachineKomi/maze-so-puzzle/pull/11)
merged after exact reviewed-head [CI34100708572](https://github.com/MachineKomi/maze-so-puzzle/actions/runs/34100708572)
passed web verification and Windows compilation. Compilation does not qualify a
native release: published Windows stays0.22.9; native0.22.10 qualification is held.

Astra is sole runtime writer. [Actual independent Sol review](2026-09-07-enemy20-sol-final-review.md)
accepts the bounded source/visual/performance scope. [Qualification](2026-09-07-v02220-web-qualification.md)
records735 project tests,55 distinct browser contracts across overlapping packets,
four separate five-pair enemy/camera cohorts, corrected assertions and retained
failures. This is not a claim of a single clean55-case browser run.

The normal Git-integrated [Vercel deployment](https://vercel.com/jasons-projects-6714ffa7/maze-so-puzzle/92oU83qGQ8fNnCB9xaZAmjnDVkSE)
succeeded at08:31:42UTC. No override, duplicate manual deployment or native package.
Both [canonical site](https://mazesopuzzle.com/) and
[retained alias](https://maze-so-puzzle.vercel.app/) match these qualified bytes:

| Entry | Bytes | SHA-256 |
| --- | ---: | --- |
| index.html |1070|a683b97a92648a9673613b31930dd042c15398483e79167db9f9a536e061fd28|
| assets/index-B6onfJkA.js |622546|626728c3b8dae0c37c177ce72b4b51b20eaa97f0f40a15f94a5bb6ed8be2e205|
| assets/index-BVffqDNp.css |120280|050565a839dbd47fb285909012a0e2b9a596bbc268f0a4f3b212204b6e501c7b|

Runtime-input SHA-256:8da5db198e00a00ae3df0864d3d1111c196ccef9b38c8bb25eff8af960cb2257.
Dist fingerprint:a4107a89438abe8ed735d827c4538a943349e4e6be3dfa15b17392a2bef012e8.

## Eight actual public journeys

`verify-web-release.mjs` completed successfully against both origins using fresh
owned browser contexts. No Human browser profile or adventure was changed.

- Canonical phone780x312 and desktop1280x720: Home/Book/Friends0/32 met, fresh
  Music65/SFX85, Begin/Start, actual movement and Sound/resume pass. Correct20
  version, fitted stage, wall04c-balanced-v1 and hazard03-living-connected.
- Camera route on both origins: eight actual steps including return, bounded
  aligned world and v3-to-v5 save migration pass.
- Authored Gold8 on both origins: zero early credit, visible settling, distant
  grounded value, reload, approach and conserved total pass.
- Actual first Lanternlight enemy on both origins: during battle Power3 and
  Gold0/Science0, with both reward channels persisted. After settling Gold1/
  Science1; reload preserves exact game state. Approaching the cleared enemy
  tile then gives Gold2/Science1, with Science1 still grounded. The source's
  Gold2/Science2 are conserved, with no duplicate Power or defeat award.

Astra viewed the actual public enemy image. Distinct gold/atom bundles are
visible; the central atom briefly overlaps lower Ame during the energetic burst,
then the settled scene is readable. This matches Sol's bounded visual finding,
not a new Human beauty/feel acceptance or physical-device performance result.

Receipt timestamp2026-09-07T08:32:38.284Z; SHA-256
**f1ad97567258ee009c33c91255bc4914114546051457847c7ab5332102fe0a70**.
External packet `C:/GameDev/maze-game-qa/performance/v02220-public-20260907/`
contains11 files /19807753 bytes:10 screenshots and65083-byte receipt.json.
Camera fixturef16d2d2ea126c1c2a228f8bdf43d2c0efb2a0d396b484f164a4d9e6227f2c1b5;
authored fixtureccd938345e0caab825bf892b252e6d1c4732cd4edeb3f7de94ec358572bdcd93;
enemy fixturedfeb8658c6f69cd18311453a7707123d010c2498931b5a00502b2f1a7280a51b.
All owned QA browsers/servers are stopped. [Artifact ledger](../LOCAL_ARTIFACT_LEDGER.md)
retains evidence without deletion, archiving or repo/media clones.

## Limits, queue and next work

This release delivers the enemy portion of LOOT-03 B, not all chest/Mimic/XP/egg
work. Power remains immediate puzzle authority. Enemy Gold/Science become real
collectible value only after final defeat, with persistent grounded drops and
protected schema5 migration. Existing defeated enemies are not rewarded again.

Ordinary camera tails remain effectively neutral in the paired Chromium lab.
Enemy rewards add some Paint/Layout work; untraced encounter hitches around50–67ms
remain. The [cold Power diagnostic](2026-09-07-enemy20-cold-power-diagnostic.md)
reproduces cosmetic first-Power expiry on both19/20 in fresh Edge processes;
semantic Power is correct. PERF-COLD-POWER remains open. No Apple/3GB/WebKit,
thermal, RAM-minimum, net cold-start improvement or native acceptance is claimed.

Q08/P19 prioritizes iPhone13/iPad8 entry, camera and first rewards. Q05/P20 asks
about authored and enemy loot readability/feel. [Current queue](../HUMAN_REVIEW_QUEUE.md),
[cumulative playtests](../PLAYTEST_CHECKLIST.md), [decisions](../HUMAN_DECISIONS.md).
Next: mixed chests and actual disguised Mimics, using the [remaining B sequence](../plans/LOOT-03-physical-collection-and-progression.md),
then recognition-only rainbow XP and protected usable inventory before eggs.
DELIGHT/LEARN/HOLE/pace and the campaign/Garden/co-op roadmap remain intact.

Documentation closure uses actual successful135bb3a as the unchanged deployment
guard's baseline. Record the observed remote ignored-build result separately;
no replacement game build is needed solely to align documentation SHAs.
