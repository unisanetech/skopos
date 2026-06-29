import { appendFile, mkdir, readFile, readdir } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

import { loadSkoposWorkflowManifests } from '@skopos/indexer';
import type {
  SkoposAgentDoneBriefArtifact,
  SkoposAgentEvalBriefArtifact,
  SkoposAgentMissionBriefArtifact,
  SkoposAgentPromptBriefArtifact,
  SkoposAgentProgramBriefArtifact,
  SkoposAgentTrustBriefArtifact,
  SkoposAgentAnalysisBriefArtifact,
  SkoposAgentCommunicationBriefArtifact,
  SkoposArchitectureReport,
  SkoposBootstrapArtifact,
  SkoposContradictionReferenceArtifact,
  SkoposContentIndexArtifact,
  SkoposContentIndexEntry,
  SkoposEnforcementProfileArtifact,
  SkoposDuplicateReferenceArtifact,
  SkoposDiscussionCheckpointArtifact,
  SkoposDiscussionIndexArtifact,
  SkoposDiscussionHandoffArtifact,
  SkoposMissionArtifact,
  SkoposOperationalLogEntry,
  SkoposOperationalLogEventKind,
  SkoposOperationalLogStatus,
  SkoposOverrideArtifact,
  SkoposPlanArtifact,
  SkoposScopesLiteArtifact,
  SkoposTrustLevel,
  SkoposReadiness,
  SkoposSymbolReferenceArtifact,
  SkoposTokenTelemetryArtifact,
  SkoposRepoUnderstandingSummaryArtifact,
  SkoposFeatureInventoryArtifact,
  SkoposImplementationHotspotsArtifact,
  SkoposUnderstandingSetupReviewArtifact,
  SkoposUnderstandingSetupAnswersArtifact,
  SkoposMemoryStateArtifact,
  SkoposWorkflowRunArtifact,
} from '@skopos/model';

import { writeJsonArtifact } from './write-json-artifact.js';

interface AppendSkoposOperationalLogEntryOptions {
  workspaceRoot: string;
  eventKind: SkoposOperationalLogEventKind;
  status: SkoposOperationalLogStatus;
  summary: string;
  relatedArtifactPaths?: string[];
  metadata?: Record<string, string | number | boolean | null>;
  dryRun?: boolean;
}

export interface SkoposOperationalLogWriteResult {
  path: string;
  write: 'written' | 'dry-run';
  entry: SkoposOperationalLogEntry;
}

interface RefreshSkoposKnowledgeIndexOptions {
  workspaceRoot: string;
  dryRun?: boolean;
}

export interface SkoposKnowledgeIndexWriteResult {
  path: string;
  write: 'written' | 'dry-run';
  artifact: SkoposContentIndexArtifact;
}

const LOG_PATH = '.skopos/log.jsonl';
const INDEX_PATH = '.skopos/index.json';

export const appendSkoposOperationalLogEntry = async ({
  workspaceRoot,
  eventKind,
  status,
  summary,
  relatedArtifactPaths = [],
  metadata,
  dryRun = false,
}: AppendSkoposOperationalLogEntryOptions): Promise<SkoposOperationalLogWriteResult> => {
  const resolvedWorkspaceRoot = resolve(workspaceRoot);
  const timestamp = new Date().toISOString();
  const logPath = join(resolvedWorkspaceRoot, LOG_PATH);
  const entry: SkoposOperationalLogEntry = {
    schemaVersion: 1,
    id: `${eventKind}-${timestamp.replace(/[-:.]/g, '').replace('Z', 'z')}-${process.pid}`,
    type: 'log-entry',
    workspaceRoot: resolvedWorkspaceRoot,
    eventKind,
    status,
    timestamp,
    summary,
    relatedArtifactPaths: relatedArtifactPaths.map((path) =>
      normalizeWorkspacePath(resolvedWorkspaceRoot, path),
    ),
    metadata,
  };

  if (dryRun) {
    return {
      path: logPath,
      write: 'dry-run',
      entry,
    };
  }

  await mkdir(dirname(logPath), { recursive: true });
  await appendFile(logPath, `${JSON.stringify(entry)}\n`, 'utf8');

  return {
    path: logPath,
    write: 'written',
    entry,
  };
};

export const refreshSkoposKnowledgeIndex = async ({
  workspaceRoot,
  dryRun = false,
}: RefreshSkoposKnowledgeIndexOptions): Promise<SkoposKnowledgeIndexWriteResult> => {
  const resolvedWorkspaceRoot = resolve(workspaceRoot);
  const indexPath = join(resolvedWorkspaceRoot, INDEX_PATH);
  const artifact = await buildSkoposKnowledgeIndex(resolvedWorkspaceRoot);
  const write = await writeJsonArtifact({
    artifactPath: indexPath,
    artifact,
    dryRun,
  });

  return {
    path: indexPath,
    write,
    artifact,
  };
};

const buildSkoposKnowledgeIndex = async (
  workspaceRoot: string,
): Promise<SkoposContentIndexArtifact> => {
  const bootstrap = await loadJsonArtifact<SkoposBootstrapArtifact>(
    join(workspaceRoot, '.skopos', 'bootstrap.json'),
  );
  const scopesLite = await loadJsonArtifact<SkoposScopesLiteArtifact>(
    join(workspaceRoot, '.skopos', 'scopes-lite.json'),
  );
  const architecture = await loadJsonArtifact<SkoposArchitectureReport>(
    join(workspaceRoot, '.skopos', 'architecture.json'),
  );
  const symbols = await loadJsonArtifact<SkoposSymbolReferenceArtifact>(
    join(workspaceRoot, '.skopos', 'references', 'symbols.json'),
  );
  const duplicates = await loadJsonArtifact<SkoposDuplicateReferenceArtifact>(
    join(workspaceRoot, '.skopos', 'references', 'duplicates.json'),
  );
  const contradictions = await loadJsonArtifact<SkoposContradictionReferenceArtifact>(
    join(workspaceRoot, '.skopos', 'references', 'contradictions.json'),
  );
  const overrides = await loadJsonArtifact<SkoposOverrideArtifact>(
    join(workspaceRoot, '.skopos', 'overrides.json'),
  );
  const graphEntries = await loadDirectoryArtifacts(join(workspaceRoot, '.skopos', 'graph'), workspaceRoot);
  const agentEvalBriefs = await loadDirectoryArtifacts<SkoposAgentEvalBriefArtifact>(
    join(workspaceRoot, '.skopos', 'agent', 'evals'),
    workspaceRoot,
  );
  const agentMissionBriefs = await loadDirectoryArtifacts<SkoposAgentMissionBriefArtifact>(
    join(workspaceRoot, '.skopos', 'agent', 'missions'),
    workspaceRoot,
  );
  const plans = await loadDirectoryArtifacts<SkoposPlanArtifact>(
    join(workspaceRoot, '.skopos', 'plans'),
    workspaceRoot,
  );
  const missions = await loadDirectoryArtifacts<SkoposMissionArtifact>(
    join(workspaceRoot, '.skopos', 'missions'),
    workspaceRoot,
  );
  const workflowRuns = await loadDirectoryArtifacts<SkoposWorkflowRunArtifact>(
    join(workspaceRoot, '.skopos', 'runs'),
    workspaceRoot,
  );
  const evals = await loadDirectoryArtifacts(join(workspaceRoot, '.skopos', 'evals'), workspaceRoot);
  const workflows = await loadSkoposWorkflowManifests({
    cwd: workspaceRoot,
  });
  const logEntries = await loadOperationalLogEntries(workspaceRoot);
  const latestEvent = logEntries.at(-1);
  const latestTrustEvent = [...logEntries]
    .reverse()
    .find((entry) => entry.eventKind === 'trust' || entry.eventKind === 'done');
  const docsRoot = bootstrap?.recommendedConfig?.docs.root;
  const docsStartHerePath =
    docsRoot && bootstrap?.detected?.docsHealth.hasStartHere
      ? bootstrap.recommendedConfig.docs.startHerePath ?? join(docsRoot, '00-start-here.md')
      : undefined;
  const coreEntries: SkoposContentIndexEntry[] = [];
  const referenceEntries: SkoposContentIndexEntry[] = [];
  const agentBriefEntries: SkoposContentIndexEntry[] = [];
  const trustBrief = await loadJsonArtifact<SkoposAgentTrustBriefArtifact>(
    join(workspaceRoot, '.skopos', 'agent', 'trust-brief.json'),
  );
  const doneBrief = await loadJsonArtifact<SkoposAgentDoneBriefArtifact>(
    join(workspaceRoot, '.skopos', 'agent', 'done-brief.json'),
  );
  const programBrief = await loadJsonArtifact<SkoposAgentProgramBriefArtifact>(
    join(workspaceRoot, '.skopos', 'agent', 'program-brief.json'),
  );
  const promptBrief = await loadJsonArtifact<SkoposAgentPromptBriefArtifact>(
    join(workspaceRoot, '.skopos', 'agent', 'prompt-brief.json'),
  );
  const communicationBrief = await loadJsonArtifact<SkoposAgentCommunicationBriefArtifact>(
    join(workspaceRoot, '.skopos', 'agent', 'communication-brief.json'),
  );
  const memoryState = await loadJsonArtifact<SkoposMemoryStateArtifact>(
    join(workspaceRoot, '.skopos', 'memory', 'state.json'),
  );
  const tokenTelemetry = await loadJsonArtifact<SkoposTokenTelemetryArtifact>(
    join(workspaceRoot, '.skopos', 'agent', 'token-telemetry.json'),
  );
  const agentAnalysisBrief = await loadJsonArtifact<SkoposAgentAnalysisBriefArtifact>(
    join(workspaceRoot, '.skopos', 'understanding', 'agent-analysis-brief.json'),
  );
  const repoSummary = await loadJsonArtifact<SkoposRepoUnderstandingSummaryArtifact>(
    join(workspaceRoot, '.skopos', 'understanding', 'repo-summary.json'),
  );
  const featureInventory = await loadJsonArtifact<SkoposFeatureInventoryArtifact>(
    join(workspaceRoot, '.skopos', 'understanding', 'feature-inventory.json'),
  );
  const hotspots = await loadJsonArtifact<SkoposImplementationHotspotsArtifact>(
    join(workspaceRoot, '.skopos', 'understanding', 'hotspots.json'),
  );
  const setupReview = await loadJsonArtifact<SkoposUnderstandingSetupReviewArtifact>(
    join(workspaceRoot, '.skopos', 'understanding', 'setup-review.json'),
  );
  const setupAnswers = await loadJsonArtifact<SkoposUnderstandingSetupAnswersArtifact>(
    join(workspaceRoot, '.skopos', 'understanding', 'setup-answers.json'),
  );
  const discussionIndex = await loadJsonArtifact<SkoposDiscussionIndexArtifact>(
    join(workspaceRoot, '.skopos', 'discussions', 'index.json'),
  );
  const latestHandoff = await loadJsonArtifact<SkoposDiscussionHandoffArtifact>(
    join(workspaceRoot, '.skopos', 'discussions', 'handoffs', 'latest-workflow.json'),
  );
  const discussionCheckpoints = await loadDirectoryArtifacts<SkoposDiscussionCheckpointArtifact>(
    join(workspaceRoot, '.skopos', 'discussions', 'checkpoints'),
    workspaceRoot,
  );

  coreEntries.push({
    id: 'config',
    kind: 'config',
    title: 'Root config',
    summary: 'Canonical Skopos workspace config.',
    path: 'skopos.config.yaml',
  });

  if (docsStartHerePath) {
    coreEntries.push({
      id: 'docs-start-here',
      kind: 'doc-router',
      title: 'Start here',
      summary: 'Canonical human docs router.',
      path: docsStartHerePath,
      updatedAt: bootstrap?.updatedAt,
    });
  }

  if (bootstrap) {
    coreEntries.push(
      buildIndexEntry(
        workspaceRoot,
        'bootstrap',
        'core-artifact',
        'Bootstrap',
        'Compiled bootstrap state.',
        '.skopos/bootstrap.json',
        bootstrap.updatedAt,
      ),
    );
  }

  if (scopesLite) {
    coreEntries.push(
      buildIndexEntry(
        workspaceRoot,
        'scopes-lite',
        'core-artifact',
        'Scopes',
        'Compact scope registry.',
        '.skopos/scopes-lite.json',
        scopesLite.updatedAt,
      ),
    );
  }

  if (architecture) {
    coreEntries.push(
      buildIndexEntry(
        workspaceRoot,
        'architecture',
        'core-artifact',
        'Architecture',
        `${architecture.alignmentStatus} architecture interpretation.`,
        '.skopos/architecture.json',
        architecture.updatedAt,
      ),
    );
  }

  const optionalCoreArtifacts: Array<[id: string, title: string, summary: string, path: string]> = [
    ['diagnosis', 'Diagnosis', 'Pattern and remediation report.', '.skopos/diagnosis.json'],
    ['enforcement', 'Enforcement', 'Tool-native enforcement profile.', '.skopos/enforcement.json'],
    ['questions', 'Workflow questions', 'Open and resolved workflow decisions.', '.skopos/questions.json'],
    [
      'recommendations',
      'Workflow recommendations',
      'Recommended next actions for the active workflow state.',
      '.skopos/recommendations.json',
    ],
    [
      'program-state',
      'Program state',
      'Sequenced program-control state for active work, queued findings, and derived obligations.',
      '.skopos/program/state.json',
    ],
  ];

  for (const [id, title, summary, path] of optionalCoreArtifacts) {
    const artifact = await loadJsonArtifact<{ updatedAt?: string }>(join(workspaceRoot, path));
    if (!artifact) {
      continue;
    }

    coreEntries.push(
      buildIndexEntry(workspaceRoot, id, 'core-artifact', title, summary, path, artifact.updatedAt),
    );
  }

  const topLevelAgentBriefs: Array<
    [id: string, title: string, summary: string, path: string, artifact: { updatedAt?: string } | null]
  > = [
    [
      'agent-brief-trust',
      'Trust brief',
      'Compact agent-safe projection of current trust state.',
      '.skopos/agent/trust-brief.json',
      trustBrief,
    ],
    [
      'agent-brief-done',
      'Done brief',
      'Compact agent-safe projection of closure state.',
      '.skopos/agent/done-brief.json',
      doneBrief,
    ],
    [
      'agent-brief-program',
      'Program brief',
      'Compact agent-safe projection of current program routing state.',
      '.skopos/agent/program-brief.json',
      programBrief,
    ],
    [
      'agent-brief-prompt',
      'Prompt brief',
      'Compact prompt-layer and token-budget guidance for agent context loading.',
      '.skopos/agent/prompt-brief.json',
      promptBrief,
    ],
    [
      'agent-brief-communication',
      'Agent communication brief',
      'Project-specific guidance for how coding agents should explain, ask, progress, validate, and close work.',
      '.skopos/agent/communication-brief.json',
      communicationBrief,
    ],
  ];

  for (const [id, title, summary, path, artifact] of topLevelAgentBriefs) {
    if (!artifact) {
      continue;
    }

    agentBriefEntries.push(
      buildIndexEntry(
        workspaceRoot,
        id,
        'agent-brief-artifact',
        title,
        summary,
        path,
        artifact.updatedAt,
      ),
    );
  }

  if (tokenTelemetry) {
    coreEntries.push(
      buildIndexEntry(
        workspaceRoot,
        'token-telemetry',
        'telemetry-artifact',
        'Token telemetry',
        'Compact budget diagnosis for agent briefs, handoffs, and resume context.',
        '.skopos/agent/token-telemetry.json',
        tokenTelemetry.updatedAt,
      ),
    );
  }

  if (memoryState) {
    coreEntries.push(
      buildIndexEntry(
        workspaceRoot,
        'memory-state',
        'core-artifact',
        'Project memory',
        memoryState.summary,
        '.skopos/memory/state.json',
        memoryState.updatedAt,
      ),
    );
  }

  if (latestHandoff) {
    coreEntries.push(
      buildIndexEntry(
        workspaceRoot,
        'discussion-handoff-latest-workflow',
        'discussion-artifact',
        'Latest workflow handoff',
        'Compact workflow resume packet for cross-thread continuation.',
        '.skopos/discussions/handoffs/latest-workflow.json',
        latestHandoff.updatedAt,
      ),
    );
  }

  const understandingEntries: Array<
    [id: string, title: string, summary: string, path: string, artifact: { updatedAt?: string } | null]
  > = [
    [
      'understanding-agent-analysis-brief',
      'Agent analysis brief',
      agentAnalysisBrief?.summary ?? 'Agent-guided project analysis instructions and durable output checklist.',
      '.skopos/understanding/agent-analysis-brief.json',
      agentAnalysisBrief,
    ],
    [
      'understanding-repo-summary',
      'Repo understanding',
      repoSummary?.summary ?? 'Compact synthesized project orientation.',
      '.skopos/understanding/repo-summary.json',
      repoSummary,
    ],
    [
      'understanding-feature-inventory',
      'Feature inventory',
      featureInventory?.summary ?? 'Compact feature area inventory.',
      '.skopos/understanding/feature-inventory.json',
      featureInventory,
    ],
    [
      'understanding-hotspots',
      'Implementation hotspots',
      hotspots?.summary ?? 'Compact implementation hotspot inventory.',
      '.skopos/understanding/hotspots.json',
      hotspots,
    ],
    [
      'understanding-setup-review',
      'Setup review',
      setupReview?.summary ?? 'Facts, inferences, assumptions, and setup questions after init.',
      '.skopos/understanding/setup-review.json',
      setupReview,
    ],
    [
      'understanding-setup-answers',
      'Setup answers',
      setupAnswers?.summary ?? 'Confirmed setup-review answers.',
      '.skopos/understanding/setup-answers.json',
      setupAnswers,
    ],
  ];

  for (const [id, title, summary, path, artifact] of understandingEntries) {
    if (!artifact) {
      continue;
    }

    coreEntries.push(
      buildIndexEntry(
        workspaceRoot,
        id,
        'understanding-artifact',
        title,
        summary,
        path,
        artifact.updatedAt,
      ),
    );
  }

  if (discussionIndex) {
    coreEntries.push(
      buildIndexEntry(
        workspaceRoot,
        'discussion-index',
        'discussion-artifact',
        'Discussion index',
        `${discussionIndex.checkpointCount} checkpoint${discussionIndex.checkpointCount === 1 ? '' : 's'} available for routed history and resume state.`,
        '.skopos/discussions/index.json',
        discussionIndex.updatedAt,
      ),
    );
  }

  const recentDiscussionCheckpointEntries = discussionCheckpoints
    .sort((left, right) => compareArtifactUpdatedAt(left.updatedAt, right.updatedAt))
    .slice(0, 6)
    .map((artifact) =>
      buildIndexEntry(
        workspaceRoot,
        artifact.id,
        'discussion-artifact',
        artifact.activeMissionId ? `Discussion checkpoint: ${artifact.activeMissionId}` : 'Discussion checkpoint',
        artifact.resumeSummary,
        `.skopos/discussions/checkpoints/${artifact.id}.json`,
        artifact.updatedAt,
      ),
    );
  coreEntries.push(...recentDiscussionCheckpointEntries);

  if (overrides) {
    coreEntries.push(
      buildIndexEntry(
        workspaceRoot,
        'overrides',
        'override-artifact',
        'Overrides',
        `${overrides.entries.length} declared canonical override${overrides.entries.length === 1 ? '' : 's'}.`,
        '.skopos/overrides.json',
        overrides.updatedAt,
      ),
    );
  }

  const optionalReferenceArtifacts: Array<
    [id: string, title: string, summary: string, path: string, artifact: { updatedAt?: string } | null]
  > = [
    [
      'symbols',
      'Symbols',
      `${symbols?.entries.length ?? 0} exported symbol references across ${symbols?.packages.length ?? 0} packages.`,
      '.skopos/references/symbols.json',
      symbols,
    ],
    [
      'duplicates',
      'Duplicates',
      `${duplicates?.entries.length ?? 0} duplicate references requiring exact ownership clarity.`,
      '.skopos/references/duplicates.json',
      duplicates,
    ],
    [
      'contradictions',
      'Contradictions',
      `${contradictions?.entries.length ?? 0} contradiction references derived from diagnosis and architecture state.`,
      '.skopos/references/contradictions.json',
      contradictions,
    ],
  ];

  for (const [id, title, summary, path, artifact] of optionalReferenceArtifacts) {
    if (!artifact) {
      continue;
    }

    referenceEntries.push(
      buildIndexEntry(
        workspaceRoot,
        id,
        'reference-artifact',
        title,
        summary,
        path,
        artifact.updatedAt,
      ),
    );
  }

  const graphIndexEntries = graphEntries
    .map((artifact) =>
      buildIndexEntry(
        workspaceRoot,
        artifact.id ?? artifact.fileName.replace(/\.json$/, ''),
        'graph-artifact',
        `${toTitleCase(artifact.fileName.replace(/\.json$/, ''))} graph`,
        artifact.summary ?? 'Typed graph projection.',
        artifact.relativePath,
        artifact.updatedAt,
      ),
    )
    .sort(sortByUpdatedAtDesc);

  const recentPlanEntries = plans
    .map((artifact) =>
      buildIndexEntry(
        workspaceRoot,
        artifact.id,
        'plan-artifact',
        artifact.title,
        artifact.summary,
        join('.skopos', 'plans', `${artifact.id}.json`),
        artifact.updatedAt,
      ),
    )
    .sort(sortByUpdatedAtDesc)
    .slice(0, 3);

  const recentMissionEntries = missions
    .map((artifact) =>
      buildIndexEntry(
        workspaceRoot,
        artifact.id,
        'mission-artifact',
        artifact.title,
        `${artifact.state} mission for ${artifact.scope.scope.id}.`,
        join('.skopos', 'missions', `${artifact.id}.json`),
        artifact.updatedAt,
      ),
    )
    .sort(sortByUpdatedAtDesc)
    .slice(0, 3);

  const recentWorkflowRunEntries = workflowRuns
    .map((artifact) =>
      buildIndexEntry(
        workspaceRoot,
        artifact.id,
        'workflow-run-artifact',
        artifact.workflowTitle,
        `${artifact.runStatus} workflow run.`,
        join('.skopos', 'runs', `${artifact.id}.json`),
        artifact.finishedAt ?? artifact.updatedAt,
      ),
    )
    .sort(sortByUpdatedAtDesc)
    .slice(0, 5);

  const recentEvalEntries = evals
    .map((artifact) =>
      buildIndexEntry(
        workspaceRoot,
        artifact.id ?? artifact.fileName.replace(/\.json$/, ''),
        'core-artifact',
        artifact.id?.startsWith('eval-')
          ? artifact.id.replace(/^eval-/, '').replace(/-/g, ' ')
          : 'Mission eval',
        artifact.summary ?? 'Mission evaluation artifact.',
        artifact.relativePath,
        artifact.updatedAt,
      ),
    )
    .sort(sortByUpdatedAtDesc)
    .slice(0, 3);

  const recentAgentEvalBriefEntries = agentEvalBriefs
    .map((artifact) =>
      buildIndexEntry(
        workspaceRoot,
        artifact.id ?? artifact.fileName.replace(/\.json$/, ''),
        'agent-brief-artifact',
        `Eval brief ${artifact.missionId ?? artifact.fileName.replace(/\.json$/, '')}`,
        artifact.summary ?? 'Compact agent-safe evaluation projection.',
        artifact.relativePath,
        artifact.updatedAt,
      ),
    )
    .sort(sortByUpdatedAtDesc)
    .slice(0, 3);

  const recentAgentMissionBriefEntries = agentMissionBriefs
    .map((artifact) =>
      buildIndexEntry(
        workspaceRoot,
        artifact.id ?? artifact.fileName.replace(/\.json$/, ''),
        'agent-brief-artifact',
        `Mission brief ${artifact.missionId ?? artifact.fileName.replace(/\.json$/, '')}`,
        artifact.summary ?? 'Compact agent-safe mission projection.',
        artifact.relativePath,
        artifact.updatedAt,
      ),
    )
    .sort(sortByUpdatedAtDesc)
    .slice(0, 3);

  const toolAdapterEntries = (
    (
      await loadJsonArtifact<SkoposEnforcementProfileArtifact>(
        join(workspaceRoot, '.skopos', 'enforcement.json'),
      )
    )?.toolAdapters ?? []
  ).map((adapter) =>
    buildIndexEntry(
      workspaceRoot,
      `tool-adapter-${adapter.toolId}`,
      'tool-adapter',
      `${adapter.displayName} adapter`,
      adapter.summary,
      adapter.path,
    ),
  );

  return {
    schemaVersion: 1,
    id: 'knowledge-index',
    type: 'index',
    status: 'generated',
    authority: 'generated',
    summary: 'Compact compiled knowledge index for Skopos runtime state.',
    updatedAt: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    focusSubtree: bootstrap?.focusSubtree,
    docsRoot,
    readiness: parseReadiness(latestTrustEvent?.metadata?.readiness),
    trustLevel: parseTrustLevel(latestTrustEvent?.metadata?.trustLevel),
    counts: {
      packageCount: bootstrap?.detected?.packageCount ?? 0,
      workspacePackageCount: bootstrap?.detected?.workspacePackageCount ?? 0,
      scopeCount: scopesLite?.scopes?.length ?? 0,
      agentBriefCount: agentBriefEntries.length + agentEvalBriefs.length + agentMissionBriefs.length,
      referenceArtifactCount: referenceEntries.length,
      graphCount: graphEntries.length,
      planCount: plans.length,
      missionCount: missions.length,
      workflowRunCount: workflowRuns.length,
      workflowManifestCount: workflows.length,
      overrideEntryCount: overrides?.entries.length ?? 0,
    },
    quickLinks: {
      configPath: 'skopos.config.yaml',
      bootstrapPath: bootstrap ? '.skopos/bootstrap.json' : undefined,
      docsStartHerePath,
      overridesPath: overrides ? '.skopos/overrides.json' : undefined,
      logPath: LOG_PATH,
    },
    latestEvent: latestEvent
      ? {
          id: latestEvent.id,
          eventKind: latestEvent.eventKind,
          status: latestEvent.status,
          timestamp: latestEvent.timestamp,
          summary: latestEvent.summary,
        }
      : undefined,
    entries: [
      ...coreEntries,
      ...agentBriefEntries,
      ...referenceEntries,
      ...graphIndexEntries,
      ...recentPlanEntries,
      ...recentMissionEntries,
      ...recentWorkflowRunEntries,
      ...recentEvalEntries,
      ...recentAgentMissionBriefEntries,
      ...recentAgentEvalBriefEntries,
      ...toolAdapterEntries,
    ],
  };
};

interface DirectoryArtifact {
  id?: string;
  summary?: string;
  updatedAt?: string;
  fileName: string;
  relativePath: string;
}

const buildIndexEntry = (
  workspaceRoot: string,
  id: string,
  kind: SkoposContentIndexEntry['kind'],
  title: string,
  summary: string,
  path: string,
  updatedAt?: string,
): SkoposContentIndexEntry => ({
  id,
  kind,
  title,
  summary,
  path: normalizeWorkspacePath(workspaceRoot, path),
  updatedAt,
});

const loadJsonArtifact = async <T>(artifactPath: string): Promise<T | null> => {
  try {
    return JSON.parse(await readFile(artifactPath, 'utf8')) as T;
  } catch {
    return null;
  }
};

const loadDirectoryArtifacts = async <
  T extends { id?: string; summary?: string; updatedAt?: string },
>(
  directoryPath: string,
  workspaceRoot: string,
): Promise<Array<T & DirectoryArtifact>> => {
  try {
    const entries = await readdir(directoryPath, { withFileTypes: true });
    const jsonFiles = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
      .map((entry) => entry.name)
      .sort();

    return Promise.all(
      jsonFiles.map(async (fileName) => {
        const artifactPath = join(directoryPath, fileName);
        const artifact = JSON.parse(await readFile(artifactPath, 'utf8')) as T;
        return {
          ...artifact,
          fileName,
          relativePath: normalizeWorkspacePath(workspaceRoot, artifactPath),
        };
      }),
    );
  } catch {
    return [];
  }
};

const loadOperationalLogEntries = async (
  workspaceRoot: string,
): Promise<SkoposOperationalLogEntry[]> => {
  try {
    const contents = await readFile(join(workspaceRoot, LOG_PATH), 'utf8');
    return contents
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => JSON.parse(line) as SkoposOperationalLogEntry);
  } catch {
    return [];
  }
};

const normalizeWorkspacePath = (workspaceRoot: string, path: string): string => {
  const absolutePath = resolve(workspaceRoot, path);
  const relativePath = relative(workspaceRoot, absolutePath);
  return relativePath.length > 0 ? relativePath : '.';
};

const sortByUpdatedAtDesc = (
  left: SkoposContentIndexEntry,
  right: SkoposContentIndexEntry,
): number => (Date.parse(right.updatedAt ?? '') || 0) - (Date.parse(left.updatedAt ?? '') || 0);

const compareArtifactUpdatedAt = (left?: string, right?: string): number =>
  (Date.parse(right ?? '') || 0) - (Date.parse(left ?? '') || 0);

const toTitleCase = (value: string): string =>
  value
    .split(/[-_]/g)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const parseReadiness = (
  value: string | number | boolean | null | undefined,
): SkoposReadiness | 'unknown' => {
  if (value === 'bootstrap-needed' || value === 'needs-review' || value === 'agent-ready') {
    return value;
  }

  return 'unknown';
};

const parseTrustLevel = (
  value: string | number | boolean | null | undefined,
): SkoposTrustLevel | 'unknown' => {
  if (value === 'low' || value === 'medium' || value === 'high') {
    return value;
  }

  return 'unknown';
};
