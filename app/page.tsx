'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Beach, EnvironmentalData, RiskResult } from '@/lib/types'
import { beaches, DEFAULT_BEACH_ID } from '@/lib/geo/beaches'
import { fetchAllData } from '@/lib/data/fetchAll'
import { calculateRisk } from '@/lib/risk/combinedRisk'
import { BeachSwitcher } from '@/components/BeachSwitcher'
import { BeachRiskCard } from '@/components/BeachRiskCard'

export default function Home() {
  const [selectedId, setSelectedId] = useState(DEFAULT_BEACH_ID)
  const [envData, setEnvData] = useState<EnvironmentalData | null>(null)
  const [risk, setRisk] = useState<RiskResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const selectedBeach = beaches.find(b => b.id === selectedId) as Beach

  const loadData = useCallback(async (beach: Beach) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllData(beach)
      const riskResult = calculateRisk(beach, data)
      setEnvData(data)
      setRisk(riskResult)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData(selectedBeach)
  }, [selectedBeach, loadData])

  return (
    <main className="min-h-screen max-w-md mx-auto pb-8">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold tracking-tight">
          SharkSense
        </h1>
        <p className="text-xs text-slate-500">Predictive shark risk for NSW</p>
      </div>

      {/* Beach switcher */}
      <BeachSwitcher
        beaches={beaches}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {/* Content */}
      <div className="px-4 mt-2">
        {loading && (
          <div className="bg-slate-900 rounded-2xl p-12 text-center">
            <div className="animate-pulse text-slate-400">
              Loading conditions for {selectedBeach.shortName}...
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-slate-900 rounded-2xl p-8 text-center">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => loadData(selectedBeach)}
              className="mt-3 text-sm text-slate-400 underline hover:text-white"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && envData && risk && (
          <BeachRiskCard
            beach={selectedBeach}
            envData={envData}
            risk={risk}
          />
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-4 mt-6">
        <p className="text-[10px] text-slate-600 text-center leading-relaxed">
          SharkSense provides environmental information to help you make more informed
          decisions about ocean use. Risk is never zero in the ocean. Always follow
          official beach closures and lifeguard advice. Not affiliated with the NSW
          Government or Surf Life Saving NSW.
        </p>
      </div>
    </main>
  )
}
