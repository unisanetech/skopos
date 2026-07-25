import type {
  SkoposProgramItem,
  SkoposProgramRecommendedAction,
  SkoposProgramStateArtifact,
} from './skopos-program.js';
import type { SkoposTaskStatePaths } from './skopos-task-identity.js';

export interface SkoposProgramSyncRunResult {
  workspaceRoot: string;
  actorId?: string;
  summary: string;
  taskState?: SkoposTaskStatePaths;
  statePath: string;
  stateWrite: 'written' | 'dry-run';
  state: SkoposProgramStateArtifact;
  currentMissionId?: string;
  doNowItem?: SkoposProgramItem;
  doNextItem?: SkoposProgramItem;
  recommendedAction?: SkoposProgramRecommendedAction;
  nextCommand?: string;
}
