import { Icon } from "@/components/ui/icon";
import type {
  LedgerStatus,
  ReadinessState,
  WorkstreamStageModel,
} from "./workstream.model";

export function WorkstreamStage({ stage }: { stage: WorkstreamStageModel }) {
  return (
    <div id="workstream-stage-panel" className="stage-panel" aria-label={stage.label}>
      <div className="stage-task-bar">
        <div>
          <p className="mini-label">Example Task · T-7f3a91c2</p>
          <h3>{stage.taskSummary}</h3>
        </div>
        <dl>
          <div>
            <dt>Status</dt>
            <dd className={`status-text status-text--${stage.taskStatus}`}>{capitalize(stage.taskStatus)}</dd>
          </div>
          <div>
            <dt>Scope</dt>
            <dd>checkout</dd>
          </div>
          <div>
            <dt>Owner</dt>
            <dd>@payments-team</dd>
          </div>
        </dl>
      </div>

      <div className="stage-story-grid">
        <section className="stage-story-cell" aria-labelledby="stage-found-title">
          <p className="stage-concept-label">Memory</p>
          <h3 id="stage-found-title">What Skopos found</h3>
          <p>{stage.reason}</p>
          <ul className="recovered-source-list">
            {stage.sources.map((source) => (
              <li key={source}>
                <Icon symbol={sourceIcon(source)} size="xs" />
                <code>{source}</code>
              </li>
            ))}
          </ul>
        </section>

        <section className="stage-story-cell" aria-labelledby="stage-change-title">
          <p className="stage-concept-label">Task</p>
          <h3 id="stage-change-title">What the agent should change</h3>
          <h4>{stage.nextAction}</h4>
          <code className="stage-action-path">{stage.nextActionPath}</code>
          <p>{stage.decisionBody}</p>
        </section>

        <section className="stage-story-cell" aria-labelledby="stage-boundary-title">
          <p className="stage-concept-label">Boundary</p>
          <h3 id="stage-boundary-title">What must not change</h3>
          <h4>{stage.boundaryTitle}</h4>
          <p>{stage.boundaryBody}</p>
        </section>

        <section className="stage-story-cell" aria-labelledby="stage-proof-title">
          <p className="stage-concept-label">Proof · Evidence + Readiness</p>
          <h3 id="stage-proof-title">What proves completion</h3>
          <ReadinessBadge state={stage.readiness} />
          <p>{stage.readinessBody}</p>
          <ul className="requirements-list">
            {stage.requirements.map((requirement) => (
              <li key={requirement.label}>
                <Icon
                  symbol={requirement.state === "valid" ? "check_circle" : requirement.state === "skipped" ? "do_not_disturb_on" : "radio_button_unchecked"}
                  filled={requirement.state === "valid"}
                  size="xs"
                  className={`requirement-icon requirement-icon--${requirement.state}`}
                />
                <span>{requirement.label}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <details className="project-proof">
        <summary>
          <span>
            <small>Supporting detail</small>
            <strong>View technical checks and proof details</strong>
          </span>
          <Icon className="proof-chevron" symbol="expand_more" size="sm" />
        </summary>
        <EvidenceLedger stage={stage} />
      </details>
    </div>
  );
}

function EvidenceLedger({ stage }: { stage: WorkstreamStageModel }) {
  return (
    <section className="evidence-ledger" aria-labelledby="ledger-title">
      <h3 id="ledger-title">Evidence &amp; Action ledger</h3>
      <div className="ledger-table-wrap">
        <table>
          <caption className="sr-only">
            Focused Actions and source-bound Evidence for the example checkout recovery Task
          </caption>
          <thead>
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Description</th>
              <th scope="col">Source</th>
              <th scope="col">Status</th>
              <th scope="col">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {stage.ledger.map((item) => (
              <tr key={`${item.type}-${item.description}`}>
                <td>
                  <Icon symbol={ledgerIcon(item.type)} size="xs" /> {item.type}
                </td>
                <td>{item.description}</td>
                <td>
                  <code>{item.source}</code>
                </td>
                <td>
                  <LedgerStatusLabel status={item.status} />
                </td>
                <td>
                  <code>{item.run}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mobile-ledger-list">
        {stage.ledger.map((item) => (
          <li key={`${item.type}-${item.description}`}>
            <Icon className="ledger-type-icon" symbol={ledgerIcon(item.type)} size="sm" />
            <span className="ledger-type">{item.type}</span>
            <span className="ledger-description">
              {item.description}
              <code>{item.source}</code>
            </span>
            <LedgerStatusLabel status={item.status} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ReadinessBadge({ state }: { state: ReadinessState }) {
  const ready = state === "ready";
  return (
    <div className={`readiness-badge readiness-badge--${state}`}>
      <Icon symbol={ready ? "check_circle" : "error"} filled={ready} size="sm" />
      {ready ? "Ready to finish" : "Blocked"}
    </div>
  );
}

function LedgerStatusLabel({ status }: { status: LedgerStatus }) {
  return (
    <span className={`ledger-status ledger-status--${status}`}>
      <span aria-hidden="true" />
      {capitalize(status)}
    </span>
  );
}

function ledgerIcon(type: WorkstreamStageModel["ledger"][number]["type"]) {
  return type === "Test" ? "fact_check" : type === "Build" ? "draft" : type === "Lint" ? "code" : "description";
}

function sourceIcon(source: string) {
  return source.includes("docs/") ? "description" : source.includes("Action") ? "play_circle" : source.includes("Guard") ? "shield" : source.includes("Skipped") ? "do_not_disturb_on" : "folder";
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
