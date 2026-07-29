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
  programStatePath?: string;
  programBriefPath?: string;
  handoffPath?: string;
}
