// One-time, non-destructive migration preservation. No source/runtime mutation.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir, copyFile, stat } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';

const root = process.cwd();
const qa = 'C:/GameDev/maze-game-qa/migration-2026-09-06';
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const hash = buffer => createHash('sha256').update(buffer).digest('hex');
const maybe = async path => { try { return await readFile(path); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } };
async function preserve(source, destination) {
  const bytes = await readFile(source), previous = await maybe(destination);
  if (previous && hash(previous) !== hash(bytes)) throw new Error(`Refusing to overwrite different backup: ${destination}`);
  await mkdir(dirname(destination), { recursive: true });
  if (!previous) await copyFile(source, destination);
  return { path: relative(qa, destination).replaceAll('\\', '/'), bytes: bytes.length, sha256: hash(bytes) };
}
const trees = [
  'C:/GameDev/maze-game-tessera-field-hotfix',
  'C:/GameDev/maze-game-v22-tessera-integration',
  'C:/GameDev/maze-game-qa/worktrees/hole02-proof-qual',
  'C:/Users/hellb/AppData/Local/Temp/maze-plan03-baseline-0fce054',
  'C:/Users/hellb/AppData/Local/Temp/maze-plan03-before-0fce054',
  'C:/Users/hellb/AppData/Local/Temp/maze-plan03-r1-isolated-958a',
];
const preservedTrees = [];
for (const tree of trees) {
  const name = tree.split('/').at(-1), destination = resolve(qa, 'worktree-leftovers', name);
  await mkdir(destination, { recursive: true });
  const head = git(tree, 'rev-parse', 'HEAD').trim();
  const patch = execFileSync('git', ['diff', '--binary', 'HEAD', '--'], { cwd: tree, maxBuffer: 32 * 1024 * 1024 });
  const status = git(tree, 'status', '--short', '--untracked-files=all');
  await writeFile(resolve(destination, 'working-tree.patch'), patch);
  await writeFile(resolve(destination, 'status.txt'), status);
  const untracked = git(tree, 'ls-files', '--others', '--exclude-standard', '-z').split('\0').filter(Boolean);
  const ignored = git(tree, 'ls-files', '--others', '--ignored', '--exclude-standard', '-z', '--', 'artifacts', 'output', 'release').split('\0').filter(Boolean);
  const copies = [], sameAsLive = [];
  for (const path of [...new Set([...untracked, ...ignored])]) {
    if (/^(node_modules|src-tauri\/target|dist|\.git)\//.test(path)) continue;
    const source = resolve(tree, path), data = await readFile(source), live = await maybe(resolve(root, path));
    if (live && hash(data) === hash(live)) { sameAsLive.push({ path, sha256: hash(data), bytes: data.length }); continue; }
    copies.push(await preserve(source, resolve(destination, 'files', path)));
  }
  preservedTrees.push({ originalPath: tree, head, patchBytes: patch.length, patchSha256: hash(patch), copies, sameAsLive });
}

const review = resolve(root, 'output/playwright/wall04ar1');
for (const file of await readdir(review)) await preserve(resolve(review, file), resolve(qa, 'wall04ar1', file));
const lanes = [];
for (const lane of ['desktop-1', 'desktop-2', 'compact-1', 'compact-2']) {
  const text = await readFile(resolve(review, lane + '-result.txt'), 'utf8');
  const record = JSON.parse(text.split(/\r?\n/).find(l => l.startsWith('{"status"')));
  if (record.status !== 'pass' || record.cases !== 18) throw new Error('Incomplete browser lane ' + lane);
  lanes.push(record);
}
const parseReview = async name => JSON.parse((await readFile(resolve(review, name), 'utf8')).split(/\r?\n/).find(l => l.startsWith('{')));
const evidence = {
  schema: 'maze-wall04ar1-paused-evidence/v1',
  disposition: 'DEVELOPMENT PAUSED FOR LAPTOP MIGRATION; not a deployment/performance release pass',
  candidateVersion: '0.22.11', candidateBundle: '/assets/index-fV--7I7N.js',
  baselineBundle: '/assets/index-T8J736ZB.js',
  cases: lanes.reduce((n, l) => n + l.cases, 0), lanes,
  paintComparison: await parseReview('paint-comparison-result.txt'),
  castIsolation: await parseReview('cast-isolation-result.txt'),
  caveats: ['Loaded-host timing is not iPad qualification.', 'First baseline/candidate Full test showed slower candidate p95 in two of three repeats.', 'Later cast-on/off comparison did not reproduce a cast-specific difference; this does not clear the earlier signal.', 'Zero CompositeLayers events means unavailable evidence, not zero GPU cost.'],
};
await mkdir(resolve(root, 'docs/migrations'), { recursive: true });
await writeFile(resolve(root, 'docs/migrations/wall04ar1-paused-evidence.json'), JSON.stringify(evidence, null, 2) + '\n');
await writeFile(resolve(qa, 'worktree-preservation.json'), JSON.stringify(preservedTrees, null, 2) + '\n');
const summary = preservedTrees.map(t => ({ path: t.originalPath, head: t.head, patchBytes: t.patchBytes, filesPreserved: t.copies.length, preservedBytes: t.copies.reduce((n, f) => n + f.bytes, 0), exactLiveDuplicates: t.sameAsLive.length }));
console.log(JSON.stringify({ qaBackup: qa, worktrees: summary, browserCases: evidence.cases, noDeletes: true }, null, 2));
