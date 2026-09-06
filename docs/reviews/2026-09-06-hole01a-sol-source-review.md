# Sol independent review — HOLE-01A / v0.22.8

Date: 2026-09-06 09:11 BST
Reviewer: actual Sol, independent read-only source/evidence review
Baseline/HEAD: `6cf783d95e0d4b399c97c0ff3f820a926a137645`
Branch: `codex/single-hole-crossings` (reviewed before candidate commit)

## Verdict

**Conditional source and browser acceptance for the bounded v0.22.8 preview.**
I found no remaining source blocker in the reviewed candidate. Native build/play,
normal close/reopen, frozen commit identity, exact-source CI/Production bytes and
published-download verification remain release gates and are not accepted here.

This acceptance is deliberately limited to Phase 1: one directional input may
cross exactly one adjacent hole to the immediate eligible landing. It does not
accept connected-ditch artwork/topology, physical-device play feel, child/family
comprehension, or the broader Plan 04 rollout.

## Exact reviewed state

Hashes are SHA-256 over the working-file bytes. Manifest digests use sorted
repo-relative paths and lines of `path<TAB>sha256<LF>`.

- Complete changed/untracked working manifest: 43 files,
  `e0e8ce8791e28a50077716070f8c231a83c400e9138ccf8253b4fbbb7e5b9821`.
- Runtime/test/version manifest (`src/`, `src-tauri/`, `scripts/`, package files):
  27 files, `69655357023f2dfc0019e87074ec6fb814a3f5f2930455e36158ce3e1250f475`.
- `src/game/engine.ts`:
  `53cbd6a3d14b5a66929d9f9891f1c6a21c2cb211858c88adc803dd634db47af7`.
- `src/App.tsx`:
  `0a55c6596630e3858b3043b390e13ff23558b70bf865d025052820cbea586554`.
- `src/session.ts`:
  `9f06bb25caaef44e7cb21ae9e54341f0199c356675432e4b1469a720e2899bfe`.
- `src/game/generator.ts`:
  `83d932a9d35132bbad214a459a39a1c1aadd7bf3c255716926a2f30713467029`.
- `src/game/singleHoleCrossings.test.ts`:
  `df3c6b59dcc0828085c6e0f8b38409602dcb3bc0267f08a3dddf6e00d972f0fc`.

A later source, test, version or relevant documentation change requires a new
binding/check; a commit made from these exact bytes may replace this working-tree
identity without changing the technical verdict.

## Source findings

- `src/game/engine.ts:133-213` implements a single +2 landing. A second hole,
  bounds or wall fails before a misleading boots hint. Eligible geometry then
  requires Spring Boots and pre-existing water/lava/poison protection.
- `src/game/engine.ts:171-203` rejects unresolved door/enemy/cage landings before
  emitting a jump, so it cannot remotely open, fight or rescue. Resolved objects
  are floor again. Passive pickups and exits remain ordinary landing effects.
- `src/game/engine.ts:301-317` composes the one allowed passive continuation:
  jump onto a portal entrance, warp to its twin, then commit the single moved
  action/step. Focused tests cover exact event ordering, pickups once and exit.
- `src/App.tsx:1193-1250,1512-1518` keeps jump and portal as consecutive visual
  phases under one presentation suspension. Only the final portal phase unlocks
  input; visibility cancellation invalidates the shared timer generation and
  reveals the already-committed final state. There is no intermediate follower
  or base-player flash in the corrected traces.
- `src/session.ts:190-210` composes the possible two-tile hole approach with
  portal Manhattan displacement. It is conservative when a level contains an
  unrelated hole and does not under-bound a compound saved move.
- The generator selects one straight path tile and reserves its approach and
  landing against hazards and later actors. Recipe v6, generated content revision
  2 (used for both identity input and returned level), authored revision 4 where
  maps changed, and global gameplay-rules revision 3 prevent silent stale-run reuse.
- Teaching text now says exactly one hole with clear ground immediately beyond.
  The fixed 460 ms full-motion arc and existing reduced phase do not vary with
  walking pace.

I initially misidentified Friendship Crown Vault `(11,9)` as a cage; the authored
object is a blue key. The corrected positive assertion proves pickup-on-landing.
Lanternlight `(9,4)` is the actual caged-friend fixture. This was review/test-data
correction, not a runtime defect.

Earlier review did find two candidate issues that were fixed before this verdict:
generated content still used revision 1 at both identity boundaries, and the
Spring Boots hint could imply a wider jump. Both are corrected in the bound state.

## Independent evidence assessment

- Serial project suite: 623/623 across 54 files. No search/state budget increase.
- Art suite: 136/136. Build and deterministic size checks pass: JS gzip9
  157,169/157,357; CSS 23,980/30,697; public bytes 165,031,011 unchanged.
- Corrected production cohort: 20/20. It covers tap on eight authored maps and,
  on the Wishing Woods fixture, all three paces x full/reduced motion x
  release/hold. Every trace has nonzero rescued followers before/after, zero
  visible followers and a hidden base player during the jump, stable committed
  steps, matching stored state, and no broken image.
- Corrected compound lab: 15/15 using exact App source with a QA-only injected
  jump-to-portal level. All normal cases show jump then portal with step 2 stable
  through both phases, one follower hidden throughout and restored at the portal
  twin. Release stops at step 2; hold resumes only after both phases for step 3.
  Synthetic hide-during-jump and hide-during-portal cases restore final saved
  portal state without an extra step.
- Fixed-pad mouse-pointer cohort: 3/3 for release, hold and steer-back. It shows
  no stale held direction and followers restored, but is not touchscreen evidence.

Artifact hashes:

| Artifact | SHA-256 |
|---|---|
| `project-tests.log` | `8b7458ee734b2556c5308fc86b97462f47b75fc37f79e2d129f6d4fe64ed1cd3` |
| `final-focused.log` | `7f066f29b87b6d70942751914336160166731e04fd409f8ac4b6012e1b19ca7d` |
| `art-tests.log` | `933f8f81bf3622e82d88f5f3154676097892ab7ae15a5fc8a28948862132228e` |
| `build.log` | `0d0b74592c5f67987463876ef8065c4951ba45af542cf3d60410e5baefb4c846` |
| `perf-check.log` | `f929cc24fcc3f45490e1edaedafd2bf5e62c3c9ad6a3298f9f9b73e933999459` |
| `production-browser-r2-results.json` | `d3a9c666336752f7021ca43fdc5b9b9e397f9f8c91f3822ffb500bf0a6cad06d` |
| `lab-browser-r2-results.json` | `bebc2999c0a6f74263bcb347397d5fc363790c0326a963d831756fa1c300c7b5` |
| `pointer-results.json` | `154cd0822af39f9a7ed0e98d49ecd0dc9e03c91378ab3edce2b91a350c5bdf3a` |
| `metrics.json` | `d45056796b779f540655a08d14195706897a5277eae8c2693bc1c2d77032d547` |

The first production/lab artifacts used a nonexistent `.pet-follower-image`
selector, so their zero counts do **not** support any follower claim. I rejected
that claim and required both cohorts to rerun. R2 observes real `.pet-follower`
roots and asserts nonzero baseline/final counts; only R2 supports the statements
above.

## Limits and release conditions

The production cohort uses actual production UI with engine-derived authored
snapshots; it is not a complete UI replay of every solver route. The compound lab
uses exact App code but substitutes a synthetic level externally and is not a
release-byte test. Its visibility cases override `document.visibilityState` and
dispatch the event; they are lifecycle evidence, not native background/resume.

Before release, require a frozen commit/source identity, clean locked native
build, bounded real native jump plus normal close/reopen with saved-state and
follower checks, and the existing exact-byte CI/Production/download chain. Keep
P12, physical touch/tablet/device, family comprehension and new connected-ditch
art explicitly open. Do not claim broader physical or perceptual acceptance from
these source and observer traces.
