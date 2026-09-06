# Human direction — depth, discovery and celebration

Recorded 2026-09-06 by Astra from the Human's direct request. Requirements, not
evidence of implementation or acceptance. This supersedes earlier conflicting
Book mystery-card preferences; all unrelated approvals remain intact.

## Wall depth — PT15 / Plan04

WALL-04A is better but too subtle, disappointing and not convincingly 3D.
Shadows are too small; edge highlights align with the upper bend but not the
lower bend. The goal is a beautiful, impressive, readable little world, not
merely a passing geometry test. Lighting is an important hypothesis. Real 3D,
perspective and pseudo-3D are permitted approaches to compare, not an instruction
to replace the engine without a useful proof and device-cost check.

Immediate research/implementation owner: [WALL-04A-R1](../plans/WALL-04A-R1-convincing-depth.md).
Physical iPad camera performance and P13 visual acceptance remain open.

## Discovery — PT50, extending PT37

- Both Friends and Bestiary initially show grey silhouettes of their actual
  species/guardian sprites, with **no visible name, repeated placeholder copy,
  question mark, description or rescue count**. Keep a concise accessible
  unnamed undiscovered-slot label; do not leak names through alt/title labels.
- Legitimately encountering a character reveals its color sprite, name and
  one-liner. Seeing a caged friend counts before rescue; just loading the Book,
  a catalogue, offscreen/fogged content or a tester scene does not.
- Friends show rescue totals only after encounter. Existing recorded rescues
  prove an encounter; unknown historical aggregate rescues do not identify a
  species. New encounters must survive quitting without clearing a maze.
- Both tabs show X/Y unique discovered entries, based on the declared playable
  roster, not the number of rescue events or all dormant catalogue records.
  Plan09 must put every counted entry into obtainable content before claiming
  collection completion is possible. Roster growth must not revoke earned medals.
- Silhouettes necessarily disclose shapes and may fetch the approved image for
  masking. This explicitly supersedes the old no-unknown-image-request rule;
  lazy-load the mounted page and avoid fetching the whole presentation catalogue.
- A separate small Garden/gate indicator beside a discovered friend's name
  records whether the species has been added to any owned Friend Garden.
  Encounter, rescue and Garden ownership are three different facts. Hide this
  affordance until Plan10 implements real Garden ownership; no fake badge now.

Delivery: BOOK-02A (root/UI + progress) follows the bounded wall repair, then
Plan09 roster reachability, Plan10 Garden indicator. Use a backwards-compatible,
tested persistence migration; preserve future profiles and exact award receipts.

## Collection achievements — PT51

Add distinct achievements for meeting all friends, completing the Bestiary and
adding every friend species to Garden(s). Each needs an original polished
sticker/badge/medal in the approved achievement family. Define stable IDs,
eligible roster revision and exact-once ownership; do not award an unobtainable
or zero-entry collection, relock prior awards, or award Garden completion from
rescue counts. Plan09 owns obtainable encounter-roster completion; Plan10 owns
Garden collection completion. Root/art supplies the three bounded new artworks.

Plan02/UI also owns an in-maze earned-achievement celebration: large full-color
sticker and short fanfare, queued/coalesced without interrupting held movement,
covering the route, reopening on save/reload or granting rewards from animation.
Mute, reduced/static, visibility cancellation and readable non-motion feedback
remain mandatory. Existing earned-sticker inspection is still required by PT27.

## Victory delight — PT35 / Plan02 / Plan05

The current victory still lacks fanfare: larger rescued friends, more
enthusiastic individual dances, occasional rare short flips, particle fireworks
and confetti. Make the friends/reward the hero rather than add more equal-weight
rectangles. Keep actions reachable at short height/enlarged text, restore focus,
and preserve Stay/Next/Restart and exact-once completion semantics.

Use one bounded celebration lifecycle, finite emitter/token caps, no timer per
particle and no gameplay-dependent randomness. Reduced/static keeps large art
and a calm celebratory alternative; flips never run indefinitely. Garden breaks
remain a Plan10 extension. Success is visible joy and smooth response together,
not a count of effects. Later Human playtest will decide whether it is satisfying.

## Sequence and outstanding choices

1. Research and bounded WALL-04A-R1 proof/repair; compare actual gameplay scale.
2. BOOK-02A silhouettes, honest friend discovery and X/Y (no Garden implementation).
3. Plan02 achievement event presentation / stronger victory and continuous
   pickup glow; qualify combined cost with the already implemented reward shower.
4. Plan09 roster coverage and collection-award rules/art; Plan10 Garden membership
   and its collection achievement after existing co-op greybox/family gates.

No immediate Human answer is required. No request here approves a new economy,
persistent XP model, a full renderer rewrite or Plan10's early execution.
