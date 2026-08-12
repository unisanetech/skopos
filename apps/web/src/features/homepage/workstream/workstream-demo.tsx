"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { WorkstreamStage } from "./workstream-stage";
import { workstreamStages } from "./workstream.model";

export function WorkstreamDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const stage = workstreamStages[activeIndex];

  const activate = (index: number, moveFocus = false) => {
    const nextIndex = Math.max(0, Math.min(workstreamStages.length - 1, index));
    setActiveIndex(nextIndex);
    if (moveFocus) window.requestAnimationFrame(() => tabRefs.current[nextIndex]?.focus());
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = index + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = workstreamStages.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    activate((nextIndex + workstreamStages.length) % workstreamStages.length, true);
  };

  return (
    <div className="workstream-demo">
      <ol className="stage-tabs" aria-label="Workstream stages">
        {workstreamStages.map((item, index) => (
          <li key={item.id}>
            <button
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              className={index === activeIndex ? "stage-tab is-active" : "stage-tab"}
              aria-current={index === activeIndex ? "step" : undefined}
              aria-controls="workstream-stage-panel"
              onClick={() => activate(index)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              <span>{index + 1}</span>
              <span className="stage-tab-copy">
                <strong>{item.label}</strong>
                <small>{item.concept}</small>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mobile-stage-control">
        <div className="mobile-stage-summary">
          <span>{activeIndex + 1}</span>
          <strong>
            {activeIndex + 1} of {workstreamStages.length} · {stage.shortLabel}
          </strong>
        </div>
        <div className="mobile-stage-buttons">
          <Button
            variant="tonal"
            size="md"
            disabled={activeIndex === 0}
            leadingIcon={<Icon symbol="arrow_back" />}
            onClick={() => activate(activeIndex - 1)}
          >
            Previous
          </Button>
          <Button
            size="md"
            disabled={activeIndex === workstreamStages.length - 1}
            trailingIcon={<Icon symbol="arrow_forward" />}
            onClick={() => activate(activeIndex + 1)}
          >
            Next
          </Button>
        </div>
        <div className="stage-progress" aria-hidden="true">
          {workstreamStages.map((item, index) => (
            <span key={item.id} className={index <= activeIndex ? "is-complete" : undefined} />
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Stage {activeIndex + 1} of {workstreamStages.length}: {stage.label}
      </p>
      <WorkstreamStage key={stage.id} stage={stage} />
    </div>
  );
}
