'use client'

import { use } from 'react'
import Link from 'next/link'
import { getBeachById } from '@/lib/geo/beaches'
import { useBeachData } from '@/lib/hooks/useBeachData'
import { RiskSummary } from '@/components/RiskSummary'
import { KeyNumbers } from '@/components/KeyNumbers'
import { DetailSections } from '@/components/DetailSections'
import { DataSourceStatus } from '@/components/DataSourceStatus'

export default function BeachDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const beach = getBeachById(id)

  if (!beach) {
    return (
      <main className="min-h-screen max-w-lg mx-auto px-4 pt-10">
        <Link href="/" className="text-blue-500 text-sm">&larr; Back</Link>
        <p className="mt-4 text-gray-500">Beach not found.</p>
      </main>
    )
  }

  return <BeachDetail beach={beach} />
}

function BeachDetail({ beach }: { beach: import('@/lib/types').Beach }) {
  const { envData, risk, projections, loading, error } = useBeachData(beach)

  return (
    <main className="min-h-screen max-w-lg mx-auto pb-12">
      <div className="px-4 pt-6 pb-4">
        <Link href="/" className="text-blue-500 text-sm">&larr; All beaches</Link>
      </div>

      {loading && (
        <div className="px-4 space-y-4">
          <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-48 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      )}

      {error && (
        <div className="px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">Failed to load data: {error}</p>
          </div>
        </div>
      )}

      {!loading && risk && envData && projections && (
        <div className="px-4 space-y-4">
          {/* Layer 1: Risk Summary */}
          <RiskSummary beachName={beach.name} risk={risk} />

          {/* Layer 2: Key Numbers + 5-day outlook */}
          <KeyNumbers
            env={envData}
            risk={risk}
            projections={projections}
            estuaryName={beach.estuaryName}
            estuaryDistanceKm={beach.estuaryDistanceKm}
          />

          {/* Layer 3: Risk Breakdown + Science + History */}
          <DetailSections risk={risk} beach={beach} env={envData} />

          {/* Layer 4: Data Source Status */}
          <DataSourceStatus />

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 text-center leading-relaxed pt-4">
            SharkSense provides environmental information only. Risk is never zero.
            Always follow official beach closures and lifeguard advice.
          </p>
        </div>
      )}
    </main>
  )
}
