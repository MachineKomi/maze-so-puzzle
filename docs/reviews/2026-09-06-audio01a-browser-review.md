# AUDIO-01A r2 — final-source focused browser check

The focused browser checks passed on clean frozen/pushed
`9b822281197c9e9e65a8c9467fe5bd578dce1cbd`, v0.22.7. Production JS is
`index-BgA0MklY.js` (574673bytes). Exact before/after identities are byte-identical,
including source/dist provenance, served HTML/JS/CSS and both unchanged helper
hashes. This used the same checker/observer as r1, explicitly `--headed
--focused-only`, installed Edge152.0.4191.62,1194x834, native48kHz graph and an
isolated disposable profile. No repository or Human-profile changes.

**Final run:19972ms and20 real UI context/transport transitions. This is five
short of25 on final source, and no final-source ten-minute rerun was performed.**
The earlier r1 resource cohort remains separate: clean pre-fix `16deeb2...`,
600505ms at its lifetime gate,53 total transitions including33 lifecycle context
changes. Per root's communicated Sol decision, that lifecycle/resource evidence
is inherited across the reviewed envelope-only correction. It is not relabelled
as a final-source25-transition/ten-minute run or as pre-fix amplitude acceptance.

The actual authored Little Star Trail route used real UI buttons and held keys,
with no synthetic save/maze: Title/Home -> Story -> Maze -> held-repeat Victory
-> Stay here/Maze -> Book -> Home. Prepared Victory media id3 was assigned its
URL at2949.3ms, reached canplay2977.7ms, and was reused at play4787.8ms/native
playing4791.4ms. Victory DOM was observed4811.1ms. The track was therefore ready
1810.1ms before its play call; native playing precedes the DOM observation19.7ms.
These are media/DOM timestamps, not acoustic onset, display paint or a latency
distribution. The ArrowRight keydown-to-play delay was439.8ms, confirming a held
repeat timer; transient activation remained true, so inactive-autoplay behavior
is not established.

| Handoff | Incoming playing ms | Outgoing paused ms | Retained after playing ms |
| --- | ---: | ---: | ---: |
| Prepared Title -> Story |1805.6 |2215.0 |409.4 |
| Prepared Story -> Maze |2543.4 |2947.7 |404.3 |
| Prepared Maze -> Victory |4791.4 |5203.0 |411.6 |
| Next with1800ms MP3 request delay |10595.0 |11007.1 |412.1 |
| Next with HTTP503 and one alternate |12050.7 |12457.5 |406.8 |

The delayed request retained an advancing old media stream at envelope1. The
HTTP503 case retained the outgoing stream through one alternate's confirmed
playback. Ten rapid Next/Shuffle clicks stayed bounded and settled one current
song. Mute during handoff applied immediate zero Music/SFX bus automation,
muted the remaining media and left no live connected SFX voices. Deliberately
calling the native AudioContext.suspend method caused the actual suspended
state and media pause; a trusted Shift input recovered the same element.
Peak assigned media resources, connected sources, playing media and pending
MP3 HTTP requests were all2. No page exception or observer overflow occurred.

The real second-tab bringToFront attempt still left document.hidden false,
despite headed mode. **Actual hidden/visible behavior remains NOT-QUALIFIED.**
No visibility property/event was fabricated; root requested no further attempt.
The native-suspend diagnostic is not an OS/device-interruption claim, and HTTP503
is not a browser NotAllowedError/autoplay-denial test.

Offline inspection of the recorded native AudioParam calls found26 paired lane
ramps:18 normal400ms pairs and8 rapid-retarget20ms pairs. Every pair records the
decreasing lane first, followed by the increasing lane, with exactly equal start
anchors and end timestamps. There were no pairing/order/timeline violations or
unpaired restore increases. Example retarget: sequences1330/1332, envelopes95/93,
shared start12.221333333333334 and end12.241333333333333. These26 internal ramp
pairs are not26 UI transitions and do not close the25-transition shortfall.

`gain-call-order.json` is derived from the immutable `events.json` by external
`../../analyze-gain-call-order.mjs`. It verifies API call ordering/timing only,
not rendered amplitude, the gain sum within an audio quantum, waveform peaks,
true peaks or speaker output. The HTTP503-before-confirmation case does not
exercise an incoming waiting/error event during a running crossfade; no such
recovery-order observation is claimed from this run.

The final Victory and muted-handoff screenshots were visually inspected and
match the tested state, including disabled Test sound, retained75/75 controls
and visible high-combination warning. This is not a broader UI, mixing or
physical-listening qualification. Source-leading silence, acoustic onset,
Safari/iPad/PWA/native, true-peak/headroom and physical interruption remain open.

Raw evidence: `summary.json`, `events.json`, `network.json`, `checkpoints.json`,
`identity-before.json`, `identity-after.json`, `gain-call-order.json` and PNGs.
No r1/r2 raw evidence or browser helper was rewritten. The owned browser closed
in finally; preview4219 was stopped; targeted process check was clear. Browser
slot returned to root before its native build.

| Evidence | SHA-256 |
| --- | --- |
| summary.json |7801fe8c965effe922a65fa26377d016ca30bad45bac904320465d0a3314d5ac |
| events.json |21f822abe82468276976b0ad7e743fd3b84849d52563bfd987f3e5665871da31 |
| identity-before.json and identity-after.json |6015437f725ee960a0302222cb7f0882a730ae6e4f7da6aff20c2b229f8ecc25 |
| gain-call-order.json |be8b5e7ccb413b0aef8d71be80c9f8d3586a88b4f34c9b26709510f9f63c015b |
| held-victory.png |97c818b5bab370f1b21065e119e7455263b7687e1a527dc16581b1d8763488a9 |
| mute-during-handoff.png |bbb243a05678e367e94431cd610236a2d60d2fc838d1fab49eafb2d2b9e4acd5 |

Final served JS SHA-256:
`723bd6134e8eb8cd62847b04def636c751d95e2284c5b42cc9d71880fa42e612`.
Full final runtime input fingerprint:
`a7f4fad8f8ca0aa88e56948c3c6717de56876a3d870d011839e2db635ebc9c9c`.
