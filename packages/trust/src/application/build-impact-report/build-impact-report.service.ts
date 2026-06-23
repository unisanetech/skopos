import { basename, join, relative, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

import {
  loadSkoposWorkflowManifests,
  matchSkoposRequiredWorkflowsForImpact,
} from '@skopos/indexer';
import { checkInstructionMirrorParity } from '@skopos/instructions';
import { loadSkoposQueryState } from '@skopos/query';
import type {
  SkoposImpactCategory,
  SkoposImpactEntry,
  SkoposImpactReport,
  SkoposRootConfig,
  SkoposScopeLite,
} from '@skopos/model';

import { collectGitChangedPaths } from '../../adapters/git-changed-paths.adapter.js';

export interface BuildSkoposImpactReportOptions {
  cwd: string;
  changedPaths?: string[];
}

export const buildSkoposImpactReport = async ({
  cwd,
  changedPaths = [],
}: BuildSkoposImpactReportOptions): Promise<SkoposImpactReport> => {
  const workspaceRoot = resolve(cwd);
  const changedPathSource = changedPaths.length > 0 ? 'explicit' : 'git-status';
  const rawChangedPaths =
    changedPaths.length > 0 ? changedPaths : await collectGitChangedPaths(workspaceRoot);
  const { bootstrap, scopesLite } = await loadSkoposQueryState({
    cwd: workspaceRoot,
  });
  const config = bootstrap.recommendedConfig;
  const docsRoot = config.docs.root;
  const workflows = await loadSkoposWorkflowManifests({
    cwd: workspaceRoot,
  });
  const normalizedChangedPaths = normalizeChangedPaths(
    workspaceRoot,
    rawChangedPaths,
    changedPathSource === 'git-status' ? workflows : [],
  );
  const instructionMirrorIssues = bootstrap.detected.instructionFiles.some(
    (instructionFile) =>
      instructionFile === config.agents.canonicalInstructions ||
      basename(instructionFile) === 'AGENTS.md',
  )
    ? (
        await checkInstructionMirrorParity({
          cwd: workspaceRoot,
          instructionSourcePath: config.agents.canonicalInstructions,
        })
      ).issues.map((issue) =>
        relative(workspaceRoot, issue.path),
      )
    : [];

  const changed = normalizedChangedPaths.map((changedPath) =>
    classifyChangedPath({
      changedPath,
      docsRoot,
      mirrorTargets: config.agents.syncMirrors,
      scopes: scopesLite.scopes,
    }),
  );
  const affectedScopes = uniqueScopes(
    changed.flatMap((entry) =>
      entry.affectedScopeIds
        .map((scopeId) => scopesLite.scopes.find((scope) => scope.id === scopeId))
        .filter((scope): scope is SkoposScopeLite => Boolean(scope)),
    ),
  );
  const packageValidationSurfaces = await loadPackageValidationSurfaces({
    workspaceRoot,
    scopes: scopesLite.scopes,
  });
  const recommendedChecks = orderedRecommendedChecks(config, changed, packageValidationSurfaces);
  const requiredWorkflows = matchSkoposRequiredWorkflowsForImpact({
    workflows,
    changed,
  });
  const requiredActions = buildRequiredActions({
    changed,
    requireDocsSync: config.trust.requireDocsSync,
    instructionMirrorIssues,
    requiredWorkflows,
  });
  const warnings = buildWarnings({
    changed,
    instructionMirrorIssues,
    requireDocsSync: config.trust.requireDocsSync,
  });

  return {
    workspaceRoot,
    changedPathSource,
    changedPaths: normalizedChangedPaths,
    changed,
    affectedScopes,
    requiredActions,
    recommendedChecks,
    requiredWorkflows,
    warnings,
    instructionMirrorIssues,
    summary: `Impact touches ${normalizedChangedPaths.length} path(s) across ${Math.max(affectedScopes.length, 1)} scope(s) with ${requiredActions.length} required action(s) and ${requiredWorkflows.length} required workflow(s).`,
  };
};

interface ClassifyChangedPathInput {
  changedPath: string;
  docsRoot: string;
  mirrorTargets: string[];
  scopes: SkoposScopeLite[];
}

const classifyChangedPath = ({
  changedPath,
  docsRoot,
  mirrorTargets,
  scopes,
}: ClassifyChangedPathInput): SkoposImpactEntry => {
  const category = classifyCategory(changedPath, docsRoot, mirrorTargets, scopes);
  const affectedScopeIds = scopes
    .filter(
      (scope) =>
        scope.path === '.' ||
        changedPath === scope.path ||
        changedPath.startsWith(`${scope.path}/`),
    )
    .map((scope) => scope.id);

  return {
    path: changedPath,
    category,
    affectedScopeIds: affectedScopeIds.length > 0 ? affectedScopeIds : ['workspace'],
  };
};

const classifyCategory = (
  changedPath: string,
  docsRoot: string,
  mirrorTargets: string[],
  scopes: SkoposScopeLite[],
): SkoposImpactCategory => {
  if (changedPath === 'skopos.config.yaml') {
    return 'root-config';
  }

  if (changedPath.startsWith('.skopos/plans/') || changedPath.startsWith('.skopos/missions/')) {
    return 'workflow-artifact';
  }

  if (changedPath.startsWith('.skopos/runs/')) {
    return 'workflow-artifact';
  }

  if (changedPath === '.skopos/index.json' || changedPath === '.skopos/log.jsonl') {
    return 'workflow-artifact';
  }

  if (changedPath.startsWith('.skopos/graph/')) {
    return 'workflow-artifact';
  }

  if (changedPath === '.skopos/overrides.json') {
    return 'override-artifact';
  }

  if (changedPath.startsWith('.skopos/')) {
    return 'generated-artifact';
  }

  if (changedPath === 'AGENTS.md') {
    return 'instruction-source';
  }

  if (mirrorTargets.includes(changedPath)) {
    return 'instruction-mirror';
  }

  if (changedPath === docsRoot || changedPath.startsWith(`${docsRoot}/`)) {
    return 'docs';
  }

  const packageScopes = scopes.filter((scope) => scope.kind === 'package');
  if (
    basename(changedPath) === 'package.json' &&
    packageScopes.some((scope) => changedPath === join(scope.path, 'package.json'))
  ) {
    return 'package-manifest';
  }

  if (packageScopes.some((scope) => changedPath.startsWith(`${scope.path}/`))) {
    return 'package-source';
  }

  return 'workspace-file';
};

const normalizeChangedPaths = (
  workspaceRoot: string,
  changedPaths: string[],
  workflowGeneratedPaths: Array<{ outputs: string[] }>,
): string[] => [
  ...new Set(
    changedPaths
      .map((changedPath) => relative(workspaceRoot, resolve(workspaceRoot, changedPath)) || '.')
      .filter((changedPath) => !isGitStatusGeneratedNoise(changedPath, workflowGeneratedPaths)),
  ),
];

const isGitStatusGeneratedNoise = (
  changedPath: string,
  workflowGeneratedPaths: Array<{ outputs: string[] }>,
): boolean => {
  if (changedPath === '.skopos/overrides.json') {
    return false;
  }

  if (changedPath.startsWith('.skopos/')) {
    return true;
  }

  if (changedPath.startsWith('docs/generated/')) {
    return true;
  }

  return workflowGeneratedPaths.some((workflow) =>
    workflow.outputs.some((pattern) => pathPatternMatches(changedPath, pattern)),
  );
};

const pathPatternMatches = (changedPath: string, pattern: string): boolean =>
  changedPath === pattern ||
  changedPath.startsWith(`${pattern}/`) ||
  pattern.startsWith(`${changedPath}/`);

const uniqueScopes = (scopes: SkoposScopeLite[]): SkoposScopeLite[] => {
  const byId = new Map<string, SkoposScopeLite>();
  for (const scope of scopes) {
    byId.set(scope.id, scope);
  }
  return [...byId.values()];
};

const orderedRecommendedChecks = (
  config: SkoposRootConfig,
  changed: SkoposImpactEntry[],
  packageValidationSurfaces: SkoposPlanPackageValidationSurface[],
): string[] => {
  if (isDocsOnlyImpactLane(changed)) {
    return [];
  }

  const scopedPackageSurface = resolveImpactPackageValidationSurface(changed, packageValidationSurfaces);
  if (scopedPackageSurface) {
    return (['typecheck', 'test', 'build', 'lint'] as const).flatMap((commandName) => {
      const configuredCommand = config.commands[commandName];
      if (typeof configuredCommand !== 'string' || !configuredCommand.startsWith('pnpm')) {
        return [];
      }

      const scriptName = PACKAGE_SCRIPT_CANDIDATES[commandName].find((candidate) =>
        scopedPackageSurface.scripts.includes(candidate),
      );
      return scriptName ? `pnpm --filter ${scopedPackageSurface.packageName} ${scriptName}` : [];
    });
  }

  return (['typecheck', 'test', 'build', 'lint'] as const)
    .map((name) => config.commands[name])
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
};

const isDocsOnlyImpactLane = (changed: SkoposImpactEntry[]): boolean => {
  if (changed.length === 0) {
    return false;
  }

  return changed.every((entry) =>
    [
      'docs',
      'instruction-source',
      'instruction-mirror',
      'generated-artifact',
      'workflow-artifact',
    ].includes(entry.category),
  );
};

interface SkoposPlanPackageValidationSurface {
  scopeId: string;
  packageName: string;
  scripts: string[];
}

const PACKAGE_SCRIPT_CANDIDATES = {
  typecheck: ['typecheck', 'check-types'],
  test: ['test'],
  build: ['build'],
  lint: ['lint'],
} as const;

const resolveImpactPackageValidationSurface = (
  changed: SkoposImpactEntry[],
  packageValidationSurfaces: SkoposPlanPackageValidationSurface[],
): SkoposPlanPackageValidationSurface | undefined => {
  const packageScopedEntries = changed.filter((entry) =>
    ['package-source', 'package-manifest'].includes(entry.category),
  );
  if (packageScopedEntries.length === 0) {
    return undefined;
  }

  const hasBroaderCodeLikeEntries = changed.some((entry) =>
    ['workspace-file', 'root-config'].includes(entry.category),
  );
  if (hasBroaderCodeLikeEntries) {
    return undefined;
  }

  const packageScopeIds = new Set(
    packageScopedEntries.flatMap((entry) =>
      entry.affectedScopeIds.filter((scopeId) =>
        packageValidationSurfaces.some((surface) => surface.scopeId === scopeId),
      ),
    ),
  );

  if (packageScopeIds.size !== 1) {
    return undefined;
  }

  return packageValidationSurfaces.find((surface) => packageScopeIds.has(surface.scopeId));
};

const loadPackageValidationSurfaces = async ({
  workspaceRoot,
  scopes,
}: {
  workspaceRoot: string;
  scopes: Array<{ id: string; kind: string; path: string }>;
}): Promise<SkoposPlanPackageValidationSurface[]> => {
  const packageScopes = scopes.filter((scope) => scope.kind === 'package');
  const surfaces = await Promise.all(
    packageScopes.map(async (scope) => {
      try {
        const parsed = JSON.parse(
          await readFile(join(workspaceRoot, scope.path, 'package.json'), 'utf8'),
        ) as { name?: unknown; scripts?: Record<string, unknown> };
        const packageName =
          typeof parsed.name === 'string' && parsed.name.trim().length > 0
            ? parsed.name.trim()
            : null;
        if (!packageName) {
          return undefined;
        }

        const scripts = Object.entries(parsed.scripts ?? {})
          .filter(
            ([name, command]) =>
              typeof name === 'string' && typeof command === 'string' && command.trim(),
          )
          .map(([name]) => name);
        if (scripts.length === 0) {
          return undefined;
        }

        return {
          scopeId: scope.id,
          packageName,
          scripts,
        } satisfies SkoposPlanPackageValidationSurface;
      } catch {
        return undefined;
      }
    }),
  );

  return surfaces.filter((entry): entry is SkoposPlanPackageValidationSurface => Boolean(entry));
};

interface BuildRequiredActionsInput {
  changed: SkoposImpactEntry[];
  requireDocsSync: boolean;
  instructionMirrorIssues: string[];
  requiredWorkflows: SkoposImpactReport['requiredWorkflows'];
}

const buildRequiredActions = ({
  changed,
  requireDocsSync,
  instructionMirrorIssues,
  requiredWorkflows,
}: BuildRequiredActionsInput): string[] => {
  const actions: string[] = [];
  const categories = new Set(changed.map((entry) => entry.category));
  const touchedDocs = categories.has('docs');
  const touchedCodeLike =
    categories.has('package-source') ||
    categories.has('package-manifest') ||
    categories.has('workspace-file') ||
    categories.has('root-config');

  if (categories.has('instruction-source')) {
    actions.push('Run `skopos instructions sync` to refresh tool instruction mirrors.');
  }

  if (instructionMirrorIssues.length > 0) {
    actions.push(
      'Bring instruction mirrors back into parity with `AGENTS.md` before closing the change.',
    );
  }

  if (categories.has('generated-artifact')) {
    actions.push(
      'Regenerate `.skopos/**` artifacts from source surfaces instead of hand-editing generated files.',
    );
  }

  if (categories.has('override-artifact')) {
    actions.push(
      'Run `skopos init` to refresh generated bootstrap artifacts after override changes.',
    );
  }

  if (categories.has('root-config')) {
    actions.push(
      'Run `skopos init` to refresh generated bootstrap artifacts after config changes.',
    );
  }

  if (requireDocsSync && touchedCodeLike && !touchedDocs) {
    actions.push(
      'Review docs impact before closure because code or config changed without a docs update.',
    );
  }

  for (const workflow of requiredWorkflows) {
    actions.push(`Run \`skopos workflows run ${workflow.id}\` because ${workflow.reason}`);
  }

  return [...new Set(actions)];
};

interface BuildWarningsInput {
  changed: SkoposImpactEntry[];
  instructionMirrorIssues: string[];
  requireDocsSync: boolean;
}

const buildWarnings = ({
  changed,
  instructionMirrorIssues,
  requireDocsSync,
}: BuildWarningsInput): string[] => {
  const warnings: string[] = [];
  const categories = new Set(changed.map((entry) => entry.category));
  const touchedDocs = categories.has('docs');
  const touchedCodeLike =
    categories.has('package-source') ||
    categories.has('package-manifest') ||
    categories.has('workspace-file') ||
    categories.has('root-config');

  if (instructionMirrorIssues.length > 0) {
    warnings.push(
      `Instruction mirrors are missing or out of sync: ${instructionMirrorIssues.join(', ')}`,
    );
  }

  if (categories.has('generated-artifact')) {
    warnings.push('Generated `.skopos/**` artifacts appear in the changed path list.');
  }

  if (categories.has('override-artifact')) {
    warnings.push(
      'Canonical override declarations changed; regenerate bootstrap artifacts so agents read the updated declared truth.',
    );
  }

  if (requireDocsSync && touchedCodeLike && !touchedDocs) {
    warnings.push(
      'Docs sync may be required because code-like surfaces changed without touching docs.',
    );
  }

  return warnings;
};
