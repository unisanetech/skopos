import { resolve, join } from 'node:path';

import { loadSkoposConfig } from '@skopos/config';
import {
  buildSkoposEnforcementProfile,
  syncClaudeCodeHookAdapter,
  syncCodexWrapperAdapter,
  syncInstructionMirrors,
  syncManualHostAdapter,
  type SyncInstructionMirrorsResult,
} from '@skopos/instructions';
import { loadSkoposWorkflowManifests } from '@skopos/indexer';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';

export interface SyncSkoposInstructionsOptions {
  cwd: string;
  dryRun?: boolean;
  actor?: string;
}

export interface SyncSkoposInstructionsResult extends SyncInstructionMirrorsResult {
  actorId?: string;
}

export const syncSkoposInstructions = async ({
  cwd,
  dryRun = false,
  actor,
}: SyncSkoposInstructionsOptions): Promise<SyncSkoposInstructionsResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveInstructionsActorId(actor);
  const existingConfig = await loadSkoposConfig(join(workspaceRoot, 'skopos.config.yaml'));
  const instructionSourcePath =
    existingConfig?.agents.canonicalInstructions ?? 'AGENTS.md';
  const workflows = await loadSkoposWorkflowManifests({
    cwd: workspaceRoot,
  });
  const enforcement = buildSkoposEnforcementProfile({
    cwd: workspaceRoot,
    workflows,
    instructionSourcePath,
  });
  const projectionModel = enforcement.hostProjectionModel;
  const [result, claudeAdapter, codexAdapter, manualHostAdapter] = await Promise.all([
    syncInstructionMirrors({
      cwd: workspaceRoot,
      dryRun,
      instructionSourcePath,
      projectionModel,
    }),
    syncClaudeCodeHookAdapter({
      cwd: workspaceRoot,
      dryRun,
      projectionModel,
    }),
    syncCodexWrapperAdapter({
      cwd: workspaceRoot,
      dryRun,
      projectionModel,
    }),
    syncManualHostAdapter({
      cwd: workspaceRoot,
      dryRun,
      projectionModel,
    }),
  ]);
  const enforcementPath = join(workspaceRoot, '.skopos', 'enforcement.json');
  await writeJsonArtifact({
    artifactPath: enforcementPath,
    artifact: enforcement,
    dryRun,
  });
  const writes = [
    ...result.writes,
    ...claudeAdapter.writes,
    ...codexAdapter.writes,
    ...manualHostAdapter.writes,
    {
      path: enforcementPath,
      status: dryRun ? 'dry-run' : 'written',
    } as const,
  ];

  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'instructions-sync',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary: `Synced ${writes.length} instruction and adapter surface${writes.length === 1 ? '' : 's'}.`,
    relatedArtifactPaths: [result.sourcePath, ...writes.map((write) => write.path)],
    metadata: {
      writeCount: writes.length,
      actorId: actorId ?? null,
    },
    dryRun,
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
    dryRun,
  });

  return {
    ...result,
    writes,
    actorId,
  };
};

const resolveInstructionsActorId = (actor?: string): string | undefined => {
  const candidate = actor ?? process.env.SKOPOS_ACTOR;
  if (typeof candidate !== 'string') {
    return undefined;
  }

  const normalized = candidate.trim();
  return normalized.length > 0 ? normalized : undefined;
};
