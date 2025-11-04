"use client"

interface SuccessGaugeProps {
  value: number
}

export function SuccessGauge({ value }: SuccessGaugeProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value))

  // Calculate rotation for the needle (-90 to 90 degrees)
  const rotation = -90 + (clampedValue / 100) * 180

  // Determine color based on value
  const getColor = () => {
    if (clampedValue >= 70) return "text-success"
    if (clampedValue >= 30) return "text-warning"
    return "text-danger"
  }

  const getZoneColor = (start: number, end: number) => {
    if (clampedValue >= start && clampedValue < end) {
      if (end <= 30) return "text-danger"
      if (end <= 70) return "text-warning"
      return "text-success"
    }
    return "text-muted-foreground/20"
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-32">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Background arc zones */}
          <path
            d="M 20 90 A 80 80 0 0 1 100 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="20"
            className={getZoneColor(0, 30)}
            strokeLinecap="round"
          />
          <path
            d="M 100 10 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="20"
            className={getZoneColor(30, 100)}
            strokeLinecap="round"
          />

          {/* Center circle */}
          <circle cx="100" cy="90" r="8" fill="currentColor" className="text-foreground" />

          {/* Needle */}
          <line
            x1="100"
            y1="90"
            x2="100"
            y2="30"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className={getColor()}
            style={{
              transformOrigin: "100px 90px",
              transform: `rotate(${rotation}deg)`,
              transition: "transform 0.5s ease-out",
            }}
          />
        </svg>

        {/* Labels */}
        <div className="absolute bottom-0 left-0 text-xs text-muted-foreground">0%</div>
        <div className="absolute bottom-0 right-0 text-xs text-muted-foreground">100%</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">50%</div>
      </div>

      {/* Value display */}
      <div className={`text-5xl font-bold font-mono mt-4 ${getColor()}`}>{clampedValue.toFixed(1)}%</div>

      {/* Status text */}
      <div className="text-sm text-muted-foreground mt-2">
        {clampedValue >= 70 && "Good odds"}
        {clampedValue >= 30 && clampedValue < 70 && "Risky territory"}
        {clampedValue < 30 && "Likely to fail"}
      </div>
    </div>
  )
}
