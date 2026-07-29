import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import { loadSkoposActionManifests, matchSkoposPlanActions } from '@skopos/indexer';
import type { SkoposPlanResult, SkoposPlanRunResult } from '@skopos/model';
import {
  buildSkoposPlan,
  buildSkoposPlanArtifacts,
  type SkoposPlanPackageValidationSurface,
} from '@skopos/planner';
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
  const { bootstrap, scopesLite } = await loadSkoposQueryState({
    cwd: workspaceRoot,
  });
  const context = await buildSkoposContext({
    cwd: workspaceRoot,
    scope,
  });
  const actions = await loadSkoposActionManifests({
    cwd: workspaceRoot,
  });
  const recommendedActions = matchSkoposPlanActions({
    actions,
    goal,
    scope: context.scope,
  });
  const packageValidationSurfaces = await loadPackageValidationSurfaces({
    workspaceRoot,
    scopes: scopesLite.scopes,
  });

  return buildSkoposPlan({
    workspaceRoot,
    goal,
    context,
    scanSummary: bootstrap.detected,
    config: bootstrap.recommendedConfig,
    recommendedActions,
    packageValidationSurfaces,
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

const loadPackageValidationSurfaces = async ({
  workspaceRoot,
  scopes,
}: {
  workspaceRoot: string;
  scopes: Array<{ id: string; kind: string; title: string; aliases: string[]; path: string }>;
}): Promise<SkoposPlanPackageValidationSurface[]> => {
  const packageBackedScopes = scopes.filter((scope) => scope.kind !== 'workspace');
  const surfaces = await Promise.all(
    packageBackedScopes.map(async (scope) => {
      const manifestPath = join(workspaceRoot, scope.path, 'package.json');

      try {
        const parsed = JSON.parse(await readFile(manifestPath, 'utf8')) as {
          name?: unknown;
          scripts?: Record<string, unknown>;
        };
        const packageName =
          typeof parsed.name === 'string' && parsed.name.trim().length > 0
            ? parsed.name.trim()
            : null;
        if (!packageName) {
          return undefined;
        }

        const scripts = Object.entries(parsed.scripts ?? {})
          .filter(
            ([name, command]) =>
              typeof name === 'string' && typeof command === 'string' && command.trim(),
          )
          .map(([name]) => name);

        return {
          scopeId: scope.id,
          scopeTitle: scope.title,
          scopeAliases: scope.aliases,
          packageName,
          scripts,
          matchPhrases: buildPackageMatchPhrases([
            scope.id,
            scope.title,
            packageName,
            ...scope.aliases,
          ]),
        } satisfies SkoposPlanPackageValidationSurface;
      } catch {
        return undefined;
      }
    }),
  );

  return surfaces.filter((entry): entry is SkoposPlanPackageValidationSurface => Boolean(entry));
};

const buildPackageMatchPhrases = (values: string[]): string[] => {
  const phrases = new Set<string>();

  for (const value of values) {
    const trimmed = value.trim().toLowerCase();
    if (trimmed.length === 0) {
      continue;
    }

    addNormalizedMatchPhrase(phrases, trimmed);

    const withoutScopePrefix = trimmed.includes('/') ? trimmed.split('/').at(-1) : trimmed;
    if (withoutScopePrefix && withoutScopePrefix !== trimmed) {
      addNormalizedMatchPhrase(phrases, withoutScopePrefix);
    }
  }

  return [...phrases];
};

const addNormalizedMatchPhrase = (phrases: Set<string>, value: string): void => {
  const normalized = value.replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
  if (normalized.length >= 4 || normalized.includes(' ')) {
    phrases.add(normalized);
  }
};
