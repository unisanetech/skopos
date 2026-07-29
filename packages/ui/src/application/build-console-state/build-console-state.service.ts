import { access, readFile, readdir } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

import type {
  SkoposContentIndexArtifact,
  SkoposDiscussionCheckpointArtifact,
  SkoposDiscussionIndexArtifact,
  SkoposDiscussionHandoffArtifact,
  SkoposEnforcementProfileArtifact,
  SkoposDriftReportArtifact,
  SkoposTaskArtifact,
  SkoposTaskQuestionArtifact,
  SkoposPlanArtifact,
  SkoposPolicyPackManifest,
  SkoposPolicyOverrideArtifact,
  SkoposPolicyRecommendationArtifact,
  SkoposPolicyRoleMappingArtifact,
  SkoposRepoUnderstandingSummaryArtifact,
  SkoposFeatureInventoryArtifact,
  SkoposImplementationHotspotsArtifact,
  SkoposUnderstandingSetupReviewArtifact,
  SkoposAgentCommunicationBriefArtifact,
  SkoposMemoryStateArtifact,
  SkoposResolvedGuardsArtifact,
  SkoposResolvedPolicyArtifact,
  SkoposResolvedSkillArtifact,
  SkoposSkillHostProjectionArtifact,
  SkoposSkillRecommendationArtifact,
  SkoposProofReportArtifact,
  SkoposScopesLiteArtifact,
} from '@skopos/model';
import {
  assessSkoposProjectReadinessRuntime,
  resolveCurrentTaskState,
} from '@skopos/runtime';

import { loadSkoposActivityArtifacts } from '../../adapters/activity-artifact-loader.adapter.js';
import { loadSkoposUiActivityViews } from '../load-activity-views/load-activity-views.service.js';
import { loadSkoposUiGraphViews } from '../load-graph-views/load-graph-views.service.js';
import { buildDocsLinks, buildDocuments } from './document-projections.js';
import { buildSkoposConsoleSearchIndex } from '../../support/search/console-search-index.js';
import type {
  SkoposUiConsoleTaskView,
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
  uiMode?: 'live' | 'snapshot';
  linkMode?: 'static' | 'dev-server';
  fileHrefBasePath?: string;
}

export const buildSkoposUiConsoleState = async ({
  cwd,
  outputDirectory,
  generatedAt = new Date().toISOString(),
  uiMode = 'snapshot',
  linkMode = 'static',
  fileHrefBasePath = '/__skopos/file',
}: BuildSkoposUiConsoleStateOptions): Promise<SkoposUiConsoleState> => {
  const workspaceRoot = resolve(cwd);
  const resolvedOutputDirectory = resolve(
    workspaceRoot,
    outputDirectory ?? '.skopos/ui/app',
  );
  const activityArtifacts = await loadSkoposActivityArtifacts(workspaceRoot);
  const { actorId: selectedActorId } = await resolveSkoposUiCurrentTaskRouting(workspaceRoot);
  const currentTaskState = await resolveCurrentTaskState({
    workspaceRoot,
    actorId: selectedActorId,
  });
  const [
    activity,
    graphs,
    readinessReport,
    artifactCounts,
    indexArtifact,
    scopesArtifact,
    proofReport,
    taskQuestions,
    adapterSupport,
    understanding,
    memoryView,
    policyReview,
    skillReview,
    latestDiscussionHandoff,
    discussionCheckpoints,
  ] =
    await Promise.all([
      loadSkoposUiActivityViews({ cwd: workspaceRoot }),
      loadSkoposUiGraphViews({ cwd: workspaceRoot }),
      assessSkoposProjectReadinessRuntime({ cwd: workspaceRoot }),
      collectArtifactCounts(workspaceRoot),
      loadJsonArtifact<SkoposContentIndexArtifact>(join(workspaceRoot, '.skopos', 'index', 'memory.json')),
      loadJsonArtifact<SkoposScopesLiteArtifact>(join(workspaceRoot, '.skopos', 'index', 'scopes.json')),
      loadJsonArtifact<SkoposProofReportArtifact>(
        join(workspaceRoot, '.skopos', 'evidence', 'proof', 'latest-report.json'),
      ),
      currentTaskState
        ? loadJsonArtifact<SkoposTaskQuestionArtifact>(
            currentTaskState.questionsPath,
          ).then((artifact) => artifact ?? undefined)
        : Promise.resolve(undefined),
      loadAdapterSupportView(workspaceRoot),
      loadUnderstandingView(workspaceRoot),
      loadMemoryView(workspaceRoot),
      loadPolicyReviewView(workspaceRoot),
      loadSkillReviewView(workspaceRoot),
      loadDiscussionHandoffView(currentTaskState?.handoffPath),
      loadDiscussionCheckpointViews(workspaceRoot),
    ]);

  const plans = buildTrackedPlanViews(workspaceRoot, indexArtifact, scopesArtifact)
    .sort((left, right) => sortByTimestamp(left.plan.updatedAt, right.plan.updatedAt));
  activity.plans = plans.slice(0, 5).map((planView) => ({
    id: planView.plan.id,
    title: planView.plan.title,
    goal: planView.plan.goal,
    summary: planView.plan.summary,
    parentPlanId: planView.plan.parentPlanId,
    scopeId: planView.plan.scope.scope.id,
    confidence: planView.plan.confidence,
    createdByActorId: planView.plan.createdByActorId,
    updatedAt: planView.plan.updatedAt,
    artifactPath: planView.artifactPath,
  }));
  const planById = new Map(plans.map((plan) => [plan.plan.id, plan]));
  const tasks = activityArtifacts.tasks
    .map((task) => buildTaskView(workspaceRoot, task, planById.get(task.planIds[0] ?? '')))
    .sort((left, right) => sortByTimestamp(left.task.updatedAt, right.task.updatedAt));
  const scopes = buildScopeViews(scopesArtifact, plans, tasks);
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
    uiMode,
    outputDirectory: resolvedOutputDirectory,
    generatedAt,
    artifactCounts,
    readinessReport,
    taskQuestions,
    indexArtifact,
    proofReport,
    activity,
    graphs,
    plans,
    tasks,
    scopes,
    adapterSupport,
    understanding,
    memoryView,
    policyReview,
    skillReview,
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

export const resolveSkoposUiCurrentTaskRouting = async (
  workspaceRoot: string,
): Promise<{
  taskId?: string;
  actorId?: string;
}> => {
  const currentTask = await resolveCurrentTaskState({ workspaceRoot });

  return {
    taskId: currentTask?.task.id,
    actorId: currentTask?.task.coordination.claimedBy?.actorId,
  };
};

const loadSkillReviewView = async (
  workspaceRoot: string,
): Promise<SkoposUiConsoleState['skillReview']> => {
  const resolvedPath = join(workspaceRoot, '.skopos', 'index', 'skills', 'resolved.json');
  const recommendationsPath = join(
    workspaceRoot,
    '.skopos',
    'index',
    'skills',
    'recommendations.json',
  );
  const projectionDirectory = join(workspaceRoot, '.skopos', 'index', 'skills', 'projections');
  const [resolved, recommendations, projectionNames] = await Promise.all([
    loadJsonArtifact<SkoposResolvedSkillArtifact>(resolvedPath),
    loadJsonArtifact<SkoposSkillRecommendationArtifact>(recommendationsPath),
    readdir(projectionDirectory).catch(() => [] as string[]),
  ]);
  const projections = (
    await Promise.all(
      projectionNames
        .filter((name) => name.endsWith('.json'))
        .sort()
        .map(async (name) => {
          const artifactPath = join(projectionDirectory, name);
          const projection =
            await loadJsonArtifact<SkoposSkillHostProjectionArtifact>(artifactPath);
          return projection ? { artifactPath, projection } : undefined;
        }),
    )
  ).filter(
    (
      entry,
    ): entry is {
      artifactPath: string;
      projection: SkoposSkillHostProjectionArtifact;
    } => Boolean(entry),
  );
  if (!resolved && !recommendations && projections.length === 0) return undefined;
  return {
    resolved: resolved ? { artifactPath: resolvedPath, skills: resolved } : undefined,
    recommendations: recommendations
      ? { artifactPath: recommendationsPath, recommendations }
      : undefined,
    projections,
  };
};

const loadUnderstandingView = async (
  workspaceRoot: string,
): Promise<SkoposUiConsoleState['understanding']> => {
  const summaryPath = join(workspaceRoot, '.skopos', 'index', 'understanding', 'repo-summary.json');
  const featureInventoryPath = join(workspaceRoot, '.skopos', 'index', 'understanding', 'feature-inventory.json');
  const hotspotsPath = join(workspaceRoot, '.skopos', 'index', 'understanding', 'hotspots.json');
  const setupReviewPath = join(workspaceRoot, '.skopos', 'index', 'understanding', 'setup-review.json');
  const [summary, featureInventory, hotspots, setupReview] = await Promise.all([
    loadJsonArtifact<SkoposRepoUnderstandingSummaryArtifact>(summaryPath),
    loadJsonArtifact<SkoposFeatureInventoryArtifact>(featureInventoryPath),
    loadJsonArtifact<SkoposImplementationHotspotsArtifact>(hotspotsPath),
    loadJsonArtifact<SkoposUnderstandingSetupReviewArtifact>(setupReviewPath),
  ]);

  if (!summary || !featureInventory || !hotspots) {
    return undefined;
  }

  return {
    summaryPath,
    featureInventoryPath,
    hotspotsPath,
    setupReviewPath: setupReview ? setupReviewPath : undefined,
    summary,
    featureInventory,
    hotspots,
    setupReview,
  };
};

const loadMemoryView = async (
  workspaceRoot: string,
): Promise<SkoposUiConsoleState['memoryView']> => {
  const memoryPath = join(workspaceRoot, '.skopos', 'index', 'roles.json');
  const communicationBriefPath = join(workspaceRoot, '.skopos', 'cache', 'agent', 'communication-brief.json');
  const [memory, communicationBrief] = await Promise.all([
    loadJsonArtifact<SkoposMemoryStateArtifact>(memoryPath),
    loadJsonArtifact<SkoposAgentCommunicationBriefArtifact>(communicationBriefPath),
  ]);

  if (!memory) {
    return undefined;
  }

  return {
    memoryPath,
    communicationBriefPath: communicationBrief ? communicationBriefPath : undefined,
    memory,
    communicationBrief,
  };
};

const loadPolicyReviewView = async (
  workspaceRoot: string,
): Promise<SkoposUiConsoleState['policyReview']> => {
  const resolvedPolicyPath = join(workspaceRoot, '.skopos', 'index', 'policies', 'resolved.json');
  const recommendationsPath = join(workspaceRoot, '.skopos', 'index', 'policies', 'recommendations.json');
  const overridesPath = join(workspaceRoot, '.skopos', 'index', 'policies', 'overrides.json');
  const roleMappingPath = join(workspaceRoot, '.skopos', 'index', 'policies', 'role-mapping.json');
  const driftReportPath = join(workspaceRoot, '.skopos', 'index', 'policies', 'drift.json');
  const guardsPath = join(workspaceRoot, '.skopos', 'index', 'guards.json');
  const [resolvedPolicy, recommendations, overrides, roleMapping, driftReport, guards] = await Promise.all([
    loadJsonArtifact<SkoposResolvedPolicyArtifact>(resolvedPolicyPath),
    loadJsonArtifact<SkoposPolicyRecommendationArtifact>(recommendationsPath),
    loadJsonArtifact<SkoposPolicyOverrideArtifact>(overridesPath),
    loadJsonArtifact<SkoposPolicyRoleMappingArtifact>(roleMappingPath),
    loadJsonArtifact<SkoposDriftReportArtifact>(driftReportPath),
    loadJsonArtifact<SkoposResolvedGuardsArtifact>(guardsPath),
  ]);
  const packManifests = await loadPolicyPackManifestViews({
    workspaceRoot,
    resolvedPolicy,
    recommendations,
  });

  if (!resolvedPolicy && !recommendations && !overrides && !roleMapping && !driftReport && !guards && packManifests.length === 0) {
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
    guards: guards
      ? {
          artifactPath: guardsPath,
          resolved: guards,
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

  for (const dependency of resolvedPolicy?.sourceDependencies ?? []) {
    candidatePaths.add(dependency.path);
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

const buildTrackedPlanViews = (
  workspaceRoot: string,
  indexArtifact: SkoposContentIndexArtifact | undefined,
  scopesArtifact: SkoposScopesLiteArtifact | undefined,
): SkoposUiConsolePlanView[] =>
  (indexArtifact?.documents ?? [])
    .filter(
      (document) =>
        document.role === 'plan' &&
        document.adoption === 'adopted' &&
        document.lifecycle === 'active',
    )
    .map((document) => {
      const scope =
        scopesArtifact?.scopes.find((candidate) => candidate.id === document.metadata?.scope) ??
        scopesArtifact?.scopes.find((candidate) => candidate.kind === 'workspace');
      if (!scope) return undefined;
      const summary = document.summary ?? `Durable Plan at ${document.path}.`;
      const plan: SkoposPlanArtifact = {
        schemaVersion: 1,
        id: document.metadata?.id ?? document.id,
        type: 'plan',
        status: 'active',
        authority: 'canonical',
        updatedAt: document.updatedAt,
        workspaceRoot,
        goal: summary,
        title: document.title,
        summary,
        scope: {
          query: document.metadata?.scope ?? scope.id,
          matchedBy: document.metadata?.scope ? 'id' : 'default-root',
          scope,
        },
        confidence: scope.confidence,
        references: [],
        implementationSteps: [],
        recommendedActions: [],
        decisionQuestions: [],
        risks: [],
        nextSteps: [],
        taskIds: [],
      };
      return {
        artifactPath: join(workspaceRoot, document.path),
        plan,
      };
    })
    .filter((plan): plan is SkoposUiConsolePlanView => Boolean(plan));

const buildTaskView = (
  workspaceRoot: string,
  task: SkoposTaskArtifact,
  plan?: SkoposUiConsolePlanView,
): SkoposUiConsoleTaskView => ({
  artifactPath: join(
    workspaceRoot,
    '.skopos',
    'tasks',
    task.taskIdentity.worktreeId,
    task.id,
    'task.json',
  ),
  task,
  plan,
});

const buildScopeViews = (
  scopesArtifact: SkoposScopesLiteArtifact | undefined,
  plans: SkoposUiConsolePlanView[],
  tasks: SkoposUiConsoleTaskView[],
): SkoposUiConsoleScopeView[] =>
  (scopesArtifact?.scopes ?? []).map((scope) => {
    const relatedPlanIds = plans
      .filter((plan) => plan.plan.scope.scope.id === scope.id)
      .map((plan) => plan.plan.id);
    const relatedTaskIds = tasks
      .filter((task) => task.task.scope.scope.id === scope.id)
      .map((task) => task.task.id);

    return {
      scope,
      relatedPlanIds,
      relatedTaskIds,
      relatedPlanCount: relatedPlanIds.length,
      relatedTaskCount: relatedTaskIds.length,
    };
  });

const loadDiscussionHandoffView = async (
  artifactPath?: string,
): Promise<SkoposUiConsoleDiscussionHandoffView | undefined> => {
  if (!artifactPath) {
    return undefined;
  }
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
  const artifactPath = join(workspaceRoot, '.skopos', 'index', 'enforcement.json');
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
    join(workspaceRoot, '.skopos', 'sessions', 'index.json'),
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
  plans: await countFiles(join(workspaceRoot, 'docs', 'work', 'plans'), '.md'),
  tasks: await countJsonArtifacts(join(workspaceRoot, '.skopos', 'tasks')),
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

const countFiles = async (directoryPath: string, extension: string): Promise<number> => {
  try {
    const entries = await readdir(directoryPath, { withFileTypes: true });
    const counts = await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? countFiles(join(directoryPath, entry.name), extension)
          : Number(entry.isFile() && entry.name.endsWith(extension)),
      ),
    );
    return counts.reduce((sum, count) => sum + count, 0);
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
