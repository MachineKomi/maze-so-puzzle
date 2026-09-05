import { describe, expect, it } from "vitest";
import { thumbDirection } from "./ThumbPad";

describe("anchored thumb steering", () => {
  it("returns to neutral and permits a deliberate reversal", () => {
    expect(thumbDirection(.1,-.1,"up")).toBeNull();
    expect(thumbDirection(-.8,.1,"right")).toBe("left");
  });
  it("keeps diagonal tremor on the chosen corridor until a clear turn", () => {
    for (const y of [.48,.51,.56]) expect(thumbDirection(.5,y,"right")).toBe("right");
    expect(thumbDirection(.5,.7,"right")).toBe("down");
    expect(thumbDirection(.51,.5,"down")).toBe("down");
    expect(thumbDirection(.7,.5,"down")).toBe("right");
  });
});
