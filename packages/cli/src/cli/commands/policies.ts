import { resolve } from 'node:path';

import type {
  SkoposDriftFinding,
  SkoposPolicyOverride,
  SkoposPolicyOverrideArtifact,
  SkoposPolicyRecommendationArtifact,
  SkoposPolicyRoleMappingDecisionArtifact,
  SkoposPolicyRoleMappingDecisionStatus,
  SkoposResolvedPolicyArtifact,
} from '@skopos/model';
import {
  addSkoposPolicyOverrideRuntime,
  applySkoposPolicyPackRuntime,
  buildSkoposPolicyDriftRuntime,
  listSkoposPolicyPacksRuntime,
  listSkoposPolicyOverridesRuntime,
  listSkoposPolicyRoleMappingDecisionsRuntime,
  recommendSkoposPolicyPacksRuntime,
  removeSkoposPolicyRoleMappingDecisionRuntime,
  removeSkoposPolicyOverrideRuntime,
  showSkoposPolicyPackRuntime,
  upsertSkoposPolicyRoleMappingDecisionRuntime,
} from '@skopos/runtime';

import { writeJsonOutput, writeLines } from '../shared/output.js';

interface ParsedTargetArgs {
  cwd: string;
  json: boolean;
  dryRun: boolean;
  actor?: string;
}

interface ParsedPackArgs extends ParsedTargetArgs {
  pack?: string;
  actor?: string;
  reason?: string;
}

interface ParsedOverrideArgs extends ParsedTargetArgs {
  id?: string;
  findingId?: string;
  ruleId?: string;
  packId?: string;
  sourcePath?: string;
  severity?: SkoposPolicyOverride['severity'];
  reason?: string;
  owner?: string;
  expiresAt?: string;
}

interface ParsedMappingArgs extends ParsedTargetArgs {
  id?: string;
  packId?: string;
  role?: string;
  status?: SkoposPolicyRoleMappingDecisionStatus;
  paths: string[];
  reason?: string;
  owner?: string;
}

export const runPoliciesCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (subcommand === 'list') {
    const parsed = parseTargetArgs(rest);
    const result = await listSkoposPolicyPacksRuntime({ cwd: parsed.cwd });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos policy packs',
      ...result.map(
        (pack) =>
          `- ${pack.packId} [${pack.family}/${pack.variant}] ${pack.status} (${pack.rules.length} rules): ${pack.plainLanguageSummary ?? pack.description}`,
      ),
    ]);
    return;
  }

  if (subcommand === 'show') {
    const parsed = parsePackArgs(rest);
    if (!parsed.pack) {
      throw new Error('Missing policy pack id or manifest path.');
    }

    const result = await showSkoposPolicyPackRuntime({ cwd: parsed.cwd, pack: parsed.pack });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines([
      'Skopos policy pack',
      `- id: ${result.packId}`,
      `- family: ${result.family}`,
      `- variant: ${result.variant}`,
      `- version: ${result.version}`,
      `- status: ${result.status}`,
      `- source: ${result.sourcePath}`,
      `- rules: ${result.rules.length}`,
      `- drift checks: ${result.driftCheckIds.length}`,
      `- fixtures: ${result.proofFixtureIds.length}`,
      `- summary: ${result.plainLanguageSummary ?? result.description}`,
    ]);
    if (result.bestFor && result.bestFor.length > 0) {
      writeLines(['- best for:', ...result.bestFor.map((entry) => `  - ${entry}`)]);
    }
    if (result.qualityBar && result.qualityBar.length > 0) {
      writeLines(['- quality bar:', ...result.qualityBar.map((entry) => `  - ${entry}`)]);
    }
    return;
  }

  if (subcommand === 'recommend') {
    const parsed = parseTargetArgs(rest);
    const result = await recommendSkoposPolicyPacksRuntime({
      cwd: parsed.cwd,
      dryRun: parsed.dryRun,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines(buildPolicyRecommendationLines(result));
    return;
  }

  if (subcommand === 'apply') {
    const parsed = parsePackArgs(rest);
    if (!parsed.pack) {
      throw new Error('Missing policy pack id or manifest path.');
    }

    const result = await applySkoposPolicyPackRuntime({
      cwd: parsed.cwd,
      pack: parsed.pack,
      actor: parsed.actor,
      reason: parsed.reason,
      dryRun: parsed.dryRun,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines(
      buildPolicyAppliedLines({
        policySourcePath: result.policySourcePath,
        policySourceWrite: result.policySourceWrite,
        policy: result.policy,
        policyWrite: result.policyWrite,
        policyBriefWrite: result.policyBriefWrite,
        agentsWrite: result.agentsWrite,
        dryRun: parsed.dryRun,
      }),
    );
    return;
  }

  if (subcommand === 'drift') {
    const parsed = parseTargetArgs(rest);
    const result = await buildSkoposPolicyDriftRuntime({
      cwd: parsed.cwd,
      actor: parsed.actor,
      dryRun: parsed.dryRun,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines(
      buildPolicyDriftLines({
        reportPath: result.reportPath,
        findings: result.report.findings,
        counts: result.report.counts,
      }),
    );
    return;
  }

  if (subcommand === 'overrides') {
    await runPolicyOverridesCommand(rest);
    return;
  }

  if (subcommand === 'mappings') {
    await runPolicyMappingsCommand(rest);
    return;
  }

  throw new Error(`Unknown Skopos policies subcommand: ${subcommand ?? '(missing)'}`);
};

const runPolicyMappingsCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (!subcommand || subcommand === 'list') {
    const parsed = parseTargetArgs(subcommand ? rest : args);
    const result = await listSkoposPolicyRoleMappingDecisionsRuntime({ cwd: parsed.cwd });
    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines(buildPolicyMappingDecisionLines(result));
    return;
  }

  if (subcommand === 'confirm' || subcommand === 'ignore') {
    const parsed = parseMappingArgs(rest, subcommand === 'confirm' ? 'confirmed' : 'ignored');
    if (!parsed.packId) {
      throw new Error('Missing --pack for policy role mapping decision.');
    }
    if (!parsed.role) {
      throw new Error('Missing --role for policy role mapping decision.');
    }
    if (!parsed.reason) {
      throw new Error('Missing --reason for policy role mapping decision.');
    }

    const result = await upsertSkoposPolicyRoleMappingDecisionRuntime({
      cwd: parsed.cwd,
      packId: parsed.packId,
      role: parsed.role,
      status: parsed.status ?? (subcommand === 'confirm' ? 'confirmed' : 'ignored'),
      matchedPaths: parsed.paths,
      reason: parsed.reason,
      owner: parsed.owner,
      actor: parsed.actor,
      dryRun: parsed.dryRun,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines(buildPolicyMappingDecisionWriteLines(result.artifact, result.artifactWrite, result.roleMappingWrite));
    return;
  }

  if (subcommand === 'remove') {
    const parsed = parseMappingArgs(rest);
    if (!parsed.id) {
      throw new Error('Missing policy role mapping decision id.');
    }

    const result = await removeSkoposPolicyRoleMappingDecisionRuntime({
      cwd: parsed.cwd,
      id: parsed.id,
      actor: parsed.actor,
      dryRun: parsed.dryRun,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines(buildPolicyMappingDecisionWriteLines(result.artifact, result.artifactWrite, result.roleMappingWrite));
    return;
  }

  throw new Error(`Unknown Skopos policies mappings subcommand: ${subcommand}`);
};

const runPolicyOverridesCommand = async (args: string[]): Promise<void> => {
  const [subcommand, ...rest] = args;

  if (!subcommand || subcommand === 'list') {
    const parsed = parseTargetArgs(subcommand ? rest : args);
    const result = await listSkoposPolicyOverridesRuntime({ cwd: parsed.cwd });
    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines(buildPolicyOverrideLines(result));
    return;
  }

  if (subcommand === 'add') {
    const parsed = parseOverrideArgs(rest);
    if (!parsed.reason) {
      throw new Error('Missing --reason for policy override.');
    }

    const result = await addSkoposPolicyOverrideRuntime({
      cwd: parsed.cwd,
      id: parsed.id,
      findingId: parsed.findingId,
      ruleId: parsed.ruleId,
      packId: parsed.packId,
      sourcePath: parsed.sourcePath,
      severity: parsed.severity,
      reason: parsed.reason,
      owner: parsed.owner,
      expiresAt: parsed.expiresAt,
      actor: parsed.actor,
      dryRun: parsed.dryRun,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines(buildPolicyOverrideWriteLines(result.artifact, result.artifactWrite, result.resolvedPolicyWrite));
    return;
  }

  if (subcommand === 'remove') {
    const parsed = parseOverrideArgs(rest);
    if (!parsed.id) {
      throw new Error('Missing policy override id.');
    }

    const result = await removeSkoposPolicyOverrideRuntime({
      cwd: parsed.cwd,
      id: parsed.id,
      actor: parsed.actor,
      dryRun: parsed.dryRun,
    });

    if (parsed.json) {
      writeJsonOutput(result);
      return;
    }

    writeLines(buildPolicyOverrideWriteLines(result.artifact, result.artifactWrite, result.resolvedPolicyWrite));
    return;
  }

  throw new Error(`Unknown Skopos policies overrides subcommand: ${subcommand}`);
};

const parseTargetArgs = (args: string[]): ParsedTargetArgs => {
  let cwd = process.cwd();
  let json = false;
  let dryRun = false;
  let actor: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (argument === '--actor') {
      actor = requireValue(args, index, '--actor');
      index += 1;
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos policies flag: ${argument}`);
    }

    cwd = resolve(argument);
  }

  return { cwd, json, dryRun, actor };
};

const parsePackArgs = (args: string[]): ParsedPackArgs => {
  let cwd = process.cwd();
  let pack: string | undefined;
  let json = false;
  let dryRun = false;
  let actor: string | undefined;
  let reason: string | undefined;
  let targetProvided = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (argument === '--actor') {
      actor = requireValue(args, index, '--actor');
      index += 1;
      continue;
    }

    if (argument === '--reason') {
      reason = requireValue(args, index, '--reason');
      index += 1;
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos policies flag: ${argument}`);
    }

    if (!pack) {
      pack = argument;
      continue;
    }

    if (targetProvided) {
      throw new Error(`Unexpected extra policies target: ${argument}`);
    }

    cwd = resolve(argument);
    targetProvided = true;
  }

  return { cwd, pack, json, dryRun, actor, reason };
};

const parseOverrideArgs = (args: string[]): ParsedOverrideArgs => {
  let cwd = process.cwd();
  let id: string | undefined;
  let findingId: string | undefined;
  let ruleId: string | undefined;
  let packId: string | undefined;
  let sourcePath: string | undefined;
  let severity: SkoposPolicyOverride['severity'] | undefined;
  let reason: string | undefined;
  let owner: string | undefined;
  let expiresAt: string | undefined;
  let actor: string | undefined;
  let json = false;
  let dryRun = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (argument === '--id') {
      id = requireValue(args, index, '--id');
      index += 1;
      continue;
    }

    if (argument === '--finding') {
      findingId = requireValue(args, index, '--finding');
      index += 1;
      continue;
    }

    if (argument === '--rule') {
      ruleId = requireValue(args, index, '--rule');
      index += 1;
      continue;
    }

    if (argument === '--pack') {
      packId = requireValue(args, index, '--pack');
      index += 1;
      continue;
    }

    if (argument === '--source-path') {
      sourcePath = requireValue(args, index, '--source-path');
      index += 1;
      continue;
    }

    if (argument === '--severity') {
      severity = parseOverrideSeverity(requireValue(args, index, '--severity'));
      index += 1;
      continue;
    }

    if (argument === '--reason') {
      reason = requireValue(args, index, '--reason');
      index += 1;
      continue;
    }

    if (argument === '--owner') {
      owner = requireValue(args, index, '--owner');
      index += 1;
      continue;
    }

    if (argument === '--expires-at') {
      expiresAt = requireValue(args, index, '--expires-at');
      index += 1;
      continue;
    }

    if (argument === '--actor') {
      actor = requireValue(args, index, '--actor');
      index += 1;
      continue;
    }

    if (argument === '--cwd') {
      cwd = resolve(requireValue(args, index, '--cwd'));
      index += 1;
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos policies overrides flag: ${argument}`);
    }

    if (!id) {
      id = argument;
      continue;
    }

    cwd = resolve(argument);
  }

  return { cwd, id, findingId, ruleId, packId, sourcePath, severity, reason, owner, expiresAt, actor, json, dryRun };
};

const parseMappingArgs = (
  args: string[],
  status?: SkoposPolicyRoleMappingDecisionStatus,
): ParsedMappingArgs => {
  let cwd = process.cwd();
  let id: string | undefined;
  let packId: string | undefined;
  let role: string | undefined;
  const paths: string[] = [];
  let reason: string | undefined;
  let owner: string | undefined;
  let actor: string | undefined;
  let json = false;
  let dryRun = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--json') {
      json = true;
      continue;
    }

    if (argument === '--dry-run') {
      dryRun = true;
      continue;
    }

    if (argument === '--id') {
      id = requireValue(args, index, '--id');
      index += 1;
      continue;
    }

    if (argument === '--pack') {
      packId = requireValue(args, index, '--pack');
      index += 1;
      continue;
    }

    if (argument === '--role') {
      role = requireValue(args, index, '--role');
      index += 1;
      continue;
    }

    if (argument === '--path') {
      paths.push(requireValue(args, index, '--path'));
      index += 1;
      continue;
    }

    if (argument === '--reason') {
      reason = requireValue(args, index, '--reason');
      index += 1;
      continue;
    }

    if (argument === '--owner') {
      owner = requireValue(args, index, '--owner');
      index += 1;
      continue;
    }

    if (argument === '--actor') {
      actor = requireValue(args, index, '--actor');
      index += 1;
      continue;
    }

    if (argument === '--cwd') {
      cwd = resolve(requireValue(args, index, '--cwd'));
      index += 1;
      continue;
    }

    if (argument.startsWith('-')) {
      throw new Error(`Unknown Skopos policies mappings flag: ${argument}`);
    }

    if (!id && !packId && !role) {
      id = argument;
      continue;
    }

    cwd = resolve(argument);
  }

  return { cwd, id, packId, role, status, paths, reason, owner, actor, json, dryRun };
};

const parseOverrideSeverity = (value: string): SkoposPolicyOverride['severity'] => {
  if (value === 'must' || value === 'should' || value === 'advisory') {
    return value;
  }

  throw new Error(`Invalid policy override severity: ${value}`);
};

const requireValue = (args: string[], index: number, flag: string): string => {
  const value = args[index + 1];
  if (!value || value.startsWith('-')) {
    throw new Error(`Missing value for ${flag}.`);
  }

  return value;
};

const buildPolicyRecommendationLines = (
  result: SkoposPolicyRecommendationArtifact,
): string[] => {
  const applyRecommendations = result.recommendations.filter(
    (entry) => entry.recommendation === 'apply',
  );
  const reviewRecommendations = result.recommendations.filter(
    (entry) => entry.recommendation === 'review',
  );
  const avoidRecommendations = result.recommendations.filter(
    (entry) => entry.recommendation === 'avoid',
  );
  const firstApply = applyRecommendations[0];
  const firstReview = reviewRecommendations[0];
  const lines = [
    'Skopos policy recommendations',
    'Status: Recommendation ready',
    `Summary: Skopos reviewed ${result.recommendations.length} policy pack${result.recommendations.length === 1 ? '' : 's'} for a ${result.projectLifecycle} project.`,
    `Repository: ${result.repositoryProfile.primaryFamily} (${result.repositoryProfile.confidence} confidence)${result.repositoryProfile.languages.length > 0 ? `; languages: ${result.repositoryProfile.languages.join(', ')}` : ''}.`,
    `Default work lane: ${result.defaultTaskRisk}`,
  ];

  if (applyRecommendations.length > 0) {
    lines.push('Recommended packs:');
    for (const entry of applyRecommendations) {
      lines.push(`- Apply ${entry.packId} (${entry.family}/${entry.variant}): ${entry.reason}`);
      if (entry.plainLanguageSummary) {
        lines.push(`  ${entry.plainLanguageSummary}`);
      }
    }
  }

  if (reviewRecommendations.length > 0) {
    lines.push('Needs human review:');
    for (const entry of reviewRecommendations) {
      const prefix = entry.accepted ? 'Already accepted' : 'Review';
      lines.push(`- ${prefix} ${entry.packId} (${entry.family}/${entry.variant}): ${entry.reason}`);
      if (entry.plainLanguageSummary) {
        lines.push(`  ${entry.plainLanguageSummary}`);
      }
    }
  }

  if (avoidRecommendations.length > 0) {
    lines.push('Not recommended now:');
    for (const entry of avoidRecommendations) {
      lines.push(`- Avoid ${entry.packId} (${entry.family}/${entry.variant}): ${entry.reason}`);
    }
  }

  if (firstApply) {
    lines.push(
      'Next step:',
      `Run \`skopos policies apply ${firstApply.packId} .\` from the project root if this recommendation matches your project.`,
    );
  } else if (firstReview) {
    lines.push(
      'Next step:',
      `Review \`${firstReview.packId}\` before accepting it because Skopos could not safely auto-recommend it.`,
    );
  } else {
    lines.push('Next step:', 'No policy pack should be applied right now.');
  }

  return lines;
};

const buildPolicyAppliedLines = ({
  policySourcePath,
  policySourceWrite,
  policy,
  policyWrite,
  policyBriefWrite,
  agentsWrite,
  dryRun,
}: {
  policySourcePath: string;
  policySourceWrite: 'written' | 'dry-run';
  policy: SkoposResolvedPolicyArtifact;
  policyWrite: 'written' | 'dry-run';
  policyBriefWrite: 'written' | 'dry-run';
  agentsWrite: 'written' | 'dry-run';
  dryRun: boolean;
}): string[] => {
  const packs = policy.acceptedPacks.map((entry) => entry.packId).join(', ');
  const lines = [
    'Skopos policy apply',
    `Status: ${dryRun ? 'Preview only' : 'Policy accepted'}`,
    `Summary: ${dryRun ? 'Skopos previewed the policy update without changing files.' : `Skopos accepted ${packs} as project policy.`}`,
    `Accepted packs: ${policy.acceptedPacks.length}`,
    `Active rules: ${policy.activeRules.length}`,
    `Default work lane: ${policy.defaultTaskRisk}`,
    'Updated surfaces:',
    `- Tracked policy source: ${policySourcePath} (${policySourceWrite})`,
    `- Resolved local projection: ${policyWrite}`,
    `- Agent policy projection: ${policyBriefWrite}`,
    `- AGENTS.md derived policy projection: ${agentsWrite}`,
    'Next step:',
  ];

  if (dryRun) {
    lines.push(`Run \`skopos policies apply ${policy.acceptedPacks[0]?.packId ?? '<pack>'} .\` without \`--dry-run\` when you are ready to accept it.`);
  } else {
    lines.push('Run `skopos policies drift .` to check the project against the accepted policy.');
  }

  return lines;
};

const buildPolicyDriftLines = ({
  reportPath,
  counts,
  findings,
}: {
  reportPath: string;
  counts: {
    openMustCount: number;
    openShouldCount: number;
    advisoryCount: number;
  };
  findings: SkoposDriftFinding[];
}): string[] => {
  const openFindings = findings.filter((finding) => finding.status === 'open');
  const firstFinding = openFindings[0];
  const status =
    counts.openMustCount > 0
      ? 'Fix before closing'
      : counts.openShouldCount > 0 || counts.advisoryCount > 0
        ? 'Review needed'
        : 'Looks good';
  const lines = [
    'Skopos policy drift',
    `Status: ${status}`,
    `Summary: ${buildPolicyDriftSummary(counts)}`,
    `Report: ${reportPath}`,
  ];

  if (openFindings.length > 0) {
    lines.push('Attention:');
    for (const finding of openFindings.slice(0, 5)) {
      lines.push(
        `- ${describePolicyFindingSeverity(finding)}: ${finding.ruleId ?? finding.id}${finding.sourcePath ? ` in ${finding.sourcePath}` : ''} - ${finding.summary}`,
      );
    }
    if (openFindings.length > 5) {
      lines.push(`- ${openFindings.length - 5} more finding${openFindings.length - 5 === 1 ? '' : 's'} in the report.`);
    }
  }

  lines.push('Next step:');
  if (firstFinding) {
    lines.push(
      `${firstFinding.remediation[0] ?? 'Fix the first open drift finding.'} Then run \`skopos policies drift .\` again.`,
    );
  } else {
    lines.push('No policy drift needs action right now. Keep this report fresh before closure.');
  }

  return lines;
};

const buildPolicyDriftSummary = (counts: {
  openMustCount: number;
  openShouldCount: number;
  advisoryCount: number;
}): string => {
  if (counts.openMustCount > 0) {
    return `Skopos found ${counts.openMustCount} blocking policy issue${counts.openMustCount === 1 ? '' : 's'} and ${counts.openShouldCount} review item${counts.openShouldCount === 1 ? '' : 's'}.`;
  }

  if (counts.openShouldCount > 0 || counts.advisoryCount > 0) {
    return `Skopos found ${counts.openShouldCount} review item${counts.openShouldCount === 1 ? '' : 's'} and ${counts.advisoryCount} advisory item${counts.advisoryCount === 1 ? '' : 's'}.`;
  }

  return 'No open accepted-policy drift was detected.';
};

const buildPolicyOverrideLines = (artifact: SkoposPolicyOverrideArtifact): string[] => {
  const lines = [
    'Skopos policy overrides',
    `Status: ${artifact.overrides.length === 0 ? 'No overrides' : 'Overrides active'}`,
    `Summary: ${artifact.summary ?? 'Tracked policy overrides record intentional exceptions to accepted policy drift.'}`,
  ];

  if (artifact.overrides.length > 0) {
    lines.push('Overrides:');
    for (const override of artifact.overrides) {
      lines.push(`- ${override.id}: ${override.reason}`);
      const matchers = [
        override.findingId ? `finding ${override.findingId}` : undefined,
        override.ruleId ? `rule ${override.ruleId}` : undefined,
        override.packId ? `pack ${override.packId}` : undefined,
        override.sourcePath ? `path ${override.sourcePath}` : undefined,
      ].filter((entry): entry is string => Boolean(entry));
      if (matchers.length > 0) {
        lines.push(`  Matches: ${matchers.join(', ')}`);
      }
      if (override.severity) {
        lines.push(`  Changes severity to: ${override.severity}`);
      } else {
        lines.push('  Action: suppress matching drift finding');
      }
      if (override.owner || override.expiresAt) {
        lines.push(`  Owner/expiry: ${override.owner ?? 'unowned'}${override.expiresAt ? `, expires ${override.expiresAt}` : ''}`);
      }
    }
  }

  lines.push(
    'Next step:',
    artifact.overrides.length === 0
      ? 'Add an override only for an intentional local exception with a clear reason and owner.'
      : 'Run `skopos policies drift .` after changing overrides so the drift report reflects the current local policy.',
  );

  return lines;
};

const buildPolicyOverrideWriteLines = (
  artifact: SkoposPolicyOverrideArtifact,
  artifactWrite: 'written' | 'dry-run',
  resolvedPolicyWrite: 'written' | 'dry-run' | 'not-present',
): string[] => [
  'Skopos policy overrides',
  `Status: ${artifactWrite === 'dry-run' ? 'Preview only' : 'Overrides updated'}`,
  `Summary: ${artifact.summary ?? `${artifact.overrides.length} override${artifact.overrides.length === 1 ? '' : 's'} configured.`}`,
  `Tracked policy source (tools/skopos/policies.yaml): ${artifactWrite}`,
  `Resolved local projection: ${resolvedPolicyWrite}`,
  'Next step:',
  'Run `skopos policies drift .` so Guards and Readiness use the updated override state.',
];

const buildPolicyMappingDecisionLines = (
  artifact: SkoposPolicyRoleMappingDecisionArtifact,
): string[] => {
  const lines = [
    'Skopos role mapping decisions',
    `Status: ${artifact.decisions.length === 0 ? 'No decisions' : 'Decisions active'}`,
    `Summary: ${artifact.summary ?? 'Tracked role mapping decisions confirm or ignore inferred pack role mappings.'}`,
  ];

  if (artifact.decisions.length > 0) {
    lines.push('Decisions:');
    for (const decision of artifact.decisions) {
      lines.push(`- ${decision.id}: ${decision.status} ${decision.packId} / ${decision.role}`);
      lines.push(`  Reason: ${decision.reason}`);
      if (decision.matchedPaths && decision.matchedPaths.length > 0) {
        lines.push(`  Paths: ${decision.matchedPaths.join(', ')}`);
      }
      if (decision.owner) {
        lines.push(`  Owner: ${decision.owner}`);
      }
    }
  }

  lines.push(
    'Next step:',
    artifact.decisions.length === 0
      ? 'Confirm a role when the inferred folder mapping is correct, or ignore a role when the project intentionally does not use it.'
      : 'Refresh the Rules UI or run `skopos policies mappings list --json` to review the tracked mapping decisions.',
  );

  return lines;
};

const buildPolicyMappingDecisionWriteLines = (
  artifact: SkoposPolicyRoleMappingDecisionArtifact,
  artifactWrite: 'written' | 'dry-run',
  roleMappingWrite: 'written' | 'dry-run' | 'not-present',
): string[] => [
  'Skopos role mapping decisions',
  `Status: ${artifactWrite === 'dry-run' ? 'Preview only' : 'Decision updated'}`,
  `Summary: ${artifact.summary ?? `${artifact.decisions.length} role mapping decision${artifact.decisions.length === 1 ? '' : 's'} configured.`}`,
  `Tracked policy source (tools/skopos/policies.yaml): ${artifactWrite}`,
  `Resolved local role mapping: ${roleMappingWrite}`,
  'Next step:',
  'Open the Rules pack detail page to confirm the saved mapping now reflects the project structure.',
];

const describePolicyFindingSeverity = (finding: SkoposDriftFinding): string => {
  if (finding.severity === 'must') {
    return 'Fix before closing';
  }

  if (finding.severity === 'should') {
    return 'Review this';
  }

  return 'Advisory';
};
