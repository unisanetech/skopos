import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';

export type SkoposGraphKind =
  | 'workspace'
  | 'docs'
  | 'commands'
  | 'scope-relations'
  | 'task'
  | 'impact';

export type SkoposGraphNodeKind =
  | 'workspace'
  | 'scope'
  | 'docs-root'
  | 'instruction-file'
  | 'command'
  | 'action'
  | 'plan'
  | 'task'
  | 'decision-question'
  | 'task-step'
  | 'changed-path';

export type SkoposGraphEdgeKind =
  | 'contains'
  | 'targets'
  | 'recommends'
  | 'requires'
  | 'touches'
  | 'belongs-to'
  | 'validates'
  | 'depends-on';

export type SkoposGraphState =
  | 'active'
  | 'recommended'
  | 'required'
  | 'changed'
  | 'generated'
  | 'complete'
  | 'warning';

export type SkoposGraphMetadataValue = string | number | boolean | string[];

export interface SkoposGraphNode {
  id: string;
  kind: SkoposGraphNodeKind;
  label: string;
  state: SkoposGraphState;
  path?: string;
  summary?: string;
  metadata?: Record<string, SkoposGraphMetadataValue>;
}

export interface SkoposGraphEdge {
  id: string;
  kind: SkoposGraphEdgeKind;
  from: string;
  to: string;
  state: SkoposGraphState;
  label?: string;
}

export interface SkoposGraphArtifact extends SkoposArtifactEnvelope<'graph'> {
  workspaceRoot: string;
  graphKind: SkoposGraphKind;
  focusId: string;
  nodes: SkoposGraphNode[];
  edges: SkoposGraphEdge[];
}
