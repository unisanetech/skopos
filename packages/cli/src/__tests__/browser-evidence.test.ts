import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { initSkoposProject } from '../../../runtime/src/application/init/init.service.js';
import { buildSkoposStartRuntime } from '../../../runtime/src/application/start/start.service.js';
import {
  recordSkoposBrowserEvidenceRuntime,
  verifySkoposTaskRuntime,
} from '../../../runtime/src/application/verification/verification.service.js';
import { runSkoposCli } from '../cli/index.js';

const temporaryRoots: string[] = [];

afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('source-bound browser Evidence', () => {
  it('covers acceptance with a complete receipt and becomes stale after source changes', async () => {
    const root = await createWorkspace();
    const started = await buildSkoposStartRuntime({
      cwd: root,
      goal: 'Keep the responsive hero visible',
      actor: 'browser-agent',
      risk: 'light',
      acceptanceCriteria: ['The responsive hero remains visible at the mobile viewport.'],
      ownedPaths: ['src/page.ts'],
    });
    await writeFile(join(root, 'src/page.ts'), 'export const hero = "visible";\n', 'utf8');

    const receipt = await recordSkoposBrowserEvidenceRuntime({
      cwd: root,
      taskId: started.task.id,
      requirementId: 'acceptance-1',
      url: 'http://127.0.0.1:4173/',
      viewport: { width: 390, height: 844, deviceScaleFactor: 2 },
      conditions: ['touch input', 'reduced motion'],
      interaction: 'Loaded the homepage and inspected the complete hero heading.',
      captureKind: 'screenshot',
      capturePath: 'proof/hero.png',
      browser: 'Chromium 140',
      actor: 'browser-agent',
    });

    expect(receipt).toMatchObject({
      type: 'browser-evidence',
      requirementId: 'acceptance-1',
      url: 'http://127.0.0.1:4173/',
      viewport: { width: 390, height: 844, deviceScaleFactor: 2 },
      capture: { kind: 'screenshot', path: 'proof/hero.png' },
      environment: { platform: process.platform, architecture: process.arch },
    });
    expect(receipt.capture.digest).toMatch(/^[a-f0-9]{64}$/u);
    await expect(
      verifySkoposTaskRuntime({ cwd: root, taskId: started.task.id }),
    ).resolves.toMatchObject({ verificationStatus: 'pass' });

    await writeFile(join(root, 'src/page.ts'), 'export const hero = "changed";\n', 'utf8');
    await expect(
      verifySkoposTaskRuntime({ cwd: root, taskId: started.task.id }),
    ).resolves.toMatchObject({
      verificationStatus: 'fail',
      acceptanceCoverage: [expect.objectContaining({ requirementId: 'acceptance-1', status: 'missing' })],
    });
  });

  it('exposes the receipt through the CLI and rejects malformed or unsafe inputs', async () => {
    const root = await createWorkspace();
    const started = await buildSkoposStartRuntime({
      cwd: root,
      goal: 'Measure the rendered content width',
      actor: 'browser-agent',
      risk: 'light',
      acceptanceCriteria: ['The rendered content stays within the viewport.'],
      ownedPaths: ['src/page.ts'],
    });
    await writeFile(join(root, 'src/page.ts'), 'export const width = 390;\n', 'utf8');

    const output = await captureStdout(() =>
      runSkoposCli([
        'evidence',
        'record-browser',
        started.task.id,
        root,
        '--requirement',
        'acceptance-1',
        '--url',
        '/',
        '--viewport',
        '390x844@2',
        '--interaction',
        'Measured documentElement.scrollWidth after load.',
        '--measurement',
        '{"scrollWidth":390,"viewportWidth":390}',
        '--capture-kind',
        'dom-measurement',
        '--browser',
        'Chromium 140',
        '--actor',
        'browser-agent',
        '--json',
      ]),
    );
    expect(JSON.parse(output)).toMatchObject({
      type: 'browser-evidence-summary',
      url: '/',
      viewport: { width: 390, height: 844, deviceScaleFactor: 2 },
      capture: { kind: 'dom-measurement' },
    });

    await expect(
      runSkoposCli([
        'evidence', 'record-browser', started.task.id, root,
        '--requirement', 'acceptance-1', '--url', '/', '--viewport', 'wide',
        '--interaction', 'Inspect.', '--measurement', '{}', '--capture-kind', 'dom-measurement',
        '--browser', 'Chromium', '--actor', 'browser-agent',
      ]),
    ).rejects.toThrow('--viewport requires WIDTHxHEIGHT');
    await expect(
      recordSkoposBrowserEvidenceRuntime({
        cwd: root,
        taskId: started.task.id,
        requirementId: 'acceptance-1',
        url: '/',
        viewport: { width: 390, height: 844 },
        interaction: 'Inspect.',
        captureKind: 'screenshot',
        capturePath: '../outside.png',
        browser: 'Chromium',
        actor: 'browser-agent',
      }),
    ).rejects.toThrow('capture path must stay inside the workspace');
  });
});

const captureStdout = async (run: () => Promise<void>): Promise<string> => {
  const writes: string[] = [];
  vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
    writes.push(String(chunk));
    return true;
  });
  await run();
  vi.restoreAllMocks();
  return writes.join('');
};

const createWorkspace = async (): Promise<string> => {
  const root = await mkdtemp(join(tmpdir(), 'skopos-browser-evidence-'));
  temporaryRoots.push(root);
  await Promise.all([
    mkdir(join(root, 'src'), { recursive: true }),
    mkdir(join(root, 'proof'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(join(root, 'package.json'), JSON.stringify({ name: 'browser-evidence-fixture', private: true }), 'utf8'),
    writeFile(join(root, 'README.md'), '# Browser Evidence fixture\n', 'utf8'),
    writeFile(join(root, 'AGENTS.md'), '# Fixture agent rules\n', 'utf8'),
    writeFile(join(root, 'src/page.ts'), 'export const hero = "initial";\n', 'utf8'),
    writeFile(join(root, 'proof/hero.png'), 'fixture screenshot bytes', 'utf8'),
  ]);
  await initSkoposProject({
    cwd: root,
    mode: 'existing',
    actor: 'fixture-init',
    scaffoldInstructions: false,
  });
  return root;
};
