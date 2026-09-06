# AUDIO-01A — bounded music readiness candidate

Owner: root Astra, independent actual Sol review. Base `fddbf462752bad341ca2d6b97a121c24ba27d314`, following published v0.22.6. Status: implementation; not released or accepted.

## Player outcome and boundary

Keep the old song audible until a new screen's selected song actually starts.
Prepare one likely next song (especially Victory while in a maze); never preload
the library. Preserve calibrated gain preferences, all songs, cues, saves,
movement and UI layout. No claim that this fixes physical iPad camera stutter.

Source confirms the old `configureMusic` disposes the current element immediately
and its successor uses `preload=none`. An external frozen production baseline is
being observed before implementation. SFX already use trusted capture activation,
the running shared graph, epoch cancellation and a 24-voice cap; do not duplicate
those owners or replay delayed cues.

Two streamed lanes maximum, with one per-lane envelope before the existing Music
gain. Handover waits for media play fulfillment and running graph, with a
constant-sum linear fade. During a fade, a new destination reverses the obsolete
incoming lane over20ms back to the safe outgoing lane, frees the slot and starts
only the latest target; no third lane. Failed or stalled preparation leaves
the valid old stream alive. Mute/hidden/stop/dispose invalidate pending work;
autoplay refusal retries on a later permitted interaction, not a polling loop.
Raw media readiness is not acoustic onset or proof that an iPad honors preload.

Full audible per-pool history, natural-song succession, final mastering and
physical/acoustic qualification remain Plan07B. Existing selection transport is
retained, with selected-versus-playing status made truthful for this seam.

## Budget, verification and rollback

Root authorizes a prototype ceiling of +6400 gzip9 JS bytes, zero CSS/media or
dependency growth, versus v0.22.6's155702 JSgzip9. Book only reviewed measured
growth after implementation. At most two attached long-form resources, no full
track `decodeAudioData`, no whole-OST fetch, bounded retries and released stale
elements/listeners/timers. Browser buffering is measured, not a controllable heap
promise. Crossfade weights sum to1, avoiding a new two-song gain doubling; the
existing high Music/SFX combination warning and final mastering gate remain.

Tests: delayed/rejected/stalled play, rapid A→B→C, mute/hide/stop/dispose races,
same-track/no-restart, known preparation reuse, gain complement, one-track and
fallback pool, sustained resource count, real cold/warm UI transitions and native
smoke. Test every changed contract; never weaken a failed assertion to hide a bug.
Exact frozen source/build and public downloads must be verified before release.

Rollback: complete runtime seam to v0.22.6 `e628898bb4e501034f184a7a92c9e5e6d2b7a4aa`, preserving all saves/levels/art and calibration. Do not partially revert the lane gain and controller separately.

## Primary implementation references

- [MDN play promise](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play): playback may reject or be delayed; selection is not playback.
- [MDN preload](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/preload): a browser hint, not a guaranteed memory/download limit.
- [WebKit autoplay policy](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/): handle rejection and per-element restrictions; historical policy is not current iPad qualification.

These references were checked2026-09-06. Measurements and independent review follow below; no Human listening acceptance is inferred.

## Implemented candidate / source review

- v0.22.7 candidate: new576/576 tests across53files, TypeScript/Vite build,
  locked Cargo check,11scenario contracts,3evidence validators and budgets pass.
- JSgzip9:157209 versus155702 (+1507), within new1600-byte allocation;
  CSS23980 and public165031011 unchanged. Seven app version fields updated;
  dependency versions, media, SFX scheduler, game rules and saves unchanged.
-24 new playback tests cover actual prediction chain,25 fake-clock transitions,
  two-resource ceiling, delayed play, timeout/late promise, mid-fade failure,
  exactly one fallback, autoplay refusal, rapid retarget, context/element
  interruption, hidden destination, stop/disposal and preserved muted position.
  Existing tests now assert source→lane envelope→Music master, not old direct
  source→master or disposal-before-readiness. One-track picker and same-track
  looping behavior are retained; no new natural-succession policy is claimed.
- Sol identified and root corrected obsolete fade promotion, disconnected-media
  retries, hidden retarget recovery, duplicate starts, failure propagation and
  an unused global transport subscription. Independent review remains separate
  from root's test results; browser/native/physical gates are not closed here.
- Minimal SFX readiness/epoch cancellation already shipped. No new cue handle
  or choreography is needed in this music checkpoint; Plan02 extends that seam.

## Frozen baseline observation

External `C:/GameDev/maze-game-qa/audio01a/baseline-final.json`, SHA256
`29006ac079585a6fbb34881344c07b136f5f48ae4bfa9d29366b54c5e3ed9b07`,
uses cleanfddbf46 runtime-equivalent to v0.22.6. Actual authored Maze1 UI, no
fixture: Title→Story112.3ms, Story→Maze38.9ms, Maze→Victory48.3ms from outgoing
source disconnect to incoming `playing`. Delaying the Victory request1800ms
produced1872.7ms disconnect→playing, with Victory DOM1859.5ms earlier. No Victory
resource existed before the winning move. A failed first delay-helper attempt
is retained/excluded. Revisit is not a proven cache hit; held-repeat wins still
had transient Chromium activation. These are framework/media timing observations,
not acoustic onset, a timing distribution or physical Safari evidence.

## Pre-publication envelope correction

The first frozen candidate `16deeb2` completed a603-second real-browser run:
53 actual UI transitions, with at most2 assigned media URLs, connected sources,
playing elements and pending MP3 requests. The600505ms lifecycle portion alone
made33 context changes. Prepared Victory reused its existing element; delayed
and HTTP503 incoming requests retained the old stream. This is explicitly
pre-fix evidence, not final-source or acoustic/headroom acceptance. Its summary
SHA256 is `058bee03f0489cd0d080a31bd298bca8617c57783c24cd2268b095b330ebf2d6`.

Sol's follow-up review found that reversed fade command order and immediate
failure restoration could briefly exceed unity combined lane weight for a
render quantum. Root corrected this before publication: paired envelopes share
one sampled audio time and decrease the obsolete lane first; failed standby
disconnection precedes a20ms survivor restore, with no immediate unity step.
Two regression tests check the ordering under an advancing context clock.

The corrected candidate passes578/578 full tests and68/68 focused audio tests,
TypeScript/build, performance contracts and production audit (zero findings).
Final JSgzip9 is157262 (+1560 versus v0.22.6), within1600 allocation; CSS/media
unchanged. A final-source focused browser rerun and actual packaged Windows
qualification remain required. The ten-minute resource observations may be
inherited only with explicit review of this envelope-only source difference.
