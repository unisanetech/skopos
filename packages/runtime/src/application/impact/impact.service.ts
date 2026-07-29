import { join, resolve } from 'node:path';

import { buildSkoposImpactGraph, buildSkoposImpactReport } from '@skopos/verification';
import type { SkoposImpactReport } from '@skopos/model';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';

export interface BuildSkoposImpactRuntimeOptions {
  cwd: string;
  changedPaths?: string[];
  actor?: string;
}

export interface BuildSkoposImpactRuntimeResult extends SkoposImpactReport {
  actorId?: string;
}

export const buildSkoposImpactRuntime = async ({
  cwd,
  changedPaths = [],
  actor,
}: BuildSkoposImpactRuntimeOptions): Promise<BuildSkoposImpactRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const impact = await buildSkoposImpactReport({
    cwd: resolve(cwd),
    changedPaths,
  });
  const impactGraph = buildSkoposImpactGraph({
    workspaceRoot,
    impact,
  });
  const graphPath = join(workspaceRoot, '.skopos', 'graph', 'impact.json');
  await writeJsonArtifact({
    artifactPath: graphPath,
    artifact: impactGraph,
  });
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'impact',
    status: 'succeeded',
    summary: `Impact analysis completed for ${impact.changedPaths.length} changed path${impact.changedPaths.length === 1 ? '' : 's'}.`,
    relatedArtifactPaths: [graphPath, ...impact.changedPaths],
    metadata: {
      actorId: actorId ?? null,
      changedPathCount: impact.changedPaths.length,
      affectedScopeCount: impact.affectedScopes.length,
      requiredActionCount: impact.requiredActions.length,
    },
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
  });

  return {
    ...impact,
    actorId,
    graphPath,
    graphWrite: 'written',
  };
};
