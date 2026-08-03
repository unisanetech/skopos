import { describe, expect, it } from 'vitest';

import { createDefaultSkoposConfig } from '../../../config/src/index.js';
import type { SkoposScanSummary } from '../../../model/src/index.js';
import { buildSkoposPlan } from '../../../planner/src/index.js';

describe('planner ask-back classification', () => {
  it('does not turn operational homonyms into unrelated must-ask questions', () => {
    const questions = questionIds(
      'Bound agent transport and replace unbounded output for session context, token budget, provider protocol, blocker reporting, and workspace scope',
    );

    expect(questions).not.toContain('plan.vendor-choice');
    expect(questions).not.toContain('plan.destructive-migration');
    expect(questions).not.toContain('plan.security-privacy-change');
  });

  it.each([
    ['Replace Stripe billing provider with Adyen', 'plan.vendor-choice'],
    ['Drop the obsolete customer_id column from the billing schema', 'plan.destructive-migration'],
    ['Change authorization permissions for administrator access', 'plan.security-privacy-change'],
  ])('retains %s as a concrete %s decision', (goal, questionId) => {
    expect(questionIds(goal)).toContain(questionId);
  });

  it('offers truthful no-change outcomes for conditional destructive and security concerns', () => {
    const destructive = plan('Drop the obsolete customer_id column from the billing schema');
    const security = plan('Change authorization permissions for administrator access');

    expect(
      destructive.decisionQuestions
        .find((question) => question.id === 'plan.destructive-migration')
        ?.options.map((option) => option.id),
    ).toContain('no-destructive-change');
    expect(
      security.decisionQuestions
        .find((question) => question.id === 'plan.security-privacy-change')
        ?.options.map((option) => option.id),
    ).toContain('no-security-change');
  });

  it('returns identical questions from identical admitted facts', () => {
    const goal = 'Replace Stripe billing provider with Adyen';
    expect(plan(goal).decisionQuestions).toEqual(plan(goal).decisionQuestions);
  });
});

const questionIds = (goal: string): string[] =>
  plan(goal).decisionQuestions.map((question) => question.id);

const plan = (goal: string) =>
  buildSkoposPlan({
    workspaceRoot: '/workspace',
    goal,
    context: {
      workspaceRoot: '/workspace',
      scope: {
        query: '.',
        matchedBy: 'default-root',
        scope: {
          id: 'example',
          kind: 'package',
          title: 'Example',
          path: '.',
          aliases: [],
          summary: 'Example package.',
          confidence: 'high',
        },
      },
      summary: 'Compact project context.',
      references: [],
    },
    scanSummary,
    config: createDefaultSkoposConfig({
      projectName: 'example',
      archetype: 'library',
      repoMode: 'single',
    }),
  });

const scanSummary: SkoposScanSummary = {
  hasRootPackageJson: true,
  hasPnpmWorkspace: false,
  ignoredPaths: [],
  docsRoots: ['docs'],
  docsHealth: {
    root: 'docs',
    hasStartHere: true,
    startHerePath: 'docs/00-start-here.md',
    markdownFileCount: 1,
    freshnessTrackedCount: 0,
    staleDocPaths: [],
  },
  sourceDependencies: [],
  instructionFiles: ['AGENTS.md'],
  packageCount: 1,
  workspacePackageCount: 1,
  languages: ['TypeScript'],
  frameworks: [],
  commands: {},
  findings: [],
  confidence: 'high',
  repoMode: 'single',
  archetypeSuggestion: 'library',
};
