# Plan09-P0 — current obtainable roster and recipe audit

Prepared by Astra on 2026-09-06 for BOOK-02A. Source checkpoint:
`0c951e68624782cce7bbb09144fd6704f2e7cb60`, branch
`codex/migration-wall04ar1-20260906`, root `C:/GameDev/maze-game`.
The working tree was clean at entry. The inspected roster/gameplay source files
had no working-tree diff when the inventory was reconciled.

Read [Plan09](../plans/09-campaign-expansion-24-mazes-plan.md) and
[BOOK-02A](../plans/BOOK-02A-silhouettes-and-discovery.md) completely. This is a
source/evidence audit: no runtime changes, solver execution, generator runs,
tests, builds, device play, commit or deployment. Tables below are static
placement inventories, not freshly replayed routes or a claim of family success.
Root and actual Sol still review the consuming Book contract/code independently;
this document does not manufacture their agreement or close full Plan09.

## Recommended Book roster

Use **32 eligible friend identities and 12 eligible guardian identities** for
the current Book. Every identity below has a fixed authored placement in the
sixteen-maze campaign; both complete sets also enter the current generator pools.
No identity needs random-only access to justify this denominator.

Freeze these stable-ID sets as the reviewed current roster, with a named revision
in the Book contract. At this SHA they equal `ANIMAL_SPECIES` and `ENEMY_STYLE_IDS`,
but future enum/catalogue growth must not silently grow the Book denominator.
Use `X = |legitimate encountered IDs ∩ eligible IDs|`, `Y = |eligible IDs|`.
Y describes the obtainable release roster, not the chapters a particular profile
has already unlocked. Preserve safe historical/future IDs in storage without
counting unadmitted identities. Repeated encounters/rescues do not increase X.
Garden ownership and new all-met awards remain their separately owned contracts.

Authority chain: [typed identities](../../src/game/types.ts#L25),
[actual campaign objects](../../src/game/levels.ts#L1152),
[stable campaign order](../../src/campaign.ts#L1), and
[generated selectors](../../src/game/generator.ts#L172). Art/lore resolve these
identities; they do not establish obtainability on their own.

## Friends: complete current identity set

Each row names one fixed authored rescue, using zero-based `x,y` coordinates.
Additional placements of the same species remain one Book identity. The parser
applies `animalSpeciesByCoordinate` after recognizing an animal token, rejects
overrides on non-animal coordinates, and creates semantic object IDs; do not
infer species from the original ASCII character when an override exists
([parser](../../src/game/levels.ts#L276)). All 32 rows also have generated
admission through the shared selection rule described below.

| Stable friend ID | Current name | Fixed authored access: current chapter / level / coordinate |
| --- | --- | --- |
| `bunny` | Bunny | 3 / [splashy-boots](../../src/game/levels.ts#L443) / `10,1` |
| `fox` | Fox | 2 / [shiny-sword](../../src/game/levels.ts#L414) / `7,5` |
| `kitten` | Kitten | 3 / [splashy-boots](../../src/game/levels.ts#L443) / `11,1` |
| `puppy` | Puppy | 3 / [splashy-boots](../../src/game/levels.ts#L443) / `11,11` |
| `duckling` | Duckling | 4 / [rainbow-picnic](../../src/game/levels.ts#L508) / `9,9` |
| `hedgehog` | Hedgehog | 4 / [rainbow-picnic](../../src/game/levels.ts#L508) / `7,13` |
| `fawn` | Fawn | 4 / [rainbow-picnic](../../src/game/levels.ts#L508) / `13,13` |
| `red-panda` | Red Panda | 5 / [toasty-toes](../../src/game/levels.ts#L475) / `3,7` |
| `otter` | Otter | 5 / [toasty-toes](../../src/game/levels.ts#L475) / `3,8` |
| `lamb` | Lamb | 5 / [toasty-toes](../../src/game/levels.ts#L475) / `1,11` |
| `capybara` | Capybara | 6 / [moonbeam-moat](../../src/game/levels.ts#L543) / `1,1` |
| `chinchilla` | Chinchilla | 6 / [moonbeam-moat](../../src/game/levels.ts#L543) / `1,4` |
| `alpaca` | Alpaca | 6 / [moonbeam-moat](../../src/game/levels.ts#L543) / `1,6` |
| `penguin` | Penguin | 7 / [wishing-woods](../../src/game/levels.ts#L577) / `3,9` |
| `koala` | Koala | 11 / [twilight-treasure-loop](../../src/game/levels.ts#L797) / `11,19` |
| `pitter-patter-parasol` | Pitter-Patter Parasol | 7 / [wishing-woods](../../src/game/levels.ts#L577) / `9,7` |
| `lanternling` | Lanternling | 8 / [ames-grand-parade](../../src/game/levels.ts#L626) / `1,1` |
| `emberdown-phoenix` | Emberdown Phoenix | 8 / [ames-grand-parade](../../src/game/levels.ts#L626) / `15,7` |
| `meadowstep-faunling` | Meadowstep Faunling | 8 / [ames-grand-parade](../../src/game/levels.ts#L626) / `5,11` |
| `minerva-moon-owl` | Minerva Moon Owl | 9 / [springstep-sky-hollow](../../src/game/levels.ts#L678) / `10,4` |
| `tessera-dolphin` | Tessera Dolphin | 9 / [springstep-sky-hollow](../../src/game/levels.ts#L678) / `1,11` |
| `mallowmusk-aroma-wisp` | Mallowmusk Aroma Wisp | 9 / [springstep-sky-hollow](../../src/game/levels.ts#L678) / `7,17` |
| `breezeling-sylph` | Breezeling Sylph | 10 / [lanternlight-labyrinth](../../src/game/levels.ts#L724) / `6,4` |
| `griffin-cub` | Griffin Cub | 10 / [lanternlight-labyrinth](../../src/game/levels.ts#L724) / `9,4` |
| `emberbelly-dragonling` | Emberbelly Dragonling | 10 / [lanternlight-labyrinth](../../src/game/levels.ts#L724) / `11,4` |
| `cloudstep-pegasus` | Cloudstep Pegasus | 11 / [twilight-treasure-loop](../../src/game/levels.ts#L797) / `13,1` |
| `three-tumble-cerberus` | Three-Tumble Cerberus | 11 / [twilight-treasure-loop](../../src/game/levels.ts#L797) / `5,17` |
| `riddlekit-sphinx` | Riddlekit Sphinx | 11 / [twilight-treasure-loop](../../src/game/levels.ts#L797) / `1,19` |
| `tidecurl-hippocamp` | Tidecurl Hippocamp | 12 / [moonlit-friendship-quest](../../src/game/levels.ts#L856) / `3,5` |
| `ripplecap-kappa` | Ripplecap Kappa | 12 / [moonlit-friendship-quest](../../src/game/levels.ts#L856) / `11,9` |
| `rainbow-horn-unicorn` | Rainbow-Horn Unicorn | 1 / [little-star-trail](../../src/game/levels.ts#L391) / `2,4` |
| `green-tea-skeleton` | Tea-Time Skeleton | 2 / [shiny-sword](../../src/game/levels.ts#L414) / `3,5` |

The 16-level rescue-count sequence is `1,2,3,3,3,3,3,3,3,3,4,5,3,4,5,5`:
53 authored cages, 32 distinct species. Counts of placements and rescues are not
Book Y. All species have appeared by current Chapter12; later chapters reuse
identities. Preserve the explicitly requested opening Unicorn/Skeleton placements.
The current [art map](../../src/artCatalog.ts#L642) and
[short lore](../../src/bookLore.ts#L4) cover this same stable set.

## Guardians: complete current identity set

These are real `EnemyObject` placements, including Power-specific and named-token
overrides, not just each level's default `enemyStyle` property. That distinction
matters: Little Star Trail declares `enemyStyle: goblin` but contains no enemy.
Unused entries in `enemyStylesByPower` likewise do not count as placements.

| Stable guardian ID | Current name | Fixed authored access: current chapter / level / coordinate / Power |
| --- | --- | --- |
| `goblin` | Garden Goblin | 2 / [shiny-sword](../../src/game/levels.ts#L414) / `6,1` / 1 |
| `blueberry-slime` | Blueberry Slime | 3 / [splashy-boots](../../src/game/levels.ts#L443) / `3,8` / 3 |
| `mushroom-imp` | Mushroom Imp | 5 / [toasty-toes](../../src/game/levels.ts#L475) / `11,6` / 3 |
| `moon-bat` | Moon Bat | 6 / [moonbeam-moat](../../src/game/levels.ts#L543) / `9,5` / 3 |
| `pebble-golem` | Pebble Golem | 4 / [rainbow-picnic](../../src/game/levels.ts#L508) / `1,12` / 4 |
| `acorn-knight` | Acorn Knight | 10 / [lanternlight-labyrinth](../../src/game/levels.ts#L724) / `11,11` / 4 |
| `bubble-dragon` | Bubble Dragon | 12 / [moonlit-friendship-quest](../../src/game/levels.ts#L856) / `15,9` / 8 |
| `candy-mimic` | Candy Mimic | 11 / [twilight-treasure-loop](../../src/game/levels.ts#L797) / `17,9` / 6 |
| `cloud-gremlin` | Cloud Gremlin | 15 / [friendship-crown-vault](../../src/game/levels.ts#L1027) / `1,5` / 2 |
| `pumpkin-sprite` | Pumpkin Sprite | 15 / [friendship-crown-vault](../../src/game/levels.ts#L1027) / `15,12` / 4 |
| `clockwork-crab` | Clockwork Crab | 11 / [twilight-treasure-loop](../../src/game/levels.ts#L797) / `5,10` / 4 |
| `jelly-sorcerer` | Jelly Sorcerer | 12 / [moonlit-friendship-quest](../../src/game/levels.ts#L856) / `5,9` / 2 |

Seeing a legitimately visible guardian is sufficient for Book discovery; defeating
every guardian is not an ordinary-completion requirement. The authored coverage
assertion currently compares the actual object-style set with all 12 type IDs
([coverage test source](../../src/game/levels.test.ts#L341)). It is useful existing
evidence, not a new per-guardian engine witness run performed by this audit.

## Generated access and exclusions

`selectGeneratedVisuals` shuffles the complete `ANIMAL_SPECIES` list with a
dedicated deterministic stream and takes three distinct species. Those selected
species are assigned to three real animal objects; there is no campaign-debut
or rescue prerequisite in that selection. All 32 friends are generated-admitted
([selection](../../src/game/generator.ts#L172),
[placement](../../src/game/generator.ts#L997)).

The same selector chooses one style from the complete `ENEMY_STYLE_IDS` list.
Every required, room and bonus enemy uses that one style. Thus all 12 guardians
are generated-admitted in the normal `gentle`, `growing` and `adventure` paths;
`movement` contains no guardian and its unused style draw proves no encounter.
The production UI currently selects `gentle` or higher from progress
([recipe](../../src/game/generator.ts#L456),
[placements](../../src/game/generator.ts#L904),
[UI settings](../../src/App.tsx#L572)). This is pool/admission evidence, not a
claim that every identity was freshly observed in a finite generated cohort.

Exclude these 13 `FUTURE_ENEMY_ART` IDs from both current Book Y and X:
`classic-slime`, `succubus`, `kappa`, `cyclops`, `lamia`, `soda-slime`, `minotaur`,
`lizard-swordsman`, `lizard-spearman`, `t-rex`, `orc-chieftain`, `warrior-skeleton`,
`cultist`. They are dormant art entries, absent from current `EnemyStyle`,
authored objects and generated pools; Plan09 owns admission and pending public
names ([catalogue](../../src/artCatalog.ts#L851)). Also exclude `classic-mimic`
and its three art-state IDs: no disguised gameplay object is admitted today.
Do not count source masters, presentation derivatives, tester fixtures, story
portraits, proposed PT41 species or Plan10 Courier/Garden content.

### Aliases, defaults and dormant-state traps

- `FUTURE_FRIEND_ART` is a compatibility export of active `ADDITIONAL_FRIEND_ART`,
  not a separate dormant roster. Its 17 species are already among the 32 and have
  authored rescues. The comment saying Plan09 owns their authored ecology must
  not be read as evidence that these placements are missing
  ([exports](../../src/artCatalog.ts#L824)).
- `green-tea-skeleton` is the friend whose current label is **Tea-Time Skeleton**.
  It is not dormant `warrior-skeleton`. `ripplecap-kappa` is likewise distinct
  from dormant enemy `kappa`; names/family resemblance do not merge identities.
- Current `candy-mimic` is one ordinary visible enemy style. Its active revealed
  art is shared by `MIMIC_ART["candy-mimic"].revealed`; that is not a second Book
  identity. Candy's closed/good-open states and all Classic/Treasure Mimic states
  remain dormant ([state-family map](../../src/artCatalog.ts#L885)).
- `MIMIC_FAMILY_IDS`, `resolveMimic` and fixed v1 65/35 reward helpers exist in
  [rewardRules.ts](../../src/game/rewardRules.ts#L1), with test consumers. No
  production caller, disguised `LevelObject` or reveal-state engine integration
  currently consumes `resolveMimic`. Neither enum nor passing helper tests prove
  that a disguised encounter can be met. Preserve old v1 evidence; future Plan09
  policies and Candy migration remain unfinished.
- The view selector and direct defeat mapping use `style ?? "goblin"` for an
  omitted historical style. Art resolution also falls back to Goblin, or Bunny
  for unknown friend art, but fallback pixels never establish a new identity.
  There is no current guardian alias-normalization table; do not invent aliases
  from filenames or map arbitrary unknown stored IDs to Goblin
  ([discovery](../../src/game/discovery.ts#L10),
  [art fallback](../../src/artCatalog.ts#L1007)).

## Book encounter and persistence handoff

The current Book Friends page exposes all 32 cards and counts completed rescues;
it has no friend-encounter field. Bestiary already counts a unique intersection
with the 12 styles. `PlayerProgress` is schema6 with `discoveredEnemyIds`;
`rescuesBySpecies` and documented best/historical rescued-species records are
available as species-specific evidence. Aggregate totals or completion alone
must not invent encounters ([Book](../../src/ui/screens/AdventureBook.tsx#L31),
[progress fields](../../src/progress.ts#L200)).

For BOOK-02A, mirror the accepted six-tile gameplay-view authority for a caged
friend encounter and persist it before rescue/completion. A real rescue also
proves encounter. Current exposure uses `getVisibleTileKeys`, not the padded
renderer gutter, entire map or image loading. App gates enemy discovery on the
game screen, no modal, a visible document, normal mode and an active run; it
also recognizes explicit defeated-object IDs in the current run. Preserve those
boundaries and test resumed-state evidence deliberately rather than treating all
catalogued/current-map objects as history
([view](../../src/game/discovery.ts#L1), [wiring](../../src/App.tsx#L927)).

The enemy discovery writer deduplicates and preserves bounded safe unknown IDs
without awarding rewards. BOOK-02A needs the corresponding friend encounter
contract under the same progress/reset owner, including conservative future
schema and storage-failure behavior. No identity can become known by mounting
the Book, opening lore, preloading art or visiting tester content. The requested
silhouette shape is intentionally visible; unknown names/lore remain hidden
([writer](../../src/progress.ts#L426),
[existing persistence test source](../../src/progressDiscovery.test.ts#L42)).

## Reachability evidence: what exists and what this audit did not prove

| Existing evidence/source | Meaning and limit |
| --- | --- |
| [levels.test.ts:227](../../src/game/levels.test.ts#L227) and [659](../../src/game/levels.test.ts#L659) | Each authored maze has a zero-rescue ordinary route and exact-all-rescue route asserted through the solver. Combined with the fixed species inventory, this supports complete authored rescue coverage; these tests were read, not rerun. |
| [levels.test.ts:303](../../src/game/levels.test.ts#L303) | Actual authored object sets are asserted to cover current enemy and friend types. It does not by itself show a screenshot or individual discovery event for every guardian. |
| [generator.ts:1163](../../src/game/generator.ts#L1163) | A produced maze returns only after zero-rescue ordinary and all-animal validation, with at most 50 construction attempts. This is the production acceptance algorithm, not evidence that this audit generated anything. |
| [generator.test.ts:179](../../src/game/generator.test.ts#L179) and [262](../../src/game/generator.test.ts#L262) | Existing cohort tests cover ordinary/perfect validity and varied art/species. Variety assertions require more than one enemy style and more than three species, not a complete 12/32 appearance horizon. |
| [hints/reachability](../../src/game/reachability.ts#L131) | Required Path invokes the engine-backed solver from current state, avoids unresolved animal rescues and uses a bounded search. Existing tests cover each authored start and selected states; no exhaustive new current-state proof is claimed here. |
| [migration handoff](../migrations/2026-09-06-new-laptop-handoff.md#L61) | Records 642 project tests and 72 browser cases from the old-laptop checkpoint. Those are inherited reports, not a fresh run at this SHA, native acceptance, family learning or iPad success. |

BOOK-02A's consuming validation should bind these frozen IDs to actual normal
encounter events and migration behavior. Full Plan09 still owns per-placement
reachability/roster expansion and the final all-met award proof. No new Human
decision is needed simply to recognize the already authored current 32/12 sets.

## First-use and 09-P1 reconciliation

Read actual source placement before assigning an introduction from a chapter
title or historical plan. Current order is sixteen chapters, not Plan09's future
24-slot numbers.

| Current source milestone | Canary implication |
| --- | --- |
| Chapter1 Little Star Trail is 6×6, has an optional Unicorn and one weapon, and no guardian. Chapter2 Shiny Sword has the first actual guardian/key/door. | A movement/optional-choice reference and weapon/comparison first-use reference already exist; do not introduce a second tutorial system. |
| Chapter3 Splashy Boots introduces potion/Power growth and water/Boots; Chapter5 Toasty Toes applies the same Boots to lava. | Compare visible before/gain/after, a plausible safe failed comparison and a useful return; avoid a redundant separate boot-family lesson. |
| Chapter7 Wishing Woods already contains Spring Boots and a single hole; Chapter8 also uses them before Chapter9 Springstep. | Springstep is later landing application/mastery today, not the first Spring appearance. Reconcile both `j`/hole geometry and existing route tests before authoring the teaching matrix. |
| Chapter10 Lanternlight is 23×23 with a room, loot, stronger return guardian and crossroad single-hole crossing. The finale is already a 17×17 growth-and-return layout. | Preserve the praised room relationships. Do not restart from an obsolete winding-finale assumption or shrink a fixed number of maps. |
| Chapter12 introduces Leaf/poison; Chapter13 Rose Heart Roundabout introduces paired portals. | Later combination canaries consume these actual rules and single-hole landing legality; no new rule is implied. |

Source anchors: [movement/first weapon](../../src/game/levels.ts#L391),
[Wishing Woods](../../src/game/levels.ts#L577),
[Lanternlight](../../src/game/levels.ts#L724),
[finale](../../src/game/levels.ts#L1094), and the
[existing route/teaching assertions](../../src/game/levels.test.ts#L61).
The 6×6/12-input Plan09 pocket requirements and child comprehension have not
been newly measured here; metadata alone cannot prove either.

[LEARN-01](../plans/LEARN-01-readable-reasoning-and-help.md) precedes 09-P1.
Arithmetic and four-tier engine-backed hints already exist. Use its final
picture-led comparison/gain/help presentation in one isolated existing-rule
first-use fixture and one Lanternlight-like changed-state return fixture. Record
prediction, visible clue, safe wrong attempt, answer-first route, optional-branch
skip, requested Hint recovery, interruption return and payoff. Ordinary and
exact-perfect fixtures belong to 09-P1's later execution; this P0 authors none.
Keep canonical maps, fingerprints, campaign order, generators and production
saves untouched. Family observation can remain pending while independent work
proceeds, with no claim that a solver success demonstrated learning.

## Surprise recipe: complete current gaps for the production tranche

Current normal launch is `makeSurprise()` with a timestamp-derived seed and
`surpriseSettings(progress)`. The latter uses unlocked-story count plus a small
completed-Surprise adjustment. There is no explicit Easy/Medium/Hard choice,
Surprise-me difficulty policy, learned-rule snapshot or favourite recipe record.
Fresh normal UI selects `gentle`, not the supported `movement` generator profile
([settings](../../src/App.tsx#L572), [launch](../../src/App.tsx#L1921)).

| Recipe requirement | Current source and exact gap |
| --- | --- |
| Original seed | `LevelDefinition.seed` keeps `String(options.seed)` in memory. The hashed seed portion of `surprise-v6-…` is not the original seed. Progress best-result records retain no seed/recipe, so a completed result ID alone cannot reconstruct the layout. |
| Requested size and resolved dimensions | `options.size` is a normalized progression **hint**, used in `maze-size-v2` selection; output width/height record only the selected size. Replaying with `size: oldLevel.width` is not a safe substitute for the original hint and can select another dimension. Preserve both resolved inputs and result. |
| Requested/resolved difficulty and eligibility | Current tier is `movement/gentle/growing/adventure`; it appears in the ID but not a full stored request/eligibility contract. Normal progression can select adventure before the authored Chapter7 Spring introduction, and adventure may require a Spring jump. Full Plan09 must reconcile learned-rule eligibility; this audit changes no generator rule. |
| Topology algorithm/version | ID prefix is literal `surprise-v6`; construction uses internal `maze-v1` and `maze-size-v2` channels and up to 50 attempts. There is no version-selecting reconstruction API or separately selected topology-family identity. Current goldens do not implement historical-version dispatch. |
| Gameplay/content version | `GAMEPLAY_RULES_REVISION = 3`, `GENERATED_CONTENT_REVISION = 2` and the computed gameplay fingerprint exist. Freeze them with a supported algorithm contract; a bare seed does not preserve behavior across source revisions. |
| Friend-content identity | Current shuffle reads the live ordered `ANIMAL_SPECIES` array. Resolved species enter the gameplay fingerprint, but there is no independently pinned friend-roster/selection version. A changed pool can reinterpret a seed even though the comment calls this a visual stream. |
| Enemy/presentation identity | Enemy, weapon, cage and terrain selections read live ordered pools with separate deterministic channel strings. There is no presentation-roster version or archived pool dispatch. Enemy styles, weapon/cage styles, terrain theme and light direction are omitted from the gameplay fingerprint, so that fingerprint alone cannot prove an identical Book-facing cast or visual recipe. |
| Composition/profile identity | Current enemies share one style; current friends are one shuffled trio. Themed/mixed enemy modes, themed friend modes, three named topology families, requested monster/treasure profiles and generated disguised Mimics remain Plan09 work. Do not serialize invented current values for them. |
| Durable recipe/favourite and safe replay UI | No recipe field exists in current progress, no favourite picker/capture action is present, and current Repeat uses the in-memory level. Plan09 §10.5 owns a bounded record under the existing progress/reset owner plus capture/reload/select/replay, compatibility results and active-run replacement safeguards. |
| Mid-run persistence | `createActiveRunSnapshot` explicitly returns null for generated/tester runs. A saved layout recipe would restart its puzzle, not resume position/items/Power. Do not present bounded replay UI as generated-run resume or introduce an independent save store. |

Source anchors: [generator options and size selection](../../src/game/generator.ts#L28),
[selection streams](../../src/game/generator.ts#L172),
[level identity/result](../../src/game/generator.ts#L885),
[fingerprint fields](../../src/game/contentIdentity.ts#L6),
[current golden fixtures](../../src/game/generator.test.ts#L70),
[progress record](../../src/progress.ts#L200),
[active-run exclusion](../../src/session.ts#L474), and
[maze-switch guard](../../src/navigation.ts#L38).

The next consuming step is BOOK-02A's identity/encounter/migration contract and
32/12 silhouette states after root's bounded wall decision. This P0 supplies
source-backed roster inputs; it does not promote R1, defer Book behind final
campaign production, admit dormant enemies, enable new collection awards or
qualify the recipe/replay feature. Rebaseline the cited seams at the assigned
implementation SHA and preserve unrelated runtime work.
