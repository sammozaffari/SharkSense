'use client'

import { useState } from 'react'
import type { RiskResult } from '@/lib/types'

interface RiskDetailExpanderProps {
  result: RiskResult
}

export function RiskDetailExpander({ result }: RiskDetailExpanderProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t border-slate-800">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-3 text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        <span>{open ? 'Hide factors' : 'See all factors'}</span>
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          &#9662;
        </span>
      </button>

      {open && (
        <div className="px-6 pb-4 space-y-3">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Bull Shark Risk ({Math.round(result.bullScore * 100)}%)
            </h4>
            <ScoreBar label="Overall" value={result.bullScore} />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              White Shark Risk ({Math.round(result.whiteScore * 100)}%)
            </h4>
            <ScoreBar label="Overall" value={result.whiteScore} />
          </div>
        </div>
      )}
    </div>
  )
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100)
  const color = value >= 0.65 ? 'bg-red-500' : value >= 0.35 ? 'bg-amber-500' : 'bg-green-500'

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-16">{label}</span>
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500 w-8 text-right">{pct}%</span>
    </div>
  )
}
