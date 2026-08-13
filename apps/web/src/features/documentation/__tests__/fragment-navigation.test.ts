import { describe, expect, it, vi } from "vitest";
import { resolveFragmentId, revealFragmentTarget } from "../../../lib/fragment-navigation";
import { featureWorkflowStages } from "../feature-workflow-content";
import { docsLandingCopy, quickstartModes } from "../content";
import { agentWorkItems } from "../agent-work-content";

describe("documentation fragment navigation", () => {
  const quickstartIds = Object.values(quickstartModes).map((mode) => mode.id);
  const workflowIds = featureWorkflowStages.map((stage) => stage.id);

  it("resolves every documented dynamic destination to a stable tab id", () => {
    expect(resolveFragmentId("#existing-project", quickstartIds)).toBe("existing-project");
    expect(resolveFragmentId("#new-project", quickstartIds)).toBe("new-project");
    expect(resolveFragmentId("#understand", workflowIds)).toBe("understand");
    expect(resolveFragmentId("#bound", workflowIds)).toBe("bound");
    expect(resolveFragmentId("#prove", workflowIds)).toBe("prove");
    expect(resolveFragmentId("#remember", workflowIds)).toBe("remember");
    expect(resolveFragmentId("#not-a-stage", workflowIds)).toBeUndefined();
  });

  it("covers all eight public links that depend on dynamic tab selection", () => {
    const dynamicLinks = [
      ...docsLandingCopy.startRoutes.map((route) => route.href),
      ...docsLandingCopy.library.flatMap((group) => group.links.map((link) => link.href)),
      ...agentWorkItems.map((item) => item.href),
    ].filter((href) =>
      [
        "/docs/quickstart#existing-project",
        "/docs/quickstart#new-project",
        "/docs/workflows/plan-and-finish-feature#understand",
        "/docs/workflows/plan-and-finish-feature#bound",
        "/docs/workflows/plan-and-finish-feature#prove",
        "/docs/workflows/plan-and-finish-feature#remember",
      ].includes(href),
    );

    expect(dynamicLinks).toHaveLength(8);
    expect(dynamicLinks.filter((href) => href.endsWith("#existing-project"))).toHaveLength(2);
    expect(dynamicLinks.filter((href) => href.endsWith("#new-project"))).toHaveLength(2);
  });

  it("scrolls to and focuses a resolved target without a second scroll", () => {
    const target = {
      scrollIntoView: vi.fn(),
      focus: vi.fn(),
    };

    expect(revealFragmentTarget("bound", { getElementById: () => target })).toBe(true);
    expect(target.scrollIntoView).toHaveBeenCalledWith({ block: "start" });
    expect(target.focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it("fails safely when a destination is not present", () => {
    expect(revealFragmentTarget("missing", { getElementById: () => null })).toBe(false);
  });
});
