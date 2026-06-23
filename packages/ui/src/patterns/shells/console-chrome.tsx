import * as React from 'react';

export interface SkoposConsoleChromeState {
  workspaceLabel: string;
  routeTitle: string;
}

const skoposConsoleChromeContext = React.createContext<SkoposConsoleChromeState | null>(null);

export function SkoposConsoleChromeProvider({
  value,
  children,
}: {
  value: SkoposConsoleChromeState;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <skoposConsoleChromeContext.Provider value={value}>
      {children}
    </skoposConsoleChromeContext.Provider>
  );
}

export const useSkoposConsoleChrome = (): SkoposConsoleChromeState | null =>
  React.useContext(skoposConsoleChromeContext);
