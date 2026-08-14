import { describe, expect, it } from "vitest";
import { workstreamStages } from "../workstream/workstream.model";

describe("homepage workstream model", () => {
  it("keeps the approved four-stage workflow in order", () => {
    expect(workstreamStages.map((stage) => stage.id)).toEqual([
      "recover-context",
      "keep-bounded",
      "run-checks",
      "explain-readiness",
    ]);
  });

  it("explains each stage as a user outcome before naming the Skopos concept", () => {
    expect(workstreamStages.map((stage) => stage.label)).toEqual([
      "Load project context",
      "Keep the change focused",
      "Run the right checks",
      "Show why it is ready",
    ]);
    expect(workstreamStages.map((stage) => stage.concept)).toEqual([
      "Memory",
      "Task",
      "Actions + Guards",
      "Evidence + Readiness",
    ]);
  });

  it("keeps the primary story in plain language while product terms remain secondary", () => {
    const primaryCopy = workstreamStages.flatMap((stage) => [
      stage.label,
      stage.taskSummary,
      stage.reason,
      stage.decisionBody,
      stage.boundaryTitle,
      stage.boundaryBody,
      stage.nextAction,
      stage.readinessBody,
      ...stage.requirements.map((requirement) => requirement.label),
    ]).join(" ");

    expect(primaryCopy).not.toMatch(/source-bound|proof subjects|closure Guard|not idempotent|non-goals|owned paths/i);
    expect(workstreamStages.map((stage) => stage.concept)).toEqual([
      "Memory",
      "Task",
      "Actions + Guards",
      "Evidence + Readiness",
    ]);
  });

  it("keeps an explicit boundary visible at every stage", () => {
    expect(workstreamStages.every((stage) => stage.boundaryTitle && stage.boundaryBody)).toBe(true);
  });

  it("does not confuse Task state with closure Readiness", () => {
    expect(workstreamStages.every((stage) => ["active", "verifying"].includes(stage.taskStatus))).toBe(true);
    expect(workstreamStages.at(-1)?.taskStatus).toBe("verifying");
    expect(workstreamStages.at(-1)?.readiness).toBe("ready");
  });

  it("ends with fresh passing recovery Evidence", () => {
    const finalStage = workstreamStages.at(-1);
    expect(finalStage?.ledger.filter((item) => item.type === "Test").every((item) => item.status === "passed")).toBe(true);
    expect(finalStage?.requirements.every((requirement) => requirement.state === "valid")).toBe(true);
  });
});
