import type { RiskResult, RiskLevel } from '@/lib/types'

const LEVEL_BG: Record<RiskLevel, string> = {
  GREEN: 'bg-emerald-50 border-emerald-200',
  AMBER: 'bg-amber-50 border-amber-200',
  RED: 'bg-red-50 border-red-200',
}

const LEVEL_TEXT: Record<RiskLevel, string> = {
  GREEN: 'text-emerald-800',
  AMBER: 'text-amber-800',
  RED: 'text-red-800',
}

const LEVEL_LABELS: Record<RiskLevel, string> = {
  GREEN: 'Low Risk',
  AMBER: 'Elevated Risk',
  RED: 'High Risk',
}

interface RiskSummaryProps {
  beachName: string
  risk: RiskResult
}

export function RiskSummary({ beachName, risk }: RiskSummaryProps) {
  return (
    <div className={`border rounded-lg p-5 ${LEVEL_BG[risk.level]}`}>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold text-gray-900">{beachName}</h1>
        <span className={`text-lg font-bold ${LEVEL_TEXT[risk.level]}`}>
          {LEVEL_LABELS[risk.level]}
        </span>
      </div>

      {Math.abs(risk.bullScore - risk.whiteScore) > 0.15 && (
        <p className={`text-sm font-medium mb-2 ${LEVEL_TEXT[risk.level]}`}>
          {risk.species === 'bull' ? 'Bull shark' : 'White shark'} risk elevated
        </p>
      )}

      <p className="text-gray-700">{risk.reason}</p>

      {risk.clearance && (
        <p className="text-sm text-gray-500 mt-2">{risk.clearance}</p>
      )}
    </div>
  )
}
