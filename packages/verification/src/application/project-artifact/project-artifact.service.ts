import {
  SKOPOS_LOCAL_STATE_FAMILIES,
} from '@skopos/model';
import type {
  SkoposProjectArtifact,
  SkoposProjectArtifactValidation,
  SkoposProjectSourceState,
} from '@skopos/model';

export const buildSkoposProjectArtifact = ({
  projectName,
  instructionsPath,
  docsRoot,
  trackedRoots,
  sourceState,
}: {
  projectName: string;
  instructionsPath: string;
  docsRoot: string;
  trackedRoots: string[];
  sourceState: SkoposProjectSourceState;
}): SkoposProjectArtifact => ({
  schemaVersion: 1,
  id: 'project',
  type: 'project',
  status: 'generated',
  authority: 'generated',
  summary: 'Rebuildable local projection of tracked Skopos project sources.',
  projectName,
  configPath: 'skopos.config.yaml',
  instructionsPath,
  docsRoot,
  trackedRoots: [...new Set(trackedRoots)].sort(),
  sourceState: {
    ...sourceState,
    files: [...sourceState.files].sort((left, right) => left.path.localeCompare(right.path)),
    missingRoots: [...sourceState.missingRoots].sort(),
  },
  localState: {
    root: '.skopos',
    families: [...SKOPOS_LOCAL_STATE_FAMILIES],
  },
});

export const validateSkoposProjectArtifact = (
  artifact: SkoposProjectArtifact,
): SkoposProjectArtifactValidation => {
  const diagnostics: string[] = [];

  if (artifact.authority !== 'generated' || artifact.status !== 'generated') {
    diagnostics.push('Project artifact must remain a generated local projection.');
  }
  if (artifact.localState.root !== '.skopos') {
    diagnostics.push('Project local state root must be .skopos.');
  }
  if (!/^[a-f0-9]{64}$/.test(artifact.sourceState.digest)) {
    diagnostics.push('Project source digest must be a SHA-256 hex digest.');
  }
  if (artifact.trackedRoots.some((path) => path === '.skopos' || path.startsWith('.skopos/'))) {
    diagnostics.push('Tracked project authority must not live under .skopos.');
  }

  const expectedFamilies = [...SKOPOS_LOCAL_STATE_FAMILIES];
  const actualFamilies = [...new Set(artifact.localState.families)];
  if (
    actualFamilies.length !== expectedFamilies.length ||
    expectedFamilies.some((family) => !actualFamilies.includes(family))
  ) {
    diagnostics.push('Project artifact does not declare the complete local runtime family.');
  }

  const filePaths = artifact.sourceState.files.map((file) => file.path);
  if (
    filePaths.some((path, index) => index > 0 && filePaths[index - 1]!.localeCompare(path) >= 0)
  ) {
    diagnostics.push('Project source files must be unique and sorted.');
  }
  if (filePaths.some((path) => path === '.skopos' || path.startsWith('.skopos/'))) {
    diagnostics.push('Project source state must not digest generated .skopos files.');
  }

  return {
    status: diagnostics.length === 0 ? 'pass' : 'fail',
    diagnostics,
  };
};
