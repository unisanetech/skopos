import type {
  SkoposUiConsoleTaskView,
  SkoposUiConsoleState,
} from '../../contracts/skopos-ui-console-state.js';

export const toneForReadiness = (
  readiness: SkoposUiConsoleState['readinessReport']['readiness'] | 'build-needed' | undefined,
): 'positive' | 'warning' | 'danger' => {
  switch (readiness) {
    case 'ready':
      return 'positive';
    case 'attention':
      return 'warning';
    default:
      return 'danger';
  }
};

export const toneForCheck = (
  status: SkoposUiConsoleState['readinessReport']['checks'][number]['status'],
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

export const toneForTaskState = (
  state: SkoposUiConsoleTaskView['task']['state'],
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
