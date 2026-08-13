import { resolve, join } from 'node:path';

import { loadSkoposConfig } from '@skopos/config';
import {
  buildSkoposEnforcementProfile,
  scaffoldProjectInstructions,
  syncClaudeCodeHookAdapter,
  syncCodexWrapperAdapter,
  syncInstructionMirrors,
  syncManualHostAdapter,
  type SyncInstructionMirrorsResult,
} from '@skopos/instructions';
import { loadSkoposActionManifests, loadSkoposGuardManifests } from '@skopos/indexer';

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
  const instructionMirrorPaths = existingConfig?.agents.syncMirrors;
  const contract = existingConfig
    ? await scaffoldProjectInstructions({
        cwd: workspaceRoot,
        instructionSourcePath,
        mode: existingConfig.project.mode === 'new-project' ? 'greenfield' : 'existing',
        projectName: existingConfig.project.name,
        repoMode: existingConfig.project.repoMode,
        archetype: existingConfig.project.archetype,
        docsRoot: existingConfig.docs.root,
        docsStartHerePath: existingConfig.docs.startHerePath,
        commands: existingConfig.commands,
        dryRun,
      })
    : undefined;
  const [actions, guards] = await Promise.all([
    loadSkoposActionManifests({ cwd: workspaceRoot }),
    loadSkoposGuardManifests({ cwd: workspaceRoot }),
  ]);
  const enforcement = buildSkoposEnforcementProfile({
    cwd: workspaceRoot,
    actions,
    guards,
    instructionSourcePath,
    instructionMirrorPaths,
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
      instructionSourcePath,
    }),
    syncCodexWrapperAdapter({
      cwd: workspaceRoot,
      dryRun,
      projectionModel,
      instructionSourcePath,
    }),
    syncManualHostAdapter({
      cwd: workspaceRoot,
      dryRun,
      projectionModel,
      instructionSourcePath,
    }),
  ]);
  const enforcementPath = join(workspaceRoot, '.skopos', 'index', 'enforcement.json');
  await writeJsonArtifact({
    artifactPath: enforcementPath,
    artifact: enforcement,
    dryRun,
  });
  const writes = [
    ...(contract && contract.status !== 'skipped-existing'
      ? [
          {
            path: contract.path,
            status: dryRun ? 'dry-run' as const : 'written' as const,
          },
        ]
      : []),
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
