import { describe, expect, it } from "vitest";
import { productWorkflowCopy } from "../content";

describe("How Skopos Works public story", () => {
  it("uses the complete canonical working loop in order", () => {
    expect(productWorkflowCopy.stages.map((stage) => stage.key)).toEqual([
      "Discuss",
      "Understand",
      "Bound",
      "Work",
      "Prove",
      "Remember",
      "Continue",
    ]);
  });

  it("keeps one continuous example paired with developer and Skopos responsibilities", () => {
    expect(productWorkflowCopy.example.title).toBe("Make checkout recovery reliable");
    expect(productWorkflowCopy.stages.every((stage) => stage.whatYouSay.length > 0)).toBe(true);
    expect(productWorkflowCopy.stages.every((stage) => stage.handledDescription.length > 0)).toBe(true);
  });

  it("describes evidence and memory without claiming Skopos writes the code", () => {
    expect(productWorkflowCopy.stages.find((stage) => stage.key === "Work")?.handledDescription).toContain(
      "does not become a second agent",
    );
    expect(productWorkflowCopy.stages.find((stage) => stage.key === "Prove")?.handledDescription).toContain(
      "source state",
    );
    expect(productWorkflowCopy.stages.find((stage) => stage.key === "Remember")?.handledDescription).toContain(
      "Memory",
    );
  });
});
