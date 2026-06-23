import { join, resolve } from 'node:path';

import { buildSkoposDiagnosisReport, buildSkoposReferenceArtifacts } from '@skopos/indexer';
import type { SkoposDiagnosisReport } from '@skopos/model';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';

export interface BuildSkoposScanRuntimeOptions {
  cwd: string;
  subtreeTarget?: string;
  actor?: string;
}

export interface BuildSkoposScanRuntimeResult extends SkoposDiagnosisReport {
  actorId?: string;
  diagnosisPath: string;
  diagnosisWrite: 'written' | 'dry-run';
  symbolsPath: string;
  symbolsWrite: 'written' | 'dry-run';
  duplicatesPath: string;
  duplicatesWrite: 'written' | 'dry-run';
  contradictionsPath: string;
  contradictionsWrite: 'written' | 'dry-run';
  indexPath: string;
  indexWrite: 'written' | 'dry-run';
  logPath: string;
  logWrite: 'written' | 'dry-run';
}

export const buildSkoposScanRuntime = async ({
  cwd,
  subtreeTarget,
  actor,
}: BuildSkoposScanRuntimeOptions): Promise<BuildSkoposScanRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const diagnosisPath = join(workspaceRoot, '.skopos', 'diagnosis.json');
  const symbolsPath = join(workspaceRoot, '.skopos', 'references', 'symbols.json');
  const duplicatesPath = join(workspaceRoot, '.skopos', 'references', 'duplicates.json');
  const contradictionsPath = join(workspaceRoot, '.skopos', 'references', 'contradictions.json');
  const diagnosis = await buildSkoposDiagnosisReport({
    cwd: workspaceRoot,
    subtreeTarget,
  });
  const references = await buildSkoposReferenceArtifacts({
    cwd: workspaceRoot,
    subtreeTarget,
    diagnosis,
  });
  const diagnosisWrite = await writeJsonArtifact({
    artifactPath: diagnosisPath,
    artifact: diagnosis,
  });
  const symbolsWrite = await writeJsonArtifact({
    artifactPath: symbolsPath,
    artifact: references.symbols,
  });
  const duplicatesWrite = await writeJsonArtifact({
    artifactPath: duplicatesPath,
    artifact: references.duplicates,
  });
  const contradictionsWrite = await writeJsonArtifact({
    artifactPath: contradictionsPath,
    artifact: references.contradictions,
  });

  const logResult = await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'scan',
    status: 'succeeded',
    summary: `Repo diagnosis completed with ${diagnosis.health} health.`,
    relatedArtifactPaths: [diagnosisPath, symbolsPath, duplicatesPath, contradictionsPath],
    metadata: {
      actorId: actorId ?? null,
      health: diagnosis.health,
      confidence: diagnosis.confidence,
      packageCount: diagnosis.packageCount,
      workspacePackageCount: diagnosis.workspacePackageCount,
      findingCount: diagnosis.findings.length,
      remediationMissionCount: diagnosis.remediationMissions.length,
      focusSubtree: diagnosis.focusSubtree ?? null,
    },
  });
  const indexResult = await refreshSkoposKnowledgeIndex({
    workspaceRoot,
  });

  return {
    ...diagnosis,
    actorId,
    diagnosisPath,
    diagnosisWrite,
    symbolsPath,
    symbolsWrite,
    duplicatesPath,
    duplicatesWrite,
    contradictionsPath,
    contradictionsWrite,
    indexPath: indexResult.path,
    indexWrite: indexResult.write,
    logPath: logResult.path,
    logWrite: logResult.write,
  };
};
