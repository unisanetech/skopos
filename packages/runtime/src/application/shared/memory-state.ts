import { access, readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

import type {
  SkoposAgentCommunicationBriefArtifact,
  SkoposBootstrapArtifact,
  SkoposDriftReportArtifact,
  SkoposMemoryFreshnessStatus,
  SkoposMemoryRole,
  SkoposMemoryRoleAuthority,
  SkoposMemoryRoleKind,
  SkoposMemoryRoleSource,
  SkoposMemoryRoleStatus,
  SkoposMemorySourceProbe,
  SkoposMemoryStateArtifact,
  SkoposMemorySuggestion,
  SkoposMissionArtifact,
  SkoposProjectKnowledgeGuidance,
  SkoposReadiness,
  SkoposResolvedPolicyArtifact,
  SkoposTrustLevel,
} from '@skopos/model';

import {
  BOOTSTRAP_ARTIFACT_PATH,
  COMMUNICATION_BRIEF_ARTIFACT_PATH,
  CONFIG_ARTIFACT_PATH,
  DISCUSSION_HANDOFF_DIRECTORY,
  DRIFT_REPORT_ARTIFACT_PATH,
  MEMORY_STATE_ARTIFACT_PATH,
  POLICY_BRIEF_ARTIFACT_PATH,
  RESOLVED_POLICY_ARTIFACT_PATH,
} from './token-control-constants.js';
import { writeJsonArtifact } from './write-json-artifact.js';

export interface RefreshSkoposMemoryStateOptions {
  workspaceRoot: string;
  trustLevel?: SkoposTrustLevel | 'unknown';
  readiness?: SkoposReadiness | 'unknown';
  dryRun?: boolean;
}

export interface RefreshSkoposMemoryStateResult {
  memoryPath: string;
  memoryWrite: 'written' | 'dry-run';
  communicationBriefPath: string;
  communicationBriefWrite: 'written' | 'dry-run';
  memory: SkoposMemoryStateArtifact;
  communicationBrief: SkoposAgentCommunicationBriefArtifact;
}

export interface BuildSkoposProjectKnowledgeGuidanceOptions {
  workspaceRoot: string;
  trustLevel?: SkoposTrustLevel | 'unknown';
  readiness?: SkoposReadiness | 'unknown';
  dryRun?: boolean;
}

interface RoleCandidate {
  role: SkoposMemoryRoleKind;
  title: string;
  sourcePaths: Array<{
    path: string;
    kind: SkoposMemoryRoleSource['kind'];
    authority: SkoposMemoryRoleAuthority;
    summary: string;
  }>;
  missingSummary: string;
  nextAction: string;
  suggestedPaths: string[];
  required?: boolean;
}

const MAX_ROLE_SOURCES = 8;

export const refreshSkoposMemoryState = async ({
  workspaceRoot,
  trustLevel = 'unknown',
  readiness = 'unknown',
  dryRun = false,
}: RefreshSkoposMemoryStateOptions): Promise<RefreshSkoposMemoryStateResult> => {
  const now = new Date().toISOString();
  const bootstrap = await readJsonIfExists<SkoposBootstrapArtifact>(
    join(workspaceRoot, BOOTSTRAP_ARTIFACT_PATH),
  );
  const resolvedPolicy = await readJsonIfExists<SkoposResolvedPolicyArtifact>(
    join(workspaceRoot, RESOLVED_POLICY_ARTIFACT_PATH),
  );
  const driftReport = await readJsonIfExists<SkoposDriftReportArtifact>(
    join(workspaceRoot, DRIFT_REPORT_ARTIFACT_PATH),
  );
  const latestHandoffPath = await resolveLatestHandoffPath(workspaceRoot);
  const latestMissionPath = await resolveLatestMissionPath(workspaceRoot);
  const roles = await buildMemoryRoles({
    workspaceRoot,
    bootstrap,
    resolvedPolicy,
    driftReport,
    latestHandoffPath,
    latestMissionPath,
  });
  const suggestions = buildMemorySuggestions(roles);
  const freshness = deriveMemoryFreshness(roles);
  const sourceProbes = await buildSourceProbes(workspaceRoot, roles);
  const memory: SkoposMemoryStateArtifact = {
    schemaVersion: 1,
    id: 'memory-state',
    type: 'memory-state',
    status: 'generated',
    authority: 'generated',
    summary: buildMemorySummary(roles, suggestions),
    updatedAt: now,
    generatedAt: now,
    workspaceRoot,
    trustLevel,
    readiness,
    freshness,
    roles,
    suggestions,
    layers: buildLayerSummaries({ roles, resolvedPolicy, driftReport }),
    sourceProbes,
    acceptedDecisionSnapshots: buildAcceptedDecisionSnapshots(resolvedPolicy),
    agentBriefPaths: [
      COMMUNICATION_BRIEF_ARTIFACT_PATH,
      ...(await pathExists(join(workspaceRoot, POLICY_BRIEF_ARTIFACT_PATH))
        ? [POLICY_BRIEF_ARTIFACT_PATH]
        : []),
    ],
    policyArtifactPaths: resolvedPolicy
      ? [RESOLVED_POLICY_ARTIFACT_PATH, POLICY_BRIEF_ARTIFACT_PATH]
      : [],
    stackArtifactPaths: [],
    driftReportPath: driftReport ? DRIFT_REPORT_ARTIFACT_PATH : undefined,
    staleReasons: roles
      .filter((role) => role.freshness === 'stale')
      .map((role) => `${role.title} has stale mapped sources.`),
  };
  const communicationBrief = buildAgentCommunicationBrief({
    workspaceRoot,
    generatedAt: now,
    memory,
  });
  const memoryPath = join(workspaceRoot, MEMORY_STATE_ARTIFACT_PATH);
  const communicationBriefPath = join(workspaceRoot, COMMUNICATION_BRIEF_ARTIFACT_PATH);
  const [memoryWrite, communicationBriefWrite] = await Promise.all([
    writeJsonArtifact({
      artifactPath: memoryPath,
      artifact: memory,
      dryRun,
    }),
    writeJsonArtifact({
      artifactPath: communicationBriefPath,
      artifact: communicationBrief,
      dryRun,
    }),
  ]);

  return {
    memoryPath,
    memoryWrite,
    communicationBriefPath,
    communicationBriefWrite,
    memory,
    communicationBrief,
  };
};

export const buildSkoposProjectKnowledgeGuidance = async ({
  workspaceRoot,
  trustLevel = 'unknown',
  readiness = 'unknown',
  dryRun = false,
}: BuildSkoposProjectKnowledgeGuidanceOptions): Promise<SkoposProjectKnowledgeGuidance> => {
  const result = await refreshSkoposMemoryState({
    workspaceRoot,
    trustLevel,
    readiness,
    dryRun,
  });
  const knownAreas = result.memory.roles.filter((role) => role.status === 'mapped');
  const attentionAreas = result.memory.roles.filter((role) => role.status !== 'mapped');
  const suggestionById = new Map(
    result.memory.suggestions.map((suggestion) => [suggestion.id, suggestion]),
  );

  return {
    summary: `${knownAreas.length}/${result.memory.roles.length} project knowledge areas known; ${attentionAreas.length} need attention; agent guide ready.`,
    freshness: result.memory.freshness,
    knownAreaCount: knownAreas.length,
    totalAreaCount: result.memory.roles.length,
    attentionAreaCount: attentionAreas.length,
    suggestionCount: result.memory.suggestions.length,
    agentGuideReady: true,
    command: `skopos knowledge ${workspaceRoot} --compact`,
    memoryPath: result.memoryPath,
    communicationBriefPath: result.communicationBriefPath,
    recommendedReads: buildRecommendedKnowledgeReads(result.memory),
    attentionAreas: attentionAreas.map((role) => ({
      role: role.role,
      title: role.title,
      status: role.status,
      nextAction: role.suggestionIds
        .map((suggestionId) => suggestionById.get(suggestionId)?.nextAction)
        .find((nextAction): nextAction is string => Boolean(nextAction)),
    })),
  };
};

const buildMemoryRoles = async ({
  workspaceRoot,
  bootstrap,
  resolvedPolicy,
  driftReport,
  latestHandoffPath,
  latestMissionPath,
}: {
  workspaceRoot: string;
  bootstrap?: SkoposBootstrapArtifact;
  resolvedPolicy?: SkoposResolvedPolicyArtifact;
  driftReport?: SkoposDriftReportArtifact;
  latestHandoffPath?: string;
  latestMissionPath?: string;
}): Promise<SkoposMemoryRole[]> => {
  const docsRoot = bootstrap?.recommendedConfig?.docs.root ?? 'docs';
  const startHerePath = bootstrap?.recommendedConfig?.docs.startHerePath ?? `${docsRoot}/00-start-here.md`;
  const instructionPath = bootstrap?.recommendedConfig?.agents.canonicalInstructions ?? 'AGENTS.md';
  const docsRoots = bootstrap?.detected?.docsRoots ?? [];
  const architectureDocs = await findCandidateDocs(workspaceRoot, docsRoots, [
    'architecture',
    'structure',
    'system',
    'design',
  ]);
  const decisionDocs = await findCandidateDocs(workspaceRoot, docsRoots, [
    'decision',
    'decisions',
    'adr',
  ]);
  const findingDocs = await findCandidateDocs(workspaceRoot, docsRoots, [
    'finding',
    'findings',
    'issues',
    'risk',
  ]);
  const stackDocs = await findCandidateDocs(workspaceRoot, docsRoots, [
    'stack',
    'infrastructure',
    'ops',
    'redis',
    'queue',
    'cron',
    'worker',
  ]);
  const candidates: RoleCandidate[] = [
    {
      role: 'agent-entrypoint',
      title: 'Agent entrypoint',
      sourcePaths: [
        {
          path: instructionPath,
          kind: 'instruction',
          authority: 'canonical',
          summary: 'Primary guidance file for coding agents.',
        },
      ],
      missingSummary: 'No agent entrypoint is mapped yet.',
      nextAction: 'Create or map AGENTS.md before broad agent-led work.',
      suggestedPaths: ['AGENTS.md'],
      required: true,
    },
    {
      role: 'project-overview',
      title: 'Project overview',
      sourcePaths: [
        {
          path: 'README.md',
          kind: 'human-doc',
          authority: 'supporting',
          summary: 'Project overview for humans and agents.',
        },
        {
          path: startHerePath,
          kind: 'human-doc',
          authority: 'canonical',
          summary: 'Docs entrypoint for project knowledge.',
        },
      ],
      missingSummary: 'No project overview source is mapped yet.',
      nextAction: 'Map an existing README or docs overview, or create a short project overview.',
      suggestedPaths: ['README.md', startHerePath],
      required: true,
    },
    {
      role: 'architecture-structure',
      title: 'Architecture and structure',
      sourcePaths: architectureDocs.map((path) => ({
        path,
        kind: 'human-doc' as const,
        authority: 'supporting' as const,
        summary: 'Architecture, structure, or system guidance.',
      })),
      missingSummary: 'Architecture or structure guidance is not mapped yet.',
      nextAction: 'Map an existing architecture doc or add a short architecture note before risky structural work.',
      suggestedPaths: [`${docsRoot}/architecture.md`, `${docsRoot}/00-start-here.md`],
    },
    {
      role: 'validation-gates',
      title: 'Validation and gates',
      sourcePaths: [
        {
          path: instructionPath,
          kind: 'instruction',
          authority: 'supporting',
          summary: 'Agent instructions may describe checks before finishing work.',
        },
        {
          path: startHerePath,
          kind: 'human-doc',
          authority: 'supporting',
          summary: 'Docs entrypoint may describe validation lanes.',
        },
      ],
      missingSummary: 'Validation guidance is not mapped yet.',
      nextAction: 'Add or map validation lane guidance so agents know which checks prove changes.',
      suggestedPaths: [instructionPath, startHerePath],
      required: true,
    },
    {
      role: 'decisions-rationale',
      title: 'Decisions and rationale',
      sourcePaths: decisionDocs.map((path) => ({
        path,
        kind: 'human-doc' as const,
        authority: 'supporting' as const,
        summary: 'Decision or rationale log.',
      })),
      missingSummary: 'No durable decision/rationale location is mapped yet.',
      nextAction: 'Map an existing decision log or create a lightweight decision location.',
      suggestedPaths: [`${docsRoot}/decisions`, `${docsRoot}/decisions.md`],
    },
    {
      role: 'findings-drift',
      title: 'Findings and drift',
      sourcePaths: [
        ...findingDocs.map((path) => ({
          path,
          kind: 'human-doc' as const,
          authority: 'supporting' as const,
          summary: 'Known findings, issues, risks, or drift.',
        })),
        {
          path: DRIFT_REPORT_ARTIFACT_PATH,
          kind: 'generated-artifact' as const,
          authority: 'generated' as const,
          summary: 'Generated accepted-policy drift report.',
        },
      ],
      missingSummary: 'No findings or drift surface is mapped yet.',
      nextAction: 'Map known issues/findings or run policy drift after accepting packs.',
      suggestedPaths: [`${docsRoot}/findings`, DRIFT_REPORT_ARTIFACT_PATH],
    },
    {
      role: 'generated-artifacts',
      title: 'Generated artifact ownership',
      sourcePaths: [
        {
          path: '.gitignore',
          kind: 'config',
          authority: 'supporting',
          summary: 'Generated Skopos output ignore rules.',
        },
        {
          path: instructionPath,
          kind: 'instruction',
          authority: 'supporting',
          summary: 'Agent instructions may explain generated-output ownership.',
        },
      ],
      missingSummary: 'Generated artifact ownership guidance is not mapped yet.',
      nextAction: 'Document which generated files agents must not edit by hand.',
      suggestedPaths: [instructionPath, '.gitignore'],
      required: true,
    },
    {
      role: 'accepted-policy',
      title: 'Accepted policy',
      sourcePaths: [
        {
          path: RESOLVED_POLICY_ARTIFACT_PATH,
          kind: 'generated-artifact',
          authority: 'generated',
          summary: 'Accepted local policy packs and overrides.',
        },
      ],
      missingSummary: 'No accepted policy pack is mapped yet.',
      nextAction: 'Run `skopos policies recommend .` and accept suitable packs before broad agent work.',
      suggestedPaths: [RESOLVED_POLICY_ARTIFACT_PATH],
    },
    {
      role: 'stack-decisions',
      title: 'Stack decisions',
      sourcePaths: stackDocs.map((path) => ({
        path,
        kind: 'human-doc' as const,
        authority: 'supporting' as const,
        summary: 'Stack or infrastructure decision guidance.',
      })),
      missingSummary: 'No stack decision surface is mapped yet.',
      nextAction: 'Record stack choices when adding infrastructure such as queues, Redis, cron, or workers.',
      suggestedPaths: [`${docsRoot}/stack-decisions.md`, `${docsRoot}/decisions`],
    },
    {
      role: 'active-work',
      title: 'Active work and proof history',
      sourcePaths: [
        ...(latestMissionPath
          ? [
              {
                path: latestMissionPath,
                kind: 'workflow-artifact' as const,
                authority: 'generated' as const,
                summary: 'Latest active mission or work item.',
              },
            ]
          : []),
      ],
      missingSummary: 'No active work artifact is mapped yet.',
      nextAction: 'Use `skopos start` for normal or risky work so execution state is durable.',
      suggestedPaths: ['.skopos/missions'],
    },
    {
      role: 'discussion-handoff',
      title: 'Discussion handoff',
      sourcePaths: latestHandoffPath
        ? [
            {
              path: latestHandoffPath,
              kind: 'workflow-artifact',
              authority: 'generated',
              summary: 'Latest compact handoff for context continuation.',
            },
          ]
        : [],
      missingSummary: 'No discussion handoff is mapped yet.',
      nextAction: 'Create a handoff before long work crosses chats or context windows.',
      suggestedPaths: [DISCUSSION_HANDOFF_DIRECTORY],
    },
  ];

  return Promise.all(
    candidates.map((candidate) =>
      buildMemoryRole({
        workspaceRoot,
        candidate,
        resolvedPolicy,
        driftReport,
      }),
    ),
  );
};

const buildMemoryRole = async ({
  workspaceRoot,
  candidate,
  resolvedPolicy,
  driftReport,
}: {
  workspaceRoot: string;
  candidate: RoleCandidate;
  resolvedPolicy?: SkoposResolvedPolicyArtifact;
  driftReport?: SkoposDriftReportArtifact;
}): Promise<SkoposMemoryRole> => {
  const sources = (
    await Promise.all(
      candidate.sourcePaths.map(async (source) => ({
        ...source,
        existsAtBuild: await pathExists(join(workspaceRoot, source.path)),
      })),
    )
  ).filter((source) => source.existsAtBuild).slice(0, MAX_ROLE_SOURCES);
  const status = deriveRoleStatus({
    candidate,
    sources,
    resolvedPolicy,
    driftReport,
  });
  const authority = sources.find((source) => source.authority === 'canonical')?.authority ??
    sources[0]?.authority ??
    'unknown';

  return {
    role: candidate.role,
    title: candidate.title,
    status,
    authority,
    confidence: status === 'mapped' ? 'high' : status === 'needs-review' ? 'medium' : 'low',
    freshness: status === 'stale' ? 'stale' : status === 'missing' ? 'unknown' : 'fresh',
    summary:
      status === 'mapped'
        ? `${candidate.title} is mapped to ${sources.map((source) => `\`${source.path}\``).join(', ')}.`
        : candidate.missingSummary,
    sources,
    suggestionIds: status === 'mapped' ? [] : [`memory.${candidate.role}`],
  };
};

const deriveRoleStatus = ({
  candidate,
  sources,
  resolvedPolicy,
  driftReport,
}: {
  candidate: RoleCandidate;
  sources: SkoposMemoryRoleSource[];
  resolvedPolicy?: SkoposResolvedPolicyArtifact;
  driftReport?: SkoposDriftReportArtifact;
}): SkoposMemoryRoleStatus => {
  if (candidate.role === 'accepted-policy') {
    return resolvedPolicy?.acceptedPacks.length ? 'mapped' : 'needs-review';
  }

  if (candidate.role === 'findings-drift' && driftReport) {
    return 'mapped';
  }

  if (sources.length > 0) {
    return 'mapped';
  }

  return candidate.required ? 'missing' : 'needs-review';
};

const buildMemorySuggestions = (roles: SkoposMemoryRole[]): SkoposMemorySuggestion[] =>
  roles
    .filter((role) => role.status !== 'mapped')
    .map((role) => ({
      id: `memory.${role.role}`,
      role: role.role,
      severity: role.status === 'missing' ? 'must' : 'should',
      summary: `${role.title} needs review.`,
      nextAction: nextActionForRole(role.role),
      suggestedPaths: suggestedPathsForRole(role.role),
      requiresApproval: true,
    }));

const nextActionForRole = (role: SkoposMemoryRoleKind): string => {
  const actions: Record<SkoposMemoryRoleKind, string> = {
    'agent-entrypoint': 'Create or map AGENTS.md before broad agent-led work.',
    'project-overview': 'Map README.md or a project overview doc.',
    'architecture-structure': 'Map existing architecture guidance or add a short architecture note.',
    'validation-gates': 'Add validation lane guidance to AGENTS.md or the docs router.',
    'decisions-rationale': 'Create or map a lightweight decision log.',
    'findings-drift': 'Map known findings or run policy drift after accepting packs.',
    'generated-artifacts': 'Document generated-output ownership and ignored generated paths.',
    'accepted-policy': 'Run policy recommendations and accept suitable packs before broad agent work.',
    'stack-decisions': 'Record stack decisions when infrastructure choices are made.',
    'active-work': 'Use skopos start for normal or risky work.',
    'discussion-handoff': 'Create a compact handoff before long work crosses chats.',
  };
  return actions[role];
};

const suggestedPathsForRole = (role: SkoposMemoryRoleKind): string[] => {
  const paths: Record<SkoposMemoryRoleKind, string[]> = {
    'agent-entrypoint': ['AGENTS.md'],
    'project-overview': ['README.md', 'docs/00-start-here.md'],
    'architecture-structure': ['docs/architecture.md'],
    'validation-gates': ['AGENTS.md', 'docs/00-start-here.md'],
    'decisions-rationale': ['docs/decisions'],
    'findings-drift': ['docs/findings', DRIFT_REPORT_ARTIFACT_PATH],
    'generated-artifacts': ['AGENTS.md', '.gitignore'],
    'accepted-policy': [RESOLVED_POLICY_ARTIFACT_PATH],
    'stack-decisions': ['docs/stack-decisions.md', 'docs/decisions'],
    'active-work': ['.skopos/missions'],
    'discussion-handoff': [DISCUSSION_HANDOFF_DIRECTORY],
  };
  return paths[role];
};

const deriveMemoryFreshness = (roles: SkoposMemoryRole[]): SkoposMemoryFreshnessStatus => {
  if (roles.some((role) => role.freshness === 'stale')) {
    return 'stale';
  }

  if (roles.some((role) => role.status === 'missing' || role.status === 'needs-review')) {
    return 'partial';
  }

  return 'fresh';
};

const buildSourceProbes = async (
  workspaceRoot: string,
  roles: SkoposMemoryRole[],
): Promise<SkoposMemorySourceProbe[]> => {
  const checkedAt = new Date().toISOString();
  const paths = [...new Set(roles.flatMap((role) => role.sources.map((source) => source.path)))];
  return Promise.all(
    paths.map(async (path) => {
      const absolutePath = join(workspaceRoot, path);
      const existsAtBuild = await pathExists(absolutePath);
      const fileStat = existsAtBuild ? await stat(absolutePath).catch(() => undefined) : undefined;
      return {
        path,
        kind: 'memory-role-source',
        existsAtBuild,
        fingerprint: fileStat ? `${Math.round(fileStat.mtimeMs)}:${fileStat.size}` : undefined,
        checkedAt,
      };
    }),
  );
};

const buildLayerSummaries = ({
  roles,
  resolvedPolicy,
  driftReport,
}: {
  roles: SkoposMemoryRole[];
  resolvedPolicy?: SkoposResolvedPolicyArtifact;
  driftReport?: SkoposDriftReportArtifact;
}): SkoposMemoryStateArtifact['layers'] => [
  {
    kind: 'observed',
    status: roles.some((role) => role.sources.length > 0) ? 'fresh' : 'unknown',
    summary: `${roles.filter((role) => role.sources.length > 0).length} memory role${roles.filter((role) => role.sources.length > 0).length === 1 ? '' : 's'} mapped to local sources.`,
    artifactPaths: [BOOTSTRAP_ARTIFACT_PATH, CONFIG_ARTIFACT_PATH],
    staleSourceCount: roles.filter((role) => role.freshness === 'stale').length,
    missingSourceCount: roles.filter((role) => role.status === 'missing').length,
  },
  {
    kind: 'accepted',
    status: resolvedPolicy?.acceptedPacks.length ? 'fresh' : 'partial',
    summary: resolvedPolicy?.acceptedPacks.length
      ? `${resolvedPolicy.acceptedPacks.length} accepted policy pack${resolvedPolicy.acceptedPacks.length === 1 ? '' : 's'} recorded.`
      : 'No accepted policy pack is recorded yet.',
    artifactPaths: resolvedPolicy ? [RESOLVED_POLICY_ARTIFACT_PATH] : [],
    staleSourceCount: 0,
    missingSourceCount: resolvedPolicy ? 0 : 1,
  },
  {
    kind: 'operational',
    status: roles.some((role) => role.role === 'active-work' && role.status === 'mapped')
      ? 'fresh'
      : 'partial',
    summary: 'Mission, proof, discussion, and drift artifacts describe current operational state when present.',
    artifactPaths: [
      ...(driftReport ? [DRIFT_REPORT_ARTIFACT_PATH] : []),
      ...roles
        .find((role) => role.role === 'active-work')
        ?.sources.map((source) => source.path) ?? [],
    ],
    staleSourceCount: 0,
    missingSourceCount: 0,
  },
  {
    kind: 'agent-ready',
    status: 'fresh',
    summary: 'Communication guidance is generated for coding agents.',
    artifactPaths: [COMMUNICATION_BRIEF_ARTIFACT_PATH],
    staleSourceCount: 0,
    missingSourceCount: 0,
  },
];

const buildAcceptedDecisionSnapshots = (
  resolvedPolicy?: SkoposResolvedPolicyArtifact,
): SkoposMemoryStateArtifact['acceptedDecisionSnapshots'] =>
  resolvedPolicy?.acceptedPacks.map((pack) => ({
    id: pack.packId,
    title: pack.packId,
    kind: 'policy',
    status: 'accepted',
    summary: pack.reason,
  })) ?? [];

const buildAgentCommunicationBrief = ({
  workspaceRoot,
  generatedAt,
  memory,
}: {
  workspaceRoot: string;
  generatedAt: string;
  memory: SkoposMemoryStateArtifact;
}): SkoposAgentCommunicationBriefArtifact => ({
  schemaVersion: 1,
  id: 'agent-brief-communication',
  type: 'agent-brief',
  status: 'generated',
  authority: 'generated',
  summary: 'Project-specific guidance for how coding agents should explain, ask, progress, validate, and close work with Skopos.',
  updatedAt: generatedAt,
  generatedAt,
  workspaceRoot,
  briefKind: 'communication',
  audience: 'beginner-mid-level',
  startupRules: [
    'Read AGENTS.md first.',
    'Run or inspect `skopos program next . --compact --json` before broad scanning or implementation.',
    'If Skopos state is missing or stale, run `skopos init .` and re-check program next.',
    'Choose light, normal, or workpack lane before editing.',
    'Load this communication brief when available so answers, questions, progress, and closure stay user-friendly.',
  ],
  tone: [
    'Use clear, calm, simple English.',
    'Explain important tradeoffs without assuming the user knows Skopos internals.',
    'Keep small-task updates brief and make risky-work updates more explicit.',
  ],
  defaultResponseShape: [
    'State the lane and why it fits.',
    'Give the immediate plan or next action.',
    'Call out blockers or user decisions only when they affect direction.',
    'End completed work with proof and remaining risk.',
  ],
  questionRules: [
    'Ask only when the answer changes implementation direction, risk, docs, policy, or public behavior.',
    'Show the recommended option first.',
    'Explain why it is recommended and give the main alternatives with tradeoffs.',
    'State the default action when the user has no preference.',
  ],
  progressRules: [
    'For long work, show current phase, approximate progress, completed work, current work, blockers, and proof still needed.',
    'Do not use false precision; prefer phrases like about 60% or 3 of 5 steps.',
    'Mention new decisions or findings when they change the plan.',
  ],
  closureRules: [
    'List checks run and whether they passed, failed, or were skipped with reason.',
    'Mention memory updates when project truth changed.',
    'Do not claim done if trust, eval, accepted-policy drift, or mission state blocks closure.',
  ],
  memoryUpdateRules: [
    `Memory freshness is currently ${memory.freshness}.`,
    'Update memory only when durable project truth changed.',
    'Suggest changes to human-authored docs before editing them in brownfield projects.',
    'Keep generated `.skopos/**` state as the machine contract and human docs as readable project guidance.',
  ],
  escalationRules: [
    {
      id: 'lane.light',
      situation: 'Small local edit with low risk.',
      agentShouldDo: 'Use a light path: read compact context, inspect relevant files, edit, run a focused check, and update memory only if project truth changed.',
      userFacingTemplate: 'I will treat this as a light change because it is local and low risk.',
    },
    {
      id: 'lane.normal',
      situation: 'Feature, docs, policy, or multi-file work with moderate risk.',
      agentShouldDo: 'Use a normal tracked mission, keep decisions current, run proportional gates, and summarize proof before closure.',
      userFacingTemplate: 'I will treat this as normal-lane work because it changes durable project behavior or guidance.',
    },
    {
      id: 'lane.workpack',
      situation: 'Architecture, stack, migration, security, public API, or long-running work.',
      agentShouldDo: 'Use a workpack-level path with phases, explicit decisions, staged gates, memory sync, and closure proof.',
      userFacingTemplate: 'This needs a heavier path because it can affect future agents or production behavior.',
    },
  ],
});

const buildMemorySummary = (
  roles: SkoposMemoryRole[],
  suggestions: SkoposMemorySuggestion[],
): string => {
  const mappedCount = roles.filter((role) => role.status === 'mapped').length;
  const missingCount = roles.filter((role) => role.status === 'missing').length;
  const reviewCount = roles.filter((role) => role.status === 'needs-review').length;
  return `${mappedCount} of ${roles.length} memory roles mapped; ${missingCount} missing and ${reviewCount} need review. ${suggestions.length} suggestion${suggestions.length === 1 ? '' : 's'} available.`;
};

const buildRecommendedKnowledgeReads = (
  memory: SkoposMemoryStateArtifact,
): SkoposProjectKnowledgeGuidance['recommendedReads'] => {
  const priorityRoles: SkoposMemoryRoleKind[] = [
    'agent-entrypoint',
    'project-overview',
    'validation-gates',
    'architecture-structure',
  ];
  const reads: SkoposProjectKnowledgeGuidance['recommendedReads'] = [];

  for (const roleKind of priorityRoles) {
    const role = memory.roles.find((candidate) => candidate.role === roleKind);
    const source = role?.sources[0];
    if (!role || !source) {
      continue;
    }

    reads.push({
      role: role.role,
      title: role.title,
      path: source.path,
    });
  }

  return reads;
};

const findCandidateDocs = async (
  workspaceRoot: string,
  docsRoots: string[],
  keywords: string[],
): Promise<string[]> => {
  const candidates = new Set<string>();
  for (const docsRoot of docsRoots.length > 0 ? docsRoots : ['docs']) {
    for (const keyword of keywords) {
      candidates.add(`${docsRoot}/${keyword}.md`);
      candidates.add(`${docsRoot}/00-${keyword}.md`);
      candidates.add(`${docsRoot}/${keyword}/README.md`);
      candidates.add(`${docsRoot}/${keyword}/00-start-here.md`);
      candidates.add(`${docsRoot}/${keyword}/00-${keyword}.md`);
    }
  }
  const existingMarkdown = await listMarkdownFiles(workspaceRoot, docsRoots);
  for (const filePath of existingMarkdown) {
    const normalized = filePath.toLowerCase();
    if (keywords.some((keyword) => normalized.includes(keyword.toLowerCase()))) {
      candidates.add(filePath);
    }
  }

  return [...candidates];
};

const listMarkdownFiles = async (
  workspaceRoot: string,
  docsRoots: string[],
): Promise<string[]> => {
  const roots = docsRoots.length > 0 ? docsRoots : ['docs'];
  const results: string[] = [];

  const visit = async (relativeDirectory: string): Promise<void> => {
    const absoluteDirectory = join(workspaceRoot, relativeDirectory);
    const entries = await readdir(absoluteDirectory, { withFileTypes: true }).catch(() => []);

    for (const entry of entries) {
      const relativePath = `${relativeDirectory}/${entry.name}`;
      if (entry.isDirectory()) {
        if (entry.name === 'archive' || entry.name === 'generated') {
          continue;
        }
        await visit(relativePath);
        continue;
      }

      if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
        results.push(relativePath);
      }
    }
  };

  for (const root of roots) {
    await visit(root);
  }

  return results;
};

const resolveLatestHandoffPath = async (workspaceRoot: string): Promise<string | undefined> => {
  const directory = join(workspaceRoot, DISCUSSION_HANDOFF_DIRECTORY);
  const entries = await readdir(directory).catch(() => []);
  const latest = entries.filter((entry) => entry.endsWith('.json')).sort().at(-1);
  return latest ? `${DISCUSSION_HANDOFF_DIRECTORY}/${latest}` : undefined;
};

const resolveLatestMissionPath = async (workspaceRoot: string): Promise<string | undefined> => {
  const directory = join(workspaceRoot, '.skopos', 'missions');
  const entries = await readdir(directory).catch(() => []);
  const missionPaths = entries
    .filter((entry) => entry.endsWith('.json'))
    .sort()
    .reverse();

  for (const entry of missionPaths) {
    const path = `.skopos/missions/${entry}`;
    const mission = await readJsonIfExists<SkoposMissionArtifact>(join(workspaceRoot, path));
    if (mission?.state === 'active') {
      return path;
    }
  }

  return missionPaths[0] ? `.skopos/missions/${missionPaths[0]}` : undefined;
};

const readJsonIfExists = async <T>(path: string): Promise<T | undefined> => {
  const contents = await readTextIfExists(path);
  return contents ? (JSON.parse(contents) as T) : undefined;
};

const readTextIfExists = async (path: string): Promise<string | undefined> => {
  try {
    return await readFile(path, 'utf8');
  } catch {
    return undefined;
  }
};

const pathExists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};
