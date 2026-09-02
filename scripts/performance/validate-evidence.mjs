import { readFile, readdir, stat } from "node:fs/promises";
import { extname, resolve } from "node:path";

const inputs = process.argv.slice(2);
if (inputs.length === 0) throw new Error("Usage: npm run perf:validate -- <evidence.json-or-directory> [...]");

const SHA256 = /^[0-9a-f]{64}$/;
const COMMIT = /^[0-9a-f]{40}$/;
const browserScenarioIds = ["S01", "S02", "S03", "S04", "S05", "S08"];
const tauriScenarioIds = [
  "S11:cold-start",
  "S11:warm-start",
  "S11:idle",
  "S11:sustained-play",
  "S11:resize",
  "S11:save-resume-reopen",
];

async function jsonFiles(path) {
  const metadata = await stat(path);
  if (metadata.isFile()) return extname(path).toLowerCase() === ".json" ? [path] : [];
  const files = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    files.push(...await jsonFiles(resolve(path, entry.name)));
  }
  return files;
}

function validate(report, label) {
  const errors = [];
  const add = (message) => errors.push(`${label}: ${message}`);
  const requireFields = (value, fields, prefix) => {
    for (const field of fields) {
      if (value?.[field] === undefined || value?.[field] === null || value?.[field] === "") {
        add(`${prefix}.${field} is required`);
      }
    }
  };
  const validTimestamp = (value, prefix) => {
    if (typeof value !== "string" || Number.isNaN(Date.parse(value))) add(`${prefix} must be an ISO-compatible timestamp`);
  };
  const validHash = (value, prefix) => {
    if (typeof value !== "string" || !SHA256.test(value)) add(`${prefix} must be a lowercase SHA-256`);
  };
  const validCommit = (value, prefix) => {
    if (typeof value !== "string" || !COMMIT.test(value)) add(`${prefix} must be a full lowercase commit hash`);
  };
  const portableEvidencePath = (value, prefix) => {
    if (typeof value !== "string" || value.length === 0) add(`${prefix} is required`);
    else if (/^[a-z]:[\\/]/i.test(value) || /[\\/]Users[\\/]/i.test(value)) add(`${prefix} must not expose a private absolute user path`);
  };

  validTimestamp(report.generatedAtUtc, "report.generatedAtUtc");

  if (report.schema === "maze-performance-inventory/v1") {
    requireFields(report, ["evidenceClass", "acceptance", "rejectionReasons"], "report");
    requireFields(report.provenance, [
      "commit",
      "commitTimestamp",
      "packageLockSha256",
      "cargoLockSha256",
      "buildMode",
      "buildProvenance",
    ], "provenance");
    validCommit(report.provenance?.commit, "provenance.commit");
    validTimestamp(report.provenance?.commitTimestamp, "provenance.commitTimestamp");
    validHash(report.provenance?.packageLockSha256, "provenance.packageLockSha256");
    validHash(report.provenance?.cargoLockSha256, "provenance.cargoLockSha256");
    requireFields(report.environment, ["os", "architecture", "cpu", "node"], "environment");
    requireFields(report.runtimeAssets, ["count", "bytes", "decodedImageBytesUpperBound"], "runtimeAssets");
    requireFields(report.runtimePublicDelivery, ["count", "bytes"], "runtimePublicDelivery");
    requireFields(report.productionBuild, ["count", "bytes"], "productionBuild");
    const identity = report.provenance?.buildProvenance;
    requireFields(identity, ["marker", "currentRuntimeInputsSha256", "currentDistFingerprintSha256", "runtimeInputsMatch", "distMatches"], "provenance.buildProvenance");
    validHash(identity?.currentRuntimeInputsSha256, "provenance.buildProvenance.currentRuntimeInputsSha256");
    validHash(identity?.currentDistFingerprintSha256, "provenance.buildProvenance.currentDistFingerprintSha256");
    if (report.acceptance === "accepted-static-evidence") {
      if (report.rejectionReasons?.length !== 0) add("accepted inventory must have no rejection reasons");
      if (identity?.runtimeInputsMatch !== true || identity?.distMatches !== true) add("accepted inventory must match runtime-input and dist build provenance");
      if (!(report.productionBuild?.count > 0)) add("accepted inventory must contain a production build");
    } else if (!String(report.acceptance).startsWith("rejected-")) {
      add(`unsupported inventory acceptance ${String(report.acceptance)}`);
    }
  } else if (report.schema === "maze-performance-browser-cohort/v1") {
    requireFields(report, ["acceptance", "evidenceClass", "buildMode", "timingPolicy", "scenarioFixtureSha256", "rows"], "report");
    if (report.buildMode !== "vite-production-preview") add("browser buildMode must be vite-production-preview");
    if (report.timingPolicy !== "report-only") add("browser timingPolicy must remain report-only");
    validHash(report.scenarioFixtureSha256, "report.scenarioFixtureSha256");
    requireFields(report.provenance, ["commit", "packageLockSha256", "cargoLockSha256", "distFingerprintSha256", "buildProvenance"], "provenance");
    validCommit(report.provenance?.commit, "provenance.commit");
    for (const field of ["packageLockSha256", "cargoLockSha256", "distFingerprintSha256"]) validHash(report.provenance?.[field], `provenance.${field}`);
    requireFields(report.environment, [
      "os",
      "hardware",
      "browserName",
      "browserVersion",
      "playwrightVersion",
      "viewport",
      "throttling",
      "powerMode",
      "hostGate",
    ], "environment");
    if (!["clean", "not-attested", "contaminated"].includes(report.environment?.hostGate)) add("environment.hostGate has an invalid value");
    if (!Array.isArray(report.rows)) add("rows must be an array");
    const rows = Array.isArray(report.rows) ? report.rows : [];
    if (JSON.stringify(rows.map((row) => row.scenarioId)) !== JSON.stringify(browserScenarioIds)) {
      add(`browser rows must be exactly ${browserScenarioIds.join(", ")} in order`);
    }
    for (const [index, row] of rows.entries()) {
      const prefix = `rows[${index}]`;
      requireFields(row, ["scenarioId", "cacheState", "runCount", "acceptance", "rejectionReasons", "metrics", "samples"], prefix);
      if (!Number.isSafeInteger(row.runCount) || row.runCount < 5) add(`${prefix}.runCount must be at least 5`);
      if (!Array.isArray(row.samples) || row.runCount !== row.samples.length) add(`${prefix}.runCount does not match samples`);
      if (row.acceptance !== report.acceptance) add(`${prefix}.acceptance must match report acceptance`);
      if (row.acceptance === "accepted-host-gated") {
        if (report.environment?.hostGate !== "clean") add(`${prefix} cannot be accepted without a clean host gate`);
        if (row.rejectionReasons?.length !== 0) add(`${prefix} accepted row must have no rejection reasons`);
        if (report.provenance?.runtimeInputStatus?.length !== 0) add(`${prefix} accepted row must have clean runtime inputs`);
      } else if (row.acceptance === "contaminated-report-only") {
        if (!Array.isArray(row.rejectionReasons) || row.rejectionReasons.length === 0) add(`${prefix} contaminated row needs a rejection reason`);
      } else {
        add(`${prefix} has unsupported acceptance ${String(row.acceptance)}`);
      }
      const requiredMetrics = [
        "semanticReadyMs",
        "domContentLoadedMs",
        "loadEventMs",
        "cumulativeLayoutShift",
        "longTaskCount",
        "longTaskTotalMs",
        "longestTaskMs",
        "resourceCount",
        "transferBytes",
        "encodedBodyBytes",
      ];
      for (const metric of requiredMetrics) {
        if (!Array.isArray(row.metrics?.[metric]?.values) || row.metrics[metric].values.length !== row.runCount) {
          add(`${prefix}.metrics.${metric}.values must contain one value per run`);
        }
      }
      for (const [sampleIndex, sample] of (row.samples ?? []).entries()) {
        validTimestamp(sample.capturedAtUtc, `${prefix}.samples[${sampleIndex}].capturedAtUtc`);
        for (const metric of requiredMetrics) {
          if (typeof sample[metric] !== "number" || !Number.isFinite(sample[metric])) add(`${prefix}.samples[${sampleIndex}].${metric} must be finite`);
        }
      }
      if (["S04", "S05"].includes(row.scenarioId)) {
        for (const [sampleIndex, sample] of (row.samples ?? []).entries()) {
          if (sample.checkpoint?.minimapTileCount !== 529) add(`${prefix}.samples[${sampleIndex}] must verify 529 minimap tiles`);
        }
      }
    }
    if (report.acceptance === "accepted-host-gated" && report.environment?.hostGate !== "clean") add("accepted browser report requires a clean host gate");
    if (!["accepted-host-gated", "contaminated-report-only"].includes(report.acceptance)) add(`unsupported browser acceptance ${String(report.acceptance)}`);
  } else if (report.schema === "maze-performance-tauri-cohort/v1") {
    requireFields(report, [
      "acceptance",
      "evidenceClass",
      "timingPolicy",
      "readinessDefinition",
      "rejectionReasons",
      "plannedScenarios",
      "measuredScenarios",
      "runCount",
      "samples",
      "unavailable",
    ], "report");
    if (report.timingPolicy !== "report-only") add("Tauri timingPolicy must remain report-only");
    if (JSON.stringify(report.plannedScenarios) !== JSON.stringify(tauriScenarioIds)) add("Tauri plannedScenarios must preserve the complete S11 contract");
    if (!Array.isArray(report.measuredScenarios)) add("Tauri measuredScenarios must be an array");
    requireFields(report.provenance, ["commit", "packageLockSha256", "cargoLockSha256", "executablePath", "executableBytes", "executableSha256", "buildMode"], "provenance");
    validCommit(report.provenance?.commit, "provenance.commit");
    for (const field of ["packageLockSha256", "cargoLockSha256", "executableSha256"]) validHash(report.provenance?.[field], `provenance.${field}`);
    requireFields(report.environment, ["os", "architecture", "cpu", "gpu", "webView2Versions", "powerMode", "hostGate"], "environment");
    if (!Array.isArray(report.samples) || report.samples.length !== report.runCount) add("runCount does not match samples");
    if (report.runCount > 0 && report.runCount < 5) add("a measured Tauri cohort requires at least five runs");
    for (const [index, sample] of (report.samples ?? []).entries()) validTimestamp(sample.capturedAtUtc, `samples[${index}].capturedAtUtc`);
    if (report.evidenceClass === "artifact-inventory-only") {
      if (report.measuredScenarios?.length !== 0) add("inventory-only Tauri evidence cannot claim a measured scenario");
      if (report.runCount !== 0 || !report.rejectionReasons?.includes("inventory-only-no-launch-timing")) add("inventory-only Tauri evidence must be an explicit zero-run pending row");
      if (report.acceptance !== "pending-hardware") add("inventory-only Tauri evidence must be pending-hardware");
    }
    if (report.evidenceClass === "native-window-ready-launch-proxy") {
      if (JSON.stringify(report.measuredScenarios) !== JSON.stringify(["S11:native-window-ready-launch-proxy"])) add("native-window proxy must identify only its actual measured scenario");
      if (!report.rejectionReasons?.includes("native-window-proxy-is-not-semantic-webview-readiness")) add("native-window proxy must reject semantic WebView readiness claims");
      if (report.acceptance !== "contaminated-report-only") add("native-window proxy must remain contaminated-report-only");
      if (!report.unavailable?.includes("semantic WebView2 visible-and-interactive readiness")) add("native-window proxy must mark semantic WebView readiness unavailable");
    }
    if (!["artifact-inventory-only", "native-window-ready-launch-proxy"].includes(report.evidenceClass)) add(`unsupported Tauri evidenceClass ${String(report.evidenceClass)}`);
  } else if (report.schema === "maze-performance-reviewed-summary/v1") {
    requireFields(report, ["commit", "evidenceClass", "acceptance", "reason", "rawEvidence"], "report");
    validCommit(report.commit, "report.commit");
    if (!["accepted-host-gated", "accepted-static-evidence", "contaminated-report-only", "pending-hardware"].includes(report.acceptance)) {
      add(`unsupported reviewed-summary acceptance ${String(report.acceptance)}`);
    }
    portableEvidencePath(report.rawEvidence?.path, "rawEvidence.path");
    validHash(report.rawEvidence?.sha256, "rawEvidence.sha256");
    if (report.rawEvidence?.artifactManifestPath !== undefined) portableEvidencePath(report.rawEvidence.artifactManifestPath, "rawEvidence.artifactManifestPath");
    if (report.rawEvidence?.artifactManifestSha256 !== undefined) validHash(report.rawEvidence.artifactManifestSha256, "rawEvidence.artifactManifestSha256");
    if (Array.isArray(report.rows)) {
      if (report.environment?.runsPerScenario < 5) add("reviewed browser summaries require at least five runs per scenario");
      const represented = [...report.rows.map((row) => row.scenarioId), ...(report.excludedScenarioIds ?? [])]
        .sort((left, right) => browserScenarioIds.indexOf(left) - browserScenarioIds.indexOf(right));
      if (JSON.stringify(represented) !== JSON.stringify(browserScenarioIds)) add("reviewed browser summary must include or explicitly exclude every required scenario");
    }
    for (const [index, rejected] of (report.rejectedEvidence ?? []).entries()) {
      portableEvidencePath(rejected.path, `rejectedEvidence[${index}].path`);
      if (typeof rejected.reason !== "string" || rejected.reason.length === 0) add(`rejectedEvidence[${index}].reason is required`);
    }
    if (report.acceptance === "pending-hardware" && report.runCount !== 0) add("pending-hardware reviewed summary must have runCount 0");
  } else if (report.schema === "maze-performance-artifact-manifest/v1") {
    requireFields(report, ["evidenceRoot", "files", "retention"], "report");
    if (!Array.isArray(report.files) || report.files.length === 0) add("artifact manifest files must not be empty");
    for (const [index, file] of (report.files ?? []).entries()) {
      requireFields(file, ["name", "bytes", "sha256", "mediaType"], `files[${index}]`);
      validHash(file.sha256, `files[${index}].sha256`);
    }
  } else {
    add(`Unknown evidence schema: ${String(report.schema)}`);
  }

  return errors;
}

const files = (await Promise.all(inputs.map((input) => jsonFiles(resolve(process.cwd(), input))))).flat().sort();
if (files.length === 0) throw new Error("No JSON evidence files found.");
const allErrors = [];
for (const path of files) {
  const report = JSON.parse((await readFile(path, "utf8")).replace(/^\uFEFF/, ""));
  const label = path.replaceAll("\\", "/");
  const errors = validate(report, label);
  if (errors.length === 0) console.log(`performance-evidence: valid ${report.schema} (${label})`);
  allErrors.push(...errors);
}

if (allErrors.length > 0) {
  for (const error of allErrors) console.error(`performance-evidence: ${error}`);
  process.exitCode = 1;
} else {
  console.log(`performance-evidence: ${files.length} file(s) passed`);
}
