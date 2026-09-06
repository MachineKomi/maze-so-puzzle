# v0.22.9 — WALL-04A family preview

Frozen runtime: `cbe8ab879bd58c0a08a770209ebfeb649f684e2b`.

This preview adds rounded raised wall faces, light-facing edges, smaller repeating
floor/wall/dressing textures and clearer floors in Springstep Sky Hollow. It also
fixes the animated partial-width shadow that could look like a dark vertical line
inside Rainbow Power Parade and Twilight Treasure Loop.

No new reward/drop rules, loot physics, hole art, camera movement, audio or save
migration. Existing v0.22.8 unfinished runs and earned progress remain compatible.
This is the first wall-only part of Plan04, not the whole lighting overhaul.

## Please check when convenient (P13)

1. Walls feel raised and corridors remain obvious, especially Springstep Sky
   Hollow, a leafy maze and a dark/crystal maze. Tell us if any floor reads as wall.
2. Twilight Treasure Loop and Rainbow Power Parade: stand still for a few seconds,
   then move in both directions. Is the thin interior dark line gone?
3. Compare Full, Lite and Static briefly. Walls should retain their shape; no
   flickering seams, narrowed corridors, or distracting oversized texture pattern.
4. On your usual devices, does camera travel feel unchanged, better or worse?
   Note build, browser/device and quality. Eighth-generation iPad smoothness is
   still an open issue, not promised fixed by this release.

P5–P12 remain cumulative in `docs/PLAYTEST_CHECKLIST.md`; no need to repeat already
reported failures without a meaningful new comparison. Do not clear saved data.

Windows download is an unsigned x64 portable preview, not an installer. Web follows
the current deployment at https://maze-so-puzzle.vercel.app/ . Physical-device,
clean-host performance, final signing and full-roadmap acceptance remain separate.

Next visible target: bounded wall-bouncing Gold/Science/maze-Power reward showers,
magnetic collection, trails and coordinated sound. Persistent XP is a later design
decision; it is not silently introduced or mislabeled in this preview.
