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
    expect(heroOnboarding.source.label).toBe("Public npm install");
    expect(heroOnboarding.source.commands[0]).toBe("npm install --save-dev @unisane/skopos@0.1.0");
    expect(heroOnboarding.packageLabel).toContain("@unisane/skopos@0.1.0");
    expect(releaseStatusCopy).toBe("Available on npm");
  });

  it("gives coding agents the pinned question-first setup contract", () => {
    expect(heroOnboarding.agent.commands).toEqual([
      "npm exec --package @unisane/skopos@0.1.0 -- skopos setup . --actor <stable-id> --json",
      "Follow the returned question, submission, and continuation commands in order.",
    ]);
    expect(heroOnboarding.agent.brief).toContain("https://www.npmjs.com/package/@unisane/skopos/v/0.1.0");
    expect(heroOnboarding.agent.brief).toContain("ask exactly `currentQuestion`");
    expect(heroOnboarding.agent.brief).toContain("Do not infer answers");
    expect(heroOnboarding.agent.brief).toContain("run `submissionCommand`");
    expect(heroOnboarding.agent.brief).toContain("Only when `finalPlanAllowed` is true");
    expect(heroOnboarding.agent.brief).not.toContain("show me one consolidated recommendation");
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
