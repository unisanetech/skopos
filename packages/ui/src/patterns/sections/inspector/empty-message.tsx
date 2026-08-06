import * as React from 'react';

import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';

export function EmptyMessage({
  title,
  description,
}: {
  title: string;
  description: string;
}): React.JSX.Element {
  return (
    <Card variant="outlined" padding="sm">
      <Typography variant="titleSmall">{title}</Typography>
      <Typography variant="bodySmall" className="mt-1 text-on-surface-variant">
        {description}
      </Typography>
    </Card>
  );
}
