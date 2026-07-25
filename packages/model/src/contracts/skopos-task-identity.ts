export interface SkoposWorkspaceIdentity {
  repositoryId: string;
  repositoryRoot: string;
  worktreeId: string;
  worktreeRoot: string;
  branch?: string;
}

export interface SkoposTaskIdentity extends SkoposWorkspaceIdentity {
  taskId: string;
  actorId?: string;
}

export interface SkoposTaskStatePaths {
  authorityDirectory: string;
  questionsPath: string;
  recommendationsPath: string;
  compatibilityQuestionsPath: string;
  compatibilityRecommendationsPath: string;
  programStatePath?: string;
  programBriefPath?: string;
  compatibilityProgramStatePath?: string;
  compatibilityProgramBriefPath?: string;
}
