# LOOT-03C recognition XP independent audit — Sol

Date: 2026-09-07  
Reviewer: Sol (GPT-5.6), independent runtime reviewer  
Audited baseline: `4f34ee78bb65421308b07ef7f16af28c91be1ec4` / live web0.22.22  
Status: pre-implementation design review; no source, visual, browser or performance acceptance

## Required bounded cut

The Human clarified that rainbow XP crystals are physical rewards bashed out of enemies. LOOT-03C should therefore add XP as a third ledger currency while keeping durable Adventure Level as recognition only. It must not modify maze Power, enemy arithmetic, solver routes, content fingerprints, controls or unlock a gameplay advantage.

The proposed source table is coherent: 2/4/6/10 physical XP by fixed enemy Power band, twice that amount for a defeated Mimic, and 10 XP banked by the completion receipt so a noncombat maze still contributes. Enemy and Mimic crystals appear only at final defeat; per-hit Power remains immediate and unchanged. Benign chests and Mimic reveal award no XP. The solve bonus is labelled account credit, not a stranded post-win floor source. Physical XP needs its own rules-version constant and deterministic source channel so adding it cannot change the released Gold/Science rules5 streams.

The proposed level cost `20 + 10 × (level − 1)` and cumulative threshold `5 × (level − 1) × (level + 2)` are arithmetically consistent. Adventure Level should always be derived from stored XP and never persisted as a second authority. A level-99 safety cap requires 49,490 XP and could look like a grind target if exposed as a checklist. Keeping the UI to current/next progress, adding no benefit gate and publishing one-pass campaign totals plus representative replay gains makes that cap acceptable for qualification; it is not itself evidence that level99 is a designed play goal.

## Profile and transaction ownership

The next profile schema should remain at the established `maze-so-puzzle-progress-v6` key. That makes schema7 builds see schema8 as future and refuse writes. Migration must preserve the current campaign access, Gold, Science, records, rescues, discoveries, keepsakes and bounded completion receipts exactly.

Schema7 migration should initialize XP to zero. Earlier releases did not create or collect this currency, so reconstructing XP from old completions would invent physical rewards. Current-schema sanitization needs a declared safe bound, while a genuinely future schema remains byte-protected by the existing read/write guard.

The existing `nextLevel` order is the correct transaction spine:

1. settle the won run and durably write that recovery journal;
2. apply the same `completion:${runId}` receipt to the current profile, including XP;
3. durably write the profile;
4. clear the active run and navigate.

An active-run write failure or ordinary profile write failure must stop the transition. A successful profile write followed by run-clear failure is safe only because the same completion receipt makes a retry a no-op. Production XP banking should require a valid completion ID even if older direct callers remain able to calculate legacy Gold rewards without one.

Stay does not bank run XP into the profile. Already collected run XP must remain in the active journal and bank when that run is eventually completed with Continue. Grounded enemy XP left behind is honestly uncollected and must not be silently included. Re-winning after Stay must reuse one completion source and one completion ID. Tester and unsupported-future-profile completions must not show or bank XP.

## Run-ledger boundary

LootLedger v3 may use `xp` as a third currency, but every capacity owner must use the same potential-channel model: treasure 1, enemy 3, unopened chest 3 in the worst case, resolved benign chest 2 and defeated Mimic 3. The receipt-only solve bonus adds no physical source or floor reserve. `authoredLootErrors`, generated validation and saturated migration must prove that represented drops plus unresolved reserves stay within 64. Adding XP must not starve an already conserved Gold/Science source.

Enemy and Mimic XP follows the existing grounded, finite-range collection rules. The 10 solve bonus is computed only inside the completion receipt, so it cannot be stranded after the exit changes the game to `won`. Completion UI may celebrate that banked amount, but it must not add a fake floor source or claim that a particle callback made the profile durable.

Active-run schema7 should migrate schema6 / LootLedger v2 without inventing XP. Old collected run XP is zero. The migration must retire only the XP channel for enemies and Mimics already defeated in the old snapshot; unresolved origins remain eligible. The existing `legacyRetiredEnemyIds` suppresses an entire object and is too coarse for this job because old Gold/Science channels must remain unchanged. Use a channel-specific, sorted retirement identity. Retain the current storage key, exact historical level binding, malformed/future protection and denied-migration-write behavior.

Profile XP is collected run XP plus the fixed solve bonus and banks once through `applyLevelCompletion` and `completion:${runId}`. Particle callbacks update only the run ledger; they never write the profile. Replay runs may earn XP under the proposed policy, but the same run cannot bank twice.

## UI and evidence requirements

The Book should show Adventure Level, total XP and progress to the next exact threshold, with a clear Max state. Completion should distinguish collected enemy/Mimic XP from the guaranteed `Solve +10` and show projected level movement. The reset confirmation must include Adventure XP/Level. Screen-reader text must announce the amount and resulting level without depending on rainbow color.

The crystal can be a small original faceted SVG with a distinct grayscale silhouette. Full mode may use a restrained grouped flight and one level-up accent. Lite, Reduced and Static must communicate the same award with fewer or immediate representations, without delaying input or repeating a loud sound. No per-XP particle population is justified.

I inspected the generated crystal source `exec-e2135ef3-bdaa-40e1-b126-74a39be2c665.png` at full size. Its long pointed silhouette, broad facets and asymmetric highlight distinguish it from the rounded Gold and Science symbols at source scale. This is source review only: native-alpha integrity, the approved derivative chain, tiny world rendering on light/dark terrain, fallback behavior and grayscale separation remain unverified until the frozen evidence packet exists.

Qualification should retain at least these cases:

- schema7→8 exact migration and backfill, denied migration write, malformed/current policy, and future-schema protection;
- schema6 active-run migration with no invented XP, plus malformed/future run protection;
- final enemy defeat across all Power bands, per-hit/no-sword/too-strong non-awards, Mimic reveal versus final defeat, benign chest non-award, ordinary completion and replay;
- unchanged Gold/Science deterministic outputs when the XP channel is added;
- old defeated enemy/Mimic XP retirement with an unresolved old-run origin still eligible;
- potential-channel capacity and saturated migration in Full and Lite representation limits;
- tester and unsupported-profile completion with no XP;
- Stay, re-win, pending-exit reload, active-run write failure, profile write failure and clear failure with exactly one receipt and award;
- hidden/interrupted celebration plus Full, Lite, Reduced and Static settlement;
- Book/completion/reset copy, narrow phone and enlarged-reader geometry, grayscale and accessible-name checks;
- unchanged campaign solver results, Power arithmetic and gameplay fingerprints;
- bounded browser/resource/performance comparisons against web0.22.22.

Eggs, generated Mimics, cold cosmetic Power diagnosis, affected physical Apple acceptance and broader RPG systems remain outside this slice.
