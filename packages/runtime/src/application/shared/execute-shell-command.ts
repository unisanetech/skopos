import { spawn } from 'node:child_process';
import { delimiter, dirname, join, resolve } from 'node:path';

export interface SkoposShellCommandExecutionResult {
  exitCode: number;
  startedAt: string;
  finishedAt: string;
  stdoutExcerpt?: string;
  stderrExcerpt?: string;
}

const MAX_EXCERPT_CHARS = 1200;
const HEAD_LINE_COUNT = 3;
const TAIL_LINE_COUNT = 6;

export const executeSkoposShellCommand = async ({
  command,
  cwd,
}: {
  command: string;
  cwd: string;
}): Promise<SkoposShellCommandExecutionResult> => {
  const startedAt = new Date().toISOString();
  const resolvedCwd = resolve(cwd);

  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn('/bin/zsh', ['-lc', `setopt NONOMATCH; ${command}`], {
      cwd: resolvedCwd,
      env: {
        ...process.env,
        PATH: buildAugmentedPath(resolvedCwd, process.env.PATH),
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
    });

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });

    child.on('error', rejectPromise);
    child.on('close', (code) => {
      resolvePromise({
        exitCode: code ?? 1,
        startedAt,
        finishedAt: new Date().toISOString(),
        stdoutExcerpt: clipOutput(stdout),
        stderrExcerpt: clipOutput(stderr),
      });
    });
  });
};

const buildAugmentedPath = (cwd: string, existingPath = ''): string => {
  const binPaths: string[] = [];
  let current = cwd;

  while (true) {
    binPaths.push(join(current, 'node_modules', '.bin'));
    const parent = dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  return [...new Set([...binPaths, ...existingPath.split(delimiter).filter(Boolean)])].join(
    delimiter,
  );
};

const clipOutput = (output: string): string | undefined => {
  const normalized = output.replace(/\r\n/g, '\n').trim();
  if (normalized.length === 0) {
    return undefined;
  }

  if (normalized.length <= MAX_EXCERPT_CHARS) {
    return normalized;
  }

  const lines = normalized.split('\n');
  const head = lines.slice(0, HEAD_LINE_COUNT);
  const tail = lines.slice(-TAIL_LINE_COUNT);
  const summary = `[output clipped: ${lines.length} lines, ${normalized.length} chars]`;
  const excerpt = [...head, '...', ...tail].join('\n');
  const candidate = `${summary}\n${excerpt}`;

  if (candidate.length <= MAX_EXCERPT_CHARS) {
    return candidate;
  }

  const allowance = Math.max(0, MAX_EXCERPT_CHARS - summary.length - 1);
  return `${summary}\n${excerpt.slice(0, allowance)}`.trimEnd();
};
