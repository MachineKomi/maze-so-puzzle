import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

export const repoRoot = resolve(import.meta.dirname, "../..");
export const markerPath = resolve(repoRoot, "node_modules/.cache/maze-performance/build-provenance.json");

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const git = (...args) => execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" }).trim();

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

async function hashFiles(paths) {
  const rows = [];
  for (const path of [...paths].sort()) {
    const buffer = await readFile(path);
    rows.push(`${relative(repoRoot, path).split(sep).join("/")}\0${buffer.length}\0${sha256(buffer)}`);
  }
  return sha256(rows.join("\n"));
}

export async function runtimeInputsFingerprint() {
  const paths = [
    ...await walk(resolve(repoRoot, "src")),
    ...await walk(resolve(repoRoot, "public")),
    ...[
      "index.html",
      "package.json",
      "package-lock.json",
      "vite.config.ts",
      "tsconfig.json",
      "tsconfig.app.json",
      "tsconfig.node.json",
    ].map((path) => resolve(repoRoot, path)),
  ];
  return hashFiles(paths);
}

export async function distFingerprint() {
  return hashFiles(await walk(resolve(repoRoot, "dist")));
}

export async function readBuildProvenance() {
  const marker = JSON.parse(await readFile(markerPath, "utf8"));
  const currentRuntimeInputsSha256 = await runtimeInputsFingerprint();
  const currentDistFingerprintSha256 = await distFingerprint();
  return {
    marker,
    currentRuntimeInputsSha256,
    currentDistFingerprintSha256,
    runtimeInputsMatch: marker.runtimeInputsSha256 === currentRuntimeInputsSha256,
    distMatches: marker.distFingerprintSha256 === currentDistFingerprintSha256,
  };
}

async function writeBuildProvenance() {
  const marker = {
    schema: "maze-performance-build-provenance/v1",
    generatedAtUtc: new Date().toISOString(),
    commit: git("rev-parse", "HEAD"),
    runtimeInputsSha256: await runtimeInputsFingerprint(),
    distFingerprintSha256: await distFingerprint(),
    buildCommand: "npm run build",
  };
  await mkdir(dirname(markerPath), { recursive: true });
  await writeFile(markerPath, `${JSON.stringify(marker, null, 2)}\n`, "utf8");
  console.log(`performance-build-provenance: ${markerPath}`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await writeBuildProvenance();
}
