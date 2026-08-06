// @vitest-environment jsdom

import * as React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { SidebarDrawer, SidebarProvider } from '../components/ui/sidebar/index.js';
import type { NavigationItem } from '../types/navigation.js';

const navigationItems: NavigationItem[] = [
  { id: 'overview', label: 'Now', href: '/overview', icon: 'home' },
  {
    id: 'work',
    label: 'Work',
    icon: 'assignment',
    items: [
      { id: 'tasks', label: 'Tasks', href: '/tasks' },
      { id: 'plans', label: 'Plans', href: '/plans' },
    ],
  },
  {
    id: 'knowledge',
    label: 'Project knowledge',
    icon: 'menu_book',
    items: [{ id: 'docs', label: 'Docs', href: '/docs' }],
  },
];

const renderDrawer = (mode: 'collapsible-drawer' | 'rail-drawer') =>
  renderToStaticMarkup(
    <SidebarProvider
      items={navigationItems}
      defaultValue="tasks"
      defaultExpanded
      forceViewport="desktop"
      mode={mode}
    >
      <SidebarDrawer aria-label="Project navigation" />
    </SidebarProvider>,
  );

describe('sidebar navigation hierarchy', () => {
  it('keeps the complete tree visible in a collapsible drawer while a child is selected', () => {
    const markup = renderDrawer('collapsible-drawer');

    expect(markup).toContain('Now');
    expect(markup).toContain('Work');
    expect(markup).toContain('Tasks');
    expect(markup).toContain('Project knowledge');
    expect(markup).toContain('Docs');
  });

  it('keeps contextual child navigation for a separate rail and drawer', () => {
    const markup = renderDrawer('rail-drawer');

    expect(markup).toContain('Tasks');
    expect(markup).toContain('Plans');
    expect(markup).not.toContain('Project knowledge');
    expect(markup).not.toContain('Docs');
  });

  it('expands a group without replacing the URL-backed selection', async () => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
      .IS_REACT_ACT_ENVIRONMENT = true;
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    const container = document.createElement('div');
    const root = createRoot(container);
    const onValueChange = vi.fn();

    await act(async () => {
      root.render(
        <SidebarProvider
          items={navigationItems}
          value="tasks"
          onValueChange={onValueChange}
          defaultExpanded
          forceViewport="desktop"
          mode="collapsible-drawer"
        >
          <SidebarDrawer aria-label="Project navigation" />
        </SidebarProvider>,
      );
    });

    const knowledgeGroup = Array.from(container.querySelectorAll('button')).find(
      (button) => button.getAttribute('aria-label') === 'Project knowledge',
    );
    expect(knowledgeGroup).toBeDefined();

    await act(async () => {
      knowledgeGroup?.click();
    });

    expect(knowledgeGroup?.getAttribute('aria-expanded')).toBe('true');
    expect(onValueChange).not.toHaveBeenCalled();

    await act(async () => root.unmount());
  });

  it('shows a visible disclosure indicator and selects only the exact child', () => {
    const markup = renderDrawer('collapsible-drawer');

    expect(markup).toContain('expand_more');
    expect(markup).toContain('aria-label="Work"');
    expect(markup).toMatch(/id="[^"]+"[^>]*inert=""/);
    expect(markup).not.toMatch(/id="[^"]+"[^>]*aria-hidden="true"/);
    expect(markup).not.toMatch(/aria-label="Work"[^>]*aria-current="page"/);
    expect(markup).toMatch(/aria-current="page"[^>]*aria-label="Tasks"[^>]*href="\/tasks"/);
  });

  it('keeps collapsed navigation at the five meaningful primary destinations', () => {
    const markup = renderToStaticMarkup(
      <SidebarProvider
        items={navigationItems}
        value="tasks"
        expanded={false}
        forceViewport="desktop"
        mode="collapsible-drawer"
      >
        <SidebarDrawer aria-label="Project navigation" collapsedHeader={<span>Mark</span>} />
      </SidebarProvider>,
    );

    expect(markup).toContain('aria-label="Now"');
    expect(markup).toContain('aria-label="Work"');
    expect(markup).toContain('aria-label="Project knowledge"');
    expect(markup).not.toContain('aria-label="Tasks"');
    expect(markup).not.toContain('aria-label="Plans"');
    expect(markup).not.toContain('>circle<');
  });

  it('opens a collapsed group without changing the selected child route', async () => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
      .IS_REACT_ACT_ENVIRONMENT = true;
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    const container = document.createElement('div');
    const root = createRoot(container);
    const onValueChange = vi.fn();

    await act(async () => {
      root.render(
        <SidebarProvider
          items={navigationItems}
          defaultValue="tasks"
          onValueChange={onValueChange}
          defaultExpanded={false}
          openOnChildSelection={false}
          forceViewport="desktop"
          mode="collapsible-drawer"
        >
          <SidebarDrawer aria-label="Project navigation" />
        </SidebarProvider>,
      );
    });

    expect(container.querySelector('[aria-label="Tasks"]')).toBeNull();

    await act(async () => {
      (container.querySelector('[aria-label="Work"]') as HTMLButtonElement | null)?.click();
    });

    expect(container.querySelector('[aria-label="Tasks"]')).not.toBeNull();
    expect(container.querySelector('[aria-label="Tasks"]')?.getAttribute('aria-current')).toBe(
      'page',
    );
    expect(onValueChange).not.toHaveBeenCalled();

    await act(async () => root.unmount());
  });
});
