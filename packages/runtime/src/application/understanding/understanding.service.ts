import { access, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { loadSkoposConfig, writeSkoposConfig } from '@skopos/config';
import type {
  SkoposAgentAnalysisBriefArtifact,
  SkoposAgentAnalysisRead,
  SkoposBootstrapArtifact,
  SkoposDecisionQuestion,
  SkoposFeatureInventoryArtifact,
  SkoposImplementationHotspotsArtifact,
  SkoposMemoryRole,
  SkoposMemoryRoleKind,
  SkoposRepoUnderstandingSummaryArtifact,
  SkoposRootConfig,
  SkoposScopeLite,
  SkoposScopesLiteArtifact,
  SkoposSetupAnswerRuntimeResult,
  SkoposSetupReviewRuntimeResult,
  SkoposUnderstandingSetupAnswerEntry,
  SkoposUnderstandingSetupAnswersArtifact,
  SkoposUnderstandingSetupAppliedEffect,
  SkoposUnderstandingEvidence,
  SkoposUnderstandingRuntimeResult,
  SkoposUnderstandingSetupClaim,
  SkoposUnderstandingSetupReviewArtifact,
} from '@skopos/model';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { buildSkoposMemoryRoles } from '../shared/memory-state.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';

export interface BuildSkoposUnderstandingRuntimeOptions {
  cwd: string;
  actor?: string;
  dryRun?: boolean;
}

export interface BuildSkoposSetupAnswerRuntimeOptions extends BuildSkoposUnderstandingRuntimeOptions {
  questionId: string;
  optionId: string;
}

const UNDERSTANDING_DIRECTORY = '.skopos/index/understanding';
const SUMMARY_PATH = `${UNDERSTANDING_DIRECTORY}/repo-summary.json`;
const FEATURE_INVENTORY_PATH = `${UNDERSTANDING_DIRECTORY}/feature-inventory.json`;
const HOTSPOTS_PATH = `${UNDERSTANDING_DIRECTORY}/hotspots.json`;
const SETUP_REVIEW_PATH = `${UNDERSTANDING_DIRECTORY}/setup-review.json`;
const SETUP_ANSWERS_PATH = `${UNDERSTANDING_DIRECTORY}/setup-answers.json`;
const AGENT_ANALYSIS_BRIEF_PATH = `${UNDERSTANDING_DIRECTORY}/agent-analysis-brief.json`;

export const buildSkoposUnderstandingRuntime = async ({
  cwd,
  actor,
  dryRun = false,
}: BuildSkoposUnderstandingRuntimeOptions): Promise<SkoposUnderstandingRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const bootstrap = await readJson<SkoposBootstrapArtifact>(
    join(workspaceRoot, '.skopos', 'index', 'bootstrap.json'),
  );
  const scopesLite = await readJson<SkoposScopesLiteArtifact>(
    join(workspaceRoot, '.skopos', 'index', 'scopes.json'),
  );
  const setupAnswersPath = join(workspaceRoot, SETUP_ANSWERS_PATH);
  const setupAnswers = await loadSetupAnswersArtifact({
    workspaceRoot,
    setupAnswersPath,
  });
  const generatedAt = new Date().toISOString();
  const memoryRoles = await buildSkoposMemoryRoles({
    workspaceRoot,
    bootstrap,
  });
  const summary = buildRepoSummaryArtifact({
    workspaceRoot,
    generatedAt,
    bootstrap,
    scopes: scopesLite.scopes,
  });
  const featureInventory = buildFeatureInventoryArtifact({
    workspaceRoot,
    generatedAt,
    bootstrap,
    scopes: scopesLite.scopes,
  });
  const hotspots = buildHotspotsArtifact({
    workspaceRoot,
    generatedAt,
    bootstrap,
    scopes: scopesLite.scopes,
  });
  const agentAnalysisBrief = await buildAgentAnalysisBriefArtifact({
    workspaceRoot,
    generatedAt,
    bootstrap,
    memoryRoles,
  });
  const setupReview = buildSetupReviewArtifact({
    workspaceRoot,
    generatedAt,
    bootstrap,
    scopes: scopesLite.scopes,
    summary,
    featureInventory,
    hotspots,
    setupAnswers,
  });
  const summaryPath = join(workspaceRoot, SUMMARY_PATH);
  const featureInventoryPath = join(workspaceRoot, FEATURE_INVENTORY_PATH);
  const hotspotsPath = join(workspaceRoot, HOTSPOTS_PATH);
  const setupReviewPath = join(workspaceRoot, SETUP_REVIEW_PATH);
  const agentAnalysisBriefPath = join(workspaceRoot, AGENT_ANALYSIS_BRIEF_PATH);
  const setupAnswersWrite = await writeJsonArtifact({
    artifactPath: setupAnswersPath,
    artifact: setupAnswers,
    dryRun,
  });
  const summaryWrite = await writeJsonArtifact({
    artifactPath: summaryPath,
    artifact: summary,
    dryRun,
  });
  const featureInventoryWrite = await writeJsonArtifact({
    artifactPath: featureInventoryPath,
    artifact: featureInventory,
    dryRun,
  });
  const hotspotsWrite = await writeJsonArtifact({
    artifactPath: hotspotsPath,
    artifact: hotspots,
    dryRun,
  });
  const setupReviewWrite = await writeJsonArtifact({
    artifactPath: setupReviewPath,
    artifact: setupReview,
    dryRun,
  });
  const agentAnalysisBriefWrite = await writeJsonArtifact({
    artifactPath: agentAnalysisBriefPath,
    artifact: agentAnalysisBrief,
    dryRun,
  });
  const logResult = await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'understanding',
    status: 'succeeded',
    summary: `Repo understanding generated with ${featureInventory.features.length} feature areas, ${hotspots.hotspots.length} implementation hotspots, and ${setupReview.confirmationQuestions.length} setup review question${setupReview.confirmationQuestions.length === 1 ? '' : 's'}.`,
    relatedArtifactPaths: [summaryPath, featureInventoryPath, hotspotsPath, setupReviewPath, agentAnalysisBriefPath],
    metadata: {
      actorId: actorId ?? null,
      featureCount: featureInventory.features.length,
      hotspotCount: hotspots.hotspots.length,
      setupQuestionCount: setupReview.confirmationQuestions.length,
      openSetupQuestionCount: setupReview.openConfirmationQuestions.length,
      setupAssumptionCount: setupReview.assumptions.length,
      analysisStatus: agentAnalysisBrief.analysisStatus,
      confidence: bootstrap.detected.confidence,
    },
    dryRun,
  });
  const indexResult = await refreshSkoposKnowledgeIndex({
    workspaceRoot,
    dryRun,
  });

  return {
    workspaceRoot,
    summaryPath,
    featureInventoryPath,
    hotspotsPath,
    setupReviewPath,
    setupAnswersPath,
    agentAnalysisBriefPath,
    indexPath: indexResult.path,
    logPath: logResult.path,
    summaryWrite,
    featureInventoryWrite,
    hotspotsWrite,
    setupReviewWrite,
    setupAnswersWrite,
    agentAnalysisBriefWrite,
    indexWrite: indexResult.write,
    logWrite: logResult.write,
    actorId,
    summary,
    featureInventory,
    hotspots,
    setupReview,
    setupAnswers,
    agentAnalysisBrief,
  };
};

export const buildSkoposSetupReviewRuntime = async ({
  cwd,
  actor,
  dryRun = false,
}: BuildSkoposUnderstandingRuntimeOptions): Promise<SkoposSetupReviewRuntimeResult> => {
  const result = await buildSkoposUnderstandingRuntime({ cwd, actor, dryRun });
  return {
    workspaceRoot: result.workspaceRoot,
    setupReviewPath: result.setupReviewPath,
    setupAnswersPath: result.setupAnswersPath,
    agentAnalysisBriefPath: result.agentAnalysisBriefPath,
    setupReview: result.setupReview,
    setupAnswers: result.setupAnswers,
    agentAnalysisBrief: result.agentAnalysisBrief,
  };
};

export const buildSkoposSetupAnswerRuntime = async ({
  cwd,
  actor,
  dryRun = false,
  questionId,
  optionId,
}: BuildSkoposSetupAnswerRuntimeOptions): Promise<SkoposSetupAnswerRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const bootstrap = await readJson<SkoposBootstrapArtifact>(
    join(workspaceRoot, '.skopos', 'index', 'bootstrap.json'),
  );
  const current = await buildSkoposSetupReviewRuntime({
    cwd: workspaceRoot,
    actor,
    dryRun,
  });
  const question = current.setupReview.confirmationQuestions.find((entry) => entry.id === questionId);

  if (!question) {
    throw new Error(`Unknown setup question: ${questionId}`);
  }

  const option = question.options.find((entry) => entry.id === optionId);

  if (!option) {
    throw new Error(`Unknown option "${optionId}" for setup question "${questionId}".`);
  }

  const answeredAt = new Date().toISOString();
  const configApplyResult = await applySetupAnswerToConfig({
    workspaceRoot,
    bootstrap,
    questionId,
    optionId,
    dryRun,
  });
  const answer: SkoposUnderstandingSetupAnswerEntry = {
    questionId,
    optionId,
    question: question.question,
    optionLabel: option.label,
    rationale: option.rationale,
    answeredAt,
    actorId,
    appliedEffects:
      configApplyResult.effects.length > 0
        ? configApplyResult.effects
        : [
            {
              kind: 'answer-recorded',
              summary: 'Answer recorded as confirmed setup truth. No deterministic config change was needed.',
            },
          ],
  };
  const setupAnswersPath = join(workspaceRoot, SETUP_ANSWERS_PATH);
  const setupAnswers = upsertSetupAnswer(current.setupAnswers, answer);
  const setupAnswersWrite = await writeJsonArtifact({
    artifactPath: setupAnswersPath,
    artifact: setupAnswers,
    dryRun,
  });
  const refreshed = await buildSkoposUnderstandingRuntime({
    cwd: workspaceRoot,
    actor,
    dryRun,
  });
  const logResult = await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'understanding',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary: `Setup question ${questionId} answered with ${optionId}.`,
    relatedArtifactPaths: [setupAnswersPath, refreshed.setupReviewPath],
    metadata: {
      actorId: actorId ?? null,
      questionId,
      optionId,
      configWrite: configApplyResult.configWrite,
      openSetupQuestionCount: refreshed.setupReview.openConfirmationQuestions.length,
    },
    dryRun,
  });

  return {
    workspaceRoot,
    questionId,
    optionId,
    answer,
    configWrite: configApplyResult.configWrite,
    setupAnswersWrite,
    setupReviewWrite: refreshed.setupReviewWrite,
    indexWrite: refreshed.indexWrite,
    logWrite: logResult.write,
    setupReviewPath: refreshed.setupReviewPath,
    setupAnswersPath: refreshed.setupAnswersPath,
    agentAnalysisBriefPath: refreshed.agentAnalysisBriefPath,
    setupReview: refreshed.setupReview,
    setupAnswers: refreshed.setupAnswers,
    agentAnalysisBrief: refreshed.agentAnalysisBrief,
  };
};


const buildAgentAnalysisBriefArtifact = async ({
  workspaceRoot,
  generatedAt,
  bootstrap,
  memoryRoles,
}: {
  workspaceRoot: string;
  generatedAt: string;
  bootstrap: SkoposBootstrapArtifact;
  memoryRoles: SkoposMemoryRole[];
}): Promise<SkoposAgentAnalysisBriefArtifact> => {
  const docsRoot = bootstrap.recommendedConfig.docs.root;
  const candidates = [
    {
      id: 'project-overview',
      title: 'Project overview',
      path: `${docsRoot}/overview.md`,
      purpose: 'Explain what the product/project does, who uses it, and what success means.',
      required: true,
      sourceRoles: ['project-overview'] satisfies SkoposMemoryRoleKind[],
    },
    {
      id: 'architecture',
      title: 'Architecture map',
      path: `${docsRoot}/architecture/overview.md`,
      purpose: 'Explain the main layers, boundaries, data flow, integrations, and where new work should fit.',
      required:
        bootstrap.detected.repoMode === 'monorepo' ||
        bootstrap.detected.workspacePackageCount > 1,
      sourceRoles: ['architecture-structure'] satisfies SkoposMemoryRoleKind[],
    },
    {
      id: 'domains',
      title: 'Domain and feature map',
      path: `${docsRoot}/domains/overview.md`,
      purpose: 'Map important product domains/features to their owning folders, routes, services, docs, and risks.',
      required: false,
      sourceRoles: [
        'architecture-structure',
        'project-overview',
      ] satisfies SkoposMemoryRoleKind[],
    },
    {
      id: 'developer-procedures',
      title: 'Developer procedures',
      path: `${docsRoot}/guides/developer-procedures.md`,
      purpose: 'Describe how agents and developers should add features, fix bugs, update docs, and close work safely.',
      required: Object.keys(bootstrap.recommendedConfig.commands).length > 0,
      sourceRoles: ['verification-guards'] satisfies SkoposMemoryRoleKind[],
    },
    {
      id: 'validation',
      title: 'Verification Guards',
      path: `${docsRoot}/standards/validation.md`,
      purpose: 'Record the real commands and proof expectations for safe changes by risk and surface touched.',
      required: Object.keys(bootstrap.recommendedConfig.commands).length > 0,
      sourceRoles: ['verification-guards'] satisfies SkoposMemoryRoleKind[],
    },
  ];
  const durableOutputs = await Promise.all(
    candidates.map(async (entry) => {
      const directPathExists = await pathExists(join(workspaceRoot, entry.path));
      const mappedRole = entry.sourceRoles
        .map((role) => memoryRoles.find((candidate) => candidate.role === role))
        .find((role) => role?.status === 'mapped' && role.sources.length > 0);
      const mappedPaths = mappedRole?.sources.map((source) => source.path) ?? [];
      const resolvedPath = directPathExists ? entry.path : mappedPaths[0] ?? entry.path;

      return {
        id: entry.id,
        title: entry.title,
        path: resolvedPath,
        ...(resolvedPath !== entry.path ? { recommendedPath: entry.path } : {}),
        ...(mappedPaths.length > 0 ? { mappedPaths } : {}),
        ...(mappedRole ? { sourceRole: mappedRole.role } : {}),
        purpose: entry.purpose,
        required: entry.required,
        status: directPathExists || mappedPaths.length > 0
          ? 'present' as const
          : 'missing' as const,
      };
    }),
  );
  const missingRequired = durableOutputs.filter((entry) => entry.required && entry.status !== 'present');
  const analysisStatus: SkoposAgentAnalysisBriefArtifact['analysisStatus'] =
    missingRequired.length === 0 ? 'agent-reviewed' : 'brief-ready';
  const requiredReads = buildAgentAnalysisReads(bootstrap);
  const outputById = new Map(durableOutputs.map((entry) => [entry.id, entry]));
  const mappedOutputExpectation = (id: string, fallback: string): string => {
    const output = outputById.get(id);
    if (!output?.sourceRole || !output.mappedPaths?.length) {
      return fallback;
    }

    return `Review and update the mapped existing source${output.mappedPaths.length === 1 ? '' : 's'} ${output.mappedPaths.join(', ')} when project truth changes; do not create ${output.recommendedPath} as a parallel authority.`;
  };

  return {
    schemaVersion: 1,
    id: 'agent-analysis-brief',
    type: 'agent-analysis-brief',
    status: 'generated',
    authority: 'generated',
    summary:
      analysisStatus === 'agent-reviewed'
        ? 'Durable project understanding sources are mapped. Keep the existing sources current when project truth changes.'
        : 'Scanner-only understanding is not enough yet. A coding agent should follow this brief and create durable project understanding docs before broad work.',
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    analysisStatus,
    scannerLimitations: [
      'Bootstrap can detect stack, scripts, docs roots, and package shape, but it cannot understand product intent by itself.',
      'Scope files can point to folders, but they do not prove domain ownership or architecture boundaries.',
      'Generated summaries are useful orientation, not confirmed project truth until an agent reviews source and docs.',
    ],
    requiredReads,
    analysisTasks: [
      {
        id: 'product-purpose',
        title: 'Explain the product purpose',
        prompt: 'Read the README, instruction file, important docs, package metadata, and visible app routes. Describe what this project does, who it serves, and the main user workflows.',
        outputExpectation: mappedOutputExpectation(
          'project-overview',
          `Write or update ${docsRoot}/overview.md in simple developer-friendly language.`,
        ),
      },
      {
        id: 'architecture-map',
        title: 'Map the architecture',
        prompt: 'Inspect the top-level folders, app/runtime entrypoints, API routes, services, data access, UI components, jobs, integrations, and config boundaries.',
        outputExpectation: mappedOutputExpectation(
          'architecture',
          `When architecture needs durable explanation, write or update ${docsRoot}/architecture/overview.md with layers, ownership, data flow, and rules for where new code belongs.`,
        ),
      },
      {
        id: 'domain-map',
        title: 'Map domains and features',
        prompt: 'Identify real product domains/features and map each to code paths, docs, commands, and known risks. Do not treat folders as domains unless behavior confirms it.',
        outputExpectation: mappedOutputExpectation(
          'domains',
          `When domain ownership needs durable explanation, write or update ${docsRoot}/domains/overview.md with feature/domain ownership and first-look paths.`,
        ),
      },
      {
        id: 'workflow-map',
        title: 'Map work and validation flows',
        prompt: 'Find how developers add features, run checks, deploy/build, update docs, and close work. Compare package scripts, CI hints, AGENTS.md, and docs.',
        outputExpectation: [
          mappedOutputExpectation(
            'workflows',
            `Write or update ${docsRoot}/guides/developer-workflows.md when the project has a durable development workflow.`,
          ),
          mappedOutputExpectation(
            'validation',
            `Write or update ${docsRoot}/standards/validation.md when validation rules need durable project authority.`,
          ),
        ].join(' '),
      },
      {
        id: 'docs-authority',
        title: 'Classify docs authority',
        prompt: 'Classify key docs as canonical, supporting, stale, draft, or generated. Identify duplicate or conflicting guidance.',
        outputExpectation: `Update ${bootstrap.recommendedConfig.docs.startHerePath} only when routing truth changes. Record an unresolved structural gap as a collision-resistant Finding under ${docsRoot}/findings/**; keep work-bound questions on the owning Task and accepted choices in Decisions.`,
      },
      {
        id: 'confirmation-questions',
        title: 'Ask only important unresolved questions',
        prompt: 'List questions only when the answer changes architecture, validation, docs authority, product behavior, or agent workflow.',
        outputExpectation: 'Use `skopos setup review`; promote a durable blocker to the owning Task or a Finding, and record an accepted choice as a Decision.',
      },
    ],
    durableOutputs,
    nextAgentAction:
      analysisStatus === 'agent-reviewed'
        ? 'Use the mapped project understanding sources as durable context before broad source scans.'
        : 'Have a coding agent follow this brief, inspect the project, write the durable understanding docs, then rerun `skopos understand .` and `skopos adopt assess .`.',
    nextCommand:
      analysisStatus === 'agent-reviewed'
        ? 'skopos session context . --json'
        : `cat ${AGENT_ANALYSIS_BRIEF_PATH}`,
  };
};

const buildAgentAnalysisReads = (bootstrap: SkoposBootstrapArtifact): SkoposAgentAnalysisRead[] => {
  const reads: SkoposAgentAnalysisRead[] = [];
  const add = (path: string | undefined, reason: string, priority: SkoposAgentAnalysisRead['priority']) => {
    if (!path || reads.some((entry) => entry.path === path)) {
      return;
    }

    reads.push({ path, reason, priority });
  };

  add(bootstrap.recommendedConfig.agents.canonicalInstructions, 'Agent rules and local project guardrails.', 'must-read');
  add('README.md', 'Project overview and setup hints, when present.', 'must-read');
  add('package.json', 'Scripts, dependencies, package identity, and framework signals.', 'must-read');
  add(bootstrap.recommendedConfig.docs.startHerePath, 'Docs router and existing source-of-truth links.', 'must-read');

  for (const dependency of bootstrap.detected.sourceDependencies
    .filter((entry) => entry.kind === 'docs-content')
    .map((entry) => entry.path)
    .slice(0, 8)) {
    add(dependency, 'Existing project documentation that may contain product, architecture, or workflow truth.', 'should-read');
  }

  return reads.slice(0, 12);
};

const buildRepoSummaryArtifact = ({
  workspaceRoot,
  generatedAt,
  bootstrap,
  scopes,
}: {
  workspaceRoot: string;
  generatedAt: string;
  bootstrap: SkoposBootstrapArtifact;
  scopes: SkoposScopeLite[];
}): SkoposRepoUnderstandingSummaryArtifact => {
  const packageScopes = pickPackageScopes(scopes);
  const docsEntrypoints = buildDocsEntrypoints(bootstrap);
  const mainAreas = packageScopes.slice(0, 6).map((scope) => ({
    title: scope.title,
    path: scope.path,
    summary: scope.summary,
    confidence: scope.confidence,
  }));
  const stack = [...new Set([...bootstrap.detected.languages, ...bootstrap.detected.frameworks])].slice(0, 10);
  const commandSurface = Object.entries(bootstrap.recommendedConfig.commands)
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string' && entry[1].length > 0)
    .map(([name, command]) => ({ name, command }));
  const purpose = describeRepoPurpose({
    projectName: bootstrap.recommendedConfig.project.name,
    archetype: bootstrap.recommendedConfig.project.archetype,
    repoMode: bootstrap.recommendedConfig.project.repoMode,
    packageCount: bootstrap.detected.packageCount,
    docsEntrypoints,
  });
  const uncertainties = buildUncertainties(bootstrap, packageScopes, docsEntrypoints);

  return {
    schemaVersion: 1,
    id: 'repo-understanding-summary',
    type: 'repo-understanding-summary',
    status: 'generated',
    authority: 'inferred',
    summary: purpose,
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    projectName: bootstrap.recommendedConfig.project.name,
    repoMode: bootstrap.recommendedConfig.project.repoMode,
    archetype: bootstrap.recommendedConfig.project.archetype,
    stack,
    purpose,
    mainAreas,
    docsEntrypoints,
    commandSurface,
    uncertainties,
  };
};

const buildFeatureInventoryArtifact = ({
  workspaceRoot,
  generatedAt,
  bootstrap,
  scopes,
}: {
  workspaceRoot: string;
  generatedAt: string;
  bootstrap: SkoposBootstrapArtifact;
  scopes: SkoposScopeLite[];
}): SkoposFeatureInventoryArtifact => {
  const docsEntrypoints = buildDocsEntrypoints(bootstrap);
  const features = pickPackageScopes(scopes)
    .slice(0, 12)
    .map((scope) => ({
      id: `feature.${toSlug(scope.id)}`,
      title: scope.title,
      ownerPath: scope.path,
      summary: scope.summary,
      confidence: scope.confidence,
      relatedDocs: docsEntrypoints,
    }));

  return {
    schemaVersion: 1,
    id: 'feature-inventory',
    type: 'feature-inventory',
    status: 'generated',
    authority: 'inferred',
    summary: `${features.length} compact feature area${features.length === 1 ? '' : 's'} inferred from current scopes.`,
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    features,
  };
};

const buildHotspotsArtifact = ({
  workspaceRoot,
  generatedAt,
  bootstrap,
  scopes,
}: {
  workspaceRoot: string;
  generatedAt: string;
  bootstrap: SkoposBootstrapArtifact;
  scopes: SkoposScopeLite[];
}): SkoposImplementationHotspotsArtifact => {
  const docsEntrypoints = buildDocsEntrypoints(bootstrap);
  const packageHotspots = pickPackageScopes(scopes)
    .slice(0, 8)
    .map((scope) => ({
      id: `hotspot.${toSlug(scope.id)}`,
      title: scope.title,
      path: scope.path,
      reason: 'Package or workspace area surfaced by the compact scope registry; inspect here first for bounded implementation work.',
      confidence: scope.confidence,
      evidence: [
        {
          label: 'Scope registry',
          path: '.skopos/index/scopes.json',
        },
      ],
    }));
  const docsHotspots = docsEntrypoints.slice(0, 2).map((entry, index) => ({
    id: `hotspot.docs.${index + 1}`,
    title: entry.label,
    path: entry.path,
    reason: 'Docs entrypoint can explain project-specific rules before editing code.',
    confidence: bootstrap.detected.docsHealth.hasStartHere ? ('high' as const) : ('medium' as const),
    evidence: [entry],
  }));

  return {
    schemaVersion: 1,
    id: 'implementation-hotspots',
    type: 'implementation-hotspots',
    status: 'generated',
    authority: 'inferred',
    summary: `${packageHotspots.length + docsHotspots.length} compact implementation hotspot${packageHotspots.length + docsHotspots.length === 1 ? '' : 's'} inferred from scopes and docs entrypoints.`,
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    hotspots: [...docsHotspots, ...packageHotspots],
  };
};

const buildSetupReviewArtifact = ({
  workspaceRoot,
  generatedAt,
  bootstrap,
  scopes,
  summary,
  featureInventory,
  hotspots,
  setupAnswers,
}: {
  workspaceRoot: string;
  generatedAt: string;
  bootstrap: SkoposBootstrapArtifact;
  scopes: SkoposScopeLite[];
  summary: SkoposRepoUnderstandingSummaryArtifact;
  featureInventory: SkoposFeatureInventoryArtifact;
  hotspots: SkoposImplementationHotspotsArtifact;
  setupAnswers: SkoposUnderstandingSetupAnswersArtifact;
}): SkoposUnderstandingSetupReviewArtifact => {
  const lifecycle = bootstrap.mode === 'greenfield' ? 'greenfield' : 'brownfield';
  const projectMode = bootstrap.recommendedConfig.project.mode;
  const commandCount = Object.keys(bootstrap.detected.commands).length;
  const facts: SkoposUnderstandingSetupClaim[] = [
    {
      id: 'fact.project-name',
      kind: 'fact',
      title: 'Project name',
      summary: `Skopos detected the project name as "${bootstrap.recommendedConfig.project.name}".`,
      confidence: 'high',
      evidence: [{ label: 'Bootstrap artifact', path: '.skopos/index/bootstrap.json' }],
    },
    {
      id: 'fact.repo-shape',
      kind: 'fact',
      title: 'Repo shape',
      summary: `Detected ${bootstrap.detected.packageCount} package${bootstrap.detected.packageCount === 1 ? '' : 's'} and ${bootstrap.detected.workspacePackageCount} workspace package${bootstrap.detected.workspacePackageCount === 1 ? '' : 's'}.`,
      confidence: bootstrap.detected.confidence,
      evidence: buildRepoShapeEvidence(bootstrap),
    },
    {
      id: 'fact.docs-surface',
      kind: 'fact',
      title: 'Docs surface',
      summary: buildDocsFactSummary(bootstrap),
      confidence: bootstrap.detected.docsRoots.length > 0 ? 'high' : 'medium',
      evidence: buildDocsEntrypoints(bootstrap),
    },
    {
      id: 'fact.command-surface',
      kind: 'fact',
      title: 'Command surface',
      summary:
        commandCount > 0
          ? `Detected ${commandCount} command${commandCount === 1 ? '' : 's'} for project workflow.`
          : 'No reliable command surface was detected yet.',
      confidence: commandCount > 0 ? 'high' : 'low',
      evidence: [{ label: 'Bootstrap commands', path: '.skopos/index/bootstrap.json' }],
    },
  ];

  const inferences: SkoposUnderstandingSetupClaim[] = [
    {
      id: 'inference.project-purpose',
      kind: 'inference',
      title: 'Likely project purpose',
      summary: summary.purpose,
      confidence: bootstrap.detected.confidence,
      evidence: [{ label: 'Repo understanding summary', path: SUMMARY_PATH }],
    },
    {
      id: 'inference.primary-areas',
      kind: 'inference',
      title: 'Likely primary work areas',
      summary:
        featureInventory.features.length > 0
          ? `${featureInventory.features.length} feature area${featureInventory.features.length === 1 ? '' : 's'} were inferred from the current scope registry.`
          : 'No feature areas were inferred yet.',
      confidence: featureInventory.features.length > 0 ? bootstrap.detected.confidence : 'low',
      evidence: [{ label: 'Feature inventory', path: FEATURE_INVENTORY_PATH }],
    },
    {
      id: 'inference.first-edit-locations',
      kind: 'inference',
      title: 'Likely first edit locations',
      summary:
        hotspots.hotspots.length > 0
          ? `${hotspots.hotspots.length} hotspot${hotspots.hotspots.length === 1 ? '' : 's'} were inferred for bounded implementation work.`
          : 'No implementation hotspots were inferred yet.',
      confidence: hotspots.hotspots.length > 0 ? bootstrap.detected.confidence : 'low',
      evidence: [{ label: 'Implementation hotspots', path: HOTSPOTS_PATH }],
    },
  ];

  const assumptions = buildSetupAssumptions({ bootstrap, scopes, lifecycle, projectMode });
  const confirmationQuestions = buildSetupConfirmationQuestions({
    bootstrap,
    lifecycle,
    projectMode,
    assumptions,
  });
  const answeredQuestionIds = new Set(setupAnswers.answers.map((answer) => answer.questionId));
  const openConfirmationQuestions = confirmationQuestions.filter(
    (question) => !answeredQuestionIds.has(question.id),
  );
  const answeredQuestions = setupAnswers.answers.filter((answer) =>
    confirmationQuestions.some((question) => question.id === answer.questionId),
  );
  const readiness =
    openConfirmationQuestions.some((question) => question.escalation === 'must-ask') ||
    openConfirmationQuestions.length > 0
      ? 'needs-confirmation'
      : 'ready';

  return {
    schemaVersion: 1,
    id: 'understanding-setup-review',
    type: 'understanding-setup-review',
    status: 'generated',
    authority: 'inferred',
    summary:
      readiness === 'ready'
        ? 'Project setup review is ready for normal agent use.'
        : 'Project setup review needs confirmation before broad agent use.',
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    readiness,
    lifecycle,
    projectMode,
    facts,
    inferences,
    assumptions,
    confirmationQuestions,
    openConfirmationQuestions,
    answeredQuestions,
    recommendedActions: buildSetupRecommendedActions(readiness, lifecycle),
    nextCommand:
      readiness === 'ready'
        ? 'skopos session context . --json'
        : 'skopos setup review .',
  };
};

const pickPackageScopes = (scopes: SkoposScopeLite[]): SkoposScopeLite[] => {
  const projectScopes = scopes.filter((scope) => scope.kind !== 'workspace');
  return projectScopes.length > 0
    ? projectScopes
    : scopes.filter((scope) => scope.kind === 'workspace');
};

const buildDocsEntrypoints = (
  bootstrap: SkoposBootstrapArtifact,
): SkoposUnderstandingEvidence[] => {
  const entries: SkoposUnderstandingEvidence[] = [];
  const startHerePath = bootstrap.recommendedConfig.docs.startHerePath;

  if (startHerePath && bootstrap.detected.docsHealth.hasStartHere) {
    entries.push({
      label: 'Start here',
      path: startHerePath,
    });
  }

  for (const docsRoot of bootstrap.detected.docsRoots.slice(0, 3)) {
    if (entries.some((entry) => entry.path === docsRoot)) {
      continue;
    }

    entries.push({
      label: 'Docs root',
      path: docsRoot,
    });
  }

  return entries;
};

const buildRepoShapeEvidence = (
  bootstrap: SkoposBootstrapArtifact,
): SkoposUnderstandingEvidence[] => {
  const evidence: SkoposUnderstandingEvidence[] = [
    { label: 'Bootstrap artifact', path: '.skopos/index/bootstrap.json' },
    { label: 'Scope registry', path: '.skopos/index/scopes.json' },
  ];

  if (bootstrap.detected.hasRootPackageJson) {
    evidence.push({ label: 'Root package manifest', path: 'package.json' });
  }

  if (bootstrap.detected.hasPnpmWorkspace) {
    evidence.push({ label: 'pnpm workspace', path: 'pnpm-workspace.yaml' });
  }

  return evidence;
};

const buildDocsFactSummary = (bootstrap: SkoposBootstrapArtifact): string => {
  if (bootstrap.detected.docsRoots.length === 0) {
    return 'No docs root was detected yet.';
  }

  const startHerePhrase = bootstrap.detected.docsHealth.hasStartHere
    ? ` A start-here router exists at ${bootstrap.detected.docsHealth.startHerePath ?? bootstrap.recommendedConfig.docs.startHerePath}.`
    : ' No start-here router was confirmed yet.';

  return `Detected ${bootstrap.detected.docsRoots.length} docs root${bootstrap.detected.docsRoots.length === 1 ? '' : 's'}.${startHerePhrase}`;
};

const buildSetupAssumptions = ({
  bootstrap,
  scopes,
  lifecycle,
  projectMode,
}: {
  bootstrap: SkoposBootstrapArtifact;
  scopes: SkoposScopeLite[];
  lifecycle: 'greenfield' | 'brownfield';
  projectMode?: SkoposRootConfig['project']['mode'];
}): SkoposUnderstandingSetupClaim[] => {
  const assumptions: SkoposUnderstandingSetupClaim[] = [
    {
      id: 'assumption.lifecycle',
      kind: 'assumption',
      title: 'Project lifecycle',
      summary:
        lifecycle === 'brownfield'
          ? 'Skopos is treating this as an existing project and will prefer mapping current truth before suggesting structure changes.'
          : 'Skopos is treating this as a new project and may recommend a clearer default memory and docs structure.',
      confidence: bootstrap.mode === 'existing' || bootstrap.mode === 'greenfield' ? 'medium' : 'low',
      evidence: [{ label: 'Init mode', path: '.skopos/index/bootstrap.json' }],
    },
    {
      id: 'assumption.project-mode',
      kind: 'assumption',
      title: 'Project mode',
      summary: projectMode
        ? `Skopos is using "${projectMode}" as the working project mode for agent behavior.`
        : 'Skopos has not confirmed a project mode yet, so agents may treat cleanup and compatibility too generically.',
      confidence: projectMode ? 'high' : 'low',
      evidence: [{ label: 'Root config', path: 'skopos.config.yaml' }],
    },
    {
      id: 'assumption.archetype',
      kind: 'assumption',
      title: 'Project archetype',
      summary: `Skopos is using "${bootstrap.recommendedConfig.project.archetype}" as the working archetype until confirmed.`,
      confidence: bootstrap.detected.confidence,
      evidence: [{ label: 'Bootstrap detection', path: '.skopos/index/bootstrap.json' }],
    },
  ];

  if (bootstrap.detected.docsRoots.length > 0) {
    assumptions.push({
      id: 'assumption.docs-root',
      kind: 'assumption',
      title: 'Canonical docs root',
      summary: `Skopos is treating "${bootstrap.recommendedConfig.docs.root}" as the preferred docs root unless the user confirms a different source of truth.`,
      confidence: bootstrap.detected.docsHealth.hasStartHere ? 'high' : 'medium',
      evidence: buildDocsEntrypoints(bootstrap),
    });
  } else {
    assumptions.push({
      id: 'assumption.docs-root',
      kind: 'assumption',
      title: 'Canonical docs root',
      summary: 'Skopos has no confirmed docs root yet and may recommend creating one for durable project memory.',
      confidence: 'low',
      evidence: [{ label: 'Bootstrap docs health', path: '.skopos/index/bootstrap.json' }],
    });
  }

  if (Object.keys(bootstrap.detected.commands).length === 0) {
    assumptions.push({
      id: 'assumption.validation-commands',
      kind: 'assumption',
      title: 'Validation commands',
      summary: 'Skopos has not confirmed the commands agents should run before closing work.',
      confidence: 'low',
      evidence: [{ label: 'Bootstrap command detection', path: '.skopos/index/bootstrap.json' }],
    });
  }

  if (scopes.filter((scope) => scope.kind !== 'workspace').length === 0) {
    assumptions.push({
      id: 'assumption.work-boundaries',
      kind: 'assumption',
      title: 'Work boundaries',
      summary: 'Skopos has not confirmed declared Scope boundaries, so future agents should inspect local structure before broad edits.',
      confidence: 'medium',
      evidence: [{ label: 'Scope registry', path: '.skopos/index/scopes.json' }],
    });
  }

  return assumptions;
};

const buildSetupConfirmationQuestions = ({
  bootstrap,
  lifecycle,
  projectMode,
  assumptions,
}: {
  bootstrap: SkoposBootstrapArtifact;
  lifecycle: 'greenfield' | 'brownfield';
  projectMode?: SkoposRootConfig['project']['mode'];
  assumptions: SkoposUnderstandingSetupClaim[];
}): SkoposDecisionQuestion[] => {
  const lifecycleQuestion: SkoposDecisionQuestion = {
    id: 'understanding.lifecycle',
    category: 'project-setup',
    escalation: 'recommend-and-ask',
    question: 'Should Skopos treat this as an existing project or a new project?',
    whyItMatters:
      'This changes whether Skopos preserves current docs and structure first, or recommends a clean default setup.',
    recommendedOptionId: lifecycle === 'brownfield' ? 'existing-project' : 'new-project',
    options: [
      {
        id: lifecycle === 'brownfield' ? 'existing-project' : 'new-project',
        label: lifecycle === 'brownfield' ? 'Existing project' : 'New project',
        rationale:
          lifecycle === 'brownfield'
            ? 'Recommended because init detected an existing repo surface that should be mapped before Skopos suggests rewrites.'
            : 'Recommended because init is running in greenfield mode and there is less existing project truth to preserve.',
      },
      {
        id: lifecycle === 'brownfield' ? 'new-project' : 'existing-project',
        label: lifecycle === 'brownfield' ? 'New project' : 'Existing project',
        rationale:
          lifecycle === 'brownfield'
            ? 'Use this only if the current files are starter scaffolding and Skopos should recommend a cleaner default structure.'
            : 'Use this if the repo already has important existing conventions that Skopos should preserve first.',
      },
    ],
  };
  const recommendedProjectMode = projectMode ?? (lifecycle === 'greenfield' ? 'new-project' : 'brownfield');
  const projectModeQuestion: SkoposDecisionQuestion = {
    id: 'project.mode',
    category: 'project-setup',
    escalation: projectMode ? 'recommend-and-ask' : 'must-ask',
    question: 'How should coding agents treat this project?',
    whyItMatters:
      'This controls whether agents preserve current behavior, cleanly refactor old paths, reset toward a new structure, or use fresh-project defaults.',
    recommendedOptionId: recommendedProjectMode,
    options: [
      {
        id: 'brownfield',
        label: 'Brownfield',
        rationale: 'Preserve current behavior first. Use this for active projects where compatibility and stability matter most.',
      },
      {
        id: 'clean-refactor',
        label: 'Clean refactor',
        rationale: 'Improve the existing project while removing replaced internal patterns instead of keeping duplicate legacy paths.',
      },
      {
        id: 'greenfield-in-existing-repo',
        label: 'Greenfield in existing repo',
        rationale: 'Use the repo as a workspace, but do not preserve bad existing structure by default.',
      },
      {
        id: 'new-project',
        label: 'New project',
        rationale: 'Use clean defaults from day one. Best when the repo is empty or only starter scaffolding.',
      },
    ],
  };

  const setupQuestions = bootstrap.recommendedQuestions.filter((question) =>
    assumptions.some((assumption) =>
      question.category === 'docs-governance'
        ? assumption.id === 'assumption.docs-root'
        : question.category === 'workflow-surface'
          ? assumption.id === 'assumption.validation-commands'
          : true,
    ),
  );

  return dedupeDecisionQuestionOptions([
    lifecycleQuestion,
    ...(!projectMode ? [projectModeQuestion] : []),
    ...setupQuestions,
  ]);
};

const dedupeDecisionQuestionOptions = (questions: SkoposDecisionQuestion[]): SkoposDecisionQuestion[] =>
  questions.map((question) => {
    const seen = new Set<string>();
    const options = question.options.filter((option) => {
      if (seen.has(option.id)) {
        return false;
      }

      seen.add(option.id);
      return true;
    });
    const hasRecommended = options.some((option) => option.id === question.recommendedOptionId);

    return {
      ...question,
      recommendedOptionId: hasRecommended ? question.recommendedOptionId : (options[0]?.id ?? question.recommendedOptionId),
      options,
    };
  });

const buildSetupRecommendedActions = (
  readiness: 'ready' | 'needs-confirmation',
  lifecycle: 'greenfield' | 'brownfield',
): string[] => {
  if (readiness === 'ready') {
    return [
      'Use the repo summary and hotspots as the compact first-read context for future agent work.',
      'Run `skopos adopt assess .` before closing onboarding so Memory and instruction surfaces stay aligned.',
    ];
  }

  const firstAction =
    lifecycle === 'brownfield'
      ? 'Review the setup questions before asking Skopos to reorganize docs, accept packs, or run broad refactors.'
      : 'Review the setup questions before accepting the default docs, policy, and validation structure.';

  return [
    firstAction,
    'Answer setup questions with `skopos setup answer <question-id> <option-id> .` before broad work.',
    'Confirm the canonical docs source and validation commands before broad work.',
    'Keep unconfirmed assumptions visible instead of treating them as project truth.',
  ];
};

const loadSetupAnswersArtifact = async ({
  workspaceRoot,
  setupAnswersPath,
}: {
  workspaceRoot: string;
  setupAnswersPath: string;
}): Promise<SkoposUnderstandingSetupAnswersArtifact> => {
  const existing = await readJsonOptional<SkoposUnderstandingSetupAnswersArtifact>(setupAnswersPath);
  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    id: 'understanding-setup-answers',
    type: 'understanding-setup-answers',
    status: 'generated',
    authority: 'inferred',
    summary: 'Confirmed setup-review answers.',
    updatedAt: now,
    generatedAt: now,
    workspaceRoot,
    answers: [],
  };
};

const upsertSetupAnswer = (
  artifact: SkoposUnderstandingSetupAnswersArtifact,
  answer: SkoposUnderstandingSetupAnswerEntry,
): SkoposUnderstandingSetupAnswersArtifact => {
  const answers = [
    ...artifact.answers.filter((entry) => entry.questionId !== answer.questionId),
    answer,
  ];

  return {
    ...artifact,
    summary: `${answers.length} setup-review answer${answers.length === 1 ? '' : 's'} recorded.`,
    updatedAt: answer.answeredAt,
    answers,
  };
};

const applySetupAnswerToConfig = async ({
  workspaceRoot,
  bootstrap,
  questionId,
  optionId,
  dryRun,
}: {
  workspaceRoot: string;
  bootstrap: SkoposBootstrapArtifact;
  questionId: string;
  optionId: string;
  dryRun: boolean;
}): Promise<{
  configWrite: 'written' | 'dry-run' | 'unchanged';
  effects: SkoposUnderstandingSetupAppliedEffect[];
}> => {
  const configPath = join(workspaceRoot, 'skopos.config.yaml');
  const existingConfig =
    (await loadSkoposConfig(configPath)) ?? bootstrap.recommendedConfig;
  const nextConfig: SkoposRootConfig = structuredClone(existingConfig);
  const candidateEffects: SkoposUnderstandingSetupAppliedEffect[] = [];

  if (questionId === 'bootstrap.project-archetype' && isProjectArchetype(optionId)) {
    nextConfig.project.archetype = optionId;
    candidateEffects.push({
      kind: 'config-updated',
      path: 'skopos.config.yaml',
      summary: `Project archetype set to ${optionId}.`,
    });
  }

  if (questionId === 'project.mode' && isProjectMode(optionId)) {
    nextConfig.project.mode = optionId;
    candidateEffects.push({
      kind: 'config-updated',
      path: 'skopos.config.yaml',
      summary: `Project mode set to ${optionId}.`,
    });
  }

  if (questionId === 'bootstrap.docs-root') {
    const docsRoot = optionId === 'create-docs-root' ? 'docs' : optionId;
    if (docsRoot !== 'manual-docs-governance') {
      nextConfig.docs.root = docsRoot;
      nextConfig.docs.startHerePath = `${docsRoot}/00-start-here.md`;
      candidateEffects.push({
        kind: 'config-updated',
        path: 'skopos.config.yaml',
        summary: `Canonical docs root set to ${docsRoot}.`,
      });
    }
  }

  if (questionId === 'bootstrap.instructions-source' && optionId === 'create-agents') {
    nextConfig.agents.canonicalInstructions = 'AGENTS.md';
    candidateEffects.push({
      kind: 'config-updated',
      path: 'skopos.config.yaml',
      summary: 'Canonical agent instructions set to AGENTS.md.',
    });
  }

  if (JSON.stringify(existingConfig) === JSON.stringify(nextConfig)) {
    return {
      configWrite: 'unchanged',
      effects: [],
    };
  }

  if (!dryRun) {
    await writeSkoposConfig(configPath, nextConfig);
  }

  return {
    configWrite: dryRun ? 'dry-run' : 'written',
    effects: candidateEffects,
  };
};

const isProjectArchetype = (value: string): value is SkoposRootConfig['project']['archetype'] =>
  ['saas', 'api', 'library', 'monorepo-platform', 'internal-tool', 'custom'].includes(value);

const isProjectMode = (value: string): value is NonNullable<SkoposRootConfig['project']['mode']> =>
  ['brownfield', 'clean-refactor', 'greenfield-in-existing-repo', 'new-project'].includes(value);

const describeRepoPurpose = ({
  projectName,
  archetype,
  repoMode,
  packageCount,
  docsEntrypoints,
}: {
  projectName: string;
  archetype: string;
  repoMode: string;
  packageCount: number;
  docsEntrypoints: SkoposUnderstandingEvidence[];
}): string => {
  const docsPhrase =
    docsEntrypoints.length > 0
      ? ` It has ${docsEntrypoints.length} detected docs entrypoint${docsEntrypoints.length === 1 ? '' : 's'} for project rules.`
      : '';
  return `${projectName} appears to be a ${repoMode} ${archetype} workspace with ${packageCount} package${packageCount === 1 ? '' : 's'}.${docsPhrase}`;
};

const buildUncertainties = (
  bootstrap: SkoposBootstrapArtifact,
  packageScopes: SkoposScopeLite[],
  docsEntrypoints: SkoposUnderstandingEvidence[],
): string[] => {
  const uncertainties: string[] = [];

  if (bootstrap.detected.confidence !== 'high') {
    uncertainties.push('Repo understanding confidence is not high; verify the summary against source and docs before major edits.');
  }

  if (packageScopes.length === 0) {
    uncertainties.push('No package scopes were detected, so feature areas may need manual confirmation.');
  }

  if (docsEntrypoints.length === 0) {
    uncertainties.push('No docs entrypoint was detected, so Skopos cannot confirm project purpose from maintained docs yet.');
  }

  return uncertainties;
};

const pathExists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const readJson = async <T>(artifactPath: string): Promise<T> =>
  JSON.parse(await readFile(artifactPath, 'utf8')) as T;

const readJsonOptional = async <T>(artifactPath: string): Promise<T | undefined> => {
  try {
    return await readJson<T>(artifactPath);
  } catch (error) {
    if (isMissingFileError(error)) {
      return undefined;
    }

    throw error;
  }
};

const isMissingFileError = (error: unknown): error is NodeJS.ErrnoException =>
  typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';

const toSlug = (value: string): string => {
  const slug = value.replace(/[^a-zA-Z0-9.-]/g, '-').replace(/^-+|-+$/g, '');
  return slug.length > 0 ? slug : 'workspace';
};
