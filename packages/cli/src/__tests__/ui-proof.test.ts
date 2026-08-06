import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  captureSkoposUiProof,
  type SkoposUiProofBrowser,
} from '../scripts/capture-ui-proof.js';
import { describe, expect, it } from 'vitest';

describe('responsive UI proof', () => {
  it('captures every route and viewport, records accessibility, and disposes resources', async () => {
    const outputDirectory = await mkdtemp(join(tmpdir(), 'skopos-ui-proof-'));
    let openedPages = 0;
    let closedPages = 0;
    let browserClosed = 0;
    let serverClosed = 0;
    const browser: SkoposUiProofBrowser = {
      open: async () => {
        openedPages += 1;
        return {
          navigate: async () => undefined,
          hasHorizontalOverflow: async () => false,
          capture: async (path) => {
            await writeFile(path, 'non-empty-screenshot', 'utf8');
          },
          analyzeAccessibility: async () => [
            {
              id: 'fixture-moderate',
              impact: 'moderate',
              help: 'Fixture advisory',
              nodeCount: 1,
              targets: ['#fixture-advisory'],
            },
          ],
          close: async () => {
            closedPages += 1;
          },
        };
      },
      close: async () => {
        browserClosed += 1;
      },
    };

    try {
      const result = await captureSkoposUiProof({
        cwd: process.cwd(),
        outputDirectory,
        browser,
        serve: async () => ({
          url: 'http://127.0.0.1:4173',
          close: async () => {
            serverClosed += 1;
          },
        }),
      });

      expect(result).toMatchObject({
        type: 'ui-responsive-accessibility-proof',
        authority: 'generated',
        status: 'passed',
        blockingIssueCount: 0,
      });
      expect(result.routes).toHaveLength(8);
      expect(new Set(result.routes.map((route) => route.viewportId))).toEqual(
        new Set(['desktop', 'mobile']),
      );
      expect(openedPages).toBe(8);
      expect(closedPages).toBe(8);
      expect(browserClosed).toBe(1);
      expect(serverClosed).toBe(1);
      for (const route of result.routes) {
        expect((await stat(route.screenshotPath)).size).toBeGreaterThan(0);
      }
      expect(
        JSON.parse(await readFile(join(outputDirectory, 'report.json'), 'utf8')),
      ).toMatchObject({ status: 'passed', routes: expect.any(Array) });
    } finally {
      await rm(outputDirectory, { recursive: true, force: true });
    }
  });

  it('fails proof on horizontal overflow or serious accessibility violations', async () => {
    const outputDirectory = await mkdtemp(join(tmpdir(), 'skopos-ui-proof-fail-'));
    const browser: SkoposUiProofBrowser = {
      open: async () => ({
        navigate: async () => undefined,
        hasHorizontalOverflow: async () => true,
        capture: async (path) => {
          await writeFile(path, 'non-empty-screenshot', 'utf8');
        },
        analyzeAccessibility: async () => [
          {
            id: 'fixture-serious',
            impact: 'serious',
            help: 'Fixture blocker',
            nodeCount: 1,
            targets: ['#fixture-blocker'],
          },
        ],
        close: async () => undefined,
      }),
      close: async () => undefined,
    };

    try {
      const result = await captureSkoposUiProof({
        cwd: process.cwd(),
        outputDirectory,
        browser,
        serve: async () => ({
          url: 'http://127.0.0.1:4173',
          close: async () => undefined,
        }),
      });

      expect(result.status).toBe('failed');
      expect(result.blockingIssueCount).toBe(16);
      expect(result.routes.every((route) => route.horizontalOverflow)).toBe(true);
    } finally {
      await rm(outputDirectory, { recursive: true, force: true });
    }
  });
});
