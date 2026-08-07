import { execFileSync } from 'node:child_process';
import { cp, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(scriptDirectory, '..');
const workspaceRoot = join(packageRoot, '..', '..');
const uiPackageRoot = join(workspaceRoot, 'packages', 'ui');
const source = join(uiPackageRoot, 'dist-app');
const destination = join(packageRoot, 'dist', 'ui-app');
const packageManagerEntrypoint = process.env.npm_execpath;

if (!packageManagerEntrypoint) {
  throw new Error('Cannot build the UI app because npm_execpath is not available.');
}

execFileSync(process.execPath, [packageManagerEntrypoint, '--filter', '@skopos/ui', 'app:build'], {
  cwd: workspaceRoot,
  stdio: 'inherit',
});

await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });
