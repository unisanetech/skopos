import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { describe, expect, it } from 'vitest';

import type { SkoposUiConsoleState } from '../contracts/skopos-ui-console-state.js';
import {
  PolicyRuleEnforcementCard,
  PolicyRuleExamplesCard,
  PolicyRuleMeaningCard,
  PolicyRuleProjectStatusCard,
} from '../features/validation/policy-sections.js';
import { getPolicyRuleDetailContext } from '../platform/console-state/validation-selectors.js';

const createPolicyState = (): SkoposUiConsoleState =>
  ({
    generatedAt: '2026-08-04T00:00:00.000Z',
    docsLinks: [],
    policyReview: {
      resolvedPolicy: {
        artifactPath: '.skopos/index/policies/resolved.json',
        policy: {
          acceptedPacks: [
            {
              packId: 'clean-code.maintainability',
              version: '0.1.0',
              acceptedAt: '2026-08-04T00:00:00.000Z',
              acceptedBy: 'developer',
              reason: 'Keep code understandable.',
              source: 'manual',
            },
          ],
          activeRules: [
            {
              id: 'clean-code.maintainability.names-say-purpose',
              title: 'Names say the purpose',
              severity: 'must',
              summary: 'Use names that explain the domain or technical responsibility.',
              rationale: 'Clear names reduce repeated explanation.',
              appliesTo: ['Changed source', 'Public APIs'],
              examples: ['formatInvoiceTotal instead of helper'],
              antiPatterns: ['utils.ts becomes a dumping ground'],
              checkIds: ['quality.vague-name-scan'],
            },
          ],
          overrides: [],
          recommendedTaskRisks: [],
          defaultTaskRisk: 'standard',
        },
      },
      packManifests: [
        {
          artifactPath: 'policy-packs/clean-code/maintainability/pack.json',
          manifest: {
            packId: 'clean-code.maintainability',
            displayName: 'Clean Code Maintainability',
            description: 'Readable and safe-to-change code.',
            plainLanguageSummary: 'Keep code easy to understand and change.',
            family: 'clean-code',
            variant: 'maintainability',
            projectLifecycles: [],
            appliesWhen: [],
            avoidWhen: [],
            rules: [],
            requiredDocs: [],
            generatedArtifacts: [],
            driftCheckIds: [],
            proofFixtureIds: [],
          },
        },
      ],
      guards: {
        artifactPath: '.skopos/index/guards.json',
        resolved: {
          guards: [
            {
              id: 'quality.typecheck',
              packId: 'clean-code.maintainability',
              label: 'TypeScript changes require typecheck Evidence',
              kind: 'project-action',
              strength: 'required',
              status: 'available',
              severity: 'must',
              summary: 'Require fresh project-owned typecheck Evidence.',
            },
          ],
        },
      },
      driftReport: {
        artifactPath: '.skopos/index/policies/drift.json',
        report: {
          findings: [
            {
              id: 'drift-1',
              family: 'naming',
              status: 'open',
              severity: 'must',
              verificationStatus: 'fail',
              summary: 'A vague helper name remains.',
              ruleId: 'clean-code.maintainability.names-say-purpose',
              evidence: ['src/utils.ts'],
              remediation: ['Rename it for its actual responsibility.'],
            },
          ],
          counts: {
            openMustCount: 1,
            openShouldCount: 0,
            advisoryCount: 0,
            suppressedCount: 0,
            resolvedCount: 0,
          },
        },
      },
    },
  }) as SkoposUiConsoleState;

describe('policy rule pages', () => {
  it('projects one rule with its owning pack, drift, and pack Guard context', () => {
    const detail = getPolicyRuleDetailContext(
      createPolicyState(),
      'clean-code.maintainability',
      'clean-code.maintainability.names-say-purpose',
    );

    expect(detail?.rule.title).toBe('Names say the purpose');
    expect(detail?.pack.displayName).toBe('Clean Code Maintainability');
    expect(detail?.driftFindings).toHaveLength(1);
    expect(detail?.packGuards[0]?.id).toBe('quality.typecheck');
  });

  it('renders human meaning before project status and technical enforcement detail', () => {
    const detail = getPolicyRuleDetailContext(
      createPolicyState(),
      'clean-code.maintainability',
      'clean-code.maintainability.names-say-purpose',
    );

    expect(detail).toBeDefined();
    const markup = renderToStaticMarkup(
      <>
        <PolicyRuleMeaningCard detail={detail!} />
        <PolicyRuleExamplesCard detail={detail!} />
        <PolicyRuleProjectStatusCard detail={detail!} />
        <PolicyRuleEnforcementCard detail={detail!} />
      </>,
    );

    expect(markup).toContain('What this rule asks');
    expect(markup).toContain('Why it matters');
    expect(markup).toContain('What good implementation looks like');
    expect(markup).toContain('Current project status');
    expect(markup).toContain('A vague helper name remains.');
    expect(markup).toContain('How Skopos checks it');
    expect(markup).toContain('Pack Guards');
    expect(markup).toContain('quality.vague-name-scan');
  });
});
