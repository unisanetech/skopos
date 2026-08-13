export const SKOPOS_CLI_HELP = `Skopos CLI

Usage:
  skopos setup [target] [--actor <id>] [--host <name> --session-id <id>] [--dry-run] [--json]
  skopos setup status [target] [--actor <id>] [--json]
  skopos setup review [target] [--actor <id>] [--json]
  skopos setup decide <recommendation-id> <accept|edit|defer|reject> [target] [--note <text>] --actor <id> [--json]
  skopos setup answer <question-id> <option-id> [target] --actor <id> [--json]
  skopos setup submit <analysis.json> [target] --actor <id> [--dry-run] [--json]
  skopos setup submit-completion <receipt.json> [target] --actor <id> [--dry-run] [--json]
  skopos setup confirm-host-delivery [target] --actor <id> --host <name> --session-id <id> --context-marker <marker> --context-digest <sha256> [--dry-run] [--json]
  skopos setup resume [target] --actor <id> [--host <name> --session-id <id>] [--dry-run] [--json]
  skopos init [target] [--mode existing|greenfield] [--subtree <path>] [--actor <id>] [--dry-run] [--force] [--no-scaffold-instructions] [--force-instructions] [--json]
  skopos scan [target] [--subtree <path>] [--actor <id>] [--json]
  skopos session context [target] [--actor <id>] [--session-id <id>] [--host <name>] [--lease-seconds <n>] [--dry-run] [--json]
  skopos coordination status [target] [--json]
  skopos coordination session open [target] --actor <id> --host <name> [--session <id>] [--mode <writer|read-only|reviewer>] [--lease-seconds <n>] [--json]
  skopos coordination session heartbeat [target] --session <id> [--lease-seconds <n>] [--json]
  skopos coordination session close [target] --session <id> [--json]
  skopos coordination task reserve <task-id> [target] --session <id> [--json]
  skopos coordination task release <task-id> [target] --session <id> --reason <text> [--json]
  skopos coordination claim add <kind> <resource> [target] --task <id> --session <id> [--json]
  skopos start <goal> [target] [--scope <scope>] [--risk <light|standard|high-impact>] [--proof-subject <task-closure|project-integration>] [--accept <criterion>] [--non-goal <text>] [--constraint <text>] [--own <path>] [--priority <0-100>] [--depends-on <task-id>] [--actor <id>] [--session-id <id>] [--host <name>] [--lease-seconds <n>] [--full] [--dry-run] [--json]
  skopos decide <question-id> <option-id> [target] [--actor <id>] [--full] [--dry-run] [--json]
  skopos discuss append-turn [target] [--thread <id>] [--session-id <id>] [--role <user|assistant|system>] [--source-event <event>] [--transcript-path <path>] [--message <text>|--message-stdin] [--dry-run] [--json]
  skopos discuss checkpoint [target] [--dry-run] [--json]
  skopos discuss handoff create [target] --task <task-id> --context <capsule.json> [--dry-run] [--json]
  skopos discuss handoff refresh|show|verify|render [target] --task <task-id> [--dry-run] [--json]
  skopos discuss handoff accept [target] --task <task-id> --actor <id> --receiving-session <id> --host <name> [--dry-run] [--json]
  skopos discuss handoff deliver [target] --task <task-id> --actor <id> --result <pass|fail> --origin-message <succeeded|failed|unsupported> --detail <text> [--destination-ref <id>] [--dry-run] [--json]
  skopos discuss recent [target] [--json]
  skopos verify <task-id> [target] [--phase <admission|iteration|stabilization|closure>] [--full|--collection <name>] [--cursor <token>] [--limit <1-100>] [--dry-run] [--json]
  skopos finish <task-id> [target] --actor <id> [--dry-run] [--json]
  skopos readiness <task-id> [target] [--for <continue|integrate|close>] [--advance --actor <id>] [--dry-run] [--json]
  skopos work queue [target] [--actor <id>] [--cursor <token>] [--limit <1-100>] [--dry-run] [--json]
  skopos work next [target] [--actor <id>] [--dry-run] [--json]
  skopos resolve [scope] [target] [--json]
  skopos context [scope] [target] [--json]
  skopos plan <goal> [target] [--scope <scope>] [--actor <id>] [--full] [--dry-run] [--json]
  skopos guards resolve [target] [--actor <id>] [--dry-run] [--json]
  skopos integrations propose [target] [--dry-run] [--json]
  skopos integrations approve [target] --proposal <digest> --accept <candidate-id> [--accept <candidate-id>...] [--action-manifest <path> --guard-manifest <path>] --actor <id> --reason <text> [--dry-run] [--json]
  skopos integrations apply [target] --approval <digest> --actor <id> [--dry-run] [--json]
  skopos policies list [target] [--json]
  skopos policies show <pack> [target] [--json]
  skopos policies recommend [target] [--dry-run] [--json]
  skopos policies apply <pack> [target] --actor <id> --reason <text> [--dry-run] [--json]
  skopos policies drift [target] [--actor <id>] [--dry-run] [--json]
  skopos policies mappings list [target] [--json]
  skopos policies mappings confirm --pack <pack> --role <role> [--path <path>] --reason <text> --actor <id> [--cwd <target>] [--json]
  skopos policies mappings ignore --pack <pack> --role <role> --reason <text> --actor <id> [--cwd <target>] [--json]
  skopos policies mappings remove <decision-id> --actor <id> [--cwd <target>] [--json]
  skopos policies overrides list [target] [--json]
  skopos policies overrides add --reason <text> --actor <id> [--finding <id>|--rule <id>|--pack <id>|--source-path <path>] [--cwd <target>] [--json]
  skopos policies overrides remove <override-id> --actor <id> [--cwd <target>] [--json]
  skopos skills list [target] [--json]
  skopos skills show <pack> [target] [--json]
  skopos skills recommend [target] [--dry-run] [--json]
  skopos skills evaluate <pack> [target] --binding <id> [--dry-run] [--json]
  skopos skills context <task-id> [target] [--json]
  skopos skills apply <pack> [target] --binding <id> --actor <id> --reason <text> [--dry-run] [--json]
  skopos actions list [target] [--cursor <token>] [--limit <1-100>] [--json]
  skopos actions show <action> [target] [--json]
  skopos actions run <action> [target] [--task <id>] [--dry-run] [--approve] [--force] [--actor <id>] [--full] [--json]
  skopos actions recover <run-id> [target] --actor <id> --reason <text> [--json]
  skopos evidence reuse <task-id> [target] --actor <id> [--full] [--json]
  skopos evidence record-observation <task-id> [target] [--requirement <id>] [--guard <id>] --statement <text> --actor <id> [--full] [--dry-run] [--json]
  skopos evidence record-browser <task-id> [target] [--requirement <id>] [--guard <id>] --url <url-or-route> --viewport <WIDTHxHEIGHT[@SCALE]> --interaction <text> (--capture <workspace-path>|--measurement <text>) [--capture-kind <screenshot|accessibility|dom-measurement>] [--condition <text>] --browser <name-and-version> --actor <id> [--full] [--dry-run] [--json]
  skopos task show <task-id> [target] [--full|--collection <name>] [--cursor <token>] [--limit <1-100>] [--json]
  skopos task claim <task-id> [target] --actor <id> [--json]
  skopos task release <task-id> [target] --actor <id> [--json]
  skopos task split propose <parent-task-id> [target] --from <proposal.json> --reason <text> --actor <id> [--dry-run] [--json]
  skopos task split apply <parent-task-id> [target] --proposal <digest> --reason <text> --actor <id> [--dry-run] [--json]
  skopos task child start <parent-task-id> <goal> [target] --own <path> [--accept <criterion>] [--parent-acceptance <requirement-id>] [--scope <scope>] --reason <text> --actor <id> [--json]
  skopos task assign <task-id> [target] --actor <id> --session-id <id> [--host <name>] [--lease-seconds <n>] [--json]
  skopos task ownership add <task-id> --own <path> [--own <path>...] --reason <text> --actor <id> [--cwd <target>] [--json]
  skopos task step complete <task-id> <step-id> [--cwd <target>] --actor <id> [--json]
  skopos task memory resolve <task-id> <obligation-id> --resolution memory-updated|reviewed-no-change --reason <text> [--target <path>] [--cwd <target>] --actor <id> [--json]
  skopos task verify <task-id> [target] --actor <id> [--full] [--json]
  skopos knowledge [target] [--actor <id>] [--full] [--summary] [--fields <names>] [--json]
  skopos impact [changed-path...] [--cwd <target>] [--actor <id>] [--phase <phase>] [--risk <risk>] [--why] [--collection <changed|matched-guards|required-actions|guard-decisions|action-decisions>] [--cursor <token>] [--limit <1-100>] [--json]
  skopos instructions scaffold [target] [--mode existing|greenfield] [--force] [--dry-run] [--actor <id>] [--json]
  skopos instructions sync [target] [--dry-run] [--actor <id>] [--json]
  skopos understand [target] [--actor <id>] [--dry-run] [--json]
  skopos ui render [target] [--output <path>] [--dry-run] [--json]
  skopos ui build [target] [--output-dir <path>] [--dry-run] [--json]
  skopos ui dev [target] [--host <host>] [--port <port>] [--json]        # live workspace UI with auto-refreshing state
  skopos ui serve [target] [--output-dir <path>] [--host <host>] [--port <port>] [--json]  # snapshot preview; restart after state changes
`;

const SKOPOS_START_HELP = `Skopos start

Usage:
  skopos start <goal> [target] [--scope <scope>] [--risk <light|standard|high-impact>] [--proof-subject <task-closure|project-integration>] [--accept <criterion>] [--non-goal <text>] [--constraint <text>] [--own <path>] [--priority <0-100>] [--depends-on <task-id>] [--actor <id>] [--session-id <id>] [--host <name>] [--lease-seconds <n>] [--full] [--dry-run] [--json]

Task risk:
  Use --risk when the caller has already classified the Task. Otherwise Skopos infers
  risk and detail from the goal, owned paths, affected Scopes, and proof subject. The
  Task records both the recommendation and any explicit override. Explicit
  project-integration proof remains high-impact.

Progressive workflow:
  light        Fast path: focused Evidence, no tracked Task document, no snapshot, and
               finish performs closure verification without a separate verify command.
  standard     Tracked path for bounded coordinated work.
  high-impact  Strict path with durable Task state, Memory review, and immutable snapshot.

Proof subjects:
  task-closure         Default. Prove only the admitted Task-owned change boundary.
  project-integration  Explicitly prove a named integration boundary. Requires at least
                       one owned path and creates a detailed high-impact Task.

Unrelated pre-existing or other-Task changes stay visible but do not silently enter
either proof subject. Use project-integration only when the requested outcome is an
integration or release baseline, not as a workaround for a dirty worktree.
`;

const SKOPOS_SETUP_HELP = `Skopos setup

Usage:
  skopos setup [target] [--actor <id>] [--host <name> --session-id <id>] [--dry-run] [--json]
  skopos setup status [target] [--actor <id>] [--json]
  skopos setup review [target] [--actor <id>] [--json]
  skopos setup decide <recommendation-id> <accept|edit|defer|reject> [target] [--note <text>] --actor <id> [--json]
  skopos setup answer <question-id> <option-id> [target] --actor <id> [--json]
  skopos setup submit <analysis.json> [target] --actor <id> [--dry-run] [--json]
  skopos setup submit-completion <receipt.json> [target] --actor <id> [--dry-run] [--json]
  skopos setup confirm-host-delivery [target] --actor <id> --host <name> --session-id <id> --context-marker <marker> --context-digest <sha256> [--dry-run] [--json]
  skopos setup resume [target] --actor <id> [--host <name> --session-id <id>] [--dry-run] [--json]

Setup is the normal project onboarding entry point. It understands the repository,
asks only material questions, presents one review covering Project Memory, Scopes,
checks, Policies, Skills, instructions, and coding-agent context delivery, then applies
only accepted recommendations. Choices are bound to the project evidence they reviewed.
Agent-owned Scope or document work becomes applied only after submit-completion verifies
its current source-bound postconditions. Host delivery becomes ready only when the host
explicitly confirms the exact live Session context marker and digest; setup never self-certifies it.

Use init only as a low-level reconstruction or diagnostic command.
`;

const SKOPOS_DECIDE_HELP = `Skopos decide

Usage:
  skopos decide <question-id> <option-id> [target] [--actor <id>] [--full] [--dry-run] [--json]

Records one explicit answer to an open Task question and recomputes the Work Queue.
Use \`skopos session context . --json\` to see the recommendation, alternatives, and
the exact option ids before deciding.
`;

const SKOPOS_ACTIONS_HELP = `Skopos actions

Usage:
  skopos actions list [target] [--cursor <token>] [--limit <1-100>] [--json]
  skopos actions show <action> [target] [--json]
  skopos actions run <action> [target] [--task <id>] [--dry-run] [--approve] [--force] [--actor <id>] [--full] [--json]
  skopos actions recover <run-id> [target] --actor <id> --reason <text> [--json]

Every live-worktree Action manifest must explicitly declare
\`workspaceMode: overlay-safe\`. A successful project-level run becomes Task proof
only when it is linked with \`--task <id>\` or reused through the Evidence command.
`;

const SKOPOS_TASK_HELP = `Skopos task

Usage:
  skopos task show <task-id> [target] [--full|--collection <name>] [--cursor <token>] [--limit <1-100>] [--json]
  skopos task claim <task-id> [target] --actor <id> [--json]
  skopos task release <task-id> [target] --actor <id> [--json]
  skopos task split propose <parent-task-id> [target] --from <proposal.json> --reason <text> --actor <id> [--dry-run] [--json]
  skopos task split apply <parent-task-id> [target] --proposal <digest> --reason <text> --actor <id> [--dry-run] [--json]
  skopos task child start <parent-task-id> <goal> [target] --own <path> [--accept <criterion>] [--parent-acceptance <requirement-id>] [--scope <scope>] --reason <text> --actor <id> [--json]
  skopos task assign <task-id> [target] --actor <id> --session-id <id> [--host <name>] [--lease-seconds <n>] [--json]
  skopos task ownership add <task-id> --own <path> [--own <path>...] --reason <text> --actor <id> [--cwd <target>] [--json]
  skopos task disposition <task-id> <resume|ready|defer|return-from-verification|cancel|supersede> --reason <text> [--successor <task-id>] [--cwd <target>] --actor <id> [--json]
  skopos task question dispose <task-id> <question-id> --disposition dismissed|promoted --reason <text> [--target <path>] [--cwd <target>] --actor <id> [--json]
  skopos task step complete <task-id> <step-id> [--cwd <target>] --actor <id> [--json]
  skopos task memory resolve <task-id> <obligation-id> --resolution memory-updated|reviewed-no-change --reason <text> [--target <path>] [--cwd <target>] --actor <id> [--json]
  skopos task verify <task-id> [target] --actor <id> [--json]

Ownership expansion is explicit and audited. It preserves the admission baseline,
records the actor, reason, and adopted-path state, refreshes affected Guards and
Actions, and changes the proof-subject identity so stale proof cannot close the wider
Task.

Task show reports changed paths outside declared ownership and provides an exact,
audited ownership-add command. High-impact work never adopts those paths silently.

Split proposal is review-only: it validates child keys, dependency order, parent
acceptance mappings, and non-overlapping owned paths without changing any Task.
Applying the exact proposal digest creates linked tracked children and blocks parent
closure until every child completes successfully. Assignment opens or reuses one
host-neutral Session, reserves one child, and claims that child's resources; it does
not claim that Skopos launched a host chat.
`;

const SKOPOS_IMPACT_HELP = `Skopos impact

Usage:
  skopos impact [changed-path...] [--cwd <target>] [--actor <id>] [--phase <admission|iteration|stabilization|closure>] [--risk <light|standard|high-impact>] [--why] [--collection <changed|matched-guards|required-actions|guard-decisions|action-decisions>] [--cursor <token>] [--limit <1-100>] [--json]

Impact is the deterministic explanation surface for affected Scopes, Guards, and
Actions. Use --why for a human-readable list of every selected and skipped capability.
Use guard-decisions or action-decisions for bounded JSON pagination.
`;

const SKOPOS_TASK_OWNERSHIP_HELP = `Skopos task ownership

Usage:
  skopos task ownership add <task-id> --own <path> [--own <path>...] --reason <text> --actor <id> [--cwd <target>] [--json]

Use this when review discovers additional files that belong to the same Task intent.
Create a follow-up Task instead when the new path changes the goal, risk, public
behavior, or accepted proof subject.
`;

const SKOPOS_SKILLS_HELP = `Skopos skills

Usage:
  skopos skills list [target] [--json]
  skopos skills show <pack> [target] [--json]
  skopos skills recommend [target] [--dry-run] [--json]
  skopos skills evaluate <pack> [target] --binding <id> [--dry-run] [--json]
  skopos skills context <task-id> [target] [--json]
  skopos skills apply <pack> [target] --binding <id> --actor <id> --reason <text> [--dry-run] [--json]

Evaluate runs the pack's exact deterministic fixtures against one project binding.
Context is a read-only projection of the canonical compact Task brief; it does not
create a second selector or Task authority.
`;

const SKOPOS_SKILLS_CONTEXT_HELP = `Skopos skills context

Usage:
  skopos skills context <task-id> [target] [--json]

Returns the Task-selected, module-local Skill guidance and bound capabilities from
the canonical compact Task brief. Irrelevant Tasks return zero Skill context.
`;

const SKOPOS_ACTIONS_RUN_HELP = `Skopos actions run

Usage:
  skopos actions run <action> [target] [--task <id>] [--dry-run] [--approve] [--force] [--actor <id>] [--full] [--json]

Runs one registered project Action with its declared capabilities, effects,
concurrency, inputs, outputs, and overlay-safe workspace contract. Pass \`--task\`
when the result must satisfy that Task's selected Evidence requirements.
`;

const SKOPOS_VERIFY_HELP = `Skopos verify

Usage:
  skopos verify <task-id> [target] [--phase <admission|iteration|stabilization|closure>] [--full|--collection <name>] [--cursor <token>] [--limit <1-100>] [--dry-run] [--json]

Evaluates the Task's named proof subject, stable admission baseline, acceptance
coverage, Guards, Evidence, Memory obligations, and Readiness. Verify is diagnostic:
it does not run Actions or advance Task state.
`;

const SKOPOS_FINISH_HELP = `Skopos finish

Usage:
  skopos finish <task-id> [target] --actor <id> [--dry-run] [--json]

Performs atomic closure: verifies the current named proof subject, advances only when
ready, archives the tracked Task projection, and rechecks final Readiness. Finish does
not widen the proof subject or run missing Actions implicitly.
`;

const COMMAND_HELP = new Map<string, string>([
  ['setup', SKOPOS_SETUP_HELP],
  ['start', SKOPOS_START_HELP],
  ['decide', SKOPOS_DECIDE_HELP],
  ['task', SKOPOS_TASK_HELP],
  ['task ownership', SKOPOS_TASK_OWNERSHIP_HELP],
  ['skills', SKOPOS_SKILLS_HELP],
  ['skills context', SKOPOS_SKILLS_CONTEXT_HELP],
  ['actions', SKOPOS_ACTIONS_HELP],
  ['actions run', SKOPOS_ACTIONS_RUN_HELP],
  ['verify', SKOPOS_VERIFY_HELP],
  ['finish', SKOPOS_FINISH_HELP],
  ['impact', SKOPOS_IMPACT_HELP],
]);

const HELP_FLAGS = new Set(['--help', '-h']);

export const resolveCommandHelp = (
  command: string,
  args: string[] = [],
): string | undefined => {
  const subcommand = args.find(
    (argument) => !HELP_FLAGS.has(argument) && !argument.startsWith('-'),
  );
  const key = subcommand ? `${command} ${subcommand}` : command;
  return COMMAND_HELP.get(key) ?? COMMAND_HELP.get(command);
};

export const printHelp = (): void => {
  process.stdout.write(SKOPOS_CLI_HELP);
};

export const printCommandHelp = (command: string, args: string[] = []): boolean => {
  const help = resolveCommandHelp(command, args);
  if (!help) return false;
  process.stdout.write(help);
  return true;
};
