import { runImpactCommand, runDoneCommand } from './commands/impact.js';
import { runDiscussionCommand } from './commands/discussion.js';
import { runGatesCommand } from './commands/gates.js';
import { runInitCommand } from './commands/init.js';
import { runInstructionsCommand } from './commands/instructions.js';
import { runJobsCommand } from './commands/jobs.js';
import { runKnowledgeCommand } from './commands/knowledge.js';
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
import { runSetupCommand } from './commands/setup.js';
import { runSkillsCommand } from './commands/skills.js';
import { runTrustCommand } from './commands/trust.js';
import { runUnderstandCommand } from './commands/understanding.js';
import { runUiCommand } from './commands/ui.js';
import { runWorkflowsCommand } from './commands/workflows.js';
import type { SkoposCliCommandHandler } from './types.js';

export const skoposCliCommandRegistry: Record<string, SkoposCliCommandHandler> = {
  init: runInitCommand,
  scan: runScanCommand,
  setup: runSetupCommand,
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
  gates: runGatesCommand,
  policies: runPoliciesCommand,
  skills: runSkillsCommand,
  workflows: runWorkflowsCommand,
  mission: runMissionCommand,
  jobs: runJobsCommand,
  knowledge: runKnowledgeCommand,
  impact: runImpactCommand,
  done: runDoneCommand,
  instructions: runInstructionsCommand,
  ui: runUiCommand,
  trust: runTrustCommand,
  understand: runUnderstandCommand,
};
