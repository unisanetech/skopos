import { describe, expect, it } from "vitest";
import { heroCopy, heroOnboarding, releaseStatusCopy } from "../content/homepage-copy";

describe("homepage hero onboarding", () => {
  it("leads with the product's coherence promise", () => {
    expect(heroCopy.title).toBe("Your agents write the code. Skopos keeps the work coherent.");
  });

  it("presents the planned first-release npm path without claiming publication", () => {
    expect(heroOnboarding.source.label).toBe("First public release install");
    expect(heroOnboarding.source.commands[0]).toBe("npm install --save-dev @skopos/cli@next");
    expect(heroOnboarding.packageLabel).toContain("@skopos/cli@next");
    expect(releaseStatusCopy).toBe("First release targets npm @next");
    expect(releaseStatusCopy).not.toContain("Available");
  });

  it("gives coding agents the unified guarded setup sequence", () => {
    expect(heroOnboarding.agent.commands).toEqual([
      "npx skopos setup . --actor <id>",
      "npx skopos setup review . --actor <id>",
      "npx skopos setup resume . --actor <id>",
    ]);
    expect(heroOnboarding.agent.brief).toContain("show me one consolidated recommendation");
    expect(heroOnboarding.agent.steps.map((step) => step.label)).toEqual([
      "Understand",
      "Review",
      "Apply",
    ]);
  });
});
