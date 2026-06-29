import type { SkoposArtifactEnvelope } from './skopos-artifact-envelope.js';
import type { SkoposProjectMode } from './skopos-root-config.js';

export type SkoposFallbackStatus = 'active' | 'approved-boundary-compatibility' | 'planned-removal';

export interface SkoposFallbackRegistryEntry {
  id: string;
  owner: string;
  status: SkoposFallbackStatus;
  reason: string;
  affectedSurface: string;
  removalCondition?: string;
  compatibilityNote?: string;
}

export interface SkoposFallbackRegistryArtifact extends SkoposArtifactEnvelope<'fallback-registry'> {
  projectMode?: SkoposProjectMode;
  policy: string;
  entries: SkoposFallbackRegistryEntry[];
}
