import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Local experimental registry, never a production build input or app route.
export default defineConfig(({ command }) => {
  if (command !== 'serve') throw Error('P1 experiments cannot be built for deployment');
  return {
  root: resolve(import.meta.dirname, '../../..'),
  plugins: [{
    name: 'isolated-plan09-registry', enforce: 'pre',
    transform(code, id) {
      if (process.env.MAZE_P1_BASELINE === '1') return;
      if (!id.replaceAll('\\', '/').endsWith('/src/game/levels.ts')) return;
      const data = JSON.parse(readFileSync('C:/GameDev/maze-game-qa/plan09-p1/canaries.json', 'utf8'));
      const start = code.indexOf('export const CURATED_LEVELS:');
      const end = code.indexOf('/** Every friend intentionally placed', start);
      if (start < 0 || end < 0) throw Error('Registry seam moved; inspect source');
      return code.slice(0, start) + `export const CURATED_LEVELS: readonly LevelDefinition[] = ${JSON.stringify(data)};\n` + code.slice(end);
    },
  }, react()],
  server: { host: '127.0.0.1', port: 1422, strictPort: true },
  };
});
