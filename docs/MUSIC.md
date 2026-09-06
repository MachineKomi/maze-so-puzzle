# Music

## Readiness checkpoint — AUDIO-01A / v0.22.7, published and verified

Frozen source `9b822281197c9e9e65a8c9467fe5bd578dce1cbd` implements bounded
current-plus-one preparation, at most two media lanes, and a confirmed-playback
400 ms handover. Keep the outgoing song through a slow/failed incoming request;
rapid retarget/failure cancellation shares the same lane and gain owners. The
42-track catalogue, calibrated saved gains, shared mute and existing SFX remain.
Root Astra and actual Sol accepted engineering/native qualification; **web and
Windows are published, with all four independent public downloads verified**.
The [publication receipt](../release/AUDIO-01A-v0.22.7-release-verification.json)
binds exact source, CI/Production and download bytes; [Sol's final native review](reviews/2026-09-06-audio01a-sol-native-final-review.md)
owns its qualification limits. v0.22.6 below remains the immediate rollback.

Final source passes 578 project tests; JS gzip grows 1,560 bytes, with CSS/public
bytes unchanged. The [final browser review](reviews/2026-09-06-audio01a-browser-review.md)
records 20 focused transitions. The pre-envelope cohort's 53 transitions/about
603 seconds overall (600.505 seconds at its lifetime gate) are inherited only
for lifecycle/resources, not relabelled as a final-source endurance or peak run.
[Sol's envelope review](reviews/2026-09-06-audio01a-sol-envelope-review.md) accepts
the paired decrease-first/common-timeline approach for this bounded preview;
final integration is accepted above, not a captured output-waveform test.

Physical listening, actual hidden-tab behavior, inactive-autoplay/device
interruption, acoustic onset/leading silence, rendered two-stream whole-mix
sample/true peaks and max-slider/mastering qualification remain open. Retain
the high-combination warning; no limiter/compressor or clip-free promise was
added. Plan 02 owns creative cues/mix; 07B owns final qualification; Plan 10
activates Garden through this same transport. Next implementation is V22-HOLE-01,
atomic rules/content first and then reviewed connected-ditch art, not a repeat
of AUDIO-01A. Root Astra implements and actual Sol independently reviews; no
blocking Human decision is open for that first slice. P11 is ready for this
release; P5–P10 remain cumulative in the physical playtest checklist.

## Calibrated balance — AUDIO-01V2 / v0.22.6, published 2026-09-06

Frozen runtime `e628898bb4e501034f184a7a92c9e5e6d2b7a4aa` is engineering/native
accepted and published on web/Windows; all four public downloads are verified.
[Acceptance](reviews/2026-09-06-v0226-engineering-acceptance.md),
[manifest](../release/AUDIO-01V2-v0.22.6-manifest.json),
[playtest](../release/AUDIO-01V2-v0.22.6-PLAYTEST.md) and
[receipt](../release/AUDIO-01V2-v0.22.6-release-verification.json) own exact evidence.
Physical P10/P8 listening remains open. The subsequent AUDIO-01A checkpoint is
recorded above; this paragraph preserves V2's publication evidence.

New preferences use Music gain.10 and SFX gain1, both displayed75%. Music uses
the reviewed piecewise curve; SFX reaches4/3 at100%. Existing raw gain choices
remain exact, including through unrelated comfort edits. Opening settings never
rewrites them. A version2 marker permits boosted SFX; an unfamiliar explicit
version is never overwritten. Campaign Reset still preserves comfort settings.

[Joint decision](reviews/2026-09-06-audio01v2-joint-decision.md) and
[Sol's measurement review](reviews/2026-09-06-audio01v2-sol-final-review.md)
accept this bounded preview with completed integration checks. Default Music plus
boosted SFX retained sample margin at48/44.1kHz. Max Music plus SFX can overshoot
full scale even at the old SFX maximum; visible guidance advises lowering either
if distortion is heard. This is not all-range clip-free or physical listening
acceptance. AUDIO-01A/07B must resolve output headroom/mastering before final audio
qualification and include the new two-stream crossfade case. No limiter,
compressor, whole-OST decode, new cues or readiness controller is added here.
Joint state owns actual publication; the following v0.22.3 section is historical.

## Independent balance follow-up — 2026-09-06 (v0.22.3)

Delivered in V22-COMFORT1, frozen runtime `b834a8e`. Final519 tests, canonical
browser journeys and native save/reopen passed. [Engineering acceptance](reviews/2026-09-06-v0223-engineering-acceptance.md).
Physical listening is P8 in the cumulative checklist; readiness/crossfades below
remain planned and are not implied by the new sliders.

The Human reports very quiet SFX relative to BGM on iPad, while phone, laptop web
and Windows are broadly balanced. [Source and compatibility hypothesis](user-playtests/2026-09-06-ipad-audio-balance.md).
[AUDIO-01V](plans/AUDIO-01-readiness-and-sound-design.md) adds separate persisted
Music/Sound effects sliders in Sound & comfort after accepted PLAY-A, ahead of
the larger readiness pass. Preserve shared mute, transport and current intended
defaults; verify effective gain rather than assuming a media-element volume
assignment changes speaker output on iPad. The [reviewed AUDIO-01V candidate](reviews/2026-09-06-audio01v-candidate.md)
implements these controls through a shared streamed-music/SFX gain graph. Defaults
remain22/100; no whole-file decode, new library, prefetch or creative cue change.
Mute and backgrounding cancel scheduled effects; track teardown retains the graph,
App teardown releases it. A rejected interruption recovery can retry the exact
current song on a fresh gesture. Source-creation fallback is best-effort only.
See joint state for publication; physical device listening remains unqualified.

## Historical readiness follow-up — 2026-09-05 (then planned)

The Human reports promptly switching music on a phone still displaying v0.22.0,
and recalls delayed desktop victory music. Neither v0.22.1 nor this documentation
turn changes the music/SFX code or OST. Cache/session warmth is a hypothesis;
the actual cause is unmeasured. The current adapter still stops its old player
before requesting a replacement with `preload="none"`; victory context exists,
but timely audibility is not guaranteed. SFX are synthesized locally and need
explicit AudioContext activation/readiness, not a downloaded-sample preload.

[AUDIO-01](plans/AUDIO-01-readiness-and-sound-design.md) advances bounded current+
one-next-track preparation, confirmed-playback handover and SFX readiness to an
early root checkpoint after the queued v0.22 correction gates and before Plan 04.
The canonical transport/UI stays shared. Plan 02 owns coherent sound design,
controlled footsteps/pickup variation and measured mix/ducking trials; Plan 07B
completes and qualifies the integrated audio system and delivery. These are
explicitly pending requirements; see the [Human intake](user-playtests/2026-09-05-audio-readiness-and-hole-crossings.md)
and existing PT20/23 for scope and acceptance.

## 2026-09-04 original-OST integration status

The Human-delivered candidate original soundtrack is now present under
`public/assets/ost/` in six context pools:

| Pool | Tracks | Encoded bytes |
| --- | ---: | ---: |
| `title` | 6 | 14,769,828 |
| `story` | 6 | 10,800,507 |
| `maze` | 14 | 35,434,983 |
| `victory` | 4 | 6,448,205 |
| `adventure-book` | 6 | 18,165,975 |
| `garden` | 6 | 13,531,815 |
| **Total** | **42** | **99,151,313** |

Checkpoint **03M** integrates the delivery. `src/musicCatalogue.ts` is the
authoritative 42-track catalogue: every track has a stable semantic ID and one
of the six pool IDs, every URL is covered against the files in `public/`, and
the old root-level placeholder paths have been retired. The conservative current
player now uses delivered title and shuffled Maze music; story entry, victory,
and Adventure Book use their matching pools. Garden is catalogued and dormant
until Plan 10 creates that screen.

`src/musicTransport.ts` defines the canonical `MusicTransportPort`, deterministic
fake, and current-player adapter for context/current-track state, mute,
Previous, Next and Shuffle. Loop remains deliberately unavailable pending a
Human policy choice. Plan 01 must bind its compact Sound disclosure only to this
port, and Plan 08 must bind semantic input actions only to the same port.

This compatibility step makes no claim of gapless context switching, predictive
loading, mastering, or final platform listening. Track-level provenance/rights,
duration, loudness/peak, crossfade, failure fallback and browser/Tauri listening
evidence remain open; AUDIO-01A now advances bounded readiness/continuity and
Plan 07B retains final mastering/platform qualification.

The final controller must use a validated static catalogue; randomly select
within the matching pool; keep enabled foreground playback continuous after the
first permitted gesture; and prepare at most the bounded next candidate rather
than eagerly downloading or decoding all 42 tracks. Vite/Tauri playback remains
local and must not introduce a streaming service or runtime third-party account.

The historical section below describes the pre-cutover v0.19.0 placeholder
implementation for migration context. It is not runtime authority.

## Historical v0.19.0 placeholder track catalogue

| File | Current role |
| --- | --- |
| `bgm_harbour_morning_v04.mp3` | Title screen and Adventure Book music. |
| `bgm_tiles_in_the_sun_v04.mp3` | Full-length maze playlist track. |
| `bgm_little_champions_v04.mp3` | Full-length maze playlist track. |
| `BG_Music_01_PixelSkywayRally.mp3` | Full-length maze playlist track. |
| `bgm_arena_overdrive_v04.mp3` | Full-length maze playlist track; its energetic feel is useful for later challenge layouts. |
| `Dungeon - Teeth Beneath the Temple.mp3` | Full-length maze playlist track for mysterious dungeon chapters. |
| `Iron Heart Gallop.mp3` | Full-length maze playlist track for energetic adventures. |
| `Sanctuary - Warm Stone After Midnight.mp3` | Full-length maze playlist track for gentle, cozy exploration. |
| `Shore - Saltfire Horizon.mp3` | Full-length maze playlist track for bright outdoor journeys. |
| `Throat Bass.mp3` | Full-length maze playlist track for playful high-energy challenge runs. |
| `Violent Hard Bass Throat Step.mp3` | Full-length late-adventure energy track; the filename is never shown in the child-facing UI. |
| `Violent Hard Bass Throat Step (1).mp3` | Alternate full-length high-energy maze track. |
| `Violent Hard Bass Throat Step (2).mp3` | Alternate full-length high-energy maze track. |
| `cue_new_friend_new_horizon_v04.mp3` | Reserved as a future one-shot rescue or friendship-milestone cue. It is an event sting, not looping background music. |

All thirteen full songs—including the gentle title track—are defined in
`MUSIC_TRACKS` and listed in `MAZE_MUSIC_TRACKS` in `src/music.ts`. Keep
filenames stable when replacing a mastered track. If a file is renamed, update
both catalogues and their tests in the same change. The short friendship cue is
deliberately absent from the looping playlist and should be added only to a
future one-shot event controller.

## Historical v0.19.0 playback behavior

- Music uses one reusable `HTMLAudioElement`, loops, plays inline, and defaults
  to 22% volume so the short gameplay cues remain clear.
- One `createMazeMusicPicker()` instance creates a seeded shuffle bag for the
  play session. Entering or revisiting a maze draws the next song; every one of
  the thirteen full tracks is used before the bag refills, and no song repeats
  immediately at a cycle boundary.
- A fresh runtime seed changes the shuffle order between play sessions. The
  title and Adventure Book request the harbour track directly and report it to
  the picker, so the next maze avoids repeating it when another song is present.
- The element uses `preload="none"`. Importing the module, opening the site, or
  changing mute state does not construct or start audio.
- The title screen prepares the harbour theme without creating a media element,
  then starts it on the first click, tap, or key action. This gives the home
  screen music while respecting browser and iPad autoplay rules. A denied play request,
  missing file, or unsupported codec resolves harmlessly and cannot block play.
- The single Sound control mutes both music and synthesized effects. While
  muted, background music retains its position; unmuting from the button can
  resume immediately because that button press is also a valid user gesture.
- Hiding or backgrounding the page pauses confirmed active playback. Returning
  resumes only that exact still-current player; mute, stop, track replacement,
  disposal, failed playback, and browser rejection all cancel the resume safely.
- Moving between title, Adventure Book, or individual maze contexts disposes the
  previous media element before starting the new selection. Application cleanup
  pauses playback and releases its source request.

`src/sound.ts` remains separate: it creates short interaction and fanfare cues
locally with the Web Audio API, while `src/music.ts` owns the recorded MP3
soundtrack.

## Local and offline use

- `npm run dev` and `npm run preview` serve the MP3s from the same local Vite
  origin as the game.
- The Tauri application embeds the production bundle and soundtrack, so desktop
  music works fully offline.
- A deployed browser build serves the tracks from its own site origin rather
  than a music service. The initial page and MP3 still need to reach the device;
  offline replay from a hosted site depends on the browser cache because the
  project does not currently install a service worker.

For a quick controller regression check, run:

```powershell
npm test -- --run src/music.test.ts
```

The historical v0.19.0 tests compared the thirteen-track catalogue with its OST directory,
cover exclusion of the short cue, complete shuffle cycles, immediate-repeat
avoidance, deterministic run seeds, gesture-only
startup, looping configuration, mute state, page-visibility pause/resume races,
rejected or unavailable media, stop/reuse, disposal, server-side safety, and
custom track configuration. Current verification must also run catalogue and
transport tests against the delivered 42-track/six-pool authority above; this
historical list is not the current catalogue count or a listening acceptance claim.
