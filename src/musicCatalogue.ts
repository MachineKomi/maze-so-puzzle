/** Stable, hand-authored catalogue for the Human-delivered Maze so Puzzle OST. */
export const MUSIC_CONTEXTS = [
  "title",
  "story",
  "maze",
  "victory",
  "garden",
  "adventure-book",
] as const;

export type MusicContext = typeof MUSIC_CONTEXTS[number];

export interface MusicTrackDefinition {
  readonly id: string;
  readonly context: MusicContext;
  readonly url: string;
}

function track(id: string, context: MusicContext, fileName: string): MusicTrackDefinition {
  return Object.freeze({ id, context, url: `/assets/ost/${context}/${fileName}` });
}

export const MUSIC_CATALOGUE = Object.freeze([
  track("title-little-world-waiting-a", "title", "MsP Title 1 a little world waiting.mp3"),
  track("title-little-world-waiting-b", "title", "MsP Title 1 a little world waiting B.mp3"),
  track("title-maze-so-puzzle-a", "title", "MsP Title 2 Maze so Puzzle!.mp3"),
  track("title-maze-so-puzzle-b", "title", "MsP Title 2 Maze so Puzzle! B.mp3"),
  track("title-great-glittery-adventure-a", "title", "MsP Title 3 A Great Glittery Adventure.mp3"),
  track("title-great-glittery-adventure-b", "title", "MsP Title 3 A Great Glittery Adventure B.mp3"),

  track("story-once-upon-a-puzzle-a", "story", "MsP Story 1 Once Upon a Puzzle.mp3"),
  track("story-once-upon-a-puzzle-b", "story", "MsP Story 1 Once Upon a Puzzle B.mp3"),
  track("story-poggle-explains-a", "story", "MsP Story 2 Prof Poggle Explains Everything.mp3"),
  track("story-poggle-explains-b", "story", "MsP Story 2 Prof Poggle Explains Everything B.mp3"),
  track("story-star-map-awakens-a", "story", "MsP Story 3 The Star Map Awakens.mp3"),
  track("story-star-map-awakens-b", "story", "MsP Story 3 The Star Map Awakens B.mp3"),

  track("maze-moonlit-friendship-a", "maze", "MsP Maze Moonlit Friendship Quest.mp3"),
  track("maze-moonlit-friendship-b", "maze", "MsP Maze Moonlit Friendship Quest B.mp3"),
  track("maze-poggle-puzzle-room-a", "maze", "MsP Maze Prof Poggle Puzzle Room.mp3"),
  track("maze-poggle-puzzle-room-b", "maze", "MsP Maze Prof Poggle Puzzle Room B.mp3"),
  track("maze-rainbow-power-parade-a", "maze", "MsP Maze Rainbow Powder Parade.mp3"),
  track("maze-rainbow-power-parade-b", "maze", "MsP Maze Rainbow Powder Parade B.mp3"),
  track("maze-snowflakes-star-keys-a", "maze", "MsP Maze Snowflakes and Star Keys.mp3"),
  track("maze-snowflakes-star-keys-b", "maze", "MsP Maze Snowflakes and Star Keys B.mp3"),
  track("maze-storybook-meadow-a", "maze", "MsP Maze Storybook Meadow.mp3"),
  track("maze-storybook-meadow-b", "maze", "MsP Maze Storybook Meadow B.mp3"),
  track("maze-sunny-little-adventure-a", "maze", "MsP Maze Sunny Little Adventure.mp3"),
  track("maze-sunny-little-adventure-b", "maze", "MsP Maze Sunny Little Adventure B.mp3"),
  track("maze-sunset-bowling-club-a", "maze", "MsP Maze Sunset Bowling Club.mp3"),
  track("maze-sunset-bowling-club-b", "maze", "MsP Maze Sunset Bowling Club B.mp3"),

  track("victory-little-hero-a", "victory", "MsP Victory 1 Little Hero Celebration.mp3"),
  track("victory-little-hero-b", "victory", "MsP Victory 1 Little Hero Celebration B.mp3"),
  track("victory-puzzle-party-a", "victory", "MsP Victory 3 Puzzle Party Complete!.mp3"),
  track("victory-puzzle-party-b", "victory", "MsP Victory 3 Puzzle Party Complete! B.mp3"),

  track("garden-sunny-friend-a", "garden", "MsP Garden 1 Sunny Friend Garden.mp3"),
  track("garden-sunny-friend-b", "garden", "MsP Garden 1 Sunny Friend Garden B.mp3"),
  track("garden-sleepy-afternoon-a", "garden", "MsP Garden 2 Sleepy Afternoon with Friends.mp3"),
  track("garden-sleepy-afternoon-b", "garden", "MsP Garden 2 Sleepy Afternoon with Friends B.mp3"),
  track("garden-tiny-animal-festival-a", "garden", "MsP Garden 3 Tiny Animal Festival.mp3"),
  track("garden-tiny-animal-festival-b", "garden", "MsP Garden 3 Tiny Animal Festival B.mp3"),

  track("book-pages-full-adventures-a", "adventure-book", "MsP AdvBook 1 Pages full of Adventures.mp3"),
  track("book-pages-full-adventures-b", "adventure-book", "MsP AdvBook 1 Pages full of Adventures B.mp3"),
  track("book-stickers-stars-paths-a", "adventure-book", "MsP AdvBook 2 Stickers Stars and Secret Paths.mp3"),
  track("book-stickers-stars-paths-b", "adventure-book", "MsP AdvBook 2 Stickers Stars and Secret Paths B.mp3"),
  track("book-memories-between-mazes-a", "adventure-book", "MsP AdvBook 3 Memories Between Mazes.mp3"),
  track("book-memories-between-mazes-b", "adventure-book", "MsP AdvBook 3 Memories Between Mazes B.mp3"),
] as const satisfies readonly MusicTrackDefinition[]);

export const MUSIC_POOLS: Readonly<Record<MusicContext, readonly MusicTrackDefinition[]>> =
  Object.freeze(Object.fromEntries(MUSIC_CONTEXTS.map((context) => [
    context,
    Object.freeze(MUSIC_CATALOGUE.filter((candidate) => candidate.context === context)),
  ])) as Record<MusicContext, readonly MusicTrackDefinition[]>);

export function musicTrackById(id: string): MusicTrackDefinition | undefined {
  return MUSIC_CATALOGUE.find((candidate) => candidate.id === id);
}

export function musicTrackByUrl(url: string): MusicTrackDefinition | undefined {
  return MUSIC_CATALOGUE.find((candidate) => candidate.url === url);
}

export const DEFAULT_TITLE_TRACK = MUSIC_POOLS.title[0]!;
export const DEFAULT_MAZE_TRACK = MUSIC_POOLS.maze[0]!;
