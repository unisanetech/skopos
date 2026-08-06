import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { printCommandHelp, printHelp } from './help.js';
import { skoposCliCommandRegistry } from './registry.js';

const HELP_COMMANDS = new Set(['help', '--help', '-h']);

export const runSkoposCli = async (argv: string[] = process.argv.slice(2)): Promise<void> => {
  const [command, ...rest] = argv;

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  if (command === 'help') {
    const [targetCommand, ...targetArgs] = rest;
    if (!targetCommand) {
      printHelp();
      return;
    }
    if (!skoposCliCommandRegistry[targetCommand]) {
      throw new Error(`Unknown Skopos command: ${targetCommand}`);
    }
    if (!printCommandHelp(targetCommand, targetArgs)) printHelp();
    return;
  }

  const handler = skoposCliCommandRegistry[command];
  if (!handler) {
    throw new Error(`Unknown Skopos command: ${command}`);
  }

  if (rest.some((argument) => HELP_COMMANDS.has(argument))) {
    if (printCommandHelp(command, rest)) return;
  }

  await handler(rest);
};

export const isEntrypoint = (moduleUrl?: string): boolean => {
  const entry = process.argv[1];
  if (typeof entry !== 'string') {
    return false;
  }

  if (!moduleUrl) {
    return entry.endsWith('/cli.js') || entry.endsWith('/cli.ts');
  }

  try {
    return realpathSync(entry) === realpathSync(fileURLToPath(moduleUrl));
  } catch {
    return entry.endsWith('/cli.js') || entry.endsWith('/cli.ts');
  }
};
