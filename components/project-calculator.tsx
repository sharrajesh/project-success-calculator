"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Plus, Minus, Info } from "lucide-react"
import { TeamVisualization } from "@/components/team-visualization"
import { SuccessGauge } from "@/components/success-gauge"
import { ComparisonView } from "@/components/comparison-view"

const TEAM_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

export function ProjectCalculator() {
  const [numTeams, setNumTeams] = useState(2)
  const [teamSuccessRate, setTeamSuccessRate] = useState(80)
  const [availability, setAvailability] = useState(90)
  const [communication, setCommunication] = useState(85)
  const [skinInGame, setSkinInGame] = useState(80)
  const [iterationAbility, setIterationAbility] = useState(85)
  const [iterations, setIterations] = useState(2)
  const [showComparison, setShowComparison] = useState(false)

  const results = useMemo(() => {
    const communicationPaths = (numTeams * (numTeams - 1)) / 2

    if (numTeams === 1) {
      return {
        communicationPaths: 0,
        frictionPenalty: 100,
        baseSuccess: teamSuccessRate,
        communicationPenalty: 1,
        successPerIteration: teamSuccessRate,
        totalSuccess: teamSuccessRate,
      }
    }

    const frictionPenalty = (availability + communication + skinInGame + iterationAbility) / 4 / 100
    const baseSuccess = (teamSuccessRate / 100) * frictionPenalty
    const communicationPenalty = Math.max(0, 1 - communicationPaths * 0.05)
    const successPerIteration = baseSuccess * communicationPenalty
    const totalSuccess = Math.pow(successPerIteration, iterations) * 100

    return {
      communicationPaths,
      frictionPenalty: frictionPenalty * 100,
      baseSuccess: baseSuccess * 100,
      communicationPenalty,
      successPerIteration: successPerIteration * 100,
      totalSuccess: Math.max(0, totalSuccess),
    }
  }, [numTeams, teamSuccessRate, availability, communication, skinInGame, iterationAbility, iterations])

  const addTeam = () => {
    if (numTeams < TEAM_LABELS.length) {
      setNumTeams(numTeams + 1)
    }
  }

  const removeTeam = () => {
    if (numTeams > 1) {
      setNumTeams(numTeams - 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
      <div className="mb-8 md:mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Project Success Probability Calculator</h1>
        <p className="text-lg text-muted-foreground text-balance leading-relaxed">
          See how team dependencies and friction factors exponentially decrease your chances of shipping. The math is
          counterintuitive—but real.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Teams Working on Project</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={removeTeam}
                  disabled={numTeams <= 1}
                  className="h-8 w-8 bg-transparent"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="text-2xl font-bold font-mono w-12 text-center">{numTeams}</div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={addTeam}
                  disabled={numTeams >= TEAM_LABELS.length}
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <TeamVisualization numTeams={numTeams} teamLabels={TEAM_LABELS} />
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">Communication Paths Formula:</div>
              <div className="font-mono text-sm bg-background p-2 rounded border">
                n × (n - 1) ÷ 2 = {numTeams} × {numTeams - 1} ÷ 2 ={" "}
                <span className="font-bold">{results.communicationPaths}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Number of team-to-team communication channels required
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold">Team Success Rate</h2>
              <div className="group relative">
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                <div className="absolute left-0 top-6 w-64 p-3 bg-popover border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-sm">
                  The team's historical/baseline success rate (Bayesian prior). This represents their competence and
                  track record before applying friction factors.
                </div>
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Historical Success Rate</label>
              <span className="text-2xl font-bold font-mono">{teamSuccessRate}%</span>
            </div>
            <Slider
              value={[teamSuccessRate]}
              onValueChange={(v) => setTeamSuccessRate(v[0])}
              min={0}
              max={100}
              step={5}
              className="mb-1"
            />
            <p className="text-xs text-muted-foreground mt-2">
              What's the team's baseline success rate based on past performance?
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-xl font-semibold">Friction Factors</h2>
              <div className="group relative">
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                <div className="absolute left-0 top-6 w-64 p-3 bg-popover border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 text-sm">
                  Real-world factors that reduce the probability of successful coordination between teams.
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Availability</label>
                  <span className="text-sm font-mono">{availability}%</span>
                </div>
                <Slider
                  value={[availability]}
                  onValueChange={(v) => setAvailability(v[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="mb-1"
                />
                <p className="text-xs text-muted-foreground">How often teams are available for coordination</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Communication Quality</label>
                  <span className="text-sm font-mono">{communication}%</span>
                </div>
                <Slider
                  value={[communication]}
                  onValueChange={(v) => setCommunication(v[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="mb-1"
                />
                <p className="text-xs text-muted-foreground">Accuracy of specs and requirements across teams</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Skin in the Game</label>
                  <span className="text-sm font-mono">{skinInGame}%</span>
                </div>
                <Slider
                  value={[skinInGame]}
                  onValueChange={(v) => setSkinInGame(v[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="mb-1"
                />
                <p className="text-xs text-muted-foreground">Ownership and motivation level of team members</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Iteration Ability</label>
                  <span className="text-sm font-mono">{iterationAbility}%</span>
                </div>
                <Slider
                  value={[iterationAbility]}
                  onValueChange={(v) => setIterationAbility(v[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="mb-1"
                />
                <p className="text-xs text-muted-foreground">Ability to pivot and make changes quickly</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Iterations Required</h2>
              <span className="text-2xl font-bold font-mono">{iterations}</span>
            </div>
            <Slider value={[iterations]} onValueChange={(v) => setIterations(v[0])} min={1} max={10} step={1} />
            <p className="text-xs text-muted-foreground mt-2">
              Projects rarely succeed in one iteration. Each iteration multiplies the risk.
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Project Success Probability</h2>
            <SuccessGauge value={results.totalSuccess} />
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Per Iteration</span>
                <span className="text-lg font-semibold font-mono">{results.successPerIteration.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Over {iterations} Iterations</span>
                <span className="text-2xl font-bold font-mono">{results.totalSuccess.toFixed(1)}%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-muted/30">
            <h2 className="text-xl font-semibold mb-4">How the Math Works</h2>
            <div className="space-y-4 text-sm font-mono">
              <div>
                <div className="text-muted-foreground mb-1">Step 1: Friction Penalty</div>
                <div className="bg-background p-3 rounded border">
                  ({availability}% + {communication}% + {skinInGame}% + {iterationAbility}%) ÷ 4 ={" "}
                  {results.frictionPenalty.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Average all friction factors together</p>
              </div>

              <div>
                <div className="text-muted-foreground mb-1">Step 2: Base Success Rate</div>
                <div className="bg-background p-3 rounded border">
                  {teamSuccessRate}% × {results.frictionPenalty.toFixed(1)}% = {results.baseSuccess.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Apply friction penalty to team's historical success rate
                </p>
              </div>

              <div>
                <div className="text-muted-foreground mb-1">Step 3: Communication Penalty</div>
                <div className="bg-background p-3 rounded border">
                  {results.communicationPaths} paths × 5% penalty = {(results.communicationPaths * 5).toFixed(0)}%
                  reduction
                </div>
                <div className="bg-background p-3 rounded border mt-2">
                  Penalty multiplier: {results.communicationPenalty.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Each communication path adds coordination overhead</p>
              </div>

              <div>
                <div className="text-muted-foreground mb-1">Step 4: Success Per Iteration</div>
                <div className="bg-background p-3 rounded border">
                  {results.baseSuccess.toFixed(1)}% × {results.communicationPenalty.toFixed(2)} ={" "}
                  {results.successPerIteration.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Apply communication penalty to base rate</p>
              </div>

              <div>
                <div className="text-muted-foreground mb-1">Step 5: Success Over All Iterations</div>
                <div className="bg-background p-3 rounded border">
                  {numTeams === 1 ? (
                    <>{results.totalSuccess.toFixed(1)}% (no iteration penalty for single team)</>
                  ) : (
                    <>
                      ({results.successPerIteration.toFixed(1)}%)<sup>{iterations}</sup> ={" "}
                      {results.totalSuccess.toFixed(1)}%
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {numTeams === 1
                    ? "Single team: no coordination overhead, success rate stays at baseline"
                    : "Multiple teams: each iteration must succeed—probabilities multiply exponentially"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Compare Scenarios</h2>
              <Button variant="outline" size="sm" onClick={() => setShowComparison(!showComparison)}>
                {showComparison ? "Hide" : "Show"} Comparison
              </Button>
            </div>
            {showComparison && (
              <ComparisonView
                currentTeams={numTeams}
                currentSuccess={results.totalSuccess}
                iterations={iterations}
                teamSuccessRate={teamSuccessRate}
                availability={availability}
                communication={communication}
                skinInGame={skinInGame}
                iterationAbility={iterationAbility}
              />
            )}
          </Card>
        </div>
      </div>

      <Card className="p-6 border-l-4 border-l-primary mb-8">
        <h3 className="text-lg font-semibold mb-2">Key Insight</h3>
        <p className="text-muted-foreground leading-relaxed">
          Success probability doesn't decrease linearly with dependencies—it decreases{" "}
          <span className="font-semibold text-foreground">exponentially</span>. This is why projects stall. Not bad
          people. Bad structure. If you want to ship: reduce dependencies.
        </p>
      </Card>

      <Card className="p-6 bg-muted/30">
        <h3 className="text-lg font-semibold mb-4">Research & Credits</h3>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            This calculator is based on decades of research on team dynamics, coordination overhead, and software
            project success:
          </p>
          <ul className="space-y-2 ml-4">
            <li>
              <span className="font-semibold text-foreground">Brooks's Law</span> - "Adding manpower to a late software
              project makes it later." Communication overhead grows as n(n-1)/2 where n is team size. From{" "}
              <em>The Mythical Man-Month</em> by Frederick P. Brooks Jr. (1975).
            </li>
            <li>
              <span className="font-semibold text-foreground">Making Work Visible</span> by Dominica DeGrandis -
              Identifies dependencies as one of the "five thieves of time" that steal productivity and cause project
              delays.
            </li>
            <li>
              <span className="font-semibold text-foreground">Team Size Research</span> - Studies from QSM, Scrum Guide,
              and academic research consistently show optimal team sizes of 3-7 people, with productivity dropping
              exponentially as teams grow beyond 9 members.
            </li>
            <li>
              <span className="font-semibold text-foreground">Steiner's Law</span> - Increasing team members reduces
              productivity due to communication complexity, with efficiency dropping exponentially with each addition.
            </li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
