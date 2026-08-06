import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/classnames';
import { Text } from '@/components/ui/text';

const topAppBarVariants = cva(
  'relative z-20 flex w-full items-center border-b border-outline-weak bg-surface px-4 text-on-surface transition-all duration-medium ease-standard',
  {
    variants: {
      variant: {
        center: 'h-16 justify-between',
        small: 'h-16 justify-between',
        medium: 'h-28 flex-col items-start justify-end pb-6',
        large: 'h-38 flex-col items-start justify-end pb-8',
      },
      scrolled: {
        true: 'bg-surface-container shadow-1',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'small',
      scrolled: false,
    },
  },
);

export type TopAppBarProps = VariantProps<typeof topAppBarVariants> & {
  title: React.ReactNode;
  titleVariant?: React.ComponentProps<typeof Text>['variant'];
  titleClassName?: string;
  navigationIcon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'title'>;

export const TopAppBar = forwardRef<HTMLElement, TopAppBarProps>(
  (
    {
      variant,
      scrolled,
      title,
      titleVariant,
      titleClassName,
      navigationIcon,
      actions,
      className,
      ['aria-label']: ariaLabel,
      ...props
    },
    ref,
  ) => {
    const isTall = variant === 'medium' || variant === 'large';
    const isCenter = variant === 'center';
    const titleString = typeof title === 'string' ? title : undefined;

    return (
      <header
        ref={ref}
        {...props}
        className={cn(topAppBarVariants({ variant, scrolled, className }))}
        aria-label={ariaLabel || titleString}
      >
        <div
          className={cn(
            'flex w-full items-center',
            isTall ? 'mb-auto h-16' : 'h-full',
            isCenter ? 'relative justify-center' : 'justify-between',
          )}
        >
          {navigationIcon && (
            <div className={cn('text-on-surface z-10 mr-4', isCenter ? 'absolute left-0' : '')}>
              {navigationIcon}
            </div>
          )}

          {!isTall && (
            <div
              className={cn('truncate', isCenter ? 'w-full px-12 text-center' : 'flex-1 text-left')}
            >
              <Text
                variant={titleVariant ?? 'titleLarge'}
                className={cn('text-primary truncate', titleClassName)}
              >
                {title}
              </Text>
            </div>
          )}

          <div
            className={cn(
              'text-on-surface-variant z-10 flex items-center gap-2',
              isCenter && 'absolute right-0',
            )}
          >
            {actions}
          </div>
        </div>

        {isTall && (
          <div
            className={cn(
              'duration-short w-full px-4 transition-opacity',
              scrolled ? 'h-0 overflow-hidden opacity-0' : 'opacity-100',
            )}
          >
            <Text
              variant={titleVariant ?? (variant === 'large' ? 'headlineMedium' : 'headlineSmall')}
              className={cn('truncate', titleClassName)}
            >
              {title}
            </Text>
          </div>
        )}
      </header>
    );
  },
);

TopAppBar.displayName = 'TopAppBar';
