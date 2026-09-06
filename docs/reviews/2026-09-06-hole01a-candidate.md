# HOLE-01A — bounded single-crossing candidate

Date: 2026-09-06. Root: Astra. Independent reviewer: actual GPT-5.6 Sol High.
Baseline: `6cf783d95e0d4b399c97c0ff3f820a926a137645`, published runtime v0.22.7
`9b822281197c9e9e65a8c9467fe5bd578dce1cbd`. This record qualifies source work;
native, exact-source publication and family acceptance are separate gates.

## Contract and changes

- Spring Boots cross exactly one hole along travel, with immediate eligible
  landing. Invalid width/wall/bounds are checked before suggesting equipment.
  Landing on a protected hazard requires the existing protection beforehand.
- An unresolved door/enemy/cage cannot be a jump landing, regardless of keys or
  Power. Resolved objects become floor; passive pickup/exit/portal remain legal.
- Jump→portal is one engine action/save with two serial presentation phases,
  no intermediate input unlock, base-player flash or follower reappearance.
  Ordinary full-motion jump is 460ms, reduced 140ms; pace still owns walking.
- Eight hole→floor edits in seven maps preserve object coordinates/IDs/rewards:
  Wishing Woods (7,3), Grand Parade (1,10), Sky Hollow (9,1), Lanternlight (3,9),
  Twilight (19,13)/(19,15), Moonlit (15,19), Clover (11,12). Coordinates are zero
  based. Those maps advance revision3→4. Crown Vault's x12/y9–15 strip, Lanternlight
  junction (8,4) and Sky Hollow isolated pit (10,9) remain.
- Rules3 changes fingerprints globally. Generated recipev6/contentRevision2
  reserves both approach/landing against later hazards, cages and guardians.
  Old unfinished runs fail closed with the existing notice; durable progress,
  rewards/unlocks/friends and historical bests survive. No new storage schema.
- Current art/media/CSS, audio, camera, controls architecture and dependencies
  are unchanged. New ditch art/topology is Phase2; PT36 and Plan04 remain later.

## Verification

- Serial project suite: 623/623 across54 files. Final additional blue-key
  assertion and shared scenario fixtures: 48/48. No timeout/state budget raised.
- Art pipeline: 136/136. TypeScript/build and deterministic performance pass:
  JSgzip9 157169/157357 (93B smaller than v0.22.7), CSS23980/30697,
  public165031011/165031011 unchanged. Timing gates remain report-only.
- Current solver ordinary/perfect routes replay all16 authored maps, plus
  deterministic generated seeds. All ordinary routes avoid optional rescues;
  perfect routes rescue all friends. Exact results are in the gameplay spec/tests.
- Corrected production browser cohort20/20: eight authored fixtures, three paces,
  full/reduced motion, release/hold. Starts are engine-derived private QA saves.
- Corrected synthetic-level cohort15/15: exact App code, controlled jump→portal
  map, phase ordering/input gating/save/followers, three paces and motion settings.
  Two visibility-cancel cases dispatch synthetic events; they are NOT physical
  background/resume evidence. This laboratory build is NOT release content.
- Fixed thumb-pad pointer3/3: release, hold, steer back. Real browser mouse
  pointer input, not physical touchscreen. The latter waits until landing before
  taking the new direction. Manual images inspected at gameplay scale.

## Evidence and rejected claims

External root: `C:/GameDev/maze-game-qa/holes/v0228/`. Heavy traces/screenshots stay
outside delivery. SHA-256 records below preserve the accepted compact artifacts:

| Artifact | SHA-256 |
|---|---|
| project-tests.log | 8b7458ee734b2556c5308fc86b97462f47b75fc37f79e2d129f6d4fe64ed1cd3 |
| final-focused.log | 7f066f29b87b6d70942751914336160166731e04fd409f8ac4b6012e1b19ca7d |
| art-tests.log | 933f8f81bf3622e82d88f5f3154676097892ab7ae15a5fc8a28948862132228e |
| production-browser-r2-results.json | d3a9c666336752f7021ca43fdc5b9b9e397f9f8c91f3822ffb500bf0a6cad06d |
| lab-browser-r2-results.json | bebc2999c0a6f74263bcb347397d5fc363790c0326a963d831756fa1c300c7b5 |
| pointer-results.json | 154cd0822af39f9a7ed0e98d49ecd0dc9e03c91378ab3edce2b91a350c5bdf3a |
| metrics.json | d45056796b779f540655a08d14195706897a5277eae8c2693bc1c2d77032d547 |

The first browser cohort used a nonexistent follower-image class, so its zero
counts could not prove follower behavior. Sol caught this; those follower claims
are rejected. R2 observes real `.pet-follower` roots and requires nonzero baseline,
zero during both phases, and correct reappearance. Old artifacts remain history.
The initial parallel suite had stale v5/three-hole expectations, a mistaken
Crown Vault cage assertion (11,9 is a blue key), and a contention timeout. Fixtures
were corrected and the full serial suite passed; no search limit was increased.

## Remaining gates

Art-validator preflight found one local CRLF checkout of an LF-pinned pipeline
test; its normalized LF SHA matched the existing manifest. Only local EOL was
normalized to the committed bytes; no test/source/manifest change was needed.
The preflight failure remains in `art-check.log`; the corrected check is separate.

Finalize source review/freeze, fresh locked native build, real native jump and
normal close/reopen, CI/Production exact bytes and all public downloads. P12 and
earlier family/device checks remain open. No physical iPad camera improvement,
hardware performance qualification, new ditch artwork or final release readiness
is claimed. Roll back the complete rules/content/presentation seam together;
never clear player data or restore just the old multi-hole loop.
