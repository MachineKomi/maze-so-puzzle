# Sol–Astra disposition ledger: Opus 5 review

**Historical v3 skeleton.** Current review authority is the
[v4 / 88-row ledger](2026-09-05-sol-astra-opus5-v4-disposition.md).
The Human subsequently assigned Astra first, then Sol. Keep this 80-row intake
unchanged below as history; do not treat its pending state or old baseline
warning as the status of the current v4 review.

Date: 2026-09-05. **Handoff skeleton only: no joint assessment or adopted recommendations.**

Source: [exact imported review](external/2026-09-05-claude-opus5-maze-so-puzzle-review.md) and [provenance](external/2026-09-05-claude-opus5-maze-so-puzzle-review-provenance.json).
Opus titled it “Maze so Puzzle — independent design & engineering review (v3)”, dated 2026-09-05 (third pass), and stated that it reviewed HEAD `fef5e56` plus the full uncommitted UI-03 working tree, package version `0.22.0`.
Snapshot SHA-256: `579a462714c278f170292db04fb430342e7dd042a565be9a580b65bae54d2204` (90,464 bytes).
Opus states it had not played the game, watched Ame play or seen it on an iPad. Its labels, diagnoses, measurements and completion claims are independent advisory analysis, not Human authority or current-code verification.

All “Re-verify at 68e303d” cells refer to final UI correction source `68e303da680d5aec0ba71154949c5a2a0d1697ae`. Subsequent runtime changes must be identified explicitly when a finding is checked.
The source-title assertions below are **attributed to Opus**, not endorsed conclusions. “L” locates original lines in the immutable snapshot. Code verification has not begun in this handoff.

Review protocol: Sol assesses product intent, experience preservation and evidence first; Astra challenges technical claims, architecture, performance and implementation risk; Sol reconciles the positions for Human approval.
Retain each model’s substantive position and evidence when they disagree; record what would resolve the disagreement. Do not replace conflicting positions with invented consensus.
The Human alone approves visual quality, play feel, family experience and material scope changes. One agreed owner executes, one model reviews read-only, and only one runtime writer works at a time.
No Opus proposal is implemented merely because it appears here. No Agent 04 start or roadmap change follows from this skeleton.
Use [canonical joint state](../JOINT_ORCHESTRATION_STATE.md) for current authority, release facts, Human feedback and the next gate.

Allowed eventual final dispositions: **Adopt; Adopt with modification; Already addressed; Experiment/spike first; Human decision required; Defer to named plan; Reject, with rationale; Stale after current implementation.**
“Pending” below is an unreviewed placeholder, not a final disposition. Eventual dispositions need current evidence, named ownership/plan and an explicit acceptance gate; rejection and deferral need reasons.

Inventory: **80 CR rows** (74 main/subsection identifiers plus six quick-win suffixes), grouped below. Source repetitions are cross-references, not additional findings.
There is no CR-PERF-08 in this snapshot. CR-DESIGN-06/07 are expanded from the abbreviated index/series and share §8.5–8.7; they are labelled accordingly.
Quick-win suffixes remain linked to their parent findings. Parenthetical proposal letters such as CR-JUICE-04(d) do not create extra stable IDs.
Source metadata is inconsistent: L7 says “retired one”, while L22 says “Retired in v3: none”; L22 lists three new IDs, while CR-FEEL-01b is also headed “new in v3” at L172 and in Appendix B. Preserve these statements without guessing a resolution.

## Movement and camera

| ID | Opus claim/proposal | Current-code verification | Sol position | Astra position | Human decision | Final disposition | Owner/plan | Evidence/acceptance gate |
| -- | ------------------- | ------------------------- | ------------ | -------------- | -------------- | ----------------- | ---------- | ------------------------ |
| CR-FEEL-01 | The 6 × 6 field of view (L141) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-FEEL-01b | The camera window is square, and that is why the board wastes vertical space (new in v3) (L172) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-FEEL-02 | No camera dead zone (L200) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-FEEL-03 | Two unsynchronised clocks (L209) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-FEEL-04 | Cruising speed (L253) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-FEEL-05 | The "faint moving dark line" (PT-33) (L256) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-FEEL-06 | The rAF timestamp change treats a symptom (new in v3) (L231) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |

## Performance

| ID | Opus claim/proposal | Current-code verification | Sol position | Astra position | Human decision | Final disposition | Owner/plan | Evidence/acceptance gate |
| -- | ------------------- | ------------------------- | ------------ | -------------- | -------------- | ----------------- | ---------- | ------------------------ |
| CR-PERF-01 | `MazeTerrain` memo (status-table label; section says Fixed) (L41, 267) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-PERF-02 | `MiniMap`'s `memo()` still never hits (L270) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-PERF-03 | Every `pointermove` still re-renders the App (L280) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-PERF-04 | `useSceneTravel` layout effect still has no dependency array (L287) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-PERF-05 | Still no compositor promotion or containment (L292) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-PERF-05a | `will-change: transform; contain: paint;` on `.camera-world`, toggled by `data-travel-state` (quick win under CR-PERF-05) (L103) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-PERF-06 | Asset payload (L326) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-PERF-07 | Presentation still runs on three clocks (L297) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-PERF-09 | Define the quality-tier ladder (L313) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-PERF-10 | The terrain decision (please make before Plan 04) (L304) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-PERF-11 | What to measure (L331) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |

## Juice and game feel

| ID | Opus claim/proposal | Current-code verification | Sol position | Astra position | Human decision | Final disposition | Owner/plan | Evidence/acceptance gate |
| -- | ------------------- | ------------------------- | ------------ | -------------- | -------------- | ----------------- | ---------- | ------------------------ |
| CR-JUICE-01 | The world is static between events (L353) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-JUICE-02 | Movement has no anticipation or follow-through (L368) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-JUICE-03 | Impact language (L382) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-JUICE-04 | The follower chain is the game's best asset and is barely used (L391) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-JUICE-05 | Celebration length should scale with significance (L400) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-JUICE-05a | Scale combat celebration by significance rather than flat 2 220 ms (quick win under CR-JUICE-05) (L109) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-JUICE-06 | Particles are Unicode glyphs (L419) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-JUICE-07 | Ame needs an idle and a discovery pose (L428) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |

## Audio

| ID | Opus claim/proposal | Current-code verification | Sol position | Astra position | Human decision | Final disposition | Owner/plan | Evidence/acceptance gate |
| -- | ------------------- | ------------------------- | ------------ | -------------- | -------------- | ----------------- | ---------- | ------------------------ |
| CR-AUDIO-01 | There is no master chain (L441) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-AUDIO-02 | Everything is a pure tone (L448) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-AUDIO-03 | The step sound repeats identically several times per second (L457) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-AUDIO-03a | ±5 % pitch jitter on `step`, `bump`, `pickup` (quick win under CR-AUDIO-03) (L107) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-AUDIO-04 | The ascending-pickup chain (L462) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-AUDIO-05 | Music and SFX have no relationship (L469) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-AUDIO-06 | SFX needs an owner (L474) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |

## UI/UX

| ID | Opus claim/proposal | Current-code verification | Sol position | Astra position | Human decision | Final disposition | Owner/plan | Evidence/acceptance gate |
| -- | ------------------- | ------------------------- | ------------ | -------------- | -------------- | ----------------- | ---------- | ------------------------ |
| CR-UI-01 | Replace the property-based spec with a numeric contract (L536) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-02 | The scale problem, now with exact numbers (sharpened in v3) (L483) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-02a | `container-type: size` on `.adventure-hud`; `cqw` → `cqmin` (quick win under CR-UI-02) (L104) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-02b | Recalibrate the clamp coefficients — see §6.1, they are all at their floors (quick win under CR-UI-02) (L105) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-03 | One moment, one obvious action (L566) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-04 | Modality-aware focus — substantially done (L569) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-05 | Board drag still anchors to Ame (L572) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-06 | Transients must never affect layout (L563) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-07 | Largest rendition in detail views — infrastructure done (L577) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-08 | Make the interface diegetic: the deck is Ame's adventure kit (L582) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-09 | Reconsider whether the minimap should be a minimap (L593) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-10 | Power should be the hero of the HUD (L602) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-11 | The objective should be a picture (L609) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-12 | The "one glance" test (L614) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-13 | A small motion vocabulary (L621) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-14 | Couch and TV distance (L635) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-15 | The moments around play (L640) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-UI-16 | `minimumDeck` was raised, and I think it is the wrong lever (new in v3) (L523) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |

## Lighting, visuals and animation

| ID | Opus claim/proposal | Current-code verification | Sol position | Astra position | Human decision | Final disposition | Owner/plan | Evidence/acceptance gate |
| -- | ------------------- | ------------------------- | ------------ | -------------- | -------------- | ----------------- | ---------- | ------------------------ |
| CR-ART-01 | Wall depth needs extrusion, not a drop shadow (L651) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-ART-02 | Sprite blur during programmatic animation (PT-38) (L693) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-ART-03 | Poison bubbles (L696) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-ART-04 | Two principles worth recording in the Art Bible (L701) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-ART-05 | A concrete, cheap lighting model (L665) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-ART-06 | Per-theme colour grading and vignette (L672) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-ART-07 | Depth cueing (L677) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-ART-08 | An effect hierarchy and simultaneity budget (L680) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |

## Game design and content

| ID | Opus claim/proposal | Current-code verification | Sol position | Astra position | Human decision | Final disposition | Owner/plan | Evidence/acceptance gate |
| -- | ------------------- | ------------------------- | ------------ | -------------- | -------------- | ----------------- | ---------- | ------------------------ |
| CR-DESIGN-01 | Nothing is ever spent, so no decision has a cost (L711) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-DESIGN-02 | Generated mazes are trees; braid them (L730) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-DESIGN-03 | Gold and Science have no sink (L739) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-DESIGN-04 | Teach the subtraction — half done (L746) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-DESIGN-04a | Add the gap sentence to the too-strong dialog and the sum to combat (quick win under CR-DESIGN-04) (L108) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-DESIGN-05 | Size ladder (abbreviated source-index label) (L752–753, 882, 949) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-DESIGN-06 | Interest rhythm (ID expanded from the abbreviated source index/series; no standalone heading) (L752–753, 882, 949) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-DESIGN-07 | Guarded optional battles (ID expanded from the abbreviated source index/series; no standalone heading) (L752–753, 882, 949) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-CONTENT-01 | Two voices, and one a child can't read (L759) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-CONTENT-02 | Translating Ame's favourites into mechanics (L769) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-CONTENT-03 | Celebrate the friends (L781) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |

## Architecture and programme risks

| ID | Opus claim/proposal | Current-code verification | Sol position | Astra position | Human decision | Final disposition | Owner/plan | Evidence/acceptance gate |
| -- | ------------------- | ------------------------- | ------------ | -------------- | -------------- | ----------------- | ---------- | ------------------------ |
| CR-RISK-01 | `App.tsx` is now 2,853 lines and growing (L788) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-RISK-02 | Changing the FOV invalidates four plans and one test (L804) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-RISK-03 | New mechanics multiply the solver state space (L809) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-RISK-04 | Plan 10's fixed clock is incompatible with today's architecture (L816) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-RISK-05 | Documentation volume (L823) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-RISK-06 | Docs ratify the terrain approach that is a liability (L830) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-RISK-07 | Generated-run persistence gap (L833) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-RISK-08 | Multiple input systems (L838) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-RISK-09 | Sequencing puts presentation before feel (L843) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| CR-RISK-10 | Parallel agents now authorised while the hub file grows (new in v3) (L795) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |

## Proposed roadmap sequencing

The following **non-CR source locators are not recommendation IDs supplied by Opus**. They preserve §1 and §11 sequencing for joint review without inventing CR identifiers or changing the authoritative roadmap.
Cross-referenced CR recommendations appear once in their groups above; review the proposed ordering separately.

| ID | Opus claim/proposal | Current-code verification | Sol position | Astra position | Human decision | Final disposition | Owner/plan | Evidence/acceptance gate |
| -- | ------------------- | ------------------------- | ------------ | -------------- | -------------- | ----------------- | ---------- | ------------------------ |
| §1 | Quick wins and sequencing; source dependency/decision tables (L94–135) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| §11 Phase A | Feel and foundation; steps 1–10 and proposed family-preview point (L850–862) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| §11 Phase B | Decisions and cheap depth; steps 11–16 (L864–870) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| §11 Phase C | Presentation on a foundation that can carry it; steps 17–23 (L872–879) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| §11 Phase D | Content and co-op; steps 24–25 (L881–883) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
| §11 preservation | “What I would not change” (L885–886) | Re-verify at 68e303d | Pending | Pending | Pending | Pending | Pending | Pending review |
