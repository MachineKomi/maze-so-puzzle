# AUDIO-01A / v0.22.7 — Sol final native and release review

Date: 2026-09-06  
Reviewer: Sol, independent source/evidence review  
Decision: **accepted for a bounded versioned family preview**

## Exact release binding

I accept runtime source
`9b822281197c9e9e65a8c9467fe5bd578dce1cbd` and the unsigned x64 portable:

- `Maze-so-Puzzle-0.22.7-AUDIO-01A-9b82228-locked-portable.exe`
- 173,470,208 bytes
- SHA-256
  `5CFF755C021134AAA67409751613131C9DD3C809B8B2241B6CCE81809AB39B00`
- file/product version `0.22.7`; Authenticode status `NotSigned`

I independently hashed and inspected the attachment. `portable-stage.json`
(SHA-256 `30BBA7DF95A21A855CC77D2CC1F91899FD1FDB71B456BDFDE7A05652A45F7732`)
binds byte-identical source, stage and attachment executables, the locked native
build command and build log. The log (SHA-256
`714D16B823352BC6B9A44D8DC82910E571FE1DEA39966C1D6BFB1508DB3A3998`)
records the final production web build and a successful 5m08s optimized native
compile. Its provenance binds the runtime commit and dist fingerprint
`8022a4138ff5a56895ea1c560d7e6d162c0f5fa266d77165c51ceb5c4c96ddc1`.

`input-equivalence.json` (SHA-256
`33BA8493D9E8ABF32ED2C2DF64EB5E5D47882910118C29577EEFE865DCE94E4D`)
passes the relevant inherited art, gameplay, save, input, layout and calibration
comparisons against published v0.22.6. The repository currently has a later
documentation-only commit; I found no difference from the runtime freeze under
`src`, `src-tauri`, `package.json` or `package-lock.json`.

The packaged-run identity consistently names the same commit, portable hash,
isolated profile and passive observer. The observer was installed once before
real Play and reports no injected state, input or context-suspension helper.

## Native evidence accepted

Astra performed the controls through actual Windows pointer/keyboard actions.
I independently inspected the resulting passive WebView2 media, graph, DOM,
input and storage records.

- Title/Home begins with the two displayed 75/75 defaults. Stable master values
  are Music `0.10000000149` and SFX `1`, matching the calibrated `.10/1` pair.
- Changing Music to 50 while SFX remains 75 stores raw
  `0.044444444444444446/1`. Those exact raw values and displayed 50/75 controls
  survive ordinary close/reopen in the same isolated profile.
- Mute queues `setValueAtTime(0)` for both real master AudioParams; unmute queues
  the calibrated restore. The muted capture occurs in the same control-thread
  turn, so its SFX `AudioParam.value` still reads the prior `1`; this is command
  and UI-state evidence, not rendered-silence evidence. Test sound subsequently
  creates two SFX oscillators on the SFX master, both of which end and disconnect.
- Across the cumulative native inventories, assigned media leases, connected
  music sources and playing music elements each remain at or below two, with
  zero observer drops. Settled checkpoints retain one connected/playing current
  lane and at most one prepared URL.
- Title prepares Story; Story prepares Maze; Maze prepares one selected Victory.
  In the reopened run, Victory media id3 is created/assigned at about
  150307 ms and reaches `canplay` at 150365 ms while paused. The final movement
  key is observed at 501871.1 ms; the same id3 receives `play()` at 501879.0 ms
  and `playing` at 501916.0 ms. No new media element is created for Victory.
  The outgoing Maze is not paused/released until 502320.4/502320.6 ms, preserving
  the intended approximately 400 ms confirmed-playback handover.
- WebView2 makes a second request for the same Victory URL after playback begins.
  This does not violate current-plus-one ownership or same-selection/element
  reuse, but confirms that `preload="auto"` is a browser hint, not a no-refetch,
  cache-only or transfer-memory guarantee.
- One actual Maze movement is saved as `little-star-trail`, step1, position
  `(1,3)`. After normal close/reopen and Home Continue, the run returns to the
  exact step and position. Five further movement keys produce Victory at step6,
  position `(4,1)`; Stay, Book and Home then remain operable.
- Victory→Stay's provisional reward state is existing documented behavior. This
  run proves active-run and preference persistence, not banked-completion
  persistence, and I make no new reward-semantics acceptance claim.
- Both independently owned processes exit after ordinary Alt+F4 and both bound
  debugging endpoints close. `first-close.json` SHA-256 is
  `60D1C32AD8E6A40F6DCDD3EE1501A1B9D7D3F4354BEF56CCA1901DB33E5ADADB`;
  `second-close.json` SHA-256 is
  `5E773AD73DB8DCE49D153C47A1208F02F8D3838A09278F10586C9911695AE924`.

The retained `reopened-home.json` is correctly treated as a pre-retry Front Door
capture after a click lacked geometry. `reopened-home-ready.json` is the later
successful Home result. The failed action is disclosed, not substituted.

## Combined browser/source decision

The final-source headed browser evidence remains accepted within its written
limits: 20 focused real-UI transitions; delayed and HTTP503 fallback continuity;
rapid retarget; mute/unmute; induced AudioContext suspension and fresh-gesture
recovery; at most two leases, connected sources, playing elements and pending
MP3 requests. All 26 observed 400 ms/20 ms AudioParam pairs share endpoints and
schedule the decreasing lane first. The separate 603-second pre-fix run supports
only unchanged lifecycle/resource bounds.

The reviewed source's nonnegative complementary lane weights preserve the larger
participating single-track sample-amplitude bound. Neither the browser nor
native observer captures rendered waveform amplitude, true peak or acoustics.

## Qualification boundary

This is engineering acceptance for a **preview**, not final audio qualification.
It does not establish:

- physical iPad/Safari, phone, laptop-speaker or native listening quality;
- acoustic onset, leading silence, click-free fades or event-to-sound latency;
- actual production hidden-tab behavior; the real tab-switch attempt left
  `document.hidden === false`, and native hidden-page behavior was not tested;
- waveform, LUFS or inter-sample true-peak safety, or clip-free output across all
  slider combinations. The existing high Music/SFX warning and mastering gate
  remain authoritative;
- offline/clean-machine operation, clean-host sustained heap/performance,
  installer behavior, code signing or public-download verification.

No new media, dependency, PCM/whole-song decode, service worker, library,
limiter, compressor, gameplay/save rule, art, layout or transport-history scope
is inferred.

## Final decision

I find no remaining source, headed-browser, packaged-native, persistence,
resource-bound or release-linkage blocker for the v0.22.7 bounded family preview.
Publication may proceed only with the exact portable and runtime above, the
existing caveats visible in its acceptance/playtest material, and a final
manifest/download receipt. Published v0.22.6 remains the immediate rollback.
