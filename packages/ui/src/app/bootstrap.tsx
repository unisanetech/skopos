import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';

import { skoposUiDevStateUpdatedEvent } from '../contracts/skopos-ui-dev-channel.js';
import { router } from './router.js';
import {
  bindSkoposUiLiveStatePolling,
  getSkoposUiConsoleState,
  getSkoposUiConsoleStateRevision,
  loadSkoposUiConsoleState,
  refreshSkoposUiConsoleState,
  subscribeSkoposUiConsoleState,
} from './state.js';

export const bootstrapSkoposUiApp = async (container: Element): Promise<Root> => {
  const root = createRoot(container);

  try {
    await ensureInitialHashRoute();
    const state = await loadSkoposUiConsoleState();
    if (!state) {
      throw new Error('Skopos UI console state is missing.');
    }
    await router.load();
    root.render(
      <StrictMode>
        <SkoposUiAppShell />
      </StrictMode>,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown boot error.';
    console.error(error);
    root.render(<BootError message={message} />);
  }

  return root;
};

export const refreshSkoposUiAppState = async (): Promise<void> => {
  await refreshSkoposUiConsoleState();
  await router.invalidate({ sync: true });
};

export const bindSkoposUiDevStateUpdates = (
  hot: { on: (event: string, handler: () => void) => void; off: (event: string, handler: () => void) => void } | undefined,
  onRefresh: () => Promise<void> | void = refreshSkoposUiAppState,
): (() => void) | undefined => {
  if (!hot) {
    return undefined;
  }

  const handleStateUpdate = (): void => {
    void onRefresh();
  };

  hot.on(skoposUiDevStateUpdatedEvent, handleStateUpdate);

  return () => {
    hot.off(skoposUiDevStateUpdatedEvent, handleStateUpdate);
  };
};

function SkoposUiAppShell(): React.JSX.Element {
  React.useSyncExternalStore(
    subscribeSkoposUiConsoleState,
    getSkoposUiConsoleStateRevision,
    getSkoposUiConsoleStateRevision,
  );

  React.useEffect(() => {
    const disposeHotUpdates = bindSkoposUiDevStateUpdates(import.meta.hot);
    const disposePolling = bindSkoposUiLiveStatePolling({
      enabled: !import.meta.hot && getSkoposUiConsoleState()?.uiMode === 'live',
      onRefresh: refreshSkoposUiAppState,
    });

    return () => {
      disposeHotUpdates?.();
      disposePolling?.();
    };
  }, []);

  return <RouterProvider router={router} />;
}

const ensureInitialHashRoute = async (): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }

  const currentHash = window.location.hash.trim();
  if (currentHash.length === 0 || currentHash === '#') {
    await router.navigate({
      to: '/overview',
      replace: true,
    });
  }
};

function BootError({ message }: { message: string }): React.JSX.Element {
  return (
    <div className="grid min-h-screen place-items-center bg-transparent px-6 py-10 text-[var(--ink)]">
      <div className="w-full max-w-2xl rounded-[30px] border border-[var(--line)] bg-[var(--panel)] px-6 py-6 shadow-[var(--shadow)]">
        <p className="skopos-eyebrow">Skopos UI</p>
        <h1 className="skopos-page-title mt-4 max-w-[32rem]">The console failed to load</h1>
        <p className="skopos-helper-copy mt-3 max-w-[32rem]">
          The routed app hit a client-side bootstrap error before the main workspace shell could
          render.
        </p>
        <div className="mt-5 rounded-[22px] border border-[var(--line)] bg-[var(--panel-strong)] px-4 py-4">
          <p className="skopos-eyebrow">Boot error</p>
          <p className="skopos-mono-caption mt-3 break-words text-[var(--muted-strong)]">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
