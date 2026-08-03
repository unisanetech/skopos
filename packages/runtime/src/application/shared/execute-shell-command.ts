import { spawn } from 'node:child_process';
import { delimiter, dirname, join, resolve } from 'node:path';

export interface SkoposShellCommandExecutionResult {
  exitCode: number;
  startedAt: string;
  finishedAt: string;
  timedOut: boolean;
  timeoutMs?: number;
  stdoutExcerpt?: string;
  stderrExcerpt?: string;
}

export interface SkoposShellCommandProgressEvent {
  kind: 'started' | 'heartbeat' | 'timing-out' | 'finished';
  at: string;
  elapsedMs: number;
}

const MAX_EXCERPT_CHARS = 1200;
const HEAD_LINE_COUNT = 3;
const TAIL_LINE_COUNT = 6;

export const executeSkoposShellCommand = async ({
  command,
  cwd,
  timeoutMs,
  environment = {},
  progressIntervalMs = 30_000,
  onProgress,
}: {
  command: string;
  cwd: string;
  timeoutMs?: number;
  environment?: Record<string, string>;
  progressIntervalMs?: number;
  onProgress?: (event: SkoposShellCommandProgressEvent) => void;
}): Promise<SkoposShellCommandExecutionResult> => {
  const startedAt = new Date().toISOString();
  const startedAtMs = Date.parse(startedAt);
  const resolvedCwd = resolve(cwd);

  const emitProgress = (kind: SkoposShellCommandProgressEvent['kind']): void => {
    const at = new Date().toISOString();
    onProgress?.({
      kind,
      at,
      elapsedMs: Math.max(0, Date.parse(at) - startedAtMs),
    });
  };

  return new Promise((resolvePromise, rejectPromise) => {
    let settled = false;
    let timedOut = false;
    const child = spawn('/bin/zsh', ['-lc', `setopt NONOMATCH; ${command}`], {
      cwd: resolvedCwd,
      detached: true,
      env: {
        ...process.env,
        PATH: buildAugmentedPath(resolvedCwd, process.env.PATH),
        ...environment,
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    emitProgress('started');

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
    });

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });

    const timeout =
      timeoutMs && timeoutMs > 0
        ? setTimeout(() => {
            timedOut = true;
            emitProgress('timing-out');
            killChildProcessGroup(child.pid, 'SIGTERM');
            setTimeout(() => {
              if (!settled) {
                killChildProcessGroup(child.pid, 'SIGKILL');
              }
            }, 2000).unref();
          }, timeoutMs)
        : undefined;

    const progressInterval =
      progressIntervalMs > 0
        ? setInterval(() => emitProgress('heartbeat'), progressIntervalMs)
        : undefined;
    progressInterval?.unref();

    child.on('error', (error) => {
      if (timeout) clearTimeout(timeout);
      if (progressInterval) clearInterval(progressInterval);
      rejectPromise(error);
    });
    child.on('close', (code) => {
      settled = true;
      if (timeout) {
        clearTimeout(timeout);
      }
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      emitProgress('finished');
      resolvePromise({
        exitCode: code ?? 1,
        startedAt,
        finishedAt: new Date().toISOString(),
        timedOut,
        timeoutMs,
        stdoutExcerpt: clipOutput(stdout),
        stderrExcerpt: clipOutput(stderr),
      });
    });
  });
};

const killChildProcessGroup = (pid: number | undefined, signal: NodeJS.Signals): void => {
  if (!pid) {
    return;
  }

  try {
    process.kill(-pid, signal);
  } catch {
    try {
      process.kill(pid, signal);
    } catch {
      // The process may have exited between the timeout and the signal.
    }
  }
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
