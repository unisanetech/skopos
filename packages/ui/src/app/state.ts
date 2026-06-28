import type { SkoposUiConsoleState } from '../contracts/skopos-ui-console-state.js';
import { skoposUiDevStateEndpointPath } from '../contracts/skopos-ui-dev-channel.js';

type SkoposUiConsoleStateListener = () => void;

let cachedState: SkoposUiConsoleState | null | undefined;
let cachedStateRevision = 0;
const stateListeners = new Set<SkoposUiConsoleStateListener>();

export const getSkoposUiConsoleState = (): SkoposUiConsoleState | undefined => {
  if (cachedState === undefined || cachedState === null) {
    return undefined;
  }

  return cachedState;
};

export const getSkoposUiConsoleStateRevision = (): number => cachedStateRevision;

export const subscribeSkoposUiConsoleState = (
  listener: SkoposUiConsoleStateListener,
): (() => void) => {
  stateListeners.add(listener);
  return () => {
    stateListeners.delete(listener);
  };
};

export const loadSkoposUiConsoleState = async (): Promise<SkoposUiConsoleState | undefined> => {
  if (cachedState !== undefined) {
    return cachedState ?? undefined;
  }

  const nextState = await resolveSkoposUiConsoleState();
  storeSkoposUiConsoleState(nextState);
  return nextState;
};

export const refreshSkoposUiConsoleState = async (): Promise<SkoposUiConsoleState | undefined> => {
  const nextState = await resolveSkoposUiConsoleState();
  if (nextState) {
    storeSkoposUiConsoleState(nextState);
    return nextState;
  }

  return getSkoposUiConsoleState();
};

export const resetSkoposUiConsoleState = (): void => {
  cachedState = undefined;
  cachedStateRevision += 1;
  notifyStateListeners();
};

const readInlineState = (): SkoposUiConsoleState | undefined => {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const source = document.getElementById('skopos-ui-state');
  const textContent = source?.textContent?.trim();
  if (!textContent || textContent === '__SKOPOS_UI_STATE__') {
    return undefined;
  }

  try {
    return JSON.parse(textContent) as SkoposUiConsoleState;
  } catch {
    return undefined;
  }
};

const fetchDevState = async (): Promise<SkoposUiConsoleState | undefined> => {
  if (typeof fetch !== 'function') {
    return undefined;
  }

  try {
    const response = await fetch(skoposUiDevStateEndpointPath, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return undefined;
    }

    return (await response.json()) as SkoposUiConsoleState;
  } catch {
    return undefined;
  }
};

const resolveSkoposUiConsoleState = async (): Promise<SkoposUiConsoleState | undefined> => {
  if (import.meta.hot) {
    const devState = await fetchDevState();
    if (devState) {
      return devState;
    }
  }

  const inlineState = readInlineState();
  if (inlineState) {
    return inlineState;
  }

  return fetchDevState();
};

const storeSkoposUiConsoleState = (nextState: SkoposUiConsoleState | undefined): void => {
  cachedState = nextState ?? null;
  cachedStateRevision += 1;
  notifyStateListeners();
};

const notifyStateListeners = (): void => {
  for (const listener of stateListeners) {
    listener();
  }
};
