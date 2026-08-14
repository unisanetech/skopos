import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { normalizePortablePath } from '../../scripts/portable-path.mjs';

const skoposRoot = fileURLToPath(new URL('../../../..', import.meta.url));

const PACKAGE_NAMES = [
  '@skopos/model',
  '@skopos/config',
  '@skopos/indexer',
  '@skopos/query',
  '@skopos/planner',
  '@skopos/docs-engine',
  '@skopos/instructions',
  '@skopos/verification',
  '@skopos/runtime',
  '@unisane/skopos',
  '@skopos/mcp',
  '@skopos/ui',
] as const;

const CANDIDATE_PACKAGES = [
  '@skopos/model',
  '@skopos/config',
  '@skopos/indexer',
  '@skopos/query',
  '@skopos/planner',
  '@skopos/docs-engine',
  '@skopos/instructions',
  '@skopos/verification',
  '@skopos/runtime',
  '@unisane/skopos',
  '@skopos/mcp',
] as const;

const PUBLIC_BUNDLED_CLI_PACKAGE = '@unisane/skopos';
const CURRENT_PUBLIC_CLI_VERSION = '0.1.1';
const PRIVATE_PACKAGE_VERSION = '0.1.0';

describe('skopos release surface contract', () => {
  it('uses one portable asset identity on Windows and POSIX hosts', () => {
    expect(
      normalizePortablePath(
        String.raw`ui\product-interface-design\design-context\library.json`,
      ),
    ).toBe('ui/product-interface-design/design-context/library.json');
    expect(
      normalizePortablePath('ui/product-interface-design/design-context/library.json'),
    ).toBe('ui/product-interface-design/design-context/library.json');
  });

  it('declares machine-readable surface metadata for every package', async () => {
    for (const packageName of PACKAGE_NAMES) {
      const packageJson = await loadPackageJson(packageName);

      expect(packageJson.name).toBe(packageName);
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
        expect(packageJson.scripts).toBeUndefined();
        continue;
      }

      expect(packageJson.private, `${packageName} must stay private until separately released`).toBe(true);
      expect(packageJson.skopos?.publishPhase).toBe('incubation');
    }
  });

  it('aligns the workspace release identity with the public CLI while internal packages remain private', async () => {
    const rootPackageJson = await loadRootPackageJson();

    expect(rootPackageJson.version).toBe(CURRENT_PUBLIC_CLI_VERSION);

    for (const packageName of PACKAGE_NAMES) {
      const packageJson = await loadPackageJson(packageName);

      expect(packageJson.version, `${packageName} must match its intended release boundary`).toBe(
        packageName === PUBLIC_BUNDLED_CLI_PACKAGE
          ? CURRENT_PUBLIC_CLI_VERSION
          : PRIVATE_PACKAGE_VERSION,
      );
    }
  });

  it('publishes the current public CLI patch as next instead of latest', async () => {
    const cliPackage = await loadPackageJson(PUBLIC_BUNDLED_CLI_PACKAGE);

    expect(cliPackage.version).toBe(CURRENT_PUBLIC_CLI_VERSION);
    expect(cliPackage.version.startsWith('0.')).toBe(true);
    expect(cliPackage.publishConfig).toEqual(
      expect.objectContaining({
        access: 'public',
        tag: 'next',
      }),
    );
  });

  it('declares complete public discovery, ownership, support, and runtime metadata', async () => {
    const cliPackage = await loadPackageJson(PUBLIC_BUNDLED_CLI_PACKAGE);

    expect(cliPackage.description).toContain('Project memory');
    expect(cliPackage.repository).toEqual({
      type: 'git',
      url: 'git+https://github.com/unisanetech/skopos.git',
      directory: 'packages/cli',
    });
    expect(cliPackage.homepage).toBe('https://github.com/unisanetech/skopos#readme');
    expect(cliPackage.bugs).toEqual({ url: 'https://github.com/unisanetech/skopos/issues' });
    expect(cliPackage.author).toEqual(expect.objectContaining({ name: 'Croodo' }));
    expect(cliPackage.maintainers).toEqual([
      expect.objectContaining({ name: 'Croodo' }),
    ]);
    expect(cliPackage.keywords).toEqual(
      expect.arrayContaining(['coding-agents', 'project-memory', 'developer-tools']),
    );
    expect(cliPackage.engines).toEqual({ node: '^22.13.0 || ^24.0.0' });
    expect(cliPackage.bin).toEqual({ skopos: 'dist/cli.js' });
    expect(cliPackage.exports).toEqual(
      expect.objectContaining({
        '.': expect.objectContaining({
          types: './dist/index.d.ts',
          import: './dist/index.js',
        }),
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

  it('keeps only the UI internal while docs governance remains an SDK capability', async () => {
    const docsEngine = await loadPackageJson('@skopos/docs-engine');
    const ui = await loadPackageJson('@skopos/ui');

    expect(docsEngine.skopos).toEqual(
      expect.objectContaining({
        surface: 'public-sdk-core',
        releaseTarget: 'candidate',
      }),
    );
    expect(ui.skopos).toEqual(
      expect.objectContaining({
        surface: 'internal-product',
        releaseTarget: 'internal-only',
      }),
    );
  });

  it('declares the runtime and Node types used by root self-hosting commands', async () => {
    const rootPackageJson = await loadRootPackageJson();
    const sourceBackedScripts = Object.entries(rootPackageJson.scripts ?? {})
      .filter(([, command]) => command.includes('--import tsx'))
      .map(([name]) => name);

    expect(sourceBackedScripts).not.toEqual([]);
    expect(rootPackageJson.devDependencies?.['@types/node']).toBe('^22.12.0');
    expect(rootPackageJson.devDependencies?.tsx).toBe('^4.20.3');
  });
});

interface PackageJsonShape {
  name: string;
  version: string;
  description?: string;
  license?: string;
  author?: PersonShape;
  maintainers?: PersonShape[];
  repository?: {
    type?: string;
    url?: string;
    directory?: string;
  };
  homepage?: string;
  bugs?: { url?: string };
  keywords?: string[];
  engines?: { node?: string };
  bin?: Record<string, string>;
  exports?: Record<string, { types?: string; import?: string }>;
  private?: boolean;
  scripts?: Record<string, string>;
  devDependencies?: Record<string, string>;
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

interface PersonShape {
  name?: string;
  email?: string;
  url?: string;
}

const loadPackageJson = async (packageName: string): Promise<PackageJsonShape> => {
  const packageDirName = packageName === PUBLIC_BUNDLED_CLI_PACKAGE
    ? 'cli'
    : packageName.replace('@skopos/', '');
  const packageJsonPath = `${skoposRoot}/packages/${packageDirName}/package.json`;
  const contents = await readFile(packageJsonPath, 'utf8');
  return JSON.parse(contents) as PackageJsonShape;
};

const loadRootPackageJson = async (): Promise<PackageJsonShape> => {
  const contents = await readFile(`${skoposRoot}/package.json`, 'utf8');
  return JSON.parse(contents) as PackageJsonShape;
};
