import type {
  SkoposGraphArtifact,
  SkoposGraphEdgeKind,
  SkoposGraphKind,
  SkoposGraphNodeKind,
  SkoposGraphState,
} from '@skopos/model';

export interface SkoposUiGraphHighlightGroup {
  id: string;
  title: string;
  items: string[];
}

export interface SkoposUiGraphNodeView {
  id: string;
  kind: SkoposGraphNodeKind;
  label: string;
  state: SkoposGraphState;
  path?: string;
  summary?: string;
}

export interface SkoposUiGraphEdgeView {
  id: string;
  kind: SkoposGraphEdgeKind;
  from: string;
  to: string;
  state: SkoposGraphState;
  label?: string;
}

export interface SkoposUiGraphView {
  id: string;
  kind: SkoposGraphKind;
  title: string;
  summary: string;
  focusId: string;
  focusLabel: string;
  artifactPath: string;
  nodeCount: number;
  edgeCount: number;
  highlights: SkoposUiGraphHighlightGroup[];
  nodes: SkoposUiGraphNodeView[];
  edges: SkoposUiGraphEdgeView[];
}

export interface SkoposUiGraphViewsResult {
  workspaceRoot: string;
  graphPaths: string[];
  graphs: SkoposUiGraphView[];
}

export interface LoadedSkoposGraphArtifact {
  artifactPath: string;
  graph: SkoposGraphArtifact;
}
