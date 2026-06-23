import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  HighlightedCodeBlock,
  normalizeCodeLanguage,
} from '../support/ui/code-highlighting.js';

describe('normalizeCodeLanguage', () => {
  it('maps common markdown code aliases to supported languages', () => {
    expect(normalizeCodeLanguage('ts')).toBe('typescript');
    expect(normalizeCodeLanguage('tsx')).toBe('tsx');
    expect(normalizeCodeLanguage('sh')).toBe('bash');
    expect(normalizeCodeLanguage('yml')).toBe('yaml');
    expect(normalizeCodeLanguage('text')).toBeUndefined();
  });
});

describe('HighlightedCodeBlock', () => {
  it('renders a syntax-highlighted pre shell for supported languages', () => {
    const markup = renderToStaticMarkup(
      <HighlightedCodeBlock language="ts" code={'const answer = 42;'} />,
    );

    expect(markup).toContain('skopos-markdown-pre');
    expect(markup).toContain('const');
    expect(markup).toContain('style=');
  });
});
