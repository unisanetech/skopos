# Human Interface Writing

Write for a person completing a task, not for the system describing itself. Load the
project-bound audience, voice, terminology, and legal requirements before choosing
product language.

## Purpose And Focus

1. Every sentence must help someone choose, act, or understand what is happening.
   Remove text that serves none of those purposes.
2. Keep one primary task or decision in focus. Reveal secondary detail when it becomes
   relevant instead of presenting every option at once.
3. Put the outcome and essential information first. Use short, scannable text; concise
   must not become abrupt, vague, or robotic.
4. Explain technical concepts through user-visible benefits, consequences, and
   tradeoffs. Retain a necessary domain term for an expert audience, but define it at
   the point of need.

## Page-Wide Content Roles

1. Inventory visible text across the complete page before polishing individual regions.
   Assign each string one role: orientation, title, instruction, action, status,
   explanation, metadata, or recovery.
2. Breadcrumbs and shell headers provide orientation; page titles name the current
   subject. Eyebrows add useful classification only when that context is not already
   clear. Do not repeat the same noun across all three.
3. A description adds a new decision-relevant fact. Delete it when it merely paraphrases
   the heading or explains an obvious control.
4. Tabs, segmented controls, cards, empty states, and side panels must not restate the
   page introduction. Write them for their local decision or action.
5. Read the finished page from top to bottom and remove repeated phrases, synonymous
   labels for one concept, and nearby text competing for the same role.

## Voice, Tone, And Inclusion

1. Follow the project's stable voice; adjust tone to the situation. Routine guidance
   can be warm, while risk, failure, privacy, and destructive actions stay calm and
   direct.
2. Prefer familiar, literal language over jargon, buzzwords, internal names, idioms,
   jokes, or clever labels. Never blame or scold the user.
3. Address the person directly when it improves clarity. Avoid mixing product and user
   perspectives such as `my` and `your` in the same phrase.
4. Write for localization and different abilities: avoid cultural assumptions,
   gendered defaults, directional instructions, and meaning carried by tone or color
   alone.

## Labels And Actions

1. Label an action with a specific verb and outcome: `Create project`, `Save changes`,
   or `Delete invoice`. Avoid `Submit`, `Proceed`, `Manage`, and `OK` when the result can
   be named.
2. Use one term for one concept throughout a flow. Match labels to the user's domain,
   not database entities, API operations, or component names.
3. Do not add instructions for an obvious control. If a control needs a paragraph to
   explain it, first improve its label, placement, or interaction.
4. Make primary and secondary actions visually and verbally distinct. Do not make a
   safe exit harder to understand than the preferred action.

## Feedback, Errors, And Empty States

1. Feedback says what happened and, when useful, what changed. Do not celebrate routine
   actions with noise or repeat information already visible on screen.
2. An error states the problem in user terms, preserves entered work where possible,
   and gives a specific recovery action. Place field errors beside the affected field.
3. Do not expose stack traces, status codes, internal identifiers, provider names, or
   implementation ownership unless the bound audience genuinely needs them.
4. An empty state distinguishes a valid beginning, filtered result, missing access,
   and failure. Offer the next useful action or an honest path back; never create a
   decorative dead end.

## Interruptions, Risk, And Agency

1. Interrupt only for required input, meaningful risk, irreversible loss, privacy or
   consent, or information that cannot wait. Prefer inline or non-blocking feedback for
   everything else.
2. A confirmation names the action, affected object, consequence, and whether recovery
   is possible. Do not ask `Are you sure?` without that context.
3. Prefer prevention and reversible actions. Preserve clear paths to cancel, go back,
   retry, undo, or recover without losing work.
4. Do not use urgency, guilt, hidden consequences, preselected consent, or misleading
   emphasis to push a choice.

## Transformations

| Avoid | Prefer |
| --- | --- |
| `Authentication operation failed` | `We couldn't sign you in. Check your email and try again.` |
| `Submit` | `Create project` |
| `Configure notification parameters` | `Choose when you're notified` |
| `Invalid input` | `Enter an email address like name@example.com.` |
| `No records available` | `No invoices yet` with `Create invoice` when available |
| `An error occurred` | `We couldn't save your changes. Try again.` |
| `Enable synchronization functionality` | `Keep your files updated across devices` |
| `Are you sure?` | `Delete “August report”? This can't be undone.` |
| `Access denied: insufficient scope` | `You don't have permission to edit this project.` |
| `Manage projects` below a `Projects` heading | `New project` or no repeated supporting text |
| `Tasks` in the shell, eyebrow, and page title | Keep shell orientation; use one meaningful page title |
| `View and manage your settings` under `Settings` | Remove it or state the specific consequence of these settings |

Judge each example against project vocabulary, audience knowledge, risk, and truth. Do
not copy example wording when the product context differs.

## Review

Read the rendered page in task order. Check that a first-time user can identify what the
page is for, what matters now, what each action will do, what happened after acting, and
how to recover. Remove repetition, speculative warnings, unnecessary interruptions,
technical leakage, and text that compensates for weak interaction design.
