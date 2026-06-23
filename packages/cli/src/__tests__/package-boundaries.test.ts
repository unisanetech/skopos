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

  it('allows tool surfaces to depend on internal product surfaces without making them core sdk dependencies', async () => {
    const cliPackage = await loadPackageJson('@skopos/cli');
    const mcpPackage = await loadPackageJson('@skopos/mcp');

    expect(Object.keys(cliPackage.dependencies ?? {})).toEqual(
      expect.arrayContaining(['@skopos/runtime', '@skopos/ui']),
    );
    expect(Object.keys(mcpPackage.dependencies ?? {})).toEqual(
      expect.arrayContaining(['@skopos/runtime']),
    );
    expect(Object.keys(mcpPackage.dependencies ?? {})).not.toEqual(
      expect.arrayContaining(['@skopos/ui', '@skopos/docs-engine']),
    );
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
