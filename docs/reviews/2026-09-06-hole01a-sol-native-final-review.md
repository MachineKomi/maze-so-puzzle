# Sol final native review — HOLE-01A / v0.22.8

Date: 2026-09-06 09:40 BST
Reviewer: actual Sol, independent read-only source/evidence review
Frozen source: `3acaf5872dd921f15929c330eeae46053b2a6362`
Branch: `codex/single-hole-crossings`

## Decision

**ACCEPTED for merge and promotion through the existing CI/Production/publication
pipeline as the bounded v0.22.8 preview candidate.** I found no remaining source,
browser or native release blocker within HOLE-01A Phase 1.

This is not acceptance of a published deployment or downloadable release until
their exact-byte verification completes. It is not Human/family, physical touch,
iPad performance, continuous-sprite-paint, signing, new-art, Phase 2 connected
ditch, PT36 or full Plan 04 acceptance.

## Source and automated gates

- The clean frozen commit reproduces the independently reviewed 27-file
  runtime/test/version manifest exactly:
  `69655357023f2dfc0019e87074ec6fb814a3f5f2930455e36158ce3e1250f475`.
  Its complete 44-file delta from baseline `6cf783d95e0d4b399c97c0ff3f820a926a137645`
  is `6d43e5dd4fef5b8acc7152d959435ae86c6efe5bfadb2919e6236f6df6e8b4a8`.
- Serial project suite: 623/623 across 54 files. Art unit suite: 136/136.
  TypeScript/Vite build and deterministic budgets pass: JS gzip9 157,169/157,357;
  CSS 23,980/30,697; public bytes 165,031,011/165,031,011.
- Corrected production browser cohort passes 20/20; exact-App synthetic compound
  jump-to-portal cohort passes 15/15; fixed-pad mouse cohort passes 3/3. The
  original browser follower selector was invalid, so only corrected r2 supports
  follower claims.
- I accept inherited static-art qualification for this no-new-art preview only:
  1,535 tracked blobs in 16 art scopes are Git-identical at validated v0.22.5,
  published v0.22.7 and frozen v0.22.8. Fresh full-art validation is failed, not
  passed. The stale manifest/ignored-proof/EOL dependency and all 429 warnings
  remain recorded; repair is required before Phase 2 or a fresh-validator claim.

## Locked native build identity

- Fresh `npm ci`: 0 vulnerabilities. Locked optimized Tauri build completed in
  4m11s from frozen source; the before-build TypeScript/Vite/provenance build passed.
- Staged/attachment portable: 173,469,696 bytes, SHA-256
  `a99fcfc30f587a961659ff555d559b883b8cb8b0d6c5068edac24ada2b6058e9`.
- Source executable, stage and attachment hashes are equal. PE/MZ and x86-64
  checks pass; version/product/file version are 0.22.8. The binary is unsigned,
  which is an explicit retained limitation rather than a changed release claim.
- Build provenance binds source `3acaf587…`, runtime-input digest
  `7bf91c217b2816beeefa288378b54f6b7e17adb5e09d5b47672fa767e7fbbaed`
  and dist digest
  `298bceb8f3798171c8a6723ebe715375bd30c5950bac3a61154f14ed1bf0b8fd`.

## Native behavior accepted

The run used an isolated QA profile and a current-engine-derived Wishing Woods
fixture. Root supplied the actual Windows inputs; the observer was passive and
bound to the exact executable, PID/start time, profile and CDP ancestry.

| Settled observation | Input | Position | Steps | Followers |
|---|---|---:|---:|---:|
| Before | — | 5,3 | 96 | 2 |
| Jump right | keyboard Right | 7,3 | 97 | 2 |
| Jump left | keyboard Left | 5,3 | 98 | 2 |
| Jump right | on-screen pad Right | 7,3 | 99 | 2 |
| Reopened/continued | Play, Continue | 7,3 | 99 | 2 |

Each jump added and removed one 460ms, one-hole presentation, hid the base player
and followers during that presentation, then returned to a settled board with two
real `.pet-follower` roots. Each input committed exactly one action/save. The
settled screenshots independently show Ame, held weapon, Spring Boots state,
Power 29, the correct pit side, follower HUD state and counters.

Before final close, root used the actual Sound control and changed Regular to
Zippy. Stored calibrated preferences were
`audioCalibrationVersion:2, motion:full, quality:full, pace:zippy,
musicVolume:0.1, sfxVolume:1`; the visible sliders remained 75/75, as intended by
the calibrated mapping. After actual Alt+F4, a new PID reopened to Play/Continue,
and Continue restored exact position 7,3, step 99 and two followers. The active
run, durable progress and presentation-preference raw strings were byte-for-byte
equal before close and after resume.

Setup close, ordinary close and reopened final close all report the owned process
exited, debug endpoint closed, zero profile processes and no remaining owned
listener. All three closes were actual Alt+F4 operations.

The initial seed helper's path guard failed before mutation and was corrected;
the later seed/setup-close/reopen chain is the accepted evidence. An ad-hoc
preference read addressed the parsed wrapper instead of `.value`; exact raw
equality and the corrected `value.pace === "zippy"` assertion pass. Neither
rejected attempt weakens the accepted chain.

## Visual observation and bounded limits

Two early root captures during separate jumps showed Power and Spring Boots before
Ame/weapon painted; a third actual mid-jump capture showed the complete actor.
Source always mounts the Ame node and mounts the weapon when authoritative
`hasSword` is true, while hiding the base layer. That async CatalogueImage/CSS/art
path is unchanged from the accepted predecessor and the settled native frames are
complete. I therefore treat this as non-blocking first-paint/remount or capture
timing evidence, not an engine/save regression. Do not claim continuous actor
visibility; retain a visual follow-up if human-visible blanking is later observed.

The native run is fixture-start rather than fresh-campaign end-to-end. DOM follower
presence does not prove distinct painted positions on every frame. The passive
observer adds overhead and does not qualify frame time, audio, physical touch,
background/resume, clean-machine installation or signing. Synthetic browser
visibility evidence is not native backgrounding.

## Evidence binding

| Artifact | SHA-256 |
|---|---|
| `native-summary.json` | `3ee7f0c0452127077589e7b846f3287de5a7c597aa4103408ace4c25cf92dcf3` |
| `native-build.log` | `cefc9fb0e2e282a792aebb9e9524c989904b2737f1a8f61c32acef460e0d7ea2` |
| `portable-stage.json` | `caf9d490db16695b998604af7eb08b575296df1f7202fb3146c0161d5506ceae` |
| `npm-ci.log` | `798f168488361d15e37738ca4064715ade3b0ffc2ea90f9ea047fbf0fa8d89bc` |
| release `perf-check.log` | `a86f1e17989b9a9024930ec013e2e3b5da055e546406588532bae68d08cc4a8c` |
| `before-jump.json` | `98d267c5746cd539d9f7767c3b937f9e4474984e90b4ac776f94b5828ff7d3ce` |
| `after-key-right.json` | `c7bd934b5e55090bd22cfe999319bdf26cad5446ceb750757bf59c189b0ec35d` |
| `after-key-left.json` | `7677f1672a112f6c76a71c45c762bbc7ef9cdd8db42fd8b7c63163bbef50104b` |
| `after-pad-right.json` | `644e6be605ab4288168dc56283e0083cf2ee1f2a86037c0a6339925045587ca7` |
| `before-final-close.json` | `f3b84c82f64ba1ea01aebdaa80550a16f9f1f3cccdb6a30dbd416e763b0b590d` |
| `resumed.json` | `7529f1efadd950174c63cdb27abdea9d01a139c8b52655f86928f98fbd4625ce` |
| `setup-close.json` | `f26d4a87d034b82e4cbed18c5b309ba8e3b0116b4e781dc9629284488298f4db` |
| `ordinary-close.json` | `4ade19ca5648207f8b9d702fabc95cff66e9a3926e3b4f3c8fd2a50410e03ad6` |
| `reopened-close.json` | `18c65dccb78cf258177206b159f6e4b99867d2394d242d88b743fa1c95437af8` |

Promotion must preserve frozen source and exact build identity. CI/Production and
public downloads must still be independently compared before calling v0.22.8
published. No failure should be “fixed” by clearing player data, regenerating art
authority, restoring multi-hole traversal, or weakening the captured limits.
