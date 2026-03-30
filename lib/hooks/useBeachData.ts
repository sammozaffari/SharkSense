'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Beach, EnvironmentalData, RiskResult, RiskProjection } from '@/lib/types'
import { fetchAllData } from '@/lib/data/fetchAll'
import { calculateRisk } from '@/lib/risk/combinedRisk'
import { projectRisk } from '@/lib/risk/projectRisk'

interface BeachDataResult {
  envData: EnvironmentalData | null
  risk: RiskResult | null
  projections: RiskProjection[]
  loading: boolean
  error: string | null
  reload: () => void
}

export function useBeachData(beach: Beach): BeachDataResult {
  const [envData, setEnvData] = useState<EnvironmentalData | null>(null)
  const [risk, setRisk] = useState<RiskResult | null>(null)
  const [projections, setProjections] = useState<RiskProjection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllData(beach)
      const riskResult = calculateRisk(beach, data)
      const riskProjections = projectRisk(beach, data)
      setEnvData(data)
      setRisk(riskResult)
      setProjections(riskProjections)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [beach])

  useEffect(() => {
    loadData()
  }, [loadData])

  return { envData, risk, projections, loading, error, reload: loadData }
}
