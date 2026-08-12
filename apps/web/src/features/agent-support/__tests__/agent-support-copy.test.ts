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

  it("ties every host claim to dated proof and setup guidance", () => {
    for (const host of supportedHosts) {
      expect(host.proofDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(host.proofHref).toContain("github.com/Croodo/skopos");
      expect(host.setupHref).toBe("/docs");
    }
  });

  it("does not imply native parity for manual hosts", () => {
    for (const capability of agentCapabilities) {
      expect(capability.support.cursor.state).not.toBe("Beta");
      expect(capability.support["github-copilot"].state).not.toBe("Beta");
    }
    expect(Object.keys(supportStateDescriptions)).toEqual([
      "Verified",
      "Beta",
      "Manual workflow",
      "Not supported",
    ]);
  });
});
