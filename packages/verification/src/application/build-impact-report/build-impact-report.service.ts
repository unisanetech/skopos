import { basename, join, relative, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

import {
  buildSkoposSourceDependencyDigest,
  loadSkoposActionManifests,
  loadSkoposGuardManifests,
  matchSkoposRequiredActionsForImpact,
} from '@skopos/indexer';
import { checkInstructionMirrorParity } from '@skopos/instructions';
import { loadSkoposQueryState } from '@skopos/query';
import type {
  SkoposEnforcementProfileArtifact,
  SkoposImpactCategory,
  SkoposImpactEntry,
  SkoposImpactReport,
  SkoposTaskChangeScope,
  SkoposRootConfig,
  SkoposScopeLite,
  SkoposSourceDependency,
  SkoposActionPhase,
  SkoposTaskRisk,
} from '@skopos/model';

import { collectGitChangedPaths } from '../../adapters/git-changed-paths.adapter.js';
import { resolveSkoposTaskChangedPaths } from '../task-change-scope/task-change-scope.service.js';

export interface BuildSkoposImpactReportOptions {
  cwd: string;
  changedPaths?: string[];
  changeScope?: SkoposTaskChangeScope;
  phase?: SkoposActionPhase;
  risk?: SkoposTaskRisk;
}

export const buildSkoposImpactReport = async ({
  cwd,
  changedPaths = [],
  changeScope,
  phase,
  risk,
}: BuildSkoposImpactReportOptions): Promise<SkoposImpactReport> => {
  const workspaceRoot = resolve(cwd);
  const changedPathSource =
    changedPaths.length > 0 ? 'explicit' : changeScope ? 'task' : 'git-status';
  const missionChangedPaths =
    changedPaths.length === 0 && changeScope
      ? await resolveSkoposTaskChangedPaths({
          workspaceRoot,
          changeScope,
        })
      : undefined;
  const rawChangedPaths =
    changedPaths.length > 0
      ? changedPaths
      : missionChangedPaths?.changedPaths ?? await collectGitChangedPaths(workspaceRoot);
  const { bootstrap, scopesLite } = await loadSkoposQueryState({
    cwd: workspaceRoot,
  });
  const enforcement = await loadEnforcementProfile(workspaceRoot);
  const config = bootstrap.recommendedConfig;
  const docsRoot = config.docs.root;
  const [actions, guards] = await Promise.all([
    loadSkoposActionManifests({ cwd: workspaceRoot }),
    loadSkoposGuardManifests({ cwd: workspaceRoot }),
  ]);
  const normalizedChangedPaths = normalizeChangedPaths(workspaceRoot, rawChangedPaths);
  const ignoredPreExistingPaths = normalizeChangedPaths(
    workspaceRoot,
    missionChangedPaths?.ignoredPreExistingPaths ?? [],
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
          projectionModel: enforcement?.hostProjectionModel,
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
  const guardSelection = matchSkoposRequiredActionsForImpact({
    actions,
    guards,
    changed,
    phase,
    risk,
  });
  const recommendedCommands = buildRecommendedCommands({
    changed,
    requireDocsSync: config.verification.requireDocsSync,
    instructionMirrorIssues,
    requiredActions: guardSelection.actions,
    bootstrapConfigFresh: await isSourceDependencyFresh({
      workspaceRoot,
      sourcePath: 'skopos.config.yaml',
      sourceDependencies: bootstrap.sourceDependencies,
    }),
  });
  const warnings = buildWarnings({
    changed,
    instructionMirrorIssues,
    requireDocsSync: config.verification.requireDocsSync,
  });

  return {
    workspaceRoot,
    changedPathSource,
    changedPaths: normalizedChangedPaths,
    ignoredPreExistingPaths,
    changed,
    affectedScopes,
    recommendedCommands,
    recommendedChecks,
    matchedGuards: guardSelection.guards,
    requiredActions: guardSelection.actions,
    warnings,
    instructionMirrorIssues,
    summary: `Impact touches ${normalizedChangedPaths.length} path(s) across ${Math.max(affectedScopes.length, 1)} scope(s) with ${guardSelection.guards.length} applicable Guard(s) and ${guardSelection.actions.length} required Action(s).`,
  };
};

const loadEnforcementProfile = async (
  workspaceRoot: string,
): Promise<SkoposEnforcementProfileArtifact | null> => {
  try {
    return JSON.parse(
      await readFile(join(workspaceRoot, '.skopos', 'index', 'enforcement.json'), 'utf8'),
    ) as SkoposEnforcementProfileArtifact;
  } catch {
    return null;
  }
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
    .filter((scope) => scopeOwnsPath(scope, changedPath))
    .map((scope) => scope.id);
  const workspaceScopeId =
    scopes.find((scope) => scope.kind === 'workspace')?.id ?? 'workspace';

  return {
    path: changedPath,
    category,
    affectedScopeIds: affectedScopeIds.length > 0 ? affectedScopeIds : [workspaceScopeId],
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

  if (
    changedPath.startsWith('.skopos/tasks/')
  ) {
    return 'action-artifact';
  }

  if (changedPath.startsWith('.skopos/runs/')) {
    return 'action-artifact';
  }

  if (
    changedPath === '.skopos/index/memory.json' ||
    changedPath === '.skopos/runs/operations.jsonl'
  ) {
    return 'action-artifact';
  }

  if (changedPath.startsWith('.skopos/graph/')) {
    return 'action-artifact';
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

  if (
    changedPath === docsRoot ||
    changedPath.startsWith(`${docsRoot}/`) ||
    isRootDocumentationPath(changedPath) ||
    scopes.some(
      (scope) =>
        scope.memoryRoot &&
        (changedPath === scope.memoryRoot ||
          changedPath.startsWith(`${scope.memoryRoot}/`)),
    )
  ) {
    return 'docs';
  }

  const codeScopes = scopes.filter((scope) => scope.kind !== 'workspace');
  if (
    basename(changedPath) === 'package.json' &&
    codeScopes.some((scope) =>
      [...new Set([scope.path, ...(scope.codeRoots ?? [])])].some(
        (codeRoot) => changedPath === join(codeRoot, 'package.json'),
      ),
    )
  ) {
    return 'package-manifest';
  }

  if (
    codeScopes.some((scope) =>
      (scope.codeRoots ?? [scope.path]).some(
        (codeRoot) =>
          changedPath === codeRoot || changedPath.startsWith(`${codeRoot}/`),
      ),
    )
  ) {
    return 'scope-source';
  }

  return 'workspace-file';
};

const isRootDocumentationPath = (changedPath: string): boolean =>
  !changedPath.includes('/') &&
  /^(?:README|CHANGELOG|CONTRIBUTING|SECURITY|CODE_OF_CONDUCT)(?:\.[^.]+)?$/i.test(
    changedPath,
  );

const normalizeChangedPaths = (
  workspaceRoot: string,
  changedPaths: string[],
): string[] => [
  ...new Set(
    changedPaths
      .map((changedPath) => relative(workspaceRoot, resolve(workspaceRoot, changedPath)) || '.')
      .filter((changedPath) => !changedPath.startsWith('.skopos/')),
  ),
];

const scopeOwnsPath = (scope: SkoposScopeLite, changedPath: string): boolean => {
  if (scope.kind === 'workspace') return true;
  const ownedRoots = [
    ...(scope.codeRoots ?? [scope.path]),
    ...(scope.memoryRoot ? [scope.memoryRoot] : []),
  ];
  return ownedRoots.some(
    (root) => changedPath === root || changedPath.startsWith(`${root}/`),
  );
};

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
  if (config.validation?.mode === 'actions') {
    return [];
  }

  if (isDocsOnlyImpactLane(changed)) {
    return [];
  }

  const scopedPackageSurfaces = resolveImpactPackageValidationSurfaces(
    changed,
    packageValidationSurfaces,
  );
  if (scopedPackageSurfaces.length > 0) {
    return scopedPackageSurfaces.flatMap((surface) =>
      (
        surface.impactRole === 'dependent'
          ? (['typecheck'] as const)
          : (['typecheck', 'test', 'build', 'lint'] as const)
      ).flatMap((commandName) => {
        const configuredCommand = config.commands[commandName];
        if (typeof configuredCommand !== 'string' || !configuredCommand.startsWith('pnpm')) {
          return [];
        }

        const scriptName = PACKAGE_SCRIPT_CANDIDATES[commandName].find((candidate) =>
          surface.scripts.includes(candidate),
        );
        return scriptName ? `pnpm --filter ${surface.packageName} ${scriptName}` : [];
      }),
    );
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
      'action-artifact',
    ].includes(entry.category),
  );
};

interface SkoposPlanPackageValidationSurface {
  scopeId: string;
  packageName: string;
  scripts: string[];
  workspaceDependencies: string[];
  impactRole?: 'owner' | 'dependent';
}

interface LoadedPackageValidationSurface extends SkoposPlanPackageValidationSurface {
  dependencyNames: string[];
}

const PACKAGE_SCRIPT_CANDIDATES = {
  typecheck: ['typecheck', 'check-types'],
  test: ['test'],
  build: ['build'],
  lint: ['lint'],
} as const;

const resolveImpactPackageValidationSurfaces = (
  changed: SkoposImpactEntry[],
  packageValidationSurfaces: SkoposPlanPackageValidationSurface[],
): SkoposPlanPackageValidationSurface[] => {
  const packageScopedEntries = changed.filter((entry) =>
    ['scope-source', 'package-manifest'].includes(entry.category),
  );
  if (packageScopedEntries.length === 0) {
    return [];
  }

  const hasBroaderCodeLikeEntries = changed.some((entry) =>
    ['workspace-file', 'root-config'].includes(entry.category),
  );
  if (hasBroaderCodeLikeEntries) {
    return [];
  }

  const packageScopeIds = new Set(
    packageScopedEntries.flatMap((entry) =>
      entry.affectedScopeIds.filter((scopeId) =>
        packageValidationSurfaces.some((surface) => surface.scopeId === scopeId),
      ),
    ),
  );

  if (packageScopeIds.size === 0) {
    return [];
  }

  const affectedPackageNames = new Set(
    packageValidationSurfaces
      .filter((surface) => packageScopeIds.has(surface.scopeId))
      .map((surface) => surface.packageName),
  );
  const ownerPackageNames = new Set(affectedPackageNames);
  let expanded = true;
  while (expanded) {
    expanded = false;
    for (const surface of packageValidationSurfaces) {
      if (
        !affectedPackageNames.has(surface.packageName) &&
        surface.workspaceDependencies.some((dependency) => affectedPackageNames.has(dependency))
      ) {
        affectedPackageNames.add(surface.packageName);
        expanded = true;
      }
    }
  }

  return packageValidationSurfaces
    .filter((surface) => affectedPackageNames.has(surface.packageName))
    .map((surface) => ({
      ...surface,
      impactRole: ownerPackageNames.has(surface.packageName)
        ? ('owner' as const)
        : ('dependent' as const),
    }))
    .sort((left, right) => left.packageName.localeCompare(right.packageName));
};

const loadPackageValidationSurfaces = async ({
  workspaceRoot,
  scopes,
}: {
  workspaceRoot: string;
  scopes: SkoposScopeLite[];
}): Promise<SkoposPlanPackageValidationSurface[]> => {
  const projectScopes = scopes.filter((scope) => scope.kind !== 'workspace');
  const loadedSurfaces = await Promise.all(
    projectScopes.map(async (scope) => {
      try {
        const parsed = JSON.parse(
          await readFile(join(workspaceRoot, scope.path, 'package.json'), 'utf8'),
        ) as {
          name?: unknown;
          scripts?: Record<string, unknown>;
          dependencies?: Record<string, unknown>;
          devDependencies?: Record<string, unknown>;
          peerDependencies?: Record<string, unknown>;
          optionalDependencies?: Record<string, unknown>;
        };
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
          workspaceDependencies: [] as string[],
          dependencyNames: [
            ...new Set(
              [
                ...Object.keys(parsed.dependencies ?? {}),
                ...Object.keys(parsed.devDependencies ?? {}),
                ...Object.keys(parsed.peerDependencies ?? {}),
                ...Object.keys(parsed.optionalDependencies ?? {}),
              ],
            ),
          ],
        } satisfies LoadedPackageValidationSurface;
      } catch {
        return undefined;
      }
    }),
  );
  const resolvedSurfaces = loadedSurfaces.filter(
    (entry): entry is LoadedPackageValidationSurface => Boolean(entry),
  );
  const workspacePackageNames = new Set(
    resolvedSurfaces.map((surface) => surface.packageName),
  );

  return resolvedSurfaces.map(({ dependencyNames, ...surface }) => ({
    ...surface,
    workspaceDependencies: dependencyNames.filter((dependency) =>
      workspacePackageNames.has(dependency),
    ),
  }));
};

interface BuildRecommendedCommandsInput {
  changed: SkoposImpactEntry[];
  requireDocsSync: boolean;
  instructionMirrorIssues: string[];
  requiredActions: SkoposImpactReport['requiredActions'];
  bootstrapConfigFresh: boolean;
}

const buildRecommendedCommands = ({
  changed,
  requireDocsSync,
  instructionMirrorIssues,
  requiredActions,
  bootstrapConfigFresh,
}: BuildRecommendedCommandsInput): string[] => {
  const actions: string[] = [];
  const categories = new Set(changed.map((entry) => entry.category));
  const touchedDocs = categories.has('docs');
  const touchedCodeLike =
    categories.has('scope-source') ||
    categories.has('package-manifest') ||
    categories.has('workspace-file') ||
    categories.has('root-config');

  if (categories.has('instruction-source') && instructionMirrorIssues.length > 0) {
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

  if (categories.has('root-config') && !bootstrapConfigFresh) {
    actions.push(
      'Run `skopos init` to refresh generated bootstrap artifacts after config changes.',
    );
  }

  if (requireDocsSync && touchedCodeLike && !touchedDocs) {
    actions.push(
      'Review docs impact before closure because code or config changed without a docs update.',
    );
  }

  for (const action of requiredActions) {
    actions.push(`Run \`skopos actions run ${action.id}\` because ${action.reason}`);
  }

  return [...new Set(actions)];
};

const isSourceDependencyFresh = async ({
  workspaceRoot,
  sourcePath,
  sourceDependencies,
}: {
  workspaceRoot: string;
  sourcePath: string;
  sourceDependencies: SkoposSourceDependency[];
}): Promise<boolean> => {
  const dependency = sourceDependencies.find((entry) => entry.path === sourcePath);
  if (!dependency) {
    return false;
  }

  return (
    dependency.digest ===
    (await buildSkoposSourceDependencyDigest(
      workspaceRoot,
      sourcePath,
      dependency.kind,
    ))
  );
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
    categories.has('scope-source') ||
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

  if (requireDocsSync && touchedCodeLike && !touchedDocs) {
    warnings.push(
      'Docs sync may be required because code-like surfaces changed without touching docs.',
    );
  }

  return warnings;
};
