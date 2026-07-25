import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { loadSkoposWorkflowManifests, matchSkoposPlanWorkflows } from '@skopos/indexer';
import type { SkoposPlanRunResult } from '@skopos/model';
import {
  buildSkoposMissionGraph,
  buildSkoposPlan,
  buildSkoposPlanArtifacts,
  type SkoposPlanPackageValidationSurface,
} from '@skopos/planner';
import { buildSkoposContext, loadSkoposQueryState } from '@skopos/query';
import { buildSkoposTaskIdentity, resolveSkoposWorkspaceIdentity } from '@skopos/trust';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';

export interface BuildSkoposPlanRuntimeOptions {
  cwd: string;
  goal: string;
  scope?: string;
  dryRun?: boolean;
  actor?: string;
  parentPlanId?: string;
  parentMissionId?: string;
}

export const buildSkoposPlanRuntime = async ({
  cwd,
  goal,
  scope,
  dryRun = false,
  actor,
  parentPlanId,
  parentMissionId,
}: BuildSkoposPlanRuntimeOptions): Promise<SkoposPlanRunResult> => {
  const workspaceRoot = resolve(cwd);
  const { bootstrap, scopesLite } = await loadSkoposQueryState({
    cwd: workspaceRoot,
  });
  const context = await buildSkoposContext({
    cwd: workspaceRoot,
    scope,
  });
  const workflows = await loadSkoposWorkflowManifests({
    cwd: workspaceRoot,
  });
  const recommendedWorkflows = matchSkoposPlanWorkflows({
    workflows,
    goal,
    scope: context.scope,
  });
  const packageValidationSurfaces = await loadPackageValidationSurfaces({
    workspaceRoot,
    scopes: scopesLite.scopes,
  });

  const plan = buildSkoposPlan({
    workspaceRoot,
    goal,
    context,
    scanSummary: bootstrap.detected,
    config: bootstrap.recommendedConfig,
    recommendedWorkflows,
    packageValidationSurfaces,
  });
  const artifacts = buildSkoposPlanArtifacts({
    plan,
    actorId: resolvePlanActorId(actor),
    parentPlanId,
    parentMissionId,
  });
  const taskIdentity = buildSkoposTaskIdentity({
    workspace: await resolveSkoposWorkspaceIdentity(workspaceRoot),
    taskId: artifacts.missionArtifact.id,
    actorId: resolvePlanActorId(actor),
  });
  const planArtifact = {
    ...artifacts.planArtifact,
    taskIdentity,
  };
  const missionArtifact = {
    ...artifacts.missionArtifact,
    taskIdentity,
  };
  const missionGraph = buildSkoposMissionGraph({
    workspaceRoot,
    plan: planArtifact,
    mission: missionArtifact,
  });
  const planPath = join(workspaceRoot, '.skopos', 'plans', `${planArtifact.id}.json`);
  const missionPath = join(workspaceRoot, '.skopos', 'missions', `${missionArtifact.id}.json`);
  const graphPath = join(workspaceRoot, '.skopos', 'graph', `${missionArtifact.id}.json`);
  const planWrite = await writeArtifact({
    artifactPath: planPath,
    artifact: planArtifact,
    dryRun,
  });
  const missionWrite = await writeArtifact({
    artifactPath: missionPath,
    artifact: missionArtifact,
    dryRun,
  });
  const graphWrite = await writeJsonArtifact({
    artifactPath: graphPath,
    artifact: missionGraph,
    dryRun,
  });
  await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'plan',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary: `Built plan ${planArtifact.id} for ${plan.scope.scope.id}.`,
    relatedArtifactPaths: [planPath, missionPath, graphPath],
    metadata: {
      goal,
      scopeId: plan.scope.scope.id,
      actorId: resolvePlanActorId(actor) ?? null,
      missionId: missionArtifact.id,
      parentPlanId: parentPlanId ?? null,
      parentMissionId: parentMissionId ?? null,
      decisionQuestionCount: plan.decisionQuestions.length,
      recommendedWorkflowCount: plan.recommendedWorkflows.length,
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
    parentMissionId: planArtifact.parentMissionId,
    missionId: missionArtifact.id,
    missionPath,
    missionWrite,
    graphPath,
    graphWrite,
    mission: missionArtifact,
  };
};

interface WriteArtifactOptions {
  artifactPath: string;
  artifact: unknown;
  dryRun: boolean;
}

const writeArtifact = async ({
  artifactPath,
  artifact,
  dryRun,
}: WriteArtifactOptions): Promise<'written' | 'dry-run'> => {
  return writeJsonArtifact({
    artifactPath,
    artifact,
    dryRun,
  });
};

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
  const packageScopes = scopes.filter((scope) => scope.kind === 'package');
  const surfaces = await Promise.all(
    packageScopes.map(async (scope) => {
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
