import { readFile, readdir } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

import type {
  SkoposContentIndexArtifact,
  SkoposDiscussionCheckpointArtifact,
  SkoposDiscussionIndexArtifact,
  SkoposDiscussionHandoffArtifact,
  SkoposEnforcementProfileArtifact,
  SkoposMissionArtifact,
  SkoposPlanArtifact,
  SkoposProgramStateArtifact,
  SkoposProofReportArtifact,
  SkoposScopesLiteArtifact,
} from '@skopos/model';
import { buildSkoposProgramSyncRuntime, buildSkoposTrustRuntime } from '@skopos/runtime';

import { loadSkoposActivityArtifacts } from '../../adapters/activity-artifact-loader.adapter.js';
import { loadSkoposUiActivityViews } from '../load-activity-views/load-activity-views.service.js';
import { loadSkoposUiGraphViews } from '../load-graph-views/load-graph-views.service.js';
import { buildDocsLinks, buildDocuments } from './document-projections.js';
import { buildSkoposConsoleSearchIndex } from '../../support/search/console-search-index.js';
import type {
  SkoposUiConsoleMissionView,
  SkoposUiConsolePlanView,
  SkoposUiConsoleDiscussionCheckpointView,
  SkoposUiConsoleScopeView,
  SkoposUiConsoleState,
  SkoposUiConsoleDiscussionHandoffView,
} from '../../contracts/skopos-ui-console-state.js';
import type { SkoposUiArtifactCounts } from '../../contracts/skopos-ui-portal.js';

export interface BuildSkoposUiConsoleStateOptions {
  cwd: string;
  outputDirectory?: string;
  generatedAt?: string;
  linkMode?: 'static' | 'dev-server';
  fileHrefBasePath?: string;
}

export const buildSkoposUiConsoleState = async ({
  cwd,
  outputDirectory,
  generatedAt = new Date().toISOString(),
  linkMode = 'static',
  fileHrefBasePath = '/__skopos/file',
}: BuildSkoposUiConsoleStateOptions): Promise<SkoposUiConsoleState> => {
  const workspaceRoot = resolve(cwd);
  const resolvedOutputDirectory = resolve(
    workspaceRoot,
    outputDirectory ?? 'docs/generated/skopos/app',
  );
  await buildSkoposProgramSyncRuntime({
    cwd: workspaceRoot,
  });
  const [
    activityArtifacts,
    activity,
    graphs,
    trustReport,
    artifactCounts,
    indexArtifact,
    scopesArtifact,
    proofReport,
    programState,
    adapterSupport,
    latestDiscussionHandoff,
    discussionCheckpoints,
  ] =
    await Promise.all([
      loadSkoposActivityArtifacts(workspaceRoot),
      loadSkoposUiActivityViews({ cwd: workspaceRoot }),
      loadSkoposUiGraphViews({ cwd: workspaceRoot }),
      buildSkoposTrustRuntime({ cwd: workspaceRoot }),
      collectArtifactCounts(workspaceRoot),
      loadJsonArtifact<SkoposContentIndexArtifact>(join(workspaceRoot, '.skopos', 'index.json')),
      loadJsonArtifact<SkoposScopesLiteArtifact>(join(workspaceRoot, '.skopos', 'scopes-lite.json')),
      loadJsonArtifact<SkoposProofReportArtifact>(
        join(workspaceRoot, '.skopos', 'proof', 'latest-report.json'),
      ),
      loadJsonArtifact<SkoposProgramStateArtifact>(
        join(workspaceRoot, '.skopos', 'program', 'state.json'),
      ),
      loadAdapterSupportView(workspaceRoot),
      loadDiscussionHandoffView(workspaceRoot),
      loadDiscussionCheckpointViews(workspaceRoot),
    ]);

  const plans = activityArtifacts.plans
    .map((plan) => buildPlanView(workspaceRoot, plan))
    .sort((left, right) => sortByTimestamp(left.plan.updatedAt, right.plan.updatedAt));
  const planById = new Map(plans.map((plan) => [plan.plan.id, plan]));
  const missions = activityArtifacts.missions
    .map((mission) => buildMissionView(workspaceRoot, mission, planById.get(mission.planId)))
    .sort((left, right) => sortByTimestamp(left.mission.updatedAt, right.mission.updatedAt));
  const scopes = buildScopeViews(scopesArtifact, plans, missions);
  const docsLinks = await buildDocsLinks({
    workspaceRoot,
    outputDirectory: resolvedOutputDirectory,
    indexArtifact,
    linkMode,
    fileHrefBasePath,
  });
  const documents = await buildDocuments(docsLinks);

  const stateWithoutSearch = {
    workspaceRoot,
    workspaceLabel: basename(workspaceRoot),
    outputDirectory: resolvedOutputDirectory,
    generatedAt,
    artifactCounts,
    trustReport,
    programState,
    indexArtifact,
    proofReport,
    activity,
    graphs,
    plans,
    missions,
    scopes,
    adapterSupport,
    latestDiscussionHandoff,
    discussionCheckpoints,
    docsLinks,
    documents,
  } satisfies Omit<SkoposUiConsoleState, 'searchIndex'>;

  return {
    ...stateWithoutSearch,
    searchIndex: buildSkoposConsoleSearchIndex(stateWithoutSearch),
  };
};

const buildPlanView = (
  workspaceRoot: string,
  plan: SkoposPlanArtifact,
): SkoposUiConsolePlanView => ({
  artifactPath: join(workspaceRoot, '.skopos', 'plans', `${plan.id}.json`),
  plan,
});

const buildMissionView = (
  workspaceRoot: string,
  mission: SkoposMissionArtifact,
  plan?: SkoposUiConsolePlanView,
): SkoposUiConsoleMissionView => ({
  artifactPath: join(workspaceRoot, '.skopos', 'missions', `${mission.id}.json`),
  mission,
  plan,
});

const buildScopeViews = (
  scopesArtifact: SkoposScopesLiteArtifact | undefined,
  plans: SkoposUiConsolePlanView[],
  missions: SkoposUiConsoleMissionView[],
): SkoposUiConsoleScopeView[] =>
  (scopesArtifact?.scopes ?? []).map((scope) => {
    const relatedPlanIds = plans
      .filter((plan) => plan.plan.scope.scope.id === scope.id)
      .map((plan) => plan.plan.id);
    const relatedMissionIds = missions
      .filter((mission) => mission.mission.scope.scope.id === scope.id)
      .map((mission) => mission.mission.id);

    return {
      scope,
      relatedPlanIds,
      relatedMissionIds,
      relatedPlanCount: relatedPlanIds.length,
      relatedMissionCount: relatedMissionIds.length,
    };
  });

const loadDiscussionHandoffView = async (
  workspaceRoot: string,
): Promise<SkoposUiConsoleDiscussionHandoffView | undefined> => {
  const artifactPath = join(workspaceRoot, '.skopos', 'discussions', 'handoffs', 'latest-workflow.json');
  const handoff = await loadJsonArtifact<SkoposDiscussionHandoffArtifact>(artifactPath);

  if (!handoff) {
    return undefined;
  }

  return {
    artifactPath,
    handoff,
  };
};

const loadAdapterSupportView = async (
  workspaceRoot: string,
): Promise<SkoposUiConsoleState['adapterSupport']> => {
  const artifactPath = join(workspaceRoot, '.skopos', 'enforcement.json');
  const enforcement = await loadJsonArtifact<SkoposEnforcementProfileArtifact>(artifactPath);

  if (!enforcement) {
    return undefined;
  }

  return {
    artifactPath,
    enforcement,
    adapters: enforcement.toolAdapters,
  };
};

const loadDiscussionCheckpointViews = async (
  workspaceRoot: string,
): Promise<SkoposUiConsoleDiscussionCheckpointView[]> => {
  const index = await loadJsonArtifact<SkoposDiscussionIndexArtifact>(
    join(workspaceRoot, '.skopos', 'discussions', 'index.json'),
  );

  if (!index) {
    return [];
  }

  const checkpoints = await Promise.all(
    index.entries.map(async (entry) => {
      const artifactPath = join(workspaceRoot, entry.artifactPath);
      const checkpoint = await loadJsonArtifact<SkoposDiscussionCheckpointArtifact>(artifactPath);
      if (!checkpoint) {
        return undefined;
      }

      return {
        artifactPath,
        checkpoint,
      } satisfies SkoposUiConsoleDiscussionCheckpointView;
    }),
  );

  return checkpoints.filter(
    (checkpoint): checkpoint is SkoposUiConsoleDiscussionCheckpointView => Boolean(checkpoint),
  );
};

const collectArtifactCounts = async (workspaceRoot: string): Promise<SkoposUiArtifactCounts> => ({
  plans: await countJsonArtifacts(join(workspaceRoot, '.skopos', 'plans')),
  missions: await countJsonArtifacts(join(workspaceRoot, '.skopos', 'missions')),
  runs: await countJsonArtifacts(join(workspaceRoot, '.skopos', 'runs')),
  graphArtifacts: await countJsonArtifacts(join(workspaceRoot, '.skopos', 'graph')),
});

const countJsonArtifacts = async (directoryPath: string): Promise<number> => {
  try {
    const entries = await readdir(directoryPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isFile() && entry.name.endsWith('.json')).length;
  } catch {
    return 0;
  }
};

const loadJsonArtifact = async <T>(artifactPath: string): Promise<T | undefined> => {
  try {
    const raw = await readFile(artifactPath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
};

const readTextDocument = async (artifactPath: string): Promise<string | undefined> => {
  try {
    return await readFile(artifactPath, 'utf8');
  } catch {
    return undefined;
  }
};

const sortByTimestamp = (left?: string, right?: string): number =>
  (Date.parse(right ?? '') || 0) - (Date.parse(left ?? '') || 0);
