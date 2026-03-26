'use client'

import { useState } from 'react'
import type { Beach } from '@/lib/types'

interface HistoricalDataProps {
  beach: Beach
}

export function HistoricalData({ beach }: HistoricalDataProps) {
  const [open, setOpen] = useState(false)
  const { historicalIncidents } = beach

  const mostCommon = historicalIncidents.bull >= historicalIncidents.white ? 'Bull shark' : 'White shark'

  return (
    <div className="border-t border-slate-800">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-3 text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        <span>Historical</span>
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          &#9662;
        </span>
      </button>

      {open && (
        <div className="px-6 pb-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Total incidents</span>
            <span className="text-slate-200">{historicalIncidents.total}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Bull shark</span>
            <span className="text-slate-200">{historicalIncidents.bull}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">White shark</span>
            <span className="text-slate-200">{historicalIncidents.white}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Most common</span>
            <span className="text-slate-200">{mostCommon}</span>
          </div>
          {historicalIncidents.lastIncidentDate && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Last incident</span>
              <span className="text-slate-200">{historicalIncidents.lastIncidentDate}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
