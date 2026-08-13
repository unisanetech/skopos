import { SKOPOS_COMMUNICATION_BRIEF_ARTIFACT_PATH } from '@skopos/instructions';

export const AGENT_BRIEF_DIRECTORY = '.skopos/cache/agent';
export const POLICY_BRIEF_ARTIFACT_PATH = `${AGENT_BRIEF_DIRECTORY}/policy-brief.json`;
export const PROMPT_BRIEF_ARTIFACT_PATH = `${AGENT_BRIEF_DIRECTORY}/prompt-brief.json`;
export const COMMUNICATION_BRIEF_ARTIFACT_PATH = SKOPOS_COMMUNICATION_BRIEF_ARTIFACT_PATH;
export const TOKEN_TELEMETRY_ARTIFACT_PATH = `${AGENT_BRIEF_DIRECTORY}/token-telemetry.json`;

export const DISCUSSION_DIRECTORY = '.skopos/sessions';
export const DISCUSSION_RAW_DIRECTORY = `${DISCUSSION_DIRECTORY}/transcripts`;
export const DISCUSSION_CHECKPOINT_DIRECTORY = `${DISCUSSION_DIRECTORY}/checkpoints`;
export const DISCUSSION_HANDOFF_DIRECTORY = '.skopos/handoffs';
export const DISCUSSION_INDEX_ARTIFACT_PATH = `${DISCUSSION_DIRECTORY}/index.json`;
export const BOOTSTRAP_ARTIFACT_PATH = '.skopos/index/bootstrap.json';
export const CONFIG_ARTIFACT_PATH = 'skopos.config.yaml';
export const POLICY_RECOMMENDATIONS_ARTIFACT_PATH = '.skopos/index/policies/recommendations.json';
export const RESOLVED_POLICY_ARTIFACT_PATH = '.skopos/index/policies/resolved.json';
export const POLICY_OVERRIDES_ARTIFACT_PATH = '.skopos/index/policies/overrides.json';
export const POLICY_ROLE_MAPPING_ARTIFACT_PATH = '.skopos/index/policies/role-mapping.json';
export const POLICY_ROLE_MAPPING_DECISIONS_ARTIFACT_PATH = '.skopos/index/policies/role-mapping-decisions.json';
export const DRIFT_REPORT_ARTIFACT_PATH = '.skopos/index/policies/drift.json';
export const MEMORY_STATE_ARTIFACT_PATH = '.skopos/index/roles.json';

export const TOKEN_BUDGETS = {
  policyBrief: 350,
  task: 500,
  taskQuestions: 300,
  taskRecommendations: 300,
  checkpoint: 900,
  handoff: 1200,
  resumeContext: 1500,
} as const;
