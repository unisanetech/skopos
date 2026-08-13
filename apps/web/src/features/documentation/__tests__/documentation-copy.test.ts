import { describe, expect, it } from "vitest";
import {
  docsLandingCopy,
  quickstartDoneWhen,
  quickstartModes,
  quickstartProblems,
} from "../content";
import { checkoutCustomizeExample, customizeGuides } from "../customize-content";
import { featureWorkflowOutcome, featureWorkflowStages } from "../feature-workflow-content";
import { agentWorkItems, freshSessionStages, hostDeliveryTruth } from "../agent-work-content";

describe("Documentation public journey", () => {
  it("routes every landing-page starting point to a real destination", () => {
    expect(docsLandingCopy.startRoutes.map((route) => route.href)).toEqual([
      "/docs/quickstart#existing-project",
      "/docs/quickstart#new-project",
      "/docs/quickstart#continue-work",
      "/how-it-works",
    ]);
  });

  it("provides conversation-first and exact-command setup paths", () => {
    for (const mode of Object.values(quickstartModes)) {
      expect(mode.prompt.length).toBeGreaterThan(100);
      expect(mode.commands[0]).toBe("npm install --save-dev @skopos/cli@next");
      expect(mode.commands.some((command) => command.includes("skopos setup"))).toBe(true);
      expect(mode.commands.at(-1)).toBe("npx skopos setup resume . --actor <id>");
      expect(mode.commands.join(" ")).not.toContain("skopos adopt");
      expect(mode.commands.join(" ")).not.toContain("skopos init");
      expect(mode.review.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("keeps setup completion and failure recovery observable", () => {
    expect(quickstartDoneWhen).toHaveLength(4);
    expect(quickstartDoneWhen.join(" ")).toContain("Setup reports");
    expect(quickstartProblems).toHaveLength(4);
    expect(quickstartProblems.flatMap((problem) => [problem.title, problem.recovery]).join(" ")).not.toContain("undefined");
  });

  it("introduces customization through user outcomes before technical terms", () => {
    expect(customizeGuides.map((guide) => guide.slug)).toEqual([
      "connect-tools",
      "project-rules",
      "expert-guidance",
      "coding-agents",
      "external-services",
    ]);
    for (const guide of customizeGuides) {
      expect(guide.prompt.length).toBeGreaterThan(120);
      expect(guide.steps).toHaveLength(3);
      expect(guide.terms).toHaveLength(3);
      expect(guide.boundary.length).toBeGreaterThan(100);
    }
    expect(checkoutCustomizeExample).toHaveLength(6);
  });

  it("carries one feature through the complete discussion-to-continuation loop", () => {
    expect(featureWorkflowStages.map((stage) => stage.id)).toEqual([
      "discuss", "understand", "bound", "work", "prove", "remember", "continue",
    ]);
    for (const stage of featureWorkflowStages) {
      expect(stage.prompt.length).toBeGreaterThan(100);
      expect(stage.commands.length).toBeGreaterThan(0);
      expect(stage.handles).toHaveLength(3);
      expect(stage.review).toHaveLength(3);
    }
    expect(featureWorkflowOutcome).toHaveLength(5);
  });

  it("routes everyday agent work to implemented public destinations", () => {
    expect(agentWorkItems).toHaveLength(8);
    for (const item of agentWorkItems) {
      expect(item.prompt.length).toBeGreaterThan(70);
      expect(item.href.startsWith("/")).toBe(true);
    }
  });

  it("keeps fresh Session generation, delivery, acceptance, and continuation explicit", () => {
    expect(freshSessionStages.map((stage) => stage.id)).toEqual(["prepare", "capture", "verify", "deliver", "accept", "continue"]);
    expect(freshSessionStages.find((stage) => stage.id === "deliver")?.truth).toContain("real host outcome");
    expect(freshSessionStages.find((stage) => stage.id === "accept")?.commands.join(" ")).toContain("handoff accept");
    expect(hostDeliveryTruth.map((host) => host.label)).toEqual(["Codex", "Claude Code", "Any manual host"]);
    expect(hostDeliveryTruth.find((host) => host.label === "Codex")?.status).toBe("Certified for first release");
    expect(hostDeliveryTruth.find((host) => host.label === "Claude Code")?.status).toContain("verification planned");
  });
});
