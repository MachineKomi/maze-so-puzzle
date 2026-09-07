# Moving yellow dot — Human feedback, 2026-09-07

Reported build: v0.22.10; the Human suspects earlier versions too. Subsequent
current15 baseline capture matches the report; see the diagnosis below.

> It is invisible when you are standing still - but when you move the character there is a very small flashing yellow blurry dot that looks to be located in the bottom right corner of the player character's tile. It's not super noticeable - but its kinda weird and I'd like to see it removed / resolved. Can go on the backlog since its not urgent, but it should be fixed before we ship the finished game.

Priority: nonurgent, required before final release. Astra owns runtime diagnosis;
independent source review is checking movement/footstep/actor/VFX anchors. Verify
actual moving pixels before naming a cause. Preserve legitimate pickups, player
grounding and gameplay movement. No further Human input is needed to investigate.

September7 diagnosis/fix: the old amber `player-layer::after` step sparkle is
invisible at rest and reaches.637725 opacity during the captured move, with4px
amber blur. Independent source history confirms the same rule in10/older builds.
The candidate removes that pseudo-element, movePulse/classes and keyframes;
the ground shadow is steady instead of sharing the sparkle pulse. Four separate
Full/Lite/Reduced/Static journeys pass. [Candidate evidence](../reviews/2026-09-07-book03-move02-candidate.md).
Implementation is backed up at f2368ac; publication and Human confirmation remain
separate. No pickup effects, movement rule or sprite registration were removed.

**Delivered in web0.22.16:** [public verification](../reviews/2026-09-07-v02216-public-verification.md)
now completes the publication boundary. The original Human report above remains
verbatim. P18 asks for a report only if the dot reappears; no blocking retest is required.
