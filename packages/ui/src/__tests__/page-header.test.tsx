import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { RouteHero } from '../patterns/shells/page-frame.js';

describe('RouteHero', () => {
  it('starts with the unique page heading instead of a repeated route eyebrow', () => {
    const markup = renderToStaticMarkup(
      <RouteHero
        title="Tracked work sessions"
        description="Choose the work that needs attention now."
      />,
    );

    expect(markup).toContain('<h1');
    expect(markup).toContain('Tracked work sessions');
    expect(markup).toContain('Choose the work that needs attention now.');
    expect(markup).not.toContain('text-label-small');
    expect(markup).not.toContain('mt-2.5');
  });
});
