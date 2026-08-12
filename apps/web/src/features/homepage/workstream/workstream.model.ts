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
    reason: "Finalize is not idempotent. The recovery endpoint is missing.",
    decisionTitle: "Make checkout resilient to network loss and retries",
    decisionBody:
      "Resume the interrupted checkout, finalize a pending payment exactly once, and confirm the order safely.",
    boundaryTitle: "Preserve the accepted payment architecture",
    boundaryBody: "Do not replace the payment provider or rewrite unrelated checkout flows.",
    sources: recoveredSources,
    nextAction: "Add the recovery endpoint",
    nextActionPath: "apps/storefront/src/checkout/recovery.ts",
    readinessLabel: "Evidence is still missing",
    readinessBody: "Recovery tests must cover the new path before the Task can close.",
    requirements: [
      { label: "Finalize pending payment exactly once", state: "missing" },
      { label: "Resume through the recovery endpoint", state: "missing" },
      { label: "Type check remains valid", state: "valid" },
    ],
    ledger: baseLedger,
  },
  {
    id: "keep-bounded",
    shortLabel: "Bound the change",
    label: "Bound the change",
    concept: "Task",
    taskStatus: "active",
    readiness: "blocked",
    taskSummary: "Goal, acceptance, non-goals, and owned paths stay explicit",
    reason: "The Task owns checkout recovery only—not provider changes or release certification.",
    decisionTitle: "One bounded change, one closure target",
    decisionBody:
      "Scope: checkout · Risk: standard · Proof: task-closure · Owner: @payments-team.",
    boundaryTitle: "Checkout recovery only",
    boundaryBody: "Do not change pricing, tax logic, fraud rules, or the payment provider.",
    sources: [
      "apps/storefront/src/checkout/recovery.ts",
      "packages/payments/src/finalize-payment.ts",
      "tests/checkout/recovery.test.ts",
    ],
    nextAction: "Implement only the owned recovery flow",
    nextActionPath: "Non-goal: do not change the payment provider",
    readinessLabel: "Boundary is clear",
    readinessBody: "Closure still waits on focused recovery Evidence.",
    requirements: [
      { label: "Owned paths declared", state: "valid" },
      { label: "Non-goals declared", state: "valid" },
      { label: "Recovery tests captured", state: "missing" },
    ],
    ledger: baseLedger,
  },
  {
    id: "run-checks",
    shortLabel: "Run project checks",
    label: "Run project checks",
    concept: "Actions + Guards",
    taskStatus: "verifying",
    readiness: "blocked",
    taskSummary: "Focused project Actions match the Task boundary",
    reason: "The recovery Action is required. The unrelated workspace-wide suite is skipped.",
    decisionTitle: "Run checkout.recovery-tests",
    decisionBody:
      "Guard matched checkout Scope, owned paths, and standard risk. workspace.full-test has no closure Guard match.",
    boundaryTitle: "Use the checks this change actually requires",
    boundaryBody: "Do not substitute an unrelated broad test run for focused recovery proof.",
    sources: [
      "Action · checkout.recovery-tests",
      "Guard · checkout.closure-evidence",
      "Skipped · workspace.full-test",
    ],
    nextAction: "Capture fresh recovery Evidence",
    nextActionPath: "pnpm test:checkout-recovery",
    readinessLabel: "Focused Evidence required",
    readinessBody: "The correct Action is selected; its fresh result still needs to attach to source.",
    requirements: [
      { label: "Focused Action selected", state: "valid" },
      { label: "Broad Action skipped with reason", state: "skipped" },
      { label: "Recovery Evidence recorded", state: "missing" },
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
    taskSummary: "Every closure requirement now has fresh, source-bound Evidence",
    reason: "The focused recovery tests pass and the existing type-check Evidence remains valid.",
    decisionTitle: "Ready to close—not release-ready",
    decisionBody:
      "Task-closure Readiness is satisfied. Project integration and public release remain separate proof subjects.",
    boundaryTitle: "Task-ready is not release-ready",
    boundaryBody: "Do not turn focused Task proof into a broader project or release claim.",
    sources: recoveredSources,
    nextAction: "Close the bounded Task",
    nextActionPath: "skopos finish T-7f3a91c2",
    readinessLabel: "Ready to close",
    readinessBody: "Three valid requirements, zero blockers. The Task remains verifying until explicitly finished.",
    requirements: [
      { label: "Exactly-once recovery test passed", state: "valid" },
      { label: "Idempotent finalize test passed", state: "valid" },
      { label: "Type check Evidence remains valid", state: "valid" },
    ],
    ledger: baseLedger.map((item) =>
      item.type === "Test" ? { ...item, status: "passed" as const, run: "run-3428" } : item,
    ),
  },
] as const;
