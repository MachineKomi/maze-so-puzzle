# Playtest intake — wishlist and issues — 2026-09-02

Status: source note; normalized from the Human author's conversational intake

Participants and evidence:

- The Human author reported observations from further family play, including
  direct observation of Amelia.
- Device/build context explicitly mentioned in the intake includes the released
  v0.19.0 Tauri desktop build, iPad touch play, keyboard/WASD, directional-pad
  and UI-button input, plus comparison with builds back to v0.5.0.
- This is exceptionally relevant evidence for the intended family, but it is
  not a broad usability sample. Each issue must still be checked against the
  current accepted implementation checkpoint because Plan 06 landed after the
  released build being discussed.

This note preserves the meaning and important requested copy from the intake.
It is not an implementation plan. The living routing and acceptance ledger is
[`docs/PLAYTEST_BACKLOG.md`](../PLAYTEST_BACKLOG.md).

## 1. Interaction celebration messages

The existing item-pickup text is delightful, but should rise farther and fade
more slowly. Every meaningful interaction should receive similarly short,
cute, relevant feedback with an appropriate sprite. Examples requested were
“Ame defeated MONSTER-NAME! X + Y = Z!” and “X has joined the party!”. Rapid
events must queue in order rather than replace one another: two or three lines
may coexist as older lines float upward and newer lines appear beneath them.
Use a softer, rounder typeface suited to a cute magical-girl visual novel or
anime JRPG rather than the current hard-edged face.

## 2. Door-opening spatial continuity

When Ame has the correct key and presses toward a door, she currently vanishes
behind it or appears to teleport into its tile before the burst finishes. The
first interaction should leave Ame visibly on her original tile while the door
opens. Only after that presentation may continued movement carry her into the
now-open tile. The door effect and sound should be longer and more elaborate.

## 3. Combat Power-gain number

The glowing `+N` result after combat disappears too quickly. It should remain
longer and count visibly from zero to the exact gained amount.

## 4. Rainbow Power Parade topology

The v0.19.0 version feels like a boring snaking corridor. It should use
interesting rooms, spokes and diverging paths rather than one long path.

## 5. Power above 99

Above Power 99, Ame's aura and number should become brighter and more intense,
cycle across a rainbow spectrum, and pulse. The number must scale around its
centre instead of drifting right. Aura intensity and animation speed should
increase meaningfully as Power continues to rise beyond 99.

## 6. Long-corridor variety

Large mazes should not make the player wind through empty corridors for ages.
Open rooms, enemies, Science, rewards or other interesting discoveries should
regularly break the traversal rhythm.

## 7. Camera and movement feel

Movement in v0.19.0 looks jerky and stuttery across D-pad, touch, UI buttons and
keyboard input. Tauri desktop feels somewhat easier to control, but still looks
bad. Comparison with older builds strongly implicates the tile-snapping camera:
movement feels acceptable when the camera moves less, uses a larger field of
view, or shows the whole maze. Research and compare solutions rather than
assuming whether only the camera, both camera and player interpolation, or the
field of view should change. The desired outcome is smooth, responsive movement
through straight paths and frequent turns without changing the puzzle rules by
accident.

## 8. iPad touch and hybrid virtual joystick

The visible drag origin suggests an anchored joystick, but steering is actually
recomputed relative to Ame. A touch that begins far from Ame can therefore
require dragging across most of the board and across Ame to turn. Drag steering
must be relative to the initial touch anchor. A simple tap should still move one
tile in the tapped direction relative to Ame.

Replace the four separate on-screen direction buttons with a pleasant rounded
square control surface showing arrows at its four sides. Tapping a side moves
once; dragging within or around that naturally placed thumb surface behaves as
the same anchored virtual joystick. Board-origin touch steering should remain
available too.

## 9. Too-strong enemy teaching

Amelia understood that her smaller Power could not beat the larger number, but
did not infer how to grow. The first explanation should include a weaker enemy
from that level with “Fight weaker monsters” and a Power Potion with “Find a
power potion”, while preserving the exact Power comparison.

## 10. Reaching the exit with friends remaining

Touching the star should never accidentally force the player to leave friends
behind or restart the whole maze to recover them. The completion choice should
offer **Stay here**, **Next maze**, and **Restart**. If friends remain, **Stay
here** is the default; if every friend is rescued, **Next maze** is the default.
Staying resumes the current maze at the star. Once the Friend Garden exists,
the completion screen should also offer **Take a break** to visit it.

## 11. More battles

Amelia loves battles. Add more encounters, including low-Power enemies and
optional combat rooms, without making combat grind replace puzzle reasoning.

## 12. More varied, smaller, maze-adjacent puzzles

Rose Heart Roundabout is a particularly successful breath of fresh air. Mix
more relaxing, simple, strange and reasoning-led rooms among traditional mazes.
Large-maze fatigue is real: dimensions above 16×16 should be rare and such maps
should always contain meaningful rooms. Both authored and generated content
should vary difficulty, topology, pace and puzzle grammar rather than becoming
a procession of increasingly large mazes.

## 13. Portal motif clutter

Remove the little white emoji/glyph drawn over portals. The colour coding and
rendered sprite motifs already communicate the pairing; the extra white symbol
feels redundant. Pair identity must remain accessible without relying on colour
alone.

## 14. Spikes and ice traversal mechanics

Add transparent floor spikes that work over every floor family and require
special **Hard Work Boots**. Add ice that requires **Ice Skates**. Entering an
ice patch should slide Ame forward across the whole run rather than allow normal
walking, with a playful spin for Ame and her following friends during travel.

## 15. Richer material, obstacle, key and door effects

Improve glow, texture-light response and VFX across obstacles, doors and keys.
Water should feel rippling and wet, lava should sell heat, poison should bubble,
ice should sparkle and glint, and spikes should read as sharp, while remaining
within the game's performance budget.

## 16. Rewarded dead ends and quieter minimap

Especially in large mazes, no terminal branch should end in disappointment.
Every otherwise empty dead end should contain at least a Gold Star, Gold bag,
Science pickup, star chest or another small discovery. Clearing that reward
also becomes an intuitive memory that the branch has already been visited.
Optional Gold and Science pickups should not appear on the minimap because they
would obscure its navigational purpose.

## 17. Story and lore inspiration expansion

The existing world and story are good, but could connect more strongly to
Amelia's tastes. Inspiration inputs are Numberjacks, Peppa Pig, Paw Patrol,
Final Fantasy, Ragnarök Online (New World, Idle Poring and Mobile Eternal Love),
Trails in the Sky/Kiseki, Chillin' in Another World with Level 2 Super Cheat
Powers, I've Been Killing Slimes for 300 Years and Maxed Out My Level, Pokémon,
Fantasy Life, and Gurumin: A Monstrous Adventure. Only original high-level
principles, emotional beats and structural lessons may be carried forward;
characters, terminology, plots, compositions and signature designs must not be
copied.

## 18. Anime-style emotion flourishes and expressive HUD portrait

Use small, original anime/JRPG-style visual symbols to make character feelings
immediately readable: rising/cycling sweat drops for panic, a single descending
drop for an awkward or disappointed beat, an anger-mark shape for annoyance,
and similarly appropriate joy or surprise flourishes. Render them in Maze so
Puzzle's own clean, chunky style, potentially with a charming cut-out sticker
aesthetic rather than using raw emoji or copying another game's marks.

Make Ame's top-right HUD portrait larger so her expression can change clearly.
The portrait and surrounding symbols should react to meaningful events—for
example, happiness after a battle victory and worry, sadness or annoyance when
she lacks an item needed to proceed. Reactions should make Ame feel expressive
without blaming or distressing the player.

## 19. Obvious, delightful mechanic-introduction levels

Add more intentionally tutorial-like levels for first-time players of all ages
and skill levels. A key-and-door introduction could use a short, attractive
corridor containing a door, friend and exit, with one clearly visible single-
tile offshoot holding the required key. Bumping the door then seeing the key
picture and nearby answer should create an immediate “I understand!” moment.

Use similarly simple but still thoughtful teaching layouts before genuinely new
rules such as paired flower portals or other unusual traversal mechanics. Avoid
redundant lessons for every equivalent boot/hazard variant when the shared idea
is already obvious. Amelia no longer needs this extra scaffolding, but release
onboarding should work for new children, adults and players with little game
experience.
