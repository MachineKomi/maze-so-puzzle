# AUDIO-01V — independent device mix candidate

Owner: Astra implementation; actual GPT-5.6 Sol independent read-only review.
Base: integration merge `9114bd979c817409ae3fb0e32b803eb8dc5a915a`, including accepted
Tessera field repair and PLAY-A. Status: engineering accepted for versioned preview
qualification, not yet a published release or physical listening pass.

## Delivered boundary

Sound & comfort has Music and Sound effects ranges (0–100%, named DOM/focus IDs),
percentages and an explicitly triggered Test sound. Defaults remain Music22/SFX100.
The existing device presentation key stores additive finite/clamped values;
legacy preferences default safely. Reset Progress does not clear that key.
Storage denial leaves settings usable in memory with the existing warning.

One lazy AudioContext owns two channel gains. Music remains an HTML stream at
unity media volume through its selected gain; no whole-song decode or prefetch.
Changing levels never seeks, restarts, changes selection/history or reconnects.
One source per element, track disposal releases only its source; App disposal
disconnects/closes the graph. Source-creation failure before diversion permits
best-effort direct media volume; failure after diversion discards the element.
That fallback is not claimed effective on every iPad.

Mute/hidden/zero gates cancel scheduled SFX nodes, including future melody notes;
general cues on suspended contexts expire rather than queue. Authored envelopes
and the24-voice cap remain. A Test request may await activation but newer tests,
dialog closure, mute/hide or zero cancel it. Previously playing interrupted music
retains exact player/generation recovery; a trusted gesture can retry after a
denied automatic foreground resume. Stopped/disposed/replaced tracks cannot revive.

## Independent review and corrections

Sol found four issues in the first candidate: no pre-diversion fallback, lost
foreground-recovery identity, an arbitrary200ms preview deadline, and missing
DOM IDs. All were corrected and independently re-reviewed. Final verdict:
engineering-approved for candidate QA; no source blocker. Sol did not write code
or run checks. One listening edge remains: first post-interruption gesture being
Quick Mute/Next may briefly initiate old media before click gating; test physically.

## Evidence so far

- Full serial unit suite519/519 across50 files before final AbortSignal refinement.
- Final focused46/46 (mix, music, sound, preferences), TypeScript and build passed.
- Real Edge production probe measured music output/input RMS ratios1,0.100000002,
  0,0.219999998 at100/10/0/22%; same element/time progression, one graph/source.
  Next track kept one graph and created only its replacement source. Mute controls,
  restored8/91 mix, actual Test cue and reload preference persistence passed.
- Browser controls inspected at1194×834 and568×320. Compact dialog body scrolls;
  sliders remain36px tall,191px wide at568 with no document horizontal overflow.
- [Compact browser data](2026-09-06-audio01v-browser-probe.json).
  Reproduction/proofs: `C:/GameDev/maze-game-qa/output/playwright/audio01v`.
- Rejected probe attempts are not passes: initial CLI syntax/stale ref; inactive
  SFX AudioParam.value retained its last rendered value; an80ms analyser window
  still overlapped gain transition. Final350ms settled RMS measures attenuation,
  not latency. Immediate analyser history is not proof of an audible mute leak.

WebAudio routing matches the [documented source→gain pattern](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource).
[WebKit interruption reports](https://bugs.webkit.org/show_bug.cgi?id=273511)
justify explicit recovery testing, not a diagnosis of this family's device.

## Allocation and rollback

Pace baseline: JSgzip9 153514,CSS23510,public165031011. Audio candidate:
154875/23563/165031011; exact+1361JS,+53CSS,zero media/dependency growth.
Astra approves that bounded allocation; inherited23-byte JS margin remains.
Two permanent gain nodes replace the old SFX context with one shared context;
at most24 SFX oscillator/envelope pairs. External analyser instrumentation is
not delivered. No camera, FOV, engine/content, save-schema or art changes here.

Rollback the complete audio commit to this record's base, retaining accepted
pace/Tessera work and additive preference fields (older readers ignore them).
Do not independently revert only half of music routing and shared SFX ownership.

Physical iPad/phone/laptop/Windows listening, low-volume audibility and interruption
comfort remain open. AUDIO-01A readiness/crossfades and Plan02 creative sound remain
separate; no current iPad camera fix, stationary rescue or phone-UI correction claimed.
