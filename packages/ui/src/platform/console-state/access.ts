import type { SkoposUiConsoleState } from '../../contracts/skopos-ui-console-state.js';
import { getSkoposUiConsoleState } from '../../app/state.js';

export const requireConsoleState = (): SkoposUiConsoleState => {
  const state = getSkoposUiConsoleState();
  if (!state) {
    throw new Error('Skopos UI console state is missing.');
  }

  return state;
};
