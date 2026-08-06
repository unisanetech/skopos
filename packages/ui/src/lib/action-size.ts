export const actionFrameHeightClasses = {
  sm: 'h-[var(--size-action-sm)]',
  md: 'h-[var(--size-action-md)]',
  lg: 'h-[var(--size-action-lg)]',
} as const;

export const actionFramePaddingXClasses = {
  sm: 'px-[var(--space-action-padding-x-sm)]',
  md: 'px-[var(--space-action-padding-x-md)]',
  lg: 'px-[var(--space-action-padding-x-lg)]',
} as const;

export const actionFrameSizeClasses = {
  sm: `${actionFrameHeightClasses.sm} ${actionFramePaddingXClasses.sm}`,
  md: `${actionFrameHeightClasses.md} ${actionFramePaddingXClasses.md}`,
  lg: `${actionFrameHeightClasses.lg} ${actionFramePaddingXClasses.lg}`,
} as const;

export const actionButtonSizeClasses = {
  sm: `${actionFrameSizeClasses.sm} text-label-medium`,
  md: `${actionFrameSizeClasses.md} text-label-large`,
  lg: `${actionFrameSizeClasses.lg} text-label-large`,
} as const;

export const iconButtonSizeClasses = {
  sm: 'h-[var(--size-icon-button-sm)] w-[var(--size-icon-button-sm)]',
  md: 'h-[var(--size-icon-button-md)] w-[var(--size-icon-button-md)]',
  lg: 'h-[var(--size-icon-button-lg)] w-[var(--size-icon-button-lg)]',
} as const;

export type IconFrameSize = number | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export function getIconFrameSizeClass(size: IconFrameSize): string {
  if (typeof size === 'number') {
    if (size <= 16) return 'size-icon-xs';
    if (size <= 20) return 'size-icon-sm';
    if (size <= 24) return 'size-icon-md';
    if (size <= 32) return 'size-icon-lg';
    return 'size-icon-xl';
  }

  return {
    xs: 'size-icon-xs',
    sm: 'size-icon-sm',
    md: 'size-icon-md',
    lg: 'size-icon-lg',
    xl: 'size-icon-xl',
  }[size];
}

export const fabSizeClasses = {
  sm: 'h-[var(--size-fab-sm)] w-[var(--size-fab-sm)]',
  md: 'h-[var(--size-fab-md)] w-[var(--size-fab-md)]',
  lg: 'h-[var(--size-fab-lg)] w-[var(--size-fab-lg)]',
  extended:
    'h-[var(--size-fab-md)] min-w-[var(--size-fab-extended-min)] w-auto px-[var(--space-fab-extended-x)]',
} as const;

export const avatarSizeClasses = {
  sm: 'h-[var(--size-avatar-sm)] w-[var(--size-avatar-sm)] text-label-small',
  md: 'h-[var(--size-avatar-md)] w-[var(--size-avatar-md)] text-body-small',
  lg: 'h-[var(--size-avatar-lg)] w-[var(--size-avatar-lg)] text-body-medium',
  xl: 'h-[var(--size-avatar-xl)] w-[var(--size-avatar-xl)] text-body-large',
} as const;

export const paginationButtonClass =
  'relative h-[var(--size-pagination-button)] w-[var(--size-pagination-button)] rounded-button flex items-center justify-center overflow-hidden transition-colors';
