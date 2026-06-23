import * as React from 'react';

import { KeyValueList, SidebarCard } from '../../../patterns/sections/inspector-primitives.js';
import { formatDateTime } from '../../../support/formatting/console-formatting.js';

export function KnowledgeListInspectorAside({
  primaryCount,
  referenceCount,
  availableCount,
  updatedAt,
  primaryLabel,
}: {
  primaryCount: number;
  referenceCount: number;
  availableCount: number;
  updatedAt?: string;
  primaryLabel: string;
}): React.JSX.Element {
  return (
    <SidebarCard title="At a glance">
      <KeyValueList
        items={[
          { label: primaryLabel, value: String(primaryCount) },
          ...(referenceCount > 0
            ? [{ label: 'Reference docs', value: String(referenceCount) }]
            : []),
          { label: 'Available docs', value: String(availableCount) },
          { label: 'Updated', value: formatDateTime(updatedAt) },
        ]}
      />
    </SidebarCard>
  );
}
