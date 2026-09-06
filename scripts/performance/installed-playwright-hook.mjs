// Optional Node24 adapter for an already installed Playwright test runtime.
// No dependency installation, repo copy, shim package or lockfile mutation.
// NODE_OPTIONS="--import=<this file URL>" MAZE_PLAYWRIGHT_PATH=<index.mjs>
import { registerHooks } from 'node:module';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
if (process.env.MAZE_PLAYWRIGHT_PATH) {
  const root = dirname(resolve(process.env.MAZE_PLAYWRIGHT_PATH));
  registerHooks({ resolve(specifier, context, next) {
    if (specifier === '@playwright/test') return { url: pathToFileURL(resolve(root,
      context.conditions.includes('require') ? 'test.js' : 'test.mjs')).href, shortCircuit: true };
    return next(specifier, context);
  } });
}
