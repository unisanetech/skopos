import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import type { SkoposHostProjectionModel } from '@skopos/model';

import { buildHostActorBinding } from '../host-actor-binding/host-actor-binding.js';

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

const MANIFEST_RELATIVE_PATH = '.skopos/cache/tooling/codex/adapter-manifest.json';
const ENTRYPOINT_RELATIVE_PATH = '.skopos/cache/tooling/codex/codex-discussion-adapter.mjs';
const README_RELATIVE_PATH = '.skopos/cache/tooling/codex/README.md';

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
      actorBinding: buildHostActorBinding(),
      projectModel: projectionModel
        ? {
            path: '.skopos/index/enforcement.json',
            authority: projectionModel.authority,
            enforcementRuleIds:
              projectionModel.hosts.find((host) => host.hostId === 'codex')
                ?.enforcementRuleIds ?? [],
            freshContinuation:
              projectionModel.hosts.find((host) => host.hostId === 'codex')
                ?.freshContinuation,
          }
        : undefined,
      entrypoint: ENTRYPOINT_RELATIVE_PATH,
      events: {
        sessionStart: {
          command: `node ${ENTRYPOINT_RELATIVE_PATH} session-start`,
          output:
            'JSON with compact Session, Task, Work Queue, and decision context.',
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
          output: 'JSON from `skopos discuss handoff refresh --json`; failure means no reviewed semantic capsule exists yet.',
        },
        continuationReview: {
          command: `node ${ENTRYPOINT_RELATIVE_PATH} continuation-review`,
          output: 'Verified host-neutral continuation prompt; this does not create or deliver a Codex task.',
        },
        stop: {
          command: `node ${ENTRYPOINT_RELATIVE_PATH} stop`,
          output:
            'JSON decision based on the current Task and close Readiness.',
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

`;

const renderCodexEntrypoint = (): string => `#!/usr/bin/env node
${renderSharedRunner()}

const eventName = process.argv[2];
const { raw, payload } = await readInput();
const projectDir = resolveProjectDir(payload);
const messageInput = typeof payload.message === 'string' ? payload.message : raw;

const exactTaskId = () => {
  const contextResult = runSkopos(projectDir, ['session', 'context', projectDir, '--host', 'codex', '--json']);
  const context = parseJsonOutput(contextResult);
  if (contextResult.status !== 0 || typeof context.currentTaskId !== 'string') {
    process.stderr.write(contextResult.stderr || 'Skopos could not resolve one exact current Task for continuation.\\n');
    process.exit(1);
  }
  return context.currentTaskId;
};

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
    const contextArgs = ['session', 'context', projectDir, '--host', 'codex', '--json'];
    if (typeof payload.sessionId === 'string' && payload.sessionId.trim().length > 0) {
      contextArgs.push('--session-id', payload.sessionId.trim());
    }
    result = runSkopos(projectDir, contextArgs);
    break;
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
    result = runSkopos(projectDir, ['discuss', 'handoff', 'refresh', projectDir, '--task', exactTaskId(), '--json']);
    break;
  case 'continuation-review': {
    const taskId = exactTaskId();
    const verification = runSkopos(projectDir, ['discuss', 'handoff', 'verify', projectDir, '--task', taskId, '--json']);
    const verified = parseJsonOutput(verification);
    if (verification.status !== 0 || verified.handoff?.validation?.freshness !== 'current') {
      process.stdout.write(JSON.stringify({ result: 'fail', stage: 'verify', verification: verified }));
      process.exit(1);
    }
    result = runSkopos(projectDir, ['discuss', 'handoff', 'render', projectDir, '--task', taskId, '--json']);
    break;
  }
  case 'stop': {
    if (typeof payload.message === 'string' && payload.message.trim().length > 0) {
      runSkopos(projectDir, buildTurnArgs('assistant', 'stop'), { input: payload.message });
    }

    runSkopos(projectDir, ['discuss', 'checkpoint', projectDir, '--json']);
    const contextResult = runSkopos(projectDir, ['session', 'context', projectDir, '--host', 'codex', '--json']);
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
          context,
        }),
      );
      process.exit(0);
    }

    if (typeof context.currentTaskId !== 'string' || context.currentTaskId.length === 0) {
      process.stdout.write(
        JSON.stringify({
          decision: 'allow',
          context,
        }),
      );
      process.exit(0);
    }

    const readinessArgs = ['readiness', context.currentTaskId, projectDir, '--for', 'close', '--json'];
    pushOptionalFlag(readinessArgs, '--actor', process.env.SKOPOS_ACTOR);
    const readinessResult = runSkopos(projectDir, readinessArgs);
    const readiness = parseJsonOutput(readinessResult);
    const allow = readinessResult.status === 0 && readiness.readiness === 'ready';

    process.stdout.write(
      JSON.stringify({
        decision: allow ? 'allow' : 'block',
        reason: allow
          ? readiness.summary
          : readiness.summary || 'Task is not ready to close. Resolve its Readiness blockers first.',
        readiness,
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

This wrapper-mediated adapter keeps Codex on the same Task, Session, and discussion-memory contract as Claude Code. The wrapper should treat \`AGENTS.md\` plus \`.skopos/agent/communication-brief.json\` as the default agent operating contract.

## Actor binding

Before launching this adapter, set \`SKOPOS_ACTOR\` to the dedicated claimant actor id used to start or claim the Task. Skopos requires that binding for Task-specific routing and mutation; without it, routing intentionally stays at the Project Work Queue or fails closed.

\`sessionId\` identifies both discussion continuity and local coordination Session
identity. \`threadId\` remains discussion metadata. The wrapper must not use either
value as an actor id, and this adapter has no actor fallback. Keep the claimant actor
binding explicit in the host environment and pass the stable host Session id in every
session lifecycle payload.

Use the generated entrypoint at \`${ENTRYPOINT_RELATIVE_PATH}\` from an external Codex wrapper or host integration. Event mapping:

- \`session-start\` -> open or heartbeat the coordination Session and inject the shared \`skopos session context --json\` response and decision contract
- \`user-turn\` -> \`skopos discuss append-turn --role user --message-stdin --json\`
- \`assistant-turn\` -> \`skopos discuss append-turn --role assistant --message-stdin --json\`
- \`major-state-change\` -> \`skopos discuss checkpoint --json\`
- \`pre-compact\` -> refresh an already agent-authored handoff; it cannot synthesize semantic conversation judgment from a raw transcript
- \`continuation-review\` -> verify freshness and render one reviewed host-neutral prompt
- \`stop\` -> load \`skopos session context --json\`, then assess the current Task with \`skopos readiness <task-id> --for close --json\`

The wrapper should read JSON from \`session-start\` and use the returned \`additionalContext\` field as compact resume context. The agent should follow the Task risk and detail selected by Skopos and should not claim completion until close Readiness is ready. Do not replay raw discussion journals into the prompt.

Fresh Codex task creation, initial-prompt injection, origin identification and messaging, and completion reporting require the Codex host task API. The wrapper reports those host capabilities but does not pretend that rendering a prompt delivered it. After explicit user intent, the host must verify and render, create the fresh task in the same project directory, inject the exact prompt, accept the handoff for the receiving Session, and record the real host outcome. If any host call fails, report that stage as failed and retain the reviewed manual-copy prompt.
`;
