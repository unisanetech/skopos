export type WorkflowStage = {
  number: string;
  key: "Discuss" | "Understand" | "Bound" | "Work" | "Prove" | "Remember" | "Continue";
  icon: string;
  summary: string;
  whatYouSay: string;
  handledTitle: string;
  handledDescription: string;
  details: readonly string[];
};

export const productWorkflowCopy = {
  title: "From a request to verified work—without losing the why.",
  description:
    "Talk to your coding agent normally. Skopos supplies the relevant project truth, protects the outcome you agreed on, connects project checks to fresh proof, and leaves the work ready to continue.",
  example: {
    label: "One example from start to finish",
    title: "Make checkout recovery reliable",
    prompt:
      "Our checkout can lose the order when payment succeeds but confirmation is interrupted. Fix the recovery flow without changing pricing or tax logic.",
    repository: "atlas-commerce",
    scope: "checkout",
  },
  stages: [
    {
      number: "01",
      key: "Discuss",
      icon: "forum",
      summary: "Start with the outcome, not a form.",
      whatYouSay:
        "Our checkout can lose the order when payment succeeds but confirmation is interrupted. Fix the recovery flow without changing pricing or tax logic.",
      handledTitle: "The conversation stays natural.",
      handledDescription:
        "You describe the problem, refine the outcome, and answer real questions with your coding agent. Skopos does not replace that discussion with another workflow UI.",
      details: ["Outcome first", "Constraints stated", "Open questions visible"],
    },
    {
      number: "02",
      key: "Understand",
      icon: "manage_search",
      summary: "Load the truth that applies here.",
      whatYouSay: "Before changing code, understand how checkout currently handles payment and order confirmation.",
      handledTitle: "Relevant project Memory becomes working context.",
      handledDescription:
        "The agent receives project-wide rules, checkout-specific decisions, current work, and the repository paths that explain the existing flow.",
      details: ["Scope: checkout", "Decision: idempotent finalization", "Pattern: recovery boundary"],
    },
    {
      number: "03",
      key: "Bound",
      icon: "select_check_box",
      summary: "Protect the request from drift.",
      whatYouSay: "Keep this focused on recovery. Do not redesign checkout or touch pricing and tax behavior.",
      handledTitle: "The agreed outcome becomes one bounded Task.",
      handledDescription:
        "Skopos records acceptance, owned paths, constraints, non-goals, risk, and dependencies so implementation cannot quietly become a different project.",
      details: ["Acceptance recorded", "Owned paths declared", "Non-goals preserved"],
    },
    {
      number: "04",
      key: "Work",
      icon: "code",
      summary: "Let the agent do the engineering.",
      whatYouSay: "Implement the safest solution that fits the project. Keep me updated if a real decision changes the direction.",
      handledTitle: "Reasoning and code stay with the coding agent.",
      handledDescription:
        "Skopos supplies the boundary, exposes project-approved Actions, and applies relevant Guards. It does not become a second agent or prescribe every edit.",
      details: ["Approved Actions", "Applicable Guards", "Ownership respected"],
    },
    {
      number: "05",
      key: "Prove",
      icon: "fact_check",
      summary: "Done means the required proof exists.",
      whatYouSay: "Run the checks that matter for this change and show me why it is safe to merge.",
      handledTitle: "Fresh Evidence explains readiness.",
      handledDescription:
        "Focused tests and project checks are attached to the requirements and the source state they prove. Missing or stale proof keeps the Task blocked.",
      details: ["Recovery test passed", "Typecheck passed", "Source state matched"],
    },
    {
      number: "06",
      key: "Remember",
      icon: "edit_note",
      summary: "Keep durable truth current.",
      whatYouSay: "Keep anything future agents need to know with the project.",
      handledTitle: "Memory impact is reviewed before closure.",
      handledDescription:
        "If the project learned something durable, canonical Memory is updated. If existing documentation is still correct, the review is recorded without creating needless doc churn.",
      details: ["Memory updated", "or reviewed—no change", "Human-readable truth"],
    },
    {
      number: "07",
      key: "Continue",
      icon: "resume",
      summary: "The next session starts from live project state.",
      whatYouSay: "Continue the checkout work in a fresh session and review what is ready.",
      handledTitle: "The handoff carries the work, not the whole chat.",
      handledDescription:
        "A supported session can recover the current Task, relevant Memory, ownership, Evidence, and remaining blockers without reconstructing the previous conversation.",
      details: ["Current Task recovered", "Relevant context loaded", "Readiness explained"],
    },
  ] satisfies readonly WorkflowStage[],
  outcome: [
    { label: "Project Memory", value: "The why stays with the repository" },
    { label: "Bounded Task", value: "The requested outcome stays intact" },
    { label: "Fresh Evidence", value: "Completion is explained, not assumed" },
    { label: "Live handoff", value: "The next agent can continue real work" },
  ],
} as const;
