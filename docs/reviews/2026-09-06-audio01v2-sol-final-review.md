# AUDIO-01V2 — Sol independent source and peak review

Date: 2026-09-06. Independent read-only review of the AUDIO-01V2 candidate from
source checkpoint `01e75216d4c3c85d39d555137fbbd362065c5db1` through the clean
provisional v0.22.6 freeze `e628898bb4e501034f184a7a92c9e5e6d2b7a4aa`, its
calibration, migration, graph and Sound UI changes, and the source-bound 48 kHz /
44.1 kHz OfflineAudioContext and production-browser evidence. I approve this
exact source/browser freeze for a qualified preview, subject to native
qualification and the limits below. This is not physical listening, final audio
qualification, all-range clip-free acceptance or publication authority.

## Source verdict

No source blocker remains in the bounded calibration seam:

- Effective linear gains remain the stored/API authority. Fresh and ordinary
  malformed preferences default to Music `.10` and SFX `1`, represented as
  75% / 75%; recognized unversioned preferences preserve old raw gains and
  old `[0,1]` normalization.
- Version 2 alone admits the candidate SFX upper bound. Read does not write;
  the writer rechecks storage and refuses any explicitly declared unfamiliar
  marker, including a future numeric version or null/string/zero marker. The
  UI patch type cannot change the version. Refusal preserves the stored bytes,
  applies the in-memory choice and uses the existing save warning.
- Sol's selected C1 music curve is exact at 0 / 75% / 100%, monotone, slope-
  continuous at the default and invertible. The tests cover dense positions,
  tiny/fractional gains and boosted SFX values above one.
- Sound UI percentages are derived presentation. Only a real slider input runs
  the forward map; opening Sound or changing another preference does not feed a
  rounded percentage back into gain.
- The same raw music gain continues through `setAudioLevels`, `configureMusic`,
  the single Web Audio gain and the direct-media fallback. The media element is
  unity only behind its graph, and volume-only changes do not restart or seek it.
  SFX `4/3` reaches the existing SFX GainNode; mute, hidden, zero, cancellation,
  voice cap and cue envelopes are unchanged.

The candidate's deliberate unknown-marker refusal is conservative, not silent
repair: malformed JSON/absent markers remain repairable, while the presence of
an unfamiliar declared format is treated as possible future authority.

## Measured peak decision

I inspected both complete reports and the harness. It uses the verbatim source
`sound.ts` scheduler, voice map, oscillator/gain envelopes and native ended-event
cleanup; current engine/combat-derived timelines guarded against App drift; all
42 actual decoded OST files; and sample-for-sample PCM summation through the
current parallel music/SFX topology. It records phase-alignment choices, source
hashes, admission/drop counts and important limitations. It is proportionate
sample-peak evidence, not LUFS, intersample true-peak, callback-jitter or speaker
audibility proof.

Reports:

- 48 kHz: `C:/GameDev/maze-game-qa/audio01v2/candidate-r2-full-48000/sample-peak-report.json`,
  SHA-256 `f6ca49cacf9f3a8c8a345aa6fecdd471b21d28336479e67ebd9800a58e39e4be`.
- 44.1 kHz: `C:/GameDev/maze-game-qa/audio01v2/candidate-r3-full-44100/sample-peak-report.json`,
  SHA-256 `52542100c9c455567fa05f41821b1a46b07ef2da1234078fd724672fb3cd1242`.

| Mix | 48 kHz peak / over-scale samples | 44.1 kHz peak / over-scale samples |
| --- | ---: | ---: |
| New default Music `.10`, existing SFX `1` | `.184579` / 0 | `.185564` / 0 |
| New default Music `.10`, boosted SFX `4/3` | `.212773` / 0 | `.214061` / 0 |
| Music `1`, existing SFX `1` | `1.084579` / 21 | `1.086222` / 16 |
| Music `1`, boosted SFX `4/3` | `1.112773` / 23 | `1.114719` / 17 |
| SFX-only adversarial 24-voice Test stress at `4/3` | `.344708` / 0 | `.351120` / 0 |

The 48 kHz matrix had zero overshoots in all 240 selected active/reachable rows
at default Music `.10` for either SFX gain. At Music `1`, existing SFX `1`
already overshot in 81/240 selected alignment rows; boost increased this to
86/240. Thus the candidate provides measured, useful headroom around the new
default, while the all-controls-maximum combination is not clip-free and the
boost modestly worsens an existing maximum-mix limitation.

I accept `4/3` for a **qualified preview** because every SFX-only and default-mix
row retains ample sample margin, and no smaller value above one can eliminate
the pre-existing Music-maximum issue without broader output/mastering policy.
This is conditional on visible near-control copy:

> Very high Music and Sound effects together may distort; lower either if you
> hear it.

Do not describe 100% as universally safe, claim the full range clip-free, or add
an unreviewed compressor/limiter in this seam. Unified output protection,
mastering and final all-range qualification remain AUDIO-01A/07B work.

## Production graph and UI proof

The final six-case production-browser run passed all 60 labelled rows across
844x390 and 1194x834 fresh, legacy and unfamiliar-version profiles. It exercised
pointer and keyboard sliders, exact raw fractional preservation across unrelated
edits and reload, future-format write refusal, Reset Progress preservation,
mute/change/unmute, zero and Test sound. The observer wrapped the browser's
actual AudioContext factories without replacing or rerouting the production
graph. It found the media source connected only through the music gain, element
volume `1`, no slider-driven oscillator flood, exactly one two-note Test cue,
and no track restart or seek from level changes.

Final run: `C:/GameDev/maze-game-qa/audio01v2/ui-attempts/r4/summary.json`,
SHA-256 `de607cee4b1d931620f50ffd035a6d2097defe15cde19a6af555af4a8da87abf`.
Its before/after identity is the clean freeze `e628898b`; all retained gain
ramps schedule exactly 20 ms. A separate actual-graph maximum observation
reached Music `1` and SFX `1.33333337` without changing the playing source or
time.

The first production attempt was correctly rejected when a muted, disconnected
SFX GainNode continued to report its prior `.733` parameter value. The isolated
diagnostic proved this is an idle getter artifact, not audible output: the
disconnected input rendered zero; scheduling zero while disconnected still
reported the stale getter; reconnecting the same positive input reported and
rendered zero. Actual OfflineAudioContext default/maximum ramps stayed within
`1.285e-6` worst error and rendered exact zero by 60 ms. Diagnostic:
`C:/GameDev/maze-game-qa/audio01v2/idle-param-r1/result.json`, SHA-256
`b1ed7765963fc7108260af8ee0bb6c81fc320f91c16e9eb09c1b67b543840720`.
The corrected production gate therefore requires immediate zero scheduling plus
no live connected SFX voices while idle; it still requires the active getter for
Test sound.

My review found and blocked one real short-height UI miss before freeze: the
existing landscape rule visually clipped every `.sound-persistence`, including
the new maximum-mix warning. The final four-byte selector narrowing hides only
the direct-child reset note. In r4 the warning is readable at 16 px in a
305x64.8 px box on 844x390, with `clip-path:none`, all nine sampled interior hit
points owned by the warning, its bottom above the fixed footer, and dialog scroll
restored after inspection. At 1194x834 it is 397x43.2 px with no scroll. The
source now meets the visible-warning condition on which the `4/3` decision rests.

The freeze also has 551 passing source tests, TypeScript/production build and
audit passes, and source/game/art/public input equivalence recorded for v0.22.6.

## Native disposition

I approve the focused native gate for the same exact freeze after independently
reading the source-bound summary, assertion script and selected observations and
screenshots. The staged portable is 173,468,672 bytes with SHA-256
`847502332571c2a9d0afc3fe8f8e2f850e497a17bab0e586eee76a04bbf45dc9`;
the actual host used WebView2 `152.0.4191.62`.

Native evidence:

- `C:/GameDev/maze-game-qa/releases/v0226/native-summary.json`, SHA-256
  `73a0db794d6074df1e716ba28b46623062cb1eaa81aaa4350cc8f8fed9e7203b`;
- `C:/GameDev/maze-game-qa/releases/v0226/review-native.mjs`, SHA-256
  `2dd937dd6fea94b346246c5f032ef14ded6e7c6c738c36b41224d8f01826133d`.

The assertions bind every retained JSON observation to `e628898b`, require the
real native bridge and an error-free observed graph, and cover two isolated
profiles with four normal Alt+F4 process/debug-endpoint closes. A fresh profile
opened at 75/75 without a read-time preference write; real pointer/keyboard
changes exercised Music zero/max, SFX `4/3` and one two-oscillator Test cue.
Mute and change-while-muted scheduled immediate zero on both channels with no
live connected SFX voices; unmute restored the chosen raw gains. Music 50% and
SFX 100% then survived a normal close/reopen as raw `.044444444444444446` and
`1.3333333333333333`.

The labelled synthetic legacy seed `.123456789` / `.642314159` remained exact
through a real pace change to Zippy and normal restart while the display stayed
78/48. Separately, a real Up move produced exactly one Little Star Trail step at
`{x:1,y:3}`; the active-run v3 bytes and visible maze state were identical after
normal restart and Continue. This closes functional native persistence and
graph/UI smoke only. It does not turn the synthetic legacy seed into an organic
upgrade observation or establish acoustic quality.

## Remaining gates

The bounded source, production-browser and native functional gates are closed
for exact freeze `e628898b`. The browser/native runs never actually entered the
hidden state, so unchanged hidden/mute logic has source and unit coverage but no
new production hidden-page proof. That limitation is not a claim of failure and
must not be rewritten as fresh browser coverage. This review also does not cover
installer/signing, clean-machine behavior, full campaign replay or sustained
timing.

Phone/iPad/laptop/native listening at default and high combinations remains
open. Missing physical listening cannot be inferred from the offline samples,
desktop Chromium graph observations or a native functional smoke.

No AUDIO-01A prefetch/crossfade, new cues, mastering, dependencies, media or UI
redesign is authorized by this review. Rollback remains the complete calibration,
migration and UI mapping together to the frozen v0.22.5 raw-gain behavior.
