# FIELD-21 — proportions, airborne layering and closed perimeter

September 7: Human-directed correction of web v0.22.20. Source3be18d2,
branch `codex/field-scale-refinement`. Astra writes runtime; Sol independently
reviews. [Human intake](../user-playtests/2026-09-07-balanced-wall-acceptance-and-relative-scale.md)
accepts balanced interior walls and supersedes the next chest dispatch until
this bounded correction is delivered. No new gameplay, save, reward or route rules.

## Implementation and acceptance

1. Audit every character/enemy/friend/pickup/weapon alpha silhouette using the
   registered catalogue. Keep width at most 0.9 tile and unwarped proportions.
   Cap unusually tall actors at 1.35 tiles rather than forcing all to fill width;
   Ame currently reaches 1.78, enemies 0.66–1.22. Preserve natural broad/short
   creatures. Cap ground items at 0.9 tile tall. Keep registered feet, held
   weapons, jump boots, badges, cages and rendition demand aligned with the same
   sizing owner. Inspect every family, both corridor orientations and actions.
2. Separate small reward size from field-character sizing. Target Gold/Science
   near 0.28 tile diameter and Power near 0.22; proportion shadows/trails and keep
   bundle counts readable. Cover Canvas and no-Canvas fallback. Retain conserved
   value, timing, physical routes, finite vacuum and existing collision safety.
   Proper generated replacement art is ART-REWARD-01, separately pending.
3. Put the complete jumping actor above all terrain/foreground walls for the
   airborne presentation, then restore normal ground occlusion. Preserve the
   shared camera clock and interruption/landing handoff in all comfort modes.
4. Extend only map-exterior wall geometry to cover the frame edge. Preserve
   interior caps, 0.81 height, lighting and at most 0.30 adjacent rear overlap.
   Keep open boundary tiles open, avoid gaps at corners, and check all eight
   lights and actual camera boundaries. Do not thicken every interior wall.
5. Prove continuous geometry safety, gameplay identity, registration, real
   jump/loot/save/browser behavior, source-matched before/after visuals and paired
   ordinary camera/active reward rendering. Correct tests that asserted the old
   oversized appearance without weakening semantic checks. Qualify, independently
   review, commit/push and publish through the unchanged Vercel guard.

## ART-REWARD-01 — required subsequent art replacement

Generate a coherent small transparent sprite family: faceted warm Gold star,
clear jewel-like Science token and attractive Power mote. Use actual artwork,
no emoji, text or baked glow/blur. Keep category colors and silhouettes distinct
at roughly 12–32 physical pixels; inspect both backgrounds and comfort modes.
Use the existing asset/provenance/rights workflow, tiny bounded renditions and
one cached atlas. Replace Canvas and fallback consistently where supported;
preserve quantities separately from artwork. No claim that present Canvas
shapes are final art. Rainbow account XP is a later distinct holographic crystal.

## Evidence and limits

Reuse existing dist/tools; retain only four frozen20 entry files plus named
external `field21-*` proof packets in the artifact ledger. No repository/media
clone, native package, deletion or archive. The old preview on port4271 predates
this slice and is not owned or stopped by it.

Q01 records accepted interior walls and now checks proportions/perimeter.
Q05 covers smaller reward readability; Q02 adds airborne occlusion to its retained
jump-camera observation. Q08 and PERF-COLD-POWER remain open. Local Chromium is
not Apple/3GB/native acceptance. Resume chest/Mimic work after this correction.
