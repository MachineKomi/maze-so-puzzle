import { describe, expect, it } from "vitest";
import { BUILD_VERSION } from "./version";
import packageMetadata from "../../package.json";
import lock from "../../package-lock.json";
import desktopMetadata from "../../src-tauri/tauri.conf.json";

describe("release identity", () => {
  it("keeps the visible build label aligned with locked web and native metadata", () => {
    const version = packageMetadata.version;
    expect(BUILD_VERSION).toBe(version);
    expect(lock.version).toBe(version);
    expect(lock.packages[""].version).toBe(version);
    expect(desktopMetadata.version).toBe(version);
  });
});
