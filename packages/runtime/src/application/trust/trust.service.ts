import { resolve } from 'node:path';

import { buildSkoposTrustReport } from '@skopos/trust';
import type { SkoposTrustReport } from '@skopos/model';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { refreshSkoposMemoryState } from '../shared/memory-state.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import {
  buildSkoposAgentTrustBrief,
  writeSkoposAgentBrief,
} from '../shared/agent-briefs.js';
import { TRUST_BRIEF_ARTIFACT_PATH } from '../shared/token-control-constants.js';

export interface BuildSkoposTrustRuntimeOptions {
  cwd: string;
  actor?: string;
}

export interface BuildSkoposTrustRuntimeResult extends SkoposTrustReport {
  actorId?: string;
}

export const buildSkoposTrustRuntime = async ({
  cwd,
  actor,
}: BuildSkoposTrustRuntimeOptions): Promise<BuildSkoposTrustRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const report = await buildSkoposTrustReport({
    cwd: workspaceRoot,
  });
  await writeSkoposAgentBrief({
    artifactPath: resolve(workspaceRoot, TRUST_BRIEF_ARTIFACT_PATH),
    artifact: buildSkoposAgentTrustBrief({
      workspaceRoot,
      report,
    }),
  });
  await refreshSkoposMemoryState({
    workspaceRoot,
    trustLevel: report.trustLevel,
    readiness: report.readiness,
  });
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'trust',
    status: 'succeeded',
    summary: `Trust check completed with ${report.readiness} readiness.`,
    metadata: {
      actorId: actorId ?? null,
      readiness: report.readiness,
      trustLevel: report.trustLevel,
      findingCount: report.findings.length,
      unresolvedAssumptionCount: report.unresolvedAssumptions.length,
    },
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
  });

  return {
    ...report,
    actorId,
  };
};
