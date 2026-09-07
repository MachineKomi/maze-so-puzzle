# DELIGHT-24 friend-led victory independent review — Sol

Date: 2026-09-07  
Reviewer: Sol (GPT-5.6), independent runtime reviewer  
Published baseline reviewed: `3457cf629c07001be1aefbea2f0be89804f0b1a4` / web0.22.23  
Final source candidate reviewed: `d880b223cb62652213e271635e6551721979c879`  
Status: supports bounded web promotion; physical-device, WebKit/native and DELIGHT checkpoints A/C remain open

## Scope and dependency boundary

DELIGHT-24 is checkpoint B of DELIGHT-02B. It may improve the victory presentation and clarify projected rewards, but it does not deliver checkpoint A pickup presence, checkpoint C durable-earned fanfare, Garden ownership or LOOT-03 D Eggs.

Holding Eggs is correct. Plan 10 requires a real Garden, a protected Egg queue and mailbox, an eight-card bag with live reservations, an exact Ring-style crack transaction, eligible rescued species, resident ownership and a usable hatch destination. Current Book rescue discovery and the in-maze equipment Bag own none of those concepts. A visible Egg inventory before that vertical slice would be an inert promise rather than usable inventory. The corrected order—DELIGHT-02B, LEARN-01, then Egg rewards only after the applicable Plan 09 and Plan 10 gates—is consistent with the current authority.

## Source review

`VictoryParade` is a presentation-only consumer of the already computed won result. It filters the current level to the actually rescued friends and uses Ame as a warm no-rescue cast. It does not add a save field, reward channel, clock, particle renderer or transaction. The revised flourish predicate derives one boolean from the pure existing `rewardSeed(game.loot.runId) % 4 === 2` result, then selects at most one friend from the bounded hop/prance/scamper set. This removes the accidental connection to route-step parity without advancing or perturbing any reward stream. Re-entering the same run retains the same decorative choice.

The motion bound is explicit. Each friend runs the existing species gesture for at most two iterations; the slowest current 4.8-second gesture plus the last 280-millisecond entrance delay ends by 9.88 seconds. Lite uses one iteration, removes later decoration and suppresses the flip. Reduced motion and Static receive the calm final composition without animation. The one-way `quiet` latch consumes the existing `pageVisible` state: once a mounted celebration is hidden or is mounted under a no-motion mode, it cannot restart decorative motion merely because the page becomes visible or the preference changes. Navigation unmounts the stage.

This source design is coherent, with three qualifications for the final record:

- the final browser evidence includes the separate eleven-second native-CSS lifecycle, hide/return and Reduced-to-Full cases; the earlier forced Web Animations finish remains only a declared-deadline check;
- the existing projected sticker/medal/badge sound is still scheduled before the profile write. It may remain a victory anticipation cue in B, but it is not evidence of checkpoint C and must not be described as an earned or durable award fanfare;
- the stronger `win-*` keyframes currently have no other source consumer, but their global names should remain covered by the source-reference check so a later consumer cannot silently inherit the victory amplitude.

The App copy now states `Ready to record`, `After moving on` and `Sticker/Medal/Badge to record`; an unsupported future profile uses `Temporary` instead. Tester completion continues to use its separate no-save preview. The completion transaction itself is unchanged: Stay does not bank, while explicit Next journals the won run, applies the receipt, writes progress, clears the run and navigates. I found no new duplication or save-order risk in this checkpoint.

## Independent visual review

I independently viewed all eight baseline images in `C:/GameDev/maze-game-qa/performance/delight24-baseline-qualified/friend-victory` and all eight candidate pilot images in `C:/GameDev/maze-game-qa/performance/delight24-pilot2/friend-victory`.

The improvement is material. In the baseline five-friend layouts, the 574-pixel dialog body had 808 pixels of content at 780, 844 and 1280, while the 1080 Static case had 889 pixels of content in a 642-pixel body. XP and keepsakes were below the visible body. In the candidate packet, each corresponding body has equal client and scroll height: 569/569 at 780, 844 and 1280, and 570/570 at 1080. The action row remains visible.

The friends are also genuinely larger. Their measured image boxes rise from about 43–44 to 59–63 CSS pixels at 780, from about 54–55 to 74–79 pixels at 844, from about 105 to 136 pixels at 1080, and from about 99–102 to 136–145 pixels at 1280. The shared stage reads as one celebration instead of five equally weighted result cards. The story and reward form a clear two-column receipt, while pending keepsakes and Adventure Level remain visible. Full, Lite, Reduced and Static preserve the same information.

The 844 no-rescue and one-rescue states are honest and warm: Ame or the rescued friend is centered, no waiting friend is presented as a failure, and the full receipt remains visible. Those sparse states leave deliberate open space and their single visible character is smaller than the five-friend ensemble's total visual weight; I do not consider that a blocker for this bounded direction. At 780, the five greeting lines and detailed reward breakdown are physically small but still visually distinct in the supplied Chromium capture, consistent with the accepted desktop-style phone composition. This is not a physical-phone readability finding.

The pilot report records eight expected passes, zero unexpected results, matching baseline/candidate fixture SHA-256 `2855bed75683aeefd207d02802b62fb6b7293123fe4edd72111a48e56bc632f1`, and no captured page errors. It is a pilot against a dirty working tree, not final source qualification.

The subsequent test source closes the design gaps in the original pilot rather than weakening its assertions. Its all-friend fixture is deliberately bound to one deterministic flourish, it pauses the actual mounted CSS animations at 1,260 milliseconds for the apex captures, and it keeps the ten-second declared-deadline check. A separate case uses eleven seconds of native CSS time, hides and restores the production page-visibility owner, switches Reduced back to Full without replay, and verifies unmount on Stay. Enlarged-text cases retain all three actions and scroll the existing dialog body to the Adventure Level at 780 and 1280. The future-profile case compares the exact stored bytes after Next. These contracts are observed in the final source-matched browser packet described below.

I independently inspected the new 780, 844 and 1280 flourish-apex captures. The one selected deer is visibly inverted, remains inside the shared stage at every size and does not obscure another friend or the pending receipt. The eleven-second capture is upright, still and free of confetti. The 780 and 1280 enlarged-text captures use the permitted scrolling dialog body: after scrolling to the XP receipt, the upper friend art is intentionally outside the body viewport while Next, Stay and Restart remain fixed and reachable.

The first combined regression run is not clean: its report records 36 expected results and one unexpected failure. The failure waited for a `Continue` button while a protected future profile was present. Current App policy deliberately refuses to resume a saved normal run under a future profile, so the page correctly offered `Begin adventure`. The corrected helper follows the established supported path—fresh temporary adventure, real solved route, temporary completion copy, Next and exact future bytes unchanged. I classify the first failure as a stale probe rather than a runtime defect; the passing corrected follow-up below closes that evidence gap without erasing the retained failure.

The corrected source-matched follow-up at `C:/GameDev/maze-game-qa/performance/delight24-final-browser` records 13 expected passes, no skips, flakes or unexpected results, in 31.44 seconds. Its Playwright report SHA-256 is `bf88aeba35fe30a157195ee803668f706fe2b5d61cb706ef2bb493651526efc7`. It includes the corrected future-profile route and an actual tester victory whose stage appears while profile storage remains unchanged. This closes the functional gap from the first run without rewriting its retained failure.

## Inherited narrative defect

The no-rescue Moonlit state exposes an inherited authored-story mismatch in both baseline and candidate: `src/story.ts` says that all five friends followed Ame home even when none were rescued. The victory stage, rescued-friend count and pending reward receipt remain truthful, and DELIGHT-24 B neither introduced nor expanded the static story line.

I do not treat this inherited copy defect as a blocker for the bounded B presentation because its new stage and transaction-facing copy report the actual result. It must be disclosed as `STORY-RESCUE-01`, corrected in the planned learning/story pass, and kept out of any claim that no-rescue narrative is fully truthful. This is my engineering disposition, not Human acceptance of the mismatch.

## Final evidence and performance

The final evidence binds candidate `d880b223cb62652213e271635e6551721979c879`, runtime-input SHA-256 `59e5e5ba8da319a7509e23b88dfd8e40d4e7383f6c93b02b5aef19c7aee16287` and dist fingerprint `5ad6b4b460e34391110b1dcee2463ffcf375077d39b804d8694cd92e3e706720`. The candidate bundle is `/assets/index-Zy5odLpC.js`, 638,598 bytes, SHA-256 `0fcc94751cfeb695a5aee287870b36dae3f3e97cd843c0cc96717e9d485f727d`; CSS is `/assets/index-tl0MAkOI.css`, 126,868 bytes, SHA-256 `435afc7c301947ddaa0c3efeb9e4bb94c3dd58787fa2537b05786e178ff26dbc`. JS gzip-9 is 179,033 bytes, 453 above web0.22.23 and within the recorded allowance; CSS gzip-9 is 25,443 bytes and public media is unchanged.

Exact-head CI run `34136688605` passed verification and desktop compilation. The retained browser record consists of 36 passes plus one stale-probe failure in the first combined run, followed by a clean 13/13 source-matched correction packet. Together with the 25 XP/Book cases, this covers 38 distinct contracts; it is not one clean 37-case run. The evidence includes real elapsed-time completion, visibility cancellation, no replay after Reduced-to-Full, Full/Lite/Reduced/Static, no/one/five friends, compact and larger layouts, enlarged text, Stay, tester and exact future-profile byte preservation.

I independently checked the final frame and work reports. Their SHA-256 values are `457084ed1271c657f7abbbba2be1e2c62a2c22a9c2f0b38e42858027172c5787` and `3ee45cb7d56da075858f513525a3285e69282eb9ff630760c8497ee51a32dbf3`; the compact summary and identity record hash to `5a863990616e3772d0ac785b83967fe1ae2b5f0b024612deacbd5008d0eefd20` and `bfb8182216dacb3177ddbb091aadfa2fa76b91f576b090352808e07377f1da2b`. Each report contains 24 rows: four warmups and five alternating measured pairs for each of 780x312 and 1193x833 at DPR2 under CPU4. All 48 rows bind the source and dist identities, preserve the 159-step won state, position and progress, and report zero terrain mutations, errors or broken images. Candidate animation count is zero at the end of every row; baseline retains five.

Untraced frame p95 is at most approximately 16.8 milliseconds for both versions and both viewports. At 780, neither version records a frame over 20 milliseconds and the candidate worst is 17.1 milliseconds. At 1193, the candidate retains one 33.234-millisecond frame, versus a 17.1-millisecond baseline worst; no row exceeds 34 milliseconds. This isolated tail is material and disclosed, but the five-pair packet does not show a sustained frame regression.

The traced medians show bounded work rather than parity. At 780, Paint rises 21.877 milliseconds over the eleven-second route (+1.886%), RasterTask rises 0.237 milliseconds (+12.923% from a 1.834-millisecond baseline), Layout rises 1.815 milliseconds (+1.529%), and UpdateLayoutTree falls 30.889 milliseconds (-2.547%). At 1193, Paint falls 21.572 milliseconds (-1.802%), RasterTask rises 0.229 milliseconds (+11.456% from a 1.999-millisecond baseline), Layout falls 0.316 milliseconds (-0.260%), and UpdateLayoutTree falls 57.813 milliseconds (-4.585%). The RasterTask percentages have a roughly two-millisecond denominator and should not be read as a large absolute cost. Candidate DOM count rises by five and compositor-layer count by six at both viewports; the 48 decoded images are unchanged. These traces neither establish allocated-memory or GPU benefit nor qualify physical Apple hardware.

## Independent disposition

I support bounded web promotion of DELIGHT-24 B at the frozen source. The candidate fixes the observed receipt overflow, enlarges and unifies the rescued-friend celebration, terminates decorative work, preserves the existing completion transaction, and has proportionate measured cost for this presentation. The one 33.234-millisecond candidate frame and the extra five nodes/six layers remain explicit limits rather than blockers in this five-pair web scope.

This review does not establish physical iPhone/iPad, WebKit or native acceptance, Human acceptance of every animation, memory/GPU improvement, gameplay or cold-start performance, checkpoint A pickup presence, checkpoint C durable-earned fanfare, full narrative truth, or any Garden/Egg lifecycle result.
