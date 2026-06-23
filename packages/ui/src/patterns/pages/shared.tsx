import * as React from 'react';

import { cn } from '../../support/ui/classnames.js';
import { RouteHero } from '../shells/page-frame.js';

export interface SkoposPageHeaderProps {
  kicker: string;
  title: string;
  description: string;
  badges?: Array<React.ReactNode | null>;
}

export function renderSkoposPageHeader(
  props: SkoposPageHeaderProps,
): React.JSX.Element {
  return (
    <RouteHero
      kicker={props.kicker}
      title={props.title}
      description={props.description}
      badges={props.badges}
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
  return <div className={cn('grid gap-5 md:gap-6', className)}>{children}</div>;
}
