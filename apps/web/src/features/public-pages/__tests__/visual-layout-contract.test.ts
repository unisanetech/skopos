import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const globalStyles = readFileSync(
  new URL("../../../app/globals.css", import.meta.url),
  "utf8",
);

describe("public-page visual layout contract", () => {
  it("keeps graphical hero views expanded inside the shared hero column", () => {
    expect(globalStyles).toMatch(
      /\.memory-system-visual\s*\{[^}]*width:\s*100%;[^}]*align-self:\s*stretch;/su,
    );
    expect(globalStyles).toMatch(
      /\.workflow-hero-visual\s*\{[^}]*width:\s*100%;[^}]*align-self:\s*stretch;/su,
    );
  });

  it("uses a defined responsive gutter throughout the homepage workstream", () => {
    expect(globalStyles).toContain("--workstream-gutter: clamp(24px, 4vw, 52px)");
    expect(globalStyles).not.toContain("--section-frame-padding-x");
    expect(globalStyles).toMatch(
      /\.stage-task-bar\s*\{[^}]*padding:\s*22px var\(--workstream-gutter\);/su,
    );
    expect(globalStyles).toMatch(
      /\.project-proof > summary\s*\{[^}]*padding:\s*16px var\(--workstream-gutter\);/su,
    );
  });

  it("maps workstream states to shared semantic color tokens", () => {
    for (const token of ["active", "blocked", "ready", "pending", "skipped"]) {
      expect(globalStyles).toContain(`--skopos-status-${token}:`);
    }
    expect(globalStyles).toContain(".status-text--active");
    expect(globalStyles).toContain(".status-text--verifying");
    expect(globalStyles).toContain(".readiness-badge--blocked");
    expect(globalStyles).toContain(".readiness-badge--ready");
    expect(globalStyles).toContain(".requirement-icon--missing");
    expect(globalStyles).toContain(".requirement-icon--valid");
    expect(globalStyles).toContain(".requirement-icon--skipped");
    expect(globalStyles).toContain(".ledger-status--blocked");
    expect(globalStyles).toContain(".ledger-status--passed");
    expect(globalStyles).toContain(".ledger-status--updated");
    expect(globalStyles).not.toContain(".status-text--blue");
  });
});
