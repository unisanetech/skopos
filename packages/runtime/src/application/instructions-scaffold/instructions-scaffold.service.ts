import { join, resolve } from 'node:path';

import { loadSkoposConfig } from '@skopos/config';
import { buildSkoposBootstrapArtifacts } from '@skopos/indexer';
import { scaffoldProjectInstructions } from '@skopos/instructions';
import type { SkoposInitMode, SkoposInstructionScaffoldArtifact } from '@skopos/model';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';

export interface ScaffoldSkoposProjectInstructionsOptions {
  cwd: string;
  mode?: SkoposInitMode;
  subtreeTarget?: string;
  actor?: string;
  dryRun?: boolean;
  force?: boolean;
}

export interface ScaffoldSkoposProjectInstructionsResult
  extends SkoposInstructionScaffoldArtifact {
  actorId?: string;
}

export const scaffoldSkoposProjectInstructions = async ({
  cwd,
  mode = 'existing',
  subtreeTarget,
  actor,
  dryRun = false,
  force = false,
}: ScaffoldSkoposProjectInstructionsOptions): Promise<ScaffoldSkoposProjectInstructionsResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const existingConfig = await loadSkoposConfig(join(workspaceRoot, 'skopos.config.yaml'));
  const { bootstrap } = await buildSkoposBootstrapArtifacts({
    cwd: workspaceRoot,
    mode,
    existingConfig,
    subtreeTarget,
  });
  const scaffold = await scaffoldProjectInstructions({
    cwd: workspaceRoot,
    instructionSourcePath: bootstrap.recommendedConfig.agents.canonicalInstructions,
    mode: bootstrap.mode,
    projectName: bootstrap.recommendedConfig.project.name,
    repoMode: bootstrap.recommendedConfig.project.repoMode,
    archetype: bootstrap.recommendedConfig.project.archetype,
    docsRoot: bootstrap.recommendedConfig.docs.root,
    docsStartHerePath: bootstrap.recommendedConfig.docs.startHerePath,
    commands: bootstrap.recommendedConfig.commands,
    dryRun,
    force,
  });

  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'instructions-scaffold',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary: `Instruction scaffold ${scaffold.status} at ${scaffold.relativePath}.`,
    relatedArtifactPaths: [scaffold.path],
    metadata: {
      actorId: actorId ?? null,
      mode: scaffold.mode,
      scaffoldStatus: scaffold.status,
      templateVersion: scaffold.templateVersion,
    },
    dryRun,
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
    dryRun,
  });

  return {
    ...scaffold,
    actorId,
  };
};
