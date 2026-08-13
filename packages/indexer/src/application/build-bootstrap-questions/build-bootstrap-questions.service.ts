import { basename } from 'node:path';

import type {
  SkoposDecisionQuestion,
  SkoposRootConfig,
  SkoposScanSummary,
} from '@skopos/model';

export interface BuildBootstrapQuestionsOptions {
  scanSummary: SkoposScanSummary;
  existingConfig?: SkoposRootConfig | null;
}

export const buildBootstrapQuestions = ({
  scanSummary,
  existingConfig,
}: BuildBootstrapQuestionsOptions): SkoposDecisionQuestion[] => {
  const questions: SkoposDecisionQuestion[] = [];
  const hasDeclaredRootConfig = scanSummary.sourceDependencies.some(
    (dependency) => dependency.kind === 'root-config' && dependency.existsAtBuild,
  );
  const configuredDocsRootIsCurrent =
    hasDeclaredRootConfig &&
    typeof scanSummary.docsHealth.root === 'string' &&
    scanSummary.docsRoots.includes(scanSummary.docsHealth.root);

  if (!hasDeclaredRootConfig) {
    questions.push({
      id: 'bootstrap.project-archetype',
      category: 'project-shape',
      escalation: 'recommend-and-ask',
      question: 'Which project archetype should Skopos treat as canonical for this repo?',
      whyItMatters:
        'Archetype selection shapes planning defaults, retrieval bias, and future Readiness checks.',
      recommendedOptionId: scanSummary.archetypeSuggestion,
      options: [
        {
          id: scanSummary.archetypeSuggestion,
          label: labelForArchetype(scanSummary.archetypeSuggestion),
          rationale: `Recommended because the detected repo shape best matches ${scanSummary.archetypeSuggestion}.`,
        },
        {
          id: 'saas',
          label: 'SaaS App',
          rationale:
            'Useful when product surfaces and user workflows matter more than package topology.',
        },
        {
          id: 'api',
          label: 'API Service',
          rationale:
            'Useful when the repo is mostly service contracts, handlers, and backend runtime surfaces.',
        },
        {
          id: 'library',
          label: 'Library/SDK',
          rationale:
            'Useful when the repo’s main output is reusable packages rather than a deployable app.',
        },
      ],
    });
  }

  if (!configuredDocsRootIsCurrent) {
    questions.push({
      id: 'bootstrap.docs-root',
      category: 'docs-governance',
      escalation: scanSummary.docsRoots.length > 0 ? 'recommend-and-ask' : 'must-ask',
      question:
        'Which docs root should Skopos treat as canonical for human-readable project knowledge?',
      whyItMatters:
        'Docs routing affects context assembly, Readiness reporting, and active-vs-archived content selection.',
      recommendedOptionId: scanSummary.docsRoots[0] ?? 'create-docs-root',
      options: [
        {
          id: scanSummary.docsRoots[0] ?? 'create-docs-root',
          label: scanSummary.docsRoots[0] ? `Use ${scanSummary.docsRoots[0]}` : 'Create docs root',
          rationale: scanSummary.docsRoots[0]
            ? `Recommended because ${scanSummary.docsRoots[0]} is already present and can become the canonical docs entrypoint.`
            : 'Recommended because no docs root was detected and the SDK needs one canonical human-readable surface.',
        },
        {
          id: 'manual-docs-governance',
          label: 'Defer docs governance',
          rationale: 'Faster initially, but reduces retrieval quality and increases drift risk.',
        },
      ],
    });
  }

  const configuredInstructionSourceIsCurrent = existingConfig
    ? scanSummary.instructionFiles.includes(existingConfig.agents.canonicalInstructions)
    : false;
  const instructionSourceNeedsConfirmation = existingConfig
    ? !configuredInstructionSourceIsCurrent
    : !scanSummary.instructionFiles.some((filePath) => basename(filePath) === 'AGENTS.md');
  if (instructionSourceNeedsConfirmation) {
    const configuredInstructionSource = existingConfig?.agents.canonicalInstructions;
    const detectedAlternatives = scanSummary.instructionFiles.filter(
      (filePath) => filePath !== configuredInstructionSource,
    );
    const options = configuredInstructionSource
      ? [
          {
            id: 'restore-configured-instructions',
            label: `Restore ${configuredInstructionSource}`,
            rationale:
              'Recommended because this keeps the project’s explicit instruction-source decision intact.',
          },
          ...detectedAlternatives.map((filePath) => ({
            id: `switch-instruction-source:${filePath}`,
            label: `Switch to ${filePath}`,
            rationale:
              `Use only if ${filePath} should explicitly replace the currently configured instruction source.`,
          })),
        ]
      : [
          {
            id: 'create-agents',
            label: 'Create AGENTS.md',
            rationale:
              'Recommended because Skopos expects one canonical human-authored instruction source.',
          },
          ...detectedAlternatives.map((filePath) => ({
            id: `switch-instruction-source:${filePath}`,
            label: `Use ${filePath}`,
            rationale: `Promote the detected ${filePath} file as the canonical instruction source.`,
          })),
        ];
    questions.push({
      id: 'bootstrap.instructions-source',
      category: 'agent-governance',
      escalation: 'must-ask',
      question: 'What should be the canonical instruction source for coding agents?',
      whyItMatters:
        'Instruction mirror generation needs one authoritative source to avoid tool drift.',
      recommendedOptionId: configuredInstructionSource
        ? 'restore-configured-instructions'
        : 'create-agents',
      options,
    });
  }

  const hasConfiguredCommands = Boolean(
    existingConfig && Object.values(existingConfig.commands).some(Boolean),
  );
  if (!hasConfiguredCommands && Object.keys(scanSummary.commands).length === 0) {
    questions.push({
      id: 'bootstrap.commands',
      category: 'workflow-surface',
      escalation: 'must-ask',
      question:
        'Which command surface should Skopos treat as canonical for dev, build, test, and quality checks?',
      whyItMatters:
        'Without canonical commands, agents cannot reliably plan, validate, or close work.',
      recommendedOptionId: 'define-root-scripts',
      options: [
        {
          id: 'define-root-scripts',
          label: 'Define root scripts',
          rationale:
            'Recommended because one root command surface keeps agent workflows deterministic.',
        },
        {
          id: 'defer-command-contract',
          label: 'Defer command contract',
          rationale:
            'Allows fast bootstrap, but increases execution drift and makes Readiness checks weaker.',
        },
      ],
    });
  }

  return questions;
};

const labelForArchetype = (value: string): string => {
  switch (value) {
    case 'monorepo-platform':
      return 'Monorepo Platform';
    case 'internal-tool':
      return 'Internal Tool';
    case 'saas':
      return 'SaaS App';
    case 'api':
      return 'API Service';
    case 'library':
      return 'Library/SDK';
    default:
      return 'Custom';
  }
};
