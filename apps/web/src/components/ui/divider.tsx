import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  inset?: 'none' | 'start' | 'both';
  decorative?: boolean;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = 'horizontal', inset = 'none', decorative = true, className, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={cn(
          'bg-outline-soft shrink-0',
          orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
          inset === 'start' && orientation === 'horizontal' && 'ms-16',
          inset === 'start' && orientation === 'vertical' && 'mt-16',
          inset === 'both' && orientation === 'horizontal' && 'mx-16',
          inset === 'both' && orientation === 'vertical' && 'my-16',
          className,
        )}
        role={decorative ? 'none' : 'separator'}
        aria-hidden={decorative ? true : undefined}
        aria-orientation={decorative ? undefined : orientation}
      />
    );
  },
);

Divider.displayName = 'Divider';
