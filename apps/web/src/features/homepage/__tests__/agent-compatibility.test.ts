import { describe, expect, it } from "vitest";
import { agentCompatibilityCopy } from "../content/homepage-copy";

describe("homepage agent compatibility", () => {
  it("names the coding agents with explicit Skopos host support", () => {
    expect(agentCompatibilityCopy.agents.map((agent) => agent.name)).toEqual([
      "Codex",
      "Claude Code",
      "Cursor",
      "GitHub Copilot",
    ]);
  });
});
