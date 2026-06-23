import type {
  SkoposProgramItem,
  SkoposProgramObligation,
  SkoposProgramRecommendedAction,
  SkoposProgramRoutingDecision,
  SkoposProgramStateArtifact,
} from './skopos-program.js';

export interface SkoposProgramNextRunResult {
  workspaceRoot: string;
  actorId?: string;
  summary: string;
  statePath: string;
  stateWrite: 'written' | 'dry-run';
  state: SkoposProgramStateArtifact;
  currentDisposition: SkoposProgramRoutingDecision;
  currentMissionId?: string;
  recommendedItem?: SkoposProgramItem;
  obligations: SkoposProgramObligation[];
  recommendedAction?: SkoposProgramRecommendedAction;
  nextCommand?: string;
}
