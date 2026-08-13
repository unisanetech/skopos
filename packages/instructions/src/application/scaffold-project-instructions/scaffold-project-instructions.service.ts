import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join, normalize, resolve } from 'node:path';

import type {
  SkoposCommandMap,
  SkoposInitMode,
  SkoposProjectArchetype,
  SkoposRepoMode,
} from '@skopos/model';

import { renderSkoposCommunicationContractLines } from '../communication-contract/communication-contract.js';

export type SkoposInstructionScaffoldWriteStatus =
  | 'written'
  | 'overwritten'
  | 'updated-contract'
  | 'skipped-existing'
  | 'dry-run';

export interface ScaffoldProjectInstructionsOptions {
  cwd: string;
  instructionSourcePath?: string;
  mode?: SkoposInitMode;
  projectName?: string;
  repoMode?: SkoposRepoMode;
  archetype?: SkoposProjectArchetype;
  docsRoot?: string;
  docsStartHerePath?: string;
  commands?: SkoposCommandMap;
  dryRun?: boolean;
  force?: boolean;
}

export interface ScaffoldProjectInstructionsResult {
  path: string;
  relativePath: string;
  status: SkoposInstructionScaffoldWriteStatus;
  mode: SkoposInitMode;
  projectName: string;
  templateVersion: 1;
  sections: string[];
}

export const scaffoldProjectInstructions = async ({
  cwd,
  instructionSourcePath = 'AGENTS.md',
  mode = 'existing',
  projectName,
  repoMode = 'single',
  archetype = 'custom',
  docsRoot = 'docs',
  docsStartHerePath,
  commands = {},
  dryRun = false,
  force = false,
}: ScaffoldProjectInstructionsOptions): Promise<ScaffoldProjectInstructionsResult> => {
  const workspaceRoot = resolve(cwd);
  const relativePath = normalizeRelativePath(instructionSourcePath);
  const targetPath = join(workspaceRoot, relativePath);
  const resolvedProjectName = projectName?.trim() || basename(workspaceRoot) || 'project';
  const resolvedStartHerePath = docsStartHerePath ?? `${docsRoot}/00-start-here.md`;
  const exists = await fileExists(targetPath);

  if (exists && !force) {
    const existingContents = await readTextIfExists(targetPath);
    const nextContents = upsertSkoposOperatingContract(existingContents, {
      projectName: resolvedProjectName,
      docsRoot,
      docsStartHerePath: resolvedStartHerePath,
      commands,
    });

    if (nextContents !== existingContents) {
      if (!dryRun) {
        await writeFile(targetPath, nextContents, 'utf8');
      }

      return {
        path: targetPath,
        relativePath,
        status: dryRun ? 'dry-run' : 'updated-contract',
        mode,
        projectName: resolvedProjectName,
        templateVersion: 1,
        sections: [...SCAFFOLD_SECTIONS],
      };
    }

    return {
      path: targetPath,
      relativePath,
      status: 'skipped-existing',
      mode,
      projectName: resolvedProjectName,
      templateVersion: 1,
      sections: [...SCAFFOLD_SECTIONS],
    };
  }

  const contents = renderProjectInstructions({
    projectName: resolvedProjectName,
    mode,
    repoMode,
    archetype,
    docsRoot,
    docsStartHerePath: resolvedStartHerePath,
    commands,
  });

  if (!dryRun) {
    await mkdir(dirname(targetPath), { recursive: true });
    await writeFile(targetPath, contents, 'utf8');
  }

  return {
    path: targetPath,
    relativePath,
    status: dryRun ? 'dry-run' : exists ? 'overwritten' : 'written',
    mode,
    projectName: resolvedProjectName,
    templateVersion: 1,
    sections: [...SCAFFOLD_SECTIONS],
  };
};

interface RenderProjectInstructionsOptions {
  projectName: string;
  mode: SkoposInitMode;
  repoMode: SkoposRepoMode;
  archetype: SkoposProjectArchetype;
  docsRoot: string;
  docsStartHerePath: string;
  commands: SkoposCommandMap;
}

export const renderProjectInstructions = ({
  projectName,
  mode,
  repoMode,
  archetype,
  docsRoot,
  docsStartHerePath,
  commands,
}: RenderProjectInstructionsOptions): string => {
  const commandRows = renderCommandRows(commands);
  const modePolicy = mode === 'greenfield' ? renderGreenfieldPriority() : renderBrownfieldPriority();
  const repoPolicy = repoMode === 'monorepo' ? renderMonorepoPolicy() : renderSingleProjectPolicy();

  return [
    `# AGENTS.md instructions for ${projectName}`,
    '',
    'This is the canonical instruction source for coding agents working in this project. Keep it short enough to read at session start, but specific enough that an agent can work without inventing local rules.',
    '',
    '## Project Snapshot',
    '',
    `- Project: ${projectName}`,
    `- Skopos mode: ${mode}`,
    `- Repo mode: ${repoMode}`,
    `- Archetype: ${archetype}`,
    `- Docs root: ${docsRoot}`,
    `- Start-here doc: ${docsStartHerePath}`,
    '- Canonical instruction source: `AGENTS.md`',
    '',
    '## First Read Order',
    '',
    '1. Read this file before changing code.',
    '2. Run or inspect `skopos session context . --json` before broad scanning. If project setup is missing or stale, run `skopos setup .` first.',
    `3. Read \`${docsStartHerePath}\` if it exists; otherwise inspect \`${docsRoot}/\` and the package README files relevant to the task.`,
    '4. Use Skopos compact state before broad scanning when available: `.skopos/index/bootstrap.json`, `.skopos/index/scopes.json`, `.skopos/index/architecture.json`, and `.skopos/index/memory.json`.',
    '5. Read the files you will edit and search usages of changed symbols before editing.',
    "6. Prefer the project's existing patterns, boundaries, naming, and command surface over new conventions.",
    '',
    '## Project Context To Fill In',
    '',
    '- Product purpose: TODO',
    '- Primary users: TODO',
    '- Critical workflows: TODO',
    '- Runtime/deployment target: TODO',
    '- Data stores and external services: TODO',
    '- Owners or code areas that require extra care: TODO',
    '',
    '## Operating Policy',
    '',
    modePolicy,
    '',
    repoPolicy,
    '',
    renderSkoposOperatingContract({
      projectName,
      docsRoot,
      docsStartHerePath,
      commands,
      includeMarkers: false,
    }),
    '',
    '## Agent Workflow',
    '',
    '1. Clarify scope from the user request and current repo state. If the task is ambiguous but low risk, make a conservative assumption and state it in the final response.',
    '2. Use `rg`/fast search first, then read the smallest useful set of source files and docs.',
    '3. Before editing, identify the command lane that proves the change: typecheck, tests, lint, build, docs checks, migrations, or a narrower package command.',
    '4. Keep edits focused. Do not mix unrelated refactors, formatting churn, dependency upgrades, or generated-output noise into the same change.',
    '5. Preserve user changes in the worktree. Do not revert files you did not intentionally modify.',
    '6. After editing, run the narrowest reliable verification first, then broader checks when the blast radius justifies it.',
    '7. In the final response, report what changed, what was verified, and any remaining risk or skipped checks.',
    '',
    '## Command Surface',
    '',
    commandRows,
    '',
    'Use these commands as the default validation lanes. If a command is missing or too broad, add or document a narrower package-level command before relying on ad hoc shell snippets.',
    '',
    '## Architecture And Boundary Rules',
    '',
    '1. Keep business/domain logic separate from transport, persistence, UI, and external-provider glue unless the existing project architecture says otherwise.',
    '2. Do not introduce a second routing, dependency-injection, state-management, or configuration pattern when one already exists.',
    '3. Put project-specific adapters at the edge. Keep reusable core code free of vendor, environment, and deployment assumptions.',
    '4. Treat public APIs, CLIs, database schemas, and persisted event/data contracts as compatibility boundaries. Coordinate breaking changes explicitly.',
    '5. Prefer typed contracts and runtime validation at boundaries over unstructured objects crossing layers.',
    '',
    '## Docs And Generated Artifacts',
    '',
    '1. Do not hand-edit generated outputs. Change the source or generator, then regenerate with the owning command.',
    '2. Keep docs concise, current, and linked from the start-here doc when they become durable project knowledge.',
    '3. If a task changes architecture, commands, routing, data contracts, security posture, or deployment behavior, update the relevant docs in the same workstream.',
    '4. Keep temporary planning notes out of the default read path unless they are actively driving current work.',
    '',
    '## Security And Privacy',
    '',
    '1. Never paste secrets into code, docs, commits, issues, logs, or chat. Use `<REDACTED>` or `<SECRET>` placeholders.',
    '2. Treat exposed secrets as compromised: rotate them and remove leaked values from repo and workflow surfaces.',
    '3. Keep local-only/private project context out of generated public artifacts unless explicitly approved.',
    '4. Review auth, permissions, file access, network calls, and data retention when touching security-sensitive paths.',
    '',
    '## Git And Worktree Safety',
    '',
    '1. Inspect `git status` before large edits. Assume unrelated dirty files belong to the user.',
    '2. Do not run destructive git commands such as `reset --hard`, checkout-overwrites, or broad cleanups unless the user explicitly asks.',
    '3. Keep commits reviewable: one purpose, clear message, no secret values, no unrelated generated churn.',
    '',
    '## Skopos Operating Model',
    '',
    '1. Set up or refresh the project operating layer with `skopos setup .`.',
    '2. Use `skopos session context . --json` as the default session-start command.',
    '3. Inspect `skopos work next . --json` when choosing unclaimed work.',
    '4. Start substantial work with `skopos start "<goal>" . --accept "<criterion>" --own <path> --actor <id>` so Task intent, ownership, acceptance, and questions are durable.',
    '5. Keep the default `task-closure` proof subject for bounded work. Use `--proof-subject project-integration` only for an explicit integration or release baseline; it requires an owned path and does not absorb unrelated dirty-worktree changes.',
    '6. Use the Task returned by Session context. Inspect its bounded projection with `skopos task show <task-id> . --json`; add `--full` only when the complete portable state is required.',
    '7. Use `skopos instructions sync .` after changing `AGENTS.md` so mirrors and tool adapters stay aligned.',
    '8. After required Evidence exists, run `skopos finish <task-id> . --actor <id>` before claiming completion. It verifies, advances, archives, and rechecks final Readiness in one operation.',
    '',
  ].join('\n');
};

const SCAFFOLD_SECTIONS = [
  'project-snapshot',
  'first-read-order',
  'project-context',
  'operating-policy',
  'agent-workflow',
  'command-surface',
  'architecture-boundaries',
  'docs-generated-artifacts',
  'security-privacy',
  'git-worktree-safety',
  'skopos-workflow',
] as const;

const SKOPOS_CONTRACT_START = '<!-- skopos-operating-contract:start -->';
const SKOPOS_CONTRACT_END = '<!-- skopos-operating-contract:end -->';

const upsertSkoposOperatingContract = (
  contents: string,
  options: {
    projectName: string;
    docsRoot: string;
    docsStartHerePath: string;
    commands: SkoposCommandMap;
  },
): string => {
  const contract = renderSkoposOperatingContract({
    ...options,
    includeMarkers: true,
  });
  const startIndex = contents.indexOf(SKOPOS_CONTRACT_START);
  const endIndex = contents.indexOf(SKOPOS_CONTRACT_END);

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    const afterEnd = endIndex + SKOPOS_CONTRACT_END.length;
    return `${contents.slice(0, startIndex).trimEnd()}\n\n${contract}\n\n${contents.slice(afterEnd).trimStart()}`;
  }

  if (contents.includes('## Default Skopos Operating Contract')) {
    return contents;
  }

  return `${contents.trimEnd()}\n\n${contract}\n`;
};

const renderSkoposOperatingContract = ({
  projectName: _projectName,
  docsRoot,
  docsStartHerePath,
  commands,
  includeMarkers,
}: {
  projectName: string;
  docsRoot: string;
  docsStartHerePath: string;
  commands: SkoposCommandMap;
  includeMarkers: boolean;
}): string => {
  const lines = [
    includeMarkers ? SKOPOS_CONTRACT_START : '',
    '## Default Skopos Operating Contract',
    '',
    'When Skopos is installed, agents should treat it as the default operating memory layer for project Memory, planning, coordination, Evidence, and Readiness.',
    '',
    '### Session Start',
    '',
    '1. Read `AGENTS.md` first.',
    '2. Run or inspect `skopos session context . --json` before broad scanning or implementation.',
    '3. If Skopos state is missing or stale, run `skopos setup .` and then re-check `skopos session context`.',
    `4. Use \`${docsStartHerePath}\` as the human docs router when it exists; otherwise inspect \`${docsRoot}/\` conservatively.`,
    '5. Host adapters should inject `skopos session context . --json`; use it directly when the host cannot inject session context.',
    '',
    ...renderSkoposCommunicationContractLines(),
    '',
    '### Task Risk And Detail',
    '',
    '- Light risk: use for narrow local edits. Inspect relevant files, edit, capture focused Evidence, and update Memory only if project truth changed.',
    '- Standard risk: use for bounded multi-file feature, docs, policy, or maintenance work. Start or continue a Task, keep decisions current, and capture proportional Evidence.',
    '- High-impact risk: use for architecture, public API, data migration, security, stack, release, multi-Scope, or long-running work. Use a detailed Task or child Tasks, staged Guards and Evidence, findings, Memory sync, and explicit Readiness.',
    '- Proof subject: keep the default `task-closure` subject for bounded work. Use `--proof-subject project-integration` only to certify an explicit integration or release baseline; it requires owned paths, is always detailed/high-impact, and never absorbs unrelated dirty-worktree changes.',
    '',
    '### Memory And Docs',
    '',
    '- Update durable docs, decisions, findings, or policy only when project truth changes.',
    '- Do not duplicate truth. Tasks track execution; durable rules belong in docs, policy, decisions, findings, Patterns, or Memory.',
    '- In brownfield projects, use the unified Skopos setup review to converge Scopes, Project Memory, checks, Policies, Skills, instructions, and host delivery safely.',
    '- After changing `AGENTS.md`, run the project instruction action selected by Skopos. `skopos instructions sync .` owns only mirrors and adapters declared through Skopos.',
    '',
    '### Validation Economy',
    '',
    '- Treat root validation commands as a capability catalog, not a mandatory sequence.',
    '- Select Actions and Guards from Task-owned changed paths and affected Scope dependents. Unchanged dirty paths that predate the Task are outside its proof boundary unless explicitly adopted with `--own`.',
    '- Run the narrowest reliable check first. Do not run a workspace-wide test or build when affected-scope evidence is sufficient.',
    '- Stop after the first failing check, fix the cause, then resume. Do not spend time collecting predictable downstream failures.',
    '- Reuse valid source-bound Evidence while the exact Action, source, config, and command state are unchanged. Rerun after relevant invalidation.',
    '- If project commands already own verification, register them as Actions; do not maintain a second verification authority.',
    '',
    '### Readiness',
    '',
    '- Before saying work is complete, capture the focused Evidence selected for the Task.',
    '- For a compact diagnostic, run `skopos verify <task-id> . --phase closure --json`; add `--full` only for complete Evidence detail.',
    '- To close after required Evidence exists, run `skopos finish <task-id> . --actor <id>`.',
    '- Do not claim completion while Readiness blockers, blocking accepted-policy drift, open Task questions, missing Evidence, or Task state prevent closure.',
    '- Final responses should state what changed, Evidence, Memory/docs updates, and remaining risk.',
    '',
    '### Default Commands',
    '',
    `- Session context: \`skopos session context . --json\``,
    `- Work Queue: \`skopos work queue . --json\``,
    `- Next work: \`skopos work next . --json\``,
    `- Start tracked work: \`skopos start "<goal>" . --accept "<criterion>" --own <path> --actor <id>\``,
    `- Start explicit integration proof: \`skopos start "<integration goal>" . --proof-subject project-integration --own <integration-path> --actor <id>\``,
    `- Current Task: \`skopos task show <task-id> . --json\``,
    `- Sync instructions: \`skopos instructions sync .\``,
    `- Verify diagnostic: \`skopos verify <task-id> . --phase closure --json\``,
    `- Finish Task: \`skopos finish <task-id> . --actor <id>\``,
    '- Validation commands below are discoverable capabilities. Skopos selects a proportional affected-scope set; do not run all of them by default.',
    ...renderAvailableValidationCommands(commands),
    includeMarkers ? SKOPOS_CONTRACT_END : '',
  ];

  return lines.filter((line) => line.length > 0).join('\n');
};

const renderAvailableValidationCommands = (commands: SkoposCommandMap): string[] =>
  ['typecheck', 'test', 'lint', 'build']
    .map((name) => {
      const command = commands[name as keyof SkoposCommandMap];
      return command ? `- ${name}: \`${command}\`` : undefined;
    })
    .filter((line): line is string => Boolean(line));

const renderCommandRows = (commands: SkoposCommandMap): string => {
  const commandNames = ['dev', 'build', 'test', 'typecheck', 'lint'] as const;
  const lines = commandNames.map((commandName) => {
    const command = commands[commandName];
    return command ? `- ${commandName}: \`${command}\`` : `- ${commandName}: TODO define the canonical ${commandName} command`;
  });

  return lines.join('\n');
};

const renderGreenfieldPriority = (): string =>
  [
    '### Greenfield Policy',
    '',
    '1. Establish one clear pattern before multiplying files: routing, dependency boundaries, validation, config, tests, and docs should each have one obvious path.',
    '2. Build the smallest vertical slice that proves the architecture before adding optional abstractions.',
    '3. Document durable conventions as soon as they become project rules; do not leave them only in chat or temporary notes.',
    '4. Prefer simple explicit modules over generic frameworks until repeated real use proves the abstraction is needed.',
    '5. Add tests at the boundary where regressions would hurt: public APIs, user flows, persistence, auth, billing, jobs, and integration seams.',
  ].join('\n');

const renderBrownfieldPriority = (): string =>
  [
    '### Brownfield Policy',
    '',
    '1. Read the current implementation before proposing a new structure. Existing behavior is evidence, even when the code is messy.',
    '2. Preserve compatibility unless the user explicitly asks for a breaking change. Surface migration needs clearly.',
    '3. Prefer contained fixes over broad rewrites. Refactor only where it directly reduces risk for the requested change.',
    '4. When you find structural debt, record it as a finding or follow-up instead of expanding the current scope silently.',
    '5. Use characterization tests, focused regression tests, or before/after command output when behavior is under-specified.',
  ].join('\n');

const renderMonorepoPolicy = (): string =>
  [
    '### Monorepo Policy',
    '',
    '1. Resolve the package, app, module, or domain scope before editing. Do not treat the repository as one flat codebase.',
    '2. Respect package boundaries and public exports. Avoid deep imports unless the repo already documents that pattern.',
    '3. Run package-scoped checks first, then workspace checks when shared contracts or cross-package behavior changes.',
    '4. Keep shared utilities genuinely shared; do not move app-specific behavior into common packages for convenience.',
  ].join('\n');

const renderSingleProjectPolicy = (): string =>
  [
    '### Single-Project Policy',
    '',
    '1. Keep the main application flow easy to trace from entrypoint to domain logic to infrastructure boundary.',
    '2. Avoid splitting code into packages or frameworks unless the project has clear independent ownership or deployment needs.',
    '3. Keep local helpers near the feature until reuse is proven by multiple real call sites.',
  ].join('\n');

const normalizeRelativePath = (value: string): string => {
  const trimmed = value.trim().replace(/^\.\//, '');

  if (trimmed.length === 0 || trimmed.startsWith('/')) {
    return 'AGENTS.md';
  }

  const normalized = normalize(trimmed);

  return normalized === '.' ? 'AGENTS.md' : normalized;
};

const fileExists = async (targetPath: string): Promise<boolean> => {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const readTextIfExists = async (targetPath: string): Promise<string> => {
  try {
    return await readFile(targetPath, 'utf8');
  } catch {
    return '';
  }
};
