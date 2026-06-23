import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const skoposRoot = fileURLToPath(new URL('../../../..', import.meta.url));

const PACKAGE_NAMES = [
  '@skopos/model',
  '@skopos/config',
  '@skopos/indexer',
  '@skopos/query',
  '@skopos/planner',
  '@skopos/instructions',
  '@skopos/trust',
  '@skopos/runtime',
  '@skopos/cli',
  '@skopos/mcp',
  '@skopos/docs-engine',
  '@skopos/ui',
] as const;

const CANDIDATE_PACKAGES = [
  '@skopos/model',
  '@skopos/config',
  '@skopos/indexer',
  '@skopos/query',
  '@skopos/planner',
  '@skopos/instructions',
  '@skopos/trust',
  '@skopos/runtime',
  '@skopos/cli',
  '@skopos/mcp',
] as const;

describe('skopos release surface contract', () => {
  it('declares machine-readable surface metadata for every package', async () => {
    for (const packageName of PACKAGE_NAMES) {
      const packageJson = await loadPackageJson(packageName);

      expect(packageJson.skopos, `${packageName} must declare skopos release metadata`).toEqual(
        expect.objectContaining({
          surface: expect.any(String),
          releaseTarget: expect.any(String),
          publishPhase: 'incubation',
        }),
      );
    }
  });

  it('keeps all packages private during incubation', async () => {
    for (const packageName of PACKAGE_NAMES) {
      const packageJson = await loadPackageJson(packageName);

      expect(packageJson.private, `${packageName} must stay private during incubation`).toBe(true);
      expect(packageJson.skopos?.publishPhase).toBe('incubation');
    }
  });

  it('marks only the intended sdk and tool packages as release candidates', async () => {
    const actualCandidatePackages: string[] = [];

    for (const packageName of PACKAGE_NAMES) {
      const packageJson = await loadPackageJson(packageName);

      if (packageJson.skopos?.releaseTarget === 'candidate') {
        actualCandidatePackages.push(packageName);
      }
    }

    expect(actualCandidatePackages.sort()).toEqual([...CANDIDATE_PACKAGES].sort());
  });

  it('keeps internal product packages out of the candidate release set', async () => {
    const docsEngine = await loadPackageJson('@skopos/docs-engine');
    const ui = await loadPackageJson('@skopos/ui');

    expect(docsEngine.skopos).toEqual(
      expect.objectContaining({
        surface: 'internal-product',
        releaseTarget: 'internal-only',
      }),
    );
    expect(ui.skopos).toEqual(
      expect.objectContaining({
        surface: 'internal-product',
        releaseTarget: 'internal-only',
      }),
    );
  });
});

interface PackageJsonShape {
  name: string;
  private?: boolean;
  skopos?: {
    surface?: string;
    releaseTarget?: string;
    publishPhase?: string;
  };
}

const loadPackageJson = async (packageName: string): Promise<PackageJsonShape> => {
  const packageDirName = packageName.replace('@skopos/', '');
  const packageJsonPath = `${skoposRoot}/packages/${packageDirName}/package.json`;
  const contents = await readFile(packageJsonPath, 'utf8');
  return JSON.parse(contents) as PackageJsonShape;
};
