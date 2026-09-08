# Plan09-P1 — playable learning comparisons

Isolated design experiments against web 0.22.28, not campaign additions. The real
application, engine, renderer, camera, minimap and hints run with a local fixture
registry. No production source, save schema, rule, reward table, campaign order,
version or dependency changes. Experimental Vite refuses builds; normal production
configuration never imports these files.

## Recommendation and teaching hypotheses

Select **A little stronger** as the first-use canary for later production design.
The main comparison fits the six-tile view: Ame 6, guardian 9, reachable guardian
5. The weapon remains necessary. The player can infer a deficit of 3, try a
harmless blocked encounter, take the growth branch, and return with 11. Defeating
the original guardian opens the star room. The shortest solution can avoid the
failed attempt: noticing the comparison should not require an error or a hint.

The deliberate choices are growth toward the star, an optional Gold detour, and
an optional friend interaction. Parallel floor tiles are not additional decisions.
Gold is a safe false lead for the main objective: it rewards curiosity without
increasing Power. Repeated tier-four guidance completes the maze from its end
with zero rescues. The friend costs one extra stationary input and zero extra
movement on the measured perfect route; it is not an additional spatial branch.

Retain **The lantern reunion** as a secondary application hypothesis. Courtyard,
growth room and upper gallery establish a recognisable room relationship. The
same comparison now requires leaving the guardian's view and returning to its
threshold. Optional Gold and Science reward exploration. The gallery and friend
can be glimpsed near the threshold; the star is not promised visible from the
initial courtyard. This simple room study is not yet a varied late-game puzzle
or a replacement for Lanternlight.

## Evidence and limits

| Map | Ordinary / all-rescue inputs | Max ordinary event gap | Solver states ordinary / perfect |
| --- | ---: | ---: | ---: |
| First-use fixture | 12 / 13 | 4 | 37 / 45 |
| Room-return fixture | 21 / 22 | 9 | 203 / 260 |
| Current Wishing Woods | 121 / 151 | 16 | 1167 / 4076 |
| Current Lanternlight | 151 / 208 | 48 | 1406 / 12528 |

Small teaching fixtures and full chapters serve different purposes. These values
do not prove that smaller is better or that either experiment improves learning.
Existing `rawBranchPoints` counts equivalent movement choices in open rooms;
it is not an effective-decision score. `retraversalRatio` counts all revisited
movement divided by inputs, not neutral travel. `prerequisiteDepth` is null.
Recorded solver milliseconds are a single local diagnostic, not a benchmark.

The first-use fixture's 25% raw repeat ratio includes the intentional stronger
return; it cannot be compared directly with the 15% neutral-travel guideline.
Named clue-to-return growth trips take 7 and 11 inputs in the fixtures, 9 for
Wishing's kitten guardian, and 105 for Lanternlight's central Power-6 guardian.
A return that changes a blocked interaction is state-enabled. The optional Gold
out-and-back is a separate rewarded choice, not mandatory neutral delay. Full
campaign neutral-travel classification remains a production Plan09 deliverable.

Wishing's exact target is `wishing-woods-enemy-kitten-guardian`: 6 → 11, guardian
9. The other Power-9 north watch is not interchangeable. Lanternlight's actual
early return target is `lanternlight-labyrinth-enemy-power-6`: 3 → 9. Its upper-left
Power-10 room is a separate spatial reference; the captured first contact arrives
at Power 17. A bounded search found no armed underpowered contact there; that
does not prove impossibility. Do not invent a Power-10 blocked-return sequence.

## Reproduce safely

Run from the repo root using installed locked dependencies. Evidence is external
at `C:/GameDev/maze-game-qa/plan09-p1`; no clone, build, native package or media
copy is needed. Preserve earlier logs/captures when changing a fixture.

```powershell
$env:MAZE_P1_EVIDENCE='C:/GameDev/maze-game-qa/plan09-p1'
npx vitest run --config docs/experiments/plan09-p1/vitest.config.ts
```

The `.proof.ts` suffix runs only through this explicit config, outside the default
project suite. Checks replay ordinary/perfect routes, harmless named contacts,
growth, exact defeat and new entry; four hints at three distinct states; save
round trips; and complete tier-four recovery after the Gold detour.
Generated `canaries.json` feeds the local experimental registry.

Use the existing installed Playwright hook, then its CLI with
`--config docs/experiments/plan09-p1/playwright.config.mjs` for mounted proofs.
The config owns one local server on 127.0.0.1:1422 and one serial Edge worker.
Set `MAZE_P1_BASELINE=1` and a separate external `MAZE_P1_BROWSER_DIR` for unchanged
Wishing/Lanternlight captures. Unset the baseline variable for fixtures.

For voluntary local play, run `npx vite --config docs/experiments/plan09-p1/vite.config.ts`
and open its localhost address in a disposable browser profile. Do not copy its
saves to public origins. Normal development and builds retain the real campaign.
There is no public experimental URL or hidden production route.

## Handoff and family observation

Engineering and independent review can close this bounded comparison, not child
comprehension, physical Apple performance or production-content acceptance.
Full campaign integration remains after controls, animation and integrated
performance. Next independent work is remaining UI focus/optical essentials and
the Ame-only active-lead interface before shared controls.

Optional observation: “What is stopping Ame?”, “What could help?”, “What changed
when you came back?” Record unaided play, requested hints and parent support
without grading help as failure. No reset or campaign replay is required.
