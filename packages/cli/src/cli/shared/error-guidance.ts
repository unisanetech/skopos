export const renderSkoposCliFailure = (
  error: unknown,
  argv: string[] = process.argv.slice(2),
): string => {
  const message = error instanceof Error ? error.message : String(error);
  const command = argv.find((argument) => !argument.startsWith('-'));
  const taskId = argv.find((argument) => /^T-[a-z0-9]+$/iu.test(argument));
  const guidance = resolveFailureGuidance({ message, command, taskId });
  if (argv.includes('--json')) {
    return JSON.stringify(
      {
        schemaVersion: 1,
        type: 'cli-failure',
        status: 'failed',
        summary: message,
        readiness: 'blocked',
        nextCommand: guidance.nextCommand,
        recoveryReason: guidance.reason,
      },
      null,
      2,
    );
  }
  return [
    'Skopos could not complete the command.',
    `What happened: ${message}`,
    'Readiness: blocked until this command succeeds or the issue is reviewed.',
    `Next step: ${guidance.nextCommand}`,
    `Why: ${guidance.reason}`,
  ].join('\n');
};

const resolveFailureGuidance = ({
  message,
  command,
  taskId,
}: {
  message: string;
  command?: string;
  taskId?: string;
}): { nextCommand: string; reason: string } => {
  if (/unknown skopos command/iu.test(message)) {
    return {
      nextCommand: 'skopos --help',
      reason: 'Review the available commands and retry with a supported command.',
    };
  }
  if (/unknown skopos .*flag|missing .*subcommand|usage:/iu.test(message)) {
    return {
      nextCommand: command ? `skopos help ${command}` : 'skopos --help',
      reason: 'Review the supported command shape and retry with the documented arguments.',
    };
  }
  if (/stale|coordination session|claimed by|must be claimed/iu.test(message)) {
    return {
      nextCommand: 'skopos coordination status .',
      reason: 'Inspect live and stale ownership before attempting an audited recovery or retry.',
    };
  }
  if (/evidence|verification|readiness|blocker/iu.test(message) && taskId) {
    return {
      nextCommand: `skopos verify ${taskId} . --phase closure --json`,
      reason: 'The verification diagnostic identifies the exact missing or stale proof.',
    };
  }
  if (/missing|requires/iu.test(message)) {
    return {
      nextCommand: command ? `skopos help ${command}` : 'skopos --help',
      reason: 'The command is missing required input; help shows the complete contract.',
    };
  }
  return {
    nextCommand: taskId
      ? `skopos task show ${taskId} . --json`
      : 'skopos session context . --json',
    reason: taskId
      ? 'Reload the current Task and use its recorded next step.'
      : 'Reload compact Project guidance before retrying.',
  };
};
