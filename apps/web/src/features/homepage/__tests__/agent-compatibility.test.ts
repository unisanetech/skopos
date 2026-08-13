import { describe, expect, it } from "vitest";
import { agentCompatibilityCopy } from "../content/homepage-copy";

describe("homepage agent compatibility", () => {
  it("names every host without overstating first-release certification", () => {
    expect(agentCompatibilityCopy.agents.map((agent) => agent.name)).toEqual([
      "Codex",
      "Claude Code",
      "Cursor",
      "GitHub Copilot",
    ]);
    expect(agentCompatibilityCopy.title).toContain("Codex certified");
    expect(agentCompatibilityCopy.agents.find((agent) => agent.name === "Codex")?.status).toBe("Certified");
    for (const agent of agentCompatibilityCopy.agents.filter((host) => host.name !== "Codex")) {
      expect(agent.status).not.toBe("Certified");
    }
  });
});
