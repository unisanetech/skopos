import { createHash } from 'node:crypto';
import { lstat, readFile, readdir, readlink } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';

import type {
  SkoposWorkflowManifest,
  SkoposWorkflowReceipt,
  SkoposWorkflowReceiptPathDigest,
  SkoposWorkflowReceiptState,
  SkoposWorkflowRunArtifact,
} from '@skopos/model';
import { resolveSkoposWorkspaceIdentity } from '../workspace-identity/workspace-identity.service.js';

const RECEIPT_LEASE_MS = 2 * 60 * 60 * 1000;
const IGNORED_DIRECTORY_NAMES = new Set([
  '.git',
  '.turbo',
  'coverage',
  'dist',
  'dist-app',
  'node_modules',
]);
const IGNORED_SOURCE_PREFIXES = [
  '.skopos/agent',
  '.skopos/evals',
  '.skopos/jobs',
  '.skopos/memory',
  '.skopos/runs',
  '.skopos/tasks',
  '.skopos/discussion',
  '.skopos/discussions',
  '.skopos/index.json',
  '.skopos/log.jsonl',
  '.skopos/program',
  '.skopos/project.json',
  '.skopos/questions.json',
  '.skopos/current',
  '.skopos/receipts',
  '.skopos/recommendations.json',
  'docs/generated',
];
const IGNORED_RECEIPT_OUTPUT_PREFIXES = [
  '.skopos/index.json',
  '.skopos/log.jsonl',
  '.skopos/runs',
];

export interface SkoposWorkflowReceiptValidation {
  status: 'valid' | 'stale' | 'legacy' | 'active';
  summary: string;
  currentSourceDigest?: string;
}

export const buildSkoposWorkflowReceipt = async ({
  workspaceRoot,
  manifest,
  runId,
  actorId,
  capturedAt = new Date().toISOString(),
}: {
  workspaceRoot: string;
  manifest: SkoposWorkflowManifest;
  runId: string;
  actorId?: string;
  capturedAt?: string;
}): Promise<SkoposWorkflowReceipt> => {
  const sourceState = await captureSkoposWorkflowSourceState({
    workspaceRoot,
    manifest,
  });
  const workspace = await resolveSkoposWorkspaceIdentity(workspaceRoot);
  const commandDigest = digestText(`${manifest.command}\n${manifest.cwd}`);
  const environment = {
    platform: process.platform,
    architecture: process.arch,
    nodeVersion: process.version,
    workspace,
  };
  const executionKey = buildReceiptExecutionKey({
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
      leaseExpiresAt: new Date(Date.parse(capturedAt) + RECEIPT_LEASE_MS).toISOString(),
    },
    freshness: {
      policy: 'source-bound',
      capturedAt,
    },
  };
};

export const finalizeSkoposWorkflowReceipt = async ({
  workspaceRoot,
  manifest,
  receipt,
}: {
  workspaceRoot: string;
  manifest: SkoposWorkflowManifest;
  receipt: SkoposWorkflowReceipt;
}): Promise<SkoposWorkflowReceipt> => {
  const sourceState = await captureSkoposWorkflowSourceState({
    workspaceRoot,
    manifest,
  });
  const outputState = await captureDeclaredPathState({
    workspaceRoot,
    baseDirectory: resolve(workspaceRoot, manifest.cwd),
    declaredPaths: receiptOutputPaths(manifest),
    ignoredWorkspacePaths: [],
  });

  return {
    ...receipt,
    executionKey: buildReceiptExecutionKey({
      actionId: receipt.actionId,
      commandDigest: receipt.command.digest,
      sourceDigest: sourceState.digest,
      environment: receipt.environment,
    }),
    sourceState,
    outputState,
    freshness: {
      ...receipt.freshness,
      capturedAt: new Date().toISOString(),
    },
  };
};

export const validateSkoposWorkflowReceipt = async ({
  workspaceRoot,
  manifest,
  artifact,
  now = new Date(),
}: {
  workspaceRoot: string;
  manifest: SkoposWorkflowManifest;
  artifact: SkoposWorkflowRunArtifact;
  now?: Date;
}): Promise<SkoposWorkflowReceiptValidation> => {
  const receipt = artifact.receipt;
  if (!receipt) {
    return {
      status: 'legacy',
      summary: 'The successful workflow run predates source-bound receipts.',
    };
  }

  const commandDigest = digestText(`${manifest.command}\n${manifest.cwd}`);
  if (
    receipt.actionId !== manifest.id ||
    receipt.command.digest !== commandDigest ||
    receipt.command.raw !== manifest.command ||
    receipt.command.cwd !== manifest.cwd
  ) {
    return {
      status: 'stale',
      summary: 'The workflow action or exact command changed after this receipt was recorded.',
    };
  }

  if (receipt.environment.workspace) {
    const currentWorkspace = await resolveSkoposWorkspaceIdentity(workspaceRoot);
    if (
      receipt.environment.workspace.repositoryId !== currentWorkspace.repositoryId ||
      receipt.environment.workspace.worktreeId !== currentWorkspace.worktreeId ||
      receipt.environment.workspace.branch !== currentWorkspace.branch
    ) {
      return {
        status: 'stale',
        summary: 'The workflow receipt belongs to a different repository or worktree.',
      };
    }
  }

  const currentSourceState = await captureSkoposWorkflowSourceState({
    workspaceRoot,
    manifest,
  });
  if (currentSourceState.digest !== receipt.sourceState.digest) {
    return {
      status: 'stale',
      summary: 'Relevant workflow source or configuration changed after this receipt was recorded.',
      currentSourceDigest: currentSourceState.digest,
    };
  }

  if (artifact.runStatus === 'running') {
    const leaseExpiresAt = Date.parse(receipt.owner.leaseExpiresAt);
    return Number.isFinite(leaseExpiresAt) && leaseExpiresAt > now.getTime()
      ? {
          status: 'active',
          summary: `Exact workflow execution is owned by ${receipt.owner.runId} until ${receipt.owner.leaseExpiresAt}.`,
          currentSourceDigest: currentSourceState.digest,
        }
      : {
          status: 'stale',
          summary: 'The workflow execution ownership lease expired before completion.',
          currentSourceDigest: currentSourceState.digest,
        };
  }

  const declaredReceiptOutputs = receiptOutputPaths(manifest);
  if (declaredReceiptOutputs.length > 0) {
    if (!receipt.outputState) {
      return {
        status: 'stale',
        summary: 'The receipt does not contain the declared workflow output state.',
        currentSourceDigest: currentSourceState.digest,
      };
    }

    const currentOutputState = await captureDeclaredPathState({
      workspaceRoot,
      baseDirectory: resolve(workspaceRoot, manifest.cwd),
      declaredPaths: declaredReceiptOutputs,
      ignoredWorkspacePaths: [],
    });
    if (currentOutputState.digest !== receipt.outputState.digest) {
      return {
        status: 'stale',
        summary: 'Declared workflow outputs changed or disappeared after this receipt was recorded.',
        currentSourceDigest: currentSourceState.digest,
      };
    }
  }

  return {
    status: 'valid',
    summary: 'The workflow receipt matches the exact action, source state, environment, and outputs.',
    currentSourceDigest: currentSourceState.digest,
  };
};

export const captureSkoposWorkflowSourceState = async ({
  workspaceRoot,
  manifest,
}: {
  workspaceRoot: string;
  manifest: SkoposWorkflowManifest;
}): Promise<SkoposWorkflowReceiptState> => {
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

  return captureDeclaredPathState({
    workspaceRoot,
    baseDirectory: resolve(workspaceRoot, manifest.cwd),
    declaredPaths,
    ignoredWorkspacePaths: [...IGNORED_SOURCE_PREFIXES, ...outputPaths],
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
}): Promise<SkoposWorkflowReceiptState> => {
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
}): Promise<SkoposWorkflowReceiptPathDigest> => {
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

const receiptOutputPaths = (manifest: SkoposWorkflowManifest): string[] =>
  manifest.outputs.filter(
    (outputPath) =>
      !IGNORED_RECEIPT_OUTPUT_PREFIXES.some(
        (ignoredPath) =>
          outputPath === ignoredPath || outputPath.startsWith(`${ignoredPath}/`),
      ),
  );

const normalizeWorkspacePath = (workspaceRoot: string, absolutePath: string): string => {
  const workspacePath = relative(workspaceRoot, absolutePath).split(sep).join('/');
  return workspacePath.length > 0 ? workspacePath : '.';
};

const buildReceiptExecutionKey = ({
  actionId,
  commandDigest,
  sourceDigest,
  environment,
}: {
  actionId: string;
  commandDigest: string;
  sourceDigest: string;
  environment: SkoposWorkflowReceipt['environment'];
}): string =>
  digestText(
    [
      actionId,
      commandDigest,
      sourceDigest,
      environment.platform,
      environment.architecture,
      environment.nodeVersion,
      environment.workspace?.worktreeId ?? '(legacy-workspace)',
      environment.workspace?.branch ?? '(detached)',
    ].join('\n'),
  );

const digestBuffer = (value: Buffer): string =>
  createHash('sha256').update(Uint8Array.from(value)).digest('hex');

const digestText = (value: string): string =>
  createHash('sha256').update(value, 'utf8').digest('hex');
