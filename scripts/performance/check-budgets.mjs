import { gzipSync } from "node:zlib";
import { readFile, readdir } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { readBuildProvenance } from "./build-provenance.mjs";

const root = resolve(import.meta.dirname, "../..");
const ledger = JSON.parse(await readFile(resolve(root, "scripts/performance/feature-allocations.json"), "utf8"));
const allocations = Array.isArray(ledger.allocations) ? ledger.allocations : [];
const allowance = (field) => allocations.reduce((sum, entry) => (
  entry.status === "approved" ? sum + (Number(entry[field]) || 0) : sum
), 0);
const baseline = ledger.baseline;
for (const field of ["compressedJsBytes", "compressedCssBytes", "runtimePublicBytes"]) {
  if (!Number.isSafeInteger(baseline?.[field]) || baseline[field] < 0) {
    throw new Error(`Invalid performance baseline field ${field}. Run perf:check before using the budget gate.`);
  }
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

const distFiles = await walk(resolve(root, "dist"));
const publicFiles = await walk(resolve(root, "public"));
let compressedJsBytes = 0;
let compressedCssBytes = 0;
for (const path of distFiles) {
  const extension = extname(path).toLowerCase();
  if (extension !== ".js" && extension !== ".css") continue;
  const compressedBytes = gzipSync(await readFile(path), { level: 9 }).length;
  if (extension === ".js") compressedJsBytes += compressedBytes;
  else compressedCssBytes += compressedBytes;
}
const runtimePublicBytes = (await Promise.all(publicFiles.map(async (path) => (await readFile(path)).length)))
  .reduce((sum, bytes) => sum + bytes, 0);
const actual = { compressedJsBytes, compressedCssBytes, runtimePublicBytes };
const errors = [];
const buildIdentity = await readBuildProvenance();
if (!buildIdentity.runtimeInputsMatch) errors.push("dist build provenance does not match current runtime inputs; run npm run build");
if (!buildIdentity.distMatches) errors.push("dist fingerprint does not match its build provenance; run npm run build");
for (const field of Object.keys(baseline)) {
  const limit = baseline[field] + allowance(field);
  const value = actual[field];
  console.log(`performance-budget: ${field}=${value} limit=${limit}`);
  if (value > limit) {
    errors.push(`${field} exceeds the historical baseline plus explicit feature allocations by ${value - limit} bytes`);
  }
}
if (errors.length > 0) {
  for (const error of errors) console.error(`performance-budget: ${error}`);
  process.exitCode = 1;
} else {
  console.log("performance-budget: deterministic byte non-regression gate passed");
  console.log("performance-budget: timing thresholds remain report-only");
}
