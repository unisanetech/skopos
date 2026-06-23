import { join, resolve } from 'node:path';

import { buildSkoposDoneReport, buildSkoposImpactGraph } from '@skopos/trust';
import type { SkoposDoneReport } from '@skopos/model';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import {
  buildSkoposAgentDoneBrief,
  writeSkoposAgentBrief,
} from '../shared/agent-briefs.js';
import { DONE_BRIEF_ARTIFACT_PATH } from '../shared/token-control-constants.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';

export interface BuildSkoposDoneRuntimeOptions {
  cwd: string;
  changedPaths?: string[];
  mission?: string;
  actor?: string;
}

export const buildSkoposDoneRuntime = async ({
  cwd,
  changedPaths = [],
  mission,
  actor,
}: BuildSkoposDoneRuntimeOptions): Promise<SkoposDoneReport> => {
  const workspaceRoot = resolve(cwd);
  const done = await buildSkoposDoneReport({
    cwd: workspaceRoot,
    changedPaths,
    mission,
    actor,
  });
  const impactGraph = buildSkoposImpactGraph({
    workspaceRoot,
    impact: done.impact,
  });
  const graphPath = join(workspaceRoot, '.skopos', 'graph', 'impact.json');
  await writeJsonArtifact({
    artifactPath: graphPath,
    artifact: impactGraph,
  });
  await writeSkoposAgentBrief({
    artifactPath: join(workspaceRoot, DONE_BRIEF_ARTIFACT_PATH),
    artifact: buildSkoposAgentDoneBrief({
      workspaceRoot,
      report: done,
    }),
  });
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'done',
    status: done.closureStatus === 'blocked' ? 'failed' : 'succeeded',
    summary: `Closure check ${done.closureStatus} for ${done.impact.changedPaths.length} changed path${done.impact.changedPaths.length === 1 ? '' : 's'}.`,
    relatedArtifactPaths: [graphPath, ...done.impact.changedPaths],
    metadata: {
      closureStatus: done.closureStatus,
      readiness: done.trust.readiness,
      trustLevel: done.trust.trustLevel,
      missionId: mission ?? null,
      actorId: actor ?? null,
      requiredWorkflowCount: done.workflowEvidence.length,
    },
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
  });

  return {
    ...done,
    impact: {
      ...done.impact,
      graphPath,
      graphWrite: 'written',
    },
  };
};
