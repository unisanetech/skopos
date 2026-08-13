import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import type { SkoposHostProjectionModel } from '@skopos/model';

import { normalizeInstructionSourcePath } from '../scaffold-project-instructions/scaffold-project-instructions.service.js';
import { resolveWorkspaceContainedPath } from '../shared/workspace-contained-path.js';

export interface SyncManualHostAdapterOptions {
  cwd: string;
  dryRun?: boolean;
  projectionModel?: SkoposHostProjectionModel;
  instructionSourcePath?: string;
}

export interface ManualHostAdapterWrite {
  path: string;
  status: 'written' | 'dry-run';
}

export interface SyncManualHostAdapterResult {
  guidePath: string;
  writes: ManualHostAdapterWrite[];
}

const GUIDE_RELATIVE_PATH = '.skopos/cache/tooling/manual-hosts/README.md';

export const syncManualHostAdapter = async ({
  cwd,
  dryRun = false,
  projectionModel,
  instructionSourcePath: providedInstructionSourcePath,
}: SyncManualHostAdapterOptions): Promise<SyncManualHostAdapterResult> => {
  const workspaceRoot = resolve(cwd);
  const instructionSourcePath = normalizeInstructionSourcePath(
    providedInstructionSourcePath ?? projectionModel?.instructionSourcePath,
  );
  const guidePath = await resolveWorkspaceContainedPath({
    workspaceRoot,
    path: GUIDE_RELATIVE_PATH,
    label: 'Manual host adapter guide',
  });
  const files = [
    {
      path: guidePath,
      contents: renderManualHostGuide(projectionModel, instructionSourcePath),
    },
  ];
  const writes: ManualHostAdapterWrite[] = [];

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
    guidePath,
    writes,
  };
};

const renderManualHostGuide = (
  projectionModel: SkoposHostProjectionModel | undefined,
  instructionSourcePath: string,
): string => `# Manual Host Adapter

## Projection Source

${
  projectionModel
    ? `- Project model: \`.skopos/index/enforcement.json\`
- Authority: \`${projectionModel.authority}\`
- Enforcement rules: ${projectionModel.enforcementRuleIds.map((ruleId) => `\`${ruleId}\``).join(', ')}`
    : '- Project model: `.skopos/index/enforcement.json` (generated during `skopos setup`).'
}

Use this guide when your coding tool does not have a generated Skopos adapter yet.

This is not full automation. It is the minimum safe Session, Task, Work Queue, and Readiness contract for any agent host, editor macro, terminal wrapper, or local script that wants to stay aligned with Skopos.

## Required Calls

1. Session start:
   - Read \`${instructionSourcePath}\`; it is the canonical operating contract.
   - Run \`skopos session context <project-root> --host <host-id> --json\`.
   - Give the returned current Task, Work Queue recommendation, decision, and response guidance to the agent before it edits code.
2. User message:
   - Run \`skopos discuss append-turn <project-root> --role user --message-stdin --json\`.
   - Pipe only the user's message text into stdin.
3. Assistant message:
   - Run \`skopos discuss append-turn <project-root> --role assistant --message-stdin --json\`.
   - Pipe only the assistant's final useful message into stdin.
4. Important state change:
   - Run \`skopos discuss checkpoint <project-root> --json\` after meaningful decisions, findings, plan changes, or implementation milestones.
5. Fresh-session continuation (only after explicit user intent):
   - Have the originating agent author a bounded classified capsule; do not use a transcript as the capsule.
   - Run \`skopos discuss handoff create <project-root> --task <task-id> --context <capsule.json> --json\`.
   - Review \`skopos discuss handoff show <project-root> --task <task-id> --json\`, then require \`skopos discuss handoff verify <project-root> --task <task-id> --json\` to report \`current\`.
   - Run \`skopos discuss handoff render <project-root> --task <task-id> --json\` and copy the exact prompt into a genuinely fresh host Session.
   - Open the receiving Skopos Session, then run \`skopos discuss handoff accept <project-root> --task <task-id> --actor <id> --receiving-session <id> --host <host-id> --json\` before editing.
   - Rendering is not delivery. If the host cannot prove task creation or injection, report manual copy only.
6. Before context compaction:
   - Refresh an existing semantic handoff with \`skopos discuss handoff refresh <project-root> --task <task-id> --json\`; if none exists, preserve the normal Task checkpoint and ask the agent to author one.
7. Before stopping:
   - Run \`skopos session context <project-root> --host <host-id> --json\`.
   - If it returns a concrete next command, complete that step before stopping.
   - For an active Task, run \`skopos readiness <task-id> <project-root> --for close --actor <id> --json\`.

## Stop Rule

Do not let an agent stop only because the chat answer sounds complete.

The agent can stop when one of these is true:

1. There is no active writing Task and no required next command.
2. The active Task has close Readiness \`ready\`.
3. A human explicitly pauses the work.

## Task Risk Rule

Keep the happy path light, but make risky work explicit:

1. Light: narrow local edit, focused Evidence, Memory update only if project truth changed.
2. Standard: tracked Task, proportional Actions and Guards, decisions kept current.
3. High-impact: detailed Task or child Tasks, staged Evidence, durable decisions/findings, Memory sync, and explicit Readiness.

## What To Show Humans

Show short, plain-language status:

1. current Task or Work Queue item
2. next command to run
3. open questions that need a human answer
4. checks that passed or failed
5. whether Readiness permits the work to continue, integrate, or close

Avoid dumping raw journals or large JSON into the normal chat unless the user asks for details.

## What This Does Not Cover

This fallback guide does not provide native lifecycle hooks. It is manual-only until the host integrates the calls above into real lifecycle events.
It cannot create a Session, inject a prompt, identify or message the origin, detect pre-compaction, or report completion automatically.
`;
