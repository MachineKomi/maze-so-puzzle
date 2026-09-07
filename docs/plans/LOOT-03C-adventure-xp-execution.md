# LOOT-03 C — Adventure XP

Execution candidate, 2026-09-07. Astra is the sole runtime writer; Sol independently reviews source and mounted proof. Baseline: published v0.22.22; branch `codex/adventure-xp`. This implements the user's rainbow crystals from defeated enemies, separate from puzzle Power.

## Contract

- Ordinary final defeats scatter 2/4/6/10 XP for Power bands 1–3/4–8/9–19/20+. Defeated Mimics scatter twice that amount. No XP at reveal, from benign chests, per-hit Power, rescues, or authored Gold/Science treasure. Gold/Science randomness and Power arithmetic stay unchanged.
- XP is a third physical channel in the existing run ledger, with the same grounded/claiming/credited conservation, legal landings, settling, vacuum range, cancellation and visible admission. Keep the 64 semantic bundle and 24/12 visual limits. Audit maximum source reservations; never silently lose a channel.
- Collected XP stays in the run. Choosing the next maze banks collected XP plus 10 solve XP through the existing completion receipt. Stay/re-win retains the same attempt and does not bank early. Grounded drops left behind are forfeited; restarting abandons unbanked XP. Replays and Surprise mazes earn recognition too. Tester runs earn no persistent XP; unsupported profiles remain temporary.
- Profile schema8 at `maze-so-puzzle-progress-v6`; active-run schema7 at `maze-so-puzzle-active-run-v5`; ledger3. Old profiles start with zero XP: historical collection is not inferable. Preserve discoveries, results, achievements, totals, receipts and settings. Old runs retain Gold/Science value and locations; already-resolved enemies/chests retire only their new XP channel. Accepted claims settle through the existing reducer. Compact grounded bundles only if migration needs reserved capacity, without auto-crediting them.
- Store one bounded XP total, derive Adventure Level. Level1 starts at0; next level costs `20 + 10*(level-1)`. Level threshold is `5*(level-1)*(level+2)`. Level99 at49,490 XP is the recognition cap. No combat modifiers, skill tree, purchases or power gates. Completion awards require a valid receipt ID; repeated receipts award nothing.
- Book shows saved Adventure Level and a labelled progress bar. Completion shows projected XP, collected/solve breakdown and a restrained level-up cue, explicitly pending until moving on. Reduced/Static presentation does not require an animation to communicate progress. No new continuous timers, per-frame DOM reads, or per-particle profile writes.
- One original native-alpha rainbow crystal, broad facets and distinct silhouette, small world scale. Inspect the generated source and actual tiny derivative on light/dark floors. Preserve exact prompt, source, hashes and reproducible resize; do not treat agent qualification as Human art approval.

## Qualification and release

Cover legacy/current/future/denied saves, old won journal replay, Stay/re-win, write/clear failures, duplicate completion, XP conservation and saturation, noncombat solves, ordinary/Mimic source timing, unchanged generated routes/Power, and authored supply. Inspect Book/completion and physical crystals in Standard/Lite/Static/Reduced and fallback. Check retained-surface/idle behavior, byte budgets and paired camera/reward performance against frozen v22 entries with explicit media identity. Obtain actual independent Sol review, exact-HEAD CI, then a single guarded Git deployment and public verification on both origins. Physical Apple acceptance remains queued separately.

Eggs and usable inventory are the next dependent slice; this does not introduce either. Gold/Science/Power final replacement art remains ART-REWARD-01. Preserve current walls, wider roadmap and physical-device questions.
