# Human intake — OST delivery, Ame approval and asset retirement

- Recorded: 2026-09-03, Europe/London
- Source: direct Human project direction in the orchestration task
- Nature: asset delivery, explicit visual-design decision and roadmap request
- Verification boundary: this note records intent and a filesystem inventory; it
  does not claim that the soundtrack, Ame v02 or asset cleanup is implemented

## Original soundtrack delivery

The Human reports that the new Maze so Puzzle BGM has been delivered under
`public/assets/ost/` and grouped by intended use. A read-only inventory at this
checkpoint found the following candidate shipping catalogue:

| Physical pool | MP3 files | Encoded bytes |
|---|---:|---:|
| `adventure-book` | 6 | 18,165,975 |
| `garden` | 6 | 13,531,815 |
| `maze` | 14 | 35,434,983 |
| `story` | 6 | 10,800,507 |
| `title` | 6 | 14,769,828 |
| `victory` | 4 | 6,448,205 |
| **Total** | **42** | **99,151,313** |

No MP3 remains at the root of `public/assets/ost/`, and no byte-identical files
were found by SHA-256. Each of the six required pools is nonempty. Track-level
duration, loudness, peak, rights/provenance and listening qualification remain
implementation/release evidence, not facts inferred by this inventory.

The old flat placeholder soundtrack has been removed from the working tree, but
`src/music.ts` and `src/music.test.ts` still reference that old flat catalogue.
A focused run of `npm test -- --run src/music.test.ts` therefore produced one
expected catalogue failure (16 other music tests passed). This is a real
transition-state integration gap; it must not be hidden or attributed to the art
work.

## Ame v02 visual-design decision

After reviewing Agent 03's comparison, actual-size and model-study sheets, the
Human accepted its recommendation. The Human's actual wording was:

> **I've reviewed the images and comparison sheets and I'm happy with the
> reccomendations.**

The manager-normalized outcome is: **Candidate C is the canonical static Ame
v02 design direction.**

This approves Candidate C's identity and visual/model-sheet direction. It does
not pretend that its runtime derivative, live-context proof or the rest of Plan
03 is complete. It also does not silently resolve the distinct owner
licence/rights field while the source record says `pending-owner-review`.

## Superseded asset retirement request

**Superseded execution authority — 2026-09-04.** The original text below is
preserved as intake history. The active roadmap is archive-first: each approved
candidate enters a hash-verified non-runtime handoff archive outside shipping
inputs; work pauses until the Human confirms external backup; repository removal
then requires a separate explicit authorization and family-isolated commit.

Add an explicit late-programme step to identify, archive where appropriate and
remove proven-unused assets, including superseded animal-cage revisions. This is
not permission for heuristic or bulk deletion.

The step must:

- run after final runtime and front-door art pointers are known;
- classify each candidate as active, dormant, source-only, superseded,
  deprecated-with-rollback, or safe to delete;
- preserve approved masters, prompts, source/provenance records and Git history;
- keep the immediately preceding runtime revision for its declared rollback
  window;
- prove absence of runtime, CSS, generated-catalogue, preload, test, Tauri/icon,
  documentation and release-package references before deletion;
- make deletions in a dedicated, reviewable change with exact before/after file,
  encoded-byte and package inventories; and
- validate browser and packaged desktop routes for missing assets before the
  cleanup gate can pass.

Old cage files are named examples and expected audit candidates, not automatic
deletion authorization.
