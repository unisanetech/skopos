import { createHash } from 'node:crypto';
import { access, readFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';

import type {
  SkoposAdoptionAnalysisBriefArtifact,
  SkoposAdoptionAuthorityConflict,
  SkoposAdoptionIntakeArtifact,
  SkoposAdoptionPathEvidence,
  SkoposAdoptionRoleGap,
  SkoposBootstrapArtifact,
  SkoposDocumentKnowledgeEntry,
  SkoposDocumentRole,
  SkoposScopeLite,
} from '@skopos/model';

export * from './adoption-proposal.js';

export interface SkoposAdoptionCatalogIssue {
  code: string;
  path: string;
  summary: string;
  reference?: string;
}

export interface BuildSkoposAdoptionAssessmentOptions {
  workspaceRoot: string;
  generatedAt: string;
  bootstrap: SkoposBootstrapArtifact;
  scopes: SkoposScopeLite[];
  documents: SkoposDocumentKnowledgeEntry[];
  catalogIssues: SkoposAdoptionCatalogIssue[];
}

export interface SkoposAdoptionAssessmentArtifacts {
  intake: SkoposAdoptionIntakeArtifact;
  analysisBrief: SkoposAdoptionAnalysisBriefArtifact;
}

const ADOPTION_DIRECTORY = '.skopos/adoption';
export const SKOPOS_ADOPTION_INTAKE_PATH = `${ADOPTION_DIRECTORY}/intake.json`;
export const SKOPOS_ADOPTION_ANALYSIS_BRIEF_PATH = `${ADOPTION_DIRECTORY}/analysis-brief.json`;

export const buildSkoposAdoptionAssessment = async ({
  workspaceRoot,
  generatedAt,
  bootstrap,
  scopes,
  documents,
  catalogIssues,
}: BuildSkoposAdoptionAssessmentOptions): Promise<SkoposAdoptionAssessmentArtifacts> => {
  const allDocuments = await includeExternalDiscoveryDocuments({
    workspaceRoot,
    documents,
    candidatePaths: [
      'README.md',
      ...bootstrap.sourceDependencies
        .filter((source) => source.kind === 'docs-content')
        .map((source) => source.path),
    ],
  });
  const codeRoots = uniquePathEvidence(
    scopes.flatMap((scope) =>
      (scope.codeRoots?.length ? scope.codeRoots : [scope.path]).map((path) => ({
        path,
        provenance: 'observed' as const,
        reason: `Declared or discovered code root for Scope ${scope.id}.`,
      })),
    ),
  );
  const memoryRoots = scopes
    .filter((scope): scope is SkoposScopeLite & { memoryRoot: string } =>
      Boolean(scope.memoryRoot),
    )
    .map((scope) => ({
      scopeId: scope.id,
      path: scope.memoryRoot,
    }))
    .sort(
      (left, right) =>
        left.path.localeCompare(right.path) ||
        left.scopeId.localeCompare(right.scopeId),
    );
  const instructionFiles = uniquePathEvidence(
    bootstrap.detected.instructionFiles.map((path) => ({
      path,
      provenance: 'observed' as const,
      reason: 'Detected coding-agent instruction source.',
    })),
  );
  const commands = Object.entries(bootstrap.detected.commands)
    .map(([name, command]) => ({
      name,
      command,
      provenance: 'observed' as const,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
  const ciPaths = await discoverExistingPaths(workspaceRoot, [
    '.github/workflows',
    '.gitlab-ci.yml',
    'azure-pipelines.yml',
    'bitbucket-pipelines.yml',
    '.circleci',
    'Jenkinsfile',
  ], 'Detected project CI source.');
  const generatedSourcePaths = uniquePathEvidence([
    ...bootstrap.sourceDependencies
      .filter((source) => isGeneratedPath(source.path))
      .map((source) => ({
        path: source.path,
        provenance: 'observed' as const,
        reason: `Detected generated-source input (${source.kind}).`,
      })),
    ...(await discoverExistingPaths(
      workspaceRoot,
      ['generated', 'dist', 'build', '.next', 'docs/reference/generated'],
      'Detected conventional generated-output path; ownership still requires agent review.',
      'inferred',
    )),
  ]);
  const authorityConflicts = buildAuthorityConflicts(
    allDocuments,
    catalogIssues,
    scopes,
  );
  const memoryRoleGaps = buildMemoryRoleGaps(bootstrap, allDocuments);
  const inputDigest = createHash('sha256')
    .update(
      JSON.stringify({
        sources: bootstrap.sourceDependencies,
        documents: allDocuments.map((document) => ({
          path: document.path,
          role: document.role,
          authority: document.authority,
          lifecycle: document.lifecycle,
          adoption: document.adoption,
          metadata: document.metadata,
        })),
        codeRoots,
        memoryRoots,
        instructionFiles,
        commands,
        ciPaths,
        generatedSourcePaths,
        authorityConflicts,
        memoryRoleGaps,
      }),
    )
    .digest('hex');
  const intake: SkoposAdoptionIntakeArtifact = {
    schemaVersion: 1,
    id: 'adoption-intake',
    type: 'adoption-intake',
    status: 'generated',
    authority: 'generated',
    summary: 'Read-only adoption intake; coding-agent analysis is still required.',
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    adoptionState: 'agent-analysis-required',
    assessmentOnly: true,
    inputDigest,
    memoryRoots,
    documents: allDocuments,
    codeRoots,
    instructionFiles,
    commands,
    ciPaths,
    generatedSourcePaths,
    authorityConflicts,
    memoryRoleGaps,
  };
  const requiredReads = uniquePathEvidence([
    ...instructionFiles,
    ...allDocuments
      .filter((document) => document.defaultVisible)
      .slice(0, 12)
      .map((document) => ({
        path: document.path,
        provenance: 'observed' as const,
        reason: `Candidate ${document.role} Memory; authority is not accepted by this assessment.`,
      })),
    ...codeRoots.slice(0, 8).map((entry) => ({
      ...entry,
      reason: 'Inspect real implementation before accepting product or architecture claims.',
    })),
  ]);
  const analysisBrief: SkoposAdoptionAnalysisBriefArtifact = {
    schemaVersion: 1,
    id: 'adoption-analysis-brief',
    type: 'adoption-analysis-brief',
    status: 'generated',
    authority: 'generated',
    summary: 'Agent work contract for reviewing project truth before restructuring.',
    updatedAt: generatedAt,
    generatedAt,
    workspaceRoot,
    adoptionState: 'agent-analysis-required',
    assessmentOnly: true,
    intakePath: SKOPOS_ADOPTION_INTAKE_PATH,
    requiredReads,
    analysisTasks: [
      {
        id: 'separate-claims',
        title: 'Separate knowledge by provenance',
        instruction: 'Inspect real source and documentation. Record observed facts, evidence-backed inferences, unresolved assumptions, and contradictions separately.',
        requiredOutput: 'A provenance-aware analysis in which every material claim points to project evidence.',
      },
      {
        id: 'resolve-authority',
        title: 'Resolve documentation authority',
        instruction: 'Identify canonical, supporting, stale, historical, generated, duplicated, and conflicting documents. Do not choose between contradictory claims without evidence or user acceptance.',
        requiredOutput: 'Candidate authority assignments plus material unresolved questions.',
      },
      {
        id: 'map-memory',
        title: 'Map product and technical memory',
        instruction: 'Explain product purpose, user workflows, architecture boundaries, Scope ownership, development procedures, validation, operations, and reusable preferred or failure patterns where they actually exist.',
        requiredOutput: 'A reviewed Memory-role map grounded in source and documentation.',
      },
      {
        id: 'prepare-restructuring',
        title: 'Prepare restructuring inputs',
        instruction: 'Classify each relevant document for keep, move, merge, split, rewrite, archive, or delete. Preserve rationale and identify link or authority impact.',
        requiredOutput: 'Inputs for a proposal; do not mutate human-authored documents in the assessment step.',
      },
    ],
    materialQuestionRule:
      'Ask only when the answer changes product truth, architecture, authority, retention, Scope ownership, or the restructuring envelope.',
    prohibitedClaims: [
      'Do not call scanner output agent-reviewed.',
      'Do not call this project fully adopted or agent-ready.',
      'Do not treat inferred paths or legacy mappings as accepted authority.',
      'Do not move, merge, rewrite, archive, or delete human-authored documents during assessment.',
    ],
    nextAgentAction:
      'Follow this brief, inspect the required project sources, then record reviewed analysis before requesting a restructuring proposal.',
  };

  return { intake, analysisBrief };
};

const discoverExistingPaths = async (
  workspaceRoot: string,
  candidates: string[],
  reason: string,
  provenance: SkoposAdoptionPathEvidence['provenance'] = 'observed',
): Promise<SkoposAdoptionPathEvidence[]> => {
  const entries: SkoposAdoptionPathEvidence[] = [];

  for (const path of candidates) {
    try {
      await access(join(workspaceRoot, path));
      entries.push({ path, provenance, reason });
    } catch {
      // Absence is normal during discovery.
    }
  }

  return entries;
};

const includeExternalDiscoveryDocuments = async ({
  workspaceRoot,
  documents,
  candidatePaths,
}: {
  workspaceRoot: string;
  documents: SkoposDocumentKnowledgeEntry[];
  candidatePaths: string[];
}): Promise<SkoposDocumentKnowledgeEntry[]> => {
  const byPath = new Map(documents.map((document) => [document.path, document]));

  for (const path of [...new Set(candidatePaths)].sort()) {
    if (byPath.has(path)) continue;

    try {
      const contents = await readFile(join(workspaceRoot, path), 'utf8');
      const role = inferDiscoveryRole(path);
      byPath.set(path, {
        id: `discovery-${createHash('sha256').update(path).digest('hex').slice(0, 12)}`,
        title:
          contents.match(/^#\s+(.+)$/m)?.[1]?.trim() ??
          basename(path, extname(path)),
        path,
        sourceId: 'adoption-discovery',
        adoption: 'discovery',
        role,
        lifecycle: 'durable',
        authority: 'supporting',
        defaultVisible: true,
        summary: extractDiscoverySummary(contents),
      });
    } catch {
      // Discovery candidates may disappear between scan and assessment.
    }
  }

  return [...byPath.values()].sort((left, right) => left.path.localeCompare(right.path));
};

const inferDiscoveryRole = (path: string): SkoposDocumentRole => {
  const normalized = path.toLowerCase();
  const segments = normalized.split('/').filter(Boolean);
  const filename = segments.at(-1);

  if (normalized === 'readme.md' || filename === 'overview.md') return 'overview';
  if (filename === '00-start-here.md') return 'router';
  if (segments.includes('architecture')) return 'architecture';
  if (segments.includes('standards')) return 'standard';
  if (segments.includes('domains')) return 'domain';
  if (segments.includes('guides')) return 'guide';
  if (segments.includes('operations')) return 'operation';
  if (segments.includes('decisions')) return 'decision';
  if (segments.includes('findings')) return 'finding';
  if (segments.includes('patterns')) return 'pattern';
  if (segments.includes('plans')) return 'plan';
  if (segments.includes('tasks')) return 'task';
  if (segments.includes('reference') || segments.includes('generated')) return 'reference';
  return 'document';
};

const extractDiscoverySummary = (contents: string): string | undefined => {
  const paragraph = contents
    .replace(/^---[\s\S]*?---\s*/u, '')
    .split(/\n\s*\n/u)
    .map((entry) => entry.replace(/^#+\s+.*$/gmu, '').trim())
    .find(Boolean);
  return paragraph?.replace(/\s+/gu, ' ').slice(0, 240);
};

const uniquePathEvidence = (
  entries: SkoposAdoptionPathEvidence[],
): SkoposAdoptionPathEvidence[] =>
  [...new Map(entries.map((entry) => [entry.path, entry])).values()].sort((left, right) =>
    left.path.localeCompare(right.path),
  );

const isGeneratedPath = (path: string): boolean =>
  /(^|\/)(generated|dist|build|coverage|\.next|\.cache)(\/|$)/u.test(path);

const buildAuthorityConflicts = (
  documents: SkoposDocumentKnowledgeEntry[],
  catalogIssues: SkoposAdoptionCatalogIssue[],
  scopes: SkoposScopeLite[],
): SkoposAdoptionAuthorityConflict[] => {
  const conflicts = catalogIssues.map((issue) => ({
    code: issue.code,
    paths: [issue.path, ...(issue.reference ? [issue.reference] : [])],
    summary: issue.summary,
    provenance: 'observed' as const,
  }));
  const canonicalByScopeAndRole = new Map<
    string,
    { scopeId: string; role: SkoposDocumentRole; paths: string[] }
  >();

  for (const document of documents) {
    if (document.authority !== 'canonical' || !document.defaultVisible) continue;
    const scopeId = resolveDocumentScopeId(document.path, scopes);
    const key = `${scopeId}\0${document.role}`;
    const existing = canonicalByScopeAndRole.get(key);
    canonicalByScopeAndRole.set(key, {
      scopeId,
      role: document.role,
      paths: [...(existing?.paths ?? []), document.path],
    });
  }

  for (const { scopeId, role, paths } of canonicalByScopeAndRole.values()) {
    if (paths.length < 2 || !['router', 'overview'].includes(role)) {
      continue;
    }
    conflicts.push({
      code: 'multiple-canonical-role-candidates',
      paths: paths.sort(),
      summary: `Multiple current canonical candidates claim the ${role} role in Scope ${scopeId}; agent review must resolve their authority.`,
      provenance: 'observed',
    });
  }

  return conflicts.sort(
    (left, right) =>
      left.code.localeCompare(right.code) ||
      left.paths.join('\0').localeCompare(right.paths.join('\0')),
  );
};

const resolveDocumentScopeId = (
  documentPath: string,
  scopes: SkoposScopeLite[],
): string =>
  scopes
    .filter(
      (scope): scope is SkoposScopeLite & { memoryRoot: string } =>
        Boolean(scope.memoryRoot) &&
        (documentPath === scope.memoryRoot ||
          documentPath.startsWith(`${scope.memoryRoot}/`)),
    )
    .sort(
      (left, right) =>
        right.memoryRoot.split('/').length - left.memoryRoot.split('/').length ||
        left.id.localeCompare(right.id),
    )[0]?.id ?? 'workspace';

const buildMemoryRoleGaps = (
  bootstrap: SkoposBootstrapArtifact,
  documents: SkoposDocumentKnowledgeEntry[],
): SkoposAdoptionRoleGap[] => {
  const requiredRoles: SkoposDocumentRole[] = [
    'router',
    'overview',
    ...(bootstrap.detected.repoMode === 'monorepo' ||
    bootstrap.detected.workspacePackageCount > 1
      ? (['architecture'] as const)
      : []),
    ...(Object.keys(bootstrap.detected.commands).length > 0
      ? (['standard'] as const)
      : []),
  ];

  return requiredRoles.flatMap((role) => {
    const candidates = documents.filter(
      (document) =>
        document.role === role &&
        document.defaultVisible &&
        !['historical', 'dead'].includes(document.lifecycle),
    );
    const adopted = candidates.some((document) => document.adoption === 'adopted');

    if (adopted) return [];

    return [{
      role,
      status: candidates.length > 0 ? 'present-unverified' as const : 'missing' as const,
      candidatePaths: candidates.map((document) => document.path).sort(),
      reason:
        candidates.length > 0
          ? 'Discovery found candidate content, but assessment cannot promote it to adopted authority.'
          : 'No current candidate was discovered for this required Memory role.',
    }];
  });
};
