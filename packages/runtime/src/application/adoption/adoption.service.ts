import { access, readFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { loadSkoposConfig } from '@skopos/config';
import {
  buildSkoposAdoptionAssessment,
  buildSkoposAdoptionProposal,
  parseSkoposAdoptionExecutionInput,
  SKOPOS_ADOPTION_ACTIVATION_PATH,
  SKOPOS_ADOPTION_ANALYSIS_PATH,
  SKOPOS_ADOPTION_ANALYSIS_BRIEF_PATH,
  SKOPOS_ADOPTION_APPROVAL_PATH,
  SKOPOS_ADOPTION_EXECUTION_BRIEF_PATH,
  SKOPOS_ADOPTION_INTAKE_PATH,
  SKOPOS_ADOPTION_PROPOSAL_PATH,
  SKOPOS_ADOPTION_VERIFICATION_PATH,
} from '@skopos/docs-engine';
import { buildSkoposDocumentCatalog } from '@skopos/indexer';
import { checkInstructionMirrorParity } from '@skopos/instructions';
import type {
  SkoposAdoptionAssessmentRuntimeResult,
  SkoposAdoptionActivationArtifact,
  SkoposAdoptionActivationRuntimeResult,
  SkoposAdoptionApprovalArtifact,
  SkoposAdoptionApprovalRuntimeResult,
  SkoposAdoptionExecutionBriefArtifact,
  SkoposAdoptionIntakeArtifact,
  SkoposAdoptionProposalRuntimeResult,
  SkoposAdoptionRestructuringProposalArtifact,
  SkoposAdoptionVerificationArtifact,
  SkoposAdoptionVerificationCheck,
  SkoposAdoptionVerificationRuntimeResult,
  SkoposBootstrapArtifact,
  SkoposScopesLiteArtifact,
} from '@skopos/model';

import {
  appendSkoposOperationalLogEntry,
  refreshSkoposKnowledgeIndex,
} from '../shared/knowledge-state.js';
import { resolveSkoposRuntimeActorId } from '../shared/runtime-actor.js';
import { writeJsonArtifact } from '../shared/write-json-artifact.js';

export interface BuildSkoposAdoptionAssessmentRuntimeOptions {
  cwd: string;
  actor?: string;
  dryRun?: boolean;
}

export interface BuildSkoposAdoptionProposalRuntimeOptions {
  cwd: string;
  inputPath: string;
  actor?: string;
  dryRun?: boolean;
}

export interface BuildSkoposAdoptionApprovalRuntimeOptions {
  cwd: string;
  proposalDigest: string;
  actor?: string;
  reason: string;
  acceptMaterialRisk?: boolean;
  dryRun?: boolean;
}

export interface BuildSkoposAdoptionVerificationRuntimeOptions {
  cwd: string;
  inputPath: string;
  actor?: string;
  dryRun?: boolean;
}

export interface BuildSkoposAdoptionActivationRuntimeOptions {
  cwd: string;
  actor?: string;
  reason: string;
  dryRun?: boolean;
}

export const hasActiveSkoposAdoptionRuntime = async ({
  cwd,
}: {
  cwd: string;
}): Promise<boolean> => {
  const workspaceRoot = resolve(cwd);
  const [proposal, approval, verification, activation] = await Promise.all([
    readJsonIfExists<SkoposAdoptionRestructuringProposalArtifact>(
      join(workspaceRoot, SKOPOS_ADOPTION_PROPOSAL_PATH),
    ),
    readJsonIfExists<SkoposAdoptionApprovalArtifact>(
      join(workspaceRoot, SKOPOS_ADOPTION_APPROVAL_PATH),
    ),
    readJsonIfExists<SkoposAdoptionVerificationArtifact>(
      join(workspaceRoot, SKOPOS_ADOPTION_VERIFICATION_PATH),
    ),
    readJsonIfExists<SkoposAdoptionActivationArtifact>(
      join(workspaceRoot, SKOPOS_ADOPTION_ACTIVATION_PATH),
    ),
  ]);

  if (!proposal || !approval || !verification || !activation) return false;
  if (
    proposal.proposalDigest !== approval.proposalDigest ||
    proposal.proposalDigest !== verification.proposalDigest ||
    proposal.proposalDigest !== activation.proposalDigest
  ) {
    return false;
  }
  if (
    activation.status !== 'active' ||
    activation.adoptionState !== 'agent-ready' ||
    verification.adoptionState !== 'standard-verified' ||
    verification.checks.some((check) => check.status !== 'pass')
  ) {
    return false;
  }

  const proposedIds = proposal.operations.map((operation) => operation.id).sort();
  const approvedIds = [...approval.approvedOperationIds].sort();
  const verifiedIds = [...verification.verifiedOperationIds].sort();
  const activatedIds = [...activation.verifiedOperationIds].sort();
  return (
    JSON.stringify(proposedIds) === JSON.stringify(approvedIds) &&
    JSON.stringify(proposedIds) === JSON.stringify(verifiedIds) &&
    JSON.stringify(proposedIds) === JSON.stringify(activatedIds)
  );
};

export const buildSkoposAdoptionAssessmentRuntime = async ({
  cwd,
  actor,
  dryRun = false,
}: BuildSkoposAdoptionAssessmentRuntimeOptions): Promise<SkoposAdoptionAssessmentRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  const [bootstrap, scopes, config] = await Promise.all([
    readJson<SkoposBootstrapArtifact>(
      join(workspaceRoot, '.skopos', 'index', 'bootstrap.json'),
    ),
    readJson<SkoposScopesLiteArtifact>(
      join(workspaceRoot, '.skopos', 'index', 'scopes.json'),
    ),
    loadSkoposConfig(join(workspaceRoot, 'skopos.config.yaml')),
  ]);
  const catalog = await buildSkoposDocumentCatalog({
    cwd: workspaceRoot,
    config: config
      ? {
          ...config,
          docs: {
            ...config.docs,
            strictMetadata: false,
            strictLinking: false,
          },
        }
      : config,
  });
  const generatedAt = new Date().toISOString();
  const { intake, analysisBrief } = await buildSkoposAdoptionAssessment({
    workspaceRoot,
    generatedAt,
    bootstrap,
    scopes: scopes.scopes,
    documents: catalog.documents,
    catalogIssues: catalog.issues,
  });
  const intakePath = join(workspaceRoot, SKOPOS_ADOPTION_INTAKE_PATH);
  const analysisBriefPath = join(workspaceRoot, SKOPOS_ADOPTION_ANALYSIS_BRIEF_PATH);
  const previousIntake = await readJsonIfExists<SkoposAdoptionIntakeArtifact>(intakePath);
  if (
    !dryRun &&
    previousIntake &&
    previousIntake.inputDigest !== intake.inputDigest
  ) {
    await Promise.all([
      rm(join(workspaceRoot, SKOPOS_ADOPTION_ANALYSIS_PATH), { force: true }),
      rm(join(workspaceRoot, SKOPOS_ADOPTION_PROPOSAL_PATH), { force: true }),
      rm(join(workspaceRoot, SKOPOS_ADOPTION_APPROVAL_PATH), { force: true }),
      rm(join(workspaceRoot, SKOPOS_ADOPTION_EXECUTION_BRIEF_PATH), { force: true }),
      rm(join(workspaceRoot, SKOPOS_ADOPTION_VERIFICATION_PATH), { force: true }),
      rm(join(workspaceRoot, SKOPOS_ADOPTION_ACTIVATION_PATH), { force: true }),
    ]);
  }
  const [intakeWrite, analysisBriefWrite] = await Promise.all([
    writeJsonArtifact({
      artifactPath: intakePath,
      artifact: intake,
      dryRun,
    }),
    writeJsonArtifact({
      artifactPath: analysisBriefPath,
      artifact: analysisBrief,
      dryRun,
    }),
  ]);
  const logResult = await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'understanding',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary: `Read-only adoption assessment recorded ${intake.documents.length} documents, ${intake.authorityConflicts.length} authority conflicts, and ${intake.memoryRoleGaps.length} Memory role gaps; agent analysis remains required.`,
    relatedArtifactPaths: [intakePath, analysisBriefPath],
    metadata: {
      actorId: actorId ?? null,
      adoptionState: intake.adoptionState,
      assessmentOnly: true,
      documentCount: intake.documents.length,
      authorityConflictCount: intake.authorityConflicts.length,
      memoryRoleGapCount: intake.memoryRoleGaps.length,
      inputDigest: intake.inputDigest,
    },
    dryRun,
  });
  const indexResult = await refreshSkoposKnowledgeIndex({
    workspaceRoot,
    dryRun,
  });

  return {
    workspaceRoot,
    adoptionState: 'agent-analysis-required',
    assessmentOnly: true,
    intakePath,
    analysisBriefPath,
    intakeWrite,
    analysisBriefWrite,
    indexPath: indexResult.path,
    indexWrite: indexResult.write,
    logPath: logResult.path,
    logWrite: logResult.write,
    actorId,
    intake,
    analysisBrief,
  };
};

export const buildSkoposAdoptionProposalRuntime = async ({
  cwd,
  inputPath,
  actor,
  dryRun = false,
}: BuildSkoposAdoptionProposalRuntimeOptions): Promise<SkoposAdoptionProposalRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  if (!actorId) {
    throw new Error('Reviewed adoption analysis requires an explicit actor.');
  }
  const intakePath = join(workspaceRoot, SKOPOS_ADOPTION_INTAKE_PATH);
  const [intake, input] = await Promise.all([
    readJson<SkoposAdoptionIntakeArtifact>(intakePath),
    readJson<unknown>(resolve(inputPath)),
  ]);
  const generatedAt = new Date().toISOString();
  const { analysis, proposal } = await buildSkoposAdoptionProposal({
    workspaceRoot,
    generatedAt,
    actorId,
    intake,
    input,
  });
  const analysisPath = join(workspaceRoot, SKOPOS_ADOPTION_ANALYSIS_PATH);
  const proposalPath = join(workspaceRoot, SKOPOS_ADOPTION_PROPOSAL_PATH);
  const approvalPath = join(workspaceRoot, SKOPOS_ADOPTION_APPROVAL_PATH);
  const executionBriefPath = join(
    workspaceRoot,
    SKOPOS_ADOPTION_EXECUTION_BRIEF_PATH,
  );
  const verificationPath = join(workspaceRoot, SKOPOS_ADOPTION_VERIFICATION_PATH);
  const activationPath = join(workspaceRoot, SKOPOS_ADOPTION_ACTIVATION_PATH);
  const analysisWrite = await writeJsonArtifact({
    artifactPath: analysisPath,
    artifact: analysis,
    dryRun,
  });
  const proposalWrite = proposal
    ? await writeJsonArtifact({
        artifactPath: proposalPath,
        artifact: proposal,
        dryRun,
      })
    : undefined;

  if (!proposal && !dryRun) {
    await rm(proposalPath, { force: true });
    await rm(approvalPath, { force: true });
    await rm(executionBriefPath, { force: true });
    await rm(verificationPath, { force: true });
    await rm(activationPath, { force: true });
  } else if (proposal && !dryRun) {
    const existingApproval =
      await readJsonIfExists<SkoposAdoptionApprovalArtifact>(approvalPath);
    if (!existingApproval) {
      await rm(executionBriefPath, { force: true });
      await rm(verificationPath, { force: true });
      await rm(activationPath, { force: true });
    } else if (existingApproval.proposalDigest !== proposal.proposalDigest) {
      await rm(approvalPath, { force: true });
      await rm(executionBriefPath, { force: true });
      await rm(verificationPath, { force: true });
      await rm(activationPath, { force: true });
    }
  }

  const logResult = await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'understanding',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary:
      analysis.adoptionState === 'questions-open'
        ? `Agent-reviewed adoption analysis recorded with ${analysis.materialQuestions.length} material question${analysis.materialQuestions.length === 1 ? '' : 's'}; no restructuring proposal was created.`
        : `Agent-reviewed adoption analysis produced approval-required proposal ${proposal?.proposalDigest}.`,
    relatedArtifactPaths: [
      analysisPath,
      ...(proposal ? [proposalPath] : []),
    ],
    metadata: {
      actorId,
      adoptionState: analysis.adoptionState,
      intakeDigest: intake.inputDigest,
      materialQuestionCount: analysis.materialQuestions.length,
      dispositionCount: analysis.documentDispositions.length,
      proposalDigest: proposal?.proposalDigest ?? null,
    },
    dryRun,
  });

  return {
    workspaceRoot,
    adoptionState: analysis.adoptionState,
    analysisPath,
    ...(proposal ? { proposalPath } : {}),
    analysisWrite,
    ...(proposalWrite ? { proposalWrite } : {}),
    logPath: logResult.path,
    logWrite: logResult.write,
    actorId,
    analysis,
    ...(proposal ? { proposal } : {}),
  };
};

export const buildSkoposAdoptionApprovalRuntime = async ({
  cwd,
  proposalDigest,
  actor,
  reason,
  acceptMaterialRisk = false,
  dryRun = false,
}: BuildSkoposAdoptionApprovalRuntimeOptions): Promise<SkoposAdoptionApprovalRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  if (!actorId) {
    throw new Error('Adoption proposal approval requires an explicit actor.');
  }
  if (!reason.trim()) {
    throw new Error('Adoption proposal approval requires an explicit reason.');
  }
  const proposalPath = join(workspaceRoot, SKOPOS_ADOPTION_PROPOSAL_PATH);
  const proposal =
    await readJson<SkoposAdoptionRestructuringProposalArtifact>(proposalPath);
  if (proposal.proposalDigest !== proposalDigest) {
    throw new Error(
      `Proposal digest mismatch. Expected ${proposal.proposalDigest}; received ${proposalDigest}.`,
    );
  }
  if (proposal.approval !== 'pending' || !proposal.requiresApproval) {
    throw new Error('The current restructuring proposal is not awaiting approval.');
  }
  const hasMaterialRisk = proposal.informationLossRisks.some(
    (entry) => entry.risk === 'material',
  );
  if (hasMaterialRisk && !acceptMaterialRisk) {
    throw new Error(
      'This proposal contains material information-loss risk. Re-run with --accept-material-risk only after the user explicitly acknowledges that risk.',
    );
  }
  const approvedAt = new Date().toISOString();
  const approval: SkoposAdoptionApprovalArtifact = {
    schemaVersion: 1,
    id: 'adoption-proposal-approval',
    type: 'adoption-proposal-approval',
    status: 'active',
    authority: 'canonical',
    summary: `Proposal ${proposal.proposalDigest} explicitly approved for agent execution.`,
    updatedAt: approvedAt,
    generatedAt: approvedAt,
    workspaceRoot,
    adoptionState: 'restructuring',
    proposalDigest: proposal.proposalDigest,
    approvedOperationIds: proposal.operations.map((operation) => operation.id),
    materialRiskAccepted: hasMaterialRisk,
    approvedAt,
    approvedByActorId: actorId,
    reason: reason.trim(),
  };
  const approvalPath = join(workspaceRoot, SKOPOS_ADOPTION_APPROVAL_PATH);
  const executionBriefPath = join(
    workspaceRoot,
    SKOPOS_ADOPTION_EXECUTION_BRIEF_PATH,
  );
  const executionBrief = buildAdoptionExecutionBrief({
    workspaceRoot,
    proposal,
    generatedAt: approvedAt,
  });
  const [approvalWrite, executionBriefWrite] = await Promise.all([
    writeJsonArtifact({
      artifactPath: approvalPath,
      artifact: approval,
      dryRun,
    }),
    writeJsonArtifact({
      artifactPath: executionBriefPath,
      artifact: executionBrief,
      dryRun,
    }),
  ]);
  if (!dryRun) {
    await rm(join(workspaceRoot, SKOPOS_ADOPTION_VERIFICATION_PATH), { force: true });
    await rm(join(workspaceRoot, SKOPOS_ADOPTION_ACTIVATION_PATH), { force: true });
  }
  const logResult = await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'understanding',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary: `Restructuring proposal ${proposal.proposalDigest} explicitly approved by ${actorId}; document operations have not been executed.`,
    relatedArtifactPaths: [proposalPath, approvalPath, executionBriefPath],
    metadata: {
      actorId,
      proposalDigest: proposal.proposalDigest,
      operationCount: proposal.operations.length,
      materialRiskAccepted: hasMaterialRisk,
      executed: false,
    },
    dryRun,
  });

  return {
    workspaceRoot,
    adoptionState: 'restructuring',
    proposalPath,
    approvalPath,
    approvalWrite,
    executionBriefPath,
    executionBriefWrite,
    logPath: logResult.path,
    logWrite: logResult.write,
    actorId,
    approval,
    executionBrief,
  };
};

const buildAdoptionExecutionBrief = ({
  workspaceRoot,
  proposal,
  generatedAt,
}: {
  workspaceRoot: string;
  proposal: SkoposAdoptionRestructuringProposalArtifact;
  generatedAt: string;
}): SkoposAdoptionExecutionBriefArtifact => ({
  schemaVersion: 1,
  id: 'adoption-execution-brief',
  type: 'adoption-execution-brief',
  status: 'active',
  authority: 'canonical',
  summary: `Coding-agent execution contract for approved proposal ${proposal.proposalDigest}.`,
  updatedAt: generatedAt,
  generatedAt,
  workspaceRoot,
  adoptionState: 'restructuring',
  proposalDigest: proposal.proposalDigest,
  approvedOperationIds: proposal.operations.map((operation) => operation.id),
  instructions: [
    'Execute only the operations listed in this brief; do not widen document scope.',
    'Use Git-aware moves when an operation changes a path, then repair affected links and coding-agent instructions.',
    'Preserve the retained truth declared by every operation and stop if project evidence contradicts the approved envelope.',
    'After the approved document operations conform, enable docs.strictMetadata and docs.strictLinking in skopos.config.yaml; standard verification checks this configuration activation before adoption can become agent-ready.',
    'Complete each execution evidence summary only after inspecting the resulting files.',
    'Write the completed executionInputTemplate to .skopos/adoption/execution-input.json, then run the verification command.',
  ],
  operations: proposal.operations,
  executionInputTemplate: {
    schemaVersion: 1,
    proposalDigest: proposal.proposalDigest,
    operations: proposal.operations.map((operation) => ({
      operationId: operation.id,
      resultPaths:
        operation.operation === 'delete'
          ? []
          : operation.operation === 'keep'
            ? operation.sourcePaths
            : operation.targetPaths.length > 0
              ? operation.targetPaths
              : operation.sourcePaths,
      summary: `<Describe how ${operation.id} was executed and what evidence was inspected>`,
      retainedTruthVerified: true,
    })),
  },
  verificationCommand:
    'skopos adopt verify . --execution .skopos/adoption/execution-input.json --actor <id>',
});

export const buildSkoposAdoptionVerificationRuntime = async ({
  cwd,
  inputPath,
  actor,
  dryRun = false,
}: BuildSkoposAdoptionVerificationRuntimeOptions): Promise<SkoposAdoptionVerificationRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  if (!actorId) {
    throw new Error('Adoption standard verification requires an explicit actor.');
  }
  const proposalPath = join(workspaceRoot, SKOPOS_ADOPTION_PROPOSAL_PATH);
  const approvalPath = join(workspaceRoot, SKOPOS_ADOPTION_APPROVAL_PATH);
  const [proposal, approval, input, bootstrap, scopes, config] = await Promise.all([
    readJson<SkoposAdoptionRestructuringProposalArtifact>(proposalPath),
    readJson<SkoposAdoptionApprovalArtifact>(approvalPath),
    readJson<unknown>(resolve(inputPath)),
    readJson<SkoposBootstrapArtifact>(
      join(workspaceRoot, '.skopos', 'index', 'bootstrap.json'),
    ),
    readJson<SkoposScopesLiteArtifact>(
      join(workspaceRoot, '.skopos', 'index', 'scopes.json'),
    ),
    loadSkoposConfig(join(workspaceRoot, 'skopos.config.yaml')),
  ]);
  const execution = parseSkoposAdoptionExecutionInput(input);
  assertApprovedExecutionEnvelope({ proposal, approval, execution });
  if (!config) {
    throw new Error('Adoption standard verification requires skopos.config.yaml.');
  }

  const generatedAt = new Date().toISOString();
  const catalog = await buildSkoposDocumentCatalog({ cwd: workspaceRoot, config });
  const assessment = await buildSkoposAdoptionAssessment({
    workspaceRoot,
    generatedAt,
    bootstrap,
    scopes: scopes.scopes,
    documents: catalog.documents,
    catalogIssues: catalog.issues,
  });
  const mirrorParity = await checkInstructionMirrorParity({
    cwd: workspaceRoot,
    instructionSourcePath: config.agents.canonicalInstructions,
    mirrorTargets: config.agents.syncMirrors,
  });
  const checks: SkoposAdoptionVerificationCheck[] = [
    {
      id: 'strict-project-memory',
      status:
        config.docs.strictMetadata && config.docs.strictLinking ? 'pass' : 'fail',
      summary:
        config.docs.strictMetadata && config.docs.strictLinking
          ? 'Strict metadata and linking are enabled.'
          : 'Full adoption requires docs.strictMetadata and docs.strictLinking.',
      paths: ['skopos.config.yaml'],
    },
    await verifyAdoptionOperationTopology(workspaceRoot, proposal, execution),
    {
      id: 'document-contract',
      status: catalog.issues.length === 0 ? 'pass' : 'fail',
      summary:
        catalog.issues.length === 0
          ? 'Project Memory metadata and links conform.'
          : `${catalog.issues.length} metadata or link issue${catalog.issues.length === 1 ? '' : 's'} remain: ${catalog.issues
              .map((issue) => `${issue.path} (${issue.code})`)
              .join(', ')}.`,
      paths: catalog.issues.map((issue) => issue.path),
    },
    {
      id: 'memory-role-coverage',
      status: assessment.intake.memoryRoleGaps.length === 0 ? 'pass' : 'fail',
      summary:
        assessment.intake.memoryRoleGaps.length === 0
          ? 'Required Memory roles are adopted.'
          : `${assessment.intake.memoryRoleGaps.length} required Memory role${assessment.intake.memoryRoleGaps.length === 1 ? '' : 's'} remain missing or unverified: ${assessment.intake.memoryRoleGaps
              .map((gap) => `${gap.role} (${gap.status})`)
              .join(', ')}.`,
      paths: assessment.intake.memoryRoleGaps.flatMap((gap) => gap.candidatePaths),
    },
    {
      id: 'instruction-mirror-parity',
      status: mirrorParity.issues.length === 0 ? 'pass' : 'fail',
      summary:
        mirrorParity.issues.length === 0
          ? 'Coding-agent instruction mirrors match the canonical source.'
          : `${mirrorParity.issues.length} instruction mirror${mirrorParity.issues.length === 1 ? '' : 's'} are missing or stale.`,
      paths: mirrorParity.issues.map((issue) =>
        issue.path.replace(`${workspaceRoot}/`, ''),
      ),
    },
  ];
  const failures = checks.filter((check) => check.status === 'fail');
  if (failures.length > 0) {
    throw new Error(
      `Adoption standard verification failed: ${failures
        .map((check) => `${check.id}: ${check.summary}`)
        .join(' | ')}`,
    );
  }

  const verification: SkoposAdoptionVerificationArtifact = {
    schemaVersion: 1,
    id: 'adoption-standard-verification',
    type: 'adoption-standard-verification',
    status: 'generated',
    authority: 'generated',
    summary: `Approved proposal ${proposal.proposalDigest} conforms to the Project Memory standard.`,
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    adoptionState: 'standard-verified',
    proposalDigest: proposal.proposalDigest,
    verifiedOperationIds: execution.operations.map((operation) => operation.operationId),
    verifiedByActorId: actorId,
    verifiedAt: generatedAt,
    executionEvidence: execution.operations,
    checks,
  };
  const verificationPath = join(
    workspaceRoot,
    SKOPOS_ADOPTION_VERIFICATION_PATH,
  );
  const verificationWrite = await writeJsonArtifact({
    artifactPath: verificationPath,
    artifact: verification,
    dryRun,
  });
  if (!dryRun) {
    await rm(join(workspaceRoot, SKOPOS_ADOPTION_ACTIVATION_PATH), { force: true });
  }
  const logResult = await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'understanding',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary: `Approved restructuring proposal ${proposal.proposalDigest} passed standard verification; agent-ready activation has not been granted.`,
    relatedArtifactPaths: [proposalPath, approvalPath, verificationPath],
    metadata: {
      actorId,
      proposalDigest: proposal.proposalDigest,
      operationCount: execution.operations.length,
      adoptionState: 'standard-verified',
      agentReady: false,
    },
    dryRun,
  });

  return {
    workspaceRoot,
    adoptionState: 'standard-verified',
    proposalPath,
    approvalPath,
    verificationPath,
    verificationWrite,
    logPath: logResult.path,
    logWrite: logResult.write,
    actorId,
    verification,
  };
};

export const buildSkoposAdoptionActivationRuntime = async ({
  cwd,
  actor,
  reason,
  dryRun = false,
}: BuildSkoposAdoptionActivationRuntimeOptions): Promise<SkoposAdoptionActivationRuntimeResult> => {
  const workspaceRoot = resolve(cwd);
  const actorId = resolveSkoposRuntimeActorId(actor);
  if (!actorId) {
    throw new Error('Adoption activation requires an explicit actor.');
  }
  if (!reason.trim()) {
    throw new Error('Adoption activation requires an explicit reason.');
  }
  const [proposal, approval, verification] = await Promise.all([
    readJson<SkoposAdoptionRestructuringProposalArtifact>(
      join(workspaceRoot, SKOPOS_ADOPTION_PROPOSAL_PATH),
    ),
    readJson<SkoposAdoptionApprovalArtifact>(
      join(workspaceRoot, SKOPOS_ADOPTION_APPROVAL_PATH),
    ),
    readJson<SkoposAdoptionVerificationArtifact>(
      join(workspaceRoot, SKOPOS_ADOPTION_VERIFICATION_PATH),
    ),
  ]);
  if (
    approval.proposalDigest !== proposal.proposalDigest ||
    verification.proposalDigest !== proposal.proposalDigest
  ) {
    throw new Error(
      'Activation requires the current proposal, approval, and standard verification to share one exact digest.',
    );
  }
  const approvedIds = [...approval.approvedOperationIds].sort();
  const verifiedIds = [...verification.verifiedOperationIds].sort();
  if (
    verification.checks.some((check) => check.status !== 'pass') ||
    JSON.stringify(approvedIds) !== JSON.stringify(verifiedIds)
  ) {
    throw new Error(
      'Activation requires passing verification for every approved operation.',
    );
  }
  const activatedAt = new Date().toISOString();
  const activation: SkoposAdoptionActivationArtifact = {
    schemaVersion: 1,
    id: 'adoption-activation',
    type: 'adoption-activation',
    status: 'active',
    authority: 'canonical',
    summary: `Project Memory adoption activated for proposal ${proposal.proposalDigest}.`,
    updatedAt: activatedAt,
    generatedAt: activatedAt,
    workspaceRoot,
    adoptionState: 'agent-ready',
    proposalDigest: proposal.proposalDigest,
    verifiedOperationIds: verification.verifiedOperationIds,
    activatedAt,
    activatedByActorId: actorId,
    reason: reason.trim(),
  };
  const activationPath = join(workspaceRoot, SKOPOS_ADOPTION_ACTIVATION_PATH);
  const activationWrite = await writeJsonArtifact({
    artifactPath: activationPath,
    artifact: activation,
    dryRun,
  });
  const logResult = await appendSkoposOperationalLogEntry({
    workspaceRoot,
    eventKind: 'understanding',
    status: dryRun ? 'dry-run' : 'succeeded',
    summary: `Verified Project Memory adoption activated by ${actorId} for proposal ${proposal.proposalDigest}.`,
    relatedArtifactPaths: [
      join(workspaceRoot, SKOPOS_ADOPTION_VERIFICATION_PATH),
      activationPath,
    ],
    metadata: {
      actorId,
      proposalDigest: proposal.proposalDigest,
      adoptionState: 'agent-ready',
    },
    dryRun,
  });

  return {
    workspaceRoot,
    adoptionState: 'agent-ready',
    activationPath,
    activationWrite,
    logPath: logResult.path,
    logWrite: logResult.write,
    actorId,
    activation,
  };
};

const assertApprovedExecutionEnvelope = ({
  proposal,
  approval,
  execution,
}: {
  proposal: SkoposAdoptionRestructuringProposalArtifact;
  approval: SkoposAdoptionApprovalArtifact;
  execution: ReturnType<typeof parseSkoposAdoptionExecutionInput>;
}): void => {
  if (
    execution.proposalDigest !== proposal.proposalDigest ||
    approval.proposalDigest !== proposal.proposalDigest
  ) {
    throw new Error('Execution evidence, approval, and proposal digests must match exactly.');
  }
  const approved = [...approval.approvedOperationIds].sort();
  const proposed = proposal.operations.map((operation) => operation.id).sort();
  const evidenced = execution.operations.map((operation) => operation.operationId).sort();
  if (
    JSON.stringify(approved) !== JSON.stringify(proposed) ||
    JSON.stringify(evidenced) !== JSON.stringify(proposed)
  ) {
    throw new Error(
      'Execution evidence and approval must cover every proposal operation exactly once.',
    );
  }
};

const verifyAdoptionOperationTopology = async (
  workspaceRoot: string,
  proposal: SkoposAdoptionRestructuringProposalArtifact,
  execution: ReturnType<typeof parseSkoposAdoptionExecutionInput>,
): Promise<SkoposAdoptionVerificationCheck> => {
  const failures: string[] = [];
  const evidenceById = new Map(
    execution.operations.map((operation) => [operation.operationId, operation]),
  );

  for (const operation of proposal.operations) {
    const evidence = evidenceById.get(operation.id)!;
    const expectedResults =
      operation.operation === 'delete'
        ? []
        : operation.operation === 'keep'
          ? operation.sourcePaths
          : operation.targetPaths.length > 0
            ? operation.targetPaths
            : operation.sourcePaths;
    if (
      JSON.stringify([...evidence.resultPaths].sort()) !==
      JSON.stringify([...expectedResults].sort())
    ) {
      failures.push(`${operation.id} result paths do not match the approved operation.`);
      continue;
    }
    for (const resultPath of expectedResults) {
      if (!(await pathExists(join(workspaceRoot, resultPath)))) {
        failures.push(`${operation.id} result is missing: ${resultPath}`);
      }
    }
    if (['move', 'merge', 'split', 'archive', 'delete'].includes(operation.operation)) {
      const resultPaths = new Set(expectedResults);
      for (const sourcePath of operation.sourcePaths) {
        if (
          !resultPaths.has(sourcePath) &&
          (await pathExists(join(workspaceRoot, sourcePath)))
        ) {
          failures.push(`${operation.id} source still exists: ${sourcePath}`);
        }
      }
    }
  }

  return {
    id: 'approved-operation-topology',
    status: failures.length === 0 ? 'pass' : 'fail',
    summary:
      failures.length === 0
        ? 'Every approved operation has exact execution evidence and matching result topology.'
        : failures.join(' '),
    paths: proposal.operations.flatMap((operation) => [
      ...operation.sourcePaths,
      ...operation.targetPaths,
    ]),
  };
};

const pathExists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const readJson = async <T>(path: string): Promise<T> =>
  JSON.parse(await readFile(path, 'utf8')) as T;

const readJsonIfExists = async <T>(path: string): Promise<T | undefined> => {
  try {
    return await readJson<T>(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
};
