import type {
  SkoposAction,
  SkoposAgentNativeOperatingModel,
  SkoposContextEntry,
  SkoposExecutionLane,
  SkoposExecutionPhase,
  SkoposGuard,
  SkoposKnowledgeEntry,
  SkoposMemoryDecisionSnapshot,
  SkoposMemoryStateArtifact,
  SkoposPolicyRule,
  SkoposResolvedGate,
  SkoposResolvedGatesArtifact,
  SkoposResolvedPolicyArtifact,
  SkoposWorkflowManifest,
} from '@skopos/model';

import { parseSkoposStructuredCommand } from './structured-command.js';

const RESOLVED_GATES_ARTIFACT_PATH = '.skopos/gates/resolved.json';
const MEMORY_STATE_ARTIFACT_PATH = '.skopos/memory/state.json';
const ALL_RISK_LANES: SkoposExecutionLane[] = ['light', 'normal', 'workpack'];

export interface CompileSkoposAgentNativeOperatingModelOptions {
  workflows?: SkoposWorkflowManifest[];
  policy?: SkoposResolvedPolicyArtifact;
  gates?: SkoposResolvedGatesArtifact;
  knowledge?: SkoposKnowledgeEntry[];
  memory?: SkoposMemoryStateArtifact;
}

export const compileSkoposAgentNativeOperatingModel = ({
  workflows = [],
  policy,
  gates,
  knowledge = [],
  memory,
}: CompileSkoposAgentNativeOperatingModelOptions): SkoposAgentNativeOperatingModel => {
  const diagnostics: string[] = [];
  const actions = workflows.map((workflow) => compileWorkflowAction(workflow, diagnostics));

  if (!policy) {
    diagnostics.push('Accepted policy context is unavailable.');
  }

  if (!gates) {
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
    guards: gates?.gates.map(compileResolvedGate) ?? [],
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
        path: policy.sourcePaths.find((sourcePath) => sourcePath.includes(packId)),
      },
    ],
  };
};

const compileWorkflowAction = (
  workflow: SkoposWorkflowManifest,
  diagnostics: string[],
): SkoposAction => {
  const command = parseSkoposStructuredCommand(workflow.command, workflow.cwd);
  if (!command) {
    diagnostics.push(
      `Workflow ${workflow.id} uses shell syntax that cannot be projected as a structured action.`,
    );
  }

  return {
    id: workflow.id,
    title: workflow.title,
    description: workflow.description,
    command,
    unavailableReason: command
      ? undefined
      : 'The legacy workflow command is not a safely structured executable plus arguments.',
    inputs: workflow.inputs,
    outputs: workflow.outputs,
    affectedPaths: workflow.affects,
    safety: workflow.safety,
    approval:
      workflow.requiresApproval || workflow.safety === 'destructive' ? 'required' : 'none',
    phases: resolveSkoposWorkflowActionPhases(workflow),
    riskLanes: ALL_RISK_LANES,
    evidence: {
      kind: 'workflow-run',
      requiredOutputPaths: workflow.outputs,
      recordsActor: workflow.safety !== 'read-only',
      recordsExitStatus: true,
      sourceBound: true,
      exactCommandOwnership: true,
    },
    provenance: [
      {
        authority: 'declared',
        sourceKind: 'workflow',
        sourceId: workflow.id,
        path: workflow.sourcePath,
      },
    ],
  };
};

const compileResolvedGate = (gate: SkoposResolvedGate): SkoposGuard => {
  const command = gate.command
    ? parseSkoposStructuredCommand(gate.command, '.')
    : undefined;
  const enforcement =
    gate.status === 'missing'
      ? 'unavailable'
      : command
        ? 'command'
        : 'manual-proof';

  return {
    id: gate.id,
    title: gate.label,
    summary: gate.summary,
    kind: gate.kind === 'agent-proof' ? 'evidence' : 'verification',
    requiredness: gate.requiredness,
    enforcement,
    command,
    unavailableReason:
      gate.status === 'missing'
        ? gate.missingReason ?? 'The project does not expose this guard.'
        : gate.command && !command
          ? 'The gate command cannot be represented as a structured executable plus arguments.'
          : undefined,
    phases: ['closure'],
    riskLanes: ALL_RISK_LANES,
    provenance: [
      {
        authority: 'accepted',
        sourceKind: 'gate',
        sourceId: gate.id,
        path: RESOLVED_GATES_ARTIFACT_PATH,
      },
    ],
  };
};

export const resolveSkoposWorkflowActionPhases = (
  workflow: SkoposWorkflowManifest,
): SkoposExecutionPhase[] => {
  if (
    workflow.id.includes('proof') ||
    workflow.command.includes('proof') ||
    workflow.outputs.some((outputPath) => outputPath.includes('.skopos/proof'))
  ) {
    return ['closure'];
  }

  if (
    ['docs-generator', 'reference-generator', 'graph-generator', 'maintenance'].includes(
      workflow.category,
    )
  ) {
    return ['stabilization'];
  }

  if (workflow.category === 'quality-check' || workflow.category === 'docs-validator') {
    return workflow.requiredForDone ? ['iteration', 'closure'] : ['iteration'];
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
