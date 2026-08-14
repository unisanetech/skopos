import { describe, expect, it } from "vitest";
import { useCasesCopy } from "../content";
import { publicSetup } from "../../../lib/public-setup";

describe("Skopos use cases", () => {
  it("keeps the seven approved launch scenarios in order", () => {
    expect(useCasesCopy.cases.map((useCase) => useCase.id)).toEqual([
      "set-up-existing-project",
      "plan-build-feature",
      "return-after-time-away",
      "continue-fresh-session",
      "split-independent-work",
      "require-project-checks",
      "keep-memory-current",
    ]);
  });

  it("gives every scenario the required problem, outcome, prompt, and guide", () => {
    for (const useCase of useCasesCopy.cases) {
      expect(useCase.problem.length).toBeGreaterThan(40);
      expect(useCase.outcome.length).toBeGreaterThan(40);
      expect(useCase.prompt.length).toBeGreaterThan(40);
      expect(useCase.guideHref.startsWith("/")).toBe(true);
    }
  });

  it("states the host limitation for automated parallel delivery", () => {
    expect(useCasesCopy.cases.find((useCase) => useCase.id === "split-independent-work")?.note).toContain(
      "host-dependent",
    );
  });

  it("uses the same npm-backed setup prompt as the quickstart", () => {
    const setupPrompt = useCasesCopy.cases.find((useCase) => useCase.id === "set-up-existing-project")?.prompt;
    expect(setupPrompt).toContain(publicSetup.package);
    expect(setupPrompt).toContain(publicSetup.npmUrl);
    expect(setupPrompt).toContain(publicSetup.command);
  });
});
