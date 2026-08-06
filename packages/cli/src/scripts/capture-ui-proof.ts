import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import AxeBuilder from '@axe-core/playwright';
import { serveSkoposUiConsoleApp } from '@skopos/ui';
import { chromium } from 'playwright';

export interface SkoposUiProofPage {
  navigate(url: string): Promise<void>;
  hasHorizontalOverflow(): Promise<boolean>;
  capture(path: string): Promise<void>;
  analyzeAccessibility(): Promise<SkoposUiAccessibilityViolation[]>;
  close(): Promise<void>;
}

export interface SkoposUiProofBrowser {
  open(viewport: { width: number; height: number }): Promise<SkoposUiProofPage>;
  close(): Promise<void>;
}

export interface SkoposUiAccessibilityViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical' | null;
  help: string;
  nodeCount: number;
  targets: string[];
}

export interface SkoposUiProofResult {
  schemaVersion: 1;
  type: 'ui-responsive-accessibility-proof';
  status: 'passed' | 'failed';
  authority: 'generated';
  generatedAt: string;
  workspaceRoot: string;
  outputDirectory: string;
  routes: Array<{
    route: string;
    viewportId: string;
    width: number;
    height: number;
    screenshotPath: string;
    horizontalOverflow: boolean;
    violations: SkoposUiAccessibilityViolation[];
  }>;
  blockingIssueCount: number;
}

const ROUTES = ['/overview', '/tasks?view=open', '/rules', '/readiness'] as const;
const VIEWPORTS = [
  { id: 'desktop', width: 1440, height: 900 },
  { id: 'mobile', width: 390, height: 844 },
] as const;

export const captureSkoposUiProof = async ({
  cwd,
  outputDirectory,
  browser,
  serve = serveBuiltConsole,
}: {
  cwd: string;
  outputDirectory?: string;
  browser?: SkoposUiProofBrowser;
  serve?: (cwd: string) => Promise<{ url: string; close: () => Promise<void> }>;
}): Promise<SkoposUiProofResult> => {
  const workspaceRoot = resolve(cwd);
  const generatedAt = new Date().toISOString();
  const resolvedOutputDirectory = resolve(
    outputDirectory ??
      join(
        workspaceRoot,
        '.skopos/evidence/ui',
        generatedAt.replace(/[-:.]/g, '').slice(0, 15),
      ),
  );
  await mkdir(resolvedOutputDirectory, { recursive: true });
  const server = await serve(workspaceRoot);
  const activeBrowser = browser ?? (await launchPlaywrightBrowser());
  const routeResults: SkoposUiProofResult['routes'] = [];

  try {
    for (const viewport of VIEWPORTS) {
      for (const route of ROUTES) {
        const page = await activeBrowser.open(viewport);
        const routeId = route
          .replace(/^\//, '')
          .replace(/[^a-z0-9]+/gi, '-')
          .replace(/-+$/g, '');
        const screenshotPath = join(
          resolvedOutputDirectory,
          `${routeId}-${viewport.id}.png`,
        );
        try {
          await page.navigate(`${server.url}${route}`);
          const [horizontalOverflow, violations] = await Promise.all([
            page.hasHorizontalOverflow(),
            page.analyzeAccessibility(),
          ]);
          await page.capture(screenshotPath);
          routeResults.push({
            route,
            viewportId: viewport.id,
            width: viewport.width,
            height: viewport.height,
            screenshotPath,
            horizontalOverflow,
            violations,
          });
        } finally {
          await page.close();
        }
      }
    }
  } finally {
    await Promise.allSettled([activeBrowser.close(), server.close()]);
  }

  const blockingIssueCount = routeResults.reduce(
    (total, route) =>
      total +
      (route.horizontalOverflow ? 1 : 0) +
      route.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical',
      ).length,
    0,
  );
  const result: SkoposUiProofResult = {
    schemaVersion: 1,
    type: 'ui-responsive-accessibility-proof',
    status: blockingIssueCount === 0 ? 'passed' : 'failed',
    authority: 'generated',
    generatedAt,
    workspaceRoot,
    outputDirectory: resolvedOutputDirectory,
    routes: routeResults,
    blockingIssueCount,
  };
  await writeFile(
    join(resolvedOutputDirectory, 'report.json'),
    `${JSON.stringify(result, null, 2)}\n`,
    'utf8',
  );
  return result;
};

const launchPlaywrightBrowser = async (): Promise<SkoposUiProofBrowser> => {
  const browser = await chromium.launch({ headless: true });
  return {
    open: async (viewport) => {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      return {
        navigate: async (url) => {
          await page.goto(url, { waitUntil: 'networkidle' });
          await page.locator('main').first().waitFor({ state: 'visible' });
        },
        hasHorizontalOverflow: () =>
          page.evaluate(
            () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
          ),
        capture: async (path) => {
          await page.screenshot({ path, fullPage: true });
        },
        analyzeAccessibility: async () => {
          const result = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();
          return result.violations.map((violation) => ({
            id: violation.id,
            impact: violation.impact ?? null,
            help: violation.help,
            nodeCount: violation.nodes.length,
            targets: violation.nodes.flatMap((node) =>
              node.target.map((target) => String(target)),
            ),
          }));
        },
        close: () => context.close(),
      };
    },
    close: () => browser.close(),
  };
};

const serveBuiltConsole = async (
  cwd: string,
): Promise<{ url: string; close: () => Promise<void> }> => {
  const result = await serveSkoposUiConsoleApp({ cwd, host: '127.0.0.1', port: 0 });
  return {
    url: result.url,
    close: () =>
      new Promise<void>((resolveClose, reject) => {
        result.server.close((error) => {
          if (error) reject(error);
          else resolveClose();
        });
      }),
  };
};

const runFromCli = async (): Promise<void> => {
  const explicitCwd = process.argv[2];
  const cwd =
    explicitCwd && explicitCwd !== '.'
      ? explicitCwd
      : process.env.INIT_CWD ?? explicitCwd ?? process.cwd();
  const result = await captureSkoposUiProof({ cwd });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.status === 'failed') process.exitCode = 1;
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void runFromCli();
}
