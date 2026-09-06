import { vi } from "vitest";

export class FakeParam {
  value = 1;
  readonly setValueAtTime = vi.fn((value: number, _at: number) => { this.value = value; });
  readonly exponentialRampToValueAtTime = vi.fn((value: number, _at: number) => { this.value = value; });
  readonly linearRampToValueAtTime = vi.fn((value: number, _at: number) => { this.value = value; });
  readonly cancelScheduledValues = vi.fn();
  readonly cancelAndHoldAtTime = vi.fn();
  readonly setTargetAtTime = vi.fn();
}
export class FakeNode {
  readonly connect = vi.fn();
  readonly disconnect = vi.fn();
  constructor(readonly context: FakeAudioContext) {}
}
export class FakeGain extends FakeNode { readonly gain = new FakeParam(); }
export class FakeOscillator extends FakeNode {
  type: OscillatorType = "sine";
  readonly frequency = new FakeParam();
  readonly start = vi.fn();
  readonly stop = vi.fn();
  private ended: (() => void) | undefined;
  readonly addEventListener = vi.fn((event: string, listener: () => void) => { if (event === "ended") this.ended = listener; });
  finish(): void { this.ended?.(); }
}
export const contexts: FakeAudioContext[] = [];
let associated = new WeakSet<object>();
export class FakeAudioContext {
  state: AudioContextState = "suspended";
  currentTime = 4;
  readonly destination = {};
  readonly oscillators: FakeOscillator[] = [];
  readonly gains: FakeGain[] = [];
  readonly sources: FakeNode[] = [];
  private listeners: (() => void)[] = [];
  readonly addEventListener = vi.fn((event: string, callback: () => void) => { if (event === "statechange") this.listeners.push(callback); });
  readonly removeEventListener = vi.fn((event: string, callback: () => void) => { if (event === "statechange") this.listeners = this.listeners.filter(listener => listener !== callback); });
  readonly resume = vi.fn(async () => { this.setState("running"); });
  readonly close = vi.fn(async () => { this.setState("closed"); });
  setState(state: AudioContextState): void { this.state = state; this.listeners.forEach(fn => fn()); }
  constructor() { contexts.push(this); }
  createGain(): FakeGain { const node = new FakeGain(this); this.gains.push(node); return node; }
  createOscillator(): FakeOscillator { const node = new FakeOscillator(this); this.oscillators.push(node); return node; }
  createMediaElementSource(audio: object): FakeNode {
    if (associated.has(audio)) throw new DOMException("Media element already associated", "InvalidStateError");
    associated.add(audio);
    const source = new FakeNode(this); this.sources.push(source); return source;
  }
}
export function installAudioContext(): void {
  vi.stubGlobal("AudioContext", FakeAudioContext);
  vi.stubGlobal("window", { AudioContext: FakeAudioContext });
}
export function resetAudioFakes(): void { contexts.length = 0; associated = new WeakSet(); }
