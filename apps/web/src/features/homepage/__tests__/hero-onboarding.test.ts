import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { heroCopy, heroOnboarding, releaseStatusCopy } from "../content/homepage-copy";
import { getHeroCopyFeedback } from "../sections/hero-copy-feedback";

const heroOnboardingSource = readFileSync(
  new URL("../sections/hero-onboarding.tsx", import.meta.url),
  "utf8",
);

describe("homepage hero onboarding", () => {
  it("leads with the product's coherence promise", () => {
    expect(heroCopy.title).toBe("Your agents write the code. Skopos keeps the work coherent.");
  });

  it("presents the exact public npm release", () => {
    expect(heroOnboarding.source.label).toBe("npm install");
    expect(heroOnboarding.source.commands[0]).toBe("npm install --save-dev @unisane/skopos@latest");
    expect(heroOnboarding.packageLabel).toContain("@unisane/skopos@latest");
    expect(releaseStatusCopy).toBe("Available on npm");
  });

  it("gives coding agents a concise public-package setup prompt", () => {
    expect(heroOnboarding.agent.commands).toEqual([
      "npm exec --package @unisane/skopos@latest -- skopos setup . --actor <stable-id> --json",
      "Follow the returned setup guidance in order.",
    ]);
    expect(heroOnboarding.agent.visibleBrief).toContain("@unisane/skopos@latest");
    expect(heroOnboarding.agent.brief).toContain("https://www.npmjs.com/package/@unisane/skopos");
    expect(heroOnboarding.agent.brief).toContain("one decision at a time");
    expect(heroOnboarding.agent.brief).not.toMatch(/local Skopos|workspace link|agentPacketPath|currentQuestion|submissionPath|finalPlanAllowed/u);
    expect(heroOnboarding.agent.steps.map((step) => step.label)).toEqual([
      "Understand",
      "Clarify",
      "Review",
      "Apply",
      "Verify",
    ]);
    expect(heroOnboardingSource).toContain("grid-cols-5");
  });

  it("keeps both tab bodies mounted inside one fixed geometry panel", () => {
    expect(heroOnboardingSource).toContain('data-hero-onboarding-geometry="fixed"');
    expect(heroOnboardingSource).toContain('className="grid h-[200px] overflow-hidden');
    expect(heroOnboardingSource).toContain('(["agent", "source"] as const).map');
    expect(heroOnboardingSource).toContain('"col-start-1 row-start-1 min-h-0 overflow-hidden"');
    expect(heroOnboardingSource).toContain('data-hero-onboarding-mode={panelMode}');
    expect(heroOnboardingSource).not.toContain('mode === "source" ? (');
  });

  it("uses explicit success and failure copy feedback", () => {
    expect(getHeroCopyFeedback("idle")).toEqual({ icon: "content_copy", label: "Copy" });
    expect(getHeroCopyFeedback("copying")).toEqual({ icon: "content_copy", label: "Copying" });
    expect(getHeroCopyFeedback("copied")).toEqual({ icon: "check", label: "Copied" });
    expect(getHeroCopyFeedback("failed")).toEqual({ icon: "error", label: "Copy failed" });
  });
});
