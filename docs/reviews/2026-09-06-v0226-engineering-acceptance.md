# v0.22.6 AUDIO-01V2 — engineering acceptance

Date: 2026-09-06. Runtime: `e628898bb4e501034f184a7a92c9e5e6d2b7a4aa`.
Root implementer/native operator: Astra. Independent reviewer: actual GPT-5.6 Sol;
see [Sol's final review](2026-09-06-audio01v2-sol-final-review.md).

## Scope and disposition

The calibrated controls and conservative presentation-preference migration are
accepted for a versioned family preview, subject to the separate exact-source
CI, Production deployment and public-download verification recorded by release
artifacts. This document is not itself a publication receipt or physical-listening
acceptance. The affected iPad camera remains unresolved.

New profiles get effective Music `0.10` / SFX `1`, displayed as `75% / 75%`.
Existing recognized preferences retain their exact effective gains, including
fractional values and old implicit defaults. Display rounding cannot rewrite
gains on unrelated edits. Explicit unknown calibration versions are not
overwritten. Only the presentation key gains a version marker; campaign and
active-run rules/schemas remain unchanged.

Music has a continuous monotone calibration curve, while SFX reaches `4/3` at
100%. The existing shared mute, independent zero, 20 ms ramps, streamed playback
and Test sound behavior remain. No new media, sound scheduler, compressor,
readiness/prefetch, art, camera, dependency or puzzle changes enter this release.

## Fresh verification and justified inheritance

- Serial project suite: **551/551 across 52 files**, 85 seconds. It ran on the
  versioned candidate before the final narrow CSS visibility correction and
  documentation merge; those do not change the tested TypeScript/test inputs.
  Exact-source CI is separately required before publication.
- Final frozen TypeScript/Vite build, performance contracts and inventory pass.
  JS gzip-9 **155,702 B**, **+395** from v0.22.5; CSS gzip-9 **23,980 B**, **+4**;
  public **165,031,011 B**, unchanged. Named allocations cover the deltas.
- Locked Cargo check and no-bundle Tauri release build pass; production dependency
  audit reports zero vulnerabilities. Seven application version fields agree.
- Art/public/source/pipeline/catalogue and gameplay/App/save inputs are identical
  to v0.22.5 by Git object comparison. Its fresh art validator (zero errors,
  429 declared warnings), inherited 136 art tests and canonical gameplay/layout
  evidence are carried forward explicitly, not presented as newly executed here.
- Browser **r4: 6/6 cases** on exact frozen source, fresh/legacy/future preferences
  at 844x390 and 1194x834. Pointer/keyboard controls, zero/mute/Test, reload,
  future-version preservation, unrelated edits and real graph targets pass.
  The limited Reset check uses an empty disposable campaign, not a populated save.
- Real desktop WebView2 **152.0.4191.62**: root inspected the actual native window
  and operated Play, Sound, pointer/keyboard sliders, mute/unmute, Test, pace,
  maze movement and normal Alt+F4 close. Two isolated profiles and four normal
  closes preserve the Human's profile. Fresh defaults are 75/75 without a
  read-time write; custom 50/100 survives restart. An actual Little Star Trail
  Up input saves one step at column 2 / row 4; Continue restores byte-identical
  active-run-v3 content. Synthetic legacy gains `.123456789/.642314159` survive
  an actual pace edit and restart exactly, displayed 78/48 throughout.

Portable: `Maze-so-Puzzle-0.22.6-AUDIO-01V2-e628898-locked-portable.exe`,
**173,468,672 B**, SHA-256
`847502332571c2a9d0afc3fe8f8e2f850e497a17bab0e586eee76a04bbf45dc9`.
Unsigned x64, version 0.22.6; source, staging and final copies match. No installer.

## Measured audio limits — not hidden by a green test

The offline harness uses the actual sound scheduler/voice cleanup and
engine-replayed legal movement/combat scenarios; separate 24-voice saturation is
labelled synthetic stress. OST PCM is measured outside the runtime, not newly
decoded in-game. Audio/engine/media inputs are unchanged between measurement
source `01e7521` and the freeze.

| Mix | 48 kHz sample peak / over-full-scale samples | 44.1 kHz |
| --- | --- | --- |
| New default Music .1 / SFX 1 | .184579 / 0 | .185564 / 0 |
| Music .1 / SFX 4/3 | .212773 / 0 | .214061 / 0 |
| Music 1 / SFX 1 | 1.084579 / 21 | 1.086222 / 16 |
| Music 1 / SFX 4/3 | 1.112773 / 23 | 1.114719 / 17 |

Both models accept bounded preview publication with the visible warning:
“Very high Music and Sound effects together may distort; lower either if you
hear it.” This is **not** all-range clipping-free, true-peak, mastering or
speaker qualification. AUDIO-01A/07B retain output-headroom review, including
two-stream overlap, before final qualification. P10 physical listening remains
open; default and maximum controls must be tested at comfortable device volume.

## Rejected attempts and corrections

- First browser attempts treated an idle disconnected SFX GainNode getter as
  audible output. A separate actual zero-output diagnostic proved the getter can
  remain stale despite immediate zero scheduling. The corrected idle gate
  requires zero scheduling plus no live connected voices; active Test still
  requires the actual target gain. WebView2 showed the same idle behavior.
  No runtime mute fix was invented to satisfy an incorrect observer.
- Sol caught an actual short-landscape defect: a pre-existing rule hid all
  `.sound-persistence` paragraphs, including the new warning. Narrowing it to
  `.sound-layout > .sound-persistence` retains the old hidden reset note while
  exposing the warning. Final r4 has readable 16 px text, no clipping, 9/9
  unobscured sample points, and restored scroll at both viewports.
- The first native staging attempt correctly refused a dirty checkout caused by
  Cargo's line-ending/stat normalization. Git's normalized blob equalled HEAD;
  `git add --renormalize` restored clean metadata with an empty staged diff.
  No file content or freeze changed, and staging was rerun only after cleanliness
  and exact build provenance were verified.
- The headless browser never actually became hidden during the attempted
  background test. Source/unit coverage is retained; no fresh hidden-page
  production proof is claimed.

## Evidence and recovery

Heavy evidence is outside runtime/repo under
`C:/GameDev/maze-game-qa/releases/v0226` and
`C:/GameDev/maze-game-qa/audio01v2`. The frozen release manifest records exact
hashes of logs, observations, screenshots and review envelopes.

- Browser r4 summary SHA-256:
  `de607cee4b1d931620f50ffd035a6d2097defe15cde19a6af555af4a8da87abf`.
- Actual 48 kHz report:
  `f6ca49cacf9f3a8c8a345aa6fecdd471b21d28336479e67ebd9800a58e39e4be`.
- Actual 44.1 kHz report:
  `52542100c9c455567fa05f41821b1a46b07ef2da1234078fd724672fb3cd1242`.
- Idle diagnostic:
  `b1ed7765963fc7108260af8ee0bb6c81fc320f91c16e9eb09c1b67b543840720`.
- Runtime-input SHA-256:
  `65942b5a4809b81073782adf2949f4d035e28cbee50d962f17bc627541063dd2`.
- Dist fingerprint:
  `49379c627553895aba91d6e80948aa351c5aa7cbac769134aca03e78c56ee006`.

Rollback is the complete calibration/migration/display mapping to immutable
v0.22.5 `7282665f8631051785176b701b1a7f14b7fe24a3`; no reset or data deletion.
Older code can clamp boosted SFX or rewrite preference metadata, so do not promise
byte-identical comfort settings through an old-build write.

Next implementation: AUDIO-01A readiness/sound work under its existing plan,
not a claim that calibration completed it. P5–P10, iPad camera/PT36 and physical
family acceptance stay cumulative in the checklist. No new blocking Human decision.
