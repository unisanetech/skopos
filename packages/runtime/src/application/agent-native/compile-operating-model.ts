import type {
  SkoposAction,
  SkoposAgentNativeOperatingModel,
  SkoposContextEntry,
  SkoposDocumentKnowledgeEntry,
  SkoposExecutionPhase,
  SkoposGuard,
  SkoposKnowledgeEntry,
  SkoposMemoryDecisionSnapshot,
  SkoposMemoryStateArtifact,
  SkoposPolicyRule,
  SkoposGuardManifest,
  SkoposResolvedPolicyArtifact,
  SkoposActionManifest,
  SkoposTaskRisk,
} from '@skopos/model';
import { isSkoposAdoptedProjectMemoryDocument } from '@skopos/indexer';

import { parseSkoposStructuredCommand } from './structured-command.js';

const MEMORY_STATE_ARTIFACT_PATH = '.skopos/index/roles.json';
const ALL_RISKS: SkoposTaskRisk[] = ['light', 'standard', 'high-impact'];

export interface CompileSkoposAgentNativeOperatingModelOptions {
  actions?: SkoposActionManifest[];
  policy?: SkoposResolvedPolicyArtifact;
  guards?: SkoposGuardManifest[];
  knowledge?: SkoposKnowledgeEntry[];
  memory?: SkoposMemoryStateArtifact;
}

export const compileSkoposDocumentKnowledgeEntries = (
  documents: SkoposDocumentKnowledgeEntry[],
): SkoposKnowledgeEntry[] =>
  documents
    .filter(isSkoposAdoptedProjectMemoryDocument)
    .map((document) => {
      const metadata = document.metadata!;
      const authority = metadata.provenance!;
      const kind =
        document.role === 'pattern'
          ? metadata.patternKind!
          : document.role;

      return {
        id: document.id,
        kind,
        title: document.title,
        summary:
          document.summary ??
          `Project ${document.role} documented at ${document.path}.`,
        scopeId: metadata.scope,
        authority,
        lifecycle: 'active',
        appliesTo: [
          ...(metadata.appliesTo ?? []),
          document.role,
          document.path,
          document.path.split('/').at(-1)?.replace(/\.[^.]+$/, '') ?? document.path,
        ],
        provenance: [
          {
            authority,
            sourceKind: 'project-memory',
            sourceId: document.id,
            path: document.path,
          },
        ],
      };
    });

export const compileSkoposAgentNativeOperatingModel = ({
  actions: actionManifests = [],
  policy,
  guards,
  knowledge = [],
  memory,
}: CompileSkoposAgentNativeOperatingModelOptions): SkoposAgentNativeOperatingModel => {
  const diagnostics: string[] = [];
  const actions = actionManifests.map((action) => compileAction(action, diagnostics));

  if (!policy) {
    diagnostics.push('Accepted policy context is unavailable.');
  }

  if (!guards) {
    diagnostics.push('Resolved guard state is unavailable.');
  }

  const compiledKnowledge = dedupeKnowledgeEntries([
    ...(memory?.acceptedDecisionSnapshots.map(compileDecisionSnapshot) ?? []),
    ...knowledge,
  ]);

  return {
    schemaVersion: 1,
    context: [
      ...(policy?.activeRules.map((rule) => compilePolicyContext(rule, policy)) ?? []),
      ...compiledKnowledge.map(compileKnowledgeContext),
    ],
    actions,
    guards: guards?.map((guard) => compileGuard(guard, actionManifests)) ?? [],
    diagnostics,
  };
};

const compileDecisionSnapshot = (
  snapshot: SkoposMemoryDecisionSnapshot,
): SkoposKnowledgeEntry => ({
  id: `decision:${snapshot.id}`,
  kind:
    snapshot.status === 'rejected'
      ? 'rejected-approach'
      : snapshot.status === 'superseded'
        ? 'retired-pattern'
        : 'decision',
  title: snapshot.title,
  summary: snapshot.summary,
  authority:
    snapshot.status === 'deferred'
      ? 'proposed'
      : snapshot.status === 'superseded'
        ? 'historical'
        : 'accepted',
  lifecycle:
    snapshot.status === 'rejected'
      ? 'rejected'
      : snapshot.status === 'superseded'
        ? 'historical'
        : 'active',
  appliesTo: [snapshot.kind, snapshot.id],
  provenance: [
    {
      authority:
        snapshot.status === 'deferred'
          ? 'proposed'
          : snapshot.status === 'superseded'
            ? 'historical'
            : 'accepted',
      sourceKind: snapshot.sourcePath ? 'decision' : 'project-memory',
      sourceId: snapshot.id,
      path: snapshot.sourcePath ?? MEMORY_STATE_ARTIFACT_PATH,
    },
  ],
});

const dedupeKnowledgeEntries = (
  entries: SkoposKnowledgeEntry[],
): SkoposKnowledgeEntry[] => {
  const unique = new Map<string, SkoposKnowledgeEntry>();
  for (const entry of entries) {
    unique.set(entry.id, entry);
  }
  return [...unique.values()];
};

const NEGATIVE_KNOWLEDGE_KINDS = new Set<SkoposKnowledgeEntry['kind']>([
  'retired-pattern',
  'rejected-approach',
  'failure-pattern',
  'temporary-exception',
  'noncanonical-command',
]);

const compileKnowledgeContext = (entry: SkoposKnowledgeEntry): SkoposContextEntry => ({
  id: `knowledge:${entry.id}`,
  kind: NEGATIVE_KNOWLEDGE_KINDS.has(entry.kind)
    ? 'negative-knowledge'
    : 'project-memory',
  title: entry.title,
  summary:
    entry.removalCondition && entry.kind === 'temporary-exception'
      ? `${entry.summary} Removal condition: ${entry.removalCondition}`
      : entry.summary,
  scopeId: entry.scopeId,
  importance:
    entry.authority === 'declared' || entry.authority === 'accepted'
      ? 'recommended'
      : 'on-demand',
  appliesTo: entry.appliesTo,
  provenance: entry.provenance,
});

const compilePolicyContext = (
  rule: SkoposPolicyRule,
  policy: SkoposResolvedPolicyArtifact,
): SkoposContextEntry => {
  const packId = resolveRulePackId(rule.id, policy);
  const pack = policy.acceptedPacks.find((entry) => entry.packId === packId);

  return {
    id: `policy:${rule.id}`,
    kind: 'policy',
    title: rule.title,
    summary: rule.summary,
    importance:
      rule.severity === 'must'
        ? 'required'
        : rule.severity === 'should'
          ? 'recommended'
          : 'on-demand',
    appliesTo: rule.appliesTo,
    provenance: [
      {
        authority: 'accepted',
        sourceKind: 'policy',
        sourceId: pack ? `${pack.packId}@${pack.version}` : rule.id,
        path: policy.sourceDependencies
          .map((dependency) => dependency.path)
          .find((sourcePath) => sourcePath.includes(packId)),
      },
    ],
  };
};

const compileAction = (
  action: SkoposActionManifest,
  diagnostics: string[],
): SkoposAction => {
  const command = parseSkoposStructuredCommand(action.command, action.cwd);
  if (!command) {
    diagnostics.push(
      `Action ${action.id} uses shell syntax that cannot be projected safely.`,
    );
  }

  return {
    id: action.id,
    title: action.title,
    description: action.description,
    command,
    unavailableReason: command
      ? undefined
      : 'The Action command is not a safely structured executable plus arguments.',
    inputs: action.inputs,
    outputs: action.outputs,
    affectedPaths: action.affects,
    safety: action.safety,
    approval:
      action.requiresApproval || action.safety === 'destructive' ? 'required' : 'none',
    phases: resolveSkoposActionPhases(action),
    risks: action.risks ?? ALL_RISKS,
    evidence: {
      kind: 'action-run',
      requiredOutputPaths: action.outputs,
      recordsActor: action.safety !== 'read-only',
      recordsExitStatus: true,
      sourceBound: true,
      exactCommandOwnership: true,
    },
    provenance: [
      {
        authority: 'declared',
        sourceKind: 'action',
        sourceId: action.id,
        path: action.sourcePath,
      },
    ],
  };
};

const compileGuard = (
  guard: SkoposGuardManifest,
  actions: SkoposActionManifest[],
): SkoposGuard => {
  const actionIds = new Set(actions.map((action) => action.id));
  const missingActionIds = guard.requires.actionIds.filter(
    (actionId) => !actionIds.has(actionId),
  );
  const enforcement =
    missingActionIds.length > 0
      ? 'unavailable'
      : guard.strength === 'prohibited'
        ? 'prohibition'
        : guard.requires.evidence === 'source-bound-action'
          ? 'action-evidence'
          : 'manual-proof';

  return {
    id: guard.id,
    title: guard.title,
    summary: guard.description,
    kind:
      guard.strength === 'prohibited'
        ? 'prevention'
        : guard.requires.evidence === 'agent-observation'
          ? 'evidence'
          : 'verification',
    requiredness: guard.strength,
    enforcement,
    unavailableReason:
      missingActionIds.length > 0
        ? `Missing Action provider${missingActionIds.length === 1 ? '' : 's'}: ${missingActionIds.join(', ')}.`
        : undefined,
    requiredActionIds: guard.requires.actionIds,
    evidence: guard.requires.evidence,
    appliesToPaths: guard.appliesTo.paths,
    phases: guard.appliesTo.phases ?? ['closure'],
    risks: guard.appliesTo.risks ?? ALL_RISKS,
    provenance: [
      {
        authority: 'declared',
        sourceKind: 'guard',
        sourceId: guard.id,
        path: guard.sourcePath,
      },
    ],
  };
};

export const resolveSkoposActionPhases = (
  action: SkoposActionManifest,
): SkoposExecutionPhase[] => {
  if (action.phases && action.phases.length > 0) {
    return action.phases;
  }

  if (
    action.id.includes('proof') ||
    action.command.includes('proof') ||
    action.outputs.some((outputPath) => outputPath.includes('.skopos/evidence/proof'))
  ) {
    return ['closure'];
  }

  if (
    ['docs-generator', 'reference-generator', 'graph-generator', 'maintenance'].includes(
      action.category,
    )
  ) {
    return ['stabilization'];
  }

  if (action.category === 'quality-check' || action.category === 'docs-validator') {
    return ['iteration'];
  }

  return ['iteration'];
};

const resolveRulePackId = (
  ruleId: string,
  policy: SkoposResolvedPolicyArtifact,
): string =>
  policy.acceptedPacks
    .map((pack) => pack.packId)
    .sort((left, right) => right.length - left.length)
    .find((packId) => ruleId === packId || ruleId.startsWith(`${packId}.`)) ?? ruleId;
