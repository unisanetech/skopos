import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const packageRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const workspacePackagesRoot = resolve(packageRoot, '..');
const skoposPackageAliases = [
  'cli',
  'config',
  'docs-engine',
  'indexer',
  'instructions',
  'mcp',
  'model',
  'planner',
  'query',
  'runtime',
  'ui',
].map((packageName) => ({
  find: `@skopos/${packageName}`,
  replacement: resolve(workspacePackagesRoot, packageName, 'src', 'index.ts'),
}));

export default defineConfig({
  root: packageRoot,
  base: '/',
  publicDir: false,
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(packageRoot, 'src') },
      ...skoposPackageAliases,
    ],
  },
  test: {
    root: packageRoot,
    environment: 'node',
  },
  server: {
    fs: {
      allow: [packageRoot],
    },
  },
  build: {
    outDir: resolve(packageRoot, 'dist-app'),
    emptyOutDir: true,
  },
});
