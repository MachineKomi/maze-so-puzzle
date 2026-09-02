# Privacy and saved data

Maze so Puzzle is a client-only game. It has no account system,
analytics, advertising, multiplayer, chat, remote database, or game-owned
server. The browser build does not intentionally send player names, gameplay,
or saved progress anywhere. The optional Tauri Windows build uses the same
device-local storage model. The current verified unsigned 0.10.3 portable app
and installer are built from this same client-only application; their local
packaging does not add accounts, telemetry, remote storage, or network services.

## What is stored

The game keeps progress in the browser's `localStorage`, including completed
mazes, current and historical best step counts, rescued animals, rewards,
achievements, Gold, Science Points, and stable campaign access. A
separate versioned active-run record stores the current authored
story maze's position, Power, inventory, interactions, rescues, step count, and
explored-map coordinates, content revision/fingerprint, and progressive-hint
state so a refresh or app restart can resume safely. Both records are validated
before use. If authored gameplay changes, a mismatched active run is removed
without deleting durable progress. The Windows build keeps the same information
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

## Resetting saved data

**Reset progress** is available from the title screen and Adventure Book. It
always opens a confirmation explaining that maze records, gold, rescued friends,
stickers, medals, badges, and the current maze will be forgotten. Confirming
returns the game to a fresh Story Maze 1.

The reset uses an explicit allow-list and attempts to remove only these
game-owned `localStorage` entries:

- `maze-so-puzzle-progress-v4`
- `maze-so-puzzle-progress-v3`
- `maze-so-puzzle-progress-v2`
- `maze-so-puzzle-progress-v1`
- `maze-so-puzzle-active-run-v2`
- `maze-so-puzzle-active-run-v1`

It does not call `localStorage.clear()` and therefore preserves unrelated data
stored by the same browser origin or desktop WebView. A failure to remove one
entry does not prevent attempts on the other game-owned entries. If any removal
fails, the game reports that the reset could not finish, leaves the current
screen and in-memory adventure unchanged, and allows another attempt. Because
some entries may already have been removed before the failure, the message does
not claim that storage was untouched. Clearing browser site data through browser
settings is broader and remains controlled by the player or browser.

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
