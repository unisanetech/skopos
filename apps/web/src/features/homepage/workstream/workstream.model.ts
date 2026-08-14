export type WorkstreamStatus = "active" | "verifying";
export type ReadinessState = "blocked" | "ready";
export type LedgerStatus = "blocked" | "passed" | "updated";

export interface WorkstreamStageModel {
  id: string;
  shortLabel: string;
  label: string;
  concept: string;
  taskStatus: WorkstreamStatus;
  readiness: ReadinessState;
  taskSummary: string;
  reason: string;
  decisionTitle: string;
  decisionBody: string;
  boundaryTitle: string;
  boundaryBody: string;
  sources: readonly string[];
  nextAction: string;
  nextActionPath: string;
  readinessLabel: string;
  readinessBody: string;
  requirements: readonly { label: string; state: "missing" | "valid" | "skipped" }[];
  ledger: readonly {
    type: "Test" | "Build" | "Lint" | "Docs";
    description: string;
    source: string;
    status: LedgerStatus;
    run: string;
  }[];
}

const baseLedger = [
  {
    type: "Test" as const,
    description: "Recovery flow returns exactly-once confirmation",
    source: "tests/checkout/recovery.test.ts",
    status: "blocked" as const,
    run: "Waiting for checkout.recovery-tests",
  },
  {
    type: "Test" as const,
    description: "Idempotent finalize prevents duplicate orders",
    source: "tests/checkout/finalize.test.ts",
    status: "blocked" as const,
    run: "Waiting for checkout.recovery-tests",
  },
  {
    type: "Build" as const,
    description: "Type check and build",
    source: "quality.typecheck",
    status: "passed" as const,
    run: "run-3427",
  },
  {
    type: "Lint" as const,
    description: "Lint changed checkout paths",
    source: "quality.lint",
    status: "passed" as const,
    run: "run-3427",
  },
  {
    type: "Docs" as const,
    description: "Update the work dossier",
    source: "docs/work/tasks/T-7f3a91c2-checkout-recovery.md",
    status: "updated" as const,
    run: "source-bound",
  },
] satisfies WorkstreamStageModel["ledger"];

const recoveredSources = [
  "docs/scopes/checkout/overview.md",
  "docs/decisions/D-012-checkout-reliability.md",
  "docs/patterns/PAT-007-idempotent-finalization.md",
  "docs/work/tasks/T-7f3a91c2-checkout-recovery.md",
] as const;

export const workstreamStages: readonly WorkstreamStageModel[] = [
  {
    id: "recover-context",
    shortLabel: "Load project context",
    label: "Load project context",
    concept: "Memory",
    taskStatus: "active",
    readiness: "blocked",
    taskSummary: "Checkout recovery after payment interruption",
    reason:
      "The checkout can process the same payment twice when confirmation is interrupted. The recovery path is missing.",
    decisionTitle: "Make checkout resilient to network loss and retries",
    decisionBody:
      "Resume the interrupted checkout, finalize a pending payment exactly once, and confirm the order safely.",
    boundaryTitle: "Preserve the accepted payment architecture",
    boundaryBody: "Do not replace the payment provider or rewrite unrelated checkout flows.",
    sources: recoveredSources,
    nextAction: "Add the recovery endpoint",
    nextActionPath: "apps/storefront/src/checkout/recovery.ts",
    readinessLabel: "Evidence is still missing",
    readinessBody: "The recovery tests must cover the new path before this work can finish.",
    requirements: [
      { label: "One payment creates one order", state: "missing" },
      { label: "Interrupted checkout can resume safely", state: "missing" },
      { label: "Type check remains valid", state: "valid" },
    ],
    ledger: baseLedger,
  },
  {
    id: "keep-bounded",
    shortLabel: "Keep the change focused",
    label: "Keep the change focused",
    concept: "Task",
    taskStatus: "active",
    readiness: "blocked",
    taskSummary: "Define exactly what can change",
    reason: "This work covers checkout recovery only. It does not include provider or release changes.",
    decisionTitle: "One bounded change, one closure target",
    decisionBody: "Change only the checkout recovery flow and its focused tests.",
    boundaryTitle: "Checkout recovery only",
    boundaryBody: "Do not change pricing, tax logic, fraud rules, or the payment provider.",
    sources: [
      "apps/storefront/src/checkout/recovery.ts",
      "packages/payments/src/finalize-payment.ts",
      "tests/checkout/recovery.test.ts",
    ],
    nextAction: "Change only the checkout recovery flow",
    nextActionPath: "Keep the existing payment provider",
    readinessLabel: "Boundary is clear",
    readinessBody: "The boundary is clear, but the recovery tests still need to pass.",
    requirements: [
      { label: "Files to change are defined", state: "valid" },
      { label: "Excluded areas are defined", state: "valid" },
      { label: "Recovery tests still need to pass", state: "missing" },
    ],
    ledger: baseLedger,
  },
  {
    id: "run-checks",
    shortLabel: "Run the right checks",
    label: "Run the right checks",
    concept: "Actions + Guards",
    taskStatus: "verifying",
    readiness: "blocked",
    taskSummary: "Run only the checks this change needs",
    reason: "Skopos selects the checkout recovery tests and skips unrelated project-wide checks.",
    decisionTitle: "Run checkout.recovery-tests",
    decisionBody: "Run the checkout recovery tests because they directly cover the changed behavior.",
    boundaryTitle: "Use the checks this change actually requires",
    boundaryBody: "Do not substitute an unrelated broad test run for focused recovery proof.",
    sources: [
      "Action · checkout.recovery-tests",
      "Guard · checkout.closure-evidence",
      "Skipped · workspace.full-test",
    ],
    nextAction: "Run the checkout recovery tests",
    nextActionPath: "pnpm test:checkout-recovery",
    readinessLabel: "Test result required",
    readinessBody: "The correct check is selected, but it still needs to pass.",
    requirements: [
      { label: "Checkout recovery tests selected", state: "valid" },
      { label: "Unrelated checks skipped with a reason", state: "skipped" },
      { label: "Recovery test result still required", state: "missing" },
    ],
    ledger: baseLedger,
  },
  {
    id: "explain-readiness",
    shortLabel: "Show why it is ready",
    label: "Show why it is ready",
    concept: "Evidence + Readiness",
    taskStatus: "verifying",
    readiness: "ready",
    taskSummary: "The required checks passed and nothing is missing",
    reason: "The checkout recovery tests passed, and the existing type check is still valid.",
    decisionTitle: "Ready to finish this work",
    decisionBody: "The required checkout checks passed. This work is ready to finish.",
    boundaryTitle: "This proves only the checkout change",
    boundaryBody: "It does not claim that the entire project or a public release is ready.",
    sources: recoveredSources,
    nextAction: "Finish this work",
    nextActionPath: "skopos finish T-7f3a91c2",
    readinessLabel: "Ready to finish",
    readinessBody: "All three requirements passed and no blockers remain.",
    requirements: [
      { label: "One payment creates one order", state: "valid" },
      { label: "Interrupted checkout resumes safely", state: "valid" },
      { label: "Type check is still valid", state: "valid" },
    ],
    ledger: baseLedger.map((item) =>
      item.type === "Test" ? { ...item, status: "passed" as const, run: "run-3428" } : item,
    ),
  },
] as const;
