# Product-direction intake — continuous contextual music — 2026-09-03

Status: source note; normalized from the Human author's conversational intake

## Continuous music and final original OST pools

Once music has been enabled, Maze so Puzzle should not fall into unintended
silence during normal foreground play. Background music should follow the
player's current activity and move smoothly between contexts rather than stop,
stutter or wait audibly for another file to load.

The Human author is creating a brand-new original BGM soundtrack specifically
for Maze so Puzzle. All music currently in the repository is placeholder music
from other projects and must not be treated as the final release soundtrack.
The intended OST organisation contains separate pools for:

- `story` — story pop-ups and story-reading moments;
- `garden` — relaxing in the Friend Garden, feeding friends and carrying them;
- `victory` — the post-maze “You did it!” experience;
- `maze` — normal authored and generated maze play, containing most tracks;
- `title` — title and home screens; and
- `adventure book` — the Adventure Book screen.

Within each activity, the game should randomly choose an MP3 from the matching
pool. Transitions should fade or crossfade smoothly. Likely next tracks should
be selected and loaded early enough that player navigation does not expose a
silent loading gap. The final implementation must preserve fast web loading and
responsive play while also feeling seamless in the offline Tauri build.

Browser-required user activation, an explicit mute choice, app backgrounding,
or a genuinely unavailable/corrupt soundtrack file are policy/error cases, not
permission for ordinary in-game transitions to introduce silence. These cases
need honest, graceful handling in the implementation contract.
