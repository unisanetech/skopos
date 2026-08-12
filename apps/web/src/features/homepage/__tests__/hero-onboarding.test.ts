import { describe, expect, it } from "vitest";
import { heroCopy, heroOnboarding, releaseStatusCopy } from "../content/homepage-copy";

describe("homepage hero onboarding", () => {
  it("leads with the product's coherence promise", () => {
    expect(heroCopy.title).toBe("Your agents write the code. Skopos keeps the work coherent.");
  });

  it("presents the intended public npm installation path", () => {
    expect(heroOnboarding.source.label).toBe("Install in your project");
    expect(heroOnboarding.source.commands[0]).toBe("npm install --save-dev @skopos/cli");
    expect(heroOnboarding.packageLabel).toContain("@skopos/cli");
    expect(releaseStatusCopy).toBe("Available on npm");
  });

  it("gives coding agents the guarded existing-project adoption sequence", () => {
    expect(heroOnboarding.agent.commands).toEqual([
      "npx skopos init . --mode existing --actor <id>",
      "npx skopos understand . --actor <id> --json",
      "npx skopos adopt assess . --actor <id> --json",
    ]);
    expect(heroOnboarding.agent.brief).toContain("Show me any documentation proposal before applying it");
    expect(heroOnboarding.agent.steps.map((step) => step.label)).toEqual([
      "Initialize",
      "Understand",
      "Assess",
    ]);
  });
});
