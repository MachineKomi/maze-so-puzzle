# v0.22.7 — music readiness preview

Frozen runtime: `9b822281197c9e9e65a8c9467fe5bd578dce1cbd`.
Qualification and exact download hashes are recorded in the accompanying manifest.

The game prepares one likely next song, especially the Victory song during a
maze. On supported Web Audio playback it changes songs with a short fade after
the incoming song has started. A slow request keeps the previous song playing
instead of stopping it first. A failed incoming song gets one alternate attempt;
an autoplay refusal waits for a permitted interaction rather than retrying forever.

The 42-track soundtrack, your volume choices, movement speeds, artwork, campaign
and saved progress are unchanged. This build does not fix the remaining iPad
camera stutter. Full song-history/natural succession, final mastering and broad
device qualification remain later work.

## Please try when convenient

Check the displayed version. Close older Windows builds first because they share
the same save namespace. Do not clear your progress or reset data for a cold test.

1. Move naturally between Home, Story, a maze, Victory and the Adventure Book.
   Does the new music arrive promptly and does its fade sound pleasant? At a win,
   is there unwanted silence or a distracting tail from the maze song?
2. Try Next, Previous and Shuffle a few times, including two quick changes. Does
   only the latest selected song take over without overlaps or sudden loudness?
3. Mute during a change, then unmute. Your chosen Music/Sound effects balance
   should remain intact; no delayed effects should burst out afterward.
4. Put the game in the background briefly and return. If your device blocks audio
   recovery, tap or press a game control once. Report silence that persists, an
   incorrect song, or music playing while the game should be silent.
5. Close and reopen Windows normally. Your run and comfort settings should remain.

You may combine this with outstanding P5–P10 checks in the
[cumulative checklist](https://github.com/MachineKomi/maze-so-puzzle/blob/main/docs/PLAYTEST_CHECKLIST.md).
Tell us device, browser/app, version, output route (speaker/headphones), scene and
what sounded wrong. A natural short session is enough; no exhaustive checklist
is needed in one sitting.

## Qualification limits

Media and graph timestamps are not speaker-output measurements. No instant
uncached playback, click-free output on every device, physical Safari/iPad pass,
or all-range clipping-free mastering is promised. The legacy no-Web-Audio path
uses a confirmed hard cut, not a guaranteed element-volume fade. Very high Music
plus Sound effects can distort; lower either if that happens. Use a comfortable
system volume and retain your preferred balance.

This is an unsigned x64 Windows portable, not a signed installer or clean-machine
certification. Check its name/hash against the accompanying SHA256SUMS file.
Previous v0.22.6 remains an immutable fallback; never erase saved data to downgrade.

[Play online](https://maze-so-puzzle.vercel.app/) ·
[Decisions/steer](https://github.com/MachineKomi/maze-so-puzzle/blob/main/docs/HUMAN_DECISIONS.md)
