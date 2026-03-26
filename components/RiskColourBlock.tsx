import type { RiskLevel } from '@/lib/types'

interface RiskColourBlockProps {
  level: RiskLevel
  beachName: string
  score: number
}

const RISK_STYLES: Record<RiskLevel, { bg: string; text: string; label: string }> = {
  GREEN: { bg: 'bg-green-500', text: 'text-white', label: 'LOW RISK' },
  AMBER: { bg: 'bg-amber-500', text: 'text-slate-900', label: 'ELEVATED RISK' },
  RED: { bg: 'bg-red-500', text: 'text-white', label: 'HIGH RISK' },
}

export function RiskColourBlock({ level, beachName, score }: RiskColourBlockProps) {
  const style = RISK_STYLES[level]

  return (
    <div className={`${style.bg} ${style.text} px-6 py-10 text-center`}>
      <div className="text-sm font-semibold uppercase tracking-widest opacity-80">
        {style.label}
      </div>
      <div className="mt-2 text-3xl font-bold">{beachName}</div>
      <div className="mt-1 text-sm opacity-70">
        Risk score: {Math.round(score * 100)}%
      </div>
    </div>
  )
}
