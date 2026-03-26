import type { MarineData } from '@/lib/types'

interface WhiteSharkInput {
  marine: MarineData
  historicalIncidents: number
  maxIncidentsAnyBeach: number
  monthOfYear: number
  recentDetection: boolean
}

export interface WhiteSharkFactors {
  upwelling: number
  temperature: number
  historical: number
  season: number
  detection: number
}

const WEIGHTS = {
  upwelling: 0.30,
  temperature: 0.20,
  historical: 0.15,
  season: 0.15,
  detection: 0.20,
} as const

export function calculateWhiteSharkRisk(input: WhiteSharkInput): {
  score: number
  factors: WhiteSharkFactors
} {
  const { marine, historicalIncidents, maxIncidentsAnyBeach, monthOfYear, recentDetection } = input

  // Upwelling detection (0-1): inshore SST drop vs offshore
  // 3C+ drop = upwelling event
  const sstDrop = marine.offshoreSst !== null
    ? marine.offshoreSst - marine.sst
    : 0
  const upwellingFactor = sstDrop >= 5 ? 1.0
    : sstDrop >= 3 ? 0.7
    : sstDrop >= 1.5 ? 0.3
    : 0.0

  // Temperature range factor (0-1): whites most active in 15-22C
  const tempFactor = (marine.sst >= 15 && marine.sst <= 22) ? 0.8
    : (marine.sst >= 12 && marine.sst <= 25) ? 0.4
    : 0.1

  // Historical pattern (0-1): normalised incident count
  const histFactor = maxIncidentsAnyBeach > 0
    ? Math.min(historicalIncidents / maxIncidentsAnyBeach, 1.0)
    : 0

  // Seasonal migration (0-1): peak white shark months in NSW = May-November
  const seasonFactor = [5, 6, 7, 8, 9, 10, 11].includes(monthOfYear) ? 0.7
    : [4, 12].includes(monthOfYear) ? 0.4
    : 0.2

  // Recent detection (0-1): tagged white within range
  const detectionFactor = recentDetection ? 0.9 : 0.0

  const factors: WhiteSharkFactors = {
    upwelling: upwellingFactor,
    temperature: tempFactor,
    historical: histFactor,
    season: seasonFactor,
    detection: detectionFactor,
  }

  const score =
    factors.upwelling * WEIGHTS.upwelling +
    factors.temperature * WEIGHTS.temperature +
    factors.historical * WEIGHTS.historical +
    factors.season * WEIGHTS.season +
    factors.detection * WEIGHTS.detection

  return { score, factors }
}

export { WEIGHTS as WHITE_SHARK_WEIGHTS }
