import React from 'react';
import { cn } from '@/lib/utils';

export interface PageSectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  rhythm?: 'standard' | 'compact' | 'hero' | 'none';
  width?: 'standard' | 'wide' | 'none';
  surface?: 'none' | 'surface' | 'surfaceContainerLow';
}

const rhythmClasses = {
  standard: 'py-layout-section-y',
  compact: 'py-layout-section-y-compact',
  hero: 'py-layout-hero-y',
  none: 'py-0',
} as const;

const widthClasses = {
  standard: 'mx-auto w-full max-w-7xl px-layout-page-x',
  wide: 'mx-auto w-full max-w-[112rem] px-layout-page-x',
  none: 'w-full',
} as const;

const surfaceClasses = {
  none: '',
  surface: 'bg-surface',
  surfaceContainerLow: 'bg-surface-container-low',
} as const;

export const PageSection = React.forwardRef<HTMLElement, PageSectionProps>(
  (
    {
      as: Component = 'section',
      rhythm = 'standard',
      width = 'standard',
      surface = 'none',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={cn('@container', rhythmClasses[rhythm], surfaceClasses[surface], className)}
        {...props}
      >
        <div className={cn(widthClasses[width])}>{children}</div>
      </Component>
    );
  },
);
PageSection.displayName = 'PageSection';
