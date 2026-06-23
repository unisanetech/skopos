export type SkoposAuthority = 'canonical' | 'supporting' | 'generated' | 'inferred';

export type SkoposStatus =
  | 'draft'
  | 'active'
  | 'durable'
  | 'historical'
  | 'deprecated'
  | 'dead'
  | 'generated';

export interface SkoposArtifactEnvelope<TType extends string = string> {
  schemaVersion: number;
  id: string;
  type: TType;
  status: SkoposStatus;
  authority: SkoposAuthority;
  summary?: string;
  updatedAt?: string;
  generatedAt?: string;
}
