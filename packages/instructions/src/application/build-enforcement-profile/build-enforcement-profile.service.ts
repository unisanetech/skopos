import type {
  SkoposEnforcementProfileArtifact,
  SkoposEnforcementRule,
  SkoposHostProjectionModel,
  SkoposHostProjection,
  SkoposToolAdapterLifecycleCoverage,
  SkoposToolAdapterSummary,
  SkoposActionManifest,
  SkoposGuardManifest,
} from '@skopos/model';

const CLAUDE_CODE_SETTINGS_PATH = '.skopos/cache/tooling/claude-code/settings.json';
const CLAUDE_CODE_GENERATED_FILES = [
  CLAUDE_CODE_SETTINGS_PATH,
  '.skopos/cache/tooling/claude-code/hooks/session-start-hook.mjs',
  '.skopos/cache/tooling/claude-code/hooks/user-prompt-submit-hook.mjs',
  '.skopos/cache/tooling/claude-code/hooks/post-edit-hook.mjs',
  '.skopos/cache/tooling/claude-code/hooks/pre-compact-hook.mjs',
  '.skopos/cache/tooling/claude-code/hooks/stop-hook.mjs',
] as const;
const CODEX_MANIFEST_PATH = '.skopos/cache/tooling/codex/adapter-manifest.json';
const CODEX_GENERATED_FILES = [
  CODEX_MANIFEST_PATH,
  '.skopos/cache/tooling/codex/codex-discussion-adapter.mjs',
  '.skopos/cache/tooling/codex/README.md',
] as const;
const MANUAL_HOST_GUIDE_PATH = '.skopos/cache/tooling/manual-hosts/README.md';
const MANUAL_HOST_GENERATED_FILES = [MANUAL_HOST_GUIDE_PATH] as const;
const FULL_LIFECYCLE_COVERAGE: SkoposToolAdapterLifecycleCoverage = {
  sessionStart: true,
  userTurn: true,
  assistantTurn: true,
  majorStateChange: true,
  preCompact: true,
};
const FULL_ACTION_ROUTER_COVERAGE = {
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
const MANUAL_ACTION_ROUTER_COVERAGE = {
  sessionStart: true,
  stopBoundary: true,
} as const;

export interface BuildSkoposEnforcementProfileOptions {
  cwd: string;
  actions: SkoposActionManifest[];
  guards: SkoposGuardManifest[];
  instructionSourcePath?: string;
  instructionMirrorPaths?: string[];
}

export const buildSkoposEnforcementProfile = ({
  cwd,
  actions,
  guards,
  instructionSourcePath = 'AGENTS.md',
  instructionMirrorPaths = [
    'CLAUDE.md',
    '.cursor/rules/project.mdc',
    '.github/copilot-instructions.md',
  ],
}: BuildSkoposEnforcementProfileOptions): SkoposEnforcementProfileArtifact => {
  const requiredGuardCount = guards.filter((guard) => guard.strength === 'required').length;
  const approvalRequiredActionCount = actions.filter(
    (action) => action.requiresApproval,
  ).length;
  const generatedAt = new Date().toISOString();
  const rules: SkoposEnforcementRule[] = [
    {
      id: 'enforcement.on-session-start',
      trigger: 'on-session-start',
      command: 'skopos session context <project-root> --json',
      blocking: false,
      summary:
        'Inject the shared compact response contract, current Task, Work Queue recommendation, and pending decision when an agent Session starts.',
    },
    {
      id: 'enforcement.before-agent-stop',
      trigger: 'before-agent-stop',
      command: 'skopos readiness <current-task-id> <project-root> --for close --json',
      blocking: true,
      summary: 'Block tool-native stop flows when the current Task is not ready to close.',
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
      command: 'skopos discuss handoff refresh <project-root> --task <task-id> --json',
      blocking: false,
      summary: 'Refresh the compact Task handoff before Claude Code compacts Session context.',
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
      command: 'skopos readiness <current-task-id> <project-root> --for continue --json',
      blocking: false,
      summary: 'Expose a deterministic readiness surface for wrappers, hooks, and humans.',
    },
  ];
  const toolAdapters: SkoposToolAdapterSummary[] = [
    {
      toolId: 'claude-code',
      displayName: 'Claude Code',
      summary:
        'Generated native hook adapter that injects the shared compact Session context when installed in the host.',
      adapterKind: 'hook-settings',
      supportTier: 'native-lifecycle',
      supportStatus: 'implemented',
      path: CLAUDE_CODE_SETTINGS_PATH,
      generatedFiles: [...CLAUDE_CODE_GENERATED_FILES],
      installMode: 'manual-merge',
      lifecycleCoverage: FULL_LIFECYCLE_COVERAGE,
      actionRouterCoverage: FULL_ACTION_ROUTER_COVERAGE,
    },
    {
      toolId: 'codex',
      displayName: 'OpenAI Codex',
      summary:
        'Generated wrapper adapter that injects the shared compact Session context when used by a Codex host launcher.',
      adapterKind: 'wrapper-manifest',
      supportTier: 'wrapper-mediated',
      supportStatus: 'implemented',
      path: CODEX_MANIFEST_PATH,
      generatedFiles: [...CODEX_GENERATED_FILES],
      installMode: 'wrapper-runner',
      lifecycleCoverage: FULL_LIFECYCLE_COVERAGE,
      actionRouterCoverage: FULL_ACTION_ROUTER_COVERAGE,
    },
    {
      toolId: 'manual-hosts',
      displayName: 'Other coding agents',
      summary:
        'Generated manual fallback guide that maps unsupported agent hosts into the same action-router and discussion-memory command contract.',
      adapterKind: 'wrapper-manifest',
      supportTier: 'manual-fallback',
      supportStatus: 'manual-only',
      path: MANUAL_HOST_GUIDE_PATH,
      generatedFiles: [...MANUAL_HOST_GENERATED_FILES],
      installMode: 'manual-only',
      lifecycleCoverage: MANUAL_LIFECYCLE_COVERAGE,
      actionRouterCoverage: MANUAL_ACTION_ROUTER_COVERAGE,
    },
  ];
  const hostProjectionModel = buildHostProjectionModel({
    instructionSourcePath,
    instructionMirrorPaths,
    rules,
    toolAdapters,
  });

  return {
    schemaVersion: 1,
    id: 'enforcement',
    type: 'enforcement',
    status: 'generated',
    authority: 'generated',
    summary:
      'Compiled enforcement profile for CLI and MCP Guards plus generated Claude Code, Codex, and manual host adapter surfaces for continuity, Readiness, and instruction-sync enforcement.',
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot: cwd,
    instructionSourcePath,
    primarySurface: 'cli-and-mcp',
    requiredGuardCount,
    approvalRequiredActionCount,
    rules,
    toolAdapters,
    hostProjectionModel,
  };
};

const buildHostProjectionModel = ({
  instructionSourcePath,
  instructionMirrorPaths,
  rules,
  toolAdapters,
}: {
  instructionSourcePath: string;
  instructionMirrorPaths: string[];
  rules: SkoposEnforcementRule[];
  toolAdapters: SkoposToolAdapterSummary[];
}): SkoposHostProjectionModel => {
  const ruleIds = rules.map((rule) => rule.id);
  const adapterById = new Map(toolAdapters.map((adapter) => [adapter.toolId, adapter]));
  const remainingMirrorPaths = [...new Set(instructionMirrorPaths)];
  const takeMirrorPath = (predicate: (path: string) => boolean): string | undefined => {
    const index = remainingMirrorPaths.findIndex(predicate);
    if (index < 0) {
      return undefined;
    }

    return remainingMirrorPaths.splice(index, 1)[0];
  };
  const claudeMirrorPath = takeMirrorPath((path) => /(^|\/)claude\.md$/i.test(path));
  const cursorMirrorPath = takeMirrorPath(
    (path) => path.startsWith('.cursor/') || path.endsWith('.mdc'),
  );
  const copilotMirrorPath = takeMirrorPath(
    (path) => path.startsWith('.github/') || path.toLowerCase().includes('copilot'),
  );
  const host = (
    hostId: string,
    displayName: string,
    instructionPath: string,
    instructionProjection: 'canonical' | 'mirror' | 'adapter-guide',
    adapterId: string,
    support: 'native' | 'wrapper' | 'manual',
    freshContinuation: SkoposHostProjection['freshContinuation'],
  ) => {
    const adapter = adapterById.get(adapterId);
    return {
      hostId,
      displayName,
      instructionPath,
      instructionProjection,
      adapterPath: adapter?.path,
      generatedFiles: adapter?.generatedFiles ?? [],
      support,
      enforcementRuleIds: ruleIds,
      freshContinuation,
    };
  };
  const mirroredHost = (
    hostId: string,
    displayName: string,
    mirrorPath: string | undefined,
    adapterId: string,
    support: 'native' | 'wrapper' | 'manual',
    freshContinuation: SkoposHostProjection['freshContinuation'],
  ) =>
    host(
      hostId,
      displayName,
      mirrorPath ?? adapterById.get(adapterId)?.path ?? MANUAL_HOST_GUIDE_PATH,
      mirrorPath ? 'mirror' : 'adapter-guide',
      adapterId,
      support,
      freshContinuation,
    );

  return {
    schemaVersion: 1,
    authority: 'skopos-project-model',
    instructionSourcePath,
    enforcementRuleIds: ruleIds,
    hosts: [
      host(
        'codex',
        'OpenAI Codex',
        instructionSourcePath,
        'canonical',
        'codex',
        'wrapper',
        {
          createFreshSession: true,
          injectInitialPrompt: true,
          identifyOriginSession: true,
          messageOriginSession: true,
          detectPreCompaction: true,
          reportCompletion: true,
          deliveryMode: 'host-api',
        },
      ),
      mirroredHost(
        'claude-code',
        'Claude Code',
        claudeMirrorPath,
        'claude-code',
        'native',
        {
          createFreshSession: false,
          injectInitialPrompt: false,
          identifyOriginSession: true,
          messageOriginSession: false,
          detectPreCompaction: true,
          reportCompletion: true,
          deliveryMode: 'interactive-launch',
        },
      ),
      mirroredHost(
        'cursor',
        'Cursor',
        cursorMirrorPath,
        'manual-hosts',
        'manual',
        manualFreshContinuationCapabilities,
      ),
      mirroredHost(
        'github-copilot',
        'GitHub Copilot',
        copilotMirrorPath,
        'manual-hosts',
        'manual',
        manualFreshContinuationCapabilities,
      ),
      host(
        'manual-hosts',
        'Other coding agents',
        MANUAL_HOST_GUIDE_PATH,
        'adapter-guide',
        'manual-hosts',
        'manual',
        manualFreshContinuationCapabilities,
      ),
      ...remainingMirrorPaths.map((instructionPath, index) =>
        host(
          `instruction-mirror-${index + 1}`,
          `Configured instruction mirror ${index + 1}`,
          instructionPath,
          'mirror',
          'manual-hosts',
          'manual',
          manualFreshContinuationCapabilities,
        ),
      ),
    ],
  };
};

const manualFreshContinuationCapabilities: SkoposHostProjection['freshContinuation'] = {
  createFreshSession: false,
  injectInitialPrompt: false,
  identifyOriginSession: false,
  messageOriginSession: false,
  detectPreCompaction: false,
  reportCompletion: false,
  deliveryMode: 'manual-copy',
};

export const skoposClaudeCodeGeneratedFiles = [...CLAUDE_CODE_GENERATED_FILES];
export const skoposCodexGeneratedFiles = [...CODEX_GENERATED_FILES];
export const skoposManualHostGeneratedFiles = [...MANUAL_HOST_GENERATED_FILES];
