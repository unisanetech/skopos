import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { SegmentedButton } from '../components/ui/segmented-button.js';
import { RouteFilterBar } from '../patterns/sections/content/list-primitives.js';

describe('RouteFilterBar', () => {
  it('renders route choices as one labelled borderless segmented control', () => {
    const markup = renderToStaticMarkup(
      <RouteFilterBar label="Plan view">
        <SegmentedButton
          aria-label="Plan view"
          size="sm"
          value="current"
          options={[
            { value: 'current', label: 'Current' },
            { value: 'library', label: 'Library' },
            { value: 'all', label: 'All' },
          ]}
        />
      </RouteFilterBar>,
    );

    expect(markup).toContain('role="radiogroup"');
    expect(markup).toContain('aria-label="Plan view"');
    expect(markup).toContain('aria-checked="true"');
    expect(markup).toContain('border-control-outline');
    expect(markup).toContain('h-[var(--size-action-sm)]');
    expect(markup).toContain('bg-secondary-container');
    expect(markup).toContain('<polyline points="20 6 9 17 4 12"></polyline>');
    expect(markup).not.toContain('bg-primary-container');
    expect(markup).not.toContain('rounded-sm border border-outline-weak bg-surface px-4 py-3');
  });
});
