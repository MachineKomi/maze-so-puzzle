# Puzzlewild story bible

Status: current 16-chapter narrative authority; canon reviewed 2026-09-02
Audience: a young player playing alone, or a child and adult reading together

Canon review: 2026-09-02. The chapter table below describes the currently
shipped 16-chapter story. The approved future expansion to 24 chapters is a
planning target, not yet shipped content.

## One-sentence premise

When Sprig the baby cloud-dragon accidentally tangles the magical Star Map with
a glittery hiccup, Ame becomes a Junior Pathkeeper and untangles the Puzzlewild
one silly, friendly maze at a time.

## Story promise

The story should make the mazes feel meaningful without ever standing between a
child and play. It is sweet, gently funny, adventurous rather than dangerous,
and rewarding to read aloud. Nobody is cruel, punishment is never the point,
and a mistake is usually the beginning of a better idea.

Every authored maze receives:

- one self-contained read-together card before play;
- a funny character quotation;
- one plainly named “Puzzle power”;
- one optional adult-and-child thinking prompt;
- one short epilogue inside the normal victory screen.

The entire intro closes with one tap anywhere or any ordinary key. Tab and
modifier shortcuts remain available for accessibility. A persistent illustrated
Story button in the maze header lets a family reopen the chapter at any time.
Tester and resumed runs do not interrupt play automatically.

## The world

The **Puzzlewild** is a soft fantasy realm whose paths, bridges, gardens,
libraries, castles, and picnic routes are stitched into the **Great Star Map**.
The map is less like a paper atlas and more like a friendly magical promise:
while its Wish Stars are in place, everybody can find their way home.

Sprig's Great Glittery Hiccup wriggled the paths into mazes and rolled the Wish
Stars into distant corners. Nothing terrible happened—the realm merely became
extremely inconvenient and rather more interesting. Each recovered star
untangles another piece of the map.

The weapons follow the **Polite Sword Rule**. Puzzlewild baddies are not evil;
they are enthusiastic guardians who only scoot aside when an adventurer carries
a proper maze weapon and matches or beats their Power. Winning transfers their
Power to Ame, while a stronger guardian simply encourages her to explore and
return.

## Main cast

### Ame — Junior Pathkeeper

Ame is observant, kind, practical, and willing to revise a plan. She never needs
to know everything at once. Her greatest strength is noticing what she knows,
what she still needs, and which idea she can try next.

Visual canon: Ame has golden-blonde hair and clearly blue eyes in every field,
portrait, story, title, UI, animation, and promotional depiction. Preserve her
recognisable warm face, mint tunic, lavender cape, boots, and backpack. Her next
model uses the restrained shoulder-brushing, softly layered Candidate C
hairstyle that more closely resembles the real Ame; the current bob is
historical reference, not an immutable silhouette.

The Human approved Candidate C as the canonical static Ame v02 design direction
on 2026-09-03 after reviewing its comparison, actual-size, and model-study
proofs. Its identity and construction are canon. Plan 03's v6 publication now
selects the approved versioned Ame v02 field sprite and portrait at runtime;
the v01 images remain rollback history. New story, title, UI, animation, and
promotional art must still derive from the approved model sheet and receive its
own pixel, runtime, rights, and context review rather than inheriting approval
automatically.

### Professor Poggle — Cartographer of Almost Everywhere

Poggle is a tiny tawny owl scholar with huge teal spectacles, a lavender cape,
and a rolled map. He knows a great deal, but frequently reads maps upside down,
files corridors under Sandwiches, or prepares an excellent plan for somewhere
else. He models an important truth: knowledgeable people still make mistakes,
and correcting one can be funny rather than embarrassing.

Current visual authority:
`public/assets/mgjrpg-02/story/story-professor-poggle-v02-story-portrait-512-r01.webp`.
The v01 portrait remains rollback history.

### Sprig — Apprentice Sneeze-Dragon

Sprig is a peach-cream baby cloud-dragon with mint horns, lilac winglets, and a
golden star nose freckle. His harmless glitter hiccup caused the story's problem,
but he is never shamed for it. He is curious, impulsive, snack-motivated, and
often voices the tempting first answer. By the finale he prepares responsibly,
apologises, and learns that a very small rainbow is an acceptable sneeze.

Current visual authority:
`public/assets/mgjrpg-02/story/story-sprig-v02-story-portrait-512-r01.webp`.
The v01 portrait remains rollback history.

### Cast and compact-interlude review

The current three-character cast remains canon at v0.20.1, but is not assumed
to be the final complete story ensemble. Before the 24-chapter script and final
key art are frozen, Plan 09 must record a retain/refine/replace/add disposition
for each story role. Additional characters earn inclusion through a distinct
narrative, teaching, comic, or world-building function—not roster size alone.

Future story presentation may use short visual-novel-style exchanges rather
than only one-speaker cards. A normal interlude is two or three concise turns,
may let Ame answer, and remains quickly advanceable/skippable and replayable.
This is a warmer delivery of the same puzzle adventure, not a long-form visual
novel or a reading gate. Exact implementation and final lines belong to Plan 09;
Plan 01 supplies the accessible presentation shell. Optional generated voice
acting remains a Plan-14 study and is not current canon or approved media scope.

## Future Puzzlewild guardians — Plan 09 gameplay roster

The Human-directed future gameplay roster includes Classic Slime, paired
Lizard Sword and Spear Guards, Wholesome Succubus, Pocket
T-Rex, a fictional Star Map Cultist whose public label remains pending, Lamia,
Soda Slime, Orc Chieftain, Cyclops, Minotaur, Warrior Skeleton, Kappa, and the
Treasure and Candy Mimic chest families. They expand the world's comic fantasy range; they
are not villains, sources of suffering, or permission to introduce new attacks.

Every one remains an enthusiastic guardian under the Polite Sword Rule.
Weapons, horns, wings, coils, size, bubbles and teeth communicate personality
and challenge silhouette only. They do not imply damage, weapon reach, charm,
chase, constriction, drowning, poison, sacrifice or status effects. Under
`PT-20260903-22`, each approved Mimic family first appears as its matching closed
chest. Its first interaction commits one deterministic, save-stable result: a
good reward chest 65% of the time or the visible Mimic guardian 35% of the time.
The family changes the chest's look and personality, not those rules. Until that
exact gameplay contract is implemented, each closed/open/enemy art triplet
remains reserved or dormant and must not be substituted with an always-visible
encounter. The
Succubus and Cultist need explicit Human review of child-facing names as well as
art. Exact visual and safety construction lives in
`docs/enemies/ENEMY_FAMILY_SHEET.md`.

This section is future-facing and does not claim the guardians are in the
current sixteen chapters. Plan 09 owns their versioned runtime admission,
progressive first encounters, purposeful placement and later themed/mixed use
across the final twenty-four chapters and deterministic Surprise generation.
Every final gameplay-eligible enemy type receives a meaningful authored-campaign
opportunity without acquiring a new mechanic merely because its art differs.

## Educational design

The game teaches habits of thought, not school worksheets. Prompts should invite
conversation and prediction without requiring reading or a correct spoken
answer. The maze itself remains the real activity.

| Chapter | Maze | Puzzle power | Thinking habit |
|---:|---|---|---|
| 1 | Little Star Trail | Directions | Name relative movement |
| 2 | Shiny Sword | Compare and match | Compare magnitude; pair colour and shape |
| 3 | Splashy Boots | Plan and return | Remember a blocker and revisit it |
| 4 | Rainbow Picnic | Sorting | Group related keys and doors |
| 5 | Toasty Toes | Cause and effect | Predict a terrain consequence |
| 6 | Moonbeam Moat | Break it into steps | Decompose a larger goal |
| 7 | Wishing Woods | Perseverance | Treat “not yet” as useful evidence |
| 8 | Ame's Grand Parade | Keep track | Review collected and missing pieces |
| 9 | Springstep Sky Hollow | Predict | Point to a landing before acting |
| 10 | Lanternlight Labyrinth | Use a model | Compare the world and minimap |
| 11 | Twilight Treasure Loop | Choose relevant clues | Distinguish reward, tool, and prerequisite |
| 12 | Moonlit Friendship Quest | Careful observation | Find discriminating details |
| 13 | Rose Heart Roundabout | Make connections | Model paired portals as hidden edges |
| 14 | Clover Comeback Carnival | Revise your plan | Update a plan from new evidence |
| 15 | Friendship Crown Vault | Combine strategies | Select different tools for different problems |
| 16 | Rainbow Power Parade | Sequence and backtrack | Build an ordered chain and return |

Gameplay interpretation is maintained in `docs/GAMEPLAY_DESIGN_SPEC.md`.
Chapter 1 now presents its complete 6×6 trail before the exploration camera is
introduced. Chapters 13 and 15 use compact portal graphs, and Chapter 16 uses a
short Power-99 hub-and-return plan. These layout changes do not alter canon:
rescuing friends remains a kind optional act, never a condition for restoring
the Star Map.

## Tone and writing rules

- Prefer concrete, read-aloud sentences and one joke per story card.
- Keep the two intro paragraphs together under 80 words where practical.
- Never call the player wrong, slow, bad, or careless.
- Let characters make recoverable mistakes and model trying again.
- Keep danger theatrical and safe: friendly lava, proud guardians, lost routes.
- Do not require lore knowledge to solve a maze.
- Avoid lore text on the board during movement; use the small Puzzle Power label
  as the only persistent educational reminder.
- End each chapter with progress, a warm joke, or both.

## Future story hooks

The approved 24-chapter expansion will eventually insert four adventures into
the existing learning arc and add a four-chapter **Elsewhere Encore** after the
current finale. The restored Star Map remains a complete victory; the encore
follows a new path beyond it rather than adding another supposedly final knot.
See `docs/plans/09-campaign-expansion-24-mazes-plan.md`. Until that plan is
implemented, the 16-chapter matrix above remains shipped story authority.

Tea-Time Skeleton belongs with the rescued friends instead. He is a courteous,
quietly funny Puzzlewild resident who pauses for green tea even in an old
dungeon. Ame first rescues him in Maze 2 and can meet him again in the current
finale; she never challenges, defeats, or moves past him through Power. Preserve
the approved bare toy-ivory skeleton, friendly face, seated tea pose, handleless
green-tea cup, and single steam curl. Rainbow-Horn Unicorn is the very first
optional rescue in Maze 1, giving the opening trail an immediate magical-friend
promise without making rescue mandatory for completion.

Future chapters can follow new loose threads without undoing the first arc:

- Poggle's “Useful for Somewhere Else” map leads to a seasonal maze island.
- A Science Point observatory may let lifetime collected curiosity light
  optional celebratory constellations; current Solo campaign play does not spend
  Science, require it, or use it to gate story progress. Plan 10 may add its
  separately approved optional Garden Egg exchange with a durable available/
  spent ledger, but that exchange grants no maze Power and never gates the story.
- Rescued animal and mythic friends may contribute different narrative
  personalities, reactions or clue flavour. Gameplay clue abilities are a
  speculative separately approved feature, not Plan 10 v1: Friend Garden
  residents confer no maze Power, equipment, hint, traversal or automatic-solve
  benefit. The maintained roster and its child-safe collection rules live in
  `docs/GAMEPLAY_DESIGN_SPEC.md`.
- Sprig practises weather magic and accidentally creates reversible ice paths,
  wind arrows, or cloud bridges.
- The Friendship Crown opens optional challenge stories for perfect-rescue
  records while the main path stays gentle.

Any new mechanic should receive a story reason, a picture-led prerequisite hint,
a solver-valid introduction, and a child-readable thinking habit.
