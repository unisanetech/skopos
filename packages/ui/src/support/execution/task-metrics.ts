import type { SkoposUiConsoleTaskView } from '../../contracts/skopos-ui-console-state.js';

export const countPendingTaskItems = (
  task: SkoposUiConsoleTaskView['task'],
): number => task.steps.filter((item) => item.status !== 'complete').length;
