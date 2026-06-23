export type SkoposDecisionEscalationClass =
  | 'delegable'
  | 'recommend-and-ask'
  | 'must-ask'
  | 'forbidden-without-approval';

export interface SkoposDecisionOption {
  id: string;
  label: string;
  rationale: string;
}

export interface SkoposDecisionQuestion {
  id: string;
  category: string;
  escalation: SkoposDecisionEscalationClass;
  question: string;
  whyItMatters: string;
  recommendedOptionId: string;
  options: SkoposDecisionOption[];
}
