import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import type { SkoposHostProjectionModel } from '@skopos/model';

export interface SyncCodexWrapperAdapterOptions {
  cwd: string;
  dryRun?: boolean;
  projectionModel?: SkoposHostProjectionModel;
}

export interface CodexWrapperAdapterWrite {
  path: string;
  status: 'written' | 'dry-run';
}

export interface SyncCodexWrapperAdapterResult {
  manifestPath: string;
  entrypointPath: string;
  writes: CodexWrapperAdapterWrite[];
}

const MANIFEST_RELATIVE_PATH = '.skopos/tooling/codex/adapter-manifest.json';
const ENTRYPOINT_RELATIVE_PATH = '.skopos/tooling/codex/codex-discussion-adapter.mjs';
const README_RELATIVE_PATH = '.skopos/tooling/codex/README.md';

export const syncCodexWrapperAdapter = async ({
  cwd,
  dryRun = false,
  projectionModel,
}: SyncCodexWrapperAdapterOptions): Promise<SyncCodexWrapperAdapterResult> => {
  const workspaceRoot = resolve(cwd);
  const manifestPath = join(workspaceRoot, MANIFEST_RELATIVE_PATH);
  const entrypointPath = join(workspaceRoot, ENTRYPOINT_RELATIVE_PATH);
  const readmePath = join(workspaceRoot, README_RELATIVE_PATH);
  const files = [
    {
      path: manifestPath,
      contents: renderCodexManifest(projectionModel),
    },
    {
      path: entrypointPath,
      contents: renderCodexEntrypoint(),
    },
    {
      path: readmePath,
      contents: renderCodexReadme(),
    },
  ];
  const writes: CodexWrapperAdapterWrite[] = [];

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
    manifestPath,
    entrypointPath,
    writes,
  };
};

const renderCodexManifest = (projectionModel?: SkoposHostProjectionModel): string =>
  `${JSON.stringify(
    {
      schemaVersion: 1,
      toolId: 'codex',
      adapterKind: 'wrapper-manifest',
      supportTier: 'wrapper-mediated',
      summary:
        'Wrapper-mediated discussion-memory adapter for Codex hosts using the shared skopos discuss runtime.',
      projectModel: projectionModel
        ? {
            path: '.skopos/enforcement.json',
            authority: projectionModel.authority,
            enforcementRuleIds:
              projectionModel.hosts.find((host) => host.hostId === 'codex')
                ?.enforcementRuleIds ?? [],
          }
        : undefined,
      entrypoint: ENTRYPOINT_RELATIVE_PATH,
      events: {
        sessionStart: {
          command: `node ${ENTRYPOINT_RELATIVE_PATH} session-start`,
          output:
            'JSON with compact resume context plus the current `skopos program next --json` workflow recommendation.',
        },
        userTurn: {
          command: `node ${ENTRYPOINT_RELATIVE_PATH} user-turn`,
          stdin: 'Raw user message text.',
        },
        assistantTurn: {
          command: `node ${ENTRYPOINT_RELATIVE_PATH} assistant-turn`,
          stdin: 'Raw assistant message text.',
        },
        majorStateChange: {
          command: `node ${ENTRYPOINT_RELATIVE_PATH} major-state-change`,
        },
        preCompact: {
          command: `node ${ENTRYPOINT_RELATIVE_PATH} pre-compact`,
          output: 'JSON from `skopos discuss handoff --json`.',
        },
        stop: {
          command: `node ${ENTRYPOINT_RELATIVE_PATH} stop`,
          output:
            'JSON decision that blocks on the current workflow-router command before falling back to `skopos done --json`.',
        },
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

  const raw = Buffer.concat(chunks).toString('utf8');
  let payload = {};
  if (raw.trim().length > 0) {
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = { message: raw };
    }
  }

  return { raw, payload };
};

const resolveProjectDir = (payload) =>
  process.env.CODEX_PROJECT_DIR || payload.cwd || payload.projectDir || process.cwd();

const pushOptionalFlag = (args, flag, value) => {
  if (typeof value === 'string' && value.trim().length > 0) {
    args.push(flag, value.trim());
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

const buildStopReason = (programReport, fallbackSummary) => {
  const recommendedSummary =
    typeof programReport?.recommendedAction?.summary === 'string'
      ? programReport.recommendedAction.summary
      : '';
  const summary =
    recommendedSummary ||
    (typeof programReport?.summary === 'string' ? programReport.summary.trim() : '') ||
    fallbackSummary;
  const recommendedCommand =
    typeof programReport?.recommendedAction?.command === 'string'
      ? programReport.recommendedAction.command.trim()
      : '';
  const nextCommand =
    typeof programReport?.nextCommand === 'string' ? programReport.nextCommand.trim() : '';
  const command = recommendedCommand || nextCommand;

  return [summary, command.length > 0 ? \`Run \\\`\${command}\\\` before stopping.\` : '']
    .filter((entry) => entry.length > 0)
    .join(' ');
};
`;

const renderCodexEntrypoint = (): string => `#!/usr/bin/env node
${renderSharedRunner()}

const eventName = process.argv[2];
const { raw, payload } = await readInput();
const projectDir = resolveProjectDir(payload);
const messageInput = typeof payload.message === 'string' ? payload.message : raw;

const buildTurnArgs = (role, sourceEvent) => {
  const args = [
    'discuss',
    'append-turn',
    projectDir,
    '--role',
    role,
    '--source-event',
    sourceEvent,
    '--message-stdin',
    '--json',
  ];

  pushOptionalFlag(args, '--thread', payload.threadId);
  pushOptionalFlag(args, '--session-id', payload.sessionId);
  pushOptionalFlag(args, '--transcript-path', payload.transcriptPath);

  return args;
};

let result;

switch (eventName) {
  case 'session-start': {
    const discussionResult = runSkopos(projectDir, ['discuss', 'recent', projectDir, '--json']);
    const programResult = runSkopos(projectDir, ['program', 'next', projectDir, '--json']);
    const discussionReport = parseJsonOutput(discussionResult);
    const programReport = parseJsonOutput(programResult);

    process.stdout.write(
      JSON.stringify({
        ...discussionReport,
        program: programReport,
        additionalContext: combineAdditionalContext(discussionReport, programReport),
      }),
    );
    process.exit(0);
  }
  case 'user-turn':
    result = runSkopos(projectDir, buildTurnArgs('user', 'user-prompt-submit'), { input: messageInput });
    break;
  case 'assistant-turn':
    result = runSkopos(projectDir, buildTurnArgs('assistant', 'assistant-turn'), { input: messageInput });
    break;
  case 'major-state-change':
    result = runSkopos(projectDir, ['discuss', 'checkpoint', projectDir, '--json']);
    break;
  case 'pre-compact':
    result = runSkopos(projectDir, ['discuss', 'handoff', projectDir, '--json']);
    break;
  case 'stop': {
    if (typeof payload.message === 'string' && payload.message.trim().length > 0) {
      runSkopos(projectDir, buildTurnArgs('assistant', 'stop'), { input: payload.message });
    }

    runSkopos(projectDir, ['discuss', 'checkpoint', projectDir, '--json']);
    const programResult = runSkopos(projectDir, ['program', 'next', projectDir, '--json']);
    const programReport = parseJsonOutput(programResult);
    const recommendedCommand =
      typeof programReport.recommendedAction?.command === 'string'
        ? programReport.recommendedAction.command.trim()
        : '';
    const nextCommand =
      typeof programReport.nextCommand === 'string' ? programReport.nextCommand.trim() : '';

    if (recommendedCommand.length > 0 || nextCommand.length > 0) {
      process.stdout.write(
        JSON.stringify({
          decision: 'block',
          reason: buildStopReason(
            programReport,
            'Skopos requires the next workflow router step before stopping.',
          ),
          program: programReport,
        }),
      );
      process.exit(0);
    }

    const doneResult = runSkopos(projectDir, ['done', '--cwd', projectDir, '--json']);

    if (doneResult.status !== 0) {
      process.stdout.write(
        JSON.stringify({
          decision: 'block',
          reason:
            'Skopos stop enforcement could not verify closure. Run \`skopos done --cwd <project-root>\` manually.',
        }),
      );
      process.exit(0);
    }

    const doneReport = parseJsonOutput(doneResult);
    if (doneReport?.closureStatus === 'complete') {
      process.stdout.write(
        JSON.stringify({
          decision: 'allow',
          done: doneReport,
        }),
      );
      process.exit(0);
    }

    const actions = Array.isArray(doneReport?.requiredActions)
      ? doneReport.requiredActions.slice(0, 3).join(' | ')
      : '';
    const reason = [
      typeof doneReport?.summary === 'string'
        ? doneReport.summary
        : 'Skopos closure is not complete.',
      actions,
    ]
      .filter((entry) => entry.length > 0)
      .join(' ');

    process.stdout.write(
      JSON.stringify({
        decision: 'block',
        reason,
        done: doneReport,
      }),
    );
    process.exit(0);
  }
  default:
    console.error(\`Unsupported Codex adapter event: \${eventName ?? '(missing)'}\`);
    process.exit(1);
}

if (typeof result.stdout === 'string' && result.stdout.length > 0) {
  process.stdout.write(result.stdout);
}

if (typeof result.stderr === 'string' && result.stderr.length > 0) {
  process.stderr.write(result.stderr);
}

process.exit(result.status ?? 0);
`;

const renderCodexReadme = (): string => `# Codex Discussion Adapter

This wrapper-mediated adapter keeps Codex on the same discussion-memory lane as Claude Code while also surfacing the current workflow-router recommendation on session start. The wrapper should treat \`AGENTS.md\` plus \`.skopos/agent/communication-brief.json\` as the default agent operating contract.

Use the generated entrypoint at \`${ENTRYPOINT_RELATIVE_PATH}\` from an external Codex wrapper or host integration. Event mapping:

- \`session-start\` -> merge \`skopos discuss recent --json\` with \`skopos program next --json\`
- \`user-turn\` -> \`skopos discuss append-turn --role user --message-stdin --json\`
- \`assistant-turn\` -> \`skopos discuss append-turn --role assistant --message-stdin --json\`
- \`major-state-change\` -> \`skopos discuss checkpoint --json\`
- \`pre-compact\` -> \`skopos discuss handoff --json\`
- \`stop\` -> consult \`skopos program next --json\` first, then fall back to \`skopos done --json\`

The wrapper should read JSON from \`session-start\` and use the returned \`additionalContext\` field as compact resume context plus workflow guidance. The agent should choose light, normal, or workpack lane before editing and should not claim complete until \`skopos done\` or the routed next step allows closure. Do not replay raw discussion journals into the prompt.
`;
