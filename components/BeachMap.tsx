'use client'

import type { Beach, RiskLevel } from '@/lib/types'

interface BeachMapProps {
  beach: Beach
  riskLevel: RiskLevel
}

const RISK_COLORS: Record<RiskLevel, string> = {
  GREEN: '#22c55e',
  AMBER: '#f59e0b',
  RED: '#ef4444',
}

export function BeachMap({ beach, riskLevel }: BeachMapProps) {
  const color = RISK_COLORS[riskLevel]

  return (
    <div className="relative bg-slate-800 h-48 flex items-center justify-center overflow-hidden">
      {/* Static map placeholder — replace with Mapbox when token is available */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-blue-900 to-slate-900" />
      <div className="relative text-center z-10">
        <div
          className="mx-auto w-4 h-4 rounded-full border-2 border-white shadow-lg"
          style={{ backgroundColor: color }}
        />
        <p className="mt-2 text-xs text-slate-400">
          {beach.lat.toFixed(4)}, {beach.lng.toFixed(4)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {beach.estuaryDistanceKm < 1
            ? `${(beach.estuaryDistanceKm * 1000).toFixed(0)}m from ${beach.estuaryName}`
            : `${beach.estuaryDistanceKm.toFixed(1)}km from ${beach.estuaryName}`}
        </p>
      </div>
      <div className="absolute bottom-2 right-2 text-[9px] text-slate-600">
        Set NEXT_PUBLIC_MAPBOX_TOKEN for interactive map
      </div>
    </div>
  )
}
