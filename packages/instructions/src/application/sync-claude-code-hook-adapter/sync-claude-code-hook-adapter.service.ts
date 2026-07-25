import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import type { SkoposHostProjectionModel } from '@skopos/model';

export interface SyncClaudeCodeHookAdapterOptions {
  cwd: string;
  dryRun?: boolean;
  projectionModel?: SkoposHostProjectionModel;
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

const SETTINGS_RELATIVE_PATH = '.skopos/tooling/claude-code/settings.json';
const SESSION_START_HOOK_RELATIVE_PATH = '.skopos/tooling/claude-code/hooks/session-start-hook.mjs';
const USER_PROMPT_SUBMIT_HOOK_RELATIVE_PATH =
  '.skopos/tooling/claude-code/hooks/user-prompt-submit-hook.mjs';
const POST_EDIT_HOOK_RELATIVE_PATH = '.skopos/tooling/claude-code/hooks/post-edit-hook.mjs';
const PRE_COMPACT_HOOK_RELATIVE_PATH = '.skopos/tooling/claude-code/hooks/pre-compact-hook.mjs';
const STOP_HOOK_RELATIVE_PATH = '.skopos/tooling/claude-code/hooks/stop-hook.mjs';

export const syncClaudeCodeHookAdapter = async ({
  cwd,
  dryRun = false,
  projectionModel,
}: SyncClaudeCodeHookAdapterOptions): Promise<SyncClaudeCodeHookAdapterResult> => {
  const workspaceRoot = resolve(cwd);
  const files = [
    {
      path: join(workspaceRoot, SETTINGS_RELATIVE_PATH),
      contents: renderClaudeCodeSettings(projectionModel),
    },
    {
      path: join(workspaceRoot, SESSION_START_HOOK_RELATIVE_PATH),
      contents: renderSessionStartHookScript(),
    },
    {
      path: join(workspaceRoot, USER_PROMPT_SUBMIT_HOOK_RELATIVE_PATH),
      contents: renderUserPromptSubmitHookScript(),
    },
    {
      path: join(workspaceRoot, POST_EDIT_HOOK_RELATIVE_PATH),
      contents: renderPostEditHookScript(),
    },
    {
      path: join(workspaceRoot, PRE_COMPACT_HOOK_RELATIVE_PATH),
      contents: renderPreCompactHookScript(),
    },
    {
      path: join(workspaceRoot, STOP_HOOK_RELATIVE_PATH),
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
    settingsPath: join(workspaceRoot, SETTINGS_RELATIVE_PATH),
    hookPaths: [
      join(workspaceRoot, SESSION_START_HOOK_RELATIVE_PATH),
      join(workspaceRoot, USER_PROMPT_SUBMIT_HOOK_RELATIVE_PATH),
      join(workspaceRoot, POST_EDIT_HOOK_RELATIVE_PATH),
      join(workspaceRoot, PRE_COMPACT_HOOK_RELATIVE_PATH),
      join(workspaceRoot, STOP_HOOK_RELATIVE_PATH),
    ],
    writes,
  };
};

const renderClaudeCodeSettings = (projectionModel?: SkoposHostProjectionModel): string =>
  `${JSON.stringify(
    {
      skoposProjection: projectionModel
        ? {
            schemaVersion: projectionModel.schemaVersion,
            authority: projectionModel.authority,
            projectModelPath: '.skopos/enforcement.json',
            enforcementRuleIds:
              projectionModel.hosts.find((host) => host.hostId === 'claude-code')
                ?.enforcementRuleIds ?? [],
          }
        : undefined,
      hooks: {
        SessionStart: [
          {
            hooks: [
              {
                type: 'command',
                command:
                  'node "$CLAUDE_PROJECT_DIR/.skopos/tooling/claude-code/hooks/session-start-hook.mjs"',
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
                  'node "$CLAUDE_PROJECT_DIR/.skopos/tooling/claude-code/hooks/user-prompt-submit-hook.mjs"',
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
                  'node "$CLAUDE_PROJECT_DIR/.skopos/tooling/claude-code/hooks/post-edit-hook.mjs"',
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
                  'node "$CLAUDE_PROJECT_DIR/.skopos/tooling/claude-code/hooks/pre-compact-hook.mjs"',
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
                  'node "$CLAUDE_PROJECT_DIR/.skopos/tooling/claude-code/hooks/stop-hook.mjs"',
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

const buildWorkflowContext = (programReport) => {
  if (!programReport || typeof programReport !== 'object') {
    return '';
  }

  const summary =
    typeof programReport.summary === 'string' ? programReport.summary.trim() : '';
  const nextCommand =
    typeof programReport.nextCommand === 'string' ? programReport.nextCommand.trim() : '';
  const recommendedCommand =
    typeof programReport.recommendedAction?.command === 'string'
      ? programReport.recommendedAction.command.trim()
      : '';
  const command = recommendedCommand || nextCommand;
  const lines = ['Skopos workflow router:'];

  if (summary.length > 0) {
    lines.push(summary);
  }

  if (command.length > 0) {
    lines.push(\`Next command: \${command}\`);
  }

  return lines.length > 1 ? lines.join('\\n') : '';
};

const combineAdditionalContext = (discussionReport, programReport) =>
  [
    typeof discussionReport?.additionalContext === 'string'
      ? discussionReport.additionalContext.trim()
      : '',
    buildWorkflowContext(programReport),
  ]
    .filter((entry) => entry.length > 0)
    .join('\\n\\n');
`;

const renderSessionStartHookScript = (): string => `#!/usr/bin/env node
${renderSharedRunner()}

const input = await readInput();
const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const discussionResult = runSkopos(projectDir, ['discuss', 'recent', projectDir, '--json']);
const programResult = runSkopos(projectDir, ['program', 'next', projectDir, '--json']);

if (discussionResult.status !== 0 && programResult.status !== 0) {
  process.exit(0);
}

const discussionReport = parseJsonOutput(discussionResult);
const programReport = parseJsonOutput(programResult);
const additionalContext = combineAdditionalContext(discussionReport, programReport);

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

const renderPostEditHookScript = (): string => `#!/usr/bin/env node
${renderSharedRunner()}

const input = await readInput();
const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const filePath = typeof input.tool_input?.file_path === 'string' ? input.tool_input.file_path : '';

if (!filePath.endsWith('/AGENTS.md') && filePath !== 'AGENTS.md') {
  process.exit(0);
}

const result = runSkopos(projectDir, ['instructions', 'sync', projectDir, '--json']);

if (result.status !== 0) {
  process.stderr.write(result.stderr || 'Skopos failed to sync instruction mirrors after AGENTS.md changed.\\n');
  process.exit(1);
}
`;

const renderPreCompactHookScript = (): string => `#!/usr/bin/env node
${renderSharedRunner()}

const input = await readInput();
const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();

runSkopos(projectDir, ['discuss', 'handoff', projectDir, '--json']);
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
const programResult = runSkopos(projectDir, ['program', 'next', projectDir, '--json']);
const programReport = parseJsonOutput(programResult);
const recommendedCommand =
  typeof programReport.recommendedAction?.command === 'string'
    ? programReport.recommendedAction.command.trim()
    : '';

if (recommendedCommand.length > 0) {
  const reason = [
    typeof programReport.recommendedAction?.summary === 'string'
      ? programReport.recommendedAction.summary
      : typeof programReport.summary === 'string'
        ? programReport.summary
        : 'Skopos requires the next workflow router step before stopping.',
    \`Run \\\`\${recommendedCommand}\\\` before stopping.\`,
  ].join(' ');

  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason,
    }),
  );
  process.exit(0);
}

const result = runSkopos(projectDir, ['done', '--cwd', projectDir, '--json']);

if (result.status !== 0) {
  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason: 'Skopos stop enforcement could not verify closure. Run \`skopos done --cwd <project-root>\` manually.',
    }),
  );
  process.exit(0);
}

let report;
try {
  report = JSON.parse(result.stdout || '{}');
} catch {
  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason: 'Skopos stop enforcement received invalid closure output. Run \`skopos done --cwd <project-root>\` manually.',
    }),
  );
  process.exit(0);
}

if (report.closureStatus === 'complete') {
  process.exit(0);
}

const actions = Array.isArray(report.requiredActions) ? report.requiredActions.slice(0, 3).join(' | ') : '';
const reason = [report.summary || 'Skopos closure is not complete.', actions].filter(Boolean).join(' ');

process.stdout.write(
  JSON.stringify({
    decision: 'block',
    reason,
  }),
);
`;
