/** Optional diagnostic production build. Counters are injected, never shipped. */
import { build } from "vite";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { frozenSourcePlugin } from "./v22-fixtures.mjs";

export async function buildInstrumented(root, destination, frozenSource) {
  // The fixture SSR server is a development server even without listening.
  // Explicitly restore production before Vite resolves React/DEV branches.
  process.env.NODE_ENV = "production";
  const injections = [];
  const hit = name => `(globalThis as any).__v22Record?.(${JSON.stringify(name)});`;
  const plugin = { name: "v22-production-counter-injection", enforce: "pre",
    transform(source, id) {
      const file = id.replaceAll("\\", "/").split("?")[0];
      let next = source;
      if (file.endsWith("/src/App.tsx")) {
        if (!source.includes("function App() {")) throw new Error("App injection anchor changed.");
        next = `import { useLayoutEffect as __v22CommitEffect } from "react";\n` + source.replace(
          "function App() {", `function App() { ${hit("appRender")} __v22CommitEffect(() => { ${hit("appCommit")} });`);
      } else if (file.endsWith("/src/ui/game/MiniMap.tsx")) {
        if (!source.includes("}: MiniMapProps) {")) throw new Error("MiniMap injection anchor changed.");
        next = `import { useLayoutEffect as __v22CommitEffect } from "react";\n` + source.replace(
          "}: MiniMapProps) {", `}: MiniMapProps) { ${hit("minimapRender")} __v22CommitEffect(() => { ${hit("minimapCommit")} });`);
        const pointAnchor = /const point\s*=\s*\{\s*x,\s*y\s*\};/;
        if (pointAnchor.test(next)) next = next.replace(pointAnchor, match => `${hit("minimapCellDerivation")}${match}`);
        else injections.push({ file, note: "Minimap cell construction moved; render/commit counters remain available." });
      } else if (file.endsWith("/src/session.ts")) {
        if (!source.includes("export function writeActiveRun(")) throw new Error("Persistence injection anchor changed.");
        next = source.replace("export function writeActiveRun(", "function __v22WriteActiveRun(") + `\n
export function writeActiveRun(...args: Parameters<typeof __v22WriteActiveRun>): boolean {
  const started = performance.now();
  try { return __v22WriteActiveRun(...args); }
  finally { (globalThis as any).__v22Record?.("activeRunTotalMs",performance.now()-started); }
}\n`;
      }
      if (next !== source) {
        injections.push({ file, before: createHash("sha256").update(source).digest("hex"),
          after: createHash("sha256").update(next).digest("hex") });
        return { code: next, map: null };
      }
      return null;
    },
  };
  await mkdir(destination, { recursive: true });
  await build({ root, mode: "production", configFile: resolve(root, "vite.config.ts"),
    plugins: [frozenSourcePlugin(root, frozenSource), plugin],
    build: { outDir: resolve(destination, "dist"), emptyOutDir: false } });
  for (const suffix of ["/src/App.tsx", "/src/ui/game/MiniMap.tsx", "/src/session.ts"]) {
    if (!injections.some(row => row.file.endsWith(suffix) && row.after)) throw new Error(`Missing injection ${suffix}`);
  }
  await writeFile(resolve(destination, "injection-manifest.json"), JSON.stringify({
    classification: "Diagnostic production build; counter overhead; never the shipping artifact or timing authority.",
    scriptSha256: createHash("sha256").update(await readFile(new URL(import.meta.url))).digest("hex"), injections,
  }, null, 2));
}
