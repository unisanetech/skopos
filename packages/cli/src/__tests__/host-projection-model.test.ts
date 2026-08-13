import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  buildSkoposEnforcementProfile,
  scaffoldProjectInstructions,
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
    expect(projectionModel.hosts.find((host) => host.hostId === 'codex')?.freshContinuation).toEqual({
      createFreshSession: true, injectInitialPrompt: true, identifyOriginSession: true,
      messageOriginSession: true, detectPreCompaction: true, reportCompletion: true,
      deliveryMode: 'host-api',
    });
    expect(projectionModel.hosts.find((host) => host.hostId === 'claude-code')?.freshContinuation).toMatchObject({
      createFreshSession: false, injectInitialPrompt: false, identifyOriginSession: true,
      messageOriginSession: false, detectPreCompaction: true, reportCompletion: true,
      deliveryMode: 'interactive-launch',
    });
    expect(projectionModel.hosts.find((host) => host.hostId === 'manual-hosts')?.freshContinuation).toMatchObject({
      createFreshSession: false, injectInitialPrompt: false, identifyOriginSession: false,
      messageOriginSession: false, detectPreCompaction: false, reportCompletion: false,
      deliveryMode: 'manual-copy',
    });
    expect(manualGuide).toContain('Rendering is not delivery');
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
      '.cursor/rules/product-core.mdc',
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
      await readFile(join(workspaceRoot, '.cursor/rules/product-core.mdc'), 'utf8'),
    ).toContain('# Canonical instructions');
    await expect(
      readFile(join(workspaceRoot, '.cursor/rules/project.mdc'), 'utf8'),
    ).rejects.toThrow();
  });

  it('projects one configured canonical instruction path through every generated host surface', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-custom-instruction-source-'));
    temporaryRoots.push(workspaceRoot);
    const instructionSourcePath = 'PROJECT_AGENT.md';
    await writeFile(
      join(workspaceRoot, instructionSourcePath),
      '# Project-specific canonical instructions\n',
      'utf8',
    );
    const profile = buildSkoposEnforcementProfile({
      cwd: workspaceRoot,
      actions: [],
      guards: [],
      instructionSourcePath,
    });

    await Promise.all([
      syncInstructionMirrors({ cwd: workspaceRoot, projectionModel: profile.hostProjectionModel }),
      syncClaudeCodeHookAdapter({ cwd: workspaceRoot, projectionModel: profile.hostProjectionModel }),
      syncCodexWrapperAdapter({ cwd: workspaceRoot, projectionModel: profile.hostProjectionModel }),
      syncManualHostAdapter({ cwd: workspaceRoot, projectionModel: profile.hostProjectionModel }),
    ]);

    const [mirror, claudePostEditHook, codexReadme, manualGuide] = await Promise.all([
      readFile(join(workspaceRoot, 'CLAUDE.md'), 'utf8'),
      readFile(
        join(workspaceRoot, '.skopos/cache/tooling/claude-code/hooks/post-edit-hook.mjs'),
        'utf8',
      ),
      readFile(join(workspaceRoot, '.skopos/cache/tooling/codex/README.md'), 'utf8'),
      readFile(join(workspaceRoot, '.skopos/cache/tooling/manual-hosts/README.md'), 'utf8'),
    ]);

    expect(profile.instructionSourcePath).toBe(instructionSourcePath);
    expect(
      profile.rules.find((rule) => rule.id === 'enforcement.after-instruction-source-edit')?.summary,
    ).toContain(instructionSourcePath);
    expect(mirror).toContain(`Generated from ${instructionSourcePath}`);
    expect(claudePostEditHook).toContain(`const instructionSourcePath = "${instructionSourcePath}"`);
    expect(claudePostEditHook).toContain(`after ${instructionSourcePath} changed`);
    expect(codexReadme).toContain(`\`${instructionSourcePath}\` plus`);
    expect(manualGuide).toContain(`Read \`${instructionSourcePath}\``);
    for (const generatedSurface of [claudePostEditHook, codexReadme, manualGuide]) {
      expect(generatedSurface).not.toContain('AGENTS.md');
    }
  });

  it('rejects self-mirroring and symlink escapes before instruction writes', async () => {
    const workspaceRoot = await mkdtemp(join(tmpdir(), 'skopos-instruction-containment-'));
    const outsideRoot = await mkdtemp(join(tmpdir(), 'skopos-instruction-outside-'));
    temporaryRoots.push(workspaceRoot, outsideRoot);
    await writeFile(join(workspaceRoot, 'AGENTS.md'), '# Canonical instructions\n', 'utf8');

    await expect(syncInstructionMirrors({
      cwd: workspaceRoot,
      instructionSourcePath: 'AGENTS.md',
      mirrorTargets: ['AGENTS.md'],
    })).rejects.toThrow('cannot also be an instruction mirror');

    await mkdir(join(workspaceRoot, '.cursor'), { recursive: true });
    await symlink(
      outsideRoot,
      join(workspaceRoot, '.cursor/rules'),
      process.platform === 'win32' ? 'junction' : 'dir',
    );
    await expect(syncInstructionMirrors({
      cwd: workspaceRoot,
      instructionSourcePath: 'AGENTS.md',
      mirrorTargets: ['.cursor/rules/project.mdc'],
    })).rejects.toThrow('resolves outside the workspace through a symbolic link');
    await expect(readFile(join(outsideRoot, 'project.mdc'), 'utf8')).rejects.toThrow();

    await expect(scaffoldProjectInstructions({
      cwd: workspaceRoot,
      instructionSourcePath: '.cursor/rules/PROJECT_AGENT.md',
    })).rejects.toThrow('resolves outside the workspace through a symbolic link');
    await symlink(
      outsideRoot,
      join(workspaceRoot, '.skopos'),
      process.platform === 'win32' ? 'junction' : 'dir',
    );
    await expect(syncCodexWrapperAdapter({ cwd: workspaceRoot }))
      .rejects.toThrow('resolves outside the workspace through a symbolic link');
  });
});
