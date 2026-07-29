import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  buildSkoposEnforcementProfile,
  syncClaudeCodeHookAdapter,
  syncCodexWrapperAdapter,
  syncInstructionMirrors,
  syncManualHostAdapter,
  validateSkoposHostProjectionModel,
} from '../../../instructions/src/index.js';
import { afterEach, describe, expect, it } from 'vitest';

const temporaryRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe('host projection model', () => {
  it('projects one enforcement model into equivalent host metadata and mirrors', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-host-projection-'));
    temporaryRoots.push(workspaceRoot);
    await writeFile(join(workspaceRoot, 'AGENTS.md'), '# Canonical instructions\n', 'utf8');

    const profile = buildSkoposEnforcementProfile({
      cwd: workspaceRoot,
      actions: [],
      guards: [],
    });
    const projectionModel = profile.hostProjectionModel;

    expect(validateSkoposHostProjectionModel(profile)).toEqual({
      status: 'pass',
      diagnostics: [],
    });

    await Promise.all([
      syncInstructionMirrors({ cwd: workspaceRoot, projectionModel }),
      syncClaudeCodeHookAdapter({ cwd: workspaceRoot, projectionModel }),
      syncCodexWrapperAdapter({ cwd: workspaceRoot, projectionModel }),
      syncManualHostAdapter({ cwd: workspaceRoot, projectionModel }),
    ]);

    const [claudeMirror, cursorMirror, copilotMirror, claudeSettings, codexManifest, manualGuide] =
      await Promise.all([
        readFile(join(workspaceRoot, 'CLAUDE.md'), 'utf8'),
        readFile(join(workspaceRoot, '.cursor/rules/project.mdc'), 'utf8'),
        readFile(join(workspaceRoot, '.github/copilot-instructions.md'), 'utf8'),
        readFile(join(workspaceRoot, '.skopos/cache/tooling/claude-code/settings.json'), 'utf8'),
        readFile(join(workspaceRoot, '.skopos/cache/tooling/codex/adapter-manifest.json'), 'utf8'),
        readFile(join(workspaceRoot, '.skopos/cache/tooling/manual-hosts/README.md'), 'utf8'),
      ]);

    for (const mirror of [claudeMirror, cursorMirror, copilotMirror]) {
      expect(mirror).toContain('# Canonical instructions');
    }

    const expectedRuleIds = projectionModel.enforcementRuleIds;
    expect(JSON.parse(claudeSettings).skoposProjection.enforcementRuleIds).toEqual(
      expectedRuleIds,
    );
    expect(JSON.parse(codexManifest).projectModel.enforcementRuleIds).toEqual(
      expectedRuleIds,
    );
    for (const ruleId of expectedRuleIds) {
      expect(manualGuide).toContain(ruleId);
    }
  });

  it('rejects a host projection that drops a Skopos enforcement rule', () => {
    const profile = buildSkoposEnforcementProfile({
      cwd: '/workspace',
      actions: [],
      guards: [],
    });
    profile.hostProjectionModel.hosts[0]!.enforcementRuleIds =
      profile.hostProjectionModel.hosts[0]!.enforcementRuleIds.slice(1);

    expect(validateSkoposHostProjectionModel(profile)).toEqual({
      status: 'fail',
      diagnostics: [
        'Host projection codex does not carry the full enforcement contract.',
      ],
    });
  });

  it('projects configured mirror paths without restoring default mirror authority', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-configured-mirrors-'));
    temporaryRoots.push(workspaceRoot);
    await writeFile(join(workspaceRoot, 'AGENTS.md'), '# Canonical instructions\n', 'utf8');
    const configuredMirrorPaths = [
      'CLAUDE.md',
      '.cursor/rules/unisane-core.mdc',
      '.github/copilot-instructions.md',
    ];

    const profile = buildSkoposEnforcementProfile({
      cwd: workspaceRoot,
      actions: [],
      guards: [],
      instructionMirrorPaths: configuredMirrorPaths,
    });

    expect(validateSkoposHostProjectionModel(profile, configuredMirrorPaths)).toEqual({
      status: 'pass',
      diagnostics: [],
    });

    await syncInstructionMirrors({
      cwd: workspaceRoot,
      projectionModel: profile.hostProjectionModel,
    });

    expect(
      await readFile(join(workspaceRoot, '.cursor/rules/unisane-core.mdc'), 'utf8'),
    ).toContain('# Canonical instructions');
    await expect(
      readFile(join(workspaceRoot, '.cursor/rules/project.mdc'), 'utf8'),
    ).rejects.toThrow();
  });
});
