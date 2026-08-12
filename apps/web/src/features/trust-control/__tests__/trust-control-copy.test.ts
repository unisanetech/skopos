import { describe, expect, it } from "vitest";
import { trustControlCopy } from "../content";

describe("Trust and Control public story", () => {
  it("separates durable truth from rebuildable local state", () => {
    expect(trustControlCopy.trackedTruth.every((item) => !item.path.startsWith(".skopos"))).toBe(true);
    expect(trustControlCopy.localState.every((item) => item.path.startsWith(".skopos"))).toBe(true);
  });

  it("names the four different control strengths without collapsing them", () => {
    expect(trustControlCopy.controls.map((control) => control.label)).toEqual([
      "Instructions",
      "Guards",
      "Actions",
      "Readiness",
    ]);
    expect(new Set(trustControlCopy.controls.map((control) => control.kind)).size).toBe(4);
  });

  it("states the cooperative and privacy boundaries explicitly", () => {
    expect(trustControlCopy.limits.join(" ")).toContain("cannot prevent an unmediated process");
    expect(trustControlCopy.limits.join(" ")).toContain("keep it out of source control");
    expect(trustControlCopy.capabilities.find((item) => item.label === "Secrets")?.description).toContain(
      "never enter",
    );
  });
});
