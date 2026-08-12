import {
  assessSkoposTaskReadinessRuntime,
  applySkoposTaskSplitRuntime,
  assignSkoposTaskToSessionRuntime,
  applySkoposCapabilityIntegrationsRuntime,
  applySkoposTaskDispositionRuntime,
  approveSkoposCapabilityIntegrationsRuntime,
  buildSkoposContextRuntime,
  buildSkoposSessionContextRuntime,
  buildSkoposStartRuntime,
  buildSkoposWorkQueueRuntime,
  getSkoposCoordinationStatus,
  recordSkoposObservationEvidenceRuntime,
  proposeSkoposCapabilityIntegrationsRuntime,
  recoverSkoposActionRunRuntime,
  recoverSkoposCoordinationTask,
  proposeSkoposTaskSplitRuntime,
  runSkoposActionRuntime,
  showSkoposTaskRuntime,
  transitionSkoposCoordinationSession,
  verifySkoposTaskRuntime,
  buildSkoposDiscussionHandoffRuntime,
  showSkoposDiscussionHandoffRuntime,
  verifySkoposDiscussionHandoffRuntime,
  acceptSkoposDiscussionHandoffRuntime,
  renderSkoposDiscussionHandoffRuntime,
  recordSkoposDiscussionHandoffDeliveryRuntime,
} from '@skopos/runtime';

export const skoposMcpToolIds = [
  'skopos_context',
  'skopos_session_context',
  'skopos_work_queue',
  'skopos_task_start',
  'skopos_task_show',
  'skopos_task_split_propose',
  'skopos_task_split_apply',
  'skopos_task_assign',
  'skopos_action_run',
  'skopos_action_recover',
  'skopos_task_disposition',
  'skopos_evidence_record',
  'skopos_verify',
  'skopos_readiness',
  'skopos_coordination_status',
  'skopos_coordination_session_transition',
  'skopos_coordination_task_recover',
  'skopos_handoff_create',
  'skopos_handoff_refresh',
  'skopos_handoff_show',
  'skopos_handoff_verify',
  'skopos_handoff_accept',
  'skopos_handoff_render',
  'skopos_handoff_deliver',
  'skopos_integrations_propose',
  'skopos_integrations_approve',
  'skopos_integrations_apply',
] as const;

export type SkoposMcpToolId = (typeof skoposMcpToolIds)[number];

export interface SkoposMcpToolDefinition {
  name: SkoposMcpToolId;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, { type: string; description?: string }>;
    required?: string[];
    additionalProperties: false;
  };
}

const cwdProperty = {
  type: 'string',
  description: 'Absolute or process-relative project root.',
};

export const skoposMcpTools: SkoposMcpToolDefinition[] = [
  tool('skopos_context', 'Load compact Scope-aware project Memory.', {
    cwd: cwdProperty,
    scope: { type: 'string' },
  }, ['cwd']),
  tool('skopos_session_context', 'Load or heartbeat a coding-agent Session and return current Task, Work Queue, decision, and communication context.', {
    cwd: cwdProperty,
    actor: { type: 'string' },
    sessionId: { type: 'string' },
    host: { type: 'string' },
  }, ['cwd']),
  tool('skopos_work_queue', 'Build the derived Project Work Queue.', {
    cwd: cwdProperty,
    actor: { type: 'string' },
  }, ['cwd']),
  tool('skopos_task_start', 'Create and optionally coordinate one canonical Task.', {
    cwd: cwdProperty,
    goal: { type: 'string' },
    actor: { type: 'string' },
    scope: { type: 'string' },
    sessionId: { type: 'string' },
    host: { type: 'string' },
  }, ['cwd', 'goal']),
  tool('skopos_task_show', 'Read one exact Task by id.', {
    cwd: cwdProperty,
    taskId: { type: 'string' },
  }, ['cwd', 'taskId']),
  tool('skopos_task_split_propose', 'Validate and persist a review-required parent/child Task split without changing Task authority.', {
    cwd: cwdProperty,
    parentTaskId: { type: 'string' },
    childrenJson: { type: 'string', description: 'JSON-encoded array of SkoposTaskSplitChildDraft entries.' },
    actor: { type: 'string' },
    reason: { type: 'string' },
    dryRun: { type: 'boolean' },
  }, ['cwd', 'parentTaskId', 'childrenJson', 'actor', 'reason']),
  tool('skopos_task_split_apply', 'Explicitly approve one exact split proposal and create linked child Task authorities.', {
    cwd: cwdProperty,
    parentTaskId: { type: 'string' },
    proposalDigest: { type: 'string' },
    actor: { type: 'string' },
    reason: { type: 'string' },
    dryRun: { type: 'boolean' },
  }, ['cwd', 'parentTaskId', 'proposalDigest', 'actor', 'reason']),
  tool('skopos_task_assign', 'Assign one existing Task to a fresh or live Session, reserve it, and claim its owned resources.', {
    cwd: cwdProperty,
    taskId: { type: 'string' },
    actor: { type: 'string' },
    sessionId: { type: 'string' },
    host: { type: 'string' },
    leaseSeconds: { type: 'number' },
  }, ['cwd', 'taskId', 'actor', 'sessionId']),
  tool('skopos_action_run', 'Run one registered project Action and capture source-bound Evidence.', {
    cwd: cwdProperty,
    actionId: { type: 'string' },
    actor: { type: 'string' },
    taskId: { type: 'string' },
  }, ['cwd', 'actionId']),
  tool('skopos_action_recover', 'Recover one expired running Action as interrupted with an auditable resume command.', {
    cwd: cwdProperty,
    runId: { type: 'string' },
    actor: { type: 'string' },
    reason: { type: 'string' },
  }, ['cwd', 'runId', 'actor', 'reason']),
  tool('skopos_task_disposition', 'Apply one explicit reasoned Task work disposition.', {
    cwd: cwdProperty,
    taskId: { type: 'string' },
    disposition: { type: 'string' },
    actor: { type: 'string' },
    reason: { type: 'string' },
    successorTaskId: { type: 'string' },
  }, ['cwd', 'taskId', 'disposition', 'actor', 'reason']),
  tool('skopos_evidence_record', 'Record agent-observation Evidence for a Task requirement or Guard.', {
    cwd: cwdProperty,
    taskId: { type: 'string' },
    requirementId: { type: 'string' },
    statement: { type: 'string' },
    actor: { type: 'string' },
  }, ['cwd', 'taskId', 'statement']),
  tool('skopos_verify', 'Verify Task acceptance against current source-bound Evidence.', {
    cwd: cwdProperty,
    taskId: { type: 'string' },
    phase: { type: 'string' },
  }, ['cwd', 'taskId']),
  tool('skopos_readiness', 'Assess whether a Task is safe to continue, integrate, or close.', {
    cwd: cwdProperty,
    taskId: { type: 'string' },
    target: { type: 'string' },
    actor: { type: 'string' },
    advance: { type: 'boolean' },
  }, ['cwd', 'taskId', 'target']),
  tool('skopos_coordination_status', 'Inspect live Sessions, Task reservations, claims, mutations, and contamination.', {
    cwd: cwdProperty,
  }, ['cwd']),
  tool('skopos_coordination_session_transition', 'Safely transition one live Session between writer and reviewer modes after writing authority is released.', {
    cwd: cwdProperty,
    sessionId: { type: 'string' },
    actor: { type: 'string' },
    mode: { type: 'string', description: 'Target Session mode: writer or reviewer.' },
    reason: { type: 'string' },
  }, ['cwd', 'sessionId', 'actor', 'mode', 'reason']),
  tool('skopos_coordination_task_recover', 'Audit and resume or release a stale Task reservation from a live replacement Session.', {
    cwd: cwdProperty,
    taskId: { type: 'string' },
    sessionId: { type: 'string' },
    operation: { type: 'string' },
    reason: { type: 'string' },
  }, ['cwd', 'taskId', 'sessionId', 'operation', 'reason']),
  tool('skopos_handoff_create', 'Create the exact Task fresh-session handoff from an agent-authored semantic capsule and compiled live state.', {
    cwd: cwdProperty,
    taskId: { type: 'string' },
    capsuleJson: { type: 'string', description: 'JSON-encoded SkoposConversationCapsule.' },
    dryRun: { type: 'boolean' },
  }, ['cwd', 'taskId', 'capsuleJson']),
  tool('skopos_handoff_refresh', 'Refresh live Task, source, Evidence, policy, Skill, and coordination identities while preserving semantic context.', { cwd: cwdProperty, taskId: { type: 'string' }, dryRun: { type: 'boolean' } }, ['cwd', 'taskId']),
  tool('skopos_handoff_show', 'Show the exact current Task handoff.', { cwd: cwdProperty, taskId: { type: 'string' } }, ['cwd', 'taskId']),
  tool('skopos_handoff_verify', 'Classify exact handoff freshness and transfer safety.', { cwd: cwdProperty, taskId: { type: 'string' } }, ['cwd', 'taskId']),
  tool('skopos_handoff_accept', 'Accept a current safe handoff for one receiving Session through the shared runtime owner.', {
    cwd: cwdProperty, taskId: { type: 'string' }, actor: { type: 'string' }, receivingSessionId: { type: 'string' }, destinationHost: { type: 'string' }, dryRun: { type: 'boolean' },
  }, ['cwd', 'taskId', 'actor', 'receivingSessionId', 'destinationHost']),
  tool('skopos_handoff_render', 'Render the stable reviewed host-neutral continuation prompt.', { cwd: cwdProperty, taskId: { type: 'string' } }, ['cwd', 'taskId']),
  tool('skopos_handoff_deliver', 'Record a real host delivery result and origin-message outcome after acceptance; rendering alone is not delivery.', {
    cwd: cwdProperty, taskId: { type: 'string' }, actor: { type: 'string' }, result: { type: 'string' }, destinationRef: { type: 'string' }, originMessageOutcome: { type: 'string' }, detail: { type: 'string' }, dryRun: { type: 'boolean' },
  }, ['cwd', 'taskId', 'actor', 'result', 'originMessageOutcome', 'detail']),
  tool('skopos_integrations_propose', 'Detect project capability candidates and emit a non-authoritative proposal without writing tracked Action or Guard declarations.', {
    cwd: cwdProperty,
  }, ['cwd']),
  tool('skopos_integrations_approve', 'Explicitly approve reviewed capability candidates bound to one exact proposal digest; this still writes no tracked declarations.', {
    cwd: cwdProperty,
    proposalDigest: { type: 'string' },
    candidateIds: { type: 'string', description: 'Comma-separated candidate ids from the reviewed proposal.' },
    actor: { type: 'string' },
    reason: { type: 'string' },
    actionManifestPath: { type: 'string' },
    guardManifestPath: { type: 'string' },
  }, ['cwd', 'proposalDigest', 'candidateIds', 'actor', 'reason']),
  tool('skopos_integrations_apply', 'Write Action and Guard declarations only from an exact approval, then validate every Guard provider.', {
    cwd: cwdProperty,
    approvalDigest: { type: 'string' },
    actor: { type: 'string' },
  }, ['cwd', 'approvalDigest', 'actor']),
];

export const callSkoposMcpTool = async (
  name: SkoposMcpToolId,
  input: Record<string, unknown>,
): Promise<unknown> => {
  const cwd = requiredString(input, 'cwd');
  switch (name) {
    case 'skopos_context':
      return buildSkoposContextRuntime({
        cwd,
        scope: optionalString(input, 'scope'),
      });
    case 'skopos_session_context':
      return buildSkoposSessionContextRuntime({
        cwd,
        actor: optionalString(input, 'actor'),
        sessionId: optionalString(input, 'sessionId'),
        host: optionalString(input, 'host'),
      });
    case 'skopos_work_queue':
      return buildSkoposWorkQueueRuntime({
        cwd,
        actor: optionalString(input, 'actor'),
      });
    case 'skopos_task_start':
      return buildSkoposStartRuntime({
        cwd,
        goal: requiredString(input, 'goal'),
        actor: optionalString(input, 'actor'),
        scope: optionalString(input, 'scope'),
        sessionId: optionalString(input, 'sessionId'),
        host: optionalString(input, 'host'),
      });
    case 'skopos_task_show':
      return showSkoposTaskRuntime({ cwd, taskId: requiredString(input, 'taskId') });
    case 'skopos_task_split_propose':
      return proposeSkoposTaskSplitRuntime({
        cwd,
        parentTaskId: requiredString(input, 'parentTaskId'),
        children: JSON.parse(requiredString(input, 'childrenJson')),
        actor: requiredString(input, 'actor'),
        reason: requiredString(input, 'reason'),
        dryRun: input.dryRun === true,
      });
    case 'skopos_task_split_apply':
      return applySkoposTaskSplitRuntime({
        cwd,
        parentTaskId: requiredString(input, 'parentTaskId'),
        proposalDigest: requiredString(input, 'proposalDigest'),
        actor: requiredString(input, 'actor'),
        reason: requiredString(input, 'reason'),
        dryRun: input.dryRun === true,
      });
    case 'skopos_task_assign':
      return assignSkoposTaskToSessionRuntime({
        cwd,
        taskId: requiredString(input, 'taskId'),
        actor: requiredString(input, 'actor'),
        sessionId: requiredString(input, 'sessionId'),
        host: optionalString(input, 'host'),
        leaseSeconds: optionalNumber(input, 'leaseSeconds'),
      });
    case 'skopos_action_run':
      return runSkoposActionRuntime({
        cwd,
        action: requiredString(input, 'actionId'),
        actor: optionalString(input, 'actor'),
        taskId: optionalString(input, 'taskId'),
      });
    case 'skopos_action_recover':
      return recoverSkoposActionRunRuntime({
        cwd,
        runId: requiredString(input, 'runId'),
        actor: requiredString(input, 'actor'),
        reason: requiredString(input, 'reason'),
      });
    case 'skopos_task_disposition':
      return applySkoposTaskDispositionRuntime({
        cwd,
        taskId: requiredString(input, 'taskId'),
        disposition: requiredString(input, 'disposition') as
          | 'resume'
          | 'ready'
          | 'defer'
          | 'return-from-verification'
          | 'cancel'
          | 'supersede',
        actor: requiredString(input, 'actor'),
        reason: requiredString(input, 'reason'),
        successorTaskId: optionalString(input, 'successorTaskId'),
      });
    case 'skopos_evidence_record':
      return recordSkoposObservationEvidenceRuntime({
        cwd,
        taskId: requiredString(input, 'taskId'),
        requirementId: optionalString(input, 'requirementId'),
        statement: requiredString(input, 'statement'),
        actor: optionalString(input, 'actor'),
      });
    case 'skopos_verify':
      return verifySkoposTaskRuntime({
        cwd,
        taskId: requiredString(input, 'taskId'),
        phase: optionalString(input, 'phase') as
          | 'admission'
          | 'iteration'
          | 'stabilization'
          | 'closure'
          | undefined,
      });
    case 'skopos_readiness':
      return assessSkoposTaskReadinessRuntime({
        cwd,
        taskId: requiredString(input, 'taskId'),
        target: requiredString(input, 'target') as 'continue' | 'integrate' | 'close',
        actor: optionalString(input, 'actor'),
        advance: input.advance === true,
      });
    case 'skopos_coordination_status':
      return getSkoposCoordinationStatus({ cwd });
    case 'skopos_coordination_session_transition':
      return transitionSkoposCoordinationSession({
        cwd,
        sessionId: requiredString(input, 'sessionId'),
        actorId: requiredString(input, 'actor'),
        mode: requiredString(input, 'mode') as 'writer' | 'reviewer',
        reason: requiredString(input, 'reason'),
      });
    case 'skopos_coordination_task_recover':
      return recoverSkoposCoordinationTask({
        cwd,
        taskId: requiredString(input, 'taskId'),
        sessionId: requiredString(input, 'sessionId'),
        operation: requiredString(input, 'operation') as 'resume' | 'release',
        reason: requiredString(input, 'reason'),
      });
    case 'skopos_handoff_create':
      return buildSkoposDiscussionHandoffRuntime({ cwd, taskId: requiredString(input, 'taskId'), conversationCapsule: JSON.parse(requiredString(input, 'capsuleJson')), dryRun: input.dryRun === true });
    case 'skopos_handoff_refresh':
      return buildSkoposDiscussionHandoffRuntime({ cwd, taskId: requiredString(input, 'taskId'), dryRun: input.dryRun === true });
    case 'skopos_handoff_show':
      return showSkoposDiscussionHandoffRuntime({ cwd, taskId: requiredString(input, 'taskId') });
    case 'skopos_handoff_verify':
      return verifySkoposDiscussionHandoffRuntime({ cwd, taskId: requiredString(input, 'taskId') });
    case 'skopos_handoff_accept':
      return acceptSkoposDiscussionHandoffRuntime({ cwd, taskId: requiredString(input, 'taskId'), actor: requiredString(input, 'actor'), receivingSessionId: requiredString(input, 'receivingSessionId'), destinationHost: requiredString(input, 'destinationHost'), dryRun: input.dryRun === true });
    case 'skopos_handoff_render':
      return renderSkoposDiscussionHandoffRuntime({ cwd, taskId: requiredString(input, 'taskId') });
    case 'skopos_handoff_deliver':
      return recordSkoposDiscussionHandoffDeliveryRuntime({ cwd, taskId: requiredString(input, 'taskId'), actor: requiredString(input, 'actor'), result: requiredString(input, 'result') as 'pass' | 'fail', destinationRef: optionalString(input, 'destinationRef'), originMessageOutcome: requiredString(input, 'originMessageOutcome') as 'succeeded' | 'failed' | 'unsupported', detail: requiredString(input, 'detail'), dryRun: input.dryRun === true });
    case 'skopos_integrations_propose':
      return proposeSkoposCapabilityIntegrationsRuntime({ cwd });
    case 'skopos_integrations_approve':
      return approveSkoposCapabilityIntegrationsRuntime({
        cwd,
        proposalDigest: requiredString(input, 'proposalDigest'),
        acceptedCandidateIds: requiredString(input, 'candidateIds')
          .split(',')
          .map((candidateId) => candidateId.trim())
          .filter(Boolean),
        actor: requiredString(input, 'actor'),
        reason: requiredString(input, 'reason'),
        actionManifestPath: optionalString(input, 'actionManifestPath'),
        guardManifestPath: optionalString(input, 'guardManifestPath'),
      });
    case 'skopos_integrations_apply':
      return applySkoposCapabilityIntegrationsRuntime({
        cwd,
        approvalDigest: requiredString(input, 'approvalDigest'),
        actor: requiredString(input, 'actor'),
      });
  }
};

function tool(
  name: SkoposMcpToolId,
  description: string,
  properties: SkoposMcpToolDefinition['inputSchema']['properties'],
  required: string[],
): SkoposMcpToolDefinition {
  return {
    name,
    description,
    inputSchema: {
      type: 'object',
      properties,
      required,
      additionalProperties: false,
    },
  };
}

const requiredString = (input: Record<string, unknown>, key: string): string => {
  const value = optionalString(input, key);
  if (!value) throw new Error(`Skopos MCP tool requires ${key}.`);
  return value;
};

const optionalString = (
  input: Record<string, unknown>,
  key: string,
): string | undefined => {
  const value = input[key];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
};

const optionalNumber = (
  input: Record<string, unknown>,
  key: string,
): number | undefined => {
  const value = input[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
};
