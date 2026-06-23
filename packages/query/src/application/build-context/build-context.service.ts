import { basename, join } from 'node:path';
import { readFile } from 'node:fs/promises';

import type { SkoposContextBundle, SkoposContextReference } from '@skopos/model';

import { loadSkoposQueryState } from '../shared/load-query-state.js';
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

  if (resolved.scope.kind === 'package') {
    const symbolReferencePath = join(cwd, '.skopos', 'references', 'symbols.json');
    if (await pathExists(symbolReferencePath)) {
      references.push({
        kind: 'symbols',
        path: symbolReferencePath,
        reason: 'Compiled exported symbol inventory for exact package-level reference lookup.',
      });
    }

    references.push({
      kind: 'scope-path',
      path: join(cwd, resolved.scope.path),
      reason: 'Resolved package directory for the requested scope.',
    });
    references.push({
      kind: 'package-manifest',
      path: join(cwd, resolved.scope.path, 'package.json'),
      reason: 'Package manifest for the resolved package scope.',
    });
  } else if (resolved.scope.kind !== 'workspace') {
    references.push({
      kind: 'scope-path',
      path: join(cwd, resolved.scope.path),
      reason: `Resolved ${resolved.scope.kind} path.`,
    });
  }

  const duplicateReferencePath = join(cwd, '.skopos', 'references', 'duplicates.json');
  if (await pathExists(duplicateReferencePath)) {
    references.push({
      kind: 'duplicates',
      path: duplicateReferencePath,
      reason: 'Compiled duplicate ownership reference for low-noise exact conflict checks.',
    });
  }

  const contradictionReferencePath = join(cwd, '.skopos', 'references', 'contradictions.json');
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
