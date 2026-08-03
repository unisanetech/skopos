import { createHash } from 'node:crypto';
import { lstat, readFile, readdir, readlink } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';

import type {
  SkoposActionManifest,
  SkoposActionRunArtifact,
  SkoposEvidence,
  SkoposEvidencePathDigest,
  SkoposEvidenceState,
} from '@skopos/model';
import { resolveSkoposWorkspaceIdentity } from '../workspace-identity/workspace-identity.service.js';

const EVIDENCE_LEASE_MS = 2 * 60 * 60 * 1000;
const IGNORED_DIRECTORY_NAMES = new Set([
  '.git',
  '.next',
  '.tmp',
  '.turbo',
  'coverage',
  'dist',
  'dist-app',
  'node_modules',
]);
const IGNORED_SOURCE_PREFIXES = ['.skopos'];
const IGNORED_EVIDENCE_OUTPUT_PREFIXES = [
  '.skopos/index/memory.json',
  '.skopos/runs/operations.jsonl',
  '.skopos/runs',
];

export interface SkoposEvidenceValidation {
  status: 'valid' | 'stale' | 'active';
  summary: string;
  currentSourceDigest?: string;
}

export const buildSkoposEvidence = async ({
  workspaceRoot,
  manifest,
  runId,
  actorId,
  capturedAt = new Date().toISOString(),
  ignoredSourcePaths = [],
}: {
  workspaceRoot: string;
  manifest: SkoposActionManifest;
  runId: string;
  actorId?: string;
  capturedAt?: string;
  ignoredSourcePaths?: string[];
}): Promise<SkoposEvidence> => {
  const sourceState = await captureSkoposActionSourceState({
    workspaceRoot,
    manifest,
    ignoredSourcePaths,
  });
  const workspace = await resolveSkoposWorkspaceIdentity(workspaceRoot);
  const commandDigest = digestActionExecutionContract(manifest);
  const environment = {
    platform: process.platform,
    architecture: process.arch,
    nodeVersion: process.version,
    workspace,
    capabilities: manifest.capabilities,
    effects: manifest.effects,
    concurrency: manifest.concurrency,
  };
  const executionKey = buildEvidenceExecutionKey({
    actionId: manifest.id,
    commandDigest,
    sourceDigest: sourceState.digest,
    environment,
  });

  return {
    schemaVersion: 1,
    executionKey,
    actionId: manifest.id,
    command: {
      raw: manifest.command,
      cwd: manifest.cwd,
      digest: commandDigest,
    },
    sourceState,
    environment,
    owner: {
      runId,
      actorId,
      leaseExpiresAt: new Date(Date.parse(capturedAt) + EVIDENCE_LEASE_MS).toISOString(),
    },
    freshness: {
      policy: 'source-bound',
      capturedAt,
    },
  };
};

export const finalizeSkoposEvidence = async ({
  workspaceRoot,
  manifest,
  evidence,
  ignoredSourcePaths = [],
}: {
  workspaceRoot: string;
  manifest: SkoposActionManifest;
  evidence: SkoposEvidence;
  ignoredSourcePaths?: string[];
}): Promise<SkoposEvidence> => {
  const sourceState = await captureSkoposActionSourceState({
    workspaceRoot,
    manifest,
    ignoredSourcePaths,
  });
  const outputState = await captureDeclaredPathState({
    workspaceRoot,
    baseDirectory: resolveActionOutputBaseDirectory(workspaceRoot, manifest, evidence.owner.runId),
    declaredPaths: evidenceOutputPaths(manifest),
    ignoredWorkspacePaths: [],
  });

  return {
    ...evidence,
    executionKey: buildEvidenceExecutionKey({
      actionId: evidence.actionId,
      commandDigest: evidence.command.digest,
      sourceDigest: sourceState.digest,
      environment: evidence.environment,
    }),
    sourceState,
    outputState,
    freshness: {
      ...evidence.freshness,
      capturedAt: new Date().toISOString(),
    },
  };
};

export const validateSkoposEvidence = async ({
  workspaceRoot,
  manifest,
  artifact,
  now = new Date(),
  ignoredSourcePaths = [],
}: {
  workspaceRoot: string;
  manifest: SkoposActionManifest;
  artifact: SkoposActionRunArtifact;
  now?: Date;
  ignoredSourcePaths?: string[];
}): Promise<SkoposEvidenceValidation> => {
  const evidence = artifact.evidence;
  if (!evidence) {
    return {
      status: 'stale',
      summary: 'The successful Action run is missing source-bound Evidence.',
    };
  }

  const commandDigest = digestActionExecutionContract(manifest);
  if (
    evidence.actionId !== manifest.id ||
    evidence.command.digest !== commandDigest ||
    evidence.command.raw !== manifest.command ||
    evidence.command.cwd !== manifest.cwd
  ) {
    return {
      status: 'stale',
      summary: 'The Action or exact command changed after this Evidence was recorded.',
    };
  }

  if (!evidence.environment.workspace) {
    return {
      status: 'stale',
      summary: 'The Action Evidence is missing the required workspace identity.',
    };
  }

  const currentWorkspace = await resolveSkoposWorkspaceIdentity(workspaceRoot);
  if (
    evidence.environment.workspace.repositoryId !== currentWorkspace.repositoryId ||
    evidence.environment.workspace.worktreeId !== currentWorkspace.worktreeId ||
    evidence.environment.workspace.branch !== currentWorkspace.branch
  ) {
    return {
      status: 'stale',
      summary: 'The Action Evidence belongs to a different repository or working tree.',
    };
  }

  const currentSourceState = await captureSkoposActionSourceState({
    workspaceRoot,
    manifest,
    ignoredSourcePaths,
  });
  if (currentSourceState.digest !== evidence.sourceState.digest) {
    return {
      status: 'stale',
      summary: 'Relevant Action source or configuration changed after this Evidence was recorded.',
      currentSourceDigest: currentSourceState.digest,
    };
  }

  if (artifact.runStatus === 'running') {
    const leaseExpiresAt = Date.parse(evidence.owner.leaseExpiresAt);
    return Number.isFinite(leaseExpiresAt) && leaseExpiresAt > now.getTime()
      ? {
          status: 'active',
          summary: `Exact Action execution is owned by ${evidence.owner.runId} until ${evidence.owner.leaseExpiresAt}.`,
          currentSourceDigest: currentSourceState.digest,
        }
      : {
          status: 'stale',
          summary: 'The Action execution ownership lease expired before completion.',
          currentSourceDigest: currentSourceState.digest,
        };
  }

  const declaredEvidenceOutputs = evidenceOutputPaths(manifest);
  if (declaredEvidenceOutputs.length > 0) {
    if (!evidence.outputState) {
      return {
        status: 'stale',
        summary: 'The Evidence does not contain the declared Action output state.',
        currentSourceDigest: currentSourceState.digest,
      };
    }

    const currentOutputState = await captureDeclaredPathState({
      workspaceRoot,
      baseDirectory: resolveActionOutputBaseDirectory(
        workspaceRoot,
        manifest,
        evidence.owner.runId,
      ),
      declaredPaths: declaredEvidenceOutputs,
      ignoredWorkspacePaths: [],
    });
    if (currentOutputState.digest !== evidence.outputState.digest) {
      return {
        status: 'stale',
        summary: 'Declared Action outputs changed or disappeared after this Evidence was recorded.',
        currentSourceDigest: currentSourceState.digest,
      };
    }
  }

  return {
    status: 'valid',
    summary: 'The Evidence matches the exact Action, source state, environment, and outputs.',
    currentSourceDigest: currentSourceState.digest,
  };
};

const digestActionExecutionContract = (manifest: SkoposActionManifest): string =>
  digestText(JSON.stringify({
    command: manifest.command,
    cwd: manifest.cwd,
    capabilities: manifest.capabilities,
    effects: manifest.effects,
    concurrency: manifest.concurrency,
  }));

export const captureSkoposActionSourceState = async ({
  workspaceRoot,
  manifest,
  ignoredSourcePaths = [],
}: {
  workspaceRoot: string;
  manifest: SkoposActionManifest;
  ignoredSourcePaths?: string[];
}): Promise<SkoposEvidenceState> => {
  const declaredPaths = [
    ...manifest.inputs,
    manifest.sourcePath,
    'skopos.config.yaml',
  ];
  const outputPaths = manifest.outputs.map((outputPath) =>
    normalizeWorkspacePath(
      workspaceRoot,
      resolve(workspaceRoot, manifest.cwd, outputPath),
    ),
  );
  const normalizedIgnoredSourcePaths = ignoredSourcePaths.map((ignoredPath) =>
    normalizeWorkspacePath(workspaceRoot, resolve(workspaceRoot, ignoredPath)),
  );
  const declaredSourceExcludes = (manifest.sourceExcludes ?? []).map((excludedPath) =>
    normalizeWorkspacePath(
      workspaceRoot,
      resolve(workspaceRoot, manifest.cwd, excludedPath),
    ),
  );

  return captureDeclaredPathState({
    workspaceRoot,
    baseDirectory: resolve(workspaceRoot, manifest.cwd),
    declaredPaths,
    ignoredWorkspacePaths: [
      ...IGNORED_SOURCE_PREFIXES,
      ...outputPaths,
      ...declaredSourceExcludes,
      ...normalizedIgnoredSourcePaths,
    ],
  });
};

const captureDeclaredPathState = async ({
  workspaceRoot,
  baseDirectory,
  declaredPaths,
  ignoredWorkspacePaths,
}: {
  workspaceRoot: string;
  baseDirectory: string;
  declaredPaths: string[];
  ignoredWorkspacePaths: string[];
}): Promise<SkoposEvidenceState> => {
  const paths = await Promise.all(
    [...new Set(declaredPaths)].sort().map(async (declaredPath) =>
      hashDeclaredPath({
        workspaceRoot,
        absolutePath: resolve(baseDirectory, declaredPath),
        ignoredWorkspacePaths,
      }),
    ),
  );

  return {
    algorithm: 'sha256',
    digest: digestText(
      paths
        .map((entry) => `${entry.path}\0${entry.kind}\0${entry.digest}\0${entry.fileCount}`)
        .join('\n'),
    ),
    paths,
  };
};

const hashDeclaredPath = async ({
  workspaceRoot,
  absolutePath,
  ignoredWorkspacePaths,
}: {
  workspaceRoot: string;
  absolutePath: string;
  ignoredWorkspacePaths: string[];
}): Promise<SkoposEvidencePathDigest> => {
  const workspacePath = normalizeWorkspacePath(workspaceRoot, absolutePath);

  try {
    const pathStat = await lstat(absolutePath);
    if (pathStat.isSymbolicLink()) {
      return {
        path: workspacePath,
        kind: 'symlink',
        digest: digestText(await readlink(absolutePath)),
        fileCount: 1,
      };
    }

    if (pathStat.isFile()) {
      return {
        path: workspacePath,
        kind: 'file',
        digest: digestBuffer(await readFile(absolutePath)),
        fileCount: 1,
      };
    }

    if (pathStat.isDirectory()) {
      const records = await hashDirectoryRecords({
        workspaceRoot,
        absoluteDirectory: absolutePath,
        ignoredWorkspacePaths,
      });
      return {
        path: workspacePath,
        kind: 'directory',
        digest: digestText(records.join('\n')),
        fileCount: records.length,
      };
    }
  } catch {
    // Missing declared paths are part of the source state.
  }

  return {
    path: workspacePath,
    kind: 'missing',
    digest: digestText('missing'),
    fileCount: 0,
  };
};

const hashDirectoryRecords = async ({
  workspaceRoot,
  absoluteDirectory,
  ignoredWorkspacePaths,
}: {
  workspaceRoot: string;
  absoluteDirectory: string;
  ignoredWorkspacePaths: string[];
}): Promise<string[]> => {
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });
  const records: string[] = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const absolutePath = resolve(absoluteDirectory, entry.name);
    const workspacePath = normalizeWorkspacePath(workspaceRoot, absolutePath);
    if (shouldIgnoreSourcePath(workspacePath, entry.name, ignoredWorkspacePaths)) {
      continue;
    }

    if (entry.isDirectory()) {
      records.push(
        ...(await hashDirectoryRecords({
          workspaceRoot,
          absoluteDirectory: absolutePath,
          ignoredWorkspacePaths,
        })),
      );
      continue;
    }

    if (entry.isSymbolicLink()) {
      records.push(`${workspacePath}\0symlink\0${digestText(await readlink(absolutePath))}`);
      continue;
    }

    if (entry.isFile()) {
      records.push(`${workspacePath}\0file\0${digestBuffer(await readFile(absolutePath))}`);
    }
  }

  return records;
};

const shouldIgnoreSourcePath = (
  workspacePath: string,
  entryName: string,
  ignoredWorkspacePaths: string[],
): boolean =>
  IGNORED_DIRECTORY_NAMES.has(entryName) ||
  ignoredWorkspacePaths.some(
    (ignoredPath) =>
      workspacePath === ignoredPath || workspacePath.startsWith(`${ignoredPath}/`),
  );

const evidenceOutputPaths = (manifest: SkoposActionManifest): string[] =>
  manifest.outputs.filter(
    (outputPath) =>
      !IGNORED_EVIDENCE_OUTPUT_PREFIXES.some(
        (ignoredPath) =>
          outputPath === ignoredPath || outputPath.startsWith(`${ignoredPath}/`),
      ),
  );

const resolveActionOutputBaseDirectory = (
  workspaceRoot: string,
  manifest: SkoposActionManifest,
  runId: string,
): string =>
  manifest.effects.artifacts === 'isolated'
    ? resolve(workspaceRoot, '.skopos', 'runs', runId, 'artifacts')
    : resolve(workspaceRoot, manifest.cwd);

const normalizeWorkspacePath = (workspaceRoot: string, absolutePath: string): string => {
  const workspacePath = relative(workspaceRoot, absolutePath).split(sep).join('/');
  return workspacePath.length > 0 ? workspacePath : '.';
};

const buildEvidenceExecutionKey = ({
  actionId,
  commandDigest,
  sourceDigest,
  environment,
}: {
  actionId: string;
  commandDigest: string;
  sourceDigest: string;
  environment: SkoposEvidence['environment'];
}): string =>
  digestText(
    [
      actionId,
      commandDigest,
      sourceDigest,
      environment.platform,
      environment.architecture,
      environment.nodeVersion,
      environment.workspace.worktreeId,
      environment.workspace.branch,
    ].join('\n'),
  );

const digestBuffer = (value: Buffer): string =>
  createHash('sha256').update(Uint8Array.from(value)).digest('hex');

const digestText = (value: string): string =>
  createHash('sha256').update(value, 'utf8').digest('hex');
