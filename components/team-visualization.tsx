"use client"

import { useMemo } from "react"

interface TeamVisualizationProps {
  numTeams: number
  teamLabels: string[]
}

export function TeamVisualization({ numTeams, teamLabels }: TeamVisualizationProps) {
  const positions = useMemo(() => {
    const radius = 80
    const centerX = 120
    const centerY = 120
    const angleStep = (2 * Math.PI) / numTeams

    return Array.from({ length: numTeams }, (_, i) => {
      const angle = i * angleStep - Math.PI / 2
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        label: teamLabels[i],
      }
    })
  }, [numTeams, teamLabels])

  const connections = useMemo(() => {
    const lines = []
    for (let i = 0; i < numTeams; i++) {
      for (let j = i + 1; j < numTeams; j++) {
        lines.push({
          x1: positions[i].x,
          y1: positions[i].y,
          x2: positions[j].x,
          y2: positions[j].y,
        })
      }
    }
    return lines
  }, [numTeams, positions])

  return (
    <div className="flex justify-center">
      <svg width="240" height="240" className="overflow-visible">
        {/* Connection lines */}
        {connections.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground/30"
          />
        ))}

        {/* Team nodes */}
        {positions.map((pos, i) => (
          <g key={i}>
            <circle cx={pos.x} cy={pos.y} r="20" fill="currentColor" className="text-primary" />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-primary-foreground font-semibold text-sm"
              fill="currentColor"
            >
              {pos.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
