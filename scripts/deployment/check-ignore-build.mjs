import assert from "node:assert/strict";
// Explicit node --test entry point; do not use Vitest's *.test.* filename pattern.
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { decideBuild, isNonWebPath } from "./ignore-build.mjs";

const root = resolve(import.meta.dirname, "../..");
const previous = "a".repeat(40), current = "b".repeat(40);
const env = { VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: "main",
  VERCEL_GIT_PREVIOUS_SHA: previous, VERCEL_GIT_COMMIT_SHA: current };
const decide = (paths, overrides = {}) => decideBuild({ env: { ...env, ...overrides }, git(args) {
  if (args[0] === "rev-parse") return current + "\n";
  if (args[0] === "cat-file") return "";
  assert.deepEqual(args, ["diff", "--name-only", "--no-renames", "-z", previous, current, "--"]);
  return paths.length ? paths.join("\0") + "\0" : "";
} });

test("known non-web paths skip, including source-art evidence outside public", () => {
  for (const path of ["README.md", "docs/ART_BIBLE.md", "docs/source-assets/master.png",
    "release/SHA256SUMS.txt", ".github/workflows/ci.yml", "src-tauri/src/lib.rs"]) {
    assert.equal(isNonWebPath(path), true, path);
    assert.equal(decide([path]).exitCode, 0, path);
  }
});
test("web, media, dependencies, build/deploy scripts and unknown files always build", () => {
  for (const path of ["src/App.tsx", "src/notes.md", "public/help.md", "public/assets/ost/song.mp3",
    "index.html", "package.json", "package-lock.json", "vite.config.ts", "vercel.json",
    ".vercelignore", ".gitattributes", ".env.production", "tsconfig.json",
    "scripts/deployment/ignore-build.mjs", "scripts/performance/build-provenance.mjs", "new.config"]) {
    assert.equal(decide(["docs/log.md", path]).exitCode, 1, path);
  }
});
test("deletions and moves out of runtime cannot hide behind doc-only destination", () => {
  assert.equal(decide(["src/removed.ts", "docs/removed.ts"]).exitCode, 1);
  assert.equal(decide(["public/assets/removed.webp"]).exitCode, 1);
});
test("empty successful-baseline diff skips for production and explicit previews", () => {
  assert.equal(decide([]).exitCode, 0);
  assert.equal(decide(["docs/notes.md"], { VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "codex/preview/check" }).exitCode, 0);
});
test("first deploy, malformed SHA, unknown environment and missing branch build safely", () => {
  for (const override of [{ VERCEL_GIT_PREVIOUS_SHA: "" }, { VERCEL_GIT_PREVIOUS_SHA: "HEAD^" },
    { VERCEL_GIT_COMMIT_SHA: "--help" }, { VERCEL_ENV: "" }, { VERCEL_ENV: "staging" },
    { VERCEL_GIT_COMMIT_REF: "" }]) assert.equal(decide([], override).exitCode, 1);
});
test("manual force builds and never inspects Git", () => {
  assert.equal(decideBuild({ env: { MSP_FORCE_DEPLOY: "1" }, git() { throw Error("must not run"); } }).exitCode, 1);
});
test("wrong checkout, missing shallow baseline and invalid diff build safely", () => {
  assert.equal(decideBuild({ env, git: () => previous }).exitCode, 1);
  assert.equal(decideBuild({ env, git: () => { throw Error("missing commit"); } }).exitCode, 1);
  assert.equal(decideBuild({ env, git: (args) => args[0] === "rev-parse" ? current : "docs/incomplete.md" }).exitCode, 1);
});
test("configuration keeps main/default branches and opts routine codex previews out", () => {
  const config = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));
  assert.equal(config.ignoreCommand, "node scripts/deployment/ignore-build.mjs");
  assert.equal(config.outputDirectory, "dist");
  assert.deepEqual(config.git.deploymentEnabled, { "codex/**": false, "codex/preview/**": true });
});

// Real Git + CLI regression cases: no fixture directories/files or cleanup.
// Opt in locally with MSP_DEPLOY_HISTORY_TESTS=1. CI keeps its cheap shallow
// checkout; these historical cases must not force downloading old source art.
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const cases = [
  ["7ad381670ffd7a362324a871fb00e266fda43608", "a28141e2b34d5289152bca86952bfeacfa2c0b03", 0, "docs-only release handoff"],
  ["7ad381670ffd7a362324a871fb00e266fda43608", "67db82cc122d903c815591f5e402ed00b0e0cdfd", 1, "multi-commit push ending in docs still contains wall runtime change"],
  ["e28d44bd4b290bc3c64aad5ff24f944f4a8cc0ce", "7ad381670ffd7a362324a871fb00e266fda43608", 1, "real reward runtime release"],
];
for (const [headRef, baseRef, expected, label] of cases) test(`real history: ${label}`, { skip: process.env.MSP_DEPLOY_HISTORY_TESTS !== "1" }, () => {
  const historicalHead = git("rev-parse", headRef), baseline = git("rev-parse", baseRef);
  const decision = decideBuild({ env: { ...env, VERCEL_GIT_COMMIT_SHA: historicalHead, VERCEL_GIT_PREVIOUS_SHA: baseline },
    git: (args) => args[0] === "rev-parse" ? historicalHead : execFileSync("git", args, { cwd: root, encoding: "utf8" }) });
  assert.equal(decision.exitCode, expected);
});
test("CLI uses Vercel exit convention on exact current HEAD and missing baseline", () => {
  const head = git("rev-parse", "HEAD");
  for (const [baseline, expected] of [[head, 0], ["0".repeat(40), 1]]) {
    const result = spawnSync(process.execPath, ["scripts/deployment/ignore-build.mjs"], { cwd: root, encoding: "utf8",
      env: { ...process.env, ...env, MSP_FORCE_DEPLOY: "0", VERCEL_GIT_COMMIT_SHA: head, VERCEL_GIT_PREVIOUS_SHA: baseline } });
    assert.equal(result.status, expected, result.stderr);
    assert.match(result.stdout, new RegExp(expected ? "BUILD" : "SKIP"));
  }
});
