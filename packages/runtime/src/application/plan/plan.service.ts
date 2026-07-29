import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import type { SkoposPlanResult, SkoposPlanRunResult } from '@skopos/model';
import { buildSkoposPlan, buildSkoposPlanArtifacts } from '@skopos/planner';
import { buildSkoposContext, loadSkoposQueryState } from '@skopos/query';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';

export interface BuildSkoposPlanRuntimeOptions {
  cwd: string;
  goal: string;
  scope?: string;
  dryRun?: boolean;
  actor?: string;
  parentPlanId?: string;
}

export interface PrepareSkoposPlanRuntimeOptions {
  cwd: string;
  goal: string;
  scope?: string;
}

export const prepareSkoposPlanRuntime = async ({
  cwd,
  goal,
  scope,
}: PrepareSkoposPlanRuntimeOptions): Promise<SkoposPlanResult> => {
  const workspaceRoot = resolve(cwd);
  const { bootstrap } = await loadSkoposQueryState({
    cwd: workspaceRoot,
  });
  const context = await buildSkoposContext({
    cwd: workspaceRoot,
    scope,
  });
  return buildSkoposPlan({
    workspaceRoot,
    goal,
    context,
    scanSummary: bootstrap.detected,
    config: bootstrap.recommendedConfig,
    recommendedActions: [],
  });
};

export const buildSkoposPlanRuntime = async ({
  cwd,
  goal,
  scope,
  dryRun = false,
  actor,
  parentPlanId,
}: BuildSkoposPlanRuntimeOptions): Promise<SkoposPlanRunResult> => {
  const workspaceRoot = resolve(cwd);
  const plan = await prepareSkoposPlanRuntime({
    cwd: workspaceRoot,
    goal,
    scope,
  });
  const artifacts = buildSkoposPlanArtifacts({
    plan,
    actorId: resolvePlanActorId(actor),
    parentPlanId,
  });
  const planArtifact = artifacts.planArtifact;
  const planPath = join(
    workspaceRoot,
    'docs',
    'work',
    'plans',
    `${planArtifact.id}-${slugify(planArtifact.title)}.md`,
  );
  const planWrite = await writePlanDocument({
    artifactPath: planPath,
    plan: planArtifact,
    dryRun,
  });
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'plan',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary: `Built plan ${planArtifact.id} for ${plan.scope.scope.id}.`,
    relatedArtifactPaths: [planPath],
    metadata: {
      goal,
      scopeId: plan.scope.scope.id,
      actorId: resolvePlanActorId(actor) ?? null,
      parentPlanId: parentPlanId ?? null,
      decisionQuestionCount: plan.decisionQuestions.length,
      recommendedActionCount: plan.recommendedActions.length,
    },
    dryRun,
  });
  await refreshSkoposKnowledgeIndex({
    workspaceRoot,
    dryRun,
  });

  return {
    ...plan,
    planId: planArtifact.id,
    planPath,
    planWrite,
    actorId: planArtifact.createdByActorId,
    parentPlanId: planArtifact.parentPlanId,
  };
};

interface WritePlanDocumentOptions {
  artifactPath: string;
  plan: ReturnType<typeof buildSkoposPlanArtifacts>['planArtifact'];
  dryRun: boolean;
}

const writePlanDocument = async ({
  artifactPath,
  plan,
  dryRun,
}: WritePlanDocumentOptions): Promise<'written' | 'dry-run'> => {
  if (dryRun) {
    return 'dry-run';
  }
  await mkdir(dirname(artifactPath), { recursive: true });
  const temporaryPath = `${artifactPath}.tmp`;
  await writeFile(temporaryPath, renderPlanDocument(plan), 'utf8');
  await rename(temporaryPath, artifactPath);
  return 'written';
};

const renderPlanDocument = (
  plan: ReturnType<typeof buildSkoposPlanArtifacts>['planArtifact'],
): string => {
  const date = (plan.updatedAt ?? new Date().toISOString()).slice(0, 10);
  const lines = [
    '---',
    `title: ${yamlString(plan.title)}`,
    'status: active',
    `owner: ${yamlString(plan.createdByActorId ?? 'project')}`,
    `id: ${yamlString(plan.id)}`,
    `scope: ${yamlString(plan.scope.scope.id)}`,
    'role: plan',
    'lifecycle: active',
    'authority: canonical',
    'provenance: accepted',
    'view: target',
    `lastUpdated: ${date}`,
    ...(plan.parentPlanId ? [`parentPlanId: ${yamlString(plan.parentPlanId)}`] : []),
    '---',
    '',
    `# ${plan.title}`,
    '',
    '## Changelog',
    '',
    `- \`${date}\`: Created and accepted this Plan through Skopos.`,
    '',
    '## Goal',
    '',
    plan.goal,
    '',
    '## Summary',
    '',
    plan.summary,
    '',
    '## Implementation',
    '',
    ...plan.implementationSteps.map(
      (step, index) => `${index + 1}. **${step.title}** — ${step.detail}`,
    ),
    '',
    '## Actions',
    '',
    ...(plan.recommendedActions.length > 0
      ? plan.recommendedActions.map((action) => `- \`${action.id}\`: ${action.reason}`)
      : ['- No project Action is preselected. Tasks derive their own Actions from changed scope.']),
    '',
    '## Decisions Needed',
    '',
    ...(plan.decisionQuestions.length > 0
      ? plan.decisionQuestions.map((question) => `- ${question.question}`)
      : ['- None at creation.']),
    '',
    '## Risks',
    '',
    ...(plan.risks.length > 0 ? plan.risks.map((risk) => `- ${risk}`) : ['- None identified.']),
    '',
    '## Next Steps',
    '',
    ...plan.nextSteps.map((step) => `- ${step}`),
    '',
  ];
  return `${lines.join('\n')}\n`;
};

const yamlString = (value: string): string => JSON.stringify(value);

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 56) || 'plan';

const resolvePlanActorId = (actor?: string): string | undefined => {
  const candidate = actor ?? process.env.SKOPOS_ACTOR;
  if (typeof candidate !== 'string') {
    return undefined;
  }

  const normalized = candidate.trim();
  return normalized.length > 0 ? normalized : undefined;
};
