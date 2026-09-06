// Runs before npm install. Vercel deliberately uses 0 = SKIP and 1 = BUILD.
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Only known non-web inputs may skip. Unknown files/config always build.
// If a future bundler imports docs as production content, remove that exemption.
export function isNonWebPath(path) {
  return ["docs/", "release/", ".github/", "src-tauri/"].some((prefix) => path.startsWith(prefix))
    || /^[^/]+\.md$/i.test(path);
}

export function decideBuild({ env = process.env, cwd = process.cwd(), git } = {}) {
  const build = (reason) => ({ exitCode: 1, action: "BUILD", reason });
  const skip = (reason) => ({ exitCode: 0, action: "SKIP", reason });
  if (env.MSP_FORCE_DEPLOY === "1") return build("explicit MSP_FORCE_DEPLOY override");
  if (!["production", "preview"].includes(env.VERCEL_ENV)) return build("unknown deployment environment");
  if (!env.VERCEL_GIT_COMMIT_REF) return build("missing Git branch context");

  const previous = env.VERCEL_GIT_PREVIOUS_SHA;
  const current = env.VERCEL_GIT_COMMIT_SHA;
  const validSHA = (value) => typeof value === "string" && /^[a-f0-9]{40}$/i.test(value);
  if (!validSHA(previous) || !validSHA(current)) return build("first deployment or missing/invalid successful baseline");
  const readGit = git ?? ((args) => execFileSync("git", args, {
    cwd, encoding: "utf8", timeout: 10000, maxBuffer: 4 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  }));
  try {
    const head = readGit(["rev-parse", "HEAD"]).trim();
    if (head.toLowerCase() !== current.toLowerCase()) return build("checkout does not match deployment commit");
    // A last-success baseline catches runtime commits earlier in a multi-commit
    // push, or a failed build followed by a docs commit. Never use HEAD^ here.
    readGit(["cat-file", "-e", `${previous}^{commit}`]);
    const raw = readGit(["diff", "--name-only", "--no-renames", "-z", previous, current, "--"]);
    if (raw !== "" && !raw.endsWith("\0")) return build("incomplete changed-path evidence");
    const paths = raw.split("\0").filter(Boolean);
    if (paths.some((path) => !isNonWebPath(path))) return build("web input or unknown file changed since last success");
    return skip(paths.length ? "only documentation/release/CI/desktop files changed since last success" : "no files changed since last success");
  } catch {
    // Shallow history, Git errors or truncated output must not suppress a release.
    // No network fetch, credentials, install, deletion or mutable cache is needed.
    return build("baseline unavailable or Git inspection failed; build conservatively");
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const decision = decideBuild();
  console.log(`maze-deployment: ${decision.action} — ${decision.reason}`);
  process.exitCode = decision.exitCode;
}
