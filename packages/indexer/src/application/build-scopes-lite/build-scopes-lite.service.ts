import { basename, dirname, relative } from 'node:path';

import type {
  SkoposScopeLite,
  SkoposScopesLiteArtifact,
  SkoposScanSummary,
} from '@skopos/model';

import { findFilesNamed, readJsonFile } from '../../adapters/workspace-filesystem.adapter.js';
import { loadSkoposScopeRegistry } from '../load-scope-registry/load-scope-registry.service.js';
import { isPackageScopePath } from '../shared/package-scope-path.policy.js';
import { isWithinSubtree, normalizeSubtreeTarget } from '../shared/subtree-target.policy.js';

export interface BuildSkoposScopesLiteOptions {
  cwd: string;
  scanSummary: SkoposScanSummary;
  subtreeTarget?: string;
}

export const buildSkoposScopesLite = async ({
  cwd,
  scanSummary,
  subtreeTarget,
}: BuildSkoposScopesLiteOptions): Promise<SkoposScopesLiteArtifact> => {
  const focusSubtree = normalizeSubtreeTarget(cwd, subtreeTarget ?? scanSummary.focusSubtree);
  const scopeRegistry = await loadSkoposScopeRegistry({ cwd });
  const declaredScopesById = new Map(
    scopeRegistry?.scopes.map((scope) => [scope.id, scope]) ?? [],
  );
  const scopes: SkoposScopeLite[] = scopeRegistry
    ? scopeRegistry.scopes
        .filter(
          (scope) =>
            scope.kind === 'workspace' ||
            scope.codeRoots.some((codeRoot) => isWithinSubtree(codeRoot, focusSubtree)),
        )
        .map((scope) => ({
          id: scope.id,
          kind: scope.kind,
          title: scope.title,
          path: scope.path,
          aliases: uniqueAliases(scope.aliases),
          summary: `${scope.title} (${scope.profile}).`,
          confidence: 'high',
          parent: scope.parent ?? undefined,
          ancestorIds: resolveAncestorIds(scope.id, declaredScopesById),
          profile: scope.profile,
          memoryRoot: scope.memoryRoot,
          codeRoots: scope.codeRoots,
          dependsOn: scope.dependsOn,
          owners: scope.owners,
        }))
    : await inferCodeScopes({ cwd, scanSummary, focusSubtree });

  return buildArtifact({ cwd, focusSubtree, scopes });
};

const buildArtifact = ({
  cwd,
  focusSubtree,
  scopes,
}: {
  cwd: string;
  focusSubtree?: string;
  scopes: SkoposScopeLite[];
}): SkoposScopesLiteArtifact => ({
  schemaVersion: 1,
  id: 'scopes-lite',
  type: 'scopes-lite',
  status: 'generated',
  authority: 'generated',
  summary: 'Compact scope cards for exact resolution and compact context assembly.',
  updatedAt: new Date().toISOString(),
  generatedAt: new Date().toISOString(),
  workspaceRoot: cwd,
  focusSubtree,
  scopes,
});

const inferCodeScopes = async ({
  cwd,
  scanSummary,
  focusSubtree,
}: {
  cwd: string;
  scanSummary: SkoposScanSummary;
  focusSubtree?: string;
}): Promise<SkoposScopeLite[]> => {
  const packageJsonPaths = await findFilesNamed(cwd, 'package.json');
  const workspaceMemoryRoot = resolveInferredMemoryRoot(scanSummary.docsHealth.root);
  const scopes: SkoposScopeLite[] = [
    {
      id: 'workspace',
      kind: 'workspace',
      title: basename(cwd),
      path: '.',
      aliases: ['root'],
      summary: 'Workspace root scope.',
      confidence: scanSummary.confidence,
      memoryRoot: workspaceMemoryRoot,
      codeRoots: ['.'],
    },
  ];

  for (const packageJsonPath of packageJsonPaths) {
    const packageDir = relative(cwd, dirname(packageJsonPath)) || '.';
    if (
      !isPackageScopePath(packageDir, scanSummary.ignoredPaths) ||
      !isWithinSubtree(packageDir, focusSubtree)
    ) {
      continue;
    }

    const packageJson = await readJsonFile<Record<string, unknown>>(packageJsonPath);
    const packageName = asOptionalString(packageJson?.name) ?? packageDir.replaceAll('/', '-');
    const description = asOptionalString(packageJson?.description);

    scopes.push({
      id: packageName,
      kind: 'package',
      title: packageName,
      path: packageDir,
      aliases: uniqueAliases([packageDir, basename(packageDir)]),
      summary: description ?? `Package scope for ${packageName}.`,
      confidence: 'high',
      parent: 'workspace',
      ancestorIds: ['workspace'],
      memoryRoot: `${workspaceMemoryRoot}/scopes/${toMemoryScopeSegment(packageName)}`,
      codeRoots: [packageDir],
    });
  }

  return scopes;
};

const resolveInferredMemoryRoot = (candidate: string | undefined): string => {
  const normalized = candidate?.replaceAll('\\', '/').replace(/^\.\//u, '').replace(/\/$/u, '');
  return normalized && !normalized.startsWith('/') && !normalized.split('/').includes('..')
    ? normalized
    : 'docs';
};

const toMemoryScopeSegment = (value: string): string =>
  value
    .toLowerCase()
    .replace(/^@/u, '')
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '') || 'package';

const asOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value : undefined;

const uniqueAliases = (aliases: string[]): string[] => [
  ...new Set(aliases.filter((alias) => alias.trim().length > 0)),
];

const resolveAncestorIds = (
  scopeId: string,
  scopesById: Map<string, { id: string; parent: string | null }>,
): string[] => {
  const ancestors: string[] = [];
  const visited = new Set([scopeId]);
  let parentId = scopesById.get(scopeId)?.parent ?? null;

  while (parentId) {
    if (visited.has(parentId)) {
      throw new Error(`Scope ancestry contains a cycle at "${parentId}".`);
    }
    visited.add(parentId);
    ancestors.push(parentId);
    parentId = scopesById.get(parentId)?.parent ?? null;
  }

  return ancestors;
};
