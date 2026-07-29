import type { SkoposUiConsoleState } from '../../contracts/skopos-ui-console-state.js';
import type {
  SkoposUiConsoleSearchEntry,
  SkoposUiConsoleSearchGroupId,
  SkoposUiConsoleSearchKind,
} from '../../contracts/skopos-ui-search.js';
import { buildSkoposConsoleSearchEntries } from '../../support/search/console-search-index.js';

export type SkoposConsoleSearchEntry = SkoposUiConsoleSearchEntry;
export type SkoposConsoleSearchGroupId = SkoposUiConsoleSearchGroupId;
export type SkoposConsoleSearchKind = SkoposUiConsoleSearchKind;

export interface SkoposConsoleSearchResult extends SkoposConsoleSearchEntry {
  score: number;
}

export interface SkoposConsoleSearchGroup {
  id: SkoposConsoleSearchGroupId;
  label: string;
  results: SkoposConsoleSearchResult[];
  total: number;
  truncated: boolean;
}

export interface SkoposConsoleSearchQuery {
  raw: string;
  text: string;
  terms: string[];
  filters: {
    scope?: string;
    kind?: string;
    route?: string;
    doc?: string;
    task?: string;
    plan?: string;
  };
  hasFilters: boolean;
  isEmpty: boolean;
}

export interface SkoposConsoleSearchContext {
  query: SkoposConsoleSearchQuery;
  groups: SkoposConsoleSearchGroup[];
  flatResults: SkoposConsoleSearchResult[];
  total: number;
}

const explicitHistoricalSearchTerms = new Set([
  'archive',
  'archived',
  'historical',
  'history',
  'superseded',
  'old',
  'older',
  'legacy',
]);

const searchGroupOrder: SkoposConsoleSearchGroupId[] = [
  'jump',
  'docs',
  'work',
  'validation',
  'structure',
  'activity',
  'graphs',
];

const searchGroupLabels: Record<SkoposConsoleSearchGroupId, string> = {
  jump: 'Jump',
  docs: 'Docs',
  work: 'Work',
  validation: 'Validation',
  structure: 'Structure',
  activity: 'Activity',
  graphs: 'Graphs',
};

export const getSkoposConsoleSearchContext = ({
  state,
  rawQuery,
  currentPath,
  defaultLimitPerGroup = 4,
  queryLimitPerGroup = 6,
}: {
  state: SkoposUiConsoleState;
  rawQuery: string;
  currentPath?: string;
  defaultLimitPerGroup?: number;
  queryLimitPerGroup?: number;
}): SkoposConsoleSearchContext => {
  const query = parseConsoleSearchQuery(rawQuery);
  const entries = state.searchIndex?.entries ?? buildSkoposConsoleSearchEntries(state);
  const results = entries
    .map((entry) => {
      const score = scoreConsoleSearchEntry(entry, query, currentPath);
      if (score === null) {
        return undefined;
      }

      return {
        ...entry,
        score,
      } satisfies SkoposConsoleSearchResult;
    })
    .filter((entry): entry is SkoposConsoleSearchResult => Boolean(entry))
    .sort((left, right) => sortConsoleSearchResults(left, right));

  const limitPerGroup = query.isEmpty ? defaultLimitPerGroup : queryLimitPerGroup;
  const groups = searchGroupOrder
    .map((groupId) => {
      const groupedResults = results.filter((result) => result.group === groupId);
      if (groupedResults.length === 0) {
        return undefined;
      }

      return {
        id: groupId,
        label: searchGroupLabels[groupId],
        results: groupedResults.slice(0, limitPerGroup),
        total: groupedResults.length,
        truncated: groupedResults.length > limitPerGroup,
      } satisfies SkoposConsoleSearchGroup;
    })
    .filter((group): group is SkoposConsoleSearchGroup => Boolean(group));

  return {
    query,
    groups,
    flatResults: groups.flatMap((group) => group.results),
    total: results.length,
  };
};


const parseConsoleSearchQuery = (rawQuery: string): SkoposConsoleSearchQuery => {
  const filters: SkoposConsoleSearchQuery['filters'] = {};
  const textTokens: string[] = [];

  for (const part of rawQuery.trim().split(/\s+/)) {
    const match = /^(scope|kind|route|doc|task|plan):(.+)$/i.exec(part);
    if (match) {
      const [, key, value] = match;
      const normalizedValue = normalizeSearchValue(value);
      if (normalizedValue) {
        filters[key.toLowerCase() as keyof typeof filters] = normalizedValue;
      }
      continue;
    }

    if (part) {
      textTokens.push(part);
    }
  }

  const text = textTokens.join(' ').trim();
  const normalizedText = normalizeSearchValue(text);
  const terms = normalizedText.length > 0 ? normalizedText.split(' ') : [];

  return {
    raw: rawQuery,
    text,
    terms,
    filters,
    hasFilters: Object.values(filters).some(Boolean),
    isEmpty: normalizedText.length === 0 && !Object.values(filters).some(Boolean),
  };
};

const scoreConsoleSearchEntry = (
  entry: SkoposConsoleSearchEntry,
  query: SkoposConsoleSearchQuery,
  currentPath?: string,
): number | null => {
  if (
    entry.group === 'docs' &&
    entry.historical &&
    !queryRequestsHistoricalDocs(query)
  ) {
    return null;
  }

  if (!matchesConsoleSearchFilters(entry, query.filters)) {
    return null;
  }

  const currentHref = currentPath ? `#${currentPath}` : undefined;

  if (query.isEmpty) {
    return (
      entry.defaultRank +
      (entry.canonical ? 18 : 0) +
      (entry.active ? 12 : 0) +
      (!entry.historical ? 8 : 0) -
      (entry.stale ? 24 : 0) -
      (currentHref === entry.href ? 14 : 0) +
      freshnessBoost(entry.updatedAt)
    );
  }

  const normalizedTitle = normalizeSearchValue(entry.title);
  const normalizedId = normalizeSearchValue(entry.id);
  const normalizedAliases = entry.aliases.map((value) => normalizeSearchValue(value)).filter(Boolean);
  const normalizedKeywords = entry.keywords
    .map((value) => normalizeSearchValue(value))
    .filter(Boolean);
  const normalizedHeadings = (entry.headings ?? [])
    .map((value) => normalizeSearchValue(value))
    .filter(Boolean);
  const normalizedSummary = normalizeSearchValue(entry.summary);
  const normalizedMeta = normalizeSearchValue(entry.meta ?? '');
  const normalizedExcerpt = normalizeSearchValue(entry.excerpt ?? '');
  const normalizedScope = normalizeSearchValue(entry.scope ?? '');
  const fullQuery = normalizeSearchValue(query.text);

  let score = 0;

  if (fullQuery) {
    if (normalizedTitle === fullQuery || normalizedAliases.includes(fullQuery)) {
      score += 1400;
    } else if (normalizedId === fullQuery) {
      score += 1360;
    } else if (normalizedTitle.startsWith(fullQuery)) {
      score += 1120;
    } else if (normalizedAliases.some((alias) => alias.startsWith(fullQuery))) {
      score += 1080;
    } else if (normalizedTitle.includes(fullQuery)) {
      score += 920;
    } else if (
      normalizedKeywords.some(
        (keyword) => keyword === fullQuery || keyword.startsWith(fullQuery) || keyword.includes(fullQuery),
      )
    ) {
      score += 860;
    } else if (
      normalizedHeadings.some(
        (heading) => heading === fullQuery || heading.startsWith(fullQuery) || heading.includes(fullQuery),
      )
    ) {
      score += 780;
    } else if (normalizedSummary.includes(fullQuery) || normalizedMeta.includes(fullQuery)) {
      score += 540;
    } else if (normalizedExcerpt.includes(fullQuery)) {
      score += 420;
    }
  }

  for (const term of query.terms) {
    let matched = false;
    if (normalizedTitle.split(' ').includes(term)) {
      score += 170;
      matched = true;
    } else if (normalizedTitle.includes(term)) {
      score += 130;
      matched = true;
    } else if (normalizedAliases.some((alias) => alias.split(' ').includes(term))) {
      score += 124;
      matched = true;
    } else if (normalizedAliases.some((alias) => alias.includes(term))) {
      score += 110;
      matched = true;
    } else if (normalizedKeywords.some((keyword) => keyword.split(' ').includes(term))) {
      score += 100;
      matched = true;
    } else if (normalizedKeywords.some((keyword) => keyword.includes(term))) {
      score += 84;
      matched = true;
    } else if (normalizedHeadings.some((heading) => heading.split(' ').includes(term))) {
      score += 92;
      matched = true;
    } else if (normalizedHeadings.some((heading) => heading.includes(term))) {
      score += 78;
      matched = true;
    } else if (normalizedId.includes(term) || normalizedScope.includes(term)) {
      score += 72;
      matched = true;
    } else if (normalizedSummary.includes(term) || normalizedMeta.includes(term)) {
      score += 38;
      matched = true;
    } else if (normalizedExcerpt.includes(term)) {
      score += 24;
      matched = true;
    }

    if (!matched) {
      return null;
    }
  }

  return (
    score +
    (entry.canonical ? 60 : 0) +
    (entry.active ? 44 : 0) +
    (!entry.historical ? 18 : -12) -
    (entry.stale ? 42 : 0) -
    (currentHref === entry.href ? 24 : 0) +
    freshnessBoost(entry.updatedAt)
  );
};

const queryRequestsHistoricalDocs = (query: SkoposConsoleSearchQuery): boolean => {
  const values = [
    query.text,
    ...query.terms,
    query.filters.doc,
    query.filters.kind,
  ]
    .map((value) => normalizeSearchValue(value ?? ''))
    .filter(Boolean);

  return values.some((value) =>
    value.split(' ').some((term) => explicitHistoricalSearchTerms.has(term)),
  );
};

const matchesConsoleSearchFilters = (
  entry: SkoposConsoleSearchEntry,
  filters: SkoposConsoleSearchQuery['filters'],
): boolean => {
  const scopeFilter = filters.scope;
  if (scopeFilter) {
    const normalizedScope = normalizeSearchValue(entry.scope ?? '');
    const normalizedKeywords = entry.keywords.map((value) => normalizeSearchValue(value));
    if (
      !normalizedScope.includes(scopeFilter) &&
      !normalizedKeywords.some((keyword) => keyword.includes(scopeFilter))
    ) {
      return false;
    }
  }

  if (filters.kind) {
    const normalizedKind = normalizeSearchValue(entry.kind);
    if (normalizedKind !== filters.kind) {
      return false;
    }
  }

  if (filters.route) {
    if (
      entry.kind !== 'route' ||
      !normalizeSearchValue(entry.routeId ?? entry.title).includes(filters.route)
    ) {
      return false;
    }
  }

  if (filters.doc) {
    if (
      !['doc', 'decision', 'finding', 'artifact', 'portal', 'report'].includes(entry.kind) ||
      ![entry.title, entry.id, entry.summary]
        .map((value) => normalizeSearchValue(value))
        .some((value) => value.includes(filters.doc!))
    ) {
      return false;
    }
  }

  if (filters.task) {
    if (
      entry.kind !== 'task' ||
      ![entry.title, entry.id, entry.summary]
        .map((value) => normalizeSearchValue(value))
        .some((value) => value.includes(filters.task!))
    ) {
      return false;
    }
  }

  if (filters.plan) {
    if (
      entry.kind !== 'plan' ||
      ![entry.title, entry.id, entry.summary]
        .map((value) => normalizeSearchValue(value))
        .some((value) => value.includes(filters.plan!))
    ) {
      return false;
    }
  }

  return true;
};

const sortConsoleSearchResults = (
  left: SkoposConsoleSearchResult,
  right: SkoposConsoleSearchResult,
): number => {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  if (right.defaultRank !== left.defaultRank) {
    return right.defaultRank - left.defaultRank;
  }

  return left.title.localeCompare(right.title);
};

const freshnessBoost = (updatedAt?: string): number => {
  if (!updatedAt) {
    return 0;
  }

  const timestamp = Date.parse(updatedAt);
  if (Number.isNaN(timestamp)) {
    return 0;
  }

  const ageHours = (Date.now() - timestamp) / 3_600_000;
  if (ageHours <= 24) {
    return 14;
  }
  if (ageHours <= 72) {
    return 10;
  }
  if (ageHours <= 168) {
    return 6;
  }
  return 2;
};

const normalizeSearchValue = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9@]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
