# AUDIO-01 — timely music, satisfying sound and listening qualification

Status: manager-scoped future work, 2026-09-05; no runtime implementation yet.
Source: [Human audio/hole follow-up](../user-playtests/2026-09-05-audio-readiness-and-hole-crossings.md).
Backlog owner: PT-20260903-20, with PT23 transport and existing CR-AUDIO decisions.

Latest queue authorization: the Human deferred playtesting and explicitly asked
safe development to continue. References below to the device/performance gate
mean preserve and evaluate its evidence when available; missing feedback alone
does not stop implementation after accepted engineering predecessors.

## Outcome and ownership

Victory should sound celebratory as it appears; doors, pickups and rescues should
sound at their visual contact. Ordinary context changes should not create silent
gaps while an otherwise enabled game fetches the next song.

**AUDIO-01A, root/Astra implementation with Sol review:** advance the bounded
readiness/continuity portion of Plan 07B to after the v0.22.1 device/performance
gate and already queued Tessera, pace/rescue and V22-UI corrections, before Plan
04. This is its own reviewed checkpoint. Keep the canonical `MusicTransportPort`
and its existing UI/controller consumers. Add the accepted controller behavior
behind that boundary. Root may pair its verified build with the next meaningful
family preview; do not emit a release for documentation or an unreviewed experiment.

**Plan 02:** creative SFX palette, variation, contact timing and mixing. Consume
the readiness controller and its cancellation/gain seam, not a second player.
**Plan 07B:** finish remaining contextual-history/fallback details, mastering,
delivery and final device/sustained audio qualification; requalify early work
against final effects, controllers and animation rather than rebuilding it.
**Plan 10:** activate Garden context using the same controller.

Read MUSIC, PT20/23, the Plan-07 manager addendum and audio phases, Plan 02,
current music/transport/sound code, presentation cancellation and performance
budgets before implementation. The older statement that all audio waits for 07B
is superseded only for AUDIO-01A's explicitly bounded scope below.

## A. Characterize readiness, then correct it

1. Reproduce first-play and warm/revisited Title/Home, Story, Maze, Victory and
   Book transitions. Distinguish a fresh page, fresh track, cached track and
   suspended/resumed session; record actual version and browser/PWA/native mode.
   The phone's v0.22.0 success does not establish a cache or installation fix.
2. Trace context request, selected track, media request, ready/playing state,
   playback rejection, AudioContext state and presentation contact, including
   victories entered by a held-repeat timer rather than a fresh activation.
   A method named `startFromUserGesture` does not prove activation exists. Correlate
   these with short listening recordings when available: a resolved `play()` or
   `canplay` event alone does not prove audible onset. Check source-track leading
   silence separately from network/decode/scheduling delay before editing music.
3. Keep the current track available while preparing **at most one selected next
   track** for the likely transition. Prioritize a selected victory track while
   in a maze when the preparation budget permits; select it once, not anew each
   render or again at the exit. Reuse it at victory. Choose the imminent context
   when a pending story/Book transition is known; evict obsolete speculation.
4. Begin the new prepared track at its semantic screen transition, then smoothly
   crossfade using confirmed playback and one cancellation owner. Never dispose
   the outgoing audible track first and leave a network-sized gap. On a stalled
   or failed incoming track, retain/restore the current audible stream while
   choosing another valid target-pool candidate within the same bound. Do not
   delay or block the victory screen, movement or navigation for music.
5. Prepare/unlock the existing synthesized SFX context through a permitted user
   gesture and reuse bounded graph resources. Schedule cues from the accepted
   presentation markers. If ready SFX can punctuate victory while its song starts,
   avoid a duplicate/louder fanfare. Delayed, cancelled or hidden cues must not
   burst out later. Deliver minimal cancellable sequence handles and shared gain
   ownership for readiness/mute/teardown; Plan 02 extends the cue choreography
   and mix behind those interfaces. No sample-pack generation is needed here.
6. Respect quick mute, user levels, page suspension and autoplay failure. A
   rejected start is safely recoverable on the next permitted interaction;
   backgrounding never implies permission to keep playing or to preload all music.
   Browser/iPad volume/crossfade capability must be tested, not assumed from a
   desktop HTMLAudioElement. Use the least complex platform-compatible gain path.
7. Bound simultaneous streams, prepared bytes, decode/graph resources and retries;
   budget their peak overlap. No full-OST or full-playlist download/decode, new
   service worker, third-party service, audio library or UI redesign in this seam.
   Keep all 42 songs/context pools and current transport behavior compatible.

## B. Creative sound design under Plan 02

The joint ledger already agreed to the following treatment of Claude's ideas:

| Proposal | Delivery / decision |
| --- | --- |
| CR-AUDIO-01 mix/headroom | Measure and listen to dense cues over BGM. Add dynamics processing only if it fixes a demonstrated problem; a compressor is not automatically a limiter. |
| CR-AUDIO-02 timbre palette | Compare a small coherent set of warm magical/material sounds against current cues; adopt by clear identity, comfort and musical fit. No prescribed oscillator/reverb settings. |
| CR-AUDIO-03/03a footsteps/variation | Trial quiet material-sensitive footsteps and bounded cosmetic variants. Preserve recognizable semantic cues and gameplay RNG; reject fatiguing decoration. |
| CR-AUDIO-04 pickup chains | Trial a short musical rise with pitch/voice ceiling and reset window; coalesce dense showers. No endless pitch climb or one loud cue per particle. |
| CR-AUDIO-05 ducking | Trial subtle cue-led BGM ducking with smooth restore after overlap/cancellation; respect mute/levels and avoid silence or pumping. |
| CR-AUDIO-06 sound-design ownership | Plan 02 records the chosen cue/mix table and comparisons; 07B qualifies it with actual playback/delivery costs and listening. |

Include doors, battles, ordinary/Science pickups, rescue, jump/portal, menu and
victory. Compare the busiest repeated reward sequence as well as isolated cues.
Use short family listening feedback for taste/comfort; no need to spend Claude
credits to repeat an already reconciled review.

## Acceptance and handoff

- On an enabled foreground session after permitted activation, a prepared song
  enters at its screen transition with a smooth audible handover. Initial
  engineering target: event-to-audible-onset within 100 ms for prepared BGM on
  reference hardware. Record actual acoustic/loopback method and variance;
  framework timestamps alone cannot close this target. Retain Plan 02's existing
  ≤25 ms visual/audio **dispatch** skew gate; separately record audible contact
  timing rather than treating that dispatch number as speaker-output evidence.
- A cold/failed target does not cause application-created dead air while a valid
  current stream exists. External suspension, mute, blocked activation and total
  media failure have explicit outcomes. Never promise instant uncached music on
  arbitrary networks or mask failures by waiting on a loading screen.
- Verify rapid contexts, Next/Previous/Shuffle, consecutive wins, duplicate cue
  suppression, mute mid-fade, foreground/background, interrupted playback,
  failed/slow URL, single-track pool and stop/dispose without stale audio.
- Run relevant music/transport/sound and presentation regression tests, build/
  static budgets and focused production browser/native journeys. Measure a
  multi-maze session for retained streams/voices/bytes and movement interference.
  Test iPad Safari/PWA, laptop web and Tauri; absent physical/listening rows stay
  open. Broad hardware qualification remains 07B.
- Update MUSIC with actual shipped behavior and the chosen cue/mix table, audio
  preparation limits, cancellation semantics, measured allocation and rollback.
  Freeze exact source/evidence, independent review, commit/push and use the
  established clean-source publication workflow for a playable checkpoint.
