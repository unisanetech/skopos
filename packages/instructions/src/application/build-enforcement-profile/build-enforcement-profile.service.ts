import type {
  SkoposEnforcementProfileArtifact,
  SkoposToolAdapterLifecycleCoverage,
  SkoposWorkflowManifest,
} from '@skopos/model';

const CLAUDE_CODE_SETTINGS_PATH = '.skopos/tooling/claude-code/settings.json';
const CLAUDE_CODE_GENERATED_FILES = [
  CLAUDE_CODE_SETTINGS_PATH,
  '.skopos/tooling/claude-code/hooks/session-start-hook.mjs',
  '.skopos/tooling/claude-code/hooks/user-prompt-submit-hook.mjs',
  '.skopos/tooling/claude-code/hooks/post-edit-hook.mjs',
  '.skopos/tooling/claude-code/hooks/pre-compact-hook.mjs',
  '.skopos/tooling/claude-code/hooks/stop-hook.mjs',
] as const;
const CODEX_MANIFEST_PATH = '.skopos/tooling/codex/adapter-manifest.json';
const CODEX_GENERATED_FILES = [
  CODEX_MANIFEST_PATH,
  '.skopos/tooling/codex/codex-discussion-adapter.mjs',
  '.skopos/tooling/codex/README.md',
] as const;
const MANUAL_HOST_GUIDE_PATH = '.skopos/tooling/manual-hosts/README.md';
const MANUAL_HOST_GENERATED_FILES = [MANUAL_HOST_GUIDE_PATH] as const;
const FULL_LIFECYCLE_COVERAGE: SkoposToolAdapterLifecycleCoverage = {
  sessionStart: true,
  userTurn: true,
  assistantTurn: true,
  majorStateChange: true,
  preCompact: true,
};
const FULL_WORKFLOW_ROUTER_COVERAGE = {
  sessionStart: true,
  stopBoundary: true,
} as const;
const MANUAL_LIFECYCLE_COVERAGE: SkoposToolAdapterLifecycleCoverage = {
  sessionStart: true,
  userTurn: true,
  assistantTurn: true,
  majorStateChange: true,
  preCompact: true,
};
const MANUAL_WORKFLOW_ROUTER_COVERAGE = {
  sessionStart: true,
  stopBoundary: true,
} as const;

export interface BuildSkoposEnforcementProfileOptions {
  cwd: string;
  workflows: SkoposWorkflowManifest[];
  instructionSourcePath?: string;
}

export const buildSkoposEnforcementProfile = ({
  cwd,
  workflows,
  instructionSourcePath = 'AGENTS.md',
}: BuildSkoposEnforcementProfileOptions): SkoposEnforcementProfileArtifact => {
  const requiredWorkflowCount = workflows.filter((workflow) => workflow.requiredForDone).length;
  const approvalRequiredWorkflowCount = workflows.filter(
    (workflow) => workflow.requiresApproval,
  ).length;
  const generatedAt = new Date().toISOString();

  return {
    schemaVersion: 1,
    id: 'enforcement',
    type: 'enforcement',
    status: 'generated',
    authority: 'generated',
    summary:
      'Compiled enforcement profile for CLI and MCP gates plus generated Claude Code, Codex, and manual host adapter surfaces for continuity, closure, and instruction-sync enforcement.',
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot: cwd,
    instructionSourcePath,
    primarySurface: 'cli-and-mcp',
    requiredWorkflowCount,
    approvalRequiredWorkflowCount,
    rules: [
      {
        id: 'enforcement.on-session-start',
        trigger: 'on-session-start',
        command: 'skopos program next <project-root> --compact --json',
        blocking: false,
        summary:
          'Refresh the program router and expose the strongest next workflow action when an agent session starts.',
      },
      {
        id: 'enforcement.before-agent-stop',
        trigger: 'before-agent-stop',
        command: 'skopos done --cwd <project-root> --json',
        blocking: true,
        summary: 'Block tool-native stop flows when Skopos closure evidence is incomplete.',
      },
      {
        id: 'enforcement.after-instruction-source-edit',
        trigger: 'after-instruction-source-edit',
        command: 'skopos instructions sync <project-root> --json',
        blocking: false,
        summary: 'Auto-sync generated instruction mirrors after AGENTS.md changes.',
      },
      {
        id: 'enforcement.before-context-compact',
        trigger: 'before-context-compact',
        command: 'skopos discuss handoff <project-root> --json',
        blocking: false,
        summary: 'Refresh the compact workflow handoff before Claude Code compacts session context.',
      },
      {
        id: 'enforcement.on-user-prompt-submit',
        trigger: 'on-user-prompt-submit',
        command: 'skopos discuss append-turn <project-root> --role user --message-stdin --json',
        blocking: false,
        summary: 'Append the user turn to the local-only discussion journal before Claude processes it.',
      },
      {
        id: 'enforcement.manual-readiness',
        trigger: 'manual-readiness',
        command: 'skopos trust <project-root> --json',
        blocking: false,
        summary: 'Expose a deterministic readiness surface for wrappers, hooks, and humans.',
      },
    ],
    toolAdapters: [
      {
        toolId: 'claude-code',
        displayName: 'Claude Code',
        summary:
          'Native hook-based lifecycle adapter that returns compact discussion continuity plus workflow-router guidance.',
        adapterKind: 'hook-settings',
        supportTier: 'native-lifecycle',
        supportStatus: 'implemented',
        path: CLAUDE_CODE_SETTINGS_PATH,
        generatedFiles: [...CLAUDE_CODE_GENERATED_FILES],
        installMode: 'manual-merge',
        lifecycleCoverage: FULL_LIFECYCLE_COVERAGE,
        workflowRouterCoverage: FULL_WORKFLOW_ROUTER_COVERAGE,
      },
      {
        toolId: 'codex',
        displayName: 'OpenAI Codex',
        summary:
          'Wrapper-mediated lifecycle adapter that maps Codex host boundaries into shared discussion-memory and workflow-router runtime surfaces.',
        adapterKind: 'wrapper-manifest',
        supportTier: 'wrapper-mediated',
        supportStatus: 'implemented',
        path: CODEX_MANIFEST_PATH,
        generatedFiles: [...CODEX_GENERATED_FILES],
        installMode: 'wrapper-runner',
        lifecycleCoverage: FULL_LIFECYCLE_COVERAGE,
        workflowRouterCoverage: FULL_WORKFLOW_ROUTER_COVERAGE,
      },
      {
        toolId: 'manual-hosts',
        displayName: 'Other coding agents',
        summary:
          'Generated manual fallback guide that maps unsupported agent hosts into the same workflow-router and discussion-memory command contract.',
        adapterKind: 'wrapper-manifest',
        supportTier: 'manual-fallback',
        supportStatus: 'manual-only',
        path: MANUAL_HOST_GUIDE_PATH,
        generatedFiles: [...MANUAL_HOST_GENERATED_FILES],
        installMode: 'manual-only',
        lifecycleCoverage: MANUAL_LIFECYCLE_COVERAGE,
        workflowRouterCoverage: MANUAL_WORKFLOW_ROUTER_COVERAGE,
      },
    ],
  };
};

export const skoposClaudeCodeGeneratedFiles = [...CLAUDE_CODE_GENERATED_FILES];
export const skoposCodexGeneratedFiles = [...CODEX_GENERATED_FILES];
export const skoposManualHostGeneratedFiles = [...MANUAL_HOST_GENERATED_FILES];
