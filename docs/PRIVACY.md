# Privacy and saved data

Maze so Puzzle 0.3.0 is a client-only game. It has no account system, analytics,
advertising, multiplayer, chat, remote database, or game-owned server. The
browser build does not intentionally send player names, gameplay, or saved
progress anywhere.

## What is stored

The game keeps progress in the browser's `localStorage`, including completed
mazes, best step counts, rescued animals, rewards, achievements, gold, and sound
preference. The Windows build keeps the same information in its local Tauri
WebView profile. No save data is included in the project repository.

Saved progress is specific to a browser profile and site origin. A different
device, another browser, a private window, a cleared site-data store, or a
different Vercel preview hostname starts with a separate save. There is no cloud
sync or recovery service in this build.

## Network behaviour

All game code, images, and sound logic ship with the static browser bundle.
Sound effects are synthesized locally with the Web Audio API. During normal play
the game itself makes no third-party API calls.

The hosting platform and browser may still create ordinary infrastructure logs
or make browser-controlled requests that are outside the game code. Review the
selected host's current privacy settings before sharing a public deployment.

This document describes the current implementation; it is not a substitute for
a formal privacy policy if accounts, telemetry, online services, or public
distribution are added later.
