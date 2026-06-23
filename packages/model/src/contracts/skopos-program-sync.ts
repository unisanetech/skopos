import type {
  SkoposProgramItem,
  SkoposProgramRecommendedAction,
  SkoposProgramStateArtifact,
} from './skopos-program.js';

export interface SkoposProgramSyncRunResult {
  workspaceRoot: string;
  actorId?: string;
  summary: string;
  statePath: string;
  stateWrite: 'written' | 'dry-run';
  state: SkoposProgramStateArtifact;
  currentMissionId?: string;
  doNowItem?: SkoposProgramItem;
  doNextItem?: SkoposProgramItem;
  recommendedAction?: SkoposProgramRecommendedAction;
  nextCommand?: string;
}
