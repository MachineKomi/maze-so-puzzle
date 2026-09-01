# Privacy and saved data

Maze so Puzzle 0.10.1 is a client-only game. It has no account system,
analytics, advertising, multiplayer, chat, remote database, or game-owned
server. The browser build does not intentionally send player names, gameplay,
or saved progress anywhere. The optional Tauri Windows build uses the same
device-local storage model; the verified unsigned 0.10.1 package is built from
the same client-only application.

## What is stored

The game keeps progress in the browser's `localStorage`, including completed
mazes, best step counts, rescued animals, rewards, achievements, gold, and sound
preference. A separate versioned active-run record stores the current authored
story maze's position, Power, inventory, interactions, rescues, step count, and
explored-map coordinates so a refresh or app restart can resume safely. Both
records are validated before use. The Windows build keeps the same information
in its local Tauri WebView profile. No save data is included in the project
repository.

The short breadcrumb trail used to draw rescued pets following Ame is transient
in-memory presentation state. It is not added to progress, active-run storage,
analytics, or network requests.

Saved progress is specific to a browser profile and site origin. A different
device, another browser, a private window, a cleared site-data store, or a
different Vercel preview hostname starts with a separate save. There is no cloud
sync or recovery service in this build.

The secret tester picker, opened from the title build label or the exact
`?debug=mazes` query, does not write completion rewards, records, unlocks, or
active-run maze progress. Opening or closing the picker does not transmit data.
Generated Surprise Mazes are also excluded from active-run recovery. Existing
local story progress remains available after leaving a preview run.

## Network behaviour

All game code, images, synthesized sound logic, and MP3 music tracks ship with
the static browser build. Sound effects are synthesized locally with the Web
Audio API, and background music is read from same-origin `/assets/ost/` files.
During normal play the game itself makes no third-party API or streaming calls.

The production site is statically hosted on Vercel Hobby at
`https://maze-so-puzzle.vercel.app/`. Vercel and the browser may still create
ordinary infrastructure logs or make browser-controlled requests that are
outside the game code. GitHub-to-Vercel deployment does not add gameplay
telemetry or cloud saves. Review the selected host's current privacy settings
before sharing a public deployment.

This document describes the current implementation; it is not a substitute for
a formal privacy policy if accounts, telemetry, online services, or public
distribution are added later.
