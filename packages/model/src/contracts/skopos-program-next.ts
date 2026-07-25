import type {
  SkoposProgramItem,
  SkoposProgramObligation,
  SkoposProgramRecommendedAction,
  SkoposProgramRoutingDecision,
  SkoposProgramStateArtifact,
} from './skopos-program.js';
import type { SkoposTaskStatePaths } from './skopos-task-identity.js';

export interface SkoposProgramNextRunResult {
  workspaceRoot: string;
  actorId?: string;
  summary: string;
  taskState?: SkoposTaskStatePaths;
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
