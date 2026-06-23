import { cn } from './classnames.js';

export const filterChipClass = (active: boolean): string =>
  cn(
    'skopos-filter-chip inline-flex items-center border font-medium tracking-[0.01em] transition-colors',
    active
      ? 'border-[var(--line-strong)] bg-[var(--panel-strong)] text-[var(--ink)]'
      : 'border-[var(--line)] text-[var(--muted)] hover:bg-[var(--panel-strong)] hover:text-[var(--muted-strong)]',
  );
