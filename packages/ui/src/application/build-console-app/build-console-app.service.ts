import { existsSync } from 'node:fs';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildSkoposUiConsoleState } from '../build-console-state/build-console-state.service.js';
import type { SkoposUiConsoleBuildResult } from '../../contracts/skopos-ui-console-app.js';

export interface BuildSkoposUiConsoleAppOptions {
  cwd: string;
  outputDirectory?: string;
  dryRun?: boolean;
}

const packageRoot = resolveUiPackageRoot(import.meta.url);
const viteConfigPath = join(packageRoot, 'vite.config.ts');

export const buildSkoposUiConsoleApp = async ({
  cwd,
  outputDirectory,
  dryRun = false,
}: BuildSkoposUiConsoleAppOptions): Promise<SkoposUiConsoleBuildResult> => {
  const workspaceRoot = resolve(cwd);
  const resolvedOutputDirectory = resolve(
    workspaceRoot,
    outputDirectory ?? 'docs/generated/skopos/app',
  );
  const state = await buildSkoposUiConsoleState({
    cwd: workspaceRoot,
    outputDirectory: resolvedOutputDirectory,
  });
  const entryHtmlPath = join(resolvedOutputDirectory, 'index.html');
  const statePath = join(resolvedOutputDirectory, 'ui-state.json');
  const searchIndexPath = join(resolvedOutputDirectory, 'search-index.json');

  if (!dryRun) {
    const { build: buildVite } = await import('vite');
    await buildVite({
      configFile: viteConfigPath,
      build: {
        outDir: resolvedOutputDirectory,
        emptyOutDir: true,
      },
      logLevel: 'silent',
    });

    const html = await readFile(entryHtmlPath, 'utf8');
    if (!html.includes('__SKOPOS_UI_STATE__')) {
      throw new Error('Built Skopos UI app is missing the state placeholder.');
    }
    await writeFile(
      entryHtmlPath,
      html.replace('__SKOPOS_UI_STATE__', serializeInlineJson(state)),
      'utf8',
    );
    await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
    await writeFile(searchIndexPath, `${JSON.stringify(state.searchIndex ?? { entries: [] }, null, 2)}\n`, 'utf8');
  }

  return {
    workspaceRoot,
    outputDirectory: resolvedOutputDirectory,
    entryHtmlPath,
    statePath,
    searchIndexPath,
    assetPaths: dryRun ? [] : await listBuiltFiles(resolvedOutputDirectory),
    writeStatus: dryRun ? 'dry-run' : 'written',
    generatedAt: state.generatedAt,
    trustLevel: state.trustReport.trustLevel,
    readiness: state.trustReport.readiness,
    state,
  };
};

const listBuiltFiles = async (directoryPath: string): Promise<string[]> => {
  const results: string[] = [];
  const entries = await readdir(directoryPath, { withFileTypes: true });

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const entryPath = join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await listBuiltFiles(entryPath)));
      continue;
    }
    if (entry.isFile()) {
      results.push(entryPath);
    }
  }

  return results;
};

function resolveUiPackageRoot(moduleUrl: string): string {
  let currentPath = resolve(fileURLToPath(new URL('.', moduleUrl)));

  for (let depth = 0; depth < 6; depth += 1) {
    if (existsSync(join(currentPath, 'vite.config.ts')) && existsSync(join(currentPath, 'package.json'))) {
      return currentPath;
    }
    currentPath = resolve(currentPath, '..');
  }

  throw new Error('Could not resolve the @skopos/ui package root for the Vite app.');
}

const serializeInlineJson = (value: unknown): string =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
