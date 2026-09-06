# AUDIO-01A — Sol envelope and headroom review

Date: 2026-09-06  
Reviewer: Sol, independent source review  
Repository: `C:/maze-game`  
Reviewed base HEAD: `16deeb2e954fc7001f722479c15f9c9acedefdcb`

## Freeze binding

This decision binds the reviewed working files, including the uncommitted
envelope-ordering correction, by SHA-256:

| Working file | SHA-256 |
| --- | --- |
| `src/musicPlayback.ts` | `5B3721C31C90E1942A77B15F69DA719C43618BBB9CAFF12F21B022CC20B3BF0A` |
| `src/musicPlayback.test.ts` | `74402622FCD2A6DDB881F85A309855D195B14FD9201C9C06DFFF3111866EB5EE` |
| `src/audioMix.ts` | `1B5BCB4857A44FF06396C539DB827373DC369854ECF33D977B4C00334D0B40A5` |

The reviewed delta is limited to `src/musicPlayback.ts` and
`src/musicPlayback.test.ts`: 17 added/7 removed source lines and 27 added test
lines relative to the base HEAD. `git diff --check` returned no errors. I read
the exact diff, complete playback controller, relevant tests and shared audio
mix. I did not rerun tests or runtime work; Astra reports 68/68 focused tests
passing after this correction.

## Independent decision

I accept this exact source for the bounded AUDIO-01A preview, conditional on the
forthcoming final focused browser and native results. The earlier release
blocker is closed in source:

- Normal 400 ms handover calls `crossfade(outgoing, target, .4)`.
- Rapid retarget calls `crossfade(obsolete, retained, .02)`.
- `crossfade` samples the owning `AudioContext.currentTime` once, uses that same
  start and end time for both lanes, and queues the decreasing lane before the
  increasing lane.
- Failure cancellation no longer restores the outgoing lane to unity before
  disposal. `clearStandby` cancels the timer, releases and disconnects the
  standby graph, then ramps the survivor toward one over 20 ms. The redundant
  second restore was removed.
- The two focused regressions deliberately advance `currentTime` on every read,
  verify identical paired endpoints and decrease-first ordering in both fade
  directions, and verify disconnect-before-restore with no immediate unity
  step on a failed incoming lane.

If rendering consumes both paired automation messages together, their held
starting values and common linear endpoint preserve complementarity. If it
splits the sequential control messages at a render boundary, the decreasing
operation becomes effective first; this can create a very short underlap but
cannot create the former raised-lane overlap. On failure, any equivalent split
also removes the standby before raising the survivor. There is therefore no
remaining source path in the reviewed delta that intentionally doubles the
Music bus during a supported two-lane transition.

## Exact peak claim

For post-decode/post-resample lane samples `x1(t)` and `x2(t)`, shared calibrated
Music gain `M`, and non-negative complementary weights `w1 + w2 = 1`, the Music
bus sample is

`y(t) = M * (w1*x1(t) + w2*x2(t))`.

By the triangle inequality,

`|y(t)| <= M * (w1*|x1(t)| + w2*|x2(t)|) <= M * max(P1, P2)`.

Thus the complementary linear fade introduces no Music sample-amplitude bound
above the larger participating single-track bound. A decrease-first render
split has `w1 + w2 < 1` temporarily and remains bounded when compared with the
single-track and silence endpoints.

That is a source/sample-domain argument only. It is adequate for this bounded
engineering preview because the shared calibrated Music master, SFX master,
preferences and warning remain unchanged, and the new lanes introduce no gain
stage above unity. It does **not** establish or repeat the prior measured whole
mix maximum for every new pair, playhead and SFX phase alignment.

## Claims intentionally not accepted

This review does not claim:

- perceptually constant loudness; a 0.5/0.5 linear fade can produce an
  approximately 3 dB power dip for uncorrelated equal-RMS material;
- click-free or acoustically seamless failure disposal;
- inter-sample true-peak safety, LUFS balance, decoder equivalence, callback
  timing, device-speaker comfort or physical listening acceptance;
- clip-free output at all slider positions. The already documented high Music
  plus SFX limitation and visible warning remain authoritative;
- completion of unified output protection/mastering or final audio
  qualification.

## Remaining gates

1. Bind and pass the final focused browser rerun and locked native check for the
   corrected files.
2. Reuse the pre-fix 600-second/53-transition run only as lifecycle/resource
   evidence: the correction changes envelope automation, so that run is not
   rendered peak, acoustic or no-click evidence.
3. Keep physical phone/iPad/laptop/native listening, two-stream rendered
   sample/true-peak evidence and any mastering/output-stage decision open for
   the existing final-audio qualification gate.

Subject to item 1, I find no remaining source blocker to AUDIO-01A preview
acceptance. Observer parameter/state traces and the convex bound support the
limited no-new-lane-gain-amplification conclusion; they must not be presented as
captured waveform or acoustic evidence.
