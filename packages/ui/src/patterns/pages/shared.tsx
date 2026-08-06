import * as React from 'react';

import { cn } from '../../support/ui/classnames.js';
import { RouteHero } from '../shells/page-frame.js';

export interface SkoposPageHeaderProps {
  title: string;
  description: string;
  badges?: Array<React.ReactNode | null>;
  titleScale?: 'page' | 'compact';
}

export function renderSkoposPageHeader(
  props: SkoposPageHeaderProps,
): React.JSX.Element {
  return (
    <RouteHero
      title={props.title}
      description={props.description}
      badges={props.badges}
      titleScale={props.titleScale}
    />
  );
}

export function PageSectionStack({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return <div className={cn('grid gap-8 md:gap-10', className)}>{children}</div>;
}
