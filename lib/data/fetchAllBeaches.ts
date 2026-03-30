import type { Beach, EnvironmentalData, RiskResult, RiskProjection } from '@/lib/types'
import { fetchAllData } from './fetchAll'
import { calculateRisk } from '@/lib/risk/combinedRisk'
import { projectRisk } from '@/lib/risk/projectRisk'

export interface BeachRiskSummary {
  beach: Beach
  envData: EnvironmentalData
  risk: RiskResult
  projections: RiskProjection[]
}

export async function fetchAllBeaches(
  beaches: Beach[]
): Promise<Map<string, BeachRiskSummary | null>> {
  const results = await Promise.allSettled(
    beaches.map(async (beach) => {
      const envData = await fetchAllData(beach)
      const risk = calculateRisk(beach, envData)
      const projections = projectRisk(beach, envData)
      return { beach, envData, risk, projections } satisfies BeachRiskSummary
    })
  )

  const map = new Map<string, BeachRiskSummary | null>()
  beaches.forEach((beach, i) => {
    const result = results[i]
    map.set(beach.id, result.status === 'fulfilled' ? result.value : null)
  })

  return map
}
