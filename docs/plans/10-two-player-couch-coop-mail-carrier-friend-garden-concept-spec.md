# Puzzlewild Post: Special Delivery Duo and the Friend Garden

> **Exploratory concept and scope specification — non-canon pending Human approval.**
>
> This document refines the Human's September 2026 concept into a coherent product pitch and testable rules proposal. It is **not** the Plan 10 implementation plan, does not authorize implementation, and does not change Plans 01–09, the solo campaign, current product authority, or implementation order. Any implementation remains after Plan 09 unless the Human explicitly reprioritizes it.

## 1. The pitch

**Working title: Puzzlewild Post.** In two-player play, Ame is joined by a tiny flying magical mail carrier: either Ponchi, an original bat-winged postling, or Melty, a cheerful winged magical girl with a mailbag. Ame still walks the maze, solves its route, controls the camera, and completes its story. The Courier flits around the same visible maze, collects lost letters, points things out with bright postal pings, carries useful objects through impossible gaps—and, when the mood is right, steals a key and makes Ame chase her for it.

The mode deliberately has two different kinds of cooperation. Every ordinary maze gains a repeatable lost-mail hunt: some letters are in plain sight, while others are concealed under obvious search spots that only Ame can uncover and only the Courier can collect. That creates a dependable warm-fuzzy rhythm even when P2 chooses not to shortcut the puzzle. Ordinary Duo also embraces family “house rules”: P2 may fly a real portable item over walls and hazards, hand it to Ame, or play keep-away. This can make a solo maze hilariously easy, and that is an accepted feature of the separate Duo record lane—not a balance bug to disguise.

Finishing mazes safely delivers the collected mail. Each 15 letters earns a Friend Egg, with the remainder carrying forward. Eggs hatch in a shared, no-failure Friend Garden into a new rescue-friend species, fruit, Science Points, or a lasting toy. Ame and the Courier can wander together, hatch eggs, carry and gently toss friends, shake fruit from trees, feed everyone, and enjoy the little personalities they have collected. Solo players receive the same Garden and can earn every reward through Science Points; co-op simply makes the collection journey faster and more social.

For families who want a true two-person puzzle game, a separate **Special Delivery Routes** campaign uses the same characters in the same shared maze. Those routes are authored around aerial item relays, paired ground-and-air switches, and small safe wall transformations. They require two players, but never gate or replace the complete Solo Adventure. No split screens, parallel maps, or “you solve yours while I solve mine”: both players should be looking at, talking about, and laughing at the same problem.

### The promise in one line

> **Ame finds the way, the Courier finds the mail, and together they bring new friends home.**

```text
Ame explores and uncovers
          ↓
Courier collects, pings, delivers—or teases
          ↓
Both finish the maze and safely post the mail
          ↓
Friend Egg → shared surprise → Friend Garden play
```

## 2. Status labels used in this document

- **Human direction** means an idea supplied or explicitly accepted by the Human in the current conversation. It is the basis of this refinement, but remains non-canon until the whole concept is approved.
- **Repository fact** means evidence from the current code or maintained specifications. The repository may continue to move during Plans 01–09.
- **Recommended rule** means a concrete design decision proposed here so the concept can be evaluated as a whole.
- **Open decision** means a choice that must be confirmed before an implementation plan can become authoritative.
- **Backlog** means intentionally excluded from the first approved scope even if the idea is appealing.

Where a recommended rule conflicts with current authority, this document names the conflict. It does not silently supersede it.

## 3. Product shape

### 3.1 Four connected experiences

| Experience | Players | Purpose | Relationship to solo |
|---|---:|---|---|
| **Solo Adventure** | 1 | The complete authored Maze so Puzzle campaign and its intended route, Power, equipment, hazard, rescue, and backtracking puzzles | Solo maze rules and authored routes stay unchanged and remain the default; the optional Garden/Science metagame is a separately approved addition |
| **Special Delivery Duo** | 2 | A playful optional layer over ordinary campaign mazes: mail, pings, item carrying, assistance, and recoverable mischief | Same story and levels, separate Duo records; balance-breaking help is explicitly permitted |
| **Special Delivery Routes** | Exactly 2 | A separate short campaign of genuine same-maze cooperative puzzles | Optional bonus campaign; never gates Solo Adventure or makes solo completion incomplete |
| **Friend Garden** | 1 or 2 | A cozy shared reward space for hatching, collecting, feeding, carrying, tossing, and watching friends | Fully available solo; co-op accelerates eggs but owns no exclusive friends, toys, or care actions |

### 3.2 Product pillars

1. **The same room, the same maze, the same conversation.** Both players see and affect one shared problem. P1 remains camera authority.
2. **Helpful, mischievous, never destructive.** P2 may bend a maze and tease Ame, but cannot erase an item, corrupt progress, create an unrecoverable soft lock, or invalidate Solo records.
3. **Each player is necessary for the signature reward.** Ame reveals hidden mail; the Courier collects it. Neither role can complete the full mail hunt alone during Duo.
4. **A reward both players can touch.** The Garden turns abstract completion into funny, affectionate shared play rather than another score screen.
5. **Solo is complete, not second best.** Story, friends, toys, and the Garden are all obtainable alone. Dedicated Duo content is a separate bonus, not a missing chapter.
6. **Rules may be permissive; state must be deterministic.** The game can allow chaos without allowing ambiguous saves, duplicate rewards, lost keys, or unstable outcomes.

### 3.3 Explicit non-goals for the first release

- Rebalancing every solo maze around two players.
- Making ordinary Solo Adventure levels require P2.
- Split-screen, second-map, or asynchronous parallel-puzzle play.
- Guardian combat spells, Power reduction, or a second combat system.
- A simulated pet-needs game, friendship stats, breeding, aging, illness, hunger, neglect, or death.
- Garden races, competitive minigames, crafting, a shop, daily timers, rotating stock, real-money purchases, or premium eggs.
- Online multiplayer, remote play infrastructure, trading, or user-authored mail.
- Full physics simulation for friends, eggs, toys, or tethers.
- P1 appearance selection; it remains a future character-system extension after P2 proves the pattern.

## 4. Player jobs and play loops

### 4.1 Ame / Player 1

**Functional job:** navigate the grid, choose the route, move the camera, expose hiding places, use equipment and keys, resolve guardians, rescue friends, decide when to exit, and operate ground mechanisms in Duo Routes.

**Emotional job:** feel like the brave maze-solving lead without having to do everything alone. Ame gets moments of discovery (“I found one!”), trust (“bring me that key”), comic pursuit (“come back here!”), and care in the Garden.

**Social job:** give P2 useful information and access, ask for deliveries, respond to pings, set the shared pace, and sometimes catch a cheeky Courier.

### 4.2 Ponchi or Melty / Player 2

**Functional job:** fly freely inside Ame's current visible play area, collect mail, point with limited pings, transport one real maze pickup, make or accept a handoff, operate aerial mechanisms in Duo Routes, and help shake down fruit in the Garden.

**Emotional job:** feel nimble, funny, competent, and independently busy—not like a cursor attached to P1. P2 should frequently choose between searching, guiding, helping, showing off, and gentle teasing.

**Social job:** notice things Ame misses, ask Ame to uncover a hiding place, negotiate over an item, execute a relay, and create shared jokes without owning the whole solution.

### 4.3 The 30-second ordinary-maze loop

1. Ame advances the route and moves the shared camera.
2. P2 sweeps visible corners, grabs a letter, or pings a suspicious cover.
3. Ame steps on the cover and reveals hidden mail.
4. P2 collects it, then spots or carries the next useful object.
5. They celebrate a delivery, negotiate a handoff, or begin a brief chase.

P2 should normally have a meaningful choice at least every 8–12 seconds while the maze is in free play. “Meaningful” includes choosing a search route, collecting mail, pinging, taking/offering/dropping an item, dodging Ame with cargo, or interacting with a Duo mechanism—not merely circling decoratively.

### 4.4 The five-minute loop

- Explore several camera regions together.
- Find a mixture of visible and hidden letters.
- Use at least one ping to coordinate.
- Experience at least one delivery, playful theft, or chase around a useful item.
- Resolve a maze problem and reach the exit.
- See mail cross the next Egg threshold or make visible progress toward it.
- Optionally visit the Garden to hatch, feed, play, and decide whether to run one more maze.

### 4.5 Mixed-skill family fit

- **Child as Ame, adult as Courier:** the adult can quietly fetch a missed tool, point out a route, or simply collect mail without taking Ame's movement away. The child still owns the protagonist and the finish.
- **Adult as Ame, child as Courier:** the child gets continuous free movement, collecting, pointing, and comedy without bearing responsibility for the whole route. Hidden mail gives the child a reason to ask the adult for help.
- **Two children:** both roles have visible power. The system permits teasing but provides Snatch, End Duo, and reset/recovery so an argument cannot permanently damage the run.
- **Role swapping:** controller seats may swap between mazes or from the Garden's pause screen. Mid-puzzle role swaps are excluded from v1 because they make saves, tutorials, and cargo ownership needlessly ambiguous.

No onboarding copy calls either role “easy,” “helper,” “junior,” or “assist.” The roles are **Ame** and **Courier**.

## 5. Character direction

### 5.1 Shared mechanical identity

Ponchi and Melty are mechanically identical. Both are available from the start of Duo, use the same hit/interaction footprint, speed, cargo capacity, pings, animations, and accessibility options, and confer no statistical advantage. Character choice is expression, not difficulty.

The selected Courier can be changed from the home Duo panel or Friend Garden. A run never changes record class because the visual avatar changed.

### 5.2 Ponchi: the Puzzlewild postling

**Human direction:** Ponchi should capture the warmth and comedy of a tiny fantasy mail carrier with little bat wings and a satchel.

**Recommended original direction:** Ponchi is a cinnamon-and-plum **postling** with broad envelope-fold ears, tiny midnight wings, a postage-stamp-shaped tail tip, mint satchel, ink-smudged paws, and a silhouette built around a pear-shaped body rather than a white bear/koala. Ponchi chirps postal nonsense of Puzzlewild's own invention and never says “kupo.” The satchel is the strongest identifying prop.

Square Enix's own creator interview describes the Moogle design lineage as combining a white koala-like creature with bat elements and later a head puffball. Creative distance therefore needs more than a new name: Ponchi should avoid that combined silhouette, a large or red round nose, forehead pom/antenna, white body, Moogle speech, and closely matching proportions. This is design-risk guidance, not legal clearance; final naming and concept art still require an originality review.

### 5.3 Melty: the magical night-post Courier

**Human direction:** Melty is a cute tanned blonde magical girl with bat wings and a mailbag.

**Recommended original direction:** Melty has warm brown skin, a honey-blonde bob or short twin braids, plum bat wings, and a coral-and-mint postal coat with oversized stamp-shaped clasps. Her tiny board representation must remain readable beside Ame and cannot reuse Ame's silhouette, palette hierarchy, transformation motifs, or costume structure. Her flight should feel exuberant and slightly overconfident; her idle business includes sorting envelopes and discovering that one is stuck to her sleeve.

Melty is not a smaller Ame and Ponchi is not the “child option.” Selection copy describes personality only: **Ponchi — pocket-sized postal rascal** and **Melty — magical express Courier**.

## 6. Ordinary Special Delivery Duo: exact working rules

### 6.1 Entering Duo

**Recommended rule:** P2 may join from the home screen or during free gameplay in a resumable curated maze. A successful Seat 2 join immediately and permanently marks that run as `Duo`, even if P2 later leaves. This prevents a balance-breaking item delivery from entering Solo records.

P2 spawns beside Ame with an empty cargo slot, an empty in-run mail satchel, and three ready pings. Joining does not reset Ame's run. Previously passed mail remains where authored and may require backtracking.

Story, rescue, Gold, Science, and level completion remain valid in Duo. Solo and Duo are equally valid ways to complete the adventure, but they retain separate performance records.

### 6.2 Camera and flight boundary

Ame is the only camera authority. P2 can never pan, pull, widen, delay, or veto the camera.

The Courier's permitted region is the current board camera rectangle, inset by a small visual margin so her sprite and cargo remain readable. P2 may occupy normal wall, closed-door, water, lava, poison, Spring-hole, portal, and guardian cells. Those cells neither collide with nor harm the Courier.

P2 world interaction uses one exact predicate:

```text
courierCanInteract(cell) =
  runStatus == playing
  AND interactionContext == freeGameplay
  AND currentCameraRectangle contains cell
  AND effectiveAmeReveal contains cell

effectiveAmeReveal =
  explorationMode ? AmeExplorationReveal : every in-bounds level cell
```

The effective full-level case is required for small non-exploration mazes, whose current runtime does not populate reveal/camera tile sets. P2 never reveals a tile, label, object, route, secret, or topology. Flying over an unrevealed position has no reveal effect. In the current game, the camera is a rectangular view rather than wall-blocked line of sight; the Duo rule deliberately follows that established visual contract.

When Ame scrolls the camera or takes a portal, P2 keeps the same normalized screen position and is clamped inside the new rectangle. Normal motion uses a very short glide; reduced-motion mode snaps immediately. Cargo travels with P2. This creates no offscreen travel state and no camera tug-of-war.

During pause, story, dialog, rescue, guardian, hint, inventory, and victory presentation, Courier gameplay inputs freeze and the sprite docks unobtrusively near Ame. When P2 overlaps Ame, a guardian, an objective, or a clue, the Courier becomes partially translucent with a high-contrast outline; she never covers critical state.

### 6.3 Lost mail

Each ordinary Duo run instantiates stable, authored mail slots as a non-colliding overlay. Mail does not exist in Solo and does not alter terrain, route validity, the solo solver, or object placement.

**Provisional post-Plan-09 allocation:**

| Final maze maximum dimension | Total letters | Hidden letters | Plainly visible letters |
|---|---:|---:|---:|
| 10 or less | 6 | 2 | 4 |
| 11–13 | 12 | 4 | 8 |
| 14–18 | 15 | 5 | 10 |
| 19–21 | 18 | 6 | 12 |
| 22–24 | 21 | 7 | 14 |

Applied to the current 16-maze size distribution, these bands average about 14.8 letters per maze while avoiding the absurdity of placing 15 letters in the current 6×6 opening maze, which has only 14 non-wall cells. Final quotas and placements wait for Plan 09's 24 layouts.

Every mail slot has a stable ID and one of three states: `concealed`, `revealed`, or `collected`. Approximately one third are hidden. Placements must not overlap a base pickup, guardian, friend cage, portal, Spring, hazard, start, exit, or another letter.

- A visible letter can be seen only when its cell is already revealed and inside the live camera.
- A hidden letter sits beneath a legible, non-blocking search-spot overlay: a little mat, leaf pile, cushion, or parcel cover.
- **Recommended v1 reveal verb:** Ame reveals a cover by stepping on its floor cell. The visual may look like lifting a mat or bumping a light box, but the rule remains one deterministic step trigger and adds no general search button.
- P2 may ping a cover but cannot open it. P2 proximity and flight never reveal it.
- Ame cannot collect a revealed letter. Passing over one produces a tiny “For your Courier!” response.
- P2 collects when the Courier centre is within 0.40 tile of the letter centre. Mail flies into the magical satchel and does not occupy physical cargo capacity.
- Revealed and collected states persist through a Garden detour and active-run save.

**Recommended reward timing, following the Human's pitch:** letters are safe in the in-run satchel, but they are delivered to the profile only on successful maze completion. Restarting or abandoning restores the maze and forfeits that run's undelivered mail; a controller disconnect or Garden detour does not. This makes the maze finish the shared act and prevents restart farming.

Mail respawns on every completed Duo replay. This is deliberate: mail is P2's ongoing role, not a one-time collectible that disappears after the campaign, and Garden fruit/toys remain low-stakes sinks for later eggs. A level may remember `best mail found / available`, but an incomplete count is never graded as failure.

Repeatability makes short-maze Egg farming possible. That is an accepted low-stakes possibility, not an excuse to ignore distorted play: telemetry must attribute delivered mail and Eggs to level, duration, and replay ordinal. Revisit quotas or move repeat rewards toward fruit if the shortest two mazes generate more than half of mail Eggs, or if families repeatedly choose them for efficiency while saying they would rather play another maze.

At victory:

```text
combinedMail = savedMailRemainder + deliveredThisMaze
eggsAwarded  = floor(combinedMail / 15)
newRemainder = combinedMail mod 15
```

Thus a profile with 10 letters that delivers 6 earns one Egg and carries 1 letter forward. The conversion and save are atomic. Reaching the exit never requires every letter and never blocks on P2; the result screen celebrates what was found and shows progress to the next Egg without scolding.

Surprise Maze mail is backlogged for v1. Generated slot identity, farming, and unresumable sessions should not be smuggled into this concept before the curated campaign is proven.

### 6.4 Postal pings

P2 has three independent ping charges. A ping targets a point in the current board and creates a bright postal-stamp marker for three seconds. It reveals no fog, label, item, route, hint, or collision information.

Each spent charge returns exactly 10 unpaused seconds after its own use. P2 can therefore fire an excited three-ping burst but cannot cover the board indefinitely. Pause and presentation locks stop the timers.

Every marker communicates through a labeled shape and high-contrast outline as well as colour, animation, sound, and optional haptics. Reduced-motion mode replaces expansion with a static stamped outline. A no-charge press gives only P2 a quiet empty-satchel response.

Pings are intentionally expressive. P2 may point at a hiding spot, the desired route, Ame, or a silly decoration. They have no mechanical authority.

### 6.5 Carrying real maze items

**Human direction:** P2 may break ordinary-maze balance by carrying real pickups across walls, doors, and hazards. The game should embrace this honestly as an alternate family ruleset.

To make “any item” deterministic, v1 uses an explicit portable allow-list:

- weapon / Polite Sword;
- Splash Boots;
- Spring Boots;
- Antidote Leaf;
- Power potion or equivalent immediate Power pickup;
- reusable keys;
- Gold treasure; and
- Science treasure (`treasure` with Science currency).

P2 cannot carry walls, doors, hazards, Spring terrain, portals, guardians, cages, rescued friends, objectives, or the exit. These are fixtures, actors, or coordinates rather than portable pickups. P2 cannot remove anything already resolved into Ame's Bag, equipment, Power, or reward state.

The Courier has exactly one physical cargo slot. Taking an eligible item removes it visibly from its world cell and places it in P2's hands, but **does not apply the item's effect**. A carried key opens nothing, carried Boots protect nobody, and a carried potion changes no Power. The ordinary pickup effect occurs only when Ame receives it or when deterministic recovery resolves it.

Every portable item has one authoritative, exactly-once state rather than a separate “relocated” flag:

```text
atOrigin | carriedByCourier | droppedAt(cell) | resolvedByAme | closedUnclaimed
```

Ame collecting an item from its origin or a legal dropped cell transitions it to `resolvedByAme` exactly once. Offer, Snatch, and explicit recovery use that same transition. P2 may take an `atOrigin` or `droppedAt` item while the cargo slot is empty and the Courier centre is within 0.40 tile of the item centre. `closedUnclaimed` is a terminal end-of-run cleanup state and never grants its effect or reward.

This means P2 may take a key from behind its own locked door, bring Spring Boots over a hole, rescue Science from an optional branch, or make Ame chase the sword around the viewport. That is the intended comic power of ordinary Duo.

### 6.6 Handoff, chase, Snatch, and drop

P2 has four possible cargo choices:

1. **Carry:** keep the item until an Offer, Snatch, Drop, explicit recovery, or run end. No timer silently teleports it away.
2. **Offer:** within 0.75 tile of Ame, press Interact to present the item. Ame accepts with her Interact action; the normal pickup rule then resolves.
3. **Be caught:** Ame can **Snatch** cargo from an initial wall-ignoring radius of 0.75 tile by pressing Interact. Carrying limits P2 to 85% of normal flight speed. After eight unpaused seconds, a visible **Return Ribbon** begins connecting Ame to the cargo; over the next 12 seconds it expands Ame's Snatch reach to the whole camera. P1 must still choose to press Interact—nothing returns automatically—but an engaged Ame can always end a chase. Ribbon age follows that item across Drop/re-take and resets only when Ame resolves it or the run resets.
4. **Drop:** place the item on the nearest revealed, walkable, non-hazard, unoccupied floor cell within one tile. Equal candidates resolve in stable row-major order. If no legal cell exists, the drop fails and P2 keeps carrying.

If Ame and P2 attempt to take the same unresolved world item on the same simulation tick, Ame wins. Once P2 is already carrying it, the Offer/Snatch rules apply.

At successful maze completion, any item still `carriedByCourier` or `droppedAt` becomes `closedUnclaimed`: it grants no Power, equipment, key, Gold, or Science. P2 must actually deliver it, let Ame catch it, or place it where Ame collects it for the benefit to count. This preserves the negotiation instead of turning exit into a free global handoff. On restart or abandonment, all base items return to authored state. A Garden detour and active-run save preserve the exact item states.

The game does not score keep-away duration, reward obstruction, call P2 naughty, or turn sibling conflict into an optimization target. The fun is social and optional.

### 6.7 Harmless mischief without a valuable hostage

When P2's cargo slot is empty, the Drop/secondary button becomes **Postmark Boop** within 0.75 tile of Ame. It stamps one of several silly two-second postal reactions—an envelope stuck to Ame's bow, fluttering stamps, or a tiny “express” halo—without changing movement, input, collision, steps, Power, inventory, or presentation timing. It has a four-second unpaused cooldown. Ame can Interact within the same radius of an empty-handed Courier to stamp her back.

Postmark Boop is the always-available joke verb for families who do not want to gamble a key on mischief. It is disabled during modal/presentation locks and has static, silent, and reduced-motion responses.

### 6.8 Disconnect, leave, and recovery

Ordinary Duo must permit mischief without permitting permanent hostage state.

If P2 disconnects or chooses Leave, gameplay pauses at the next deterministic action boundary and P1 chooses:

- **Reconnect or reassign the Courier**;
- **Secure satchel, resolve cargo, and continue Solo**; or
- **Restart the maze**.

Continue Solo preserves already collected in-run mail in the active satchel—letters still bank only at successful victory—and transitions every `carriedByCourier` or `droppedAt` portable item to `resolvedByAme` in stable ID order. If a future item cannot legally resolve, it returns to its authored origin. Already resolved items are never processed twice. The run remains a Duo record forever.

While P2 is still connected, there is no remote “summon my key” button. P1 retains **End Duo** in the pause menu, which invokes the same recovery choices. This is the boundary between playful agency and an actual soft lock.

If Seat 1 disconnects or leaves, the game also pauses. Seat 2 receives recovery-menu authority only and may reconnect/reassign Ame, bind the remaining device to Ame and continue Solo through the same cargo recovery, save and return home, or restart. P2 never inherits camera/gameplay authority silently. Dedicated Special Delivery Routes do not offer Continue Solo because their rules genuinely require two seats; losing either seat permits only reconnect/reassign, reset the current Duo room, or save and return to the Duo map.

### 6.9 Ordinary-maze interaction matrix

| Existing element | Courier rule in ordinary Duo | Why |
|---|---|---|
| Walls and closed doors | Fly over/through; no collision | Core mischievous fantasy |
| Camera edge | Soft clamp; never pans camera | Ame retains spatial authority |
| Fog/unrevealed cells | Cannot reveal, inspect, target, or interact | Prevent accidental topology scouting |
| Keys | One may be carried, offered, snatched, or safely dropped | Permissive shortcut accepted |
| Doors | Cannot open or carry a door; a delivered key lets Ame use normal rules | Keeps world fixtures with Ame |
| Weapon and Power pickups | May carry; no Power change until Ame receives | Exact arithmetic remains legible |
| Guardians | May overlap visually but cannot target, weaken, move, distract, or resolve | Avoid a second combat/Power ruleset in v1 |
| Splash Boots / water / lava | May carry Boots; all terrain is harmless to P2 | P2 may intentionally bypass route gating |
| Antidote Leaf / poison | May carry Leaf; poison is harmless to P2 | Same permissive rule |
| Spring Boots / holes | May carry Boots; flies over holes; cannot trigger Ame's jump | P1 still performs traversal |
| Portals | Cannot activate by contact; follows camera when Ame teleports | Prevent separate-world state |
| Gold / Science | May carry and deliver; reward resolves only to shared profile | Supports “you missed this” help |
| Letters | Unlimited separate satchel; only P2 collects after reveal | Signature P2 job |
| Hidden covers | P2 can ping; only Ame's step reveals | Guaranteed reciprocity |
| Cages and rescued friends | Cannot carry, open, or relocate; Ame uses normal rescue rule | Protect story/objective semantics |
| Exit/objective | Cannot carry, trigger, block, or move | Ame remains finish authority |
| Hints | P2 may view and ping, but P1 owns activation | Avoid UI conflict |
| Story, dialogs, menus, victory | P2 freezes/docks; P1 controls shared progression choices | One safe UI authority |
| Environmental flourishes | May trigger explicitly marked cosmetic reactions only | Gives charm without state risk |

Once P2 relocates a base item, a Solo route hint may become false. Ordinary Duo therefore requires its own current-state hint/solver model before unrestricted cargo can ship. It must retain the established progressive hint tiers while modelling `carriedByCourier`, `droppedAt`, Offer/Snatch, and recovery as legal role-attributed actions. **Melty is carrying the blue key; Ame can catch her or ask for delivery** is valid state guidance inside that ladder, not a substitute for a Required Path hint. If that model is deferred, base-item carrying must also be deferred; the game must not silently degrade the maintained hint contract. The Solo solver remains untouched and authoritative for Solo.

### 6.10 Deterministic rules clock and priority

Continuous flight and simultaneous buttons use a fixed 60 Hz Duo rules clock with visual interpolation. Every duration above converts to integer unpaused ticks. A future performance plan may validate a different fixed rate, but it cannot use variable frame time for authoritative cooldown, catch, hatch, or switch state.

Each tick resolves in this stable order:

1. connection, pause, leave, restart, and recovery commands;
2. Ame grid movement, base collision, and direct world pickup;
3. base consequences, exploration reveal, hidden-cover reveal, and camera update;
4. normalized Courier flight and camera clamping;
5. a simultaneous Offer+Accept pair, then Ame Snatch, then P2 Take/Drop, letter collection, Ping, and Postmark Boop; and
6. Duo mechanisms, presentation events, and save/transaction requests.

Ame therefore wins an exact race for the same world item. Each button edge produces at most one rules action, and equal interaction targets resolve by stable object ID then row/column. P1's Interact is a new Plan 10 semantic action—the current game is movement-driven and Plan 08 intentionally leaves controller A unused during free movement—so it requires explicit approval, mapping, tutorial, and regression testing rather than being treated as already available.

## 7. Special Delivery Routes: the co-op-only campaign

### 7.1 Why this separate campaign exists

Ordinary Duo is a joyful alternate ruleset, not a precisely balanced puzzle. The separate campaign converts the same fantasy into authored cooperation: one player cannot finish alone, each role repeatedly unlocks opportunities for the other, and both remain in the same visible maze.

These levels live on a clearly separate map or shelf labeled **Ame + Courier — Two Players Required**. They do not occupy slots in the 24-level Solo Adventure, gate story completion, hide a required rescue friend, or make a solo profile look incomplete.

### 7.2 Shared-camera room grammar

Most cooperative puzzle rooms should fit within one camera frame. Larger levels connect several such rooms with joint checkpoints. Ame still owns camera transitions, but a room locks its framing while a cooperative sequence is active so an accidental step cannot sweep P2 away mid-action.

Normal walls remain fly-through for P2. Co-op levels add a clearly distinct **postal ward / headwind ribbon** that blocks P2 and carried cargo but not Ame. Ame's ground actions can open or redirect these air routes, giving P1 meaningful ways to help P2 rather than making all cooperation flow toward Ame.

### 7.3 Initial mechanism set

Only three new deterministic mechanism families are required for the initial campaign:

1. **Ground-and-air stamp pairs.** Ame holds or activates a floor stamp while P2 touches a floating seal. When both are active for a short forgiving beat, the linked gate latches or changes state. The roles are spatially distinct but visually connected.
2. **Parcel relays and sorting flaps.** Ame reveals/releases a key, tool, or parcel; P2 carries it through a grate, wall, or wind route; then Ame catches it or P2 deposits it on a marked receiver. A reversible aerial sorting flap can redirect a light parcel along one of two visible rails: flipped at the wrong moment it sends the parcel on a funny harmless loop, while coordinated timing turns the same prank into the solution. Later rooms reverse the dependency by making Ame open the sky route first.
3. **Rail-bound wall turns.** P2 holds an aerial handle while Ame activates its ground control, then the wall moves between authored anchor positions. It cannot move into either player, an item, a guardian, or an invalid topology state. No freeform wall editing exists.

Every room has **Reset Duo Room**, restoring players, cargo, mail, switches, sorting flaps, and walls to a validated checkpoint. Reversible controls may create a visible detour or comic mistiming, never injury, deletion, or an unrecoverable topology. Dynamic topology, cargo, and required simultaneous actions demand a separate finite Duo rules model, validator, hint system, and solver before production authoring.

### 7.4 Recommended six-route launch campaign

The names are placeholders, but the learning sequence is intentional:

1. **The First Delivery** — one visible letter trail and one unreachable key relay teaches that Ame receives what P2 carries.
2. **Under the Welcome Mat** — P2 spots and pings covers; Ame reveals hidden letters; the pair completes a simple two-role objective.
3. **Two Sides of the Stamp** — Ame opens a headwind route for P2; P2 reaches a floating seal that opens Ame's gate.
4. **The Turning Post** — the pair safely rotates one rail-bound wall, first with a preview and then as part of a route choice.
5. **Parcel Priority** — the Courier has one cargo slot and the pair must decide which item to relay first and when to flip a sorting flap; playful mistiming and correct coordination use the same verb.
6. **The Grand Delivery** — a longer but still readable finale combines hidden mail, reciprocal air access, one wall turn, and a final item handoff.

The campaign should be harder than the Solo Adventure in reasoning, not harsher in execution. Simultaneous holds use generous timing, no challenge requires precision flying under time pressure, and every dependency is visible in the shared frame.

Mail remains an optional egg bonus inside these routes unless a level explicitly teaches mail as its stated objective. Missing an optional letter never invalidates a solved cooperative puzzle.

Dedicated routes use authored stable mail slots and the same completion-only banking, 15-letter profile conversion, replay policy, and one-third hidden target as ordinary Duo. A route may explicitly choose a lower size band when puzzle mechanisms need visual breathing room. If mail is a required tutorial objective, that requirement appears in the level goal and Duo solver; otherwise it remains optional. Room reset restores every unbanked letter in that room to its checkpoint state, and no profile mail commits until the whole route succeeds.

## 8. The Friend Garden

### 8.1 Fantasy and access

The Friend Garden is a gentle open, maze-like clearing where everyone the family has hatched lives together. It uses the normal game shell and viewport; the main maze board swaps to the Garden scene while the surrounding UI, pause language, accessibility settings, and seat ownership remain familiar.

**Recommended unlock:** after the first curated Adventure maze is completed in either Solo or ordinary Duo, the Garden introduces itself with one guaranteed Welcome Egg. This prevents a solo child from opening an empty feature and makes the Garden available before the sparse current distribution of Science Points.

From home, **Visit Friend Garden** opens it directly. During a resumable curated maze, the pause menu's same command saves the active run and enters the Garden; **Return to Route** restores the exact maze, Duo status, mail, cargo, and live logical role assignment. Maze cargo is docked and inert throughout the Garden visit and never enters a Garden care-hold slot. If P2 is absent on return, the ordinary recovery prompt appears. After a reload, physical devices must be neutrally reassigned before returning to Duo because device identity is never saved. Mid-run Garden access for Surprise Mazes is deferred until generated sessions are resumable; the Garden remains reachable from home.

### 8.2 Garden parity

Ame can perform every consequential Garden action alone:

- bump, pick up, set down, and gently throw an Egg;
- greet/pet, feed, scoop, carry, set down, and safely toss a friend;
- bump a tree trunk to release fruit;
- pick up and offer fruit;
- nudge simple toys; and
- hatch every friend and obtain every toy.

In Duo, Ponchi or Melty can do the same actions in flight and can circle/jostle a tree canopy to release its ready fruit. P2 is faster at reaching treetops, not the gate to the interaction.

### 8.3 Egg hatching

An Egg requires three accepted crack actions. Any safe bump, set-down, or gentle throw advances one step; the same action may be repeated, so throwing is never mandatory. Either player can hatch an Egg alone. Same-tick actions resolve in stable Seat 1 then Seat 2 order. Each accepted action advances at most one step; once the third commits the reward, any later same-tick action becomes a cosmetic duet flourish and cannot advance the bag twice. A two-player bump produces extra hearts and comedy but never changes the reward category.

Eggs cannot break incorrectly, roll into a hazard, become unhappy, or be lost. At most three physical Eggs appear in the nest; any additional earned Eggs are represented by a validated mailbox count and instantiate as a stable Egg ID when a nest slot opens. Only one hatches at a time.

Each active Egg stores `eggId`, `eggRulesVersion`, `rewardBagVersion`, `crackCount`, and an exact transaction state:

```text
queued -> rewardReserved -> rewardCommitted -> revealed
```

The bag category is reserved atomically on the first crack. The profile mutation commits exactly once on the third, before the reveal presentation, so reload resumes the same outcome and cannot reroll or duplicate it.

### 8.4 What an Egg contains

A “Friend Egg” carries something kind from the Garden. It usually hatches a new resident, but sometimes opens into a care parcel.

**Recommended transparent eight-Egg bag:**

| Card in each bag | Count | Share | Result |
|---|---:|---:|---|
| New Friend | 5 | 62.5% | One species not yet hatched |
| New Toy | 1 | 12.5% | One unowned permanent Garden toy |
| Fruit Bundle | 1 | 12.5% | Three universal fruit |
| Science Parcel | 1 | 12.5% | Two available Science Points |

The Welcome Egg is Egg ID 1 and consumes the first bag's guaranteed Friend card; it is not a bonus outside the bag. The deterministic shuffle is repaired across bag boundaries so two non-Friend results do not occur consecutively while unhatched eligible friends remain. If the final post-Plan-09 roster remains 15 species, three complete bags / 24 total Eggs contain exactly 15 Friend cards. Recompute that completion promise if the roster changes.

Friend cards select from a deterministic permutation and never duplicate. **Recommended rule:** `eligible species = successfully rescued species - existing Garden residents`. This preserves the emotional meaning and chronology of rescuing someone while remaining fully completable in Solo. If no new rescued species is eligible, the Friend category stays reserved on that Egg; its third crack waits for a future first rescue rather than rerolling into supplies or duplicating a friend.

Toy cards do not duplicate until the initial toy set is complete. After every final-roster species is both rescued and resident, a Friend card becomes a celebratory choice between an unowned toy or fruit—never Science, so Eggs cannot recursively manufacture a long chain of more Eggs. After all toys are owned, Toy cards become fruit. The UI can disclose the current bag's category mix without exposing a manipulative rarity spectacle.

There are no rarity tiers, jackpots, paid eggs, premium currency, near-miss animation, daily claim, countdown, streak, FOMO, or real-money path. Egg rewards are earned play rewards, but their random presentation should still be transparent and bounded for a family game.

### 8.5 Science-funded solo Eggs

**Human direction and authority conflict:** Science Points should be exchangeable for Friend Eggs so the Garden is not co-op-exclusive. Current `GAMEPLAY_DESIGN_SPEC.md`, `STORY_BIBLE.md`, and Plan 09 explicitly say Science is never spent. Plan 06 also records a Gold/Science spend economy as rejected unless a separate specification, ethical review, and explicit approval later authorize it. Approval of this concept must therefore include a deliberate future economy override, ethical review, and migration; this document does not change that authority by itself.

**Recommended working price for prototype/economy modelling: 5 available Science Points per Egg.** Plan 09 does not define an Egg economy or farming balance; Plan 10 must audit the final 24-maze supply and replay sources after Plan 09. The shipping price should make a thorough solo campaign grant several meaningful Garden sessions and allow the final roster through reasonable replay, without making co-op mail irrelevant.

Preserve the current keepsake rather than decrementing history:

```text
scienceAvailable = scienceDiscoveredLifetime
                 + scienceGiftedLifetime
                 - scienceSpentOnEggs
```

The existing visible “Science discovered” record migrates to `scienceDiscoveredLifetime` and never decreases. Science Parcels add two to a separately visible gifted source. Buying an Egg increments only the spent ledger and mints the Egg atomically. At the working price, the one Science card in an eight-Egg bag refunds only 0.4 Egg rather than creating a self-sustaining reward loop. Final terminology may frame this as powering the Garden Observatory rather than literally buying living creatures.

Current repository inspection finds 22 Science Points in one complete sweep of the 16 present authored mazes, concentrated in five levels. Authored replays can bank them again, and generated Surprise Mazes can also produce replayable Science, so current lifetime supply is effectively farmable rather than capped at 22. Plan 09 may change authored supply but intentionally does not settle spending; 5 is therefore a test value, not a locked economy price.

### 8.6 Friends and low-stakes care

The initial roster is one Garden resident per final rescue-friend species. The current repository has 15 species. “No duplicates” therefore means one persistent resident for each species, not one individual for every historical cage rescue.

Friends have no hunger meter, health, age, sadness decay, neglect dialogue, abandonment reaction, or offline simulation. Greeting creates a six-second follow response. Feeding consumes exactly one fruit, creates visible hearts for three seconds, and follows the feeding player for 20 unpaused seconds; it does not prevent a penalty because no penalty exists. Throwing is portrayed as a magical soft bounce that friends enjoy, never an impact or injury. No happiness value persists.

The v1 AI is one deterministic state machine with small personality presets rather than 15 bespoke simulations:

- `Idle`
- `WanderToWaypoint`
- `InspectPlayerOrToy`
- `Follow`
- `Held`
- `Tossed`
- `Settle`

Existing species motion, flourish, and greeting data can seed **cozy**, **curious**, and **bouncy** parameter sets. The Garden uses an authored waypoint graph and fixed tick. At most six residents actively path at once; the others nap, watch, sit, or use a nearby toy, keeping the complete final roster visible without running one continuous path search per resident.

Temporary positions, hearts, follow timers, and moods do not need durable persistence. On entry, residents spawn at deterministic home waypoints from a visit seed. The roster, Eggs, fruit, and toys persist.

### 8.7 Fruit and toys

V1 has one universal fruit. Each tree stores `ready/notReady` plus the last Garden refresh serial. One successful completion of a curated Solo Adventure maze, ordinary curated Duo maze, or Special Delivery Route increments the profile's refresh serial and sets each empty tree to one ready fruit; it never stacks several invisible fruit. Surprise completions do not refresh the Garden in v1. Either one Ame trunk bump or one P2 canopy-jostle action releases exactly one ready fruit immediately and changes that tree to `notReady`. Both players may collect and feed it. Reload and re-entry preserve the tree state, so fruit cannot duplicate.

V1 has three original permanent toys at authored Garden pads—for example a soft moon ball, windmill pinwheel, and picnic cushion. A Toy reward activates its object permanently, and friends can inspect or play with it. This is not a furnishing editor: toys are not sold, lost, stacked into inventory clutter, or freely placed in v1.

Each player has one Garden care-hold slot, separate from docked maze cargo. On disconnect, scene exit, or unresolved role reassignment, a held Egg returns to its nest with the same crack/transaction state, a friend returns to its deterministic safe home waypoint, fruit returns to shared fruit inventory, and a toy returns to its authored pad. Stable object IDs make each cleanup exactly once.

### 8.8 What the Garden does not confer

Garden residents, feeding, toys, and happiness never change Ame's Power, Bag, equipment, guardian arithmetic, level hints, hazard immunity, letter quota, story access, achievements required for completion, or Solo records. The Garden is an affectionate reward and collection space, not a hidden power economy.

## 9. Input, seating, menus, and role ownership

This is a future behavior contract, not a claim that current controls already support it. Plan 08 deliberately targets one active controller; enumerating multiple pads does not create simultaneous seats.

### 9.1 Logical seats

- Seat 1 owns Ame, camera authority, shared menu focus, story advance, exit, restart, End Duo, save-return, and destructive confirmations.
- Seat 2 owns the selected Courier, flight, Courier Interact, Drop, and Ping.
- Either seat may request pause, but only Seat 1 moves through shared menus. Seat 2 may control only its own character-choice/leave panel.
- A transient runtime `{index, connectionGeneration}` token binds to a logical seat; it is not a stable hardware identity and is never persisted. A reconnect is explicitly reassigned.
- The game never persists a hardware ID, Gamepad index, cursor position, or last flight coordinate.

### 9.2 Baseline mappings

| Configuration | Ame / Seat 1 | Courier / Seat 2 |
|---|---|---|
| Keyboard + mouse | Arrow keys or WASD for grid movement; new Plan 10 Interact key and Pause | Mouse steers within board; primary click Interact/Offer, secondary Drop/Boop, dedicated key or mouse button Ping |
| Two Xbox-style controllers | D-pad or left stick for grid movement; A is the new Plan 10 Interact, Menu Pause | Left stick free flight; A Interact/Offer, B Drop/Boop, X Ping, Menu requests Pause |
| Steam Deck built-in + one external pad | Device used to start claims Seat 1; other device presses A for Seat 2 | Same per-seat controls |
| Steam Deck + two external pads | Explicit join cards; Deck is not silently forced into a seat | Any unclaimed pad may join; prompts show seat glyph and device label |
| Controller + keyboard/mouse hybrid | First Start/Confirm claims Ame unless the join screen says otherwise | Remaining device group claims Courier |

Analogue flight needs configurable speed, acceleration, dead zone, and auto-brake. P2 D-pad flight uses its own eight-way resolver: opposing inputs cancel and diagonal vectors normalize to the same speed as cardinal vectors. It cannot reuse Plan 08's deliberate one-cardinal Ame arbitration. P1 analogue input still resolves to deterministic grid intent rather than free movement.

### 9.3 Mouse-specific contract

The current board pointer controls Ame, so mouse-as-Courier requires an explicit Duo input context; both systems cannot consume the same pointer.

- When Mouse Courier is active, board pointer steering for Ame is disabled.
- Absolute pointer position inside the board steers P2 with an optional ease; leaving the board brakes at the edge rather than moving UI focus and the Courier simultaneously.
- UI controls regain normal pointer behavior while paused or during a modal; Courier input freezes.
- Optional pointer lock may improve sustained flight but cannot be required. Escape releases it, browser blur brakes P2, and focus return requires a fresh click.
- Board scale and CSS transforms must be accounted for before converting pointer position to world position.
- Touch is not a two-player input method in v1. One touch device cannot safely emulate two independent players plus shared UI.

### 9.4 Join and reassignment language

Home and Garden show **Press A to join as Courier** only for an unclaimed `mapping === "standard"` controller or a separately qualified adapter. A connected pad does not join merely because it produced drift. Unsupported or duplicate non-standard devices cannot join simply through intent; they remain unavailable with clear device guidance.

Prompts identify role, not just colour: **Ame — blue seat token** and **Ponchi — green seat token**, with controller glyph, text, and shape. These are UI tokens, not claims that the system can discover a controller's physical colour. Disconnect pauses; it never silently moves P2 onto P1's pad or gives both players the same focus.

## 10. Progress, records, rewards, and saves

### 10.1 Equal-status completion

- One shared level-complete flag unlocks story progression whether completed Solo or Duo.
- Story scenes, rescues, Gold, and Science bank normally in either mode.
- UI never labels a Duo completion assisted, lesser, invalid, or unofficial.
- Solo route records and Duo route records are separate because ordinary Duo permits impossible item transport.
- Dedicated Duo Routes have their own small campaign record set and do not contribute missing boxes to Solo campaign completion.

### 10.2 Recommended record lanes

**Solo Best:** existing route measures such as steps, Power, rescues, and other final Plan 09 contracts.

**Duo Best:** completion, Ame steps if still meaningful, best mail collected/available, and accepted deliveries. Snatches and carry duration are playtest telemetry only, never player-facing scores; do not incentivize obstruction. P2 joining even briefly classifies the run as Duo.

Garden roster, Eggs, mail remainder, toys, fruit, and Science economy are shared profile state, never assigned to the controller or person who happened to play P2.

### 10.3 Active-run state

A future versioned Duo session needs at least:

- `duoRulesVersion` and `duoEverJoined`;
- Courier avatar selection;
- each affected portable item's stable ID, authored origin, and authoritative `atOrigin/carriedByCourier/droppedAt/resolvedByAme` state;
- per-letter stable ID and `concealed/revealed/collected` state;
- in-run mail count; and
- Duo mechanism and room-checkpoint state for dedicated routes.

It does not need to save current pings, transient flight position, device identity, Gamepad index, active visual flourish, or cooldown animation. Reload with unresolved cargo opens Reconnect / Secure satchel and continue Solo / Restart before play resumes. A live Garden detour may retain logical seat ownership in memory, but a reload always asks devices to reclaim those roles.

### 10.4 Unified durable Garden/economy state

**Recommended persistence architecture:** extend one versioned durable player-profile aggregate with Garden and economy fields rather than creating an independently writable Garden key. Maze completion, canonical Science discovery, mail conversion, Eggs, and Garden rewards can then commit through one serialized profile update. The active-run session may remain separate, but every victory carries a stable `completionTransactionId`; the profile records applied operation IDs so a refresh between profile write and session cleanup can replay safely without duplicating Science, mail, fruit refresh, or Eggs. A separately stored Garden would instead require an explicit idempotent journal/two-phase reconciliation protocol and is not the preferred v1.

The Garden/economy extension needs:

- mail remainder from 0–14;
- a bounded banked-Egg count, monotonic Egg IDs, and at most three active Egg records with crack/transaction state;
- `eggRulesVersion`, `rewardBagVersion`, deterministic bag order/cursor, prior category, and random seed;
- hatched resident species;
- owned toys;
- shared fruit inventory, per-tree ready state, and the last fruit-refresh completion serial;
- Science gifted and spent ledgers in one versioned profile/economy transaction boundary;
- selected Courier avatar; and
- Garden visit counter/seed and refresh serial.

Canonical `scienceDiscoveredLifetime` remains owned by core player progress and is referenced, never copied into a second authority. Mail-to-Egg conversion, Science exchange, Egg reward reservation, hatch reveal, tree harvest, held-object cleanup, and roster/toy mutation must each be atomic and idempotent. A reload resumes the already committed outcome. The unified extension must participate in the game's explicit reset operation; reset must not leave orphan Eggs or spent Science behind.

If Garden data fails validation, sanitize or reset only the Garden/economy extension and show clear recovery copy. Never roll back or delete campaign completion, rescues, Solo/Duo records, or canonical Science discoveries to repair a Garden object.

## 11. Accessibility and family-play policy

- All mail, pings, cargo, seat prompts, Egg categories, and switch links use shape/text/outline in addition to colour.
- Every motion-heavy response has a reduced-motion/static alternative. Camera transfer can snap; pings can stamp; Eggs can cut directly between crack states.
- Important responses have visual and optional haptic equivalents; no rule relies on sound.
- Courier speed, acceleration, auto-brake, interaction radius, hold/toggle behavior, and rumble are adjustable independently of Ame.
- P2 can use analogue or D-pad; neither role requires a stick click, rapid tapping, or simultaneous shoulder-button chord.
- Pings recharge without real-time pressure during pause. Duo switches use generous holds and visible completion rings rather than sub-second timing.
- Hidden-mail covers are high-contrast and patterned. A “clear search spots” option can increase their outline; the letter itself remains concealed until Ame steps on the cover.
- Garden care never punishes absence or low dexterity. Repeating the easiest hatch action always works.
- P1 has the final say over exit, reset, End Duo, Science spending, and shared menus, but P2 retains full movement and cargo agency during play.
- The game provides recovery tools without moralizing about how siblings use them.

## 12. Recommended first approved scope

This is the product boundary to use when a later implementation Plan 10 is written. It is not an implementation sequence.

### 12.1 In the first complete release concept

- Solo maze rules, authored routes, and default play remain unchanged; the optional Garden/Science metagame is the one explicitly proposed solo-facing addition.
- Ponchi and Melty both ship as mechanically identical, freely selectable P2 avatars.
- Drop-in/out Special Delivery Duo works on all final 24 curated Solo Adventure mazes.
- Size-scaled authored mail, one-third Ame-revealed covers, completion banking, repeatable mail, and 15-mail Eggs.
- Three pings per independent 10-second recharge plus the harmless Postmark Boop.
- One physical Courier cargo slot, full current portable-pickup allow-list, Offer, Return-Ribbon Snatch, safe Drop, exact item state, and deterministic recovery.
- Separate Solo/Duo records and versioned active-run support.
- Six optional co-op-only Special Delivery Routes using the initial three mechanism families.
- One Friend Garden scene, one Welcome Egg, all final rescue species, fixed eight-Egg reward bags, one fruit, three fixed toys, and three AI personality presets.
- Full solo Garden parity and Science-to-Egg exchange after explicit economy approval.
- Two logical controller seats plus keyboard/mouse and controller/hybrid support on the final Plan 08 platform contract.
- Reduced-motion, non-colour, non-audio, D-pad, reconnect, and single-menu-authority support.

### 12.2 Deliberate backlog

- Mail in Surprise Mazes.
- More than one Garden.
- P1 avatar choice or costume system.
- More Courier characters, stats, abilities, or unlock requirements.
- Guardian spells, Power softening, dazzling, tickling, or enemy interaction.
- Multiple cargo slots, item juggling, mailboxes that require manual letter return, or written letters.
- Free Garden furnishing, multiple fruit, recipes, shops, friendship levels, breeding, evolution, needs, races, or complex minigames.
- Online visits, trading, remote co-op, or cloud economy.
- Split-map puzzles of any kind.
- Physics tether puzzles or platforming.

### 12.3 Backlogged tether toy

The Human's family experience with *PHOGS!* is strong direct evidence that continuous tether navigation can feel fiddly and frustrating. Keep the appealing physical comedy but remove it from required traversal.

A later Garden-only experiment, **Friend Roundup Ribbon**, could let the players opt into a generous magical loop, circle 5/10/15 friends, and trigger a fruit fountain plus a celebratory effect when the loop closes. It would have instant release, strong auto-close, forgiving overlap, no failure, and no required puzzle or platforming. It is not in the first scope.

## 13. Smallest representative vertical slice

The prototype should be built only after Plan 09 stabilizes the campaign and after this concept receives approval. It should test whether the risky social loop is delightful, not merely prove that two avatars can move.

### 13.1 Test content

Use one representative existing/post-Plan-09 mid-campaign maze containing:

- at least two camera regions;
- a reusable key and door;
- one traversal-gating item or hazard;
- one optional Gold or Science pickup; and
- enough backtracking that carrying an item changes the route visibly.

Overlay 12–15 placeholder letters, one-third under conspicuous placeholder mats. Use a simple winged circle as P2; do not wait for Ponchi/Melty art.

Add one separate single-camera greybox Duo room containing a ground/air stamp pair, one P2-blocking headwind, and one item relay. Add a tiny greybox Garden with one Egg, one placeholder friend, one fruit tree, and one toy.

### 13.2 Minimum actions

- P1 moves, reveals a mat, accepts/Snatches cargo, activates one ground switch, pauses, and exits.
- P2 flies, collects mail, fires three pings, uses Postmark Boop, takes/offers/drops one real key, tests the Return Ribbon during keep-away, activates one air switch, jostles one fruit tree, and helps hatch one Egg.
- Disconnect and Continue Solo recover a deliberately withheld key.
- Players swap roles and replay the risky item scene.

### 13.3 Instrumentation

Record no personal audio. Log timestamped, role-attributed events:

- movement and camera-window changes;
- P2 meaningful actions and idle spans;
- letter visible/reveal/collect events;
- pings and empty-charge attempts;
- item take, carry duration, Return-Ribbon phase, offer, Snatch, drop, state transition, and recovery;
- Postmark Boop uses and responses;
- P1/P2 overlap and edge-clamp time;
- pause, disconnect, reset, exit, and role swap;
- Garden action sequence and time before asking to return to a maze; and
- `mailDeliveredByLevel`, completion duration, replay ordinal, and each Egg's mail/Science/Welcome source; and
- any solver-invalid or unrecoverable state.

An observer separately notes spontaneous communication, confusion, domination, laughter/smiles, visible frustration, pride, requests for help, voluntary role swapping, and desire to play another maze.

### 13.4 Amelia-and-parent 15–20 minute protocol

1. Give only the one-sentence role pitch and control cards.
2. Play the ordinary maze for 5–7 minutes. The adult should once help sincerely and once take a tempting key without announcing whether it will be returned.
3. Let Ame catch/Snatch it or use a negotiated handoff; do not force a reset unless needed.
4. Play the cooperative greybox room for 3–5 minutes.
5. Visit the Garden, hatch one Egg, release fruit, and feed the friend.
6. Swap roles and replay the key/hidden-mail section for 3–4 minutes.
7. Ask each player separately what they believed their job was, their funniest moment, their annoying moment, and which role they would choose next.

The Amelia-and-parent session is the primary creative test. Before the full green light, repeat the same short protocol with at least one additional parent/child or sibling pairing so a single family's good or bad keep-away moment is not mistaken for a robust rule.

### 13.5 Success gates

Proceed toward a Plan 10 implementation proposal only if:

- both players can explain their role after one minute without describing P2 as “just the mouse”;
- median P2 time between meaningful decisions is at most 12 seconds and no unexplained idle span exceeds 25 seconds;
- at least two reciprocal communications occur without prompting (P2 asks Ame to reveal/open; Ame asks P2 to fetch/point);
- the hidden-letter rule is understood after at most one correction;
- at least one item chase or unexpected delivery produces shared amusement and neither player reports that P2 “ruined the game” as their dominant impression;
- camera-edge conflict requires no more than two verbal complaints in the maze;
- both players perform a distinct essential action in the Duo room;
- every key/cargo/disconnect path recovers with zero unrecoverable states;
- Garden actions are understood without care-anxiety or fear of hurting/losing a friend; and
- at least one player asks to hatch another Egg or play another maze.

Do not proceed unchanged if P2 idle time exceeds 25%, Ame repeatedly stops moving to service P2, keep-away ends in distress in two sessions, the camera causes repeated disorientation, or players care more about the Egg than the maze itself.

### 13.6 What each result decides

| Result | Decision supported |
|---|---|
| Mail cooperation lands; item theft also lands | Preserve the full permissive ordinary-Duo pitch |
| Mail lands; item theft repeatedly harms play | Keep cargo for explicit deliveries or add a parent-selected Letters-and-Pings mode before full scope |
| Item play lands; mail feels like cleanup | Reduce counts and make hidden mail more expressive before adding content |
| P2 stays engaged only in the Duo room | Invest in the dedicated campaign; do not assume an overlay alone is shippable |
| Garden creates “one more maze” motivation | Preserve the shared reward loop and simple care scope |
| Garden overshadows maze play or produces reward pressure | Slow Egg cadence and strengthen non-random direct Garden rewards |
| Camera clamp is the main frustration | Prototype room framing/soft docking before adding any more P2 verbs |

The largest remaining uncertainty is not technical: **does unrestricted item carrying produce warm, negotiated mischief often enough to justify the frustration it can also create?** The key-steal/offer/Snatch prototype is the cheapest honest test.

## 14. Repository authority and future architecture implications

### 14.1 Current facts this proposal depends on

- The current campaign has 16 curated mazes; Plan 09 intends to expand it to 24 after predecessor work settles.
- Current authored sizes range from 6×6 to 23×23, with a 6×6 camera window on larger levels.
- The current rescue roster contains 15 species and already has basic per-species motion/flourish/greeting data; Plan 09 has not guaranteed that count as final.
- Current pickups resolve immediately when Ame enters their cell; no unresolved carried-item state exists.
- Current `GameState` has one player and no Courier, cargo, mail, hidden-cover, switch, or dynamic-wall state.
- Current progress schema has one cumulative Science number and no spending ledger, Garden, Egg, fruit, toy, resident, or Solo/Duo record lane.
- Current active-run saves support curated runs but not generated Surprise runs.
- Current solver models Ame's actions only and assumes static topology.
- Current pointer input drives P1 board movement, and Plan 08 targets one active controller even while considering enumeration of several devices.

These are evidence for scope, not instructions to modify current code now.

### 14.2 Three cheap seams Plans 01–09 should avoid closing

Record these recommendations only; do not add co-op scope to those plans:

1. Keep the final `MazeViewport` world-to-screen transform and actor/overlay layer reusable for a second continuously positioned actor, cargo, mail, pings, and Garden occupants.
2. Preserve simultaneous raw device observations and keep normalized gameplay actions separable from global UI actions, tagged by a transient device token so a future command can acquire a logical seat.
3. Keep progress/session records versioned and allow a future mode/rules identity dimension rather than assuming every completion shares one comparable route lane.

All three can be retrofitted after Plan 09 if necessary. None justifies delaying the current overhaul.

### 14.3 Systems a later Plan 10 must specify

- Two-seat input assignment across browser, Tauri, Steam Input, Steam Deck, keyboard/mouse, disconnect, and duplicate mappings.
- A deterministic Courier overlay reducer and command ordering.
- Portable-item provenance: authored origin, carried, dropped, delivered/resolved, recovered.
- Authored mail overlays and content identity/fingerprint rules.
- Duo participation, records, active-run migration, and reset semantics.
- An ordinary-Duo current-state hint/solver model for relocated cargo, plus a separate finite Duo-Route rules model, validator, hint system, and solver for switches and dynamic topology.
- Friend Garden scene lifecycle, bounded AI scheduler, interaction ownership, and performance budgets.
- Atomic Garden/Egg/Science persistence and migration from the final post-Plan-09 schema.
- Final UI and viewport contracts from Plans 01–02; the eventual Human-approved Plan 03 character/art authority (franchise references stay out of production prompts); Plan 04 camera/clip/lighting behavior; Plan 05 animation limits; Plan 07 runtime/media budgets; and Plan 08 input/platform contracts.

### 14.4 Explicit future authority changes if approved

An approved implementation plan would need to state, not imply, that:

- the Human's newer permissive item-carrying direction supersedes the earlier exploratory Plan 10 recommendation against unrestricted collection;
- the newer direct Human instruction allowing a separate co-op-only campaign supersedes the original direct constraint that no maze ever require P2 **only within that separately labeled optional campaign**;
- Science becomes a spendable available balance while lifetime discovery remains a permanent record; and
- ordinary Duo is an intentionally different puzzle ruleset whose records cannot be compared directly with Solo.

No existing specification should be edited until those decisions are approved and the Plan 10 implementation plan reconciles them.

## 15. Risks, trade-offs, and rollback boundaries

| Risk | Accepted trade-off or mitigation | Clean rollback |
|---|---|---|
| P2 trivializes a carefully authored solo puzzle | Accepted in clearly labeled ordinary Duo; preserve Solo and separate records | Disable base-item carrying while retaining mail/pings |
| Keep-away causes tears | Snatch, one cargo slot, P1 End Duo, deterministic recovery, no score for obstruction | Offer-only cargo or parent-selected Letters-and-Pings ruleset |
| P2 feels like unpaid cleanup | Free flight, search, pings, cargo, chase, reciprocal Duo mechanisms, equal Garden actions | Reduce letter count; increase expressive optional interactions |
| P1 feels P2 owns the maze | P1 owns camera, reveal, route, Bag resolution, guardians, rescues, exit, and menus | Narrow P2 cargo allow-list |
| Hidden mail clutters small maps | Size bands, non-colliding overlays, one-third hidden, post-Plan-09 authoring | Reduce quotas without save migration by rules version |
| Garden becomes a second giant game | One Garden, one fruit, three toys, one AI machine, no needs/races/stats | Ship mail meter first; Garden can remain behind feature boundary |
| Random Eggs feel manipulative or disappointing | Fixed disclosed bag, first Friend guarantee, no duplicate/streak, no money/FOMO | Replace bag with deterministic selectable reward track |
| Science economy contradicts product promise | Explicit approval, lifetime/source ledgers, optional cosmetic rewards only | Use non-spending lifetime claim milestones instead |
| Ponchi reads as a copied Moogle | Original species, silhouette, palette, speech, postal motifs, and review | Ship Melty first while Ponchi is redesigned |
| Two-player camera becomes frustrating | P1 authority, normalized clamp, single-frame Duo rooms, no P2 pan | Restrict P2 to simpler docking orbit in ordinary mazes |
| Dynamic Duo levels soft-lock | Authored anchors, stable command order, room reset, separate validator/solver | Ship ordinary Duo before dedicated campaign |
| Garden AI harms performance | Fixed tick, waypoints, six active movers, transient state not saved | Reduce active residents or use staged idle loops |
| Scope threatens Plans 01–09 | Post-Plan-09 approval gate; no current code/spec edits | Defer the whole feature without losing current work |

The concept is intentionally modular. Mail/pings, base-item cargo, dedicated Duo levels, and the Garden should have distinct rules/content versions so one troubled layer can be delayed without corrupting the others.

## 16. Research grounding

The following are source observations, followed by this document's design inference. Precedents inform principles only; no protected character, terminology, visual identity, level, or signature mechanic should be copied.

- Nintendo's *Super Mario Galaxy 2* manual describes a secondary pointer that can gather useful objects and affect some enemies while Mario remains the primary character. **Inference:** a camera-bound secondary role can have frequent consequential verbs without receiving camera authority. [Nintendo manual](https://csassets.nintendo.com/noaext/image/private/t_KA_PDF/Wii_Super_Mario_Galaxy2_Eng?_a=DATAg1AAZAA0) (accessed 2026-09-02).
- Nintendo described *New Super Mario Bros. U* Boost Mode as able either to help partners or put them “in hot water.” **Inference:** bounded playful interference can be an intentional couch dynamic when the game makes its consequences recoverable. [Nintendo UK multiplayer feature](https://www.nintendo.com/en-gb/News/2013/April/Spotlight-on-Wii-U-Multiplayer-747726.html) (accessed 2026-09-02).
- Nintendo's *Snipperclips* material emphasizes reshaping, restoring, and retrying together. **Inference:** co-op comedy tolerates interference when recovery is immediate and legible. [Nintendo](https://media.nintendo.com/snipperclips/characters/) (accessed 2026-09-02).
- Nintendo presents *Captain Toad: Treasure Tracker* with both pointer-style assistance and full two-character co-op variants. **Inference:** an overlay mode and purpose-built two-player content can coexist rather than forcing one ruleset to serve every maze. [Nintendo UK](https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/Captain-Toad-Treasure-Tracker-1348071.html) (accessed 2026-09-02).
- PlayStation's *Knack 2* material describes seamless co-op joining and partner actions. **Inference:** drop-in support is strongest when absence never destroys state and bespoke cooperation remains optional to the solo campaign. [PlayStation Blog](https://blog.playstation.com/2017/06/12/knack-2-hits-ps4-september-5-new-trailer-screens/) (accessed 2026-09-02).
- SEGA's official *Sonic Adventure 2* Chao page presents egg hatching, raising, interaction, personality change, a comfortable Garden, and races. **Inference:** hatching and low-stakes care can turn campaign rewards into affection and replay motivation; this proposal deliberately rejects races, stat raising, evolution, breeding, and the Chao visual identity. [SEGA](https://sonic.sega.jp/sonicadv2/0601/shots_e.html) (accessed 2026-09-02).
- Square Enix's creator interview records the physical design ingredients used for Moogles. **Inference:** Ponchi requires conspicuous distance in silhouette, palette, facial construction, vocabulary, and iconography; “inspired but renamed” is not enough. [Square Enix / Final Fantasy Portal](https://na.finalfantasy.com/topics/176) (accessed 2026-09-02).
- UNICEF's RITEC Design Toolbox reports a framework informed by 787 children aged 8–12 across 18 countries and organizes well-being around safety, autonomy, emotions, competence, relationships, creativity, and identity. **Inference:** both roles need genuine autonomy and competence, the Garden should support nurturing without neglect pressure, and family recovery controls should coexist with playful expression. [UNICEF](https://www.unicef.org/childrightsandbusiness/workstreams/responsible-technology/online-gaming/ritec-design-toolbox) (accessed 2026-09-02).
- FTC and UK government material focuses loot-box concern on paid randomized rewards, confusing disclosure, overspending, and child protection. **Inference:** an earned-only Egg is not a commercial loot box, but a family product should still use a disclosed bounded bag, prevent duplicates/unlucky streaks, and exclude monetization, rarity pressure, and FOMO. [US Federal Trade Commission](https://www.ftc.gov/news-events/news/press-releases/2020/08/ftc-staff-issue-perspective-paper-video-game-loot-boxes-workshop), [UK Department for Culture, Media and Sport](https://www.gov.uk/guidance/loot-boxes-in-video-games-update-on-improvements-to-industry-led-protections) (accessed 2026-09-02).
- The W3C Gamepad draft specifies first-come indices and reuse of the lowest prior index after disconnect; its `id` format is deliberately unspecified and must not expose a unique serial. **Inference:** neither value is durable player identity, so Duo needs explicit logical seats plus a new connection generation. [W3C Gamepad specification](https://www.w3.org/TR/gamepad/) (accessed 2026-09-02).
- Valve's Steam Input guidance says local multiplayer must accept the relevant simultaneous input paths or opt all controllers into Steam Input; its emulation guidance also notes that devices can appear as Xbox controllers and some extra inputs may be duplicated. **Inference:** “two pads detected” is not proof of two stable players—join edges, per-seat prompts, mixed-input QA, and Steam Deck/external-controller tests are required. [Steamworks developer guide](https://partner.steamgames.com/doc/features/steam_controller/getting_started_for_devs?language=english), [Steam Input emulation best practices](https://partner.steamgames.com/doc/features/steam_controller/steam_input_gamepad_emulation_bestpractices?language=english) (accessed 2026-09-02).

## 17. Decisions required before the implementation Plan 10

The concept can be prototyped with recommended defaults, but an authoritative implementation plan should not be approved until Amelia/the Human decide the following:

1. **Core green light:** Is Puzzlewild Post—ordinary permissive Duo, six true Duo Routes, and the Friend Garden—the approved product direction?
2. **Balance stance:** Confirm that P2 fetching keys/equipment/treasure through normal walls and hazards is intentionally allowed in ordinary Duo and that separate records are sufficient protection.
3. **Cargo closure:** Approve the proposed portable allow-list, one-item capacity, Offer, Ame Snatch, expanding Return Ribbon, safe Drop, no automatic victory benefit, and End Duo recovery.
4. **Mail cadence:** Approve completion-only banking, replayable mail, the 6/12/15/18/21 size bands, one-third hidden ratio, and no Surprise Maze mail in v1.
5. **Science authority change:** Approve a spendable available Science balance while preserving lifetime discovery, or choose non-spending Science claim milestones instead.
6. **Science price:** Treat 5 Science per Egg as the working prototype value and retune after a Plan 10 audit of the final post-Plan-09 supply/farming sources, or choose a different target economy.
7. **Egg fairness:** Approve the disclosed 5 Friend / 1 Toy / 1 Fruit / 1 two-Science eight-Egg bag, Welcome Egg consuming its first Friend card, no consecutive non-Friend results, and fruit/toy-only post-roster conversion.
8. **Friend eligibility:** Approve the recommended `rescued species - Garden residents` eligibility rule, or accept campaign spoilers by making the final roster eligible from the start.
9. **Launch characters:** Confirm that both Ponchi and Melty are first-release scope, mechanically identical and available immediately.
10. **Garden boundary:** Approve one Garden, one fruit, three fixed toys, no needs/stats/races, no gameplay bonuses, and the bag-consuming Welcome Egg after the first curated Adventure completion.
11. **Dedicated campaign size:** Approve six initial Two-Players-Required routes and their isolation from Solo Adventure completion.
12. **Tether disposition:** Confirm that tether play remains a Garden-only backlog experiment and never a required maze traversal mechanic.

## 18. Approval gate and next document

After Amelia and the Human approve or amend the decisions above, and after Plan 09 stabilizes the 24-level campaign, the next artifact should be a separate **Plan 10 implementation plan**. It should reconcile final repository authority, define migrations and solver contracts, break the work into reviewable phases, and begin with the placeholder vertical slice rather than production characters or Garden content.

Until that approval, every recommendation here remains exploratory and non-canon. No current maze, save, input path, specification, asset, or implementation should change because this document exists.
