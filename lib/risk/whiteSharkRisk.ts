import type { MarineData } from '@/lib/types'

interface WhiteSharkInput {
  marine: MarineData
  historicalIncidents: number
  maxIncidentsAnyBeach: number
  monthOfYear: number
  recentDetection: boolean
  tideState?: string
}

export interface WhiteSharkFactors {
  upwelling: number
  temperature: number
  historical: number
  season: number
  detection: number
  tidal_state: number
}

const WEIGHTS = {
  upwelling: 0.25,
  temperature: 0.18,
  historical: 0.15,
  season: 0.12,
  detection: 0.20,
  tidal_state: 0.10,
} as const

export function calculateWhiteSharkRisk(input: WhiteSharkInput): {
  score: number
  factors: WhiteSharkFactors
} {
  const { marine, historicalIncidents, maxIncidentsAnyBeach, monthOfYear, recentDetection, tideState } = input

  // Upwelling detection (0-1): SST anomaly vs offshore (Bitemetrix methodology)
  const sstDrop = marine.offshoreSst !== null
    ? marine.offshoreSst - marine.sst
    : 0
  const upwellingFactor = sstDrop >= 5 ? 1.0
    : sstDrop >= 3 ? 0.7
    : sstDrop >= 1.5 ? 0.3
    : 0.0

  // SST window factor (0-1): foraging optimum 14-18C (ICES 2025)
  const tempFactor = (marine.sst >= 14 && marine.sst <= 18) ? 1.0
    : (marine.sst >= 18 && marine.sst <= 22) ? 0.7
    : (marine.sst >= 12 && marine.sst <= 14) ? 0.3
    : (marine.sst >= 22 && marine.sst <= 24) ? 0.3
    : 0.1

  // Historical pattern (0-1): normalised incident count
  const histFactor = maxIncidentsAnyBeach > 0
    ? Math.min(historicalIncidents / maxIncidentsAnyBeach, 1.0)
    : 0

  // Seasonal migration (0-1): peak Sep-Nov (CSIRO tracking)
  const seasonFactor = [9, 10, 11].includes(monthOfYear) ? 1.0
    : [5, 6, 7, 8].includes(monthOfYear) ? 0.6
    : [4, 12].includes(monthOfYear) ? 0.4
    : 0.1

  // Recent detection (0-1): tagged white within range
  const detectionFactor = recentDetection ? 0.9 : 0.0

  // Tidal state factor (0-1): #1 predictor for white shark predation (Hammerschlag et al. 2006)
  const tidalFactor = tideState === 'high' ? 1.0
    : tideState === 'mid_falling' ? 0.5
    : tideState === 'mid_rising' ? 0.4
    : tideState === 'low' ? 0.1
    : 0.3 // unknown/default

  const factors: WhiteSharkFactors = {
    upwelling: upwellingFactor,
    temperature: tempFactor,
    historical: histFactor,
    season: seasonFactor,
    detection: detectionFactor,
    tidal_state: tidalFactor,
  }

  let score =
    factors.upwelling * WEIGHTS.upwelling +
    factors.temperature * WEIGHTS.temperature +
    factors.historical * WEIGHTS.historical +
    factors.season * WEIGHTS.season +
    factors.detection * WEIGHTS.detection +
    factors.tidal_state * WEIGHTS.tidal_state

  // Lunar modifier: +0.05 when near full/new moon (French et al. 2021)
  // moonPhase: 0 = new, 0.5 = full — both create larger tidal ranges
  // We check if near full moon (>0.75 or <0.25 maps to high illumination)
  // Note: input doesn't have sunMoon, so this is handled in combinedRisk

  return { score: Math.min(score, 1.0), factors }
}

export { WEIGHTS as WHITE_SHARK_WEIGHTS }
