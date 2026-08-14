import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { agentCompatibilityCopy } from "../content/homepage-copy";

const compatibilityStripSource = readFileSync(
  new URL("../sections/agent-compatibility-strip.tsx", import.meta.url),
  "utf8",
);

describe("homepage agent compatibility", () => {
  it("names every host without overstating first-release certification", () => {
    expect(agentCompatibilityCopy.agents.map((agent) => agent.name)).toEqual([
      "Codex",
      "Claude Code",
      "Cursor",
      "GitHub Copilot",
    ]);
    expect(agentCompatibilityCopy.eyebrow).toBe("Coding agents");
    expect(agentCompatibilityCopy.title).toBe("Give every coding agent the same project context.");
    expect(agentCompatibilityCopy.agents.find((agent) => agent.name === "Codex")?.status).toBe("Certified");
    for (const agent of agentCompatibilityCopy.agents.filter((host) => host.name !== "Codex")) {
      expect(agent.status).not.toBe("Certified");
    }
  });

  it("keeps the homepage strip focused on larger agent marks and names", () => {
    expect(compatibilityStripSource).toContain("justify-center");
    expect(compatibilityStripSource).toContain("size={32}");
    expect(compatibilityStripSource).toContain("text-[clamp(1rem,1.3vw,1.15rem)]");
    expect(compatibilityStripSource).toContain("text-[clamp(0.9rem,1.15vw,1.05rem)]");
    expect(compatibilityStripSource).not.toContain("{agent.status}");
  });
});
