export type StorySpeaker = "ame" | "poggle" | "sprig";

export interface StoryLore {
  readonly levelId: string;
  readonly chapter: number;
  readonly title: string;
  readonly speaker: StorySpeaker;
  readonly intro: readonly [string, string];
  readonly quote: string;
  readonly puzzlePower: string;
  readonly tryThis: string;
  readonly outro: string;
}

/**
 * A read-together layer for the authored campaign. Each entry is deliberately
 * short enough for one pre-maze card: an adult can read it aloud, while a child
 * who wants to play can dismiss the whole card with one input.
 */
export const STORY_LORE: readonly StoryLore[] = [
  {
    levelId: "little-star-trail",
    chapter: 1,
    title: "The Great Glittery Hiccup",
    speaker: "sprig",
    intro: [
      "In the Puzzlewild, every safe path is stitched into one enormous Star Map. Then Sprig, the littlest cloud-dragon, tried not to sneeze... and hiccupped a puff of glitter instead.",
      "WHOOMPH! The paths wriggled into mazes and the Wish Stars rolled away. Ame fastened her backpack. If she could follow the very first trail, perhaps the map would remember how paths worked.",
    ],
    quote: "I only sneezed a teeny bit enormous!",
    puzzlePower: "Directions",
    tryThis: "Say each direction aloud: up, down, left, or right.",
    outro: "The first Wish Star zipped back into the map. One path was untangled—and Sprig promised to sneeze into his elbow next time.",
  },
  {
    levelId: "shiny-sword",
    chapter: 2,
    title: "The Polite Sword Rule",
    speaker: "poggle",
    intro: [
      "Professor Poggle arrived upside down, because he was reading his map upside down. He explained that Puzzlewild baddies were not truly wicked. They were simply very serious about the Polite Sword Rule.",
      "A baddie only scoots aside for an adventurer carrying a proper maze weapon. Ame would need to find one, compare their Power numbers, and match the Rose Heart Key to its door.",
    ],
    quote: "A sword says ‘please’ in extremely sparkly handwriting.",
    puzzlePower: "Compare and match",
    tryThis: "Find the matching colour and shape. Check which Power is bigger.",
    outro: "The goblin bowed, the heart door chimed, and Poggle awarded Ame an invisible certificate in Extremely Polite Adventuring.",
  },
  {
    levelId: "splashy-boots",
    chapter: 3,
    title: "The Moat That Forgot Its Bridge",
    speaker: "ame",
    intro: [
      "The next path stopped beside a moon-blue moat. Its bridge had wandered off to become a picnic table, which was not useful bridge behaviour at all.",
      "Ame spotted splash boots on another branch. First she would gather enough Power, then remember where the water waited and return with dry socks and a sensible plan.",
    ],
    quote: "A good explorer can change her plan without changing her socks.",
    puzzlePower: "Plan and return",
    tryThis: "Notice where you are blocked, find the tool, then come back.",
    outro: "Ame splashed across without one soggy toe. The moat burbled, ‘Well planned!’ which is unusually clear speech for a moat.",
  },
  {
    levelId: "rainbow-picnic",
    chapter: 4,
    title: "The Picnic Behind Two Doors",
    speaker: "sprig",
    intro: [
      "Sprig could smell strawberry star-cakes somewhere beyond two rainbow gates. Unfortunately, his nose was excellent at cakes and terrible at keys.",
      "Ame would search both side paths, keep each key’s colour and shape in mind, and pack the right equipment before heading for the picnic star.",
    ],
    quote: "My nose says the cake is left. Or right. Definitely delicious!",
    puzzlePower: "Sorting",
    tryThis: "Group keys and doors by colour and symbol.",
    outro: "Both gates opened and the picnic was saved. Sprig discovered that counting cakes before eating them is much easier than counting them afterwards.",
  },
  {
    levelId: "toasty-toes",
    chapter: 5,
    title: "The Very Warm Shortcut",
    speaker: "poggle",
    intro: [
      "The Ember Bakers had warmed their ovens so enthusiastically that little rivers of friendly lava escaped into the maze. Poggle labelled this ‘a biscuit-related geography problem.’",
      "The shortest-looking route was not yet the safest one. Ame needed to inspect the branches, collect what protected her feet, and choose the route whose conditions she could actually meet.",
    ],
    quote: "Never test a lava puddle with your favourite sock.",
    puzzlePower: "Cause and effect",
    tryThis: "Ask: what will happen if I step there, and what would make it safe?",
    outro: "The ovens settled, the biscuits puffed, and Ame crossed with perfectly untoasted toes.",
  },
  {
    levelId: "moonbeam-moat",
    chapter: 6,
    title: "Three Locks at Moonrise",
    speaker: "poggle",
    intro: [
      "At moonrise, three old gates began singing three different songs at once. It sounded rather like spoons falling down a staircase.",
      "Poggle suggested solving one small problem at a time: explore, remember a landmark, collect a matching key, and decide which closed route to revisit next.",
    ],
    quote: "A giant puzzle is only several tiny puzzles wearing one coat.",
    puzzlePower: "Break it into steps",
    tryThis: "Choose one goal first. Finish it, then choose the next.",
    outro: "The gates finally sang in harmony. Poggle claimed he had planned the song. Nobody asked to see his sheet music.",
  },
  {
    levelId: "wishing-woods",
    chapter: 7,
    title: "The Wish Under Guard",
    speaker: "ame",
    intro: [
      "Deep in Wishing Woods, one shy kitten wished to be rescued—but a proud pebble guardian was much stronger than Ame at first.",
      "There was no need to rush or give up. Ame could remember the guardian’s Power, explore other paths, grow stronger, and test the same idea again with new evidence.",
    ],
    quote: "‘Not yet’ is not the same thing as ‘never.’",
    puzzlePower: "Perseverance",
    tryThis: "If an idea does not work yet, learn something and try again.",
    outro: "The guardian gave a gravelly cheer and the kitten bounded free. The best wish, it turned out, was a patient one.",
  },
  {
    levelId: "ames-grand-parade",
    chapter: 8,
    title: "The Parade With No Leader",
    speaker: "sprig",
    intro: [
      "Every rescued friend wanted to join the Grand Parade, but the parade arrows pointed everywhere at once. One sign even pointed at itself.",
      "Ame became parade leader. She would gather each colour, check which friends were still waiting, and use the minimap to organise a route through the celebration.",
    ],
    quote: "I shall play the royal kazoo! I have not found a kazoo.",
    puzzlePower: "Keep track",
    tryThis: "Pause and check: what have I found, and what is still missing?",
    outro: "The parade reached the star with every flag, friend, and imaginary kazoo in exactly the right place.",
  },
  {
    levelId: "springstep-sky-hollow",
    chapter: 9,
    title: "Boing Is a Scientific Word",
    speaker: "poggle",
    intro: [
      "Sky Hollow was full of perfectly round holes and one pair of wonderfully bouncy Spring Boots. Poggle opened his notebook to study the important science of boing.",
      "Ame would observe where a jump began, predict where it must land, and only leap when a safe floor tile waited on the other side.",
    ],
    quote: "Hypothesis: boing. Result: considerably more boing.",
    puzzlePower: "Predict",
    tryThis: "Before moving, point to where you think Ame will land.",
    outro: "Poggle recorded three results: up, down, and boing. Ame recorded the rescued friends, which was more useful.",
  },
  {
    levelId: "lanternlight-labyrinth",
    chapter: 10,
    title: "The Library of Lost Turnings",
    speaker: "poggle",
    intro: [
      "The Lantern Library kept every turning ever taken, but the Great Glittery Hiccup had shuffled them into the wrong books. Corridors now curled through forgotten reading rooms.",
      "This maze was too large to remember all at once. Ame could reveal it piece by piece, use landmarks, and let the minimap remember the details while she remembered the plan.",
    ],
    quote: "A map is a memory you can point at.",
    puzzlePower: "Use a model",
    tryThis: "Compare the big view with the minimap. What has changed?",
    outro: "The library’s paths returned to the correct chapters. One corridor remained filed under ‘Sandwiches,’ but it seemed happy there.",
  },
  {
    levelId: "twilight-treasure-loop",
    chapter: 11,
    title: "The Treasure That Was Not the Answer",
    speaker: "sprig",
    intro: [
      "Sprig found a glittering side path and declared the mystery solved. It contained a treasure chest, which was lovely, but not the key they actually needed.",
      "Ame explained that useful discoveries and the final answer can be different things. They would explore each loop, enjoy its reward, and keep asking what evidence moved the main plan forward.",
    ],
    quote: "Treasure is not always the answer. It is still excellent treasure.",
    puzzlePower: "Choose relevant clues",
    tryThis: "Ask whether each find is a reward, a tool, or the next required step.",
    outro: "Every loop was worth visiting, and the real key finally came home. Sprig was delighted that several answers had snacks inside.",
  },
  {
    levelId: "moonlit-friendship-quest",
    chapter: 12,
    title: "Five Friends and One Good Memory",
    speaker: "ame",
    intro: [
      "Five moonlit friends had left tiny pawprints across a maze of repeating halls. The halls looked alike, but their details were never exactly the same.",
      "Ame would notice door colours, count rescued friends, and use the shape of explored passages to tell one turning from another.",
    ],
    quote: "Look twice. The second look often finds the clue.",
    puzzlePower: "Careful observation",
    tryThis: "Name one detail that makes this place different from the last.",
    outro: "All five friends followed Ame home beneath the moon. Each had remembered a different clue; together, they remembered the whole adventure.",
  },
  {
    levelId: "rose-heart-roundabout",
    chapter: 13,
    title: "Flowers That Fold Space",
    speaker: "poggle",
    intro: [
      "The Rose Heart flowers had learned a remarkable trick: step on one, and space folded like a pocket handkerchief until you popped out of its twin.",
      "Poggle advised treating each matching portal pair like two ends of one secret corridor. Ame could predict the destination, test it, and update her mental map.",
    ],
    quote: "Perfectly ordinary flowers, except for the impossible geography.",
    puzzlePower: "Make connections",
    tryThis: "Match portal symbols and imagine a hidden line joining each pair.",
    outro: "The Rose Hearts beat together, the path folded neatly, and Poggle stopped trying to iron space flat.",
  },
  {
    levelId: "clover-comeback-carnival",
    chapter: 14,
    title: "Poggle’s Upside-Down Plan",
    speaker: "poggle",
    intro: [
      "Poggle produced a magnificent carnival plan. Unfortunately, it was for a maze on the other side of the paper. They needed a better one.",
      "Ame would explore each portal garden, notice which routes remained unfinished, and deliberately come back after collecting enough Power for the Moon Golem.",
    ],
    quote: "My first plan was not wrong. It was for somewhere else.",
    puzzlePower: "Revise your plan",
    tryThis: "When new information appears, decide what part of the plan should change.",
    outro: "The comeback route worked beautifully. Poggle carefully labelled his old plan ‘Useful for Somewhere Else’.",
  },
  {
    levelId: "friendship-crown-vault",
    chapter: 15,
    title: "The Crown Made of Good Ideas",
    speaker: "sprig",
    intro: [
      "At the heart of the Puzzlewild waited the Friendship Crown. It was not made of gold. It was made from every good idea shared by friends solving something together.",
      "Three portal pairs, several locks, and five rescues protected the vault. Ame would combine everything she had learned instead of searching for one magical trick.",
    ],
    quote: "Can my good idea be ‘bring snacks’? It has worked before.",
    puzzlePower: "Combine strategies",
    tryThis: "Choose the best tool for each different kind of problem.",
    outro: "The crown shone with directions, comparisons, memories, brave retries—and one surprisingly useful snack idea.",
  },
  {
    levelId: "rainbow-power-parade",
    chapter: 16,
    title: "The Last Knot in the Star Map",
    speaker: "sprig",
    intro: [
      "Only one glittery knot remained, guarded by the Rainbow Guardian at Power 99. Sprig wanted to apologise to the map, but first the long path had to be understood from beginning to end.",
      "Ame would grow in a careful sequence, remember the early locked route, travel all the way back, and prove that patient thinking could become legendary Power.",
    ],
    quote: "This time I brought a handkerchief the size of a tent.",
    puzzlePower: "Sequence and backtrack",
    tryThis: "Build Power in order, then return to the place that was blocked first.",
    outro: "At Power 99, Ame sparkled like every colour at once. The last knot opened, the Star Map became whole, and Sprig’s next tiny sneeze made only one very small rainbow.",
  },
] as const;

const STORY_BY_LEVEL_ID = new Map(STORY_LORE.map((entry) => [entry.levelId, entry]));

export function storyForLevel(levelId: string): StoryLore | undefined {
  return STORY_BY_LEVEL_ID.get(levelId);
}

export interface StoryKeyIntent {
  readonly key: string;
  readonly ctrlKey?: boolean;
  readonly metaKey?: boolean;
  readonly altKey?: boolean;
}

/** Preserve keyboard navigation, but let every ordinary play/read input skip. */
export function shouldDismissStoryForKey(intent: StoryKeyIntent): boolean {
  if (intent.ctrlKey || intent.metaKey || intent.altKey) return false;
  return !["Tab", "Shift", "Control", "Alt", "Meta"].includes(intent.key);
}
