import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { loadSkoposConfig } from '@skopos/config';
import {
  buildSkoposBootstrapArtifacts,
  buildSkoposDocumentCatalog,
  buildSkoposSourceDependencyDigest,
} from '@skopos/indexer';
import type {
  SkoposBootstrapArtifact,
  SkoposContentIndexArtifact,
  SkoposDocumentKnowledgeEntry,
  SkoposRootConfig,
  SkoposScopesLiteArtifact,
  SkoposSourceDependency,
} from '@skopos/model';

export { buildSkoposSourceDependencyDigest };

interface LoadSkoposQueryStateOptions {
  cwd: string;
}

export interface SkoposQueryState {
  config: SkoposRootConfig | null;
  bootstrap: SkoposBootstrapArtifact;
  scopesLite: SkoposScopesLiteArtifact;
  knowledgeIndex: SkoposContentIndexArtifact | null;
  documents: SkoposDocumentKnowledgeEntry[];
  paths: {
    configPath: string;
    bootstrapPath: string;
    scopesLitePath: string;
    knowledgeIndexPath: string;
  };
}

export const loadSkoposQueryState = async ({
  cwd,
}: LoadSkoposQueryStateOptions): Promise<SkoposQueryState> => {
  const configPath = join(cwd, 'skopos.config.yaml');
  const bootstrapPath = join(cwd, '.skopos', 'index', 'bootstrap.json');
  const scopesLitePath = join(cwd, '.skopos', 'index', 'scopes.json');
  const knowledgeIndexPath = join(cwd, '.skopos', 'index', 'memory.json');
  const config = await loadSkoposConfig(configPath);
  const bootstrap = await loadJsonFile<SkoposBootstrapArtifact>(bootstrapPath);
  const scopesLite = await loadJsonFile<SkoposScopesLiteArtifact>(scopesLitePath);
  const knowledgeIndex =
    await loadJsonFile<SkoposContentIndexArtifact>(knowledgeIndexPath);

  if (
    bootstrap &&
    scopesLite &&
    !(await shouldRefreshCompiledState({
      cwd,
      bootstrap,
    }))
  ) {
    return {
      config,
      bootstrap,
      scopesLite,
      knowledgeIndex,
      documents:
        knowledgeIndex?.documents ??
        (await buildSkoposDocumentCatalog({ cwd, config })).documents,
      paths: { configPath, bootstrapPath, scopesLitePath, knowledgeIndexPath },
    };
  }

  const [generated, documentCatalog] = await Promise.all([
    buildSkoposBootstrapArtifacts({
      cwd,
      mode: 'existing',
      existingConfig: config,
    }),
    buildSkoposDocumentCatalog({ cwd, config }),
  ]);

  return {
    config,
    bootstrap: generated.bootstrap,
    scopesLite: generated.scopesLite,
    knowledgeIndex: null,
    documents: documentCatalog.documents,
    paths: { configPath, bootstrapPath, scopesLitePath, knowledgeIndexPath },
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
}

const shouldRefreshCompiledState = async ({
  cwd,
  bootstrap,
}: ShouldRefreshCompiledStateOptions): Promise<boolean> =>
  hasStaleSourceDependency(cwd, bootstrap.sourceDependencies ?? []);

export const hasStaleSourceDependency = async (
  cwd: string,
  sourceDependencies: SkoposSourceDependency[],
): Promise<boolean> => {
  if (sourceDependencies.length === 0) {
    return true;
  }

  for (const dependency of sourceDependencies) {
    const currentDigest = await buildSkoposSourceDependencyDigest(
      cwd,
      dependency.path,
      dependency.kind,
    );
    if (currentDigest !== dependency.digest) {
      return true;
    }
  }

  return false;
};
