import * as React from 'react';

import { cn } from '../../../support/ui/classnames.js';
import { pillToneClass } from '../../../support/ui/tone-helpers.js';

export function StatusPill({
  value,
  tone = 'neutral',
  className,
}: {
  value: string;
  tone?: 'neutral' | 'positive' | 'warning' | 'danger' | 'info';
  className?: string;
}): React.JSX.Element {
  return (
    <span
      className={cn(
        'skopos-status-pill inline-flex items-center border whitespace-nowrap',
        pillToneClass(tone),
        className,
      )}
    >
      {value}
    </span>
  );
}
