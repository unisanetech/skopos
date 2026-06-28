import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join, normalize, resolve } from 'node:path';

import type {
  SkoposCommandMap,
  SkoposInitMode,
  SkoposProjectArchetype,
  SkoposRepoMode,
} from '@skopos/model';

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
    '2. Run or inspect `skopos program next . --compact --json` before broad scanning. If Skopos is not initialized yet, run `skopos init .` first.',
    `3. Read \`${docsStartHerePath}\` if it exists; otherwise inspect \`${docsRoot}/\` and the package README files relevant to the task.`,
    '4. Use Skopos compact state before broad scanning when available: `.skopos/bootstrap.json`, `.skopos/scopes-lite.json`, `.skopos/architecture.json`, `.skopos/index.json`, and `.skopos/agent/communication-brief.json`.',
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
    '## Skopos Workflow',
    '',
    '1. Initialize or refresh project understanding with `skopos init .`.',
    '2. Use `skopos program next . --compact --json` as the default session-start command.',
    '3. Check readiness with `skopos trust .` before broad agent work.',
    '4. Start substantial work with `skopos start "<goal>" . --actor <id>` so plan, mission, and questions are durable.',
    '5. Use `skopos next . --actor <id>` during longer work to keep the current recommendation visible.',
    '6. Use `skopos instructions sync .` after changing `AGENTS.md` so mirrors and tool adapters stay aligned.',
    '7. Use `skopos done --cwd . --actor <id>` before claiming complete when closure evidence matters.',
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
    'When Skopos is installed, agents should treat it as the default workflow layer for project memory, planning, validation, and closure.',
    '',
    '### Session Start',
    '',
    '1. Read `AGENTS.md` first.',
    '2. Run or inspect `skopos program next . --compact --json` before broad scanning or implementation.',
    '3. If Skopos state is missing or stale, run `skopos init .` and then re-check `skopos program next`.',
    `4. Use \`${docsStartHerePath}\` as the human docs router when it exists; otherwise inspect \`${docsRoot}/\` conservatively.`,
    '5. Load `.skopos/agent/communication-brief.json` when available so user-facing answers follow project tone, question, progress, and closure rules.',
    '',
    '### Lane Selection',
    '',
    '- Light lane: use for narrow local edits with low risk. Inspect relevant files, edit, run a focused check, and update memory only if project truth changed.',
    '- Normal lane: use for multi-file feature, docs, policy, or maintenance work. Start or continue a Skopos mission, keep decisions current, run proportional checks, and summarize proof.',
    '- Workpack lane: use for architecture, public API, data migration, security, stack, release, or long-running work. Track phases, decisions, staged gates, findings, memory sync, and closure proof.',
    '',
    '### Memory And Docs',
    '',
    '- Update durable docs, decisions, findings, or policy only when project truth changes.',
    '- Do not duplicate truth. Workpacks track execution; durable rules belong in docs, policy, decisions, findings, or memory.',
    '- In brownfield projects, suggest docs organization improvements before rewriting existing docs.',
    '- After changing `AGENTS.md`, run `skopos instructions sync .` so mirrors and adapters stay aligned.',
    '',
    '### Closure',
    '',
    '- Before saying work is done, run the focused checks that match the lane.',
    '- For normal/workpack work, run `skopos done --cwd . --actor <id>` or explain why it could not be run.',
    '- Do not claim complete when `skopos trust`, `skopos eval`, accepted-policy drift, open workflow questions, or mission state blocks closure.',
    '- Final responses should state what changed, proof/checks, memory/docs updates, and remaining risk.',
    '',
    '### Default Commands',
    '',
    `- Program next: \`skopos program next . --compact --json\``,
    `- Trust check: \`skopos trust . --compact\``,
    `- Start tracked work: \`skopos start "<goal>" . --actor <id>\``,
    `- Continue work: \`skopos next . --actor <id>\``,
    `- Sync instructions: \`skopos instructions sync .\``,
    `- Closure: \`skopos done --cwd . --actor <id>\``,
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
