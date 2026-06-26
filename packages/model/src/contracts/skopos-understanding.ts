import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposConfidence } from './skopos-scan-summary.js';

export interface SkoposUnderstandingEvidence {
  label: string;
  path: string;
}

export interface SkoposRepoSummaryArea {
  title: string;
  path: string;
  summary: string;
  confidence: SkoposConfidence;
}

export interface SkoposRepoUnderstandingSummaryArtifact
  extends SkoposArtifactEnvelope<'repo-understanding-summary'> {
  workspaceRoot: string;
  projectName: string;
  repoMode: string;
  archetype: string;
  stack: string[];
  purpose: string;
  mainAreas: SkoposRepoSummaryArea[];
  docsEntrypoints: SkoposUnderstandingEvidence[];
  commandSurface: Array<{
    name: string;
    command: string;
  }>;
  uncertainties: string[];
}

export interface SkoposFeatureInventoryEntry {
  id: string;
  title: string;
  ownerPath: string;
  summary: string;
  confidence: SkoposConfidence;
  relatedDocs: SkoposUnderstandingEvidence[];
}

export interface SkoposFeatureInventoryArtifact
  extends SkoposArtifactEnvelope<'feature-inventory'> {
  workspaceRoot: string;
  features: SkoposFeatureInventoryEntry[];
}

export interface SkoposImplementationHotspot {
  id: string;
  title: string;
  path: string;
  reason: string;
  confidence: SkoposConfidence;
  evidence: SkoposUnderstandingEvidence[];
}

export interface SkoposImplementationHotspotsArtifact
  extends SkoposArtifactEnvelope<'implementation-hotspots'> {
  workspaceRoot: string;
  hotspots: SkoposImplementationHotspot[];
}

export interface SkoposUnderstandingRuntimeResult {
  workspaceRoot: string;
  summaryPath: string;
  featureInventoryPath: string;
  hotspotsPath: string;
  indexPath: string;
  logPath: string;
  summaryWrite: 'written' | 'dry-run';
  featureInventoryWrite: 'written' | 'dry-run';
  hotspotsWrite: 'written' | 'dry-run';
  indexWrite: 'written' | 'dry-run';
  logWrite: 'written' | 'dry-run';
  actorId?: string;
  summary: SkoposRepoUnderstandingSummaryArtifact;
  featureInventory: SkoposFeatureInventoryArtifact;
  hotspots: SkoposImplementationHotspotsArtifact;
}
