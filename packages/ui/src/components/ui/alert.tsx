import React, { forwardRef, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/classnames';
import { Icon } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';

const alertVariants = cva('relative flex w-full items-start gap-3 rounded-sm border-l-4 p-4', {
  variants: {
    variant: {
      info: 'bg-info-container border-info text-on-info-container',
      error: 'bg-error-container border-error text-on-error-container',
      warning: 'bg-warning-container border-warning text-on-warning-container',
      success: 'bg-success-container border-success text-on-success-container',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>, VariantProps<typeof alertVariants> {
  icon?: ReactNode | string | false;
  title?: ReactNode;
}

const DEFAULT_ICONS: Record<AlertVariant, string> = {
  info: 'info',
  error: 'error',
  warning: 'warning',
  success: 'check_circle',
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'info',
      icon,
      title,
      children,
      className,
      role,
      'aria-live': ariaLive,
      'aria-atomic': ariaAtomic,
      ...props
    },
    ref,
  ) => {
    const resolvedVariant = variant ?? 'info';
    const isAssertive = resolvedVariant === 'error' || resolvedVariant === 'warning';
    const iconNode =
      icon === false ? null : typeof icon === 'string' || icon === undefined ? (
        <Icon symbol={icon ?? DEFAULT_ICONS[resolvedVariant]} size="sm" />
      ) : (
        icon
      );

    return (
      <div
        ref={ref}
        className={cn(alertVariants({ variant: resolvedVariant, className }))}
        role={role ?? (isAssertive ? 'alert' : 'status')}
        aria-live={ariaLive ?? (isAssertive ? 'assertive' : 'polite')}
        aria-atomic={ariaAtomic ?? true}
        {...props}
      >
        {iconNode ? (
          <div
            aria-hidden="true"
            className="size-icon-sm flex shrink-0 items-center justify-center opacity-80"
          >
            {iconNode}
          </div>
        ) : null}
        <div className="flex flex-1 flex-col gap-1">
          {title ? (
            <Typography variant="labelMedium" className="text-inherit">
              {title}
            </Typography>
          ) : null}
          <div className="text-body-small leading-snug opacity-90">{children}</div>
        </div>
      </div>
    );
  },
);

Alert.displayName = 'Alert';
