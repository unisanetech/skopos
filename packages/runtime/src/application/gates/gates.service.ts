import { access, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import type {
  SkoposPolicyPackManifest,
  SkoposResolvedGate,
  SkoposResolvedGatesArtifact,
  SkoposResolvedPolicyArtifact,
} from '@skopos/model';

import { listSkoposPolicyPacksRuntime } from '../policies/policies.service.js';

export const RESOLVED_GATES_ARTIFACT_PATH = '.skopos/gates/resolved.json';
const RESOLVED_POLICY_ARTIFACT_PATH = '.skopos/policies/resolved.json';

export interface ResolveSkoposGatesRuntimeOptions {
  cwd: string;
  actor?: string;
  dryRun?: boolean;
}

export interface ResolveSkoposGatesRuntimeResult {
  artifact: SkoposResolvedGatesArtifact;
  artifactPath: string;
  artifactWrite: 'written' | 'dry-run';
  actorId?: string;
}

interface PackageJsonShape {
  packageManager?: string;
  scripts?: Record<string, string>;
}

export const resolveSkoposGatesRuntime = async ({
  cwd,
  actor,
  dryRun = false,
}: ResolveSkoposGatesRuntimeOptions): Promise<ResolveSkoposGatesRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const artifactPath = join(workspaceRoot, RESOLVED_GATES_ARTIFACT_PATH);
  const [packageJson, packs, resolvedPolicy] = await Promise.all([
    readPackageJson(workspaceRoot),
    listSkoposPolicyPacksRuntime({ cwd: workspaceRoot }),
    readJsonIfExists<SkoposResolvedPolicyArtifact>(
      join(workspaceRoot, RESOLVED_POLICY_ARTIFACT_PATH),
    ),
  ]);
  const acceptedPackIds = new Set(resolvedPolicy?.acceptedPacks.map((pack) => pack.packId) ?? []);
  const activePacks = acceptedPackIds.size > 0
    ? packs.filter((pack) => acceptedPackIds.has(pack.packId))
    : packs;
  const detectedScripts = Object.keys(packageJson?.scripts ?? {}).sort((left, right) =>
    left.localeCompare(right),
  );
  const packageManager = detectPackageManager(packageJson);
  const gates = activePacks.flatMap((pack) =>
    buildPackGates({
      pack,
      packageManager,
      scripts: packageJson?.scripts ?? {},
    }),
  );
  const missingRequired = gates.filter(
    (gate) => gate.requiredness === 'required' && gate.status === 'missing',
  );
  const missingRecommended = gates.filter(
    (gate) => gate.requiredness === 'recommended' && gate.status === 'missing',
  );
  const now = new Date().toISOString();
  const artifact: SkoposResolvedGatesArtifact = {
    schemaVersion: 1,
    id: 'skopos.resolved-gates',
    type: 'resolved-gates',
    status: 'generated',
    authority: 'generated',
    generatedAt: now,
    updatedAt: now,
    summary: `Resolved ${gates.length} gate${gates.length === 1 ? '' : 's'} from ${activePacks.length} policy pack${activePacks.length === 1 ? '' : 's'}.`,
    workspaceRoot,
    packageManager,
    detectedScripts,
    gates,
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
    artifactPath: RESOLVED_GATES_ARTIFACT_PATH,
    artifactWrite: dryRun ? 'dry-run' : 'written',
    actorId: actor,
  };
};

const buildPackGates = ({
  pack,
  packageManager,
  scripts,
}: {
  pack: SkoposPolicyPackManifest;
  packageManager: string;
  scripts: Record<string, string>;
}): SkoposResolvedGate[] => [
  ...(pack.gates?.required ?? []).map((label) =>
    resolveManifestGate({
      pack,
      packId: pack.packId,
      label,
      requiredness: 'required',
      severity: 'must',
      packageManager,
      scripts,
    }),
  ),
  ...(pack.gates?.recommended ?? []).map((label) =>
    resolveManifestGate({
      pack,
      packId: pack.packId,
      label,
      requiredness: 'recommended',
      severity: 'should',
      packageManager,
      scripts,
    }),
  ),
];

const resolveManifestGate = ({
  pack,
  packId,
  label,
  requiredness,
  severity,
  packageManager,
  scripts,
}: {
  pack: SkoposPolicyPackManifest;
  packId: string;
  label: string;
  requiredness: 'required' | 'recommended';
  severity: 'must' | 'should';
  packageManager: string;
  scripts: Record<string, string>;
}): SkoposResolvedGate => {
  const native = resolveNativeGate({ pack, label, requiredness, severity });
  if (native) {
    return native;
  }

  const candidateNames = commandCandidates(label);
  const matchedScript = candidateNames.find((scriptName) => scripts[scriptName]);
  const normalizedLabel = normalizeGateLabel(label);

  return {
    id: `${packId}.gate.${normalizedLabel}`,
    packId,
    label,
    kind: 'project-command',
    requiredness,
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

const resolveNativeGate = ({
  pack,
  label,
  requiredness,
  severity,
}: {
  pack: SkoposPolicyPackManifest;
  label: string;
  requiredness: 'required' | 'recommended';
  severity: 'must' | 'should';
}): SkoposResolvedGate | undefined => {
  if (pack.packId !== 'clean-code.maintainability') {
    return undefined;
  }

  const normalized = normalizeGateLabel(label);
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
    id: `${pack.packId}.gate.${normalized}`,
    packId: pack.packId,
    label,
    kind: normalized === 'focused-behavior-proof' ? 'agent-proof' : 'skopos-native',
    requiredness,
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

  return [normalizeGateLabel(label)];
};

const normalizeGateLabel = (label: string): string =>
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
