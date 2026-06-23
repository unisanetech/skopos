import { basename, dirname, join, relative, resolve } from 'node:path';

import { loadSkoposConfig } from '@skopos/config';
import type {
  SkoposCommandMap,
  SkoposDocsHealthSummary,
  SkoposProjectArchetype,
  SkoposRepoMode,
  SkoposRootConfig,
  SkoposScanSummary,
  SkoposSourceDependency,
} from '@skopos/model';

import {
  findFilesNamed,
  listFilesUnder,
  pathExists,
  readJsonFile,
  readTextFile,
} from '../../adapters/workspace-filesystem.adapter.js';
import {
  buildAppliedOverrides,
  getSkoposOverrideValue,
  loadSkoposOverrideArtifact,
} from '../load-overrides/load-overrides.service.js';
import {
  isPackageScopePath,
  normalizeWorkspaceIgnorePaths,
} from '../shared/package-scope-path.policy.js';
import { isWithinSubtree, normalizeSubtreeTarget } from '../shared/subtree-target.policy.js';

const FRAMEWORK_MAP: Record<string, string> = {
  express: 'express',
  fastify: 'fastify',
  hono: 'hono',
  next: 'nextjs',
  react: 'react',
  svelte: 'svelte',
  vue: 'vue',
};
const DOCS_ROOT_CANDIDATES = ['docs', 'knowledge', 'handbook'] as const;
const DOCS_ROUTER_RELATIVE_CANDIDATES = [
  '00-start-here.md',
  'core/ssot/00-start-here.md',
] as const;

export interface ScanRepoOptions {
  cwd: string;
  subtreeTarget?: string;
  existingConfig?: SkoposRootConfig | null;
}

export const scanRepo = async ({
  cwd,
  subtreeTarget,
  existingConfig,
}: ScanRepoOptions): Promise<SkoposScanSummary> => {
  const resolvedCwd = resolve(cwd);
  const focusSubtree = normalizeSubtreeTarget(cwd, subtreeTarget);
  const config =
    existingConfig === undefined ? await loadSkoposConfig(join(cwd, 'skopos.config.yaml')) : existingConfig;
  const ignoredPaths = normalizeWorkspaceIgnorePaths(config?.workspace.ignore ?? []);
  const inheritedWorkspaceRoot = await findNearestParentWorkspaceRoot(resolvedCwd);
  const workspaceRoot = inheritedWorkspaceRoot?.path ?? resolvedCwd;
  const localRootPackageJsonPath = join(resolvedCwd, 'package.json');
  const workspaceRootPackageJsonPath = join(workspaceRoot, 'package.json');
  const [localRootPackageJson, workspaceRootPackageJson] = await Promise.all([
    readJsonFile<Record<string, unknown>>(localRootPackageJsonPath),
    workspaceRoot === resolvedCwd
      ? readJsonFile<Record<string, unknown>>(workspaceRootPackageJsonPath)
      : inheritedWorkspaceRoot?.rootPackageJson ??
        readJsonFile<Record<string, unknown>>(workspaceRootPackageJsonPath),
  ]);
  const hasWorkspaceSignals =
    (await pathExists(join(workspaceRoot, 'pnpm-workspace.yaml'))) ||
    hasWorkspaceField(workspaceRootPackageJson);
  const workspacePackageJsonPaths = (
    await findFilesNamed(workspaceRoot, 'package.json')
  ).filter((filePath) => {
    const packageDir = relative(workspaceRoot, filePath.replace(/\/package\.json$/, '')) || '.';
    if (packageDir === '.') {
      return !hasWorkspaceSignals;
    }

    return isPackageScopePath(packageDir, ignoredPaths);
  });
  const localWorkspacePath = relative(workspaceRoot, resolvedCwd) || '.';
  const packageJsonPaths = workspacePackageJsonPaths.filter((filePath) => {
    const packageDirFromWorkspaceRoot =
      relative(workspaceRoot, filePath.replace(/\/package\.json$/, '')) || '.';
    const isWithinTargetWorkspace =
      workspaceRoot === resolvedCwd ||
      packageDirFromWorkspaceRoot === localWorkspacePath ||
      packageDirFromWorkspaceRoot.startsWith(`${localWorkspacePath}/`);
    if (!isWithinTargetWorkspace) {
      return false;
    }

    const packageDir = relative(resolvedCwd, filePath.replace(/\/package\.json$/, '')) || '.';
    return isWithinSubtree(packageDir, focusSubtree);
  });
  const overrides = await loadSkoposOverrideArtifact({ cwd });
  const dependencyNames = await collectDependencyNames(localRootPackageJsonPath, packageJsonPaths);
  const commands = extractCommandMap(localRootPackageJson);
  const configuredDocsRoot =
    getSkoposOverrideValue(overrides, 'docs.root') ?? existingConfig?.docs.root;
  const docsRoots = await collectDocsRoots({
    cwd: resolvedCwd,
    workspaceRoot,
    configuredDocsRoot,
  });
  const docsHealthRoot =
    configuredDocsRoot && docsRoots.includes(configuredDocsRoot)
      ? configuredDocsRoot
      : docsRoots[0];
  const docsHealthData = await collectDocsHealthData(resolvedCwd, docsHealthRoot);
  const docsHealth = docsHealthData.summary;
  const instructionFiles = await collectInstructionFiles({
    cwd: resolvedCwd,
    workspaceRoot,
  });
  const hasPnpmWorkspace = await pathExists(join(workspaceRoot, 'pnpm-workspace.yaml'));
  const inferredRepoMode = detectRepoMode(hasWorkspaceSignals, workspacePackageJsonPaths.length);
  const repoMode = getSkoposOverrideValue(overrides, 'project.repoMode') ?? inferredRepoMode;
  const archetypeSuggestion =
    getSkoposOverrideValue(overrides, 'project.archetype') ??
    detectArchetype(repoMode, dependencyNames);
  const findings = buildFindings({
    commands,
    docsRoots,
    docsHealth,
    instructionFiles,
    repoMode,
    packageJsonPaths,
    workspacePackageCount: workspacePackageJsonPaths.length,
    focusSubtree,
  });

  return {
    hasRootPackageJson: localRootPackageJson !== null,
    hasPnpmWorkspace,
    focusSubtree,
    ignoredPaths,
    docsRoots,
    docsHealth,
    appliedOverrides: buildAppliedOverrides(overrides),
    sourceDependencies: buildSourceDependencies({
      rootPackageJsonExists: localRootPackageJson !== null,
      hasPnpmWorkspace,
      workspaceConfigPath: relative(resolvedCwd, join(workspaceRoot, 'pnpm-workspace.yaml')) || '.',
      packageJsonPaths: packageJsonPaths.map((filePath) => relative(resolvedCwd, filePath) || '.'),
      docsRoot: docsHealth.root,
      docsStartHerePath:
        docsHealth.startHerePath ??
        (docsHealth.root ? joinRelativePath(docsHealth.root, '00-start-here.md') : undefined),
      docsHasStartHere: docsHealth.hasStartHere,
      markdownFilePaths: docsHealthData.markdownFilePaths,
      instructionFiles,
    }),
    instructionFiles,
    packageCount: packageJsonPaths.length,
    workspacePackageCount: workspacePackageJsonPaths.length,
    languages: detectLanguages(cwd, dependencyNames),
    frameworks: detectFrameworks(dependencyNames),
    commands,
    findings,
    confidence: calculateConfidence(
      localRootPackageJson !== null,
      docsRoots.length > 0,
      Object.keys(commands).length > 0,
    ),
    repoMode,
    archetypeSuggestion,
  };
};

const collectDependencyNames = async (
  rootPackageJsonPath: string,
  packageJsonPaths: string[],
): Promise<Set<string>> => {
  const names = new Set<string>();

  for (const filePath of [rootPackageJsonPath, ...packageJsonPaths]) {
    const packageJson = await readJsonFile<Record<string, unknown>>(filePath);
    if (!packageJson) {
      continue;
    }

    for (const field of ['dependencies', 'devDependencies', 'peerDependencies'] as const) {
      const value = packageJson[field];
      if (typeof value !== 'object' || value === null) {
        continue;
      }

      for (const dependencyName of Object.keys(value)) {
        names.add(dependencyName);
      }
    }
  }

  return names;
};

const collectDocsRoots = async ({
  cwd,
  workspaceRoot,
  configuredDocsRoot,
}: {
  cwd: string;
  workspaceRoot: string;
  configuredDocsRoot?: string;
}): Promise<string[]> => {
  const docsRoots = new Set<string>();

  for (const candidate of DOCS_ROOT_CANDIDATES) {
    if (await pathExists(join(cwd, candidate))) {
      docsRoots.add(candidate);
    }
  }

  if (configuredDocsRoot && (await pathExists(join(cwd, configuredDocsRoot)))) {
    docsRoots.add(configuredDocsRoot);
  }

  if (docsRoots.size === 0 && workspaceRoot !== cwd) {
    for (const candidate of DOCS_ROOT_CANDIDATES) {
      const inheritedPath = relative(cwd, join(workspaceRoot, candidate)) || '.';
      if (await pathExists(join(cwd, inheritedPath))) {
        docsRoots.add(inheritedPath);
      }
    }
  }

  return [...docsRoots];
};

const extractCommandMap = (rootPackageJson: Record<string, unknown> | null): SkoposCommandMap => {
  const scripts = rootPackageJson?.scripts;
  if (typeof scripts !== 'object' || scripts === null) {
    return {};
  }

  const typedScripts = scripts as Record<string, unknown>;
  const resolveScriptCommand = (candidates: string[]): string | undefined => {
    const scriptName = candidates.find((candidate) => typeof typedScripts[candidate] === 'string');
    return scriptName ? `pnpm ${scriptName}` : undefined;
  };

  return {
    dev: resolveScriptCommand(['dev']),
    build: resolveScriptCommand(['build']),
    test: resolveScriptCommand(['test']),
    typecheck: resolveScriptCommand(['typecheck', 'check-types']),
    lint: resolveScriptCommand(['lint']),
  };
};

const collectInstructionFiles = async ({
  cwd,
  workspaceRoot,
}: {
  cwd: string;
  workspaceRoot: string;
}): Promise<string[]> => {
  const candidates = ['AGENTS.md', 'CLAUDE.md', '.github/copilot-instructions.md'];
  const found = new Set<string>();

  for (const candidate of candidates) {
    if (await pathExists(join(cwd, candidate))) {
      found.add(candidate);
    }
  }

  if (workspaceRoot !== cwd) {
    for (const candidate of candidates) {
      const inheritedPath = relative(cwd, join(workspaceRoot, candidate)) || '.';
      if (await pathExists(join(cwd, inheritedPath))) {
        found.add(inheritedPath);
      }
    }
  }

  return [...found];
};

const detectRepoMode = (
  hasWorkspaceSignals: boolean,
  packageCount: number,
): SkoposRepoMode => {
  if (hasWorkspaceSignals) {
    return 'monorepo';
  }

  if (packageCount > 1) {
    return 'multi-package';
  }

  return 'single';
};

const detectArchetype = (
  repoMode: SkoposRepoMode,
  dependencyNames: Set<string>,
): SkoposProjectArchetype => {
  if (repoMode === 'monorepo') {
    return 'monorepo-platform';
  }

  if (dependencyNames.has('next') || dependencyNames.has('react')) {
    return 'saas';
  }

  if (
    dependencyNames.has('express') ||
    dependencyNames.has('fastify') ||
    dependencyNames.has('hono')
  ) {
    return 'api';
  }

  if (dependencyNames.has('tsup') || dependencyNames.has('vite')) {
    return 'library';
  }

  return 'internal-tool';
};

const detectLanguages = (cwd: string, dependencyNames: Set<string>): string[] => {
  const languages = new Set<string>();

  if (
    dependencyNames.has('typescript') ||
    dependencyNames.has('tsup') ||
    dependencyNames.has('tsx')
  ) {
    languages.add('typescript');
  }

  if (dependencyNames.has('react') || dependencyNames.has('next')) {
    languages.add('javascript');
  }

  return languages.size > 0 ? [...languages] : inferLanguagesFromFiles(cwd);
};

const inferLanguagesFromFiles = (cwd: string): string[] => {
  const inferred = new Set<string>();

  if (cwd.endsWith('.py')) {
    inferred.add('python');
  }

  return inferred.size > 0 ? [...inferred] : ['unknown'];
};

const detectFrameworks = (dependencyNames: Set<string>): string[] => {
  const frameworks = new Set<string>();

  for (const [dependencyName, frameworkName] of Object.entries(FRAMEWORK_MAP)) {
    if (dependencyNames.has(dependencyName)) {
      frameworks.add(frameworkName);
    }
  }

  return [...frameworks];
};

interface BuildFindingsInput {
  commands: SkoposCommandMap;
  docsRoots: string[];
  docsHealth: SkoposDocsHealthSummary;
  instructionFiles: string[];
  repoMode: SkoposRepoMode;
  packageJsonPaths: string[];
  workspacePackageCount: number;
  focusSubtree?: string;
}

const buildFindings = ({
  commands,
  docsRoots,
  docsHealth,
  instructionFiles,
  repoMode,
  packageJsonPaths,
  workspacePackageCount,
  focusSubtree,
}: BuildFindingsInput): string[] => {
  const findings: string[] = [];

  if (docsRoots.length === 0) {
    findings.push('No canonical docs root detected.');
  } else if (!docsHealth.hasStartHere) {
    findings.push('Canonical docs root exists, but no deterministic docs start-here router was detected.');
  }

  if (docsHealth.staleDocPaths.length > 0) {
    findings.push(`Stale docs detected: ${docsHealth.staleDocPaths.join(', ')}.`);
  }

  if (!instructionFiles.some((instructionFile) => basename(instructionFile) === 'AGENTS.md')) {
    findings.push('No canonical AGENTS.md instruction source detected.');
  }

  if (Object.keys(commands).length === 0) {
    findings.push('No canonical root command surface detected in package.json scripts.');
  }

  if (repoMode === 'monorepo' && !focusSubtree && workspacePackageCount < 3) {
    findings.push('Monorepo signals detected, but package discovery is still sparse.');
  }

  return findings;
};

const calculateConfidence = (
  hasRootPackageJson: boolean,
  hasDocsRoot: boolean,
  hasCommands: boolean,
): SkoposScanSummary['confidence'] => {
  const score = [hasRootPackageJson, hasDocsRoot, hasCommands].filter(Boolean).length;

  if (score >= 3) {
    return 'high';
  }

  if (score === 2) {
    return 'medium';
  }

  return 'low';
};

const hasWorkspaceField = (packageJson: Record<string, unknown> | null): boolean => {
  if (!packageJson) {
    return false;
  }

  return Array.isArray(packageJson.workspaces);
};

const asOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value : undefined;


const joinRelativePath = (left: string, right: string): string =>
  `${left.replace(/\/$/, '')}/${right.replace(/^\//, '')}`;

export const toRelativePath = (cwd: string, filePath: string): string =>
  relative(cwd, filePath) || '.';

interface CollectedDocsHealthData {
  summary: SkoposDocsHealthSummary;
  markdownFilePaths: string[];
}

const collectDocsHealthData = async (
  cwd: string,
  docsRoot?: string,
): Promise<CollectedDocsHealthData> => {
  if (!docsRoot) {
    return {
      summary: {
        hasStartHere: false,
        startHerePath: undefined,
        markdownFileCount: 0,
        freshnessTrackedCount: 0,
        staleDocPaths: [],
      },
      markdownFilePaths: [],
    };
  }

  const docsRootPath = join(cwd, docsRoot);
  const [startHerePath, markdownFilePaths] = await Promise.all([
    detectDocsStartHerePath(cwd, docsRoot),
    listFilesUnder(docsRootPath, ['.md', '.mdx']),
  ]);
  const staleDocPaths: string[] = [];
  let freshnessTrackedCount = 0;

  for (const filePath of markdownFilePaths) {
    const contents = await readTextFile(filePath);
    if (!contents) {
      continue;
    }

    const freshness = parseDocFreshness(contents);
    if (!freshness) {
      continue;
    }

    freshnessTrackedCount += 1;

    if (isDocFreshnessStale(freshness)) {
      staleDocPaths.push(relative(cwd, filePath) || '.');
    }
  }

  return {
    summary: {
      root: docsRoot,
      hasStartHere: Boolean(startHerePath),
      startHerePath,
      markdownFileCount: markdownFilePaths.length,
      freshnessTrackedCount,
      staleDocPaths,
    },
    markdownFilePaths: markdownFilePaths.map((filePath) => relative(cwd, filePath) || '.'),
  };
};

interface BuildSourceDependenciesInput {
  rootPackageJsonExists: boolean;
  hasPnpmWorkspace: boolean;
  workspaceConfigPath: string;
  packageJsonPaths: string[];
  docsRoot?: string;
  docsStartHerePath?: string;
  docsHasStartHere: boolean;
  markdownFilePaths: string[];
  instructionFiles: string[];
}

const buildSourceDependencies = ({
  rootPackageJsonExists,
  hasPnpmWorkspace,
  workspaceConfigPath,
  packageJsonPaths,
  docsRoot,
  docsStartHerePath,
  docsHasStartHere,
  markdownFilePaths,
  instructionFiles,
}: BuildSourceDependenciesInput): SkoposSourceDependency[] => {
  const dependencies = new Map<string, SkoposSourceDependency>();

  const register = (
    path: string,
    kind: SkoposSourceDependency['kind'],
    existsAtBuild: boolean,
  ): void => {
    dependencies.set(`${kind}:${path}`, {
      path,
      kind,
      existsAtBuild,
    });
  };

  register('package.json', 'root-package', rootPackageJsonExists);
  register(workspaceConfigPath, 'workspace-config', hasPnpmWorkspace);

  for (const instructionFile of instructionFiles) {
    register(instructionFile, 'instruction-source', true);
  }

  for (const packageJsonPath of packageJsonPaths) {
    register(packageJsonPath, 'package-manifest', true);

    const packageParentDir = dirname(packageJsonPath);
    if (packageParentDir !== '.' && packageParentDir.length > 0) {
      register(packageParentDir, 'package-directory', true);
    }
  }

  if (docsRoot && docsStartHerePath) {
    register(docsStartHerePath, 'docs-router', docsHasStartHere);
  }

  for (const markdownFilePath of markdownFilePaths) {
    register(markdownFilePath, 'docs-content', true);
  }

  return [...dependencies.values()].sort((left, right) => left.path.localeCompare(right.path));
};

const findNearestParentWorkspaceRoot = async (
  cwd: string,
): Promise<{ path: string; rootPackageJson: Record<string, unknown> | null } | null> => {
  let current = dirname(cwd);

  while (current !== dirname(current)) {
    const workspacePackageJsonPath = join(current, 'package.json');
    const [hasPnpmWorkspace, workspacePackageJson] = await Promise.all([
      pathExists(join(current, 'pnpm-workspace.yaml')),
      readJsonFile<Record<string, unknown>>(workspacePackageJsonPath),
    ]);

    if (hasPnpmWorkspace || hasWorkspaceField(workspacePackageJson)) {
      return {
        path: current,
        rootPackageJson: workspacePackageJson,
      };
    }

    current = dirname(current);
  }

  return null;
};

const detectDocsStartHerePath = async (
  cwd: string,
  docsRoot: string,
): Promise<string | undefined> => {
  for (const candidate of DOCS_ROUTER_RELATIVE_CANDIDATES) {
    const candidatePath = join(docsRoot, candidate);
    if (await pathExists(join(cwd, candidatePath))) {
      return candidatePath;
    }
  }

  return undefined;
};

interface ParsedDocFreshness {
  status?: string;
  reviewedAt?: string;
  reviewCycleDays?: number;
}

const parseDocFreshness = (contents: string): ParsedDocFreshness | null => {
  const frontmatter = extractFrontmatter(contents);
  if (!frontmatter) {
    return null;
  }

  const status = frontmatter.status?.trim().toLowerCase();
  const reviewedAt = frontmatter.reviewedAt?.trim();
  const reviewCycleDays = frontmatter.reviewCycleDays
    ? Number(frontmatter.reviewCycleDays)
    : undefined;

  if (!status && !reviewedAt && !Number.isFinite(reviewCycleDays)) {
    return null;
  }

  return {
    status,
    reviewedAt,
    reviewCycleDays: Number.isFinite(reviewCycleDays) ? reviewCycleDays : undefined,
  };
};

const extractFrontmatter = (contents: string): Record<string, string> | null => {
  if (!contents.startsWith('---\n')) {
    return null;
  }

  const closingMarkerIndex = contents.indexOf('\n---\n', 4);
  if (closingMarkerIndex === -1) {
    return null;
  }

  const frontmatterBlock = contents.slice(4, closingMarkerIndex);
  const values: Record<string, string> = {};

  for (const line of frontmatterBlock.split('\n')) {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (!key) {
      continue;
    }

    values[key] = value;
  }

  return values;
};

const isDocFreshnessStale = ({
  status,
  reviewedAt,
  reviewCycleDays,
}: ParsedDocFreshness): boolean => {
  if (status === 'stale') {
    return true;
  }

  if (!reviewedAt || !reviewCycleDays || reviewCycleDays <= 0) {
    return false;
  }

  const reviewedAtValue = Date.parse(reviewedAt);
  if (!Number.isFinite(reviewedAtValue)) {
    return false;
  }

  const expiresAt = reviewedAtValue + reviewCycleDays * 24 * 60 * 60 * 1000;
  return expiresAt < Date.now();
};
