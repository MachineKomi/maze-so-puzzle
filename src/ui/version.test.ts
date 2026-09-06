import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BUILD_VERSION } from "./version";

describe("release identity", () => {
  it("keeps the visible build label aligned with locked web and native metadata", () => {
    const read = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), "utf8");
    const version = JSON.parse(read("package.json")).version;
    expect(BUILD_VERSION).toBe(version);
    const lock = JSON.parse(read("package-lock.json"));
    expect(lock.version).toBe(version);
    expect(lock.packages[""].version).toBe(version);
    expect(JSON.parse(read("src-tauri/tauri.conf.json")).version).toBe(version);
    expect(read("src-tauri/Cargo.toml").match(/^version = "([^"]+)"/m)?.[1]).toBe(version);
  });
});
