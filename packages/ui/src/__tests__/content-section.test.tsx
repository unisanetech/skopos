import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion.js';
import { ContentSection } from '../patterns/sections/content-primitives.js';
import { SidebarCard } from '../patterns/sections/inspector/sidebar-card.js';
import { KeyValueList } from '../patterns/sections/inspector/value-lists.js';

describe('ContentSection surface hierarchy', () => {
  it('uses an open section instead of adding another outlined card', () => {
    const markup = renderToStaticMarkup(
      <ContentSection title="Do this next" description="Focus on the current decision.">
        <p>Current work</p>
      </ContentSection>,
    );

    expect(markup).toContain('<section');
    expect(markup).toContain('<h2');
    expect(markup).toContain('text-title-large');
    expect(markup).not.toContain('font-semibold');
    expect(markup).not.toContain('tracking-tight');
    expect(markup).not.toContain('font-normal');
    expect(markup).not.toContain('border-outline');
    expect(markup).not.toContain('rounded-');
  });
});

describe('inspector composition', () => {
  it('keeps the primary section open without adding a nested card surface', () => {
    const markup = renderToStaticMarkup(
      <SidebarCard title="At a glance">
        <KeyValueList items={[{ label: 'Active rules', value: '20' }]} />
      </SidebarCard>,
    );

    expect(markup).toContain('<section');
    expect(markup).toContain('Active rules');
    expect(markup).toContain('20');
    expect(markup).not.toContain('bg-surface-container-low');
    expect(markup).not.toContain('rounded-sm');
  });

  it('uses simple dividers instead of outlined child boxes for collapsible detail', () => {
    const markup = renderToStaticMarkup(
      <SidebarCard title="Outline" badge="3" collapsible defaultOpen={false}>
        <p>Document sections</p>
      </SidebarCard>,
    );

    expect(markup).toContain('rounded-none');
    expect(markup).toContain('border-x-0');
    expect(markup).toContain('border-b-0');
    expect(markup).toContain('border-t');
    expect(markup).toContain('text-label-medium');
    expect(markup).not.toContain('rounded-sm');
  });

  it('uses bounded value columns and presents long project paths compactly', () => {
    const markup = renderToStaticMarkup(
      <KeyValueList
        items={[
          {
            label: 'Source',
            value: '/Users/example/project/.skopos/index/policies/resolved.json',
            monospace: true,
          },
        ]}
      />,
    );

    expect(markup).toContain('sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]');
    expect(markup).toContain('[overflow-wrap:anywhere]');
    expect(markup).toContain('max-w-full');
    expect(markup).toContain('.skopos/index/policies/resolved.json');
    expect(markup).toContain('title="/Users/example/project/.skopos/index/policies/resolved.json"');
    expect(markup).not.toContain('inspector-value-max');
  });
});

describe('shared accessibility contracts', () => {
  it('removes collapsed accordion content from keyboard interaction', () => {
    const markup = renderToStaticMarkup(
      <Accordion>
        <AccordionItem value="details">
          <AccordionTrigger>Details</AccordionTrigger>
          <AccordionContent>
            <a href="/details">Open details</a>
          </AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(markup).toContain('inert=""');
    expect(markup).toMatch(/role="region" aria-labelledby="[^"]+" inert=""/);
    expect(markup).not.toMatch(/role="region"[^>]*aria-hidden/);
    expect(markup).toContain('aria-controls=');
    expect(markup).toContain('aria-labelledby=');
  });
});
