import type { SkoposUiConsoleMissionView } from '../../contracts/skopos-ui-console-state.js';

export const countPendingMissionItems = (
  mission: SkoposUiConsoleMissionView['mission'],
): number => mission.items.filter((item) => item.status !== 'complete').length;
