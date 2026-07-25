import type {
  SkoposEvalExecutionPhase,
  SkoposWorkflowManifest,
} from '@skopos/model';

import { resolveSkoposWorkflowActionPhases } from './compile-operating-model.js';

export interface SelectSkoposEvalCheckCommandsOptions {
  executionPhase: SkoposEvalExecutionPhase;
  missionChecks: string[];
  changedScopeChecks?: string[];
}

export const selectSkoposEvalCheckCommands = ({
  executionPhase,
  missionChecks,
  changedScopeChecks = [],
}: SelectSkoposEvalCheckCommandsOptions): string[] => {
  if (executionPhase === 'stabilization') {
    return [];
  }

  if (executionPhase === 'closure') {
    return dedupeStrings(missionChecks);
  }

  const missionFamilies = new Set(missionChecks.map(classifyCheckCommand));

  return dedupeStrings(
    changedScopeChecks.filter((command) => {
      const family = classifyCheckCommand(command);
      if (family === 'build') {
        return false;
      }

      return missionChecks.includes(command) || missionFamilies.has(family);
    }),
  );
};

export const selectSkoposEvalWorkflowIds = ({
  executionPhase,
  missionWorkflowIds,
  workflows,
}: {
  executionPhase: SkoposEvalExecutionPhase;
  missionWorkflowIds: string[];
  workflows: SkoposWorkflowManifest[];
}): string[] => {
  if (executionPhase === 'closure') {
    return dedupeStrings(missionWorkflowIds);
  }

  const workflowsById = new Map(workflows.map((workflow) => [workflow.id, workflow]));

  return missionWorkflowIds.filter((workflowId) => {
    const workflow = workflowsById.get(workflowId);
    return workflow
      ? resolveSkoposWorkflowActionPhases(workflow).includes(executionPhase)
      : false;
  });
};

const classifyCheckCommand = (command: string): string => {
  const normalized = command.toLowerCase();

  if (/(^|[\s:])(?:typecheck|check-types)(?:$|\s)/.test(normalized)) {
    return 'typecheck';
  }

  if (/(^|[\s:])test(?:$|\s)/.test(normalized)) {
    return 'test';
  }

  if (/(^|[\s:])build(?:$|\s)/.test(normalized)) {
    return 'build';
  }

  if (/(^|[\s:])lint(?:$|\s)/.test(normalized)) {
    return 'lint';
  }

  return `exact:${normalized.trim()}`;
};

const dedupeStrings = (values: string[]): string[] => [...new Set(values)];
