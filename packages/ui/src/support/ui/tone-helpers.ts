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
      return 'border-transparent bg-primary-container text-primary';
    case 'warning':
      return 'border-transparent bg-[var(--color-warning-container)] text-[var(--color-warning)]';
    case 'danger':
      return 'border-transparent bg-[var(--color-error-container)] text-[var(--color-error)]';
    case 'info':
      return 'border-transparent bg-[var(--color-info-container)] text-[var(--color-info)]';
    default:
      return 'border-outline-weak bg-surface-container-low text-on-surface';
  }
};
