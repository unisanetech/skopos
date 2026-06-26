import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const skoposRoot = fileURLToPath(new URL('../../../..', import.meta.url));

const PUBLIC_SDK_CORE_PACKAGES = [
  '@skopos/model',
  '@skopos/config',
  '@skopos/indexer',
  '@skopos/query',
  '@skopos/planner',
  '@skopos/instructions',
  '@skopos/trust',
  '@skopos/runtime',
] as const;

const INTERNAL_PRODUCT_PACKAGES = ['@skopos/docs-engine', '@skopos/ui'] as const;


const TOOL_SURFACE_PACKAGES = ['@skopos/cli', '@skopos/mcp'] as const;

describe('skopos package boundary contract', () => {
  it('keeps public sdk core packages free from internal product dependencies', async () => {
    const forbiddenDependencies = new Set(INTERNAL_PRODUCT_PACKAGES);

    for (const packageName of PUBLIC_SDK_CORE_PACKAGES) {
      const packageJson = await loadPackageJson(packageName);
      const dependencyNames = Object.keys(packageJson.dependencies ?? {});

      expect(
        dependencyNames.filter((dependencyName) => forbiddenDependencies.has(dependencyName)),
        `${packageName} should not depend on internal product surfaces`,
      ).toEqual([]);
    }
  });

  it('keeps internal product surfaces out of the public sdk core set', async () => {
    for (const packageName of INTERNAL_PRODUCT_PACKAGES) {
      const packageJson = await loadPackageJson(packageName);

      expect(
        PUBLIC_SDK_CORE_PACKAGES.includes(packageJson.name as (typeof PUBLIC_SDK_CORE_PACKAGES)[number]),
        `${packageName} must not be classified as public sdk core`,
      ).toBe(false);
    }
  });

  it('keeps the publishable CLI manifest free from Skopos workspace runtime dependencies', async () => {
    const cliPackage = await loadPackageJson('@skopos/cli');
    const mcpPackage = await loadPackageJson('@skopos/mcp');

    expect(
      Object.keys(cliPackage.dependencies ?? {}).filter((dependencyName) =>
        dependencyName.startsWith('@skopos/'),
      ),
      'the CLI tarball should install as one bundled product instead of resolving private workspace packages',
    ).toEqual([]);
    expect(Object.keys(mcpPackage.dependencies ?? {})).toEqual(
      expect.arrayContaining(['@skopos/runtime']),
    );
    expect(Object.keys(mcpPackage.dependencies ?? {})).not.toEqual(
      expect.arrayContaining(['@skopos/ui', '@skopos/docs-engine']),
    );
  });

  it('keeps the CLI entrypoint and top-level router thin', async () => {
    const cliEntrypoint = await readWorkspaceFile('packages/cli/src/cli.ts');
    const cliRouter = await readWorkspaceFile('packages/cli/src/cli/index.ts');
    const cliRegistry = await readWorkspaceFile('packages/cli/src/cli/registry.ts');

    expect(countLines(cliEntrypoint), 'cli.ts should only bootstrap the CLI process').toBeLessThanOrEqual(40);
    expect(countLines(cliRouter), 'cli/index.ts should only route command names to registry handlers').toBeLessThanOrEqual(80);
    expect(countLines(cliRegistry), 'cli/registry.ts should only map command names to command-owned handlers').toBeLessThanOrEqual(120);

    expect(cliEntrypoint).toContain("from './cli/index.js'");
    expect(cliEntrypoint).not.toContain('./cli/commands/');
    expect(cliRouter).not.toContain('./commands/');
    expect(cliRouter).not.toContain('switch');
    expect(cliRegistry).not.toContain('process.argv');
  });
});

interface PackageJsonShape {
  name: string;
  dependencies?: Record<string, string>;
}

const loadPackageJson = async (packageName: string): Promise<PackageJsonShape> => {
  const packageDirName = packageName.replace('@skopos/', '');
  const packageJsonPath = `${skoposRoot}/packages/${packageDirName}/package.json`;
  const contents = await readFile(packageJsonPath, 'utf8');
  return JSON.parse(contents) as PackageJsonShape;
};

const readWorkspaceFile = (path: string): Promise<string> => readFile(`${skoposRoot}/${path}`, 'utf8');

const countLines = (value: string): number => value.split('\n').length;
