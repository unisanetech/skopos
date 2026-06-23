import type { SkoposResolvedScope, SkoposScopeLite } from '@skopos/model';

import type { SkoposQueryState } from '../shared/load-query-state.js';
import { loadSkoposQueryState } from '../shared/load-query-state.js';

export interface ResolveSkoposScopeOptions {
  cwd: string;
  query?: string;
}

export const resolveSkoposScope = async ({
  cwd,
  query,
}: ResolveSkoposScopeOptions): Promise<SkoposResolvedScope> => {
  const state = await loadSkoposQueryState({ cwd });
  return resolveSkoposScopeFromState(state, query);
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

const normalizeQuery = (value: string | undefined): string => value?.trim().toLowerCase() ?? '';

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
