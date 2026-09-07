# EXPLORE-25 spacious maze independent review — Sol

Date: 2026-09-07  
Reviewer: Sol (GPT-5.6), independent runtime reviewer  
Baseline: clean `ba59cd7`, web0.22.24  
Candidate: frozen `c931bc3c8b69c1f52d8c7dacdd21771cd6b5ae5c`  
Status: supports bounded web promotion; physical Apple, native, low-memory and Human layout acceptance remain open

## Scope

This review covers the new rectangular exploration viewport, fractional camera and centre-visible tile contract, folding adventure rail, Classic route, the superseded r3 captures, the source-matched `explore25-contract-r2` packet, the nine-size `explore25-access-r4` composition packet and the final paired host measurements. It is a source and development-Chromium review. It is not physical Apple/WebKit/native acceptance, universal performance acceptance or Human approval of every layout.

The direct Human request supersedes the historical square-board constraint. Folding is intentionally allowed to expose and permanently reveal additional real tiles. Classic restores the earlier presentation; it does not erase monotonic map or Book knowledge.

## Source assessment

The central geometry is coherent. `calculateExploreLayout` supplies one board and rail result; the board content box is divided by the same fractional column and row counts passed to `getCameraWindow`. Terrain, liquid, foreground, actor, pointer and reward projection therefore retain one physical scale on each axis rather than stretching a 6×6 scene. The retained world window rounds outward to whole tiles before adding the existing gutter. `visibleKeysInWindow` applies one centre-entry rule, and App passes that set to current map coverage, visible objects and Book enemy/friend discovery instead of silently recomputing the old 6×6 view.

The new reveal effect is appropriately monotonic and leaves run/profile schemas unchanged. Classic and fold changes clear held input. Existing scene resize ownership remains responsible for settling travel and updating terrain, liquid, foreground, actor and reward geometry. The final evidence exercises that child-to-App resize boundary during walking, jumping, camera rebasing and grounded-loot presentation; I found no second camera clock, schema mutation or competing visibility owner.

The r3 packet exposed four useful problems, but it is no longer the current contract result. The source-matched `explore25-contract-r2` packet passes 23/23 cases. In that packet, the folded 960×540 rail visibly contains all five friends and all seven Bag items; the enlarged 844 and 1280 layouts have a bounded scrolling region with reachable Bag, pad, More and hint; and Classic returns focus through both view changes. Those three earlier blockers are resolved by current evidence.

The ultrawide behavior is also coherent after the plan correction. Six cells is the starting scale, while the twelve-cell long-axis cap may reduce the short-axis count on very wide panes so the board continues to consume the pane. Cells remain square, neither axis exceeds twelve and the retained backing remains at most sixteen cells per axis. That is an intentional space-use tradeoff rather than a broken minimum.

One source issue found in r3 remained relevant to the r2 bytes: Explore-expanded phone mode made very small friend and Bag cells real buttons because interaction eligibility followed `compact` rather than physical density. Frozen `c931bc3` corrects that with `statusOnly = compact || (explore && (phone || classicCompact))`, so short-screen cells become labelled status images and their complete details remain available through More. DialogShell now carries the stage scale through its portal and the dialog CSS layer gives those detail actions a 44px physical minimum. Persistent toolbar actions have an explicit 28px physical minimum, consistent with the latest Human choice to retain the small desktop-like phone composition; this is not evidence of universal 44px target conformance.

Frozen `c931bc3` also resolves the enlarged folded-reader semantics mismatch: its reader-specific rule restores the objective card, while the bounded reader continues to contain status and collection content and fixed controls remain outside it.

## Independent visual evidence

I independently inspected representative expanded and folded r3 captures at 568×320, 844×390, 960×540, 1194×834, 1920×1080 and 2560×1080, then refreshed the material cases against r2 and the final short-layout direction against r4 at 568×320, 780×450 and 900×500. The maze is materially larger, cells remain square, the wall/actor/foreground composition is not visibly stretched, and the rail is legible as a distinct control surface. The 844 folded view usefully exposes an additional friend, boots and poison region while keeping Power, currencies, friend/Bag counts, minimap and pad present. The 780 and 900 folded layouts place map and pad side by side without clipping the collections. The 1920 and 2560 views make good use of horizontal space without reopening the accepted interior wall design.

The supplied r3 Playwright report is not clean: it records six expected results and one unexpected 960×540 folded result. I retain that result as the reason the short-rail correction exists, not as the current disposition. The later r2 report records 23 expected results, no unexpected or flaky results, including Classic focus, actual-view fog and monotonic knowledge, and fold-during-walk/jump settlement in Full, Lite, Reduced and Static. The r4 composition packet records nine expected results with no unexpected or flaky result, adding 780×450 and 900×500. A subsequent frozen-browser run recorded 27 passes and one 27.59px More-detail failure. That exposed a real portal-scale/CSS-layer omission; the source-matched `explore25-touch-r2` follow-up passes all five affected touch and enlarged-reader cases after the `c931bc3` correction. The result set must be reported as 27/28 plus a corrected 5/5 follow-up, not one clean 28-case run.

The first five-pair moving-frame comparison contains a real but clustered tail. At 844×390, two adjacent candidate pairs have p95 33.4ms and 21/23 intervals over 20ms, while the other three candidate pairs return to p95 16.8ms and 2/1/1 intervals. At 2560×1080, the final baseline and candidate pair degrade together to p95 33.4ms, with 26 and 23 intervals over 20ms; total over-20 counts are 33 on each side. I retain the candidate phone 50.1ms worst interval and the candidate/baseline ultrawide 50.1ms worst intervals.

The required repeat does not reproduce the phone cluster. All ten confirmation rows have p95 16.8ms; candidate over-20 counts are 1/1/1/1/1 and its worst is 33.4ms, versus baseline 0/0/4/2/3 and 33.5ms. Jumping also keeps every measured p95 at 16.8ms: candidate phone over-20 counts are 0/0/0/1/1 and ultrawide 0/0/0/0/0, versus baseline 1/0/1/0/1 and 3/1/3/0/1. Every idle row has zero intervals over 20ms and a worst of at most 17ms.

The traced moving totals show a mixed, bounded cost rather than parity. At 844×390, median Paint falls 883.378→763.043ms, Layout 148.508→102.986ms and UpdateLayoutTree 646.429→634.053ms, while RasterTask rises 43.213→52.218ms over the route. At 2560×1080, Paint falls 910.980→838.096ms and Layout 349.622→308.948ms; RasterTask rises 50.577→53.034ms and UpdateLayoutTree 489.263→516.809ms. Trace durations overlap and are not additive.

The larger view has a material retained-surface cost. The trace reports one additional layer; the largest CSS layer grows 1,345,600→2,152,960 pixels on phone (+60.0%) and 2,913,849→5,655,040 on ultrawide (+94.1%). Those rectangles are not allocated GPU-memory measurements. The fixed twelve-cell viewport cap, bounded sixteen-cell retained axes and Classic fallback are therefore important limits. The evidence did not justify a late gutter change, and frozen `c931bc3` correctly leaves it unchanged.

All five final reports bind the same candidate source and JS hash. Their SHA-256 values are:

| Report | Rows / measured | SHA-256 |
| --- | ---: | --- |
| `explore25-moving-frames` | 24 / 20 | `f6be476207acd0136cee1e403a4b971521aef2cd1385f4d90de8416658461987` |
| `explore25-moving-work` | 24 / 20 | `2eb0cd2f38cbc050ea0ea8af5f4fa2089a6f5af8b581bad475d7cda793b1bad7` |
| `explore25-phone-confirmation` | 12 / 10 | `d38e050d4531749e593a197b90d23b789806aed75ad4b4b33591a8306da6b6fc` |
| `explore25-jump-frames` | 24 / 20 | `e1a18d7637d4aea7db08ccb1184e05d77885c53e005bfe3a7ed5fd5119d0e2a7` |
| `explore25-idle-frames` | 24 / 20 | `0e12f978eace2a0eafe7c61cd69ed790fe55777cc27821338e59addfdd3657c3` |

Across 108 rows and 90 measured rows, moving returns after 16 steps, jumping after eight and idle after zero. All rows preserve their route position and report zero page errors, broken images and terrain mutations. The source identity is `c931bc3`; runtime inputs are `29ad749020187674b297951cde0095c97b79cbe354ce0252d4278a756d06b91a` and the dist fingerprint is `2d36f270def90ae2730c58d6d2832f15b9d4a3bfa20d9ec3c1ac6524fe4438e6`.

## Disposition and limits

The corrected evidence covers the required behavior as a union of source-matched packets, not one invented clean run. The frozen browser result is 27/28 with the retained portal-target failure; `explore25-touch-r2` then passes the affected touch and four reader cases 5/5 on `c931bc3`. The wider evidence union records 64 distinct current passing contracts. It includes keyboard and Classic return focus, touch with safe areas, actual-view fog and monotonic knowledge, Full/Lite/Reduced/Static walk and jump settlement, rebase and portal boundaries, and Gold/Science grounded-loot conservation through phone and tablet fold/expand resizing.

I support bounded web promotion of `c931bc3`. The repeated frame cohort, jump cohort, idle cohort and traced totals are sufficient to treat the initial phone cluster as retained unexplained variance rather than a reproduced candidate regression. This does not erase that cluster or establish performance on affected physical devices.

The compact rail deliberately treats tiny friend and Bag art as status, not per-item controls; More is required for its 44px detail actions. Persistent phone toolbar actions are 28px. The layout is visually coherent in the inspected Chromium captures, but this review does not claim Human acceptance of the final proportions. Physical iPhone13/iPad8, WebKit, native packaging, GPU allocation, low-memory behavior and thermal endurance remain open. Those limits should stay in the release receipt and Human queue.
