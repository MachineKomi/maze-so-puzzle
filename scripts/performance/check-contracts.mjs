import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const readJson = async (relativePath) => JSON.parse(
  await readFile(resolve(root, relativePath), "utf8"),
);

const fixtures = await readJson("scripts/performance/fixtures/scenarios.json");
const ledger = await readJson("scripts/performance/feature-allocations.json");
const errors = [];
const budgetFields = ["compressedJsBytes", "compressedCssBytes", "runtimePublicBytes"];
const expectedOwners = ["ui", "art", "lighting", "vfx", "animation", "gameplay", "controls", "audio", "campaign"];

function forbiddenRouteKey(value, path = "fixtures") {
  if (Array.isArray(value)) {
    for (const [index, child] of value.entries()) {
      const found = forbiddenRouteKey(child, `${path}[${index}]`);
      if (found) return found;
    }
    return null;
  }
  if (value === null || typeof value !== "object") return null;
  for (const [key, child] of Object.entries(value)) {
    if (key === "directions" || key === "coordinates") return `${path}.${key}`;
    const found = forbiddenRouteKey(child, `${path}.${key}`);
    if (found) return found;
  }
  return null;
}

if (fixtures.schemaVersion !== 1) errors.push("Scenario schemaVersion must be 1.");
if (fixtures.routePolicy !== "derive-from-current-engine") {
  errors.push("Routes must be derived from the current engine.");
}
if (!Array.isArray(fixtures.scenarios)) errors.push("scenarios must be an array.");

const scenarios = Array.isArray(fixtures.scenarios) ? fixtures.scenarios : [];
const ids = scenarios.map((scenario) => scenario.id);
const expectedIds = Array.from({ length: 11 }, (_, index) => `S${String(index + 1).padStart(2, "0")}`);
if (JSON.stringify(ids) !== JSON.stringify(expectedIds)) {
  errors.push(`Scenario IDs must be exactly ${expectedIds.join(", ")} in order.`);
}
for (const scenario of scenarios) {
  if (typeof scenario.id !== "string" || !/^S(?:0[1-9]|1[01])$/.test(scenario.id)) {
    errors.push(`${String(scenario.id ?? "unknown")} has an invalid scenario ID.`);
  }
  if (typeof scenario.name !== "string" || scenario.name.length === 0) {
    errors.push(`${scenario.id ?? "unknown"} needs a name.`);
  }
  if (!["web", "shared", "tauri"].includes(scenario.surface)) {
    errors.push(`${scenario.id ?? "unknown"} has an invalid surface.`);
  }
}
const forbiddenFixturePath = forbiddenRouteKey(fixtures);
if (forbiddenFixturePath) errors.push(`${forbiddenFixturePath} contains a forbidden recorded route.`);

if (ledger.schemaVersion !== 1) errors.push("Ledger schemaVersion must be 1.");
if (ledger.policy !== "provisional-report-only") {
  errors.push("Feature allocations must remain provisional in Pass 07A.");
}
if (!/^[0-9a-f]{40}$/.test(ledger.baselineCommit ?? "")) {
  errors.push("Ledger baselineCommit must be a full lowercase Git commit hash.");
}
for (const field of budgetFields) {
  if (!Number.isSafeInteger(ledger.baseline?.[field]) || ledger.baseline[field] < 0) {
    errors.push(`Ledger baseline.${field} must be a non-negative safe integer.`);
  }
}
if (!Array.isArray(ledger.allocations)) errors.push("Ledger allocations must be an array.");
const allocations = Array.isArray(ledger.allocations) ? ledger.allocations : [];
const owners = allocations.map((entry) => entry.owner);
for (const owner of expectedOwners) {
  if (!owners.includes(owner)) errors.push(`Missing feature-allocation owner ${owner}.`);
}
for (const [flag, expected] of Object.entries({
  compressedGrowthRequiresAllocation: true,
  allocationNeedsEvidence: true,
  allocationNeedsRollback: true,
})) {
  if (ledger.rules?.[flag] !== expected) errors.push(`Ledger rules.${flag} must remain ${expected}.`);
}
if (owners.some((owner) => !expectedOwners.includes(owner))) errors.push("Feature-allocation owners must use the registered owner set.");
const allocationIds = new Set();
for (const [index, entry] of allocations.entries()) {
  const prefix = `Allocation ${index}`;
  if (typeof entry.owner !== "string" || entry.owner.length === 0) {
    errors.push(`${prefix} needs an owner.`);
  }
  if (!ledger.allocationSchema?.allowedStatus?.includes(entry.status)) {
    errors.push(`Allocation owner ${entry.owner ?? "unknown"} has an invalid status.`);
  }
  let hasPositiveBudget = false;
  for (const field of budgetFields) {
    if (!Number.isSafeInteger(entry[field]) || entry[field] < 0) {
      errors.push(`${prefix}.${field} must be a non-negative safe integer.`);
    } else if (entry[field] > 0) {
      hasPositiveBudget = true;
    }
  }
  if (entry.status === "approved" && !hasPositiveBudget) {
    errors.push(`${prefix} cannot be approved without a positive budget.`);
  }
  if (!hasPositiveBudget) continue;
  if (entry.status === "unallocated") {
    errors.push(`${prefix} cannot assign bytes while status is unallocated.`);
  }
  for (const field of ledger.allocationSchema?.requiredForNonZeroAllocation ?? []) {
    if (typeof entry[field] !== "string" || entry[field].trim().length === 0) {
      errors.push(`${prefix}.${field} must be a non-empty string for a non-zero allocation.`);
    }
  }
  if (entry.id !== undefined && (typeof entry.id !== "string" || entry.id.trim().length === 0)) {
    errors.push(`${prefix}.id must be a non-empty string when present.`);
  } else if (typeof entry.id === "string") {
    if (allocationIds.has(entry.id)) errors.push(`Allocation ID ${entry.id} must be unique.`);
    allocationIds.add(entry.id);
  }
  if (typeof entry.reviewBy === "string") {
    const parsed = new Date(`${entry.reviewBy}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.reviewBy) || Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== entry.reviewBy) {
      errors.push(`${prefix}.reviewBy must be a real calendar date using YYYY-MM-DD.`);
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`performance-contract: ${error}`);
  process.exitCode = 1;
} else {
  console.log(`performance-contract: ${scenarios.length} scenarios and ${new Set(owners).size} registered allocation owners valid`);
  console.log("performance-contract: timing thresholds are report-only");
}
