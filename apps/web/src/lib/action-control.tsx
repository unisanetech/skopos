import { type MouseEvent } from 'react';
import { cn, composeAsChildClickHandler, focusRing } from '@/lib/utils';

export const actionInteractiveClass = cn(
  'group overflow-hidden select-none active:scale-[0.98] motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:opacity-38 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-38',
  focusRing,
);

export function getActionDisabledState(disabled: boolean, loading: boolean) {
  return disabled || loading;
}

export function getActionStateAttributes(isDisabled: boolean, loading: boolean) {
  return {
    'aria-busy': loading || undefined,
    'data-disabled': isDisabled ? 'true' : undefined,
  };
}

export function getActionAsChildAttributes(
  isDisabled: boolean,
  loading: boolean,
  props: Record<string, unknown> & {
    onClick?: ((event: MouseEvent<HTMLElement>) => void) | undefined;
    tabIndex?: number | undefined;
  },
  childProps: {
    onClick?: ((event: MouseEvent<HTMLElement>) => void) | undefined;
    tabIndex?: number | undefined;
  },
) {
  return {
    ...getActionStateAttributes(isDisabled, loading),
    'aria-disabled': isDisabled || undefined,
    ...props,
    onClick: composeAsChildClickHandler(isDisabled, props.onClick, childProps.onClick),
    tabIndex: isDisabled ? -1 : (childProps.tabIndex ?? props.tabIndex),
  };
}

export function ActionStateLayer({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'group-hover:opacity-hover group-focus-visible:opacity-focus group-active:opacity-pressed pointer-events-none absolute inset-0 bg-current opacity-0 transition-opacity',
        className,
      )}
    />
  );
}

export function ActionSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin', className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
