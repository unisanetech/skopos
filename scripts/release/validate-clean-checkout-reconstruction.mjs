import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, realpathSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = realpathSync(process.argv[2]
  ? resolve(process.argv[2])
  : resolve(dirname(fileURLToPath(import.meta.url)), '../..'));
const derivedStateRoot = resolve(workspaceRoot, '.skopos');

const run = (command, args) =>
  execFileSync(command, args, {
    cwd: workspaceRoot,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1' },
    stdio: ['ignore', 'pipe', 'inherit'],
  });

const runCli = (args) =>
  JSON.parse(
    run(process.execPath, [
      '--import',
      'tsx',
      'packages/cli/src/cli.ts',
      ...args,
      '--json',
    ]),
  );

assert.equal(
  run('git', ['status', '--porcelain']),
  '',
  'Clean-checkout reconstruction must start from an unchanged candidate checkout.',
);
assert.equal(
  run('git', ['ls-files', '.skopos']).trim(),
  '',
  'Disposable .skopos state must not be tracked.',
);
assert.equal(
  existsSync(derivedStateRoot),
  false,
  'Clean-checkout reconstruction requires a checkout with no pre-existing .skopos state.',
);

const actor = 'release-reconstruction';
const initialized = runCli(['init', '.', '--mode', 'existing', '--actor', actor]);
const knowledge = runCli(['knowledge', '.', '--compact']);
const actions = runCli(['actions', 'list', '.']);
const session = runCli(['session', 'context', '.', '--actor', actor]);

assert.ok(initialized.projectPath?.endsWith('/.skopos/project.json'));
assert.ok(initialized.memoryPath?.endsWith('/.skopos/index/roles.json'));
assert.equal(resolve(knowledge.workspaceRoot), workspaceRoot);
assert.equal(knowledge.agentGuideReady, true);
assert.ok(knowledge.knownAreaCount >= 9, 'Tracked Memory did not reconstruct enough project knowledge.');
assert.ok(actions.totalActionCount > 0, 'Tracked capability sources did not reconstruct any Actions.');
assert.equal(resolve(session.workspaceRoot), workspaceRoot);
assert.deepEqual(session.warnings, []);
assert.equal(
  session.setupReadiness?.state,
  'ready',
  'Tracked unified-setup certification did not reconstruct as ready in the clean checkout.',
);
assert.equal(
  session.setupReadiness?.source,
  'tracked-certification',
  'Clean-checkout readiness must come from tracked setup certification.',
);
assert.match(
  session.setupReadiness?.certificationTaskId ?? '',
  /^T-/u,
  'Clean-checkout readiness did not identify its tracked certification Task.',
);
assert.equal(
  run('git', ['status', '--porcelain']),
  '',
  'Reconstructing disposable state must not mutate tracked candidate files.',
);

console.log(
  JSON.stringify(
    {
      schemaVersion: 1,
      candidateCommit: run('git', ['rev-parse', 'HEAD']).trim(),
      knownAreaCount: knowledge.knownAreaCount,
      totalAreaCount: knowledge.totalAreaCount,
      actionCount: actions.totalActionCount,
      sessionSetupReadiness: session.setupReadiness.state,
      setupCertificationTaskId: session.setupReadiness.certificationTaskId,
      trackedWorktreeClean: true,
    },
    null,
    2,
  ),
);
