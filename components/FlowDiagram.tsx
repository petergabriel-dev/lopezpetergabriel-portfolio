import { useId } from "react";

import type { FlowStep } from "@/content/types";

import styles from "./FlowDiagram.module.css";

type FlowDiagramProps = {
  steps: readonly FlowStep[];
};

const nodeWidth = 132;
const nodeHeight = 40;
const nodeGap = 28;
const diagramHeight = 64;

export function FlowDiagram({ steps }: FlowDiagramProps) {
  const markerId = `flow-arrow-${useId().replaceAll(":", "")}`;
  const diagramWidth = Math.max(nodeWidth, steps.length * nodeWidth + Math.max(0, steps.length - 1) * nodeGap);
  const alternative = steps.map((step) => step.label).join(", ");

  if (!steps.length) {
    return null;
  }

  return (
    <div className={styles.viewport} role="img" aria-label={alternative}>
      <svg
        aria-hidden="true"
        className={styles.svg}
        height={diagramHeight}
        viewBox={`0 0 ${diagramWidth} ${diagramHeight}`}
        width={diagramWidth}
      >
        <defs>
          <marker
            id={markerId}
            markerHeight="6"
            markerWidth="6"
            orient="auto-start-reverse"
            refX="5"
            refY="3"
            viewBox="0 0 6 6"
          >
            <path className={styles.arrowHead} d="M 0 0 L 6 3 L 0 6 z" />
          </marker>
        </defs>
        {steps.map((step, index) => {
          const x = index * (nodeWidth + nodeGap);
          const centerY = diagramHeight / 2;

          return (
            <g key={step.label}>
              {index > 0 ? (
                <line
                  className={styles.arrow}
                  markerEnd={`url(#${markerId})`}
                  x1={x - nodeGap + 4}
                  x2={x - 4}
                  y1={centerY}
                  y2={centerY}
                />
              ) : null}
              <rect
                className={styles.node}
                height={nodeHeight}
                rx="8"
                width={nodeWidth}
                x={x}
                y={(diagramHeight - nodeHeight) / 2}
              />
              <text
                className={styles.label}
                textAnchor="middle"
                x={x + nodeWidth / 2}
                y={centerY + 4}
              >
                {step.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
