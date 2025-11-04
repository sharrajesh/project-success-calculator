"use client"

import { useMemo } from "react"

interface ComparisonViewProps {
  currentTeams: number
  currentSuccess: number
  iterations: number
  teamSuccessRate: number
  availability: number
  communication: number
  skinInGame: number
  iterationAbility: number
}

export function ComparisonView({
  currentTeams,
  currentSuccess,
  iterations,
  teamSuccessRate,
  availability,
  communication,
  skinInGame,
  iterationAbility,
}: ComparisonViewProps) {
  const singleTeamSuccess = useMemo(() => {
    // Friction factors and iterations only matter with multiple teams (inter-team coordination)
    return teamSuccessRate
  }, [teamSuccessRate])

  const improvement = singleTeamSuccess - currentSuccess

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Current Setup */}
        <div className="p-4 border rounded-lg">
          <div className="text-xs text-muted-foreground mb-2">Your Setup</div>
          <div className="text-2xl font-bold font-mono mb-2">{currentSuccess.toFixed(1)}%</div>
          <div className="text-xs space-y-1">
            <div>{currentTeams} teams</div>
            <div>{(currentTeams * (currentTeams - 1)) / 2} dependencies</div>
          </div>
        </div>

        {/* Single Team Alternative */}
        <div className="p-4 border rounded-lg bg-success/10 border-success/20">
          <div className="text-xs text-muted-foreground mb-2">Single Team</div>
          <div className="text-2xl font-bold font-mono mb-2 text-success">{singleTeamSuccess.toFixed(1)}%</div>
          <div className="text-xs space-y-1">
            <div>1 team</div>
            <div>0 dependencies</div>
          </div>
        </div>
      </div>

      {improvement > 0 && (
        <div className="p-3 bg-muted rounded-lg text-sm">
          <span className="font-semibold text-success">+{improvement.toFixed(1)}%</span> improvement by eliminating
          cross-team dependencies
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Single team operates at baseline success rate—no coordination overhead or friction penalties.
      </div>
    </div>
  )
}
