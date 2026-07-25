import { cp, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(scriptDirectory, '..');
const workspaceRoot = join(packageRoot, '..', '..');
const source = join(workspaceRoot, 'skill-packs');
const destination = join(packageRoot, 'dist', 'skill-packs');

await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });
