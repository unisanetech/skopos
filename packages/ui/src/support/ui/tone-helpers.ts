import type {
  SkoposUiConsoleMissionView,
  SkoposUiConsoleState,
} from '../../contracts/skopos-ui-console-state.js';

export const toneForTrust = (
  trustLevel: SkoposUiConsoleState['trustReport']['trustLevel'] | undefined,
): 'positive' | 'warning' | 'danger' => {
  switch (trustLevel) {
    case 'high':
      return 'positive';
    case 'medium':
      return 'warning';
    default:
      return 'danger';
  }
};

export const toneForReadiness = (
  readiness: SkoposUiConsoleState['trustReport']['readiness'] | 'build-needed' | undefined,
): 'positive' | 'warning' | 'danger' => {
  switch (readiness) {
    case 'agent-ready':
      return 'positive';
    case 'needs-review':
      return 'warning';
    default:
      return 'danger';
  }
};

export const toneForCheck = (
  status: SkoposUiConsoleState['trustReport']['checks'][number]['status'],
): 'positive' | 'warning' | 'danger' => {
  switch (status) {
    case 'pass':
      return 'positive';
    case 'warn':
      return 'warning';
    default:
      return 'danger';
  }
};

export const toneForMissionState = (
  state: SkoposUiConsoleMissionView['mission']['state'],
): 'neutral' | 'positive' | 'warning' | 'danger' | 'info' => {
  switch (state) {
    case 'complete':
      return 'positive';
    case 'active':
      return 'info';
    case 'blocked':
      return 'danger';
    default:
      return 'warning';
  }
};

export const pillToneClass = (
  tone: 'neutral' | 'positive' | 'warning' | 'danger' | 'info',
): string => {
  switch (tone) {
    case 'positive':
      return 'border-transparent bg-[var(--accent-soft)] text-[var(--accent)]';
    case 'warning':
      return 'border-transparent bg-[var(--warning-soft)] text-[var(--warning)]';
    case 'danger':
      return 'border-transparent bg-[var(--danger-soft)] text-[var(--danger)]';
    case 'info':
      return 'border-transparent bg-[var(--info-soft)] text-[var(--info)]';
    default:
      return 'border-[var(--line)] bg-[var(--panel-strong)] text-[var(--muted-strong)]';
  }
};
