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
  it("retains the full shuffled maze bag across successive, revisited, generated and returning entries", () => {
    const port = createMusicTransportFake();
    const played: string[] = [];
    for (let entry = 0; entry < MUSIC_POOLS.maze.length * 3; entry++) {
      if (entry % 3 === 0) port.setContext("story");
      if (entry % 3 === 1) port.setContext("victory");
      played.push(port.setContext("maze").currentTrackId);
    }
    for (let start = 0; start < played.length; start += MUSIC_POOLS.maze.length) {
      expect(new Set(played.slice(start,start + MUSIC_POOLS.maze.length))).toEqual(new Set(MUSIC_POOLS.maze.map(t=>t.id)));
    }
    played.slice(1).forEach((id,index)=>expect(id).not.toBe(played[index]));
  });
  it("does not replay the sole bag entry already heard through manual transport", () => {
    const reference = createMusicTransportFake();
    const cycle = MUSIC_POOLS.maze.map(()=>reference.setContext("maze").currentTrackId);
    const port = createMusicTransportFake();
    cycle.slice(0,-1).forEach(()=>port.setContext("maze"));
    for(let i=0;i<MUSIC_POOLS.maze.length&&port.getSnapshot().currentTrackId!==cycle.at(-1);i++) port.next();
    expect(port.getSnapshot().currentTrackId).toBe(cycle.at(-1));
    port.setContext("story");
    expect(port.setContext("maze").currentTrackId).not.toBe(cycle.at(-1));
    for(let i=0;i<42;i++) {const manual=port.shuffle().currentTrackId;expect(port.setContext("maze").currentTrackId).not.toBe(manual);}
  });
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
    expect(transport.getSnapshot().canPrevious).toBe(false);
    transport.next();
    unsubscribe();
    transport.next();
    expect(observed).toHaveLength(3);
    expect(observed.every((id) => MUSIC_POOLS.story.some((track) => track.id === id)
      || id === MUSIC_POOLS.title[0]?.id)).toBe(true);
    expect(() => transport.dispose()).not.toThrow();
  });
});
