import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

import { loadSkoposConfig } from '@skopos/config';
import { buildSkoposBootstrapArtifacts, loadSkoposOverrideArtifact } from '@skopos/indexer';
import type {
  SkoposBootstrapArtifact,
  SkoposOverrideArtifact,
  SkoposRootConfig,
  SkoposScopesLiteArtifact,
  SkoposSourceDependency,
} from '@skopos/model';

interface LoadSkoposQueryStateOptions {
  cwd: string;
}

export interface SkoposQueryState {
  config: SkoposRootConfig | null;
  bootstrap: SkoposBootstrapArtifact;
  scopesLite: SkoposScopesLiteArtifact;
  paths: {
    configPath: string;
    bootstrapPath: string;
    scopesLitePath: string;
  };
}

export const loadSkoposQueryState = async ({
  cwd,
}: LoadSkoposQueryStateOptions): Promise<SkoposQueryState> => {
  const configPath = join(cwd, 'skopos.config.yaml');
  const bootstrapPath = join(cwd, '.skopos', 'bootstrap.json');
  const scopesLitePath = join(cwd, '.skopos', 'scopes-lite.json');
  const overrides = await loadSkoposOverrideArtifact({ cwd });
  const config = await loadSkoposConfig(configPath);
  const bootstrap = await loadJsonFile<SkoposBootstrapArtifact>(bootstrapPath);
  const scopesLite = await loadJsonFile<SkoposScopesLiteArtifact>(scopesLitePath);

  if (
    bootstrap &&
    scopesLite &&
    !(await shouldRefreshCompiledState({
      cwd,
      bootstrap,
      overrides,
      configPath,
    }))
  ) {
    return {
      config,
      bootstrap,
      scopesLite,
      paths: { configPath, bootstrapPath, scopesLitePath },
    };
  }

  const generated = await buildSkoposBootstrapArtifacts({
    cwd,
    mode: 'existing',
    existingConfig: config,
  });

  return {
    config,
    bootstrap: generated.bootstrap,
    scopesLite: generated.scopesLite,
    paths: { configPath, bootstrapPath, scopesLitePath },
  };
};

const loadJsonFile = async <TValue>(filePath: string): Promise<TValue | null> => {
  try {
    const contents = await readFile(filePath, 'utf8');
    return JSON.parse(contents) as TValue;
  } catch (error) {
    if (isMissingFileError(error)) {
      return null;
    }

    throw error;
  }
};

const isMissingFileError = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' &&
  error !== null &&
  'code' in error &&
  (error.code === 'ENOENT' || error.code === 'ENOTDIR');

interface ShouldRefreshCompiledStateOptions {
  cwd: string;
  bootstrap: SkoposBootstrapArtifact;
  overrides: SkoposOverrideArtifact | null;
  configPath: string;
}

const shouldRefreshCompiledState = async ({
  cwd,
  bootstrap,
  overrides,
  configPath,
}: ShouldRefreshCompiledStateOptions): Promise<boolean> => {
  const bootstrapUpdatedAt = Date.parse(bootstrap.updatedAt ?? '');

  if (await isFileNewerThanBootstrap(configPath, bootstrapUpdatedAt)) {
    return true;
  }

  if (await hasStaleSourceDependency(cwd, bootstrap.sourceDependencies ?? [], bootstrapUpdatedAt)) {
    return true;
  }

  if (!overrides?.updatedAt) {
    return false;
  }

  const overridesUpdatedAt = Date.parse(overrides.updatedAt);

  if (!Number.isFinite(overridesUpdatedAt)) {
    return false;
  }

  if (!Number.isFinite(bootstrapUpdatedAt)) {
    return true;
  }

  return bootstrapUpdatedAt < overridesUpdatedAt;
};

const hasStaleSourceDependency = async (
  cwd: string,
  sourceDependencies: SkoposSourceDependency[],
  bootstrapUpdatedAt: number,
): Promise<boolean> => {
  for (const dependency of sourceDependencies) {
    const currentState = await statPath(join(cwd, dependency.path));

    if (dependency.existsAtBuild && !currentState.exists) {
      return true;
    }

    if (!dependency.existsAtBuild && currentState.exists) {
      return true;
    }

    if (currentState.exists && currentState.mtimeMs > bootstrapUpdatedAt) {
      return true;
    }
  }

  return false;
};

const isFileNewerThanBootstrap = async (
  filePath: string,
  bootstrapUpdatedAt: number,
): Promise<boolean> => {
  if (!Number.isFinite(bootstrapUpdatedAt)) {
    return true;
  }

  const currentState = await statPath(filePath);
  return currentState.exists && currentState.mtimeMs > bootstrapUpdatedAt;
};

const statPath = async (filePath: string): Promise<{ exists: boolean; mtimeMs: number }> => {
  try {
    const fileStat = await stat(filePath);
    return {
      exists: true,
      mtimeMs: fileStat.mtimeMs,
    };
  } catch {
    return {
      exists: false,
      mtimeMs: 0,
    };
  }
};
