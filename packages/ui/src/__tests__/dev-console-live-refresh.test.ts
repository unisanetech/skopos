import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { resolveSkoposUiDevWatchTargets } from '../application/dev-console-app/dev-console-app.service.js';

describe('Skopos UI live refresh', () => {
  it('watches authoritative Task and runtime state recursively', () => {
    const workspaceRoot = join('/workspace', 'project');
    const targets = resolveSkoposUiDevWatchTargets(workspaceRoot);

    expect(targets).toContain(join(workspaceRoot, '.skopos'));
    expect(targets).toContain(join(workspaceRoot, 'docs'));
    expect(targets).not.toContain(join(workspaceRoot, '.skopos', 'tasks', 'tasks', '*.json'));
  });
});
