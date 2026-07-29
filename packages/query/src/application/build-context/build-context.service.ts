import { basename, join } from 'node:path';
import { readFile } from 'node:fs/promises';

import type {
  SkoposContextBundle,
  SkoposContextReference,
  SkoposDocumentKnowledgeEntry,
  SkoposDocumentRole,
  SkoposScopeLite,
} from '@skopos/model';
import { isSkoposAdoptedProjectMemoryDocument } from '@skopos/indexer';

import { loadSkoposQueryState } from '../shared/load-query-state.js';
import { resolveSkoposScopeContextIds } from '../shared/scope-context-selection.js';
import { resolveSkoposScopeFromState } from '../resolve-scope/resolve-scope.service.js';

export interface BuildSkoposContextOptions {
  cwd: string;
  scope?: string;
}

export const buildSkoposContext = async ({
  cwd,
  scope,
}: BuildSkoposContextOptions): Promise<SkoposContextBundle> => {
  const state = await loadSkoposQueryState({ cwd });
  const resolved = resolveSkoposScopeFromState(state, scope);
  const references: SkoposContextReference[] = [
    {
      kind: 'bootstrap',
      path: state.paths.bootstrapPath,
      reason: 'Primary generated bootstrap artifact for repo shape and recommended config.',
    },
  ];

  if (state.config) {
    references.push({
      kind: 'config',
      path: state.paths.configPath,
      reason: 'Root Skopos config if already authored for this workspace.',
    });
  }

  const docsStartHerePath =
    state.bootstrap.recommendedConfig.docs.startHerePath ??
    `${state.bootstrap.recommendedConfig.docs.root}/00-start-here.md`;
  const docsStartHere = join(cwd, docsStartHerePath);
  if (
    state.bootstrap.detected.docsHealth.root === state.bootstrap.recommendedConfig.docs.root &&
    state.bootstrap.detected.docsHealth.hasStartHere
  ) {
    references.push({
      kind: 'docs-start-here',
      path: docsStartHere,
      reason: 'Deterministic human/agent docs entrypoint.',
    });
  }

  const agentInstructions = state.bootstrap.detected.instructionFiles.find(
    (filePath) => basename(filePath) === 'AGENTS.md',
  );
  if (agentInstructions) {
    references.push({
      kind: 'instructions',
      path: join(cwd, agentInstructions),
      reason: 'Canonical instruction source for coding tools.',
    });
  }

  const selectedDocuments = selectSkoposContextDocuments({
    documents: state.documents,
    resolvedScope: resolved.scope,
    docsStartHerePath,
  });

  for (const document of selectedDocuments) {
    references.push({
      kind: 'project-doc',
      path: join(cwd, document.path),
      reason: `Compiled ${document.role} context (${document.authority}, ${document.lifecycle}, ${document.metadata?.view ?? 'unspecified view'}) from the project document projection.`,
    });
  }

  if (resolved.scope.kind !== 'workspace') {
    const symbolReferencePath = join(cwd, '.skopos', 'index', 'references', 'symbols.json');
    if (await pathExists(symbolReferencePath)) {
      references.push({
        kind: 'symbols',
        path: symbolReferencePath,
        reason: 'Compiled exported symbol inventory for exact Scope-level reference lookup.',
      });
    }

    for (const codeRoot of resolved.scope.codeRoots ?? [resolved.scope.path]) {
      references.push({
        kind: 'scope-path',
        path: join(cwd, codeRoot),
        reason: 'Declared code root for the requested Scope.',
      });
    }
    const packageManifestPath = join(cwd, resolved.scope.path, 'package.json');
    if (await pathExists(packageManifestPath)) {
      references.push({
        kind: 'package-manifest',
        path: packageManifestPath,
        reason: 'Package manifest present at the resolved Scope root.',
      });
    }
  }

  const duplicateReferencePath = join(cwd, '.skopos', 'index', 'references', 'duplicates.json');
  if (await pathExists(duplicateReferencePath)) {
    references.push({
      kind: 'duplicates',
      path: duplicateReferencePath,
      reason: 'Compiled duplicate ownership reference for low-noise exact conflict checks.',
    });
  }

  const contradictionReferencePath = join(cwd, '.skopos', 'index', 'references', 'contradictions.json');
  if (await pathExists(contradictionReferencePath)) {
    references.push({
      kind: 'contradictions',
      path: contradictionReferencePath,
      reason: 'Compiled contradiction reference derived from diagnosis conflicts and architecture divergence.',
    });
  }

  return {
    workspaceRoot: cwd,
    scope: resolved,
    summary: buildContextSummary(resolved.scope.title, references.length),
    references,
  };
};

const preferredContextRoles: Exclude<SkoposDocumentRole, 'document'>[] = [
  'overview',
  'decision',
  'plan',
  'architecture',
  'standard',
  'domain',
  'guide',
  'operation',
  'finding',
  'task',
  'reference',
  'router',
  'pattern',
];

export const selectSkoposContextDocuments = ({
  documents,
  resolvedScope,
  docsStartHerePath,
}: {
  documents: SkoposDocumentKnowledgeEntry[];
  resolvedScope: SkoposScopeLite;
  docsStartHerePath: string;
}): SkoposDocumentKnowledgeEntry[] => {
  const scopeContextIds = resolveSkoposScopeContextIds(resolvedScope);
  const ranked = documents
    .filter(
      (document) =>
        isSkoposAdoptedProjectMemoryDocument(document) &&
        document.path !== docsStartHerePath &&
        Boolean(
          document.metadata?.scope &&
          scopeContextIds.includes(document.metadata.scope),
        ) &&
        (document.role !== 'pattern' ||
          patternAppliesToScope(document, resolvedScope)),
    )
    .map((document) => {
      const scopeDistance = scopeContextIds.indexOf(document.metadata!.scope!);
      const scopeScore = 100 - Math.max(scopeDistance, 0) * 15;
      return {
        document,
        score:
          scopeScore +
          (document.authority === 'canonical' ? 40 : 0) +
          (document.metadata?.provenance === 'accepted' ||
          document.metadata?.provenance === 'declared'
            ? 30
            : 0) +
          (document.metadata?.status === 'active' ||
          document.metadata?.status === 'accepted'
            ? 20
            : 0) +
          (document.lifecycle === 'active' ? 15 : document.lifecycle === 'durable' ? 10 : 0) +
          contextViewScore(document),
      };
    })
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.document.path.localeCompare(right.document.path),
    );

  return preferredContextRoles
    .map((role) => ranked.find(({ document }) => document.role === role)?.document)
    .filter((document): document is SkoposDocumentKnowledgeEntry => Boolean(document));
};

const patternAppliesToScope = (
  document: SkoposDocumentKnowledgeEntry,
  scope: SkoposScopeLite,
): boolean => {
  const scopeSignals = buildScopeSignals(scope);
  const scopePaths = [
    scope.path,
    ...(scope.codeRoots ?? []),
  ]
    .map(normalizeSignal)
    .filter((value) => value && value !== '.');

  return (document.metadata?.appliesTo ?? []).some((appliesTo) => {
    const normalized = normalizeSignal(appliesTo);
    if (!normalized) return false;
    if (scopeSignals.has(normalized)) return true;

    const literalPathPrefix = normalized
      .split('*', 1)[0]!
      .replace(/\/+$/, '');
    return Boolean(
      literalPathPrefix &&
      scopePaths.some(
        (scopePath) =>
          scopePath === literalPathPrefix ||
          scopePath.startsWith(`${literalPathPrefix}/`) ||
          literalPathPrefix.startsWith(`${scopePath}/`),
      ),
    );
  });
};

const buildScopeSignals = (scope: SkoposScopeLite): Set<string> => {
  const values = [
    scope.id,
    scope.kind,
    scope.title,
    scope.path,
    scope.profile ?? '',
    ...(scope.aliases ?? []),
    ...(scope.codeRoots ?? []),
  ];
  const signals = new Set<string>();

  for (const value of values) {
    const normalized = normalizeSignal(value);
    if (!normalized) continue;
    signals.add(normalized);
    for (const segment of normalized.split(/[^a-z0-9]+/g)) {
      if (segment.length >= 2) signals.add(segment);
    }
  }

  return signals;
};

const normalizeSignal = (value: string): string =>
  value.trim().toLowerCase().replaceAll('\\', '/').replace(/^\.\//, '');

const contextViewScore = (document: SkoposDocumentKnowledgeEntry): number => {
  if (document.role === 'architecture') {
    return document.metadata?.view === 'current'
      ? 20
      : document.metadata?.view === 'transition'
        ? 8
        : document.metadata?.view === 'target'
          ? 4
          : 0;
  }

  return document.metadata?.view === 'target'
    ? 12
    : document.metadata?.view === 'current'
      ? 10
      : document.metadata?.view === 'transition'
        ? 5
        : 0;
};

const buildContextSummary = (scopeTitle: string, referenceCount: number): string =>
  `Compact context for ${scopeTitle} with ${referenceCount} targeted references.`;

const pathExists = async (path: string): Promise<boolean> => {
  try {
    await readFile(path, 'utf8');
    return true;
  } catch {
    return false;
  }
};
