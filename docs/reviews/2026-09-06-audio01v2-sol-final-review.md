# AUDIO-01V2 — Sol independent source and peak review

Date: 2026-09-06. Independent read-only review of the AUDIO-01V2 candidate at
source checkpoint `01e75216d4c3c85d39d555137fbbd362065c5db1`, its calibration,
migration, graph and Sound UI changes, and the source-bound 48 kHz / 44.1 kHz
OfflineAudioContext evidence. This is conditional engineering approval for a
qualified preview. It is not physical listening, final audio qualification,
all-range clip-free acceptance or publication authority.

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

## Remaining gates

Before promotion, retain source identity and close only these bounded gates:

- production browser proof that fresh 75/75 anchors, pointer and keyboard range
  changes, fractional legacy gains, unrelated pace/quality changes, reload,
  future-version refusal and Reset Progress behave without rounded-storage drift;
- real graph proof for exact default/max gain response, the 20 ms ramp,
  mute/change/unmute, zero/hidden cancellation, no Test sound per slider tick,
  and unchanged track identity/time;
- full serial project tests, production build/budget/provenance, and focused
  native close/reopen persistence at the frozen candidate;
- later phone/iPad/laptop/native listening at default and high combinations.
  Missing physical listening stays explicit and cannot be inferred from these
  offline samples.

No AUDIO-01A prefetch/crossfade, new cues, mastering, dependencies, media or UI
redesign is authorized by this review. Rollback remains the complete calibration,
migration and UI mapping together to the frozen v0.22.5 raw-gain behavior.
