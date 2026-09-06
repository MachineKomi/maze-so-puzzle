# AUDIO-01A — actual Sol independent source review

Reviewer: actual Sol, independent of root Astra's implementation  
Date: 2026-09-06  
Reviewed base: `fddbf462752bad341ca2d6b97a121c24ba27d314`  
Candidate version: `0.22.7`  
Decision: **conditional source acceptance** for root's browser/native candidate freeze. This is not release, acoustic, physical-device, mastering or all-range headroom acceptance.

## Outcome

The bounded readiness seam is appropriate for AUDIO-01A. It replaces the old
dispose-before-load transition with two streamed lanes at most: the audible lane
and one selected/prepared standby. Each connected lane feeds a private envelope
into the existing calibrated Music master, so stored Music/SFX levels, shared
mute and the established SFX output remain authoritative. It does not decode
whole songs, warm a playlist, add a service worker/library, or change the OST.

The handover waits for media `play()` fulfillment and a running shared
`AudioContext`. A 400 ms complementary linear envelope keeps the two lane
weights summing to one. This is a conservative headroom choice, not a claim of
equal perceived loudness, click-free speaker output or final mastering. In the
no-Web-Audio fallback, the implementation retains the old stream until the new
stream has started, then performs an honest hard cut; it does not claim an
effective crossfade on platforms where element-volume control is unavailable.

Selection and transport scope remain bounded. The shipped non-Maze selection,
Maze shuffle/history behavior, Previous/Next/Shuffle and loop-unavailable policy
are preserved. Preparation peeks without consuming the next Maze draw, and the
current transport tests the actual Title → Story → Maze → Victory reservation
and reuse chain. Full audible-history semantics and natural-song succession are
still Plan 07B work; active songs continue to use `loop=true` in AUDIO-01A.

## Independent challenges and resolutions

The initial implementation needed the following corrections before this review
could be conditionally accepted:

1. Rapid A → B → C originally allowed B's full fade to finish. The final source
   invalidates B immediately, reverses it over 20 ms to the safe outgoing lane,
   releases B, and only then uses the freed standby slot for C. Late B callbacks
   are generation/lane guarded and cannot win.
2. A hidden-page retarget could clear visibility recovery and leave the newest
   requested context in an unreachable idle state. Hidden start intent is now
   retained; return attempts only the latest requested destination, with a later
   trusted interaction available after activation rejection.
3. A media element diverted into a source node before a downstream connection
   failure could be retried as a false direct fallback and report success while
   inaudible. The failed diverted element is now destroyed; retry creates a fresh
   element. The existing diversion regression was retained.
4. Failure during the 400 ms fade originally happened after `start()` had
   returned success, so the transport's bounded alternate never ran. Fade
   settlement is now part of the operation result. `waiting`/`error` restores
   the outgoing lane and permits exactly one alternate; autoplay rejection stays
   blocked for a later permitted interaction and does not start a retry loop.
5. Reapplying an already-true mute could repeatedly invalidate work. Mute is now
   idempotent, preserves the active track position and calibrated preferences,
   and cancels/settles pending handover without seeking or unmuting itself.
6. Shared-context suspension and unexpected current-media pause had no music
   recovery signal. The controller now removes its lifecycle listeners on lane
   release, pauses deterministically on interruption, and recovers only the
   authoritative lane/target on a later permitted interaction. Hidden, stop and
   disposal remain distinct and cannot revive audio.
7. A proposed new random picker for every non-Maze pool exceeded this checkpoint
   and contradicted the stated selection-preservation boundary. It was removed.
   AUDIO-01A prepares the already-selected first contextual target; broader pool
   policy remains 07B.
8. An eager playback subscription on the unused exported singleton would have
   left a permanent listener. Live phase subscription was unnecessary for the
   final selected-only UI wording and was removed.

I find no remaining source-level blocker in the reviewed bounded controller,
gain wiring, transport preparation or focused fake lifecycle coverage.

## Evidence reviewed

- I read the AUDIO-01 plan, current MUSIC contract, current execution handoff,
  PT20/PT23 direction, Plan 07 audio phases, and the current music, transport,
  mix, SFX, App lifecycle and test sources.
- Static inventory independently confirms 42 MP3 files / 99,151,313 encoded
  bytes. The largest file is 4,083,290 bytes, so the conservative largest-file
  current-plus-one encoded bound is 8,166,580 bytes. This is not a transfer,
  decoded-memory or browser-buffer guarantee; `preload="auto"` remains a hint.
- Root reports 64/64 focused music/transport/mix tests after the review fixes and
  576/576 tests across 53 files in the full check. Root also reports a final
  versioned build of 157,209 JS gzip9 bytes versus 155,702 for v0.22.6
  (+1,507), 23,980 CSS gzip9 bytes, and 165,031,011 public bytes, with no new
  media or dependency. These executions used root's sole runtime/heavy slot; I
  reviewed their source coverage and did not duplicate those suites.
- My read-only diff hygiene check returned no whitespace error. Line-ending
  conversion warnings remain ordinary working-copy warnings, not diff defects.
- The separate baseline owner reported that the old implementation produced a
  1,872.7 ms application-created graph gap with an injected 1,800 ms Victory
  route delay. Root must retain the exact baseline/candidate artifact before
  using that number in acceptance or release notes.

## Required remaining gates

1. Root-owned headed production-browser evidence must demonstrate cold and warm
   Title/Home, Story, Maze, Victory and Adventure Book transitions; a delayed,
   failed and activation-blocked target; rapid A → B → C; mute; hide/show; and
   interruption. Inspect both Media/graph state and network requests. At no point
   may more than current plus one long-form resource retain a URL or connection.
2. The delayed-target candidate must show the old graph output is retained until
   confirmed handover. A framework timestamp or `play()` result does not close
   the ≤100 ms acoustic-onset target, audibility, leading-silence or click test.
3. Complete the root-owned packaged Windows/Tauri build, offline playback and
   save/reopen smoke from the exact frozen candidate. Do not infer Steam Deck,
   iPad Safari/PWA or television behavior from WebView2.
4. Physical iPad, phone, laptop web and Windows speaker/headphone listening stays
   open, including low system volume. The 400 ms fade remains provisional until
   heard on real output paths.
5. Preserve the visible high Music/SFX warning. Maximum Music plus dense SFX,
   now including two-stream overlap, is still not all-range clip-free. No limiter,
   compressor or mastering claim is accepted here.
6. Keep full per-pool audible history, natural end/succession, exhaustive pool
   fallback, final loudness/true-peak mastering, ten-minute media soak and broad
   platform qualification explicitly assigned to Plan 07B. Missing physical
   evidence must remain pending rather than being inferred from automation.
7. Before any release, freeze the exact reviewed commit, rerun the required clean
   source/CI/build checks, attach browser/native evidence, and verify any public
   artifacts/downloads from that exact source. This review does not authorize a
   documentation-only or dirty-tree publication.

Rollback remains the complete readiness seam to published v0.22.6
`e628898bb4e501034f184a7a92c9e5e6d2b7a4aa`; do not partially retain the lane
envelopes without their controller/cancellation owner. Saves, calibrated
preferences, gameplay, art, cues and all 42 OST files are unchanged by rollback.
