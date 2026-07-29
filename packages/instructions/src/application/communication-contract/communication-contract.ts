export const SKOPOS_COMMUNICATION_CONTRACT_VERSION = 1 as const;

export const SKOPOS_COMMUNICATION_CONTRACT = {
  marker: '[SKOPOS_SESSION_CONTEXT_V1]',
  tokenBudget: 1_200,
  coreRules: [
    'Answer the user directly before process detail.',
    'Use the response mode that fits the moment; do not announce a lane unless risk or execution scope makes it useful.',
    'Ask only when the answer changes direction, risk, policy, or public behavior.',
    'When asking, show the recommendation, reason, alternatives, and the default behavior if the user has no preference.',
    'For progress, report completed work, current work, blockers, and proof still needed without false precision.',
    'For closure, state changed behavior, focused proof, memory updates, and remaining risk.',
  ],
  responseModes: [
    'direct-answer',
    'work-start',
    'progress',
    'decision',
    'completion',
  ],
} as const;

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
