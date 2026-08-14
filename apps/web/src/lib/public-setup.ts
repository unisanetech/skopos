export function publicSkoposCommand(arguments_: string) {
  return `npm exec --package @unisane/skopos@latest -- skopos ${arguments_}`;
}

export const publicSetup = {
  package: "@unisane/skopos@latest",
  npmUrl: "https://www.npmjs.com/package/@unisane/skopos",
  command: publicSkoposCommand("setup . --actor <stable-id> --json"),
} as const;

const setupOpening =
  `Set up Skopos in this repository with the npm package ${publicSetup.package}: ${publicSetup.npmUrl}. ` +
  `Run \`${publicSetup.command}\`. `;

const setupClosing =
  "Follow Skopos’s returned guidance one decision at a time. Stop whenever it asks for my input, and apply only the recommendations I approve.";

export const publicSetupPrompts = {
  generic: `${setupOpening}${setupClosing}`,
  existing:
    `${setupOpening}This is an existing project, so preserve the project truth already in the repository. ${setupClosing}`,
  newProject:
    `${setupOpening}This is a new project, so help me define its purpose, boundaries, and working checks. ${setupClosing}`,
} as const;
