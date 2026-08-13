import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import type { SkoposHostProjectionModel } from '@skopos/model';

import { buildHostActorBinding } from '../host-actor-binding/host-actor-binding.js';
import { normalizeInstructionSourcePath } from '../scaffold-project-instructions/scaffold-project-instructions.service.js';
import { resolveWorkspaceContainedPath } from '../shared/workspace-contained-path.js';

export interface SyncClaudeCodeHookAdapterOptions {
  cwd: string;
  dryRun?: boolean;
  projectionModel?: SkoposHostProjectionModel;
  instructionSourcePath?: string;
}

export interface ClaudeCodeHookAdapterWrite {
  path: string;
  status: 'written' | 'dry-run';
}

export interface SyncClaudeCodeHookAdapterResult {
  settingsPath: string;
  hookPaths: string[];
  writes: ClaudeCodeHookAdapterWrite[];
}

const SETTINGS_RELATIVE_PATH = '.skopos/cache/tooling/claude-code/settings.json';
const SESSION_START_HOOK_RELATIVE_PATH =
  '.skopos/cache/tooling/claude-code/hooks/session-start-hook.mjs';
const USER_PROMPT_SUBMIT_HOOK_RELATIVE_PATH =
  '.skopos/cache/tooling/claude-code/hooks/user-prompt-submit-hook.mjs';
const POST_EDIT_HOOK_RELATIVE_PATH =
  '.skopos/cache/tooling/claude-code/hooks/post-edit-hook.mjs';
const PRE_COMPACT_HOOK_RELATIVE_PATH =
  '.skopos/cache/tooling/claude-code/hooks/pre-compact-hook.mjs';
const STOP_HOOK_RELATIVE_PATH = '.skopos/cache/tooling/claude-code/hooks/stop-hook.mjs';

export const syncClaudeCodeHookAdapter = async ({
  cwd,
  dryRun = false,
  projectionModel,
  instructionSourcePath: providedInstructionSourcePath,
}: SyncClaudeCodeHookAdapterOptions): Promise<SyncClaudeCodeHookAdapterResult> => {
  const workspaceRoot = resolve(cwd);
  const instructionSourcePath = normalizeInstructionSourcePath(
    providedInstructionSourcePath ?? projectionModel?.instructionSourcePath,
  );
  const [settingsPath, sessionStartHookPath, userPromptSubmitHookPath, postEditHookPath, preCompactHookPath, stopHookPath] = await Promise.all([
    resolveWorkspaceContainedPath({ workspaceRoot, path: SETTINGS_RELATIVE_PATH, label: 'Claude Code adapter settings' }),
    resolveWorkspaceContainedPath({ workspaceRoot, path: SESSION_START_HOOK_RELATIVE_PATH, label: 'Claude Code session-start hook' }),
    resolveWorkspaceContainedPath({ workspaceRoot, path: USER_PROMPT_SUBMIT_HOOK_RELATIVE_PATH, label: 'Claude Code user-prompt hook' }),
    resolveWorkspaceContainedPath({ workspaceRoot, path: POST_EDIT_HOOK_RELATIVE_PATH, label: 'Claude Code post-edit hook' }),
    resolveWorkspaceContainedPath({ workspaceRoot, path: PRE_COMPACT_HOOK_RELATIVE_PATH, label: 'Claude Code pre-compact hook' }),
    resolveWorkspaceContainedPath({ workspaceRoot, path: STOP_HOOK_RELATIVE_PATH, label: 'Claude Code stop hook' }),
  ]);
  const files = [
    {
      path: settingsPath,
      contents: renderClaudeCodeSettings(projectionModel),
    },
    {
      path: sessionStartHookPath,
      contents: renderSessionStartHookScript(),
    },
    {
      path: userPromptSubmitHookPath,
      contents: renderUserPromptSubmitHookScript(),
    },
    {
      path: postEditHookPath,
      contents: renderPostEditHookScript(instructionSourcePath),
    },
    {
      path: preCompactHookPath,
      contents: renderPreCompactHookScript(),
    },
    {
      path: stopHookPath,
      contents: renderStopHookScript(),
    },
  ];
  const writes: ClaudeCodeHookAdapterWrite[] = [];

  for (const file of files) {
    if (!dryRun) {
      await mkdir(dirname(file.path), { recursive: true });
      await writeFile(file.path, file.contents, 'utf8');
    }

    writes.push({
      path: file.path,
      status: dryRun ? 'dry-run' : 'written',
    });
  }

  return {
    settingsPath,
    hookPaths: [
      sessionStartHookPath,
      userPromptSubmitHookPath,
      postEditHookPath,
      preCompactHookPath,
      stopHookPath,
    ],
    writes,
  };
};

const renderClaudeCodeSettings = (projectionModel?: SkoposHostProjectionModel): string =>
  `${JSON.stringify(
    {
      skoposProjection: {
        schemaVersion: projectionModel?.schemaVersion ?? 1,
        actorBinding: buildHostActorBinding(),
        ...(projectionModel
          ? {
              authority: projectionModel.authority,
              projectModelPath: '.skopos/index/enforcement.json',
              enforcementRuleIds:
                projectionModel.hosts.find((host) => host.hostId === 'claude-code')
                  ?.enforcementRuleIds ?? [],
            }
          : {}),
      },
      hooks: {
        SessionStart: [
          {
            hooks: [
              {
                type: 'command',
                command:
                  'node "$CLAUDE_PROJECT_DIR/.skopos/cache/tooling/claude-code/hooks/session-start-hook.mjs"',
              },
            ],
          },
        ],
        UserPromptSubmit: [
          {
            hooks: [
              {
                type: 'command',
                command:
                  'node "$CLAUDE_PROJECT_DIR/.skopos/cache/tooling/claude-code/hooks/user-prompt-submit-hook.mjs"',
              },
            ],
          },
        ],
        PostToolUse: [
          {
            matcher: 'Edit|Write|MultiEdit',
            hooks: [
              {
                type: 'command',
                command:
                  'node "$CLAUDE_PROJECT_DIR/.skopos/cache/tooling/claude-code/hooks/post-edit-hook.mjs"',
              },
            ],
          },
        ],
        PreCompact: [
          {
            matcher: '*',
            hooks: [
              {
                type: 'command',
                command:
                  'node "$CLAUDE_PROJECT_DIR/.skopos/cache/tooling/claude-code/hooks/pre-compact-hook.mjs"',
              },
            ],
          },
        ],
        Stop: [
          {
            hooks: [
              {
                type: 'command',
                command:
                  'node "$CLAUDE_PROJECT_DIR/.skopos/cache/tooling/claude-code/hooks/stop-hook.mjs"',
              },
            ],
          },
        ],
      },
    },
    null,
    2,
  )}\n`;

const renderSharedRunner = (): string => `
import { spawnSync } from 'node:child_process';

const runSkopos = (projectDir, args, options = {}) => {
  const cliEntrypoint = process.env.SKOPOS_CLI_ENTRYPOINT;
  const sharedOptions = {
    encoding: 'utf8',
    env: process.env,
    input: typeof options.input === 'string' ? options.input : undefined,
  };

  if (cliEntrypoint) {
    const nodeImportPath = process.env.SKOPOS_NODE_IMPORT_PATH || 'tsx';
    const cliCwd = process.env.SKOPOS_CLI_CWD || projectDir;

    return spawnSync(process.execPath, ['--import', nodeImportPath, cliEntrypoint, ...args], {
      cwd: cliCwd,
      ...sharedOptions,
    });
  }

  return spawnSync('skopos', args, {
    cwd: projectDir,
    ...sharedOptions,
  });
};

const readInput = async () => {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (raw.length === 0) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

const parseJsonOutput = (result) => {
  if (!result || typeof result.stdout !== 'string' || result.stdout.trim().length === 0) {
    return {};
  }

  try {
    return JSON.parse(result.stdout);
  } catch {
    return {};
  }
};

`;

const renderSessionStartHookScript = (): string => `#!/usr/bin/env node
${renderSharedRunner()}

const input = await readInput();
const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const contextArgs = ['session', 'context', projectDir, '--host', 'claude-code', '--json'];
if (typeof input.session_id === 'string' && input.session_id.trim().length > 0) {
  contextArgs.push('--session-id', input.session_id.trim());
}
const contextResult = runSkopos(projectDir, contextArgs);

if (contextResult.status !== 0) {
  process.exit(0);
}

const contextReport = parseJsonOutput(contextResult);
const additionalContext =
  typeof contextReport.additionalContext === 'string'
    ? contextReport.additionalContext
    : '';

if (additionalContext.trim().length === 0) {
  process.exit(0);
}

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext,
    },
  }),
);
`;

const renderUserPromptSubmitHookScript = (): string => `#!/usr/bin/env node
${renderSharedRunner()}

const input = await readInput();
const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const prompt = typeof input.prompt === 'string' ? input.prompt.trim() : '';

if (prompt.length === 0) {
  process.exit(0);
}

runSkopos(
  projectDir,
  [
    'discuss',
    'append-turn',
    projectDir,
    '--session-id',
    String(input.session_id || 'current'),
    '--role',
    'user',
    '--source-event',
    'user-prompt-submit',
    '--message-stdin',
    '--json',
    ...(typeof input.transcript_path === 'string' && input.transcript_path.length > 0
      ? ['--transcript-path', input.transcript_path]
      : []),
  ],
  {
    input: prompt,
  },
);
`;

const renderPostEditHookScript = (instructionSourcePath: string): string => `#!/usr/bin/env node
${renderSharedRunner()}

const input = await readInput();
const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const filePath = typeof input.tool_input?.file_path === 'string' ? input.tool_input.file_path : '';
const normalizedFilePath = filePath.replaceAll('\\\\', '/');
const normalizedProjectDir = projectDir.replaceAll('\\\\', '/').replace(/\\/$/, '');
const instructionSourcePath = ${JSON.stringify(instructionSourcePath)};
const projectInstructionPath = normalizedProjectDir + '/' + instructionSourcePath;

if (normalizedFilePath !== instructionSourcePath && normalizedFilePath !== projectInstructionPath) {
  process.exit(0);
}

const result = runSkopos(projectDir, ['instructions', 'sync', projectDir, '--json']);

if (result.status !== 0) {
  process.stderr.write(result.stderr || ${JSON.stringify(`Skopos failed to sync instruction mirrors after ${instructionSourcePath} changed.\n`)});
  process.exit(1);
}
`;

const renderPreCompactHookScript = (): string => `#!/usr/bin/env node
${renderSharedRunner()}

const input = await readInput();
const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();

const contextResult = runSkopos(projectDir, ['session', 'context', projectDir, '--host', 'claude-code', '--json']);
const context = parseJsonOutput(contextResult);
if (contextResult.status !== 0 || typeof context.currentTaskId !== 'string') {
  process.stderr.write(contextResult.stderr || 'Skopos could not resolve one exact current Task for continuation.\\n');
  process.exit(1);
}
runSkopos(projectDir, ['discuss', 'handoff', 'refresh', projectDir, '--task', context.currentTaskId, '--json']);
`;

const renderStopHookScript = (): string => `#!/usr/bin/env node
${renderSharedRunner()}

const input = await readInput();
if (input.stop_hook_active === true) {
  process.exit(0);
}

const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const lastAssistantMessage =
  typeof input.last_assistant_message === 'string' ? input.last_assistant_message.trim() : '';

if (lastAssistantMessage.length > 0) {
  runSkopos(
    projectDir,
    [
      'discuss',
      'append-turn',
      projectDir,
      '--session-id',
      String(input.session_id || 'current'),
      '--role',
      'assistant',
      '--source-event',
      'stop',
      '--message-stdin',
      '--json',
      ...(typeof input.transcript_path === 'string' && input.transcript_path.length > 0
        ? ['--transcript-path', input.transcript_path]
        : []),
    ],
    {
      input: lastAssistantMessage,
    },
  );
}

runSkopos(projectDir, ['discuss', 'checkpoint', projectDir, '--json']);
const contextResult = runSkopos(projectDir, ['session', 'context', projectDir, '--host', 'claude-code', '--json']);
const context = parseJsonOutput(contextResult);
if (contextResult.status !== 0) {
  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason: 'Skopos could not load current Session context. Repair Session or Task state before stopping.',
    }),
  );
  process.exit(0);
}

if (typeof context.nextCommand === 'string' && context.nextCommand.trim().length > 0) {
  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason: \`Skopos has an unresolved next step. Run \\\`\${context.nextCommand.trim()}\\\` before stopping.\`,
    }),
  );
  process.exit(0);
}

if (typeof context.currentTaskId !== 'string' || context.currentTaskId.length === 0) {
  process.exit(0);
}

const readinessArgs = ['readiness', context.currentTaskId, projectDir, '--for', 'close', '--json'];
if (typeof process.env.SKOPOS_ACTOR === 'string' && process.env.SKOPOS_ACTOR.trim().length > 0) {
  readinessArgs.push('--actor', process.env.SKOPOS_ACTOR.trim());
}
const readinessResult = runSkopos(projectDir, readinessArgs);
const readiness = parseJsonOutput(readinessResult);
if (readinessResult.status === 0 && readiness.readiness === 'ready') {
  process.exit(0);
}

process.stdout.write(
  JSON.stringify({
    decision: 'block',
    reason: readiness.summary || 'Task is not ready to close. Resolve its Readiness blockers first.',
  }),
);
`;
