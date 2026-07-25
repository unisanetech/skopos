import type { SkoposEnforcementProfileArtifact } from '@skopos/model';

const REQUIRED_HOST_IDS = [
  'codex',
  'claude-code',
  'cursor',
  'github-copilot',
  'manual-hosts',
] as const;

export interface ValidateSkoposHostProjectionModelResult {
  status: 'pass' | 'fail';
  diagnostics: string[];
}

export const validateSkoposHostProjectionModel = (
  profile: SkoposEnforcementProfileArtifact,
): ValidateSkoposHostProjectionModelResult => {
  const diagnostics: string[] = [];
  const model = profile.hostProjectionModel;
  if (!model) {
    return {
      status: 'fail',
      diagnostics: ['Host projection model is missing from the enforcement profile.'],
    };
  }
  const ruleIds = profile.rules.map((rule) => rule.id);

  if (model.authority !== 'skopos-project-model') {
    diagnostics.push('Host projection authority is not the Skopos project model.');
  }
  if (model.instructionSourcePath !== profile.instructionSourcePath) {
    diagnostics.push('Host projection instruction source differs from the enforcement profile.');
  }
  if (!sameIds(model.enforcementRuleIds, ruleIds)) {
    diagnostics.push('Host projection enforcement rules differ from the project model.');
  }

  const hostsById = new Map(model.hosts.map((host) => [host.hostId, host]));
  if (hostsById.size !== model.hosts.length) {
    diagnostics.push('Host projection model contains duplicate host ids.');
  }
  for (const hostId of REQUIRED_HOST_IDS) {
    const host = hostsById.get(hostId);
    if (!host) {
      diagnostics.push(`Host projection ${hostId} is missing.`);
      continue;
    }
    if (!sameIds(host.enforcementRuleIds, ruleIds)) {
      diagnostics.push(`Host projection ${hostId} does not carry the full enforcement contract.`);
    }
  }

  const adaptersById = new Map(profile.toolAdapters.map((adapter) => [adapter.toolId, adapter]));
  for (const hostId of ['codex', 'claude-code', 'manual-hosts']) {
    const host = hostsById.get(hostId);
    const adapter = adaptersById.get(hostId);
    if (!host || !adapter || host.adapterPath !== adapter.path) {
      diagnostics.push(`Host projection ${hostId} is not aligned with its adapter.`);
    }
  }

  const mirrorPaths = model.hosts
    .filter((host) => host.instructionProjection === 'mirror')
    .map((host) => host.instructionPath);
  if (
    !sameIds(mirrorPaths, [
      'CLAUDE.md',
      '.cursor/rules/project.mdc',
      '.github/copilot-instructions.md',
    ])
  ) {
    diagnostics.push('Generated instruction mirrors differ from the host projection model.');
  }

  return {
    status: diagnostics.length === 0 ? 'pass' : 'fail',
    diagnostics,
  };
};

const sameIds = (left: string[], right: string[]): boolean => {
  const normalizedLeft = [...new Set(left)].sort();
  const normalizedRight = [...new Set(right)].sort();
  return (
    normalizedLeft.length === normalizedRight.length &&
    normalizedLeft.every((value, index) => value === normalizedRight[index])
  );
};
