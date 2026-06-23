import { runImpactCommand, runDoneCommand } from './commands/impact.js';
import { runDiscussionCommand } from './commands/discussion.js';
import { runInitCommand } from './commands/init.js';
import { runInstructionsCommand } from './commands/instructions.js';
import { runJobsCommand } from './commands/jobs.js';
import { runMissionCommand } from './commands/mission.js';
import { runOverridesCommand } from './commands/overrides.js';
import { runPoliciesCommand } from './commands/policies.js';
import { runProgramCommand } from './commands/program.js';
import { runContextCommand, runResolveCommand } from './commands/query.js';
import {
  runDecideCommand,
  runEvalCommand,
  runNextCommand,
  runPlanCommand,
  runStartCommand,
} from './commands/router.js';
import { runScanCommand } from './commands/scan.js';
import { runTrustCommand } from './commands/trust.js';
import { runUiCommand } from './commands/ui.js';
import { runWorkflowsCommand } from './commands/workflows.js';
import type { SkoposCliCommandHandler } from './types.js';

export const skoposCliCommandRegistry: Record<string, SkoposCliCommandHandler> = {
  init: runInitCommand,
  scan: runScanCommand,
  start: runStartCommand,
  decide: runDecideCommand,
  discuss: runDiscussionCommand,
  next: runNextCommand,
  eval: runEvalCommand,
  resolve: runResolveCommand,
  context: runContextCommand,
  plan: runPlanCommand,
  program: runProgramCommand,
  overrides: runOverridesCommand,
  policies: runPoliciesCommand,
  workflows: runWorkflowsCommand,
  mission: runMissionCommand,
  jobs: runJobsCommand,
  impact: runImpactCommand,
  done: runDoneCommand,
  instructions: runInstructionsCommand,
  ui: runUiCommand,
  trust: runTrustCommand,
};
