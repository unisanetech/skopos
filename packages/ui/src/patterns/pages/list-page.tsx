import * as React from 'react';

import { PageFrame } from '../shells/page-frame.js';
import { PageSectionStack, renderSkoposPageHeader } from './shared.js';
import type { SkoposPageHeaderProps } from './shared.js';

export function ListPage({
  aside,
  headerActions,
  filters,
  children,
  ...header
}: SkoposPageHeaderProps & {
  aside?: React.ReactNode;
  headerActions?: React.ReactNode;
  filters?: React.ReactNode;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <PageFrame
      header={renderSkoposPageHeader(header)}
      headerActions={headerActions}
      aside={aside}
    >
      <PageSectionStack>
        {filters}
        {children}
      </PageSectionStack>
    </PageFrame>
  );
}
