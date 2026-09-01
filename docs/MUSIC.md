# Music

Maze so Puzzle ships its Suno-generated soundtrack as MP3 files in
`public/assets/ost/`. Vite copies that directory into the browser production
bundle and the bundle embedded by Tauri. Playback does not use a streaming
service, Suno API, account, or runtime download from a third-party host.

## Track catalogue

| File | Current role |
| --- | --- |
| `bgm_harbour_morning_v04.mp3` | Title screen and Adventure Book music. |
| `bgm_tiles_in_the_sun_v04.mp3` | Full-length maze playlist track. |
| `bgm_little_champions_v04.mp3` | Full-length maze playlist track. |
| `BG_Music_01_PixelSkywayRally.mp3` | Full-length maze playlist track. |
| `bgm_arena_overdrive_v04.mp3` | Full-length maze playlist track; its energetic feel is useful for later challenge layouts. |
| `cue_new_friend_new_horizon_v04.mp3` | Reserved as a future one-shot rescue or friendship-milestone cue. It is an event sting, not looping background music. |

All five full songs—including the gentle title track—are defined in
`MUSIC_TRACKS` and listed in `MAZE_MUSIC_TRACKS` in `src/music.ts`. Keep
filenames stable when replacing a mastered track. If a file is renamed, update
both catalogues and their tests in the same change. The short friendship cue is
deliberately absent from the looping playlist and should be added only to a
future one-shot event controller.

## Playback behavior

- Music uses one reusable `HTMLAudioElement`, loops, plays inline, and defaults
  to 22% volume so the short gameplay cues remain clear.
- One `createMazeMusicPicker()` instance is created for a play session. It gives
  each maze ID a stable deterministic assignment from the five-track playlist,
  including generated IDs, so React re-renders, mute toggles, and revisits do
  not change that maze's song. A first-time maze assignment avoids whichever
  song most recently played whenever another choice exists.
- A fresh runtime seed changes the assignments between play sessions. The title
  and Adventure Book still request the harbour track directly and report it to
  the picker, so the next maze avoids repeating it when possible.
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

The tests cover the five-track catalogue, exclusion of the short cue, stable
per-maze assignments, immediate-repeat avoidance, fresh run seeds, gesture-only
startup, looping configuration, mute state, page-visibility pause/resume races,
rejected or unavailable media, stop/reuse, disposal, server-side safety, and
custom track configuration.
