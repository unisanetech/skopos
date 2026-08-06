import React from 'react';
import { cn } from '@/lib/classnames';

export interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  minItemWidth?: 'sm' | 'md' | 'lg';
}

const minItemWidthClasses = {
  sm: '[grid-template-columns:repeat(auto-fit,minmax(min(100%,14rem),1fr))]',
  md: '[grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))]',
  lg: '[grid-template-columns:repeat(auto-fit,minmax(min(100%,24rem),1fr))]',
} as const;

export const CardGrid = React.forwardRef<HTMLDivElement, CardGridProps>(
  ({ minItemWidth = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'gap-layout-grid-gap grid min-w-0',
          minItemWidthClasses[minItemWidth],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CardGrid.displayName = 'CardGrid';
