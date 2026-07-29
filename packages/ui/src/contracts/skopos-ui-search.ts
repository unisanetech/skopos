export type SkoposUiConsoleSearchGroupId =
  | 'jump'
  | 'docs'
  | 'work'
  | 'validation'
  | 'structure'
  | 'activity'
  | 'graphs';

export type SkoposUiConsoleSearchKind =
  | 'route'
  | 'doc'
  | 'decision'
  | 'finding'
  | 'discussion'
  | 'artifact'
  | 'portal'
  | 'report'
  | 'plan'
  | 'task'
  | 'scope'
  | 'action'
  | 'event'
  | 'graph';

export interface SkoposUiConsoleSearchEntry {
  id: string;
  group: SkoposUiConsoleSearchGroupId;
  kind: SkoposUiConsoleSearchKind;
  title: string;
  summary: string;
  meta?: string;
  href: string;
  external?: boolean;
  aliases: string[];
  keywords: string[];
  headings?: string[];
  excerpt?: string;
  canonical: boolean;
  active: boolean;
  historical: boolean;
  stale: boolean;
  updatedAt?: string;
  scope?: string;
  routeId?: string;
  defaultRank: number;
}

export interface SkoposUiConsoleSearchIndex {
  generatedAt: string;
  entries: SkoposUiConsoleSearchEntry[];
}
