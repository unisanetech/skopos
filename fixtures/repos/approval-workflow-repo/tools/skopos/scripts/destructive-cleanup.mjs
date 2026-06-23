import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const outputPath = resolve(process.cwd(), '.tmp/skopos/destructive-cleanup.log');
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, 'destructive cleanup approved\n', 'utf8');
