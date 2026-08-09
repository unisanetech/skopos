import { createHash, randomUUID } from 'node:crypto';
import {
  lstat,
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';

import { loadSkoposConfig } from '@skopos/config';
import type { SkoposStoragePolicyConfig } from '@skopos/model';

export type SkoposStorageClass =
  | 'temporary'
  | 'cache'
  | 'diagnostic'
  | 'task-evidence'
  | 'release-evidence'
  | 'user-pinned';

export const SKOPOS_STORAGE_PRIVACY_WARNING =
  '.skopos may contain private project source, prompts, screenshots, traces, generated code, and provider receipts. Do not upload or share it wholesale.';

export const DEFAULT_SKOPOS_STORAGE_POLICY: SkoposStoragePolicyConfig = {
  softLimitMb: 512,
  hardLimitMb: 1024,
  retentionDays: {
    temporary: 1,
    cache: 14,
    diagnostic: 30,
    taskEvidence: 90,
    releaseEvidence: 365,
  },
};

export interface SkoposStorageUnit {
  path: string;
  storageClass: SkoposStorageClass;
  baseClass: Exclude<SkoposStorageClass, 'user-pinned'>;
  bytes: number;
  lastModifiedAt: string;
  ageDays: number;
  protected: boolean;
  protectionReasons: string[];
  eligible: boolean;
  eligibilityReasons: string[];
}

export interface SkoposStorageClassSummary {
  storageClass: SkoposStorageClass;
  unitCount: number;
  bytes: number;
  protectedUnitCount: number;
  eligibleUnitCount: number;
}

export interface SkoposStorageStatus {
  schemaVersion: 1;
  workspaceRoot: string;
  storageRoot: string;
  privacyWarning: string;
  policy: SkoposStoragePolicyConfig;
  totalBytes: number;
  totalMegabytes: number;
  limitState: 'within-soft-limit' | 'above-soft-limit' | 'above-hard-limit';
  classSummaries: SkoposStorageClassSummary[];
  units: SkoposStorageUnit[];
  protectedUnitCount: number;
  eligibleUnitCount: number;
}

export interface SkoposStoragePin {
  id: string;
  path: string;
  actorId: string;
  reason: string;
  createdAt: string;
}

export interface SkoposStoragePruneResult {
  schemaVersion: 1;
  workspaceRoot: string;
  mode: 'dry-run' | 'apply';
  privacyWarning: string;
  policy: SkoposStoragePolicyConfig;
  plannedUnitCount: number;
  plannedBytes: number;
  deletedUnitCount: number;
  deletedBytes: number;
  failedUnitCount: number;
  protectedUnitCount: number;
  units: SkoposStorageUnit[];
  receiptPath?: string;
}

interface InternalStorageUnit extends SkoposStorageUnit {
  physicalPaths: string[];
}

interface StoragePinsArtifact {
  schemaVersion: 1;
  type: 'storage-pins';
  authority: 'generated';
  updatedAt: string;
  pins: SkoposStoragePin[];
}

interface StorageUnitSpec {
  relativeRoot: string;
  storageClass: Exclude<SkoposStorageClass, 'user-pinned'>;
  depth: number;
}

const STORAGE_ROOT = '.skopos';
const PINS_PATH = '.skopos/storage/pins.json';
const RECEIPTS_ROOT = '.skopos/storage/receipts';
const DAY_MS = 24 * 60 * 60 * 1000;
const MIB = 1024 * 1024;

const UNIT_SPECS: StorageUnitSpec[] = [
  { relativeRoot: '.skopos/locks', storageClass: 'temporary', depth: 1 },
  { relativeRoot: '.skopos/cache', storageClass: 'cache', depth: 1 },
  { relativeRoot: '.skopos/index', storageClass: 'cache', depth: 1 },
  { relativeRoot: '.skopos/graph', storageClass: 'cache', depth: 1 },
  { relativeRoot: '.skopos/ui', storageClass: 'cache', depth: 1 },
  { relativeRoot: '.skopos/evaluations', storageClass: 'diagnostic', depth: 1 },
  { relativeRoot: '.skopos/sessions', storageClass: 'diagnostic', depth: 2 },
  { relativeRoot: '.skopos/handoffs', storageClass: 'diagnostic', depth: 2 },
  { relativeRoot: '.skopos/adoption', storageClass: 'diagnostic', depth: 1 },
  { relativeRoot: '.skopos/tasks', storageClass: 'task-evidence', depth: 2 },
  { relativeRoot: '.skopos/evidence', storageClass: 'release-evidence', depth: 2 },
];

const CLASS_ORDER: SkoposStorageClass[] = [
  'temporary',
  'cache',
  'diagnostic',
  'task-evidence',
  'release-evidence',
  'user-pinned',
];

export const buildSkoposStoragePolicyRuntime = async ({
  cwd = process.cwd(),
}: {
  cwd?: string;
} = {}): Promise<{
  schemaVersion: 1;
  workspaceRoot: string;
  privacyWarning: string;
  policy: SkoposStoragePolicyConfig;
}> => {
  const workspaceRoot = resolve(cwd);
  return {
    schemaVersion: 1,
    workspaceRoot,
    privacyWarning: SKOPOS_STORAGE_PRIVACY_WARNING,
    policy: await loadStoragePolicy(workspaceRoot),
  };
};

export const buildSkoposStorageStatusRuntime = async ({
  cwd = process.cwd(),
}: {
  cwd?: string;
} = {}): Promise<SkoposStorageStatus> => analyzeStorage(resolve(cwd));

export const buildSkoposStorageInspectRuntime = async ({
  cwd = process.cwd(),
  limit = 20,
}: {
  cwd?: string;
  limit?: number;
} = {}): Promise<SkoposStorageStatus & { largest: SkoposStorageUnit[] }> => {
  if (!Number.isInteger(limit) || limit < 1 || limit > 200) {
    throw new Error('Storage inspection limit must be an integer from 1 to 200.');
  }
  const status = await analyzeStorage(resolve(cwd));
  return {
    ...status,
    largest: [...status.units].sort((left, right) => right.bytes - left.bytes).slice(0, limit),
  };
};

export const buildSkoposStoragePruneRuntime = async ({
  cwd = process.cwd(),
  apply = false,
  actor,
}: {
  cwd?: string;
  apply?: boolean;
  actor?: string;
} = {}): Promise<SkoposStoragePruneResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = apply ? requireText(actor, '--actor') : undefined;
  const status = await analyzeStorage(workspaceRoot);
  const internalUnits = await analyzeStorageUnits(workspaceRoot, status.policy);
  const selected = internalUnits.filter((unit) => unit.eligible && !unit.protected);
  const plannedBytes = selected.reduce((total, unit) => total + unit.bytes, 0);

  if (!apply) {
    return {
      schemaVersion: 1,
      workspaceRoot,
      mode: 'dry-run',
      privacyWarning: SKOPOS_STORAGE_PRIVACY_WARNING,
      policy: status.policy,
      plannedUnitCount: selected.length,
      plannedBytes,
      deletedUnitCount: 0,
      deletedBytes: 0,
      failedUnitCount: 0,
      protectedUnitCount: status.protectedUnitCount,
      units: selected.map(toPublicUnit),
    };
  }

  const outcomes: Array<{
    path: string;
    storageClass: SkoposStorageClass;
    bytes: number;
    lastModifiedAt: string;
    reasons: string[];
    outcome: 'deleted' | 'failed';
    errorCode?: string;
  }> = [];
  let deletedUnitCount = 0;
  let deletedBytes = 0;

  for (const unit of selected) {
    try {
      for (const physicalPath of unit.physicalPaths) {
        await rm(join(workspaceRoot, physicalPath), { recursive: true, force: true });
      }
      deletedUnitCount += 1;
      deletedBytes += unit.bytes;
      outcomes.push({
        path: unit.path,
        storageClass: unit.storageClass,
        bytes: unit.bytes,
        lastModifiedAt: unit.lastModifiedAt,
        reasons: unit.eligibilityReasons,
        outcome: 'deleted',
      });
    } catch (error) {
      outcomes.push({
        path: unit.path,
        storageClass: unit.storageClass,
        bytes: unit.bytes,
        lastModifiedAt: unit.lastModifiedAt,
        reasons: unit.eligibilityReasons,
        outcome: 'failed',
        errorCode: isNodeError(error) ? error.code : 'UNKNOWN',
      });
    }
  }

  const now = new Date().toISOString();
  const receiptId = `storage-prune-${formatTimestamp(now)}-${digestText(
    `${now}:${selected.map((unit) => unit.path).join('|')}`,
  ).slice(0, 10)}`;
  const receiptPath = `${RECEIPTS_ROOT}/${receiptId}.json`;
  await writeJsonAtomic(join(workspaceRoot, receiptPath), {
    schemaVersion: 1,
    id: receiptId,
    type: 'storage-prune-receipt',
    authority: 'generated',
    createdAt: now,
    actorId,
    policy: status.policy,
    summary: {
      plannedUnitCount: selected.length,
      plannedBytes,
      deletedUnitCount,
      deletedBytes,
      failedUnitCount: outcomes.filter((outcome) => outcome.outcome === 'failed').length,
    },
    outcomes,
  });

  return {
    schemaVersion: 1,
    workspaceRoot,
    mode: 'apply',
    privacyWarning: SKOPOS_STORAGE_PRIVACY_WARNING,
    policy: status.policy,
    plannedUnitCount: selected.length,
    plannedBytes,
    deletedUnitCount,
    deletedBytes,
    failedUnitCount: outcomes.filter((outcome) => outcome.outcome === 'failed').length,
    protectedUnitCount: status.protectedUnitCount,
    units: selected.map(toPublicUnit),
    receiptPath,
  };
};

export const buildSkoposStoragePinRuntime = async ({
  cwd = process.cwd(),
  path,
  actor,
  reason,
}: {
  cwd?: string;
  path: string;
  actor: string;
  reason: string;
}): Promise<{ schemaVersion: 1; workspaceRoot: string; pin: SkoposStoragePin; reused: boolean }> => {
  const workspaceRoot = resolve(cwd);
  const normalizedPath = normalizeStorageTarget(workspaceRoot, path);
  const actorId = requireText(actor, '--actor');
  const pinReason = requireText(reason, '--reason');
  await lstat(join(workspaceRoot, normalizedPath)).catch(() => {
    throw new Error(`Cannot pin missing Skopos storage path: ${normalizedPath}`);
  });
  const artifact = await loadPins(workspaceRoot);
  const existing = artifact.pins.find((pin) => pin.path === normalizedPath);
  if (existing) {
    return { schemaVersion: 1, workspaceRoot, pin: existing, reused: true };
  }
  const pin: SkoposStoragePin = {
    id: `storage-pin-${digestText(normalizedPath).slice(0, 12)}`,
    path: normalizedPath,
    actorId,
    reason: pinReason,
    createdAt: new Date().toISOString(),
  };
  artifact.pins.push(pin);
  artifact.pins.sort((left, right) => left.path.localeCompare(right.path));
  artifact.updatedAt = new Date().toISOString();
  await writeJsonAtomic(join(workspaceRoot, PINS_PATH), artifact);
  return { schemaVersion: 1, workspaceRoot, pin, reused: false };
};

export const buildSkoposStorageUnpinRuntime = async ({
  cwd = process.cwd(),
  pin: pinInput,
  actor,
}: {
  cwd?: string;
  pin: string;
  actor: string;
}): Promise<{
  schemaVersion: 1;
  workspaceRoot: string;
  removed: SkoposStoragePin;
  actorId: string;
}> => {
  const workspaceRoot = resolve(cwd);
  const actorId = requireText(actor, '--actor');
  const artifact = await loadPins(workspaceRoot);
  const byId = artifact.pins.find((pin) => pin.id === pinInput);
  const normalizedPath = byId ? undefined : normalizeStorageTarget(workspaceRoot, pinInput);
  const removed = byId ?? artifact.pins.find((pin) => pin.path === normalizedPath);
  if (!removed) throw new Error(`Unknown Skopos storage pin: ${pinInput}`);
  artifact.pins = artifact.pins.filter((pin) => pin.id !== removed.id);
  artifact.updatedAt = new Date().toISOString();
  await writeJsonAtomic(join(workspaceRoot, PINS_PATH), artifact);
  return {
    schemaVersion: 1,
    workspaceRoot,
    removed,
    actorId,
  };
};

const analyzeStorage = async (workspaceRoot: string): Promise<SkoposStorageStatus> => {
  const policy = await loadStoragePolicy(workspaceRoot);
  const internalUnits = await analyzeStorageUnits(workspaceRoot, policy);
  const units = internalUnits.map(toPublicUnit);
  const totalBytes = units.reduce((total, unit) => total + unit.bytes, 0);
  const softLimitBytes = policy.softLimitMb * MIB;
  const hardLimitBytes = policy.hardLimitMb * MIB;
  const limitState =
    totalBytes > hardLimitBytes
      ? 'above-hard-limit'
      : totalBytes > softLimitBytes
        ? 'above-soft-limit'
        : 'within-soft-limit';

  return {
    schemaVersion: 1,
    workspaceRoot,
    storageRoot: join(workspaceRoot, STORAGE_ROOT),
    privacyWarning: SKOPOS_STORAGE_PRIVACY_WARNING,
    policy,
    totalBytes,
    totalMegabytes: round(totalBytes / MIB),
    limitState,
    classSummaries: CLASS_ORDER.map((storageClass) => {
      const matching = units.filter((unit) => unit.storageClass === storageClass);
      return {
        storageClass,
        unitCount: matching.length,
        bytes: matching.reduce((total, unit) => total + unit.bytes, 0),
        protectedUnitCount: matching.filter((unit) => unit.protected).length,
        eligibleUnitCount: matching.filter((unit) => unit.eligible).length,
      };
    }),
    units,
    protectedUnitCount: units.filter((unit) => unit.protected).length,
    eligibleUnitCount: units.filter((unit) => unit.eligible).length,
  };
};

const analyzeStorageUnits = async (
  workspaceRoot: string,
  policy: SkoposStoragePolicyConfig,
): Promise<InternalStorageUnit[]> => {
  const rawUnits = [
    ...(await collectSpecifiedUnits(workspaceRoot)),
    ...(await collectRunUnits(workspaceRoot)),
  ];
  const pins = (await loadPins(workspaceRoot)).pins;
  const references = await collectProtectedReferences(workspaceRoot);
  const now = Date.now();

  const units: InternalStorageUnit[] = [];
  for (const rawUnit of rawUnits) {
    const metrics = await measurePaths(
      rawUnit.physicalPaths.map((path) => join(workspaceRoot, path)),
    );
    const matchingPins = pins.filter((pin) => pathsIntersect(pin.path, rawUnit.path));
    const protectionReasons = [
      ...matchingPins.map((pin) => `user pin ${pin.id}: ${pin.reason}`),
      ...[...references.entries()]
        .filter(([path]) => pathsIntersect(path, rawUnit.path))
        .flatMap(([, reasons]) => reasons),
    ];
    const pinned = matchingPins.length > 0;
    const ageDays = Math.max(0, (now - metrics.modifiedAtMs) / DAY_MS);
    const retentionDays = retentionDaysFor(rawUnit.baseClass, policy);
    const expired = ageDays >= retentionDays;
    units.push({
      ...rawUnit,
      storageClass: pinned ? 'user-pinned' : rawUnit.baseClass,
      bytes: metrics.bytes,
      lastModifiedAt: new Date(metrics.modifiedAtMs).toISOString(),
      ageDays: round(ageDays),
      protected: protectionReasons.length > 0,
      protectionReasons: [...new Set(protectionReasons)].sort(),
      eligible: expired && protectionReasons.length === 0,
      eligibilityReasons:
        expired && protectionReasons.length === 0
          ? [`retention exceeded: ${round(ageDays)} days >= ${retentionDays} days`]
          : [],
    });
  }

  applySizePressure(units, policy);
  return units.sort((left, right) => left.path.localeCompare(right.path));
};

const collectSpecifiedUnits = async (workspaceRoot: string) => {
  const units: Array<{
    path: string;
    baseClass: Exclude<SkoposStorageClass, 'user-pinned'>;
    physicalPaths: string[];
  }> = [];
  for (const spec of UNIT_SPECS) {
    const paths = await collectAtDepth(
      workspaceRoot,
      join(workspaceRoot, spec.relativeRoot),
      spec.depth,
    );
    for (const path of paths) {
      units.push({ path, baseClass: spec.storageClass, physicalPaths: [path] });
    }
  }
  return units;
};

const collectRunUnits = async (workspaceRoot: string) => {
  const relativeRoot = '.skopos/runs';
  const absoluteRoot = join(workspaceRoot, relativeRoot);
  const entries = await safeReadDir(absoluteRoot);
  const groups = new Map<string, string[]>();
  for (const entry of entries) {
    const key = entry.name.startsWith('run-')
      ? entry.name.replace(/\.json$/u, '')
      : entry.name;
    const path = `${relativeRoot}/${entry.name}`;
    groups.set(key, [...(groups.get(key) ?? []), path]);
  }
  return [...groups.entries()].map(([key, physicalPaths]) => ({
    path: `${relativeRoot}/${key}`,
    baseClass: 'task-evidence' as const,
    physicalPaths: physicalPaths.sort(),
  }));
};

const collectAtDepth = async (
  workspaceRoot: string,
  absoluteRoot: string,
  depth: number,
): Promise<string[]> => {
  const entries = await safeReadDir(absoluteRoot);
  const paths: string[] = [];
  for (const entry of entries) {
    const absolutePath = join(absoluteRoot, entry.name);
    const relativePath = normalizePath(relative(workspaceRoot, absolutePath));
    if (depth <= 1 || !entry.isDirectory()) {
      paths.push(relativePath);
      continue;
    }
    const nested = await collectAtDepth(
      workspaceRoot,
      absolutePath,
      depth - 1,
    );
    if (nested.length === 0) paths.push(relativePath);
    else paths.push(...nested);
  }
  return paths;
};

const collectProtectedReferences = async (
  workspaceRoot: string,
): Promise<Map<string, string[]>> => {
  const references = new Map<string, string[]>();
  const add = (path: string, reason: string) => {
    const normalized = normalizeReferencedPath(path);
    if (!normalized) return;
    references.set(normalized, [...new Set([...(references.get(normalized) ?? []), reason])]);
  };

  const taskFiles = await findFiles(join(workspaceRoot, '.skopos/tasks'), (path) =>
    path.endsWith('/task.json'),
  );
  for (const taskFile of taskFiles) {
    try {
      const task = JSON.parse(await readFile(taskFile, 'utf8')) as {
        id?: string;
        state?: string;
        proofSubject?: { kind?: string };
      };
      const isOpen = task.state !== 'complete';
      const isRelease = task.proofSubject?.kind === 'project-integration';
      if (!isOpen && !isRelease) continue;
      const taskDirectory = dirname(taskFile);
      const reason = isOpen
        ? `open Task ${task.id ?? relative(workspaceRoot, taskDirectory)}`
        : `project-integration baseline ${task.id ?? relative(workspaceRoot, taskDirectory)}`;
      add(relative(workspaceRoot, taskDirectory), reason);
      const files = await findFiles(taskDirectory, (path) => /\.(?:json|jsonl)$/u.test(path));
      for (const file of files) {
        await collectReferencesFromText(await readFile(file, 'utf8'), reason, add);
      }
    } catch {
      add(
        relative(workspaceRoot, dirname(taskFile)),
        `unreadable Task state ${normalizePath(relative(workspaceRoot, taskFile))}`,
      );
    }
  }

  const runFiles = await findFiles(join(workspaceRoot, '.skopos/runs'), (path) =>
    /\/run-[^/]+\.json$/u.test(path),
  );
  for (const runFile of runFiles) {
    try {
      const run = JSON.parse(await readFile(runFile, 'utf8')) as { runStatus?: string; id?: string };
      if (run.runStatus === 'running') {
        const id = run.id ?? runFile.split('/').at(-1)?.replace(/\.json$/u, '');
        if (id) add(`.skopos/runs/${id}`, `active Action run ${id}`);
      }
    } catch {
      const id = runFile.split('/').at(-1)?.replace(/\.json$/u, '');
      if (id) add(`.skopos/runs/${id}`, `unreadable Action run state ${id}`);
    }
  }

  const trackedFiles = await findFiles(join(workspaceRoot, 'docs'), (path) =>
    /\.(?:md|json|yaml|yml)$/u.test(path),
  );
  for (const trackedFile of trackedFiles) {
    const text = await readFile(trackedFile, 'utf8').catch(() => '');
    if (!text.includes('.skopos/') && !text.includes('run-')) continue;
    await collectReferencesFromText(
      text,
      `tracked reference ${normalizePath(relative(workspaceRoot, trackedFile))}`,
      add,
    );
  }
  return references;
};

const collectReferencesFromText = async (
  text: string,
  reason: string,
  add: (path: string, reason: string) => void,
) => {
  for (const match of text.matchAll(/\.skopos\/[A-Za-z0-9._@/-]+/gu)) {
    add(match[0], reason);
  }
  for (const match of text.matchAll(/\brun-\d{8}T\d{6}Z-[A-Za-z0-9._-]+\b/gu)) {
    add(`.skopos/runs/${match[0]}`, reason);
  }
};

const applySizePressure = (
  units: InternalStorageUnit[],
  policy: SkoposStoragePolicyConfig,
) => {
  const softLimitBytes = policy.softLimitMb * MIB;
  const totalBytes = units.reduce((total, unit) => total + unit.bytes, 0);
  if (totalBytes <= softLimitBytes) return;

  let projectedBytes =
    totalBytes - units.filter((unit) => unit.eligible).reduce((total, unit) => total + unit.bytes, 0);
  if (projectedBytes <= softLimitBytes) return;

  const classPriority = new Map<SkoposStorageClass, number>(
    CLASS_ORDER.map((storageClass, index) => [storageClass, index]),
  );
  const candidates = units
    .filter((unit) => !unit.protected && !unit.eligible)
    .sort((left, right) => {
      const classDifference =
        (classPriority.get(left.storageClass) ?? 99) -
        (classPriority.get(right.storageClass) ?? 99);
      if (classDifference !== 0) return classDifference;
      return left.lastModifiedAt.localeCompare(right.lastModifiedAt);
    });
  for (const unit of candidates) {
    if (projectedBytes <= softLimitBytes) break;
    unit.eligible = true;
    unit.eligibilityReasons.push(
      `size pressure: total exceeds ${policy.softLimitMb} MiB soft limit`,
    );
    projectedBytes -= unit.bytes;
  }
};

const loadStoragePolicy = async (workspaceRoot: string): Promise<SkoposStoragePolicyConfig> => {
  const config = await loadSkoposConfig(join(workspaceRoot, 'skopos.config.yaml'));
  return config?.storage ?? DEFAULT_SKOPOS_STORAGE_POLICY;
};

const loadPins = async (workspaceRoot: string): Promise<StoragePinsArtifact> => {
  try {
    const artifact = JSON.parse(
      await readFile(join(workspaceRoot, PINS_PATH), 'utf8'),
    ) as StoragePinsArtifact;
    if (artifact.schemaVersion !== 1 || artifact.type !== 'storage-pins' || !Array.isArray(artifact.pins)) {
      throw new Error(`Invalid Skopos storage pins artifact: ${PINS_PATH}`);
    }
    return artifact;
  } catch (error) {
    if (!isNodeError(error) || error.code !== 'ENOENT') throw error;
    return {
      schemaVersion: 1,
      type: 'storage-pins',
      authority: 'generated',
      updatedAt: new Date(0).toISOString(),
      pins: [],
    };
  }
};

const normalizeStorageTarget = (workspaceRoot: string, input: string): string => {
  const value = requireText(input, 'storage path');
  const absolutePath = resolve(workspaceRoot, value);
  const storageRoot = resolve(workspaceRoot, STORAGE_ROOT);
  if (absolutePath === storageRoot || !absolutePath.startsWith(`${storageRoot}${sep}`)) {
    throw new Error(`Storage pins must target a path inside .skopos, not the root itself: ${input}`);
  }
  return normalizePath(relative(workspaceRoot, absolutePath));
};

const normalizeReferencedPath = (path: string): string | undefined => {
  const normalized = normalizePath(path).replace(/[),.;:'"\]}]+$/u, '');
  if (normalized === '.skopos' || !normalized.startsWith('.skopos/')) return undefined;
  return normalized;
};

const pathsIntersect = (left: string, right: string): boolean =>
  left === right || left.startsWith(`${right}/`) || right.startsWith(`${left}/`);

const retentionDaysFor = (
  storageClass: Exclude<SkoposStorageClass, 'user-pinned'>,
  policy: SkoposStoragePolicyConfig,
): number => {
  if (storageClass === 'temporary') return policy.retentionDays.temporary;
  if (storageClass === 'cache') return policy.retentionDays.cache;
  if (storageClass === 'diagnostic') return policy.retentionDays.diagnostic;
  if (storageClass === 'task-evidence') return policy.retentionDays.taskEvidence;
  return policy.retentionDays.releaseEvidence;
};

const measurePaths = async (paths: string[]): Promise<{ bytes: number; modifiedAtMs: number }> => {
  let bytes = 0;
  let modifiedAtMs = 0;
  const walk = async (path: string): Promise<void> => {
    const metadata = await lstat(path).catch(() => undefined);
    if (!metadata) return;
    modifiedAtMs = Math.max(modifiedAtMs, metadata.mtimeMs);
    if (!metadata.isDirectory() || metadata.isSymbolicLink()) {
      bytes += metadata.size;
      return;
    }
    for (const entry of await safeReadDir(path)) await walk(join(path, entry.name));
  };
  for (const path of paths) await walk(path);
  return { bytes, modifiedAtMs: modifiedAtMs || Date.now() };
};

const findFiles = async (
  root: string,
  predicate: (normalizedPath: string) => boolean,
): Promise<string[]> => {
  const files: string[] = [];
  const visit = async (current: string) => {
    for (const entry of await safeReadDir(current)) {
      const path = join(current, entry.name);
      if (entry.isDirectory() && !entry.isSymbolicLink()) await visit(path);
      else if (entry.isFile() && predicate(normalizePath(path))) files.push(path);
    }
  };
  await visit(root);
  return files.sort();
};

const safeReadDir = async (path: string) =>
  readdir(path, { withFileTypes: true }).catch((error: unknown) => {
    if (isNodeError(error) && error.code === 'ENOENT') return [];
    throw error;
  });

const writeJsonAtomic = async (path: string, value: unknown) => {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(temporaryPath, path);
};

const toPublicUnit = ({ physicalPaths: _physicalPaths, ...unit }: InternalStorageUnit) => unit;

const normalizePath = (path: string): string => path.split(sep).join('/');
const digestText = (value: string): string => createHash('sha256').update(value).digest('hex');
const formatTimestamp = (value: string): string => value.replace(/[-:]/gu, '').replace(/\.\d{3}Z$/u, 'Z');
const round = (value: number): number => Math.round(value * 100) / 100;
const requireText = (value: string | undefined, label: string): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Missing value for ${label}.`);
  }
  return value.trim();
};
const isNodeError = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && 'code' in error;
