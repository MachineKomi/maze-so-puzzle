import { describe, expect, it } from "vitest";
import { MUSIC_POOLS } from "./musicCatalogue";
import { createMusicTransportFake } from "./musicTransport";

function exerciseTransport() {
  const transport = createMusicTransportFake();
  const snapshots = [transport.getSnapshot()];
  snapshots.push(transport.setContext("maze"));
  snapshots.push(transport.next());
  snapshots.push(transport.shuffle());
  snapshots.push(transport.previous());
  snapshots.push(transport.setMuted(true));
  return snapshots;
}

describe("MusicTransportPort", () => {
  it("provides deterministic context-bounded transport semantics", () => {
    const first = exerciseTransport();
    const second = exerciseTransport();
    expect(first).toEqual(second);
    expect(first[1]?.context).toBe("maze");
    expect(first.slice(1, 5).every((snapshot) => (
      snapshot !== undefined
      && MUSIC_POOLS.maze.some((track) => track.id === snapshot.currentTrackId)
    ))).toBe(true);
    expect(first.at(-1)?.muted).toBe(true);
    expect(first.every((snapshot) => snapshot.loopAvailable === false)).toBe(true);
  });

  it("notifies subscribers, stops at the context boundary, and disposes cleanly", () => {
    const transport = createMusicTransportFake();
    const observed: string[] = [];
    const unsubscribe = transport.subscribe((snapshot) => observed.push(snapshot.currentTrackId));
    expect(transport.previous().canPrevious).toBe(false);
    transport.setContext("story");
    transport.next();
    unsubscribe();
    transport.next();
    expect(observed).toHaveLength(3);
    expect(observed.every((id) => MUSIC_POOLS.story.some((track) => track.id === id)
      || id === MUSIC_POOLS.title[0]?.id)).toBe(true);
    expect(() => transport.dispose()).not.toThrow();
  });
});
