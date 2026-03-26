import type { RiskResult } from '@/lib/types'

interface RiskReasonProps {
  result: RiskResult
}

export function RiskReason({ result }: RiskReasonProps) {
  const speciesLabel = result.species === 'bull' ? 'Bull shark' : 'White shark'

  return (
    <div className="px-6 py-5">
      <p className="text-lg font-medium text-slate-100">
        {result.reason}
      </p>
      {result.clearance && (
        <p className="mt-2 text-sm text-slate-400">
          {result.clearance}
        </p>
      )}
      <p className="mt-2 text-xs text-slate-500">
        Primary risk driver: {speciesLabel} ({Math.round(
          result.species === 'bull' ? result.bullScore * 100 : result.whiteScore * 100
        )}%)
      </p>
    </div>
  )
}
