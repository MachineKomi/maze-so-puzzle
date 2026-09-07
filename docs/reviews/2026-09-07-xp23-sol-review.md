# LOOT-03C recognition XP independent audit — Sol

Date: 2026-09-07  
Reviewer: Sol (GPT-5.6), independent runtime reviewer  
Audited baseline: `4f34ee78bb65421308b07ef7f16af28c91be1ec4` / live web0.22.22  
XP checkpoint reviewed: `581ee002d351dd984f05a8b4c171b6ba36c05a6a`
Combined XP/SCENE-23 freeze reviewed: `42523f740ac97d0fe64ace603593ec18f12c8c0b`
Browser-wrapper revision reviewed: `585f76bc8fc8d4d85ecc3b5e7b13da75383aeab9`
Power-size correction reviewed: working tree atop `585f76bc8fc8d4d85ecc3b5e7b13da75383aeab9`
Status: provisional source and visual review; final source-matched browser and paired-performance disposition pending

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

The crystal can be a small original faceted PNG with a distinct grayscale silhouette. Full mode may use a restrained grouped flight and one level-up accent. Lite, Reduced and Static must communicate the same award with fewer or immediate representations, without delaying input or repeating a loud sound. No per-XP particle population is justified.

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

## Provisional source and evidence review

The XP implementation at `581ee002d351dd984f05a8b4c171b6ba36c05a6a` follows the bounded design above. `ADVENTURE_XP_RULES` is separate from the unchanged puzzle gameplay revision. The run stores one `xpCollected` total and a ledger3 `xp` channel; the profile stores one bounded `adventureXp` total and derives level and threshold. Gold and Science keep their established deterministic amount functions. The authored supply audit reports 160 solve-only XP and 370 XP with every curated physical crystal collected, corresponding to levels 5 and 8, while its sampled generated mazes remain at or below 22 potential channels. These figures bound this campaign and sample set; they do not establish level 99 as a content target.

Profile schema7 migrates to schema8 with zero XP and keeps the established storage key. Active-run schema6 migrates to schema7 with zero collected XP, channel-specific retirement for already resolved enemies and chests, and unresolved origins still eligible. The ledger validator binds source kind, object ID, deterministic amount, legal landing, credited-plus-pending conservation and run ID. Its saturated legacy compaction settles already accepted claims, then preserves grounded currency in one existing legal drop per source instead of banking it.

I found one material defect in the frozen XP checkpoint: `sanitizeGameState` supplied an empty chest list for every prior run, including schema6, so a valid v0.22.22 revealed, benign-open or defeated-Mimic receipt could not survive migration. The combined freeze changes that condition to discard chest state only before schema6, and the added all-phase migration cases are the correct regression boundary. I also found that restart copy mentioned unbanked XP only while some floor loot remained. The combined freeze now warns when either floor loot or `game.xpCollected` is nonzero.

I initially suspected that an accepted claim could be settled after the completion preview had been frozen. The actual engine path disproves that: the winning move returns `finishLootClaims(nextState)` before App builds the preview, and Continue journals that same settled run. The new goal-entry regression should remain because it protects this useful invariant, but no redundant App settlement is needed. Grounded drops remain excluded as intended.

The completion transaction remains sound: current won run first, receipt-bound profile second, run clear and navigation last. A denied current-run or ordinary profile write stops. A clear failure leaves a won journal whose `completion:${runId}` receipt makes retry idempotent. Tester completion projects no gain; an unsupported future profile is labelled temporary and remains protected.

The pilot Book and completion images at `C:/GameDev/maze-game-qa/performance/xp23-browser-pilot/adventure-xp` make the saved level, exact `Ready to save +12`, `Collected 2` and `Maze solved +10` distinction readable at 844×390 and 1080×810. They also show the same static information in Lite, Reduced and Static. This eight-case packet predates the tiny fallback/source-sum/version cleanup and is supporting evidence rather than final source qualification.

I independently inspected the generated 1254×1254 RGBA source and the 128×128 derivative. The record hashes match the files: source `77cb5f5d504b1754c148ed28e34036c1b6521d63a8ded07c41c19fd79dd501f5`; derivative `d1b2a5dbb8dac34682c71ff082850fb5333462defcbb4513e4081175fcd62f1f`. The derivative has transparent corners and a nonzero alpha box `(38, 7)–(89, 121)`, matching its recorded 51×114 visible geometry. I made a derivative-only light/dark and grayscale board at `C:/GameDev/maze-game-qa/performance/xp23-source/sol-xp-crystal-tiny-grayscale.png`, 768×640, 34,617 bytes, SHA-256 `4ba302a1277e0638e2e9c5d9154688110192942e66c291f8f417ceeac7c6d2`. Its long pointed silhouette and bright value remain identifiable at 12–16 pixels, but the facets do not; at 8 pixels it is only a bright colored or grayscale mark. Final mounted floor proof therefore needs to record the actual physical visible width and height, rather than only the 0.28-tile canvas box, on both light and dark terrain. This is an engineering legibility limit, not Human art approval.

The later source-mounted proofs at `C:/GameDev/maze-game-qa/performance/xp23-final-browser/adventure-xp` close that narrow floor-size question for the tested 844×390 Chromium layout. Both Lanternlight and Twilight draw the 19.7539 CSS-pixel crystal canvas at full alpha; applying the frozen 51×114/128 source geometry gives a 7.8707×17.5933 CSS-pixel visible extent. I independently viewed both screenshots. The crystal remains a narrow, bright, pointed mark against the light stone and dark purple terrain, while its internal facets are secondary at this size. The instrumentation combines the mounted draw transform with the frozen source alpha geometry; it does not sample rendered pixel alpha, so this is source-geometry/draw-size plus visual evidence rather than a direct pixel-alpha measurement.

## Combined SCENE-23 source review

The combined freeze moves grounded objects, followers, Ame, battle actors, chest reveals and rescue actors into one bounded actor plane. Static objects use row depth; moving Ame and followers update the same depth value from the existing travel clock. Equal contacts rank objects, friends and Ame in that order. The plane stays below the foreground wall pass, while airborne Ame is at z27 above the wall pass at z26, the ground shadow stays at z25, and the independent Power label stays at z60. This is a coherent implementation of the requested ground ordering without changing collision or wall geometry.

The reviewed pilot images show materially taller doors, the same 92.6094 CSS-pixel Star Sword canvas before and after pickup, no visible jump-boots art, and Ame above foreground walls at controlled departure, apex and landing. The separate label remains visible above walls. The 780 and 1080 door images are persuasive direction evidence; the current test records a 1.256-tile visible door height and 1.120-tile width. The first SCENE-23 styling retained a fixed 28px pre-transform ceiling on the Power font, which made the physical phone label too small. The reviewed working-tree correction uses an exact 34% of tile font with a 1.6% of tile stroke. Its new bounding-box height/tile ratio is the correct post-stage-scale contract. Because an element bounding box does not include painted stroke or shadow overflow, final qualification still needs the promised physical edge screenshots or pixel margin, plus a distinct-row crossing in both vertical directions, portal and battle replacement motion through a camera rebase, top and bottom edge weapon clipping, and the final four-handle jump clock. The source correctly caches four jump-related CSS animation handles—three actor/ground handles plus one label handle—and should not be described as a three-handle total.

I see no further source-level blocker in the `42523f740ac97d0fe64ace603593ec18f12c8c0b` logic plus the reviewed `585f76bc8fc8d4d85ecc3b5e7b13da75383aeab9` wrappers and current Power-size correction. That is not a promotion recommendation yet: the 18-case scene packet predates the final migration/copy changes, the current 122-case browser run is still in progress, and paired frame/work evidence is outstanding. Physical iPhone/iPad behavior, native/WebKit behavior, Human acceptance of the crystal art and the separate replacement-art backlog remain open.
