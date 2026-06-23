import * as React from 'react';

export function EmptyMessage({
  title,
  description,
}: {
  title: string;
  description: string;
}): React.JSX.Element {
  return (
    <div className="border-y border-dashed border-[var(--line)] py-3.5">
      <p className="skopos-caption font-medium tracking-[-0.01em]">{title}</p>
      <p className="skopos-helper-copy mt-1">{description}</p>
    </div>
  );
}
