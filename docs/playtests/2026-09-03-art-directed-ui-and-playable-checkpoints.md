# Human direction — art-directed UI, presentation art, and playable checkpoints

- Captured: 2026-09-03
- Source: direct Human product direction during Plan 03 production
- Status: accepted intent; routed for implementation and verification
- Related backlog cards: `PT-20260903-25`, `PT-20260903-26`

## 1. Product outcome

Maze so Puzzle must look and feel like a lovingly art-directed video game, not
like a clean web application decorated with game sprites. The interface should
share the finish, warmth, shape language, colour discipline, and delightful
specificity of the approved `mgjrpg-02` world art while remaining exceptionally
clear to children and usable by touch, mouse, keyboard, and controller.

The Human cites recent Kirby games, *Mario Party Superstars*, *Super Mario Party
Jamboree*, *The Legend of Heroes: Trails in the Sky*, and *Super Mario Bros.
Wonder* as taste references for joyful polish, readable hierarchy, expressive
feedback, and crafted console-game presentation. These are references for
high-level qualities only. Maze must not copy a protected UI skin, layout,
panel silhouette, logo, icon, typography treatment, transition, or trade dress.

## 2. Interface art direction

- Carry the Art Bible's “paper-cut signals over magical surfaces over painted
  world” hierarchy through every persistent HUD group, menu, dialog, tooltip,
  focus state, prompt, and transition. Approved cream-cut sticker icons remain
  literal semantic signals rather than incidental decoration.
- Establish a small Maze-native surface family instead of a collection of
  generic rounded web cards. A leading direction is luminous milky magical
  glass: softly frosted white or pearl bodies, gentle colour picked up from the
  current world, a bright inner rim, controlled translucent depth, soft
  material shadow, and sparse storybook corner ornament. The centre behind text
  stays quiet and sufficiently opaque.
- Use the expensive literal blur/transmission effect only where measured and
  useful. Full quality may use one bounded static backdrop treatment on a small
  number of overlay surfaces; lite/static modes must reproduce the same material
  with opaque colour, gradients, borders, and precomposed highlights. Moving
  maze content must not be continuously re-blurred merely to imply polish.
- Give related surfaces a recognisable family resemblance while allowing title,
  story, blocker, victory, Adventure Book, Sound, and pause contexts to have
  purposeful variations. Decorative variation never changes action order,
  semantic role, focus behaviour, or readability.
- Buttons and focus states should feel pressed, selected, disabled, or magical
  through authored shape/value/highlight changes. They must remain native
  semantic controls and must not rely on motion, sound, colour, gloss, or a
  pointer hover alone.
- Avoid the visual signatures of a generic generated dashboard: repeated
  identical cards, browser-form spacing, default pills, arbitrary gradients,
  excessive glass layers, equal emphasis everywhere, and icon/text combinations
  that could belong to any web product.

## 3. Typography contract

Plan 01 must make a deliberate, licensed, locally packaged typography decision
with Art-Bible review. Evaluate a compact system rather than adding many fonts:

- a warm, rounded, expressive display/control face for titles, buttons,
  counters, short celebrations, and friendly headings; and
- either the same family in a highly legible text cut or one restrained companion
  for story paragraphs, Help, and dense descriptions.

The shipped files and exact weights must have recorded licence provenance and
an intentional subset/loading policy. Disable synthetic weights. Required
glyphs include the complete interface alphabet, punctuation, contractions,
digits, `+`, `−`, `=`, multiplication/comparison language, and any approved
controller or accessibility text. Power arithmetic and counters need stable,
optically centred figures; use tabular figures where movement would otherwise
make values hard to read. No decorative font may compromise reading at the
smallest supported size, 200% text resize, couch distance, or dyslexia-friendly
plain-language presentation. A robust local/system fallback must preserve
layout if the preferred face fails.

## 4. Large contextual art

Use the richness of the approved sources when a moment can afford it. The UI
must not stretch a small field sprite into a fuzzy illustration.

The current blocker modal already shows the exact item name and a 112px image,
but its `itemSrc` is a direct field-style URL. Preserve that successful
picture-led mechanic. This request replaces its asset resolution and visual
composition; it does not add another blocker state machine or duplicate dialog.

- The catalogue/image resolver distinguishes `field`, small optical/icon, and
  `presentation` renditions with measured safe bounds, source provenance, and
  fallback. A presentation rendition is loaded only for a visible or imminent
  contextual surface; opening one dialog never preloads every large asset.
- A blocker dialog prominently shows the exact required item as a large,
  beautifully rendered image and follows it with short plain language such as
  “You need the Splash Boots.” The illustration is the principal recognition
  cue, but the item name remains real text and is announced once.
- Too-strong guidance, rescues, newly met friends/enemies, item details,
  Adventure Book entries, important rewards, victory, and selected story beats
  may use presentation art when it materially improves recognition or emotion.
  Routine HUD cells and rapid transient notices keep their appropriate optical
  rendition so large art does not become clutter.
- Plan 01 records responsive presentation-art slots and minimum useful sizes;
  Plan 03 supplies approved renditions; Plan 07B validates on-demand loading,
  decode memory, package weight, and failure fallback. Missing presentation art
  falls back to a correct semantic optical rendition and text without a broken
  image, layout jump, or blocked action.

## 5. Early front-door art and final branding

The Human has asked the active Plan 03 agent to generate a Maze-native title
screen illustration, home-screen splash illustration, and game logo now, using
the approved house style. Once individually approved, cleaned, registered,
right-sized, catalogued, and integrated, these form the first front-door art
set and may ship in the next suitable family preview.

Current runtime navigation has one `title` surface that also serves as the home
menu, plus `game` and `achievements`; it has no independent home-screen state.
Plan 01 therefore assigns the two approved illustrations purposeful roles
inside that existing front door—for example responsive key background and
foreground/menu splash—or records one as a future reserved rendition. Do not
invent a redundant screen, extra click, or new save/navigation transition merely
to display both pictures.

Keep illustration and wordmark separable. A generated emblem/brand-mark concept
may guide the final logo, but generated lettering is concept-only until “Maze so
Puzzle” is reconstructed as exact locally typeset or controlled vector/raster
lettering, checked for spelling and readability, and explicitly approved.
Reusable title/splash art contains no baked UI copy; responsive layouts can then
place the exact logo and accessible live title independently.

This deliberately narrows later Plan 11 rather than cancelling it. After the
24-maze campaign, alternative Player 1, Ponchi, Melty, Friend Garden, and final
canon exist, Plan 11 audits the early set in context. It may retain it, add
missing optical/format variants, refine a bounded composition, or replace only
what no longer represents the final game. Early artwork should therefore avoid
inventing unfinished characters, mechanics, or relationships merely to look
complete.

## 6. Low-rework playable checkpoint policy

Do not package every specialist handoff. Produce a family-playable preview only
from a reviewed, committed, pushed, reproducible checkpoint when the accumulated
change is meaningful to play and the required build/smoke gates are already
close to that plan's normal acceptance work.

Preferred opportunities are:

1. **`FP-ART` — Optional Art Preview after Plan 03 and root checkpoint 03M:** only
   if runtime art/front-door integration and all currently selected asset/audio
   URLs and fallbacks are green, and making the package does not distract from
   Plan 01. It does not require the final contextual OST controller owned by Plan
   07B, but it does require 03M's valid delivered catalogue/current adapter.
2. **`FP-UI1` — Family Preview 1 after Plan 01:** the preferred early build, combining the
   final static art/front door with the rebuilt cross-device game UI.
3. **`FP-CORE2` — Integrated Interaction Preview after Plan 07B:** the refined UI, lighting,
   VFX, controller-complete journey, limited animation, music, and the package
   already requalified by the performance owner.
4. **`FP-CAMPAIGN` — Campaign Preview after Plan 09:** the complete 24-maze campaign and final
   content ecology.
5. **`FP-P10-GREYBOX` and `FP-COOP`:** test the greybox through an
   explicitly disposable isolated profile/storage namespace before production
   persistence, then package the first accepted couch-co-op/Friend Garden build.
6. **`RC-01` — Release candidate after Plan 11, Plan 13 closure, Plan 12
   archive-first hygiene, and root final qualification:** final branding,
   backlog closure, package hygiene and integrated evidence.

For each preview, the root/release manager first confirms a clean exact commit,
then builds from a clean checkout/worktree of that accepted pushed SHA—not from
the shared dirty development tree. Require passing focused and project checks,
successful production web build, desktop
compile, and a short title → story → maze → save/reopen smoke path. Build a
Windows Tauri artifact when the changed milestone is intended for family play;
an installer is optional for an internal preview when a portable artifact is
safer and materially cheaper. Record commit, application/content versions,
artifact SHA-256, build host/tool versions, included milestone, known issues,
and rollback pointer. The generated artifact manifest and checksum file are
authoritative; prose examples never override their hashes. Keep large binaries and transient screenshots outside
runtime delivery and source control unless an explicit release policy says
otherwise. “Family preview” is not a public-release, signing, store-readiness,
performance, device, or accessibility claim.

The default family-preview bundle is one immutable SHA-named unsigned portable
Windows executable, one machine-readable manifest, its SHA-256 checksum, and a
short `PLAYTEST` note covering launch path, intended journey, known issues,
save/profile scope, and rollback. Rebuilds receive an explicit revision suffix
and never overwrite prior evidence. Installer/signing and the full platform
matrix wait for `RC-01` unless a named earlier risk specifically needs them.

Every non-RC preview uses an isolated profile/storage namespace or a verified
backup/restore procedure. Preview or newer-schema data must not contaminate the
ordinary Tauri/WebView profile; the Plan-10 greybox profile is always disposable.

If a checkpoint is not green, would require invasive release-only work, or will
be immediately invalidated by the next plan, skip it and record the reason. The
desire for a fresh family build must never encourage packaging a known-broken
save, solver, input, or asset state.

## 7. Acceptance outline

- Human review at the common viewport matrix agrees the UI feels authored for
  Maze rather than like a generic web dashboard with themed icons.
- All persistent and contextual surfaces share a documented material, shape,
  edge, ornament, focus, and state grammar without becoming monotonous.
- Blocker dialogs show the correct large required-item art plus exact text and
  accessible semantics; missing/decode-failed art has a stable fallback.
- Typography licences, weights, glyph coverage, figures, fallback, loading,
  smallest-size legibility, 200% resize, and couch-distance evidence are recorded.
- Full/lite/static surface recipes preserve hierarchy and contrast; no blur,
  transparency, or animation makes text or controls harder to read.
- The first suitable family-preview artifact is produced or explicitly skipped
  with a documented evidence-based reason, never forgotten by default.
