import { access, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import type {
  SkoposPolicyPackManifest,
  SkoposResolvedGuard,
  SkoposResolvedGuardsArtifact,
  SkoposResolvedPolicyArtifact,
} from '@skopos/model';

import {
  listSkoposPolicyPacksRuntime,
  resolveSkoposPolicyRuntime,
} from '../policies/policies.service.js';

export const RESOLVED_GUARDS_ARTIFACT_PATH = '.skopos/index/guards.json';

export interface ResolveSkoposGuardsRuntimeOptions {
  cwd: string;
  actor?: string;
  policy?: SkoposResolvedPolicyArtifact;
  dryRun?: boolean;
}

export interface ResolveSkoposGuardsRuntimeResult {
  artifact: SkoposResolvedGuardsArtifact;
  artifactPath: string;
  artifactWrite: 'written' | 'dry-run';
  actorId?: string;
}

interface PackageJsonShape {
  packageManager?: string;
  scripts?: Record<string, string>;
}

export const resolveSkoposGuardsRuntime = async ({
  cwd,
  actor,
  policy: providedPolicy,
  dryRun = false,
}: ResolveSkoposGuardsRuntimeOptions): Promise<ResolveSkoposGuardsRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const artifactPath = join(workspaceRoot, RESOLVED_GUARDS_ARTIFACT_PATH);
  const [packageJson, packs] = await Promise.all([
    readPackageJson(workspaceRoot),
    listSkoposPolicyPacksRuntime({ cwd: workspaceRoot }),
  ]);
  const resolvedPolicy =
    providedPolicy ??
    (await resolveSkoposPolicyRuntime({ cwd: workspaceRoot, dryRun }))?.policy;
  const acceptedPackIds = new Set(resolvedPolicy?.acceptedPacks.map((pack) => pack.packId) ?? []);
  const activePacks = resolvedPolicy
    ? packs.filter((pack) => acceptedPackIds.has(pack.packId))
    : [];
  const detectedScripts = Object.keys(packageJson?.scripts ?? {}).sort((left, right) =>
    left.localeCompare(right),
  );
  const packageManager = detectPackageManager(packageJson);
  const guards = activePacks.flatMap((pack) =>
    buildPackGuards({
      pack,
      packageManager,
      scripts: packageJson?.scripts ?? {},
    }),
  );
  const missingRequired = guards.filter(
    (guard) => guard.strength === 'required' && guard.status === 'missing',
  );
  const missingRecommended = guards.filter(
    (guard) => guard.strength === 'recommended' && guard.status === 'missing',
  );
  const now = resolvedPolicy?.updatedAt ?? '1970-01-01T00:00:00.000Z';
  const artifact: SkoposResolvedGuardsArtifact = {
    schemaVersion: 1,
    id: 'skopos.resolved-guards',
    type: 'resolved-guards',
    status: 'generated',
    authority: 'generated',
    generatedAt: now,
    updatedAt: now,
    summary: `Resolved ${guards.length} Guard${guards.length === 1 ? '' : 's'} from ${activePacks.length} policy pack${activePacks.length === 1 ? '' : 's'}.`,
    workspaceRoot,
    packageManager,
    detectedScripts,
    guards,
    missingRecommended,
    missingRequired,
  };

  if (!dryRun) {
    await mkdir(dirname(artifactPath), { recursive: true });
    await writeFile(`${artifactPath}.tmp`, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
    await rename(`${artifactPath}.tmp`, artifactPath);
  }

  return {
    artifact,
    artifactPath: RESOLVED_GUARDS_ARTIFACT_PATH,
    artifactWrite: dryRun ? 'dry-run' : 'written',
    actorId: actor,
  };
};

const buildPackGuards = ({
  pack,
  packageManager,
  scripts,
}: {
  pack: SkoposPolicyPackManifest;
  packageManager: string;
  scripts: Record<string, string>;
}): SkoposResolvedGuard[] => [
  ...(pack.guards?.required ?? []).map((label) =>
    resolveManifestGuard({
      pack,
      packId: pack.packId,
      label,
      strength: 'required',
      severity: 'must',
      packageManager,
      scripts,
    }),
  ),
  ...(pack.guards?.recommended ?? []).map((label) =>
    resolveManifestGuard({
      pack,
      packId: pack.packId,
      label,
      strength: 'recommended',
      severity: 'should',
      packageManager,
      scripts,
    }),
  ),
];

const resolveManifestGuard = ({
  pack,
  packId,
  label,
  strength,
  severity,
  packageManager,
  scripts,
}: {
  pack: SkoposPolicyPackManifest;
  packId: string;
  label: string;
  strength: 'required' | 'recommended';
  severity: 'must' | 'should';
  packageManager: string;
  scripts: Record<string, string>;
}): SkoposResolvedGuard => {
  const native = resolveNativeGuard({ pack, label, strength, severity });
  if (native) {
    return native;
  }

  const candidateNames = commandCandidates(label);
  const matchedScript = candidateNames.find((scriptName) => scripts[scriptName]);
  const normalizedLabel = normalizeGuardLabel(label);

  return {
    id: `${packId}.guard.${normalizedLabel}`,
    packId,
    label,
    kind: 'project-action',
    strength,
    status: matchedScript ? 'available' : 'missing',
    severity,
    summary: matchedScript
      ? `Project has a ${matchedScript} script for ${label}.`
      : `Project does not expose a script for ${label}.`,
    command: matchedScript ? `${packageManager} ${matchedScript}` : undefined,
    matchedScript,
    missingReason: matchedScript
      ? undefined
      : `Add or document a ${label} command if this proof matters for the project.`,
  };
};

const resolveNativeGuard = ({
  pack,
  label,
  strength,
  severity,
}: {
  pack: SkoposPolicyPackManifest;
  label: string;
  strength: 'required' | 'recommended';
  severity: 'must' | 'should';
}): SkoposResolvedGuard | undefined => {
  if (pack.packId !== 'clean-code.maintainability') {
    return undefined;
  }

  const normalized = normalizeGuardLabel(label);
  const summaries: Record<string, string> = {
    'large-file-scan': 'Flag touched source files that may be doing too many jobs.',
    'long-function-scan': 'Flag functions that may be hard to read or test.',
    'vague-name-scan': 'Look for names like misc, helpers, manager, thing, or data when a specific name is possible.',
    'helper-bucket-scan': 'Look for shared helpers that appear unrelated or speculative.',
    'comment-hygiene-scan': 'Look for stale TODOs or comments that repeat obvious code.',
    'boundary-unknown-scan': 'Look for repeated unknown/data-shape checks inside core logic.',
    'focused-behavior-proof': 'When behavior changes, the agent must run or add focused proof and record skipped-proof reasons.',
  };
  const summary = summaries[normalized];

  if (!summary) {
    return undefined;
  }

  return {
    id: `${pack.packId}.guard.${normalized}`,
    packId: pack.packId,
    label,
    kind: normalized === 'focused-behavior-proof' ? 'agent-observation' : 'skopos-native',
    strength,
    status: 'manual',
    severity,
    summary,
  };
};

const commandCandidates = (label: string): string[] => {
  const lower = label.toLowerCase();

  if (lower.includes('typecheck') || lower.includes('type check')) {
    return ['typecheck', 'check-types', 'tsc'];
  }

  if (lower.includes('format')) {
    return ['format:check', 'format', 'prettier:check'];
  }

  if (lower.includes('lint')) {
    return ['lint', 'eslint'];
  }

  if (lower.includes('test')) {
    return ['test', 'test:unit'];
  }

  if (lower.includes('build')) {
    return ['build'];
  }

  return [normalizeGuardLabel(label)];
};

const normalizeGuardLabel = (label: string): string =>
  label
    .toLowerCase()
    .replace(/^pnpm\s+/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const detectPackageManager = (packageJson: PackageJsonShape | undefined): string => {
  const packageManager = packageJson?.packageManager;

  if (packageManager?.startsWith('pnpm')) {
    return 'pnpm';
  }

  if (packageManager?.startsWith('yarn')) {
    return 'yarn';
  }

  if (packageManager?.startsWith('bun')) {
    return 'bun';
  }

  return 'npm run';
};

const readPackageJson = async (workspaceRoot: string): Promise<PackageJsonShape | undefined> =>
  readJsonIfExists<PackageJsonShape>(join(workspaceRoot, 'package.json'));

const readJsonIfExists = async <T>(path: string): Promise<T | undefined> => {
  try {
    await access(path);
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch {
    return undefined;
  }
};
