# iPad sound balance and independent volume controls

Human follow-up, 2026-09-06, during v0.22.2 playtesting. Paraphrased intake;
not a measured loudness comparison or an independently confirmed hardware fault.

- On the eighth-generation iPad, SFX are very quiet relative to BGM and can be
  inaudible at low device volume.
- Laptop web, phone web and Windows app are broadly balanced, although the
  Human would welcome slightly more prominent effects there too.
- The Human explicitly requests separate **Music** and **Sound effects** sliders
  inside the existing settings menu, with a balance chosen for each device.
  Do not globally over-amplify effects to compensate for one device.

## Source inspection and working hypothesis

At main `87aed87`, `src/music.ts` sets an HTMLAudioElement's volume to `0.22`.
`src/sound.ts` schedules quiet per-note Web Audio gains directly to the
AudioContext destination. There is no user-controlled SFX master gain, and
`SoundDialog` exposes shared mute/transport but no independent levels.

These are different gain paths; neither the observation nor source inspection
proves that the device is too old. Apple's **archived** Safari guide documents
iOS restrictions on setting media-element volume in JavaScript. That is a
specific compatibility hypothesis to verify on the affected iPadOS, not proof
of current behavior. A volume property assignment/readback alone is insufficient
listening evidence. A reusable media-source-to-GainNode path is a candidate for
actual independent control; test activation, suspension and native playback.

References checked 2026-09-06:

- [Apple archived iOS media considerations](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html)
- [MDN media element source and gain example](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource)

## Routing

PT20/PT23 and [AUDIO-01V](../plans/AUDIO-01-readiness-and-sound-design.md)
own a bounded, early per-device mixing/settings checkpoint after accepted PLAY-A,
separate from the camera experiment and before the larger audio-readiness pass.
Astra implements; Sol reviews. One runtime writer; no change is made to Sol's
in-flight pace assignment. Plan 02/07B retain creative sound/mastering and final
platform listening. No new soundtrack, SFX pack, dependency, hardware purchase
or device-age cutoff is required by this request.
