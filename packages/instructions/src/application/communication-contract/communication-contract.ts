export const SKOPOS_COMMUNICATION_CONTRACT_VERSION = 1 as const;
export const SKOPOS_COMMUNICATION_BRIEF_ARTIFACT_PATH =
  '.skopos/cache/agent/communication-brief.json' as const;

export type SkoposCommunicationResponseMode =
  | 'direct-answer'
  | 'work-start'
  | 'progress'
  | 'decision'
  | 'completion';

const RESPONSE_MODE_RULES: Record<SkoposCommunicationResponseMode, readonly string[]> = {
  'direct-answer': [
    'Lead with the answer; include only explanation that helps the user act.',
  ],
  'work-start': [
    'State the intended outcome, bounded work, first meaningful step, and only material risk.',
  ],
  progress: [
    'Report completed work, current work, blockers, and proof still needed without false precision.',
  ],
  decision: [
    'Explain the decision, recommendation, reason, alternatives, default behavior, and what follows.',
  ],
  completion: [
    'State changed behavior, focused proof, project-memory updates, and remaining risk.',
  ],
};

export const SKOPOS_COMMUNICATION_CONTRACT = {
  marker: '[SKOPOS_SESSION_CONTEXT_V1]',
  tokenBudget: 1_200,
  coreRules: [
    'Answer the user directly before process detail.',
    'Use clear, calm, simple English and explain necessary Skopos terms in project language.',
    'Ask only when the answer changes direction, risk, policy, or public behavior.',
    'When asking, show the recommendation, reason, alternatives, and the default behavior if the user has no preference.',
    'Do not claim completion until required proof and Readiness agree.',
  ],
  responseModes: [
    'direct-answer',
    'work-start',
    'progress',
    'decision',
    'completion',
  ] satisfies readonly SkoposCommunicationResponseMode[],
  responseModeRules: RESPONSE_MODE_RULES,
} as const;

export const resolveSkoposCommunicationResponseModeRules = (
  mode: SkoposCommunicationResponseMode,
): readonly string[] => SKOPOS_COMMUNICATION_CONTRACT.responseModeRules[mode];

export const renderSkoposCommunicationContractLines = (): string[] => [
  '### Agent Response Contract',
  '',
  ...SKOPOS_COMMUNICATION_CONTRACT.coreRules.map((rule) => `- ${rule}`),
];

export const resolveDecisionDefaultBehavior = (
  escalation: SkoposDecisionEscalationClass,
): SkoposDecisionDefaultBehavior => {
  switch (escalation) {
    case 'delegable':
      return 'proceed-with-recommended';
    case 'recommend-and-ask':
      return 'proceed-with-recommended-if-no-preference';
    case 'must-ask':
      return 'wait-for-answer';
    case 'forbidden-without-approval':
      return 'require-explicit-approval';
  }
};
import type {
  SkoposDecisionDefaultBehavior,
  SkoposDecisionEscalationClass,
} from '@skopos/model';
