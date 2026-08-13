import { runImpactCommand } from './commands/impact.js';
import { runDiscussionCommand } from './commands/discussion.js';
import { runGuardsCommand } from './commands/guards.js';
import { runInitCommand } from './commands/init.js';
import { runInstructionsCommand } from './commands/instructions.js';
import { runKnowledgeCommand } from './commands/knowledge.js';
import { runTaskCommand } from './commands/task.js';
import { runPoliciesCommand } from './commands/policies.js';
import { runWorkCommand } from './commands/work.js';
import { runContextCommand, runResolveCommand } from './commands/query.js';
import { runCoordinationCommand } from './commands/coordination.js';
import {
  runDecideCommand,
  runPlanCommand,
  runStartCommand,
} from './commands/router.js';
import { runScanCommand } from './commands/scan.js';
import { runSessionCommand } from './commands/session.js';
import { runSetupCommand } from './commands/setup.js';
import { runSkillsCommand } from './commands/skills.js';
import {
  runFinishCommand,
  runReadinessCommand,
  runVerifyCommand,
} from './commands/verification.js';
import { runUnderstandCommand } from './commands/understanding.js';
import { runUiCommand } from './commands/ui.js';
import { runActionsCommand } from './commands/actions.js';
import { runEvidenceCommand } from './commands/evidence.js';
import { runIntegrationsCommand } from './commands/integrations.js';
import { runStorageCommand } from './commands/storage.js';
import type { SkoposCliCommandHandler } from './types.js';

export const skoposCliCommandRegistry: Record<string, SkoposCliCommandHandler> = {
  init: runInitCommand,
  scan: runScanCommand,
  session: runSessionCommand,
  setup: runSetupCommand,
  start: runStartCommand,
  decide: runDecideCommand,
  discuss: runDiscussionCommand,
  verify: runVerifyCommand,
  finish: runFinishCommand,
  readiness: runReadinessCommand,
  resolve: runResolveCommand,
  context: runContextCommand,
  coordination: runCoordinationCommand,
  plan: runPlanCommand,
  work: runWorkCommand,
  guards: runGuardsCommand,
  policies: runPoliciesCommand,
  skills: runSkillsCommand,
  actions: runActionsCommand,
  evidence: runEvidenceCommand,
  task: runTaskCommand,
  knowledge: runKnowledgeCommand,
  impact: runImpactCommand,
  instructions: runInstructionsCommand,
  ui: runUiCommand,
  understand: runUnderstandCommand,
  integrations: runIntegrationsCommand,
  storage: runStorageCommand,
};
