import { describe, expect, it } from "vitest";
import { projectMemoryCopy } from "../content";

describe("Project Memory public story", () => {
  it("distinguishes the major context alternatives without claiming they have no value", () => {
    expect(projectMemoryCopy.alternatives.map((item) => item.label)).toEqual([
      "Chat history",
      "Agent instructions",
      "Private agent memory",
      "Project documentation",
    ]);
    expect(projectMemoryCopy.alternatives.every((item) => item.strength.length > 0)).toBe(true);
  });

  it("uses the complete reviewed existing-project setup vocabulary", () => {
    expect(projectMemoryCopy.setupOperations).toEqual([
      "Keep",
      "Move",
      "Merge",
      "Split",
      "Rewrite",
      "Archive",
      "Delete",
    ]);
  });

  it("keeps the primary promise repository-owned and relevant to current work", () => {
    expect(projectMemoryCopy.description).toContain("repository-owned");
    expect(projectMemoryCopy.description).toContain("truth relevant to the work");
  });
});
