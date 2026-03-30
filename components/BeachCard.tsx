'use client'

import Link from 'next/link'
import type { Beach, RiskLevel } from '@/lib/types'
import type { BeachRiskSummary } from '@/lib/data/fetchAllBeaches'

const LEVEL_STYLES: Record<RiskLevel, string> = {
  GREEN: 'bg-risk-green text-white',
  AMBER: 'bg-risk-amber text-gray-900',
  RED: 'bg-risk-red text-white',
}

const LEVEL_LABELS: Record<RiskLevel, string> = {
  GREEN: 'Low',
  AMBER: 'Elevated',
  RED: 'High',
}

interface BeachCardProps {
  beach: Beach
  summary: BeachRiskSummary | null
  isFavourite: boolean
  onToggleFavourite: (id: string) => void
}

export function BeachCard({ beach, summary, isFavourite, onToggleFavourite }: BeachCardProps) {
  if (!summary) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900">{beach.name}</span>
          <span className="text-sm text-gray-400">Unavailable</span>
        </div>
      </div>
    )
  }

  const { risk, envData } = summary

  return (
    <Link href={`/beach/${beach.id}`} className="block">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {/* Row 1: Risk badge + beach name + fav */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${LEVEL_STYLES[risk.level]}`}>
              {LEVEL_LABELS[risk.level]}
            </span>
            <span className="font-medium text-gray-900">{beach.shortName}</span>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); onToggleFavourite(beach.id) }}
            className="text-lg"
            aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          >
            {isFavourite ? '\u2605' : '\u2606'}
          </button>
        </div>

        {/* Row 2: Reason */}
        <p className="text-sm text-gray-600 mb-2">{risk.reason}</p>

        {/* Row 3: Inline key numbers */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <span>Rain: <b className={envData.weather.rainfall72hr >= 45 ? 'text-amber-700' : ''}>{envData.weather.rainfall72hr.toFixed(0)}mm</b></span>
          <span>SST: <b className={envData.marine.sst >= 22 ? 'text-amber-700' : ''}>{envData.marine.sst.toFixed(1)}&deg;C</b></span>
          <span>Estuary: <b className={beach.estuaryDistanceKm <= 0.5 ? 'text-amber-700' : ''}>{beach.estuaryDistanceKm < 0.1 ? '<100m' : `${beach.estuaryDistanceKm}km`}</b></span>
          {(envData.detections?.length ?? 0) > 0 && (
            <span className="text-red-600 font-medium">Detection nearby</span>
          )}
        </div>

        {/* Row 4: Clearance + timestamp */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span>
            {risk.clearance ?? ''}
            {risk.level !== 'GREEN' && Math.abs(risk.bullScore - risk.whiteScore) > 0.15
              ? `${risk.clearance ? ' · ' : ''}${risk.species === 'bull' ? 'Bull' : 'White'} shark risk`
              : ''}
          </span>
          <span>
            {new Date(envData.fetchedAt).toLocaleTimeString('en-AU', {
              timeZone: 'Australia/Sydney', hour: 'numeric', minute: '2-digit', hour12: true,
            })}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function BeachCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-14 h-5 bg-gray-200 rounded animate-pulse" />
        <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="w-2/3 h-3 bg-gray-200 rounded animate-pulse" />
    </div>
  )
}
