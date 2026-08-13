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
