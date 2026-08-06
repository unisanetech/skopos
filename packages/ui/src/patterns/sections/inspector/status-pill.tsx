import * as React from 'react';

import { Badge } from '@/components/ui/badge';

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
    <Badge
      variant="tonal"
      color={badgeColorForTone(tone)}
      className={className}
    >
      {value}
    </Badge>
  );
}

const badgeColorForTone = (
  tone: 'neutral' | 'positive' | 'warning' | 'danger' | 'info',
): 'secondary' | 'success' | 'warning' | 'error' | 'info' => {
  switch (tone) {
    case 'positive':
      return 'success';
    case 'warning':
      return 'warning';
    case 'danger':
      return 'error';
    case 'info':
      return 'info';
    default:
      return 'secondary';
  }
};
