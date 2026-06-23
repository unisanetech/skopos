import * as React from 'react';

import { PageFrame } from '../shells/page-frame.js';
import { PageSectionStack, renderSkoposPageHeader } from './shared.js';
import type { SkoposPageHeaderProps } from './shared.js';

export function DetailPage({
  aside,
  headerActions,
  children,
  ...header
}: SkoposPageHeaderProps & {
  aside?: React.ReactNode;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <PageFrame
      header={renderSkoposPageHeader(header)}
      headerActions={headerActions}
      aside={aside}
    >
      <PageSectionStack>{children}</PageSectionStack>
    </PageFrame>
  );
}
