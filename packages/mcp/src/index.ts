import {
  assessSkoposTaskReadinessRuntime,
  buildSkoposContextRuntime,
  buildSkoposSessionContextRuntime,
  buildSkoposStartRuntime,
  buildSkoposWorkQueueRuntime,
  getSkoposCoordinationStatus,
  recordSkoposObservationEvidenceRuntime,
  runSkoposActionRuntime,
  showSkoposTaskRuntime,
  verifySkoposTaskRuntime,
} from '@skopos/runtime';

export const skoposMcpToolIds = [
  'skopos_context',
  'skopos_session_context',
  'skopos_work_queue',
  'skopos_task_start',
  'skopos_task_show',
  'skopos_action_run',
  'skopos_evidence_record',
  'skopos_verify',
  'skopos_readiness',
  'skopos_coordination_status',
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
  tool('skopos_action_run', 'Run one registered project Action and capture source-bound Evidence.', {
    cwd: cwdProperty,
    actionId: { type: 'string' },
    actor: { type: 'string' },
  }, ['cwd', 'actionId']),
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
    case 'skopos_action_run':
      return runSkoposActionRuntime({
        cwd,
        action: requiredString(input, 'actionId'),
        actor: optionalString(input, 'actor'),
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
