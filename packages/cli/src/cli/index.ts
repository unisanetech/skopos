import { printHelp } from './help.js';
import { skoposCliCommandRegistry } from './registry.js';

const HELP_COMMANDS = new Set(['help', '--help', '-h']);

export const runSkoposCli = async (argv: string[] = process.argv.slice(2)): Promise<void> => {
  const [command, ...rest] = argv;

  if (!command || HELP_COMMANDS.has(command)) {
    printHelp();
    return;
  }

  const handler = skoposCliCommandRegistry[command];
  if (!handler) {
    throw new Error(`Unknown Skopos command: ${command}`);
  }

  await handler(rest);
};

export const isEntrypoint = (): boolean => {
  const entry = process.argv[1];
  return typeof entry === 'string' && (entry.endsWith('/cli.js') || entry.endsWith('/cli.ts'));
};
