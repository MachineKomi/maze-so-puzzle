import { describe, expect, it } from "vitest";
import { directionFromTouchDrag, touchDeadZoneForCell } from "./touchGesture";

describe("directionFromTouchDrag", () => {
  const origin = { x: 100, y: 100 };

  it("ignores movement inside the dead zone", () => {
    expect(directionFromTouchDrag(origin, { x: 106, y: 106 }, 12)).toBeNull();
  });

  it.each([
    [{ x: 140, y: 107 }, "right"],
    [{ x: 60, y: 93 }, "left"],
    [{ x: 107, y: 140 }, "down"],
    [{ x: 93, y: 60 }, "up"],
  ] as const)("chooses the dominant axis for %o", (current, expected) => {
    expect(directionFromTouchDrag(origin, current, 12)).toBe(expected);
  });

  it("can change direction as the same finger moves around its start point", () => {
    expect(directionFromTouchDrag(origin, { x: 135, y: 104 }, 12)).toBe("right");
    expect(directionFromTouchDrag(origin, { x: 103, y: 62 }, 12)).toBe("up");
    expect(directionFromTouchDrag(origin, { x: 70, y: 106 }, 12)).toBe("left");
    expect(directionFromTouchDrag(origin, { x: 104, y: 103 }, 12)).toBeNull();
  });
});

describe("touchDeadZoneForCell", () => {
  it("has practical phone and tablet limits", () => {
    expect(touchDeadZoneForCell(24, 30)).toBe(10);
    expect(touchDeadZoneForCell(50, 60)).toBe(16);
    expect(touchDeadZoneForCell(100, 100)).toBe(22);
  });
});
