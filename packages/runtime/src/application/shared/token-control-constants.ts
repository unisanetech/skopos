export const AGENT_BRIEF_DIRECTORY = '.skopos/agent';
export const POLICY_BRIEF_ARTIFACT_PATH = `${AGENT_BRIEF_DIRECTORY}/policy-brief.json`;
export const TRUST_BRIEF_ARTIFACT_PATH = `${AGENT_BRIEF_DIRECTORY}/trust-brief.json`;
export const DONE_BRIEF_ARTIFACT_PATH = `${AGENT_BRIEF_DIRECTORY}/done-brief.json`;
export const PROGRAM_BRIEF_ARTIFACT_PATH = `${AGENT_BRIEF_DIRECTORY}/program-brief.json`;
export const PROMPT_BRIEF_ARTIFACT_PATH = `${AGENT_BRIEF_DIRECTORY}/prompt-brief.json`;
export const TOKEN_TELEMETRY_ARTIFACT_PATH = `${AGENT_BRIEF_DIRECTORY}/token-telemetry.json`;
export const AGENT_EVAL_BRIEF_DIRECTORY = `${AGENT_BRIEF_DIRECTORY}/evals`;
export const AGENT_MISSION_BRIEF_DIRECTORY = `${AGENT_BRIEF_DIRECTORY}/missions`;

export const QUESTIONS_ARTIFACT_PATH = '.skopos/questions.json';
export const RECOMMENDATIONS_ARTIFACT_PATH = '.skopos/recommendations.json';
export const DISCUSSION_DIRECTORY = '.skopos/discussions';
export const DISCUSSION_RAW_DIRECTORY = `${DISCUSSION_DIRECTORY}/raw`;
export const DISCUSSION_CHECKPOINT_DIRECTORY = `${DISCUSSION_DIRECTORY}/checkpoints`;
export const DISCUSSION_HANDOFF_DIRECTORY = '.skopos/discussions/handoffs';
export const DISCUSSION_INDEX_ARTIFACT_PATH = `${DISCUSSION_DIRECTORY}/index.json`;
export const LATEST_WORKFLOW_HANDOFF_ARTIFACT_PATH = `${DISCUSSION_HANDOFF_DIRECTORY}/latest-workflow.json`;
export const BOOTSTRAP_ARTIFACT_PATH = '.skopos/bootstrap.json';
export const CONFIG_ARTIFACT_PATH = 'skopos.config.yaml';
export const POLICY_RECOMMENDATIONS_ARTIFACT_PATH = '.skopos/policies/recommendations.json';
export const RESOLVED_POLICY_ARTIFACT_PATH = '.skopos/policies/resolved.json';
export const POLICY_OVERRIDES_ARTIFACT_PATH = '.skopos/policies/overrides.json';
export const POLICY_ROLE_MAPPING_ARTIFACT_PATH = '.skopos/policies/role-mapping.json';
export const POLICY_ROLE_MAPPING_DECISIONS_ARTIFACT_PATH = '.skopos/policies/role-mapping-decisions.json';
export const DRIFT_REPORT_ARTIFACT_PATH = '.skopos/drift/report.json';

export const TOKEN_BUDGETS = {
  policyBrief: 350,
  trustBrief: 300,
  doneBrief: 400,
  programBrief: 400,
  missionBrief: 500,
  checkpoint: 900,
  handoff: 1200,
  resumeContext: 1500,
} as const;
