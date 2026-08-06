import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';

import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
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
    await ensureInitialPathRoute();
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

const ensureInitialPathRoute = async (): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }

  if (window.location.pathname === '/') {
    await router.navigate({
      to: '/overview',
      replace: true,
    });
  }
};

function BootError({ message }: { message: string }): React.JSX.Element {
  return (
    <div className="grid min-h-screen place-items-center bg-surface-container-low px-6 py-10 text-on-surface">
      <Card variant="elevated" padding="lg" className="w-full max-w-2xl">
        <Typography variant="eyebrow" className="text-on-surface-variant">
          Skopos UI
        </Typography>
        <Typography variant="pageTitle" className="mt-4 max-w-[32rem]">
          The console failed to load
        </Typography>
        <Typography variant="bodyLarge" className="mt-3 max-w-[32rem] text-on-surface-variant">
          The routed app hit a client-side bootstrap error before the main workspace shell could
          render.
        </Typography>
        <Alert variant="error" title="Boot error" className="mt-5">
          <code className="break-words font-mono">{message}</code>
        </Alert>
      </Card>
    </div>
  );
}
