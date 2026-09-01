# Music

Maze so Puzzle ships its Suno-generated soundtrack as MP3 files in
`public/assets/ost/`. Vite copies that directory into the browser production
bundle and the bundle embedded by Tauri. Playback does not use a streaming
service, Suno API, account, or runtime download from a third-party host.

## Track catalogue

| File | Current role |
| --- | --- |
| `bgm_harbour_morning_v04.mp3` | Title screen and Adventure Book music. |
| `bgm_tiles_in_the_sun_v04.mp3` | Early story music for authored mazes 1–4. |
| `bgm_little_champions_v04.mp3` | Later story music for authored mazes 5 onward, including Lanternlight Labyrinth. |
| `BG_Music_01_PixelSkywayRally.mp3` | Surprise Maze music for generated adventures. |
| `bgm_arena_overdrive_v04.mp3` | Reserved for a future arena, boss, or special challenge. Keep this file even though the current track map does not select it. |
| `cue_new_friend_new_horizon_v04.mp3` | Reserved as a future one-shot rescue or friendship-milestone cue. It is an event sting, not looping background music. |

The active four paths are defined in `MUSIC_TRACKS` in `src/music.ts`. Keep
filenames stable when replacing a mastered track. If a file is renamed, update
that map and its tests in the same change. Reserved tracks should be added to the
map only when their corresponding gameplay event exists.

## Playback behavior

- Music uses one reusable `HTMLAudioElement`, loops, plays inline, and defaults
  to 22% volume so the short gameplay cues remain clear.
- The element uses `preload="none"`. Importing the module, opening the site, or
  changing mute state does not construct or start audio.
- `startMusicFromUserGesture()` is called directly from a click, tap, or key
  action. This respects browser and iPad autoplay rules. A denied play request,
  missing file, or unsupported codec resolves harmlessly and cannot block play.
- The single Sound control mutes both music and synthesized effects. While
  muted, background music retains its position; unmuting from the button can
  resume immediately because that button press is also a valid user gesture.
- Hiding or backgrounding the page pauses confirmed active playback. Returning
  resumes only that exact still-current player; mute, stop, track replacement,
  disposal, failed playback, and browser rejection all cancel the resume safely.
- Moving between title, story, and Surprise Maze contexts disposes the previous
  media element before starting the new selection. Application cleanup pauses
  playback and releases its source request.

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

The tests cover gesture-only startup, looping configuration, mute state,
page-visibility pause/resume races, rejected or unavailable media, stop/reuse,
disposal, server-side safety, and custom track configuration.
