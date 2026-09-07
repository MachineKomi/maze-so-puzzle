# LOOT-03 B — authored mixed chests and disguised Mimics

September7,2026. In progress on `codex/chest-mimic-rewards`; Astra is the runtime
writer and Sol independently reviews. Web0.22.21 remains published. This is a
bounded implementation of the [parent sequence](LOOT-03-physical-collection-and-progression.md)
and [Plan09](09-campaign-expansion-24-mazes-plan.md), not the 24-maze expansion.

## Player result and scope

The four existing authored eight-Gold chests become guaranteed-good mixed
chests. First contact opens the matching approved chest, holds its open state
for a readable beat, then releases physical Gold and Science. Every ordinary
chest retains at least eight Gold: Gold8–10 plus Science2–4. Opening never hurts
Ame and needs no weapon.

Twilight's existing Power6 Candy at the same location becomes a matching closed
Candy chest with guaranteed Mimic outcome. First contact reveals its identity
and Power, stays on Ame's origin square, and requires a fresh press to fight.
Underpowered Ame can leave and return. Equal Power wins; the existing combat
presentation knocks out Power per hit. Final defeat alone creates premium
Gold/Science. New table2 minima exceed the named ordinary mixed-chest maxima
and same-band enemy rewards, excluding Power from the currency comparison.

No generated placement changes: generated revision2 retains its rules5 identity,
ordinary visible Candy and exact seed recipes. Generated Mimics require Plan09's
separate versioned generator tranche. No Classic guardian Book page is added:
Book stays12 and Candy's stable page is discovered only on actual reveal or
historical ordinary-enemy exposure. Classic revealed/Candy good-open stay dormant
until an obtainable production placement exists. No XP or egg awards here.

## Durable rules and compatibility

- Explicit chest object owns stable ID, family, chance0–100, fixed positive
  Power and reward table2. Invalid policies fail validation rather than clamp.
- First contact commits one deterministic receipt; transitions are closed to
  good-open, or closed to revealed to defeated. Never reroll on frame, repeat,
  Home, blur or reload. Family/policy/content and run identity bind validation.
- Two reserved source channels per unopened/revealed chest share the existing
  ledger capacity64 with authored treasure/enemies. Source IDs are namespaced;
  credited plus pending exactly equals each committed amount. No retro awards.
- Schema6 retains the authoritative active-run-v5 storage key, so old builds
  protect the future schema. Valid v5 runs restore exact historical curated
  object graphs and rules5 fingerprints, including old chest/Candy IDs and
  pending/credited rewards. New attempts use the upgraded authored definitions.
  Existing rules5 enemy reward randomness stays pinned to5.
- Solver progression keys include receipt phases. Prove ordinary and all-rescue
  routes, all-chest return routes, underpowered safe return and equality.
  Probabilistic fixtures enumerate all allowed joint outcomes; production uses
  fixed policies in this slice. Never require a Mimic's own reward to beat it.

## Qualification and release

Unit/save tests must exercise replay, forged receipts, rewards/capacity,
historical in-flight runs, denied storage writes and future/malformed protection.
Browser proof covers good opening, reveal, too-strong return, final defeat,
held/rapid input, reload/interruption and normal/Lite/Static/reduced presentation.
Inspect actual screenshots at phone/tablet/desktop sizes. Compare faithful v21
camera and encounter costs separately from traced diagnostics; disclose retained
hitches and do not claim Apple/3GB qualification from this laptop.

Only a tested, independently reviewed candidate may get its version bump and
normal Git/Vercel publication. Preserve the deployment guard. Log unique QA
packets in the artifact ledger; use one reusable dist and the four-file v21
entry snapshot sharing unchanged media. No repository/media clones, deletion,
archiving or native packaging.

## Preserved feedback and continuation

[Feedback reconciliation](../reviews/2026-09-07-playtest-feedback-reconciliation-v21.md)
keeps HOLE-02 connected trench art, icon-led Chill/Walk/Zippy and
HAZARD-CONTACT-01 open without reopening shipped Book/hazard/jump fixes.
ART-REWARD-01 still requires proper replacement reward sprites. After this
slice: recognition-only rainbow account XP, usable protected inventory before
eggs, DELIGHT/LEARN and the preserved campaign/Garden/co-op roadmap. Q08/P19
physical-device camera and PERF-COLD-POWER remain open independently.
