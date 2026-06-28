import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

export interface SyncManualHostAdapterOptions {
  cwd: string;
  dryRun?: boolean;
}

export interface ManualHostAdapterWrite {
  path: string;
  status: 'written' | 'dry-run';
}

export interface SyncManualHostAdapterResult {
  guidePath: string;
  writes: ManualHostAdapterWrite[];
}

const GUIDE_RELATIVE_PATH = '.skopos/tooling/manual-hosts/README.md';

export const syncManualHostAdapter = async ({
  cwd,
  dryRun = false,
}: SyncManualHostAdapterOptions): Promise<SyncManualHostAdapterResult> => {
  const workspaceRoot = resolve(cwd);
  const guidePath = join(workspaceRoot, GUIDE_RELATIVE_PATH);
  const files = [
    {
      path: guidePath,
      contents: renderManualHostGuide(),
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

const renderManualHostGuide = (): string => `# Manual Host Adapter

Use this guide when your coding tool does not have a generated Skopos adapter yet.

This is not full automation. It is the minimum safe workflow-router contract for any agent host, editor macro, terminal wrapper, or local script that wants to stay aligned with Skopos.

## Required Calls

1. Session start:
   - Read \`AGENTS.md\`; it is the canonical operating contract.
   - Run \`skopos program next <project-root> --compact --json\`.
   - Give the returned next action and lane expectation to the agent before it edits code.
2. User message:
   - Run \`skopos discuss append-turn <project-root> --role user --message-stdin --json\`.
   - Pipe only the user's message text into stdin.
3. Assistant message:
   - Run \`skopos discuss append-turn <project-root> --role assistant --message-stdin --json\`.
   - Pipe only the assistant's final useful message into stdin.
4. Important state change:
   - Run \`skopos discuss checkpoint <project-root> --json\` after meaningful decisions, findings, plan changes, or implementation milestones.
5. Before context compaction:
   - Run \`skopos discuss handoff <project-root> --json\`.
   - Use the returned handoff as compact resume context.
6. Before stopping:
   - Run \`skopos program next <project-root> --compact --json\`.
   - If it returns a concrete command, do that command before stopping.
   - If there is no routed next command, run \`skopos done --cwd <project-root> --json\`.

## Stop Rule

Do not let an agent stop only because the chat answer sounds complete.

The agent can stop when one of these is true:

1. \`skopos program next\` says the next action is complete or there is no active routed action.
2. \`skopos done\` passes without blocking mission, trust, question, eval, or policy issues.
3. A human explicitly pauses the work.

## Lane Rule

Keep the happy path light, but make risky work explicit:

1. Light lane: narrow local edit, focused check, memory update only if project truth changed.
2. Normal lane: tracked mission, proportional checks, decisions kept current.
3. Workpack lane: phases, staged proof, durable decisions/findings, memory sync, and explicit closure.

## What To Show Humans

Show short, plain-language status:

1. current mission or queued work item
2. next command to run
3. open questions that need a human answer
4. checks that passed or failed
5. whether the work can safely stop

Avoid dumping raw journals or large JSON into the normal chat unless the user asks for details.

## What This Does Not Cover

This fallback guide does not provide native lifecycle hooks. It is manual-only until the host integrates the calls above into real lifecycle events.
`;
