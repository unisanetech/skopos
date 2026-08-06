import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { resolveRouteBreadcrumbs } from '../app/routing/route-config.js';
import { documentHrefForCategory } from '../support/knowledge/document-routing.js';

const readPackageFile = async (relativePath: string): Promise<string> =>
  readFile(fileURLToPath(new URL(relativePath, import.meta.url)), 'utf8');

describe('URL-backed console routing', () => {
  it('builds canonical document paths without hash fragments', () => {
    expect(documentHrefForCategory('docs', 'architecture')).toBe('/docs/architecture');
    expect(documentHrefForCategory('decisions', 'D-001')).toBe('/decisions/D-001');
    expect(documentHrefForCategory('findings', 'F-001')).toBe('/findings/F-001');
  });

  it('builds a compact family, route, and current-record breadcrumb', () => {
    expect(
      resolveRouteBreadcrumbs(
        '/decisions/SKOPOS-D-001',
        'Keep one canonical navigation owner',
      ),
    ).toEqual([
      { label: 'Project knowledge', href: '/memory' },
      { label: 'Decisions', href: '/decisions' },
      { label: 'Keep one canonical navigation owner' },
    ]);

    expect(resolveRouteBreadcrumbs('/overview')).toEqual([{ label: 'Now' }]);
  });

  it('keeps browser history, generated links, and server fallback aligned', async () => {
    const [routerSource, searchSource, applicationLinkSource, pageFrameSource, documentBodySource, viteSource, serveSource] = await Promise.all([
      readPackageFile('../app/router.tsx'),
      readPackageFile('../support/search/console-search-index.ts'),
      readPackageFile('../support/ui/application-link.tsx'),
      readPackageFile('../patterns/shells/page-frame.tsx'),
      readPackageFile('../patterns/sections/content/document-body.tsx'),
      readPackageFile('../../vite.config.ts'),
      readPackageFile('../application/serve-console-app/serve-console-app.service.ts'),
    ]);

    expect(routerSource).toContain('createBrowserHistory()');
    expect(routerSource).not.toContain('createHashHistory');
    expect(searchSource).not.toContain('#/');
    expect(applicationLinkSource).toContain("import { Link } from '@tanstack/react-router'");
    expect(applicationLinkSource).toContain('<Link ref={ref} to={href}');
    expect(pageFrameSource).toContain('<ApplicationLink href={href} />');
    expect(pageFrameSource).toContain('skopos-inspector-expanded');
    expect(pageFrameSource).toContain('aria-label="Hide details panel"');
    expect(pageFrameSource).toContain('aria-label="Show details panel"');
    expect(pageFrameSource).toContain('skopos-inspector-panel');
    expect(pageFrameSource).toContain('data-skopos-inspector-scroll-root="true"');
    expect(pageFrameSource).toContain('overflow-y-auto overscroll-contain');
    expect(pageFrameSource).toContain('rounded-md bg-surface');
    expect(pageFrameSource).toContain('skopos-scroll-hidden');
    expect(pageFrameSource).toContain('data-skopos-page-scroll-root="true"');
    expect(pageFrameSource).toContain('aria-label="Page content"');
    expect(pageFrameSource).toContain('tabIndex={0}');
    expect(pageFrameSource).not.toContain('shadow-1');
    expect(pageFrameSource).not.toContain('skopos-inspector-panel overflow-hidden rounded-md border');
    expect(pageFrameSource).not.toContain('skopos-inspector-panel overflow-hidden rounded-md border border-outline-weak bg-surface-container-low shadow-1');
    expect(documentBodySource).toContain('<ApplicationLink');
    expect(pageFrameSource).not.toContain('<a href={href} />');
    expect(documentBodySource).not.toContain('<a\n                href={resolvedHref}');
    expect(viteSource).toContain("base: '/'");
    expect(serveSource).toContain('isReadableFile(candidatePath)) ? candidatePath : entryHtmlPath');
    expect(routerSource).toContain("path: '/rules/packs/$packId/rules/$ruleId'");
    expect(routerSource).toContain('className="h-14"');
    expect(routerSource).toContain('aria-label="Search project"');
    expect(routerSource).toContain('hidden h-12 shrink-0 items-center px-3 md:flex');
    expect(routerSource).toContain('className="border-outline-weak w-full max-w-xl bg-surface"');
    expect(routerSource).not.toContain('className="mx-auto max-w-3xl"');
    expect(routerSource).toContain('className="md:hidden"');
    expect(routerSource).not.toContain('className="hidden sm:inline-flex"');
    expect(routerSource).not.toContain('searchShortcutLabel');
    expect(searchSource).toContain('/rules/packs/${encodeURIComponent(manifest.packId)}/rules/${encodeURIComponent(rule.id)}');
  });
});
