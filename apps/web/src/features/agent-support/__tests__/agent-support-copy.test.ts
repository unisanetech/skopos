import { describe, expect, it } from "vitest";
import {
  agentCapabilities,
  supportedHosts,
  supportStateDescriptions,
} from "../content";

describe("Supported Agents public claims", () => {
  it("covers every approved host and capability", () => {
    expect(supportedHosts.map((host) => host.id)).toEqual([
      "codex",
      "claude-code",
      "cursor",
      "github-copilot",
    ]);
    expect(agentCapabilities).toHaveLength(8);

    for (const capability of agentCapabilities) {
      expect(Object.keys(capability.support)).toEqual(supportedHosts.map((host) => host.id));
    }
  });

  it("ties every host status to dated source and setup guidance", () => {
    for (const host of supportedHosts) {
      expect(host.proofDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(host.proofHref).toContain("github.com/unisanetech/skopos");
      expect(host.setupHref).toBe("/docs");
    }
  });

  it("certifies only Codex for the first release", () => {
    expect(supportedHosts.find((host) => host.id === "codex")?.headlineState).toBe("Codex certified");
    for (const host of supportedHosts.filter((host) => host.id !== "codex")) {
      expect(host.headlineState).not.toBe("Codex certified");
    }
    for (const capability of agentCapabilities) {
      expect(capability.support["claude-code"].state).not.toBe("Codex certified");
      expect(capability.support.cursor.state).not.toBe("Codex certified");
      expect(capability.support["github-copilot"].state).not.toBe("Codex certified");
    }
    expect(Object.keys(supportStateDescriptions)).toEqual([
      "Codex certified",
      "Projection available",
      "Manual workflow",
      "Not supported",
    ]);
  });
});
