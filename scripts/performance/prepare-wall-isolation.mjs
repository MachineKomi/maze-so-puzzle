/** Controlled attribution packet: current compiled candidate with ONLY the
 * default wallMode changed to its retained 04a-v1 branch. Not a release build. */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
const root = resolve(import.meta.dirname, "../..");
const output = resolve(process.env.MAZE_WALL_ISOLATION_DIR);
if (output === root || output.startsWith(root + "\\") || output.startsWith(root + "/")) throw Error("Isolation packet must stay outside repo");
const originalIndex = await readFile(resolve(root, "dist/index.html"), "utf8");
const js = originalIndex.match(/src="(\/assets\/[^"]+\.js)"/)[1];
const css = originalIndex.match(/href="(\/assets\/[^"]+\.css)"/)[1];
const original = await readFile(resolve(root, "dist" + js), "utf8");
const needle = '.get(`wallLighting`)===`legacy`?`legacy`:`tall`';
if (original.split(needle).length !== 2) throw Error("Expected exactly one observed wall default expression; inspect new output before changing this diagnostic");
const changed = original.replace(needle, '.get(`wallLighting`)===`legacy`?`legacy`:`depth`');
const entry = "assets/index-wall-depth-diagnostic.js";
const files = [["index.html", originalIndex.replace(js, "/" + entry)], [entry, changed], [css.slice(1), await readFile(resolve(root, "dist" + css))]];
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
const rows = [];
for (const [file, bytes] of files) {
  const data = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes);
  await mkdir(dirname(resolve(output, file)), { recursive: true }); await writeFile(resolve(output, file), data);
  rows.push({ file, bytes: data.length, sha256: sha(data) });
}
await writeFile(resolve(output, "identity.json"), JSON.stringify({
  source: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
  kind: "instrumented-wall-only-attribution-not-release", originalJs: { file: js, sha256: sha(original) },
  mutation: { count: 1, from: needle, to: '.get(`wallLighting`)===`legacy`?`legacy`:`depth`' },
  scope: "Same candidate jump clock, dressing, scene and media; only wallMode default changes to retained 04a-v1 depth. This is not a published baseline or release acceptance.", rows,
}, null, 2));
console.log(JSON.stringify({ output, rows }));
