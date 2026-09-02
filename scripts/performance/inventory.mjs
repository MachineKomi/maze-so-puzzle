import { brotliCompressSync, gzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { basename, dirname, extname, isAbsolute, relative, resolve, sep } from "node:path";
import { cpus, freemem, platform, release, tmpdir, totalmem, type as osType } from "node:os";
import { readBuildProvenance } from "./build-provenance.mjs";

const root = resolve(import.meta.dirname, "../..");
const args = process.argv.slice(2);
const outputIndex = args.indexOf("--output");
const requestedOutput = outputIndex >= 0 ? args[outputIndex + 1] : undefined;
if (outputIndex >= 0 && !requestedOutput) throw new Error("--output needs a path");

const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");
const posix = (path) => path.split(sep).join("/");
const git = (...gitArgs) => execFileSync("git", gitArgs, { cwd: root, encoding: "utf8" }).trim();

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

async function optionalFiles(directory) {
  try {
    return await walk(directory);
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

function imageDimensions(buffer, extension) {
  if (extension === ".png" && buffer.length >= 24 && buffer.toString("ascii", 1, 4) === "PNG") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), method: "png-ihdr" };
  }
  if (extension !== ".webp" || buffer.length < 30 || buffer.toString("ascii", 0, 4) !== "RIFF") return null;
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return {
      width: 1 + buffer.readUIntLE(24, 3),
      height: 1 + buffer.readUIntLE(27, 3),
      method: "webp-vp8x",
    };
  }
  if (chunk === "VP8L" && buffer[20] === 0x2f) {
    const b1 = buffer[21] ?? 0;
    const b2 = buffer[22] ?? 0;
    const b3 = buffer[23] ?? 0;
    const b4 = buffer[24] ?? 0;
    return {
      width: 1 + b1 + ((b2 & 0x3f) << 8),
      height: 1 + (b2 >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10),
      method: "webp-vp8l",
    };
  }
  if (chunk === "VP8 ") {
    const signature = buffer.indexOf(Buffer.from([0x9d, 0x01, 0x2a]), 20);
    if (signature >= 0 && buffer.length >= signature + 7) {
      return {
        width: buffer.readUInt16LE(signature + 3) & 0x3fff,
        height: buffer.readUInt16LE(signature + 5) & 0x3fff,
        method: "webp-vp8",
      };
    }
  }
  return null;
}

function synchsafe(buffer, offset) {
  return ((buffer[offset] ?? 0) << 21)
    | ((buffer[offset + 1] ?? 0) << 14)
    | ((buffer[offset + 2] ?? 0) << 7)
    | (buffer[offset + 3] ?? 0);
}

function estimatedMp3Duration(buffer) {
  let offset = buffer.toString("ascii", 0, 3) === "ID3" && buffer.length >= 10
    ? 10 + synchsafe(buffer, 6)
    : 0;
  const bitrateV1L3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
  const bitrateV2L3 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0];
  const sampleRates = [44100, 48000, 32000];
  let seconds = 0;
  let frameCount = 0;
  let audioBytes = 0;
  let skippedBytes = 0;
  while (offset + 4 <= buffer.length) {
    const header = buffer.readUInt32BE(offset);
    if ((header >>> 21) === 0x7ff) {
      const versionBits = (header >>> 19) & 0b11;
      const layerBits = (header >>> 17) & 0b11;
      const bitrateIndex = (header >>> 12) & 0b1111;
      const sampleRateIndex = (header >>> 10) & 0b11;
      if (versionBits !== 0b01 && layerBits === 0b01 && sampleRateIndex < 3) {
        const kbps = (versionBits === 0b11 ? bitrateV1L3 : bitrateV2L3)[bitrateIndex] ?? 0;
        const baseRate = sampleRates[sampleRateIndex] ?? 0;
        const sampleRate = versionBits === 0b11
          ? baseRate
          : versionBits === 0b10
            ? baseRate / 2
            : baseRate / 4;
        const samplesPerFrame = versionBits === 0b11 ? 1152 : 576;
        const padding = (header >>> 9) & 1;
        const frameLength = Math.floor(
          ((versionBits === 0b11 ? 144000 : 72000) * kbps) / sampleRate,
        ) + padding;
        if (kbps > 0 && sampleRate > 0 && frameLength >= 4 && offset + frameLength <= buffer.length) {
          seconds += samplesPerFrame / sampleRate;
          frameCount += 1;
          audioBytes += frameLength;
          offset += frameLength;
          continue;
        }
      }
    }
    offset += 1;
    skippedBytes += 1;
  }
  return frameCount > 0 ? {
    seconds: Number(seconds.toFixed(3)),
    method: "mpeg-layer-iii-frame-scan",
    frameCount,
    skippedBytes,
    averageBitrateKbps: Number(((audioBytes * 8) / seconds / 1000).toFixed(3)),
  } : null;
}

function loadingPhase(relativePath, reachable) {
  if (!reachable) return "unclassified-unreferenced";
  if (relativePath.endsWith(".mp3")) return "title-level-entry-or-music-change";
  if (/portrait|title|logo|nav-|goal/i.test(relativePath)) return "title-or-navigation";
  return "level-entry-warmup-or-first-use";
}

function aggregate(entries, key) {
  const groups = new Map();
  for (const entry of entries) {
    const name = entry[key];
    const current = groups.get(name) ?? { name, count: 0, bytes: 0, decodedBytesUpperBound: 0 };
    current.count += 1;
    current.bytes += entry.bytes;
    current.decodedBytesUpperBound += entry.decodedBytesUpperBound ?? 0;
    groups.set(name, current);
  }
  return [...groups.values()].sort((left, right) => right.bytes - left.bytes);
}

const sourceFiles = (await walk(resolve(root, "src"))).filter((path) => /\.(?:ts|tsx|css)$/.test(path));
const sourceText = (await Promise.all(sourceFiles.map((path) => readFile(path, "utf8")))).join("\n");
const publicRoot = resolve(root, "public/assets");
const assetPaths = await optionalFiles(publicRoot);
const runtimePublicPaths = await optionalFiles(resolve(root, "public"));
const assets = [];
for (const path of assetPaths) {
  const buffer = await readFile(path);
  const relativePath = posix(relative(publicRoot, path));
  const extension = extname(relativePath).toLowerCase();
  const dimensions = imageDimensions(buffer, extension);
  const duration = extension === ".mp3" ? estimatedMp3Duration(buffer) : null;
  const reachable = sourceText.includes(`/assets/${relativePath}`);
  assets.push({
    path: relativePath,
    extension,
    bytes: buffer.length,
    sha256: sha256(buffer),
    reachableByStaticLiteral: reachable,
    reachabilityConfidence: reachable ? "high" : "unclassified-needs-runtime-observation",
    loadingPhase: loadingPhase(relativePath, reachable),
    ...(dimensions ? {
      width: dimensions.width,
      height: dimensions.height,
      dimensionsMethod: dimensions.method,
      decodedBytesUpperBound: dimensions.width * dimensions.height * 4,
      decodedMemoryConcern: "rgba-four-bytes-per-pixel-upper-bound",
    } : {}),
    ...(duration ? {
      durationSecondsEstimate: duration.seconds,
      durationMethod: duration.method,
      frameCount: duration.frameCount,
      skippedBytes: duration.skippedBytes,
      averageBitrateKbps: duration.averageBitrateKbps,
      decodedMemoryConcern: "browser-managed-audio-decode-and-stream-buffers",
    } : {}),
  });
}

const distRoot = resolve(root, "dist");
const distPaths = await optionalFiles(distRoot);
const distFiles = [];
for (const path of distPaths) {
  const buffer = await readFile(path);
  const extension = extname(path).toLowerCase();
  distFiles.push({
    path: posix(relative(distRoot, path)),
    extension,
    bytes: buffer.length,
    gzipBytes: [".js", ".css", ".html"].includes(extension) ? gzipSync(buffer, { level: 9 }).length : null,
    brotliBytes: [".js", ".css", ".html"].includes(extension) ? brotliCompressSync(buffer).length : null,
    sha256: sha256(buffer),
  });
}

const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const packageLock = JSON.parse(await readFile(resolve(root, "package-lock.json"), "utf8"));
const cargoLockBuffer = await readFile(resolve(root, "src-tauri/Cargo.lock"));
const releaseRoot = resolve(root, "release");
const releasePaths = (await optionalFiles(releaseRoot)).filter((path) => (
  basename(path).includes(`-${packageJson.version}-`) && extname(path).toLowerCase() === ".exe"
));
const checksumText = await readFile(resolve(releaseRoot, "SHA256SUMS.txt"), "utf8");
const packages = [];
for (const path of releasePaths) {
  const buffer = await readFile(path);
  const hash = sha256(buffer).toUpperCase();
  const listed = checksumText.match(new RegExp(`^([A-F0-9]{64})\\s+${basename(path).replaceAll(".", "\\.")}$`, "mi"))?.[1]?.toUpperCase() ?? null;
  packages.push({
    path: posix(relative(root, path)),
    bytes: buffer.length,
    sha256: hash,
    checksumManifestSha256: listed,
    checksumMatches: listed === hash,
    provenance: "historical-release-artifact-not-rebuilt-by-this-command",
  });
}

const status = git("status", "--short");
const runtimeStatus = git("status", "--short", "--", "src", "public", "index.html", "vite.config.ts", "tsconfig.app.json", "src-tauri");
const dependencyVersions = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};
let buildIdentity = null;
const buildRejectionReasons = [];
try {
  buildIdentity = await readBuildProvenance();
  if (!buildIdentity.runtimeInputsMatch) buildRejectionReasons.push("build-provenance-runtime-input-mismatch");
  if (!buildIdentity.distMatches) buildRejectionReasons.push("build-provenance-dist-mismatch");
} catch (error) {
  buildRejectionReasons.push(`build-provenance-unavailable:${error instanceof Error ? error.message : String(error)}`);
}
const inventory = {
  schema: "maze-performance-inventory/v1",
  generatedAtUtc: new Date().toISOString(),
  evidenceClass: "newly-measured-static-inventory",
  acceptance: distFiles.length === 0
    ? "rejected-missing-production-build"
    : buildRejectionReasons.length === 0
      ? "accepted-static-evidence"
      : "rejected-stale-or-unverifiable-production-build",
  rejectionReasons: buildRejectionReasons,
  provenance: {
    commit: git("rev-parse", "HEAD"),
    commitTimestamp: git("log", "-1", "--format=%cI"),
    commitSubject: git("log", "-1", "--format=%s"),
    workingTreeDirty: status.length > 0,
    workingTreeStatus: status.split(/\r?\n/).filter(Boolean),
    runtimeInputsDirty: runtimeStatus.length > 0,
    runtimeInputStatus: runtimeStatus.split(/\r?\n/).filter(Boolean),
    packageLockSha256: sha256(await readFile(resolve(root, "package-lock.json"))),
    cargoLockSha256: sha256(cargoLockBuffer),
    buildMode: "vite-production-build",
    buildCommand: "npm run build",
    buildProvenance: buildIdentity,
  },
  environment: {
    os: `${osType()} ${release()}`,
    platform: platform(),
    architecture: process.arch,
    cpu: cpus()[0]?.model ?? "unknown",
    logicalProcessors: cpus().length,
    totalMemoryBytes: totalmem(),
    freeMemoryBytesAtInventory: freemem(),
    node: process.version,
    dependencyVersions,
    packageLockRootVersions: packageLock.packages?.[""]?.devDependencies ?? {},
  },
  runtimeAssets: {
    root: "public/assets",
    count: assets.length,
    bytes: assets.reduce((sum, entry) => sum + entry.bytes, 0),
    decodedImageBytesUpperBound: assets.reduce((sum, entry) => sum + (entry.decodedBytesUpperBound ?? 0), 0),
    audioDurationSecondsEstimate: Number(assets.reduce((sum, entry) => sum + (entry.durationSecondsEstimate ?? 0), 0).toFixed(3)),
    durationCaveat: "MP3 duration is derived by scanning MPEG Layer III frames; retain the recorded method and treat it as inventory evidence rather than media QA.",
    byExtension: aggregate(assets, "extension"),
    byLoadingPhase: aggregate(assets, "loadingPhase"),
    byStaticReachability: aggregate(assets.map((entry) => ({ ...entry, staticReachability: String(entry.reachableByStaticLiteral) })), "staticReachability"),
    files: assets,
  },
  runtimePublicDelivery: {
    root: "public",
    count: runtimePublicPaths.length,
    bytes: (await Promise.all(runtimePublicPaths.map(async (path) => (await stat(path)).size)))
      .reduce((sum, bytes) => sum + bytes, 0),
  },
  productionBuild: {
    root: "dist",
    count: distFiles.length,
    bytes: distFiles.reduce((sum, entry) => sum + entry.bytes, 0),
    files: distFiles,
  },
  releasePackages: packages,
  staticSourceSignals: {
    keyframeRules: (sourceText.match(/@keyframes\s+/g) ?? []).length,
    animationDeclarations: (sourceText.match(/animation(?:-name)?\s*:/g) ?? []).length,
    filterDeclarations: (sourceText.match(/(?:backdrop-)?filter\s*:/g) ?? []).length,
    maskDeclarations: (sourceText.match(/(?:-webkit-)?mask(?:-[a-z-]+)?\s*:/g) ?? []).length,
    blendModeDeclarations: (sourceText.match(/(?:mix-)?blend-mode\s*:/g) ?? []).length,
  },
};

const defaultRoot = resolve(tmpdir(), "maze-so-puzzle-performance");
const output = requestedOutput
  ? resolve(isAbsolute(requestedOutput) ? requestedOutput : resolve(root, requestedOutput))
  : resolve(defaultRoot, inventory.provenance.commit.slice(0, 12), `inventory-${new Date().toISOString().replaceAll(":", "-")}.json`);
const isInside = (parent, candidate) => {
  const child = relative(parent, candidate);
  return child === "" || (child !== ".." && !child.startsWith(`..${sep}`) && !isAbsolute(child));
};
if (isInside(root, output)) {
  throw new Error(`Raw performance evidence must be written outside the repository: ${output}`);
}
await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
console.log(`performance-inventory: ${assets.length} runtime assets, ${inventory.runtimeAssets.bytes} bytes`);
console.log(`performance-inventory: ${distFiles.length} dist files, ${inventory.productionBuild.bytes} bytes`);
console.log(`performance-inventory: ${packages.length} version ${packageJson.version} release packages inventoried`);
console.log(`performance-inventory: ${output}`);
