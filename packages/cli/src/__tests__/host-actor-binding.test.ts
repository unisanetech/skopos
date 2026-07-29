import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  syncClaudeCodeHookAdapter,
  syncCodexWrapperAdapter,
} from '../../../instructions/src/index.js';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('generated host actor binding', () => {
  it('requires one explicit claimant binding without treating host sessions as actors', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-host-actor-binding-'));
    temporaryRoots.push(workspaceRoot);

    await Promise.all([
      syncClaudeCodeHookAdapter({ cwd: workspaceRoot }),
      syncCodexWrapperAdapter({ cwd: workspaceRoot }),
    ]);

    const [claudeSettingsSource, codexManifestSource, codexReadme] = await Promise.all([
      readFile(
        join(workspaceRoot, '.skopos/cache/tooling/claude-code/settings.json'),
        'utf8',
      ),
      readFile(
        join(workspaceRoot, '.skopos/cache/tooling/codex/adapter-manifest.json'),
        'utf8',
      ),
      readFile(join(workspaceRoot, '.skopos/cache/tooling/codex/README.md'), 'utf8'),
    ]);
    const claudeSettings = JSON.parse(claudeSettingsSource) as {
      skoposProjection: { actorBinding: unknown };
    };
    const codexManifest = JSON.parse(codexManifestSource) as {
      actorBinding: unknown;
    };
    const expectedActorBinding = {
      source: 'environment-variable',
      variable: 'SKOPOS_ACTOR',
      requiredForTaskSpecificRouting: true,
      fallback: 'none',
      sessionId: {
        role: 'discussion-continuity-and-coordination',
        acceptedAsActorId: false,
      },
    };

    expect(claudeSettings.skoposProjection.actorBinding).toEqual(expectedActorBinding);
    expect(codexManifest.actorBinding).toEqual(expectedActorBinding);
    expect(codexReadme).toContain(
      'set `SKOPOS_ACTOR` to the dedicated claimant actor id',
    );
    expect(codexReadme).toContain(
      '`sessionId` identifies both discussion continuity and local coordination Session',
    );
    expect(codexReadme).toContain('this adapter has no actor fallback');
  });
});
