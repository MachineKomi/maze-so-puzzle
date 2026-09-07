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

The current source audit passes747 tests including the preload test.
All four affected campaign mazes have all-rescue/all-chest solutions, with a
maximum113806 admitted states. Twilight's Candy is a **required** encounter,
allowed by Plan09's later designer policy; replay proves sufficient Power before
defeat without its own reward. Its ordinary/perfect routes now take208/214 inputs;
Lanternlight151/208, Moonlit165/170, Rainbow Power Parade63/76. Terrain, positions
and movement-step counts are unchanged; opening adds stationary inputs.

Total repeatable per-campaign authored/encounter supply is Gold154–263 versus
legacy144–244 and Science99–161 versus85–138. The ordinary49-enemy subtotal is
Gold98–196/Science62–114; the separate Candy chest supplies Gold12–15/Science7–9.
These are all-loot extrema, not automatic completion awards or promised spend.

Forward activation is recorded in
[`loot03b-chest-activation.json`](../source-assets/publication/loot03b-chest-activation.json).
Run the activation script with the dedicated locked art environment, then
`scripts/art_pipeline.py --manifest --write` and `--check`. Only three approved
status rows change; all media, v06 approval and historical Plan03 maps remain
unchanged. The active inventory gains165234 encoded bytes/786432 theoretical
RGBA bytes previously dormant, not new download files or measured RAM.

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
