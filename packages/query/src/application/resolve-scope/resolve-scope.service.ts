import type { SkoposResolvedScope, SkoposScopeLite } from '@skopos/model';

import type { SkoposQueryState } from '../shared/load-query-state.js';
import { loadSkoposQueryState } from '../shared/load-query-state.js';

export interface ResolveSkoposScopeOptions {
  cwd: string;
  query?: string;
}

export interface ResolveSkoposOwnedPathScopeOptions {
  cwd: string;
  paths: string[];
}

export type SkoposScopeExpansionKind =
  | 'within-scope'
  | 'declared-dependency'
  | 'common-ancestor'
  | 'explicit-multi-scope'
  | 'unrelated';

export interface SkoposScopeExpansionResolution {
  kind: SkoposScopeExpansionKind;
  currentScopeId: string;
  affectedScopeIds: string[];
  pathsByScope: Record<string, string[]>;
  authority?: SkoposResolvedScope;
}

export interface ResolveSkoposScopeExpansionOptions {
  cwd: string;
  currentScope: SkoposResolvedScope;
  paths: string[];
}

export const resolveSkoposScope = async ({
  cwd,
  query,
}: ResolveSkoposScopeOptions): Promise<SkoposResolvedScope> => {
  const state = await loadSkoposQueryState({ cwd });
  return resolveSkoposScopeFromState(state, query);
};

export const resolveSkoposScopeForOwnedPaths = async ({
  cwd,
  paths,
}: ResolveSkoposOwnedPathScopeOptions): Promise<SkoposResolvedScope> => {
  const state = await loadSkoposQueryState({ cwd });
  return resolveSkoposScopeForOwnedPathsFromState(state, paths);
};

export const resolveSkoposScopeExpansion = async ({
  cwd,
  currentScope,
  paths,
}: ResolveSkoposScopeExpansionOptions): Promise<SkoposScopeExpansionResolution> => {
  const state = await loadSkoposQueryState({ cwd });
  return resolveSkoposScopeExpansionFromState(state, currentScope, paths);
};

export const resolveSkoposScopeExpansionFromState = (
  state: SkoposQueryState,
  currentScope: SkoposResolvedScope,
  paths: string[],
): SkoposScopeExpansionResolution => {
  if (paths.length === 0) {
    throw new Error('Scope expansion resolution requires at least one owned path.');
  }
  const resolutions = paths.map((path) => ({
    path,
    resolved: resolveSkoposScopeForPathFromState(state, path),
  }));
  const pathsByScope = Object.fromEntries(
    [...new Set(resolutions.map((entry) => entry.resolved.scope.id))]
      .sort((left, right) => left.localeCompare(right))
      .map((scopeId) => [
        scopeId,
        resolutions
          .filter((entry) => entry.resolved.scope.id === scopeId)
          .map((entry) => entry.path)
          .sort((left, right) => left.localeCompare(right)),
      ]),
  );
  const affectedScopeIds = Object.keys(pathsByScope);
  const current = currentScope.scope;
  const explicitWorkspace =
    current.kind === 'workspace' &&
    ['id', 'alias', 'path'].includes(currentScope.matchedBy);
  if (explicitWorkspace && affectedScopeIds.length > 1) {
    return {
      kind: 'explicit-multi-scope',
      currentScopeId: current.id,
      affectedScopeIds,
      pathsByScope,
      authority: currentScope,
    };
  }
  const currentContainsAll = affectedScopeIds.every(
    (scopeId) =>
      scopeId === current.id ||
      state.scopesLite.scopes
        .find((scope) => scope.id === scopeId)
        ?.ancestorIds?.includes(current.id),
  );
  if (currentContainsAll) {
    return {
      kind: 'within-scope',
      currentScopeId: current.id,
      affectedScopeIds,
      pathsByScope,
      authority: currentScope,
    };
  }

  const dependencyExpansion = affectedScopeIds.every(
    (scopeId) =>
      scopeId === current.id ||
      isScopeDependencyReachable(state.scopesLite.scopes, current.id, scopeId),
  );
  if (dependencyExpansion) {
    return {
      kind: 'declared-dependency',
      currentScopeId: current.id,
      affectedScopeIds,
      pathsByScope,
      authority: currentScope,
    };
  }

  const commonAncestor = findNearestCommonAncestor(
    state.scopesLite.scopes,
    affectedScopeIds,
  );
  if (commonAncestor && commonAncestor.kind !== 'workspace') {
    return {
      kind: 'common-ancestor',
      currentScopeId: current.id,
      affectedScopeIds,
      pathsByScope,
      authority: {
        query: affectedScopeIds.join(', '),
        matchedBy: 'topology',
        scope: commonAncestor,
      },
    };
  }

  if (explicitWorkspace) {
    return {
      kind: 'explicit-multi-scope',
      currentScopeId: current.id,
      affectedScopeIds,
      pathsByScope,
      authority: currentScope,
    };
  }

  return {
    kind: 'unrelated',
    currentScopeId: current.id,
    affectedScopeIds,
    pathsByScope,
  };
};

export const resolveSkoposScopeForOwnedPathsFromState = (
  state: SkoposQueryState,
  paths: string[],
): SkoposResolvedScope => {
  if (paths.length === 0) {
    throw new Error('Owned-path Scope resolution requires at least one path.');
  }

  const resolutions = paths.map((path) => ({
    path,
    resolved: resolveSkoposScopeForPathFromState(state, path),
  }));
  const scopeIds = [...new Set(resolutions.map(({ resolved }) => resolved.scope.id))];

  if (scopeIds.length > 1) {
    const candidates = scopeIds.map((scopeId) => {
      const owned = resolutions
        .filter(({ resolved }) => resolved.scope.id === scopeId)
        .map(({ path }) => path);
      return `${scopeId} (${owned.join(', ')})`;
    });
    const workspaceId = findWorkspaceScope(state.scopesLite.scopes).id;
    throw new Error(
      `Owned paths span multiple declared Scopes and cannot be admitted implicitly: ${candidates.join('; ')}. ` +
      'Use --scope <scope-id> when one declared Scope owns the Task, ' +
      `use --scope ${workspaceId} only when the Task intentionally coordinates multiple Scopes, ` +
      'or start separate scoped Tasks.',
    );
  }

  return {
    query: paths.join(', '),
    matchedBy: resolutions[0]!.resolved.matchedBy,
    scope: resolutions[0]!.resolved.scope,
  };
};

export const resolveSkoposScopeForPathFromState = (
  state: SkoposQueryState,
  path: string,
): SkoposResolvedScope => {
  const normalizedPath = normalizeProjectPath(path);
  const matches = state.scopesLite.scopes.flatMap((scope) =>
    scopeCodeRoots(scope)
      .filter((root) => containsProjectPath(root, normalizedPath))
      .map((root) => ({ scope, root, depth: projectPathDepth(root) })),
  );
  const deepestDepth = Math.max(...matches.map((match) => match.depth));
  const deepestMatches = matches.filter((match) => match.depth === deepestDepth);
  const scopeMatches = [
    ...new Map(deepestMatches.map((match) => [match.scope.id, match.scope])).values(),
  ];

  if (scopeMatches.length === 0) {
    return {
      query: path,
      matchedBy: 'code-root',
      scope: findWorkspaceScope(state.scopesLite.scopes),
    };
  }
  if (scopeMatches.length > 1) {
    throw new Error(
      `Owned path "${path}" matches equally specific declared Scopes: ${scopeMatches.map((scope) => scope.id).join(', ')}. Use --scope <scope-id> or correct the Scope registry.`,
    );
  }

  const scope = scopeMatches[0]!;
  return {
    query: path,
    matchedBy: scope.kind === 'workspace' ? 'default-root' : 'code-root',
    scope,
  };
};

export const resolveSkoposScopeFromState = (
  state: SkoposQueryState,
  query?: string,
): SkoposResolvedScope => {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    const workspaceScope = findWorkspaceScope(state.scopesLite.scopes);
    return {
      query: 'workspace',
      matchedBy: 'default-root',
      scope: workspaceScope,
    };
  }

  const exactMatches = state.scopesLite.scopes.filter(
    (scope) => normalizeQuery(scope.id) === normalizedQuery,
  );
  const exactMatch = singleMatchOrNull(exactMatches, query, 'id');
  if (exactMatch) {
    return { query: query ?? exactMatch.id, matchedBy: 'id', scope: exactMatch };
  }

  const aliasMatches = state.scopesLite.scopes.filter((scope) =>
    scope.aliases.some((alias) => normalizeQuery(alias) === normalizedQuery),
  );
  const aliasMatch = singleMatchOrNull(aliasMatches, query, 'alias');
  if (aliasMatch) {
    return { query: query ?? aliasMatch.id, matchedBy: 'alias', scope: aliasMatch };
  }

  const pathMatches = state.scopesLite.scopes.filter(
    (scope) => normalizeQuery(scope.path) === normalizedQuery,
  );
  const pathMatch = singleMatchOrNull(pathMatches, query, 'path');
  if (pathMatch) {
    return { query: query ?? pathMatch.id, matchedBy: 'path', scope: pathMatch };
  }

  throw new Error(`Unable to resolve scope "${query}".`);
};

const findWorkspaceScope = (scopes: SkoposScopeLite[]): SkoposScopeLite => {
  const workspaceScope = scopes.find((scope) => scope.kind === 'workspace');

  if (!workspaceScope) {
    throw new Error('Workspace scope is missing from scopes-lite.');
  }

  return workspaceScope;
};

const findNearestCommonAncestor = (
  scopes: SkoposScopeLite[],
  scopeIds: string[],
): SkoposScopeLite | undefined => {
  const byId = new Map(scopes.map((scope) => [scope.id, scope]));
  const ancestry = scopeIds.map((scopeId) => {
    const scope = byId.get(scopeId);
    return [scopeId, ...(scope?.ancestorIds ?? [])];
  });
  const commonIds = ancestry[0]?.filter((candidate) =>
    ancestry.every((chain) => chain.includes(candidate)),
  ) ?? [];
  return commonIds
    .map((id) => byId.get(id))
    .filter((scope): scope is SkoposScopeLite => scope !== undefined)
    .sort(
      (left, right) =>
        (right.ancestorIds?.length ?? 0) - (left.ancestorIds?.length ?? 0),
    )[0];
};

const isScopeDependencyReachable = (
  scopes: SkoposScopeLite[],
  fromScopeId: string,
  targetScopeId: string,
): boolean => {
  const byId = new Map(scopes.map((scope) => [scope.id, scope]));
  const pending = [...(byId.get(fromScopeId)?.dependsOn ?? [])];
  const visited = new Set<string>();
  while (pending.length > 0) {
    const candidate = pending.shift()!;
    if (candidate === targetScopeId) return true;
    if (visited.has(candidate)) continue;
    visited.add(candidate);
    pending.push(...(byId.get(candidate)?.dependsOn ?? []));
  }
  return false;
};

const normalizeQuery = (value: string | undefined): string => value?.trim().toLowerCase() ?? '';

const normalizeProjectPath = (value: string): string => {
  const normalized = value.trim().replaceAll('\\', '/').replace(/^\.\//u, '').replace(/\/+$/u, '');
  if (
    normalized.startsWith('/') ||
    /^[a-z]:/iu.test(normalized) ||
    normalized === '..' ||
    normalized.startsWith('../') ||
    normalized.split('/').includes('..')
  ) {
    throw new Error(`Owned path must stay inside the workspace: ${value}.`);
  }
  return normalized === '.' ? '' : normalized;
};

const scopeCodeRoots = (scope: SkoposScopeLite): string[] =>
  [...new Set([...(scope.codeRoots ?? []), scope.path])].map(normalizeProjectPath);

const containsProjectPath = (root: string, path: string): boolean =>
  root === '' || path === root || path.startsWith(`${root}/`);

const projectPathDepth = (path: string): number =>
  path === '' ? 0 : path.split('/').filter(Boolean).length;

const singleMatchOrNull = (
  matches: SkoposScopeLite[],
  query: string | undefined,
  kind: 'id' | 'alias' | 'path',
): SkoposScopeLite | null => {
  if (matches.length === 0) {
    return null;
  }

  if (matches.length === 1) {
    return matches[0];
  }

  throw new Error(
    `Ambiguous ${kind} match for "${query}". Use a more specific scope id. Candidates: ${matches.map((match) => match.id).join(', ')}`,
  );
};
