import { access, readFile, readdir } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

import type {
  SkoposContentIndexArtifact,
  SkoposDiscussionCheckpointArtifact,
  SkoposDiscussionIndexArtifact,
  SkoposDiscussionHandoffArtifact,
  SkoposEnforcementProfileArtifact,
  SkoposDriftReportArtifact,
  SkoposMissionArtifact,
  SkoposPlanArtifact,
  SkoposPolicyPackManifest,
  SkoposPolicyOverrideArtifact,
  SkoposPolicyRecommendationArtifact,
  SkoposPolicyRoleMappingArtifact,
  SkoposRepoUnderstandingSummaryArtifact,
  SkoposFeatureInventoryArtifact,
  SkoposImplementationHotspotsArtifact,
  SkoposResolvedPolicyArtifact,
  SkoposProgramStateArtifact,
  SkoposProofReportArtifact,
  SkoposScopesLiteArtifact,
  SkoposWorkflowQuestionArtifact,
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
  SkoposUiConsolePolicyStructureMatchNode,
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
    workflowQuestions,
    adapterSupport,
    understanding,
    policyReview,
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
      loadJsonArtifact<SkoposWorkflowQuestionArtifact>(
        join(workspaceRoot, '.skopos', 'questions.json'),
      ),
      loadAdapterSupportView(workspaceRoot),
      loadUnderstandingView(workspaceRoot),
      loadPolicyReviewView(workspaceRoot),
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
    workflowQuestions,
    indexArtifact,
    proofReport,
    activity,
    graphs,
    plans,
    missions,
    scopes,
    adapterSupport,
    understanding,
    policyReview,
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

const loadUnderstandingView = async (
  workspaceRoot: string,
): Promise<SkoposUiConsoleState['understanding']> => {
  const summaryPath = join(workspaceRoot, '.skopos', 'understanding', 'repo-summary.json');
  const featureInventoryPath = join(workspaceRoot, '.skopos', 'understanding', 'feature-inventory.json');
  const hotspotsPath = join(workspaceRoot, '.skopos', 'understanding', 'hotspots.json');
  const [summary, featureInventory, hotspots] = await Promise.all([
    loadJsonArtifact<SkoposRepoUnderstandingSummaryArtifact>(summaryPath),
    loadJsonArtifact<SkoposFeatureInventoryArtifact>(featureInventoryPath),
    loadJsonArtifact<SkoposImplementationHotspotsArtifact>(hotspotsPath),
  ]);

  if (!summary || !featureInventory || !hotspots) {
    return undefined;
  }

  return {
    summaryPath,
    featureInventoryPath,
    hotspotsPath,
    summary,
    featureInventory,
    hotspots,
  };
};

const loadPolicyReviewView = async (
  workspaceRoot: string,
): Promise<SkoposUiConsoleState['policyReview']> => {
  const resolvedPolicyPath = join(workspaceRoot, '.skopos', 'policies', 'resolved.json');
  const recommendationsPath = join(workspaceRoot, '.skopos', 'policies', 'recommendations.json');
  const overridesPath = join(workspaceRoot, '.skopos', 'policies', 'overrides.json');
  const roleMappingPath = join(workspaceRoot, '.skopos', 'policies', 'role-mapping.json');
  const driftReportPath = join(workspaceRoot, '.skopos', 'drift', 'report.json');
  const [resolvedPolicy, recommendations, overrides, roleMapping, driftReport] = await Promise.all([
    loadJsonArtifact<SkoposResolvedPolicyArtifact>(resolvedPolicyPath),
    loadJsonArtifact<SkoposPolicyRecommendationArtifact>(recommendationsPath),
    loadJsonArtifact<SkoposPolicyOverrideArtifact>(overridesPath),
    loadJsonArtifact<SkoposPolicyRoleMappingArtifact>(roleMappingPath),
    loadJsonArtifact<SkoposDriftReportArtifact>(driftReportPath),
  ]);
  const packManifests = await loadPolicyPackManifestViews({
    workspaceRoot,
    resolvedPolicy,
    recommendations,
  });

  if (!resolvedPolicy && !recommendations && !overrides && !roleMapping && !driftReport && packManifests.length === 0) {
    return undefined;
  }

  return {
    resolvedPolicy: resolvedPolicy
      ? {
          artifactPath: resolvedPolicyPath,
          policy: resolvedPolicy,
        }
      : undefined,
    recommendations: recommendations
      ? {
          artifactPath: recommendationsPath,
          recommendations,
        }
      : undefined,
    overrides: overrides
      ? {
          artifactPath: overridesPath,
          overrides,
        }
      : undefined,
    roleMapping: roleMapping
      ? {
          artifactPath: roleMappingPath,
          mapping: roleMapping,
        }
      : undefined,
    driftReport: driftReport
      ? {
          artifactPath: driftReportPath,
          report: driftReport,
        }
      : undefined,
    packManifests,
  };
};

const loadPolicyPackManifestViews = async ({
  workspaceRoot,
  resolvedPolicy,
  recommendations,
}: {
  workspaceRoot: string;
  resolvedPolicy?: SkoposResolvedPolicyArtifact;
  recommendations?: SkoposPolicyRecommendationArtifact;
}): Promise<NonNullable<SkoposUiConsoleState['policyReview']>['packManifests']> => {
  const candidatePaths = new Set<string>();

  for (const manifestPath of await listPolicyPackManifestPaths(join(workspaceRoot, 'policy-packs'))) {
    candidatePaths.add(manifestPath);
  }

  for (const sourcePath of resolvedPolicy?.sourcePaths ?? []) {
    candidatePaths.add(sourcePath);
  }

  for (const recommendation of recommendations?.recommendations ?? []) {
    candidatePaths.add(recommendation.sourcePath);
  }

  const manifestViews = await Promise.all(
    [...candidatePaths].map(async (sourcePath) => {
      const artifactPath = resolve(workspaceRoot, sourcePath);
      const manifest = await loadJsonArtifact<SkoposPolicyPackManifest>(artifactPath);

      if (!manifest) {
        return undefined;
      }

      return {
        artifactPath,
        manifest,
        structureMatch: manifest.structureTree
          ? {
              title: manifest.structureTree.title,
              summary: manifest.structureTree.summary,
              rootLabel: manifest.structureTree.rootLabel,
              nodes: await Promise.all(
                manifest.structureTree.nodes.map((node) =>
                  buildStructureMatchNode(workspaceRoot, node),
                ),
              ),
            }
          : undefined,
      };
    }),
  );

  const seenPackIds = new Set<string>();

  return manifestViews.filter((view): view is NonNullable<typeof view> => {
    if (!view || seenPackIds.has(view.manifest.packId)) {
      return false;
    }

    seenPackIds.add(view.manifest.packId);
    return true;
  });
};

const listPolicyPackManifestPaths = async (directoryPath: string): Promise<string[]> => {
  try {
    const entries = await readdir(directoryPath, { withFileTypes: true });
    const nested = await Promise.all(
      entries.map(async (entry) => {
        const entryPath = join(directoryPath, entry.name);

        if (entry.isFile() && entry.name === 'pack.json') {
          return [entryPath];
        }

        if (entry.isDirectory()) {
          return listPolicyPackManifestPaths(entryPath);
        }

        return [];
      }),
    );

    return nested.flat().sort((left, right) => left.localeCompare(right));
  } catch {
    return [];
  }
};

const buildStructureMatchNode = async (
  workspaceRoot: string,
  node: SkoposPolicyPackManifest['structureTree'] extends infer T
    ? T extends { nodes: Array<infer U> }
      ? U
      : never
    : never,
): Promise<SkoposUiConsolePolicyStructureMatchNode> => {
  const matchPatterns = node.matchPaths && node.matchPaths.length > 0 ? node.matchPaths : [node.path];
  const patternMatches = await Promise.all(
    matchPatterns.map(async (pattern) => ({
      pattern,
      paths: await findExistingRelativePaths(workspaceRoot, pattern),
    })),
  );
  const matchedPaths = patternMatches.flatMap((match) => match.paths).sort((left, right) => left.localeCompare(right));
  const uniqueMatchedPaths = [...new Set(matchedPaths)];
  const matchedPatterns = patternMatches
    .filter((match) => match.paths.length > 0)
    .map((match) => match.pattern)
    .sort((left, right) => left.localeCompare(right));
  const required = node.required ?? false;

  return {
    path: node.path,
    label: node.label,
    responsibility: node.responsibility,
    required,
    checkedPatterns: matchPatterns,
    matchedPatterns,
    matchedPaths: uniqueMatchedPaths,
    status: uniqueMatchedPaths.length > 0 ? 'matched' : required ? 'missing' : 'optional',
    children: await Promise.all(
      (node.children ?? []).map((child) => buildStructureMatchNode(workspaceRoot, child)),
    ),
  };
};

const findExistingRelativePaths = async (
  workspaceRoot: string,
  pattern: string,
): Promise<string[]> => {
  const segments = pattern.split(/[\\/]+/).filter(Boolean);
  const matches = await expandPathPattern(workspaceRoot, segments);

  return matches.map((match) => relativePathFromWorkspace(workspaceRoot, match));
};

const expandPathPattern = async (
  basePath: string,
  segments: string[],
): Promise<string[]> => {
  if (segments.length === 0) {
    return (await pathExists(basePath)) ? [basePath] : [];
  }

  const [segment, ...remainingSegments] = segments;

  if (segment === '*') {
    const childDirectories = await readChildDirectoryPaths(basePath);
    const nestedMatches = await Promise.all(
      childDirectories.map((childPath) => expandPathPattern(childPath, remainingSegments)),
    );

    return nestedMatches.flat();
  }

  return expandPathPattern(join(basePath, segment), remainingSegments);
};

const readChildDirectoryPaths = async (directoryPath: string): Promise<string[]> => {
  try {
    const entries = await readdir(directoryPath, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => join(directoryPath, entry.name));
  } catch {
    return [];
  }
};

const pathExists = async (candidatePath: string): Promise<boolean> => {
  try {
    await access(candidatePath);
    return true;
  } catch {
    return false;
  }
};

const relativePathFromWorkspace = (workspaceRoot: string, absolutePath: string): string => {
  const relativePath = absolutePath.replace(`${workspaceRoot}/`, '');

  return relativePath === absolutePath ? absolutePath : relativePath;
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
