import { defineConfig } from '@playwright/test';
import { resolve } from 'node:path';
const out = process.env.MAZE_P1_BROWSER_DIR ?? 'C:/GameDev/maze-game-qa/plan09-p1/browser-final';
export default defineConfig({
  testDir: import.meta.dirname, testMatch: '*.pw.ts', workers: 1, retries: 0,
  timeout: 60000, reporter: [['line'], ['json', { outputFile: resolve(out, 'report.json') }]],
  outputDir: resolve(out, 'artifacts'),
  use: { baseURL: 'http://127.0.0.1:1422', headless: true, channel: 'msedge', screenshot: 'only-on-failure', trace: 'off' },
  webServer: { cwd: resolve(import.meta.dirname, '../../..'), command: 'npx vite --config docs/experiments/plan09-p1/vite.config.ts', url: 'http://127.0.0.1:1422', reuseExistingServer: false },
});
