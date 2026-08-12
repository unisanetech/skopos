export type PublicPageSection = {
  number: string;
  title: string;
  description: string;
  points?: readonly string[];
  status?: "Verified" | "Available" | "Manual workflow" | "In progress";
};

export type PublicPageContent = {
  title: string;
  description: string;
  summary: readonly string[];
  sections: readonly PublicPageSection[];
  closing: {
    title: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
};

export const changelogPage: PublicPageContent = {
  title: "See what changed—and what is actually ready.",
  description:
    "Skopos separates implemented behavior, verified host support, and future direction so a roadmap item is never mistaken for a shipped capability.",
  summary: ["Source-linked changes", "Explicit verification state", "No silent compatibility claims"],
  sections: [
    {
      number: "01",
      title: "Public release preparation",
      status: "In progress",
      description: "The core operating model, CLI, MCP surface, self-hosted workflow, and public website are converging toward the first public release.",
    },
    {
      number: "02",
      title: "Codex child-Task delivery",
      status: "Verified",
      description: "Approved splits can create real Codex tasks, bind returned thread identities to Skopos Sessions, wait for completion, and return control to the originating reviewer.",
    },
    {
      number: "03",
      title: "Fresh-session continuation",
      status: "Verified",
      description: "A source-linked self-hosted Codex cohort recorded three successful bounded continuations out of three eligible attempts. The result is explicitly Codex-only.",
    },
  ],
  closing: {
    title: "Follow the release from source to proof.",
    description: "Every public claim should have a shipped artifact or a clearly stated readiness limit behind it.",
    primaryLabel: "View GitHub releases",
    primaryHref: "https://github.com/Croodo/skopos/releases",
    secondaryLabel: "Browse the source",
    secondaryHref: "https://github.com/Croodo/skopos",
  },
};
