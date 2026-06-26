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

const PUBLIC_BUNDLED_CLI_PACKAGE = '@skopos/cli';
const FIRST_PUBLIC_CLI_VERSION = '0.1.0';

describe('skopos release surface contract', () => {
  it('declares machine-readable surface metadata for every package', async () => {
    for (const packageName of PACKAGE_NAMES) {
      const packageJson = await loadPackageJson(packageName);

      expect(packageJson.skopos, `${packageName} must declare skopos release metadata`).toEqual(
        expect.objectContaining({
          surface: expect.any(String),
          releaseTarget: expect.any(String),
          publishPhase: expect.any(String),
        }),
      );
    }
  });

  it('keeps only the bundled CLI package public while internal packages remain private', async () => {
    for (const packageName of PACKAGE_NAMES) {
      const packageJson = await loadPackageJson(packageName);

      if (packageName === PUBLIC_BUNDLED_CLI_PACKAGE) {
        expect(packageJson.private, `${packageName} must be publishable for npx/npm exec`).not.toBe(true);
        expect(packageJson.skopos?.publishPhase).toBe('bundled-cli-candidate');
        expect(packageJson.publishConfig).toEqual(
          expect.objectContaining({
            access: 'public',
            tag: 'next',
          }),
        );
        expect(packageJson.license).toBe('Apache-2.0');
        expect(packageJson.files).toEqual(expect.arrayContaining(['dist', 'README.md', 'LICENSE']));
        continue;
      }

      expect(packageJson.private, `${packageName} must stay private until separately released`).toBe(true);
      expect(packageJson.skopos?.publishPhase).toBe('incubation');
    }
  });

  it('uses synchronized 0.1.x package versions for the first bundled CLI candidate', async () => {
    const rootPackageJson = await loadRootPackageJson();

    expect(rootPackageJson.version).toBe(FIRST_PUBLIC_CLI_VERSION);

    for (const packageName of PACKAGE_NAMES) {
      const packageJson = await loadPackageJson(packageName);

      expect(packageJson.version, `${packageName} should stay version-aligned for the first release`).toBe(
        FIRST_PUBLIC_CLI_VERSION,
      );
    }
  });

  it('publishes the first public CLI as next instead of latest', async () => {
    const cliPackage = await loadPackageJson(PUBLIC_BUNDLED_CLI_PACKAGE);

    expect(cliPackage.version).toBe(FIRST_PUBLIC_CLI_VERSION);
    expect(cliPackage.version.startsWith('0.')).toBe(true);
    expect(cliPackage.publishConfig).toEqual(
      expect.objectContaining({
        access: 'public',
        tag: 'next',
      }),
    );
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
  version: string;
  license?: string;
  private?: boolean;
  files?: string[];
  publishConfig?: {
    access?: string;
    tag?: string;
  };
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

const loadRootPackageJson = async (): Promise<PackageJsonShape> => {
  const contents = await readFile(`${skoposRoot}/package.json`, 'utf8');
  return JSON.parse(contents) as PackageJsonShape;
};
