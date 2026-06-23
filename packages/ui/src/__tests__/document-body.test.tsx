import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { DocumentBody } from '../patterns/sections/content-primitives.js';

describe('DocumentBody', () => {
  it('renders markdown semantics for narrative document content', () => {
    const markup = renderToStaticMarkup(
      <DocumentBody
        body={[
          'A paragraph with `inline code` and an [external link](https://example.com).',
          'Also see [linked doc](./linked-doc.md).',
          '',
          '1. First item',
          '2. Second item',
          '',
          '> Important quoted note.',
          '',
          '```ts',
          'const answer = 42;',
          '```',
          '',
          '| Name | Value |',
          '| --- | --- |',
          '| foo | bar |',
        ].join('\n')}
        resolveHref={(href) => (href === './linked-doc.md' ? '#/docs/linked-doc' : href)}
      />,
    );

    expect(markup).toContain('<p>');
    expect(markup).toContain('skopos-markdown-inline-code');
    expect(markup).toContain('<ol>');
    expect(markup).toContain('<blockquote>');
    expect(markup).toContain('skopos-markdown-pre');
    expect(markup).toContain('skopos-markdown-code-language');
    expect(markup).toContain('Copy');
    expect(markup).toContain('<table');
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('href="#/docs/linked-doc"');
  });

  it('renders fenced mermaid blocks as diagrams instead of generic code shells', () => {
    const markup = renderToStaticMarkup(
      <DocumentBody
        body={[
          '```mermaid',
          'flowchart TD',
          '  Start --> Review',
          '  Review --> Done',
          '```',
        ].join('\n')}
      />,
    );

    expect(markup).toContain('skopos-mermaid-shell');
    expect(markup).toContain('skopos-mermaid-pending');
    expect(markup).not.toContain('skopos-markdown-code-header');
  });
});
