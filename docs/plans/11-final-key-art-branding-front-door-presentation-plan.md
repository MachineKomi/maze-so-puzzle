# Plan 11 — final key art, branding, and front-door presentation

Status: manager-authored implementation plan; execute only after Plan 10 is accepted and closed

Owner: final-branding specialist under root integration/release-manager review

Prepared: 2026-09-03

Planning reconciliation: 2026-09-05. The two-stage title/Home, Human-approved
generated v06 visual wordmark and v0.20.1/post-release art are established inputs.
This review changes future execution requirements, not their approval status or
current runtime pointers.

Primary intake: `PT-20260903-25`, `PT-20260903-26`, `PT-20260904-30`, and
`docs/plans/00-integrated-implementation-roadmap.md`

## 1. Outcome

Finish Maze so Puzzle's front-door presentation against the **actual final
game**, while preserving strong work already completed.

Plan 03 and the accepted corrective checkpoints have delivered an early title
illustration, transparent home/hero splash, exact logo/wordmark, and selected
presentation renditions. The corrected v04 Home hero is the starting cutout;
preserve its pale edges and corrected unicorn horn.
Those are the starting authority and are **retained by default**. Plan 11 first
audits how they read after the 24-maze campaign, Solo experience, optional couch
co-op, Ponchi/Melty, Friend Garden, final UI, animation, VFX, lighting, controls,
and music all exist. It creates, refines, or replaces an asset only when a
specific final-canon, communication, originality, delivery, accessibility,
integration, or performance defect is demonstrated.

There is no regeneration quota. A fully retained Plan-03 set with a documented
final proof is a successful Plan 11 outcome.

## 2. Problem statement

Early key art can be beautiful yet become misleading once a game's cast,
features, tone, and front-door layout are final. Conversely, reflexively
regenerating approved art late in production creates identity drift, rework,
provenance cost, and new integration risk without improving what Amelia sees.

This plan closes that gap through a retain-first, audit-led brand pass. The
finished title/home surface should make the game feel immediately authored,
joyful, magical, readable, and trustworthy on TV, desktop, iPad, and the compact
phone fallback, while remaining unmistakably Maze so Puzzle rather than a copy
of any taste reference or a generic web application.

## 3. Sequence and hard start gate

Plan 11 runs after Plan 10 because only then are the final campaign, Garden,
co-op promise, Courier identities, and shipped character set known. It runs
before Plan 13 backlog/launch-polish closure and the subsequent Plan 12
asset-retirement sweep so residual pointer-producing work closes before any
repository file is retired from one accepted brand authority.

Begin only from a clean, reviewed, committed, and pushed checkpoint after Plan
10. Record the exact starting SHA, product/content versions, active feature
flags, asset-manifest version, and current web/Tauri check results. Do not build
or publish from a shared dirty tree.

Before changing pixels, verify:

- Plans 01–10 and both Plan-07 passes are accepted or have an explicit manager
  disposition;
- the current separate title and Home routes, catalogue, rendition resolver, source-record
  schema, performance budgets, motion/quality modes, and offline packaging
  behavior are real and testable;
- the final 24-maze campaign and Plan-10 feature set are represented by stable
  semantic identities rather than inferred filenames;
- every Plan-03 front-door source, derivative, approval, prompt/process record,
  hash, responsive safe zone, catalogue pointer, and rollback target can be
  reconstructed; and
- full project, art/catalogue, production-build, and desktop checks are green,
  or each pre-existing failure is isolated and accepted before this work starts.

If the current product no longer matches a planning assumption, update this
plan's execution record and follow implemented truth. Do not preserve a stale
snapshot merely because it appears here.

## 4. Read-first authority

Read these sources in full at execution time, resolving moved or superseded
paths through the current architecture documentation:

1. The latest direct Human decisions and approvals.
2. `docs/GAME_VISION_AND_DESIGN_SPEC.md`.
3. `docs/plans/00-integrated-implementation-roadmap.md` and this plan.
4. `docs/PLAYTEST_BACKLOG.md`, especially `PT-20260903-25`,
   `PT-20260903-26`, and `PT-20260904-30`, plus their linked source intake.
5. `docs/ART_BIBLE.md`, `docs/AI_ASSET_PROMPTS.md`, every approved final
   character/enemy/friend model or family sheet, and the Plan-03 source,
   derivative, manifest, review, lifecycle, and rollback records.
6. The final `docs/UI_UX_SPEC.md`, `docs/GAMEPLAY_DESIGN_SPEC.md`,
   `docs/STORY_BIBLE.md`, `docs/VFX_BIBLE.md`, `docs/ANIMATION_SPEC.md`,
   lighting specification, controls specification, performance budgets,
   architecture, project audit, and release checklist, using their final actual
   filenames.
7. Plan 09's final campaign/ecology evidence and Plan 10's accepted product,
   Garden, originality, character, and loading decisions.
8. Current title/home components, routes, semantic headings, responsive styles,
   catalogue/resolver, loading/preload logic, audio context, tests, and packaged
   Tauri behavior.

When two records disagree, direct Human approval and maintained product/art
authority beat an old planning observation. Record the contradiction and its
resolution rather than silently choosing whichever file is convenient.

## 5. Locked decisions

These are requirements, not prompts to reopen settled taste:

- Plan-03 front-door and presentation assets are retained unless the audit
  proves a concrete defect. “Plan 11 exists,” novelty, or a desire to use new
  generation compute is not a defect.
- Preserve the accepted two-stage front door: minimal illustrated title with
  large logo and Play/Exit, followed by
  the Home/menu surface with Continue, navigation/progress and hero art. Do not
  add a third screen solely to display another illustration. Evidence of a
  navigation problem may support a separate Human decision; it does not authorize
  this branding specialist to merge the routes.
- Final key art consumes Plan 09's accepted story-cast disposition and compact
  interlude canon. It must not depict rejected/replaced cast members or invent
  a narrative role merely to justify a candidate composition.
- Title illustration, transparent home/hero splash, exact wordmark, and live
  semantic title remain separable layers with explicit responsive roles.
- The visible name is exactly **Maze so Puzzle**. Human decision v10 approved
  the generated v06 visual wordmark after exact-spelling and delivery checks.
  Preserve that exact approved source, pixels, optical derivatives and provenance;
  do not require re-typesetting or vector reconstruction. Real accessible
  `Maze so Puzzle` text remains spelling/semantic authority. Any future changed
  lettering receives its own character-by-character delivery proof and Human
  approval; plausible generated text alone is not sufficient evidence.
- A logo image never replaces accessible text. Decorative duplicates are hidden
  from assistive technology; each active route keeps exactly one correctly
  structured, localized-ready product-name heading. Inactive routes must not
  remain in the accessible focus or announcement tree.
- The final look follows Maze's approved clean, chunky, cel-painterly magical-
  girl storybook/JRPG grammar, brighter material-local colour-aware contours,
  and sticker-signal-over-magical-surface hierarchy. Taste references communicate
  polish and hierarchy only; no protected logo, panel, composition, character,
  UI skin, or trade dress is copied.
- Ame's approved identity remains blonde-haired, blue-eyed, young,
  age-appropriate, and model-sheet accurate in every appearance.
- Only characters, places, relationships, and capabilities actually approved
  and shipped by this checkpoint may be promised in final front-door art.
- The composition is curated for emotional clarity. It need not, and generally
  should not, contain every playable character, friend, enemy, mechanic, biome,
  or collectible.
- Front-door beauty may not delay the default Solo action, hide optional-mode
  status, change navigation ownership, or eagerly preload the full art roster.

## 6. Ownership and non-goals

### Plan 11 owns

- the final retain/refine/replace decision for the Plan-03 title illustration,
  transparent home/hero splash, exact logo/wordmark, and brand-critical
  presentation renditions;
- final composition, crop, copy-safe, optical-size, and device variants required
  by the implemented separate title and Home surfaces;
- front-door brand consistency with the accepted final cast, campaign, Garden,
  co-op, UI material system, and story tone;
- source/provenance, catalogue, lifecycle, byte/loading, accessibility,
  originality, approval, and rollback evidence for any changed asset;
- final title/home visual integration fixes within the existing Plan-01 layout
  and component contracts; and
- a release-candidate-ready brand handoff to Plan 13, then Plan 12, and the root release
  manager.

### Plan 11 does not own

- redesigning the campaign, co-op rules, Friend Garden, persistence, controls,
  navigation architecture, UI information hierarchy, music system, VFX, or
  animation;
- merging the accepted title and Home routes, or adding a new route to make room
  for art;
- replacing approved character construction, costumes, personalities, names, or
  rendering grammar;
- turning all gameplay sprites into presentation art or filling a perceived
  catalogue quota;
- adding an unapproved Alex/alternative Player-1 character, Courier, friend,
  enemy, location, feature, or release-platform claim;
- copying the layout, logo, composition, or brand signature of a reference
  game; or
- archiving or removing old files. Plan 11 may mark an individually proven file
  superseded in the lifecycle ledger, but Plan 12 owns the two-stage non-runtime
  archive, Human external-backup confirmation, and separately authorized
  repository-removal workflow.

If a discovered problem belongs to one of those systems, file a bounded defect
for the owning plan or Plan 13. Do not conceal it inside new key art.

## 7. User stories

- As Amelia or another child, I want the opening image and logo to feel exciting
  and recognisably connected to the game I am about to play, so I want to begin
  another adventure.
- As a returning Solo player, I want the primary play/continue action to remain
  immediate and legible, so optional features never make the front door
  confusing.
- As a family considering couch co-op, I want the front door to represent that
  mode honestly after it ships, so I understand its warmth without mistaking it
  for the required/default way to play.
- As a TV, desktop, or iPad player, I want the same core composition and brand
  hierarchy to survive my screen shape, so important faces, copy, focus, and
  actions never fight the crop.
- As a compact-phone player, I want a complete, readable fallback, so decorative
  art may crop or simplify without hiding the product name or controls.
- As a player using a screen reader, reduced motion, static quality, high zoom,
  or offline Tauri build, I want the same identity and task path without relying
  on decorative pixels, animation, network fetches, or generated lettering.

## 8. Audit-first asset contract

### 8.1 Asset groups

Audit the exact semantic IDs and implemented consumers; do not invent IDs from
filenames in this plan.

| Group | Intended role | Required final properties |
| --- | --- | --- |
| Title illustration | Opaque atmospheric/key-art layer for the minimal title route | Honest final world and tone; responsive crop and copy-safe zones; no baked UI, logo, generated text, or required semantic instruction |
| Home/hero splash | Transparent foreground hero layer on the separate Home/menu route, above its own approved environment | Clean registered alpha; safe overlap with menu/focus; model-sheet-accurate cast; separable from background and wordmark |
| Logo/wordmark | Exact recognisable “Maze so Puzzle” brand mark | Retained approved v06 visual lettering; source and spelling proof; optical variants; transparent delivery; semantic live heading remains authoritative |
| Presentation renditions | Larger contextual art used by blocker, story, reward, Book, victory, friend/enemy reveal, or other approved Plan-01 slots | Same semantic identity as field/optical art; consumer-specific crop and geometry; no fuzzy upscaling; visible/imminent-only loading; text/optical fallback |

The title illustration and Home hero already have distinct approved route roles.
Audit those consumers; absence from the other route is not grounds to reserve or
retire either. Do not duplicate a character accidentally within a route by
placing the same figure in both its background and transparent hero layers.

### 8.2 Retain/refine/replace test

For each group and each shipped variant, assign one disposition with evidence:

- **Retain:** the existing asset passes final canon, composition, originality,
  accessibility, delivery, integration, and budget checks. No pixel change.
- **Refine:** a bounded defect can be fixed without changing the approved core
  concept, identity, or composition. Name the defect and changed region/variant.
- **Replace:** the asset materially misstates final canon or cannot meet a
  required delivery/integration gate without re-authoring. State why refinement
  is insufficient and preserve the previous authority for rollback.
- **Reserve:** a good approved asset has no honest, non-redundant consumer in the
  current supported surfaces. Keep its source/provenance but do not load it.

A refine/replace decision requires at least one objective finding:

1. final-model or final-story contradiction;
2. depiction of an absent/unapproved feature or failure to communicate the
   product's actual primary identity;
3. unusable responsive crop, copy-safe region, focal hierarchy, alpha,
   registration, seam, or smallest-delivery read;
4. logo spelling/letterform ambiguity or mismatch between wordmark and semantic
   name;
5. inaccessible contrast/meaning, unsafe focus overlap, motion-only message, or
   failure at 200% text spacing/zoom;
6. broken offline/Tauri fallback, excessive encoded/decoded/loading/render cost,
   or title-to-first-play regression;
7. provenance, rights, originality, or reproducibility failure; or
8. visible mismatch with the approved Maze shape, contour, material, palette,
   lighting, and UI-layer grammar.

“Different,” “newer,” “more detailed,” and “shows more characters” are not
objective findings.

### 8.3 Final-canon cast rule

Build a final-canon availability ledger before composing anything:

- Ame appears only through her final approved model and rendition.
- Ponchi and Melty may appear only if Plan 10 shipped both, their originality and
  actual-size model-sheet gates passed, and the chosen composition truthfully
  represents optional couch co-op or the Garden.
- An alternative Player-1 character—currently discussed as **Alex**—may appear
  only if, by Plan 11, that exact character, name, model sheet, runtime role,
  story relationship, and release scope have explicit Human approval and are
  implemented. Otherwise Alex is absent from final art and copy; this plan does
  not create or imply him.
- Friends may be represented by a small emotionally coherent selection. Prefer
  final story/Garden relevance, silhouette variety, and composition rhythm over
  roster completeness.
- Enemies, hazards, portals, and biomes appear only when they support the chosen
  promise and remain secondary to the welcoming child-facing read.

An excellent composition may be Ame alone, Ame with one friend, or a small
ensemble. The audit must explain why its chosen cast is the clearest truthful
promise, not why everyone else was omitted.

## 9. Front-door composition and responsive behavior

Plan 01's implemented layout and semantic action order remain authoritative.
Plan 11 adjusts art framing and brand integration around them rather than moving
controls ad hoc.

Define linked composition maps for the existing title and Home surfaces, each
with its own art/loading roles and action hierarchy:

- focal subject bounds and protected face/body regions;
- exact wordmark box plus the independent semantic heading;
- menu, save/Continue, Solo, optional Duo/Garden, status, legal/version, focus
  halo, and controller-glyph exclusion zones drawn from implemented UI;
- crop anchors, bleed, and minimum retained subject regions for each aspect
  regime;
- foreground/background z-order and contrast scrims tied to the approved
  magical-surface tokens;
- static/reduced-motion behavior for any parallax, glint, entrance, or ambient
  treatment; and
- semantic image alternative/fallback behavior.

The title promises a welcoming maze adventure; Home helps a returning family
choose the next thing to do. Review that promise through the first actual maze:
the approved Ame, friendly guardians, puzzle clarity and warmth should feel like
the same game. A modest crop or reduced ornament earns preference over a new
illustration when it solves the observed issue. Optional co-op/Garden messaging
belongs around its real Home entry, with Solo still the obvious default.

Record cold launch → title → Home → fresh Solo and Continue → resumed maze as
separate short journeys. No holding-to-skip introduction, forced spectacle,
repeated unskippable greeting or new story gate may be added. Returning from a
maze or Book follows the accepted navigation contract, never an extra title-art
tour. This is an integration test, not a request for new navigation features.

Use art direction—not unreadable baked text—to create copy space. Wide screens
may reveal more painted environment; narrow screens may crop peripheral scenery,
switch to a registered optical composition, or reserve the splash. They may not
crop Ame's face, confuse the exact logo, move the primary action unpredictably,
or imply a different feature set.

Required proof viewports inherit the final Plan-01 matrix:

| Surface | Required proof emphasis |
| --- | --- |
| 1920×1080 TV | couch-distance title/logo/action hierarchy, safe margins, controller focus, overscan-safe composition |
| 1280×720 Tauri/default desktop | canonical composition, every final home state, title-to-play transition |
| 1194×834 iPad landscape | touch-safe controls, copy-safe crop, high-DPI alpha and paint quality |
| 1024×768 tablet | 4:3 crop, 200% text behavior, no face/menu collision |
| 960×540 Tauri minimum | minimum desktop hierarchy and fallback rendition behavior |
| 844×390 landscape phone | compact crop, safe insets, exact title and primary action |
| 568×320 emergency landscape | complete functional fallback; decoration may simplify or reserve |

Also review any supported portrait/PWA launch state actually shipped at this
checkpoint. Record it as a supported composition or an honest orientation
message; do not leave an accidental broken crop.

## 10. Logo and typography contract

The wordmark is a designed asset but the product name remains data/text.

- Verify every letter of the retained v06 **Maze so Puzzle** wordmark against
  its approved generated source and deterministic exports. If an approved change
  is required, preserve the exact source/process and any editable authority that
  actually exists; never invent a vector source or require one for unchanged
  approved art. Do not remake sound lettering merely to complete a phase.
- Keep the wordmark separate from illustration and hero splash. Do not bake it
  into every background size.
- Provide only the optical variants proven necessary—for example, full-size,
  compact, and monochrome/contrast fallback. Do not create a platform-variant
  matrix without a real consumer.
- Test exact spelling at source size, actual delivery sizes, blur/downsample,
  grayscale, common colour-vision simulations, light/dark/busy backgrounds, and
  TV distance. Ambiguous letterforms are defects even when decorative.
- Use the final Plan-01 local font system for semantic heading, buttons, save
  summaries, and any real copy. Disable synthetic weights and preserve glyph,
  arithmetic, fallback, loading, and licence evidence.
- If the visual wordmark is absent, delayed, failed, or disabled, the semantic
  heading and menu remain stable and complete without layout shift.

The approved generated v06 mark is runtime authority, not a rejected concept.
New or changed generated lettering stays candidate-only until its exact spelling,
delivery legibility, source/provenance and Human approval gates pass. A generic
rule against generated text cannot retroactively revoke the accepted mark.

## 11. Accessibility, motion, and input

- Product name, primary action, mode availability, focus, save state, and errors
  never rely on the illustration, hue, motion, sound, hover, or controller type.
- Decorative art uses empty alternative text; meaningful contextual presentation
  art resolves to concise semantic text already present in the surface.
- Focus rings and selected/default states remain visible over the brightest and
  darkest permitted crops and every full/lite/static surface recipe.
- At 200% text and the project's text-spacing test, real UI may reflow over a
  quiet scrim without covering a face or losing an action. Text is not rasterized
  into key art.
- Reduced motion removes nonessential parallax, float, sparkle, glint, zoom, and
  cross-layer drift. Static mode preserves the same hierarchy and brand read.
- Keyboard, one Xbox controller, two-controller mode where enabled, touch, and
  pointer all traverse the existing front door in the same logical order. Art
  never becomes a focusable dead stop.
- No surprise flash, rapid contrast cycle, or title animation competes with the
  default action or audio controls.

## 12. Delivery, loading, offline, and performance

Use the final catalogue and rendition resolver; do not create a parallel URL
map inside a title component.

- Every active asset has a stable semantic ID, explicit rendition role, intrinsic
  dimensions, crop/registration metadata, loading phase, fallback, source record,
  byte evidence, and rollback pointer.
- The title route loads only its selected background, chosen front-door layers,
  logo optical, and immediately visible UI signals. It does not preload all
  friends, enemies, Courier animation packs, Garden art, 24 campaign themes, or
  every presentation rendition.
- Presentation art remains consumer-driven and visible/bounded-imminent only.
  Reuse decoded images where appropriate and release transient presentation
  surfaces under the final cache policy.
- Reserve dimensions before decode. A slow or failed image cannot move the menu,
  steal focus, produce an empty broken box, or block Solo play.
- All selected media ship locally and work without a network in production web
  hosting and packaged Tauri. No remote font, image, tracking pixel, or runtime
  generation dependency is permitted.
- Measure raw/compressed bytes, decoded upper bound and observed memory, decode/
  paint timing, title-to-first-interactive, title-to-first-Solo, transition frame
  time, idle CPU/GPU, and package delta against the final Plan-07 budgets.
- If a beautiful variant misses a budget, first optimize encoding, crop,
  dimensions, responsive selection, preload, or static recipe. Do not silently
  degrade the approved concept or raise the budget without an owned allocation,
  evidence, review date, and rollback point.

## 13. Provenance, catalogue, and lifecycle

Any new or modified pixel follows the final Plan-03 pipeline:

- preserve immutable generator/source originals and exact prompt/process history;
- record ordered references and hashes, model/tool/version where known, Human
  approval, rights/originality assessment, dimensions, alpha/color-space data,
  geometry, derivatives, encoded/decoded sizes, consumers, and rollback;
- never invent unavailable seed, model, prompt, authorship, or rights facts;
- generate clean transparent, registered, correctly sized derivatives from the
  approved source rather than cropping concept boards or resaving runtime files;
- publish through one atomic catalogue-pointer change with old pointers retained
  for rollback; and
- mark superseded candidates individually. Do not call a file dead merely
  because it is not in the title composition.

Update the Art Bible and relevant model/family sheets only when the final audit
establishes a durable rule or approved asset. Keep exact historical prompts and
rejected evidence append-only. Give Plan 12 a machine-readable retirement ledger;
Plan 12, not this plan, performs the non-runtime handoff archive after Plan 13
has closed pointer-producing work, pauses for Human confirmation that it was
copied to external storage, and only then requests separate repository-removal
authorization.

## 14. Phased implementation

### Phase 0 — re-audit implemented truth

- Complete the read-first gate and baseline record.
- Inventory the separate title and Home states for fresh, resumable, completed,
  Solo, Duo-available, Garden-locked/unlocked, offline, load-failure, and any
  final tester/development boundary that can appear in a production build.
- Inventory the final approved cast/features and exact active Plan-03 asset
  sources, variants, consumers, loading, bytes, approvals, and rollback paths.
- Capture current screenshots and performance/load evidence at the required
  viewport matrix before altering pixels or integration.

Exit: root review accepts an evidence-backed audit with no inferred asset IDs or
unresolved authority contradiction.

### Phase 1 — retain/refine/replace proposal and Human gate

- Produce one concise comparison packet showing the existing integrated assets,
  not just isolated full-resolution files.
- Assign Retain, Refine, Replace, or Reserve to every in-scope asset/variant and
  cite the exact defect for every non-Retain disposition.
- Propose one curated final composition/cast rationale and responsive role map.
  Do not produce an every-character collage.
- Identify only the minimum new source/optical variants justified by consumers.

**Human Gate 11A:** approve the disposition slate, composition promise, and any
bounded asset-generation briefs. If everything is retained, proceed directly
to Phase 4 after confirming integration evidence.

### Phase 2 — bounded source refinement or replacement, only if approved

- Create only approved sources/variants through the final art pipeline.
- Preserve identity/model-sheet locks, final rendering recipe, colour-aware
  contours, original Maze construction, and copy-safe/crop requirements from
  the outset.
- Review candidates at intended integrated and actual delivery sizes. Do not
  promote composite-board crops, opaque checkerboard artifacts, unapproved or
  misspelled lettering, or approximate character construction.

**Human Gate 11B:** approve each changed source and exact wordmark revision.
Unapproved work remains source/proof-only and cannot alter runtime pointers.

### Phase 3 — derivatives and atomic publication

- Build clean, registered, correctly sized responsive/optical derivatives.
- Validate alpha, edges, seams, color space, hashes, dimensions, copy-safe zones,
  smallest-size read, and catalogue/source-record coverage.
- Publish approved assets and catalogue pointers atomically, preserving the
  previous complete set as one rollback target.
- Add no eager preload merely because an asset is newly available.

Exit: all changed pixels are reconstructible and every catalogue consumer has a
semantic fallback.

### Phase 4 — front-door and presentation integration

- Integrate retained and changed assets into the existing separate title and
  Home layouts through the Plan-01 surface, typography, focus, and responsive
  tokens.
- Keep background, transparent hero layer, exact wordmark, semantic heading,
  menus, and state copy separable.
- Verify every front-door state, crop regime, motion/quality mode, input source,
  image failure, offline path, and save/mode combination.
- Verify selected presentation renditions in their real blocker/story/reward/
  Book/victory contexts without broadening gameplay or UI scope.

Exit: no duplicated route, duplicated title announcement, face/control collision,
fuzzy field-art upscale, broken fallback, or title-time catalogue preload.

### Phase 5 — final proof, documentation, and release-candidate handoff

- Run the automated and manual matrix below on web production preview and
  packaged Tauri.
- Obtain Human/Ame approval of the integrated final front door at representative
  TV, desktop, iPad, and compact sizes.
- Update source records, manifest, catalogue, lifecycle/retirement ledger, Art
  Bible, UI specification, architecture, project audit, release checklist, and
  changelog/version evidence affected by the implementation.
- Hand the reviewed Plan-11 change set, exact rollback, and performance evidence
  to the root manager; after acceptance, the root manager commits and pushes one
  clean checkpoint.
- Hand the accepted SHA and disposition ledger to Plan 13, then Plan 12, and the root
  release manager. Do not build a public-release claim inside this plan.

Exit: Plan 11 is accepted and the release-candidate branding input is immutable
unless a later verified release blocker reopens it.

## 15. Acceptance criteria

Plan 11 is complete only when:

1. every early Plan-03 title, home/hero, logo, and in-scope presentation asset
   has a traceable Retain/Refine/Replace/Reserve disposition;
2. every non-Retain disposition cites a concrete final defect and every changed
   source has explicit Human approval—zero changes is an allowed outcome;
3. the separate title and Home routes retain their distinct, non-redundant art
   roles, primary-action order and unchanged semantic/navigation ownership;
4. the exact **Maze so Puzzle** wordmark retains its approved v06 source/pixels
   or an explicitly approved revision, illustration layers do not replace the
   separate wordmark, and one real semantic title remains correct with images
   disabled;
5. all depicted cast and features match final shipped canon; Ponchi, Melty,
   Garden, co-op, and any alternative Player 1 appear only when their final
   approval and implementation justify them;
6. a curated composition communicates the game without requiring an all-roster
   collage or hiding the default Solo journey;
7. title, splash, logo, and contextual presentation art pass the complete
   responsive crop/copy-safe, alpha/registration, actual-size, focus, 200% text,
   grayscale/CVD, reduced/static, and offline/failure matrices;
8. TV, desktop/Tauri, iPad/tablet, and compact-phone proofs show the same brand,
   product name, action priority, and feature truth without protected-reference
   imitation;
9. title-to-interactive and title-to-first-Solo, package bytes, decoded memory,
   frame time, and idle cost pass the accepted Plan-07 budgets with no whole-
   catalogue preload;
10. all active assets resolve through the shared catalogue with source,
    provenance, consumer, loading, fallback, lifecycle, byte, approval, and
    rollback records; and
11. all required checks pass, documentation matches runtime truth, and the root
    manager's reviewed Plan-11 commit is pushed and recoverable.

## 16. Validation matrix

### Automated

- Art-pipeline tests and validators, source-record/schema/manifest validation,
  exact asset/catalogue cross-resolution, and deterministic derivative hashes.
- Exact wordmark spelling/variant fixture and one-semantic-heading accessibility
  assertion; no baked or duplicate accessible title.
- Title/home route, action order, default Solo, mode/Garden visibility, focus,
  image-failure, offline, static/reduced, and save-state tests.
- Responsive geometry assertions at every Plan-01 base viewport, including crop
  anchors, protected-subject/control intersections, safe insets, reserved image
  boxes, and no overflow or layout shift.
- Presentation-rendition resolution and fallback tests: correct semantic asset,
  no field-art upscale when a presentation source exists, and no interaction
  block when it does not.
- Full project checks, strict TypeScript, production build, desktop compilation,
  documentation consistency, link checks, performance contracts, inventory, and
  `git diff --check`.
- Plan-07 browser/Tauri scenarios for title-to-story-to-maze, Continue, Solo,
  optional Duo/Garden where shipped, save/reopen, asset failure, and offline
  package behavior.

### Manual and Human/family review

- Compare before/after (or retained/final) integrated screens, not only isolated
  source art, at 1920×1080, 1280×720, 1194×834, 1024×768, 960×540, 844×390,
  and 568×320.
- Inspect exact logo letters, Ame identity, every shown model, faces, hands,
  alpha edges, crop, copy space, focus, surface contrast, and story promise at
  actual delivery scale and TV distance.
- Navigate fresh/continue/completed Solo states and every shipped co-op/Garden
  state using controller only; repeat representative keyboard, pointer, and
  touch journeys.
- Test images/fonts delayed, missing, and disabled; offline packaged launch;
  reduced motion; forced static/lite quality; 200% text and spacing; screen-
  reader title/order; and high-contrast/CVD review.
- Amelia/Human review answers: Does this still feel like Ame's game? Is the name
  instantly readable? Does the picture truthfully promise the adventure? Is the
  primary next action obvious? Does anything feel crowded, misleading, generic,
  or visually disconnected from the sprites and UI?

Physical hardware not available to the agent remains explicitly pending. An
emulated screenshot cannot be presented as physical iPad, TV-distance, touch,
controller, WebView2-runtime, or child-play evidence.

## 17. Expected implementation surface

Resolve exact paths at execution time. Likely in-scope changes include:

- the existing title/home component and its scoped responsive styles;
- the shared art catalogue, asset resolver, rendition metadata, loading/preload
  policy, and their tests;
- approved Plan-03 source records, derivatives, review records, manifests,
  lifecycle/retirement ledger, and deterministic pipeline outputs;
- title/home and contextual presentation browser fixtures and performance
  scenarios; and
- `docs/ART_BIBLE.md`, `docs/UI_UX_SPEC.md`, `docs/ARCHITECTURE.md`,
  `docs/PROJECT_AUDIT.md`, `docs/RELEASE_CHECKLIST.md`, changelog/version records,
  and the integrated roadmap/backlog only where implemented truth changed.

Do not create a second brand catalogue, hard-code image URLs in the route,
duplicate final UI state, or mix archive cleanup into this checkpoint.

## 18. Risks and rollback

| Risk | Prevention | Rollback |
| --- | --- | --- |
| Late polish destroys approved charm | Retain-first ledger; defect required; Human gates | Repoint the complete catalogue/front-door bundle to the accepted Plan-03 set |
| Key art promises an unshipped cast or mode | Final-canon availability ledger; no speculative Alex/co-op/Garden | Remove the unshipped layer/copy and return to the last truthful composition |
| Every character is forced into one noisy image | Curated emotional promise and explicit no-completeness rule | Restore the simpler retained composition |
| A changed logo contains ambiguous or wrong letters | Exact spelling/delivery proof against the approved source, semantic heading and Human revision gate | Restore the approved v06 visual mark and exact live title |
| Wide art fails 4:3 or compact screens | Protected regions, crop anchors, optical variants, real viewport proof | Select the last passing crop/variant or reserve the hero layer |
| Art hides focus or real text | Plan-01 exclusion zones and contrast/scrim tokens | Disable the conflicting decorative layer without changing navigation |
| New media slows startup or bloats Tauri | Visible-only loading, responsive delivery, Plan-07 budgets | Roll back pointers/preload and use the retained optimized derivative |
| New source cannot be reconstructed or cleared | Immutable originals, append-only records, rights/originality gate | Do not publish; retain prior approved runtime authority |
| Plan 12 archives a needed rollback file | Machine-readable lifecycle/consumer/rollback ledger | Block retirement until Plan 12 proves zero active and rollback references; preserve it through the Human-confirmed external handoff |

Rollback is atomic at the brand-bundle/catalogue-pointer level wherever the
final architecture permits. It never mutates save data, campaign identity,
co-op state, or gameplay rules. Preserve the last complete approved set until
the release candidate is accepted and independently recoverable.

## 19. Release-candidate handoff

Plan 11 does not automatically produce another family preview: the roadmap's
post-Plan-10 Co-op Preview already provides the nearer learning gate. After Plan
11, Plan 13 consumes the accepted brand bundle while closing final backlog and
pointer work; Plan 12 then performs the archive-first package-hygiene sweep. The
root release manager creates the named release candidate from a clean checkout
of the final reviewed, committed, and pushed SHA, with generated
manifest/checksums authoritative over prose examples.

Plan 11 still ends in a reviewed commit pushed to GitHub `main`, and the root
must verify GitHub CI plus the resulting Vercel production deployment and front-
door smoke. It does not create a redundant portable desktop preview between
`FP-COOP` and `RC-01` unless a concrete brand-integration risk requires one.

The handoff packet includes:

- exact accepted commit and application/content/art-manifest versions;
- final disposition/canon/crop/consumer ledgers;
- source and runtime hashes plus complete rollback pointer;
- asset, accessibility, browser, Tauri, performance, offline, and Human-review
  evidence, with unavailable physical checks marked pending;
- known issues and any explicit Plan-13 or Plan-12 owner; and
- a statement that the result makes no unverified signing, store, low-end,
  physical-device, ratings, accessibility, or launch-readiness claim.
