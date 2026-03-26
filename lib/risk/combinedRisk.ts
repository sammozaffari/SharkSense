import type { Beach, EnvironmentalData, RiskResult, RiskLevel } from '@/lib/types'
import { calculateBullSharkRisk } from './bullSharkRisk'
import { calculateWhiteSharkRisk } from './whiteSharkRisk'
import { getDominantFactor } from './dominantFactor'
import { estimateClearance } from './clearanceEstimate'

// Max white shark incidents across all pilot beaches (Newcastle = 4)
const MAX_WHITE_INCIDENTS = 4

export function calculateRisk(beach: Beach, env: EnvironmentalData): RiskResult {
  const now = new Date()
  const hourOfDay = now.getHours() + now.getMinutes() / 60

  const bull = calculateBullSharkRisk({
    weather: env.weather,
    marine: env.marine,
    discharge: env.discharge,
    sunMoon: env.sunMoon,
    estuaryDistanceKm: beach.estuaryDistanceKm,
    hourOfDay,
  })

  const white = calculateWhiteSharkRisk({
    marine: env.marine,
    historicalIncidents: beach.historicalIncidents.white,
    maxIncidentsAnyBeach: MAX_WHITE_INCIDENTS,
    monthOfYear: now.getMonth() + 1,
    recentDetection: false, // No detection data in MVP
  })

  const score = Math.max(bull.score, white.score)
  const species = bull.score > white.score ? 'bull' as const : 'white' as const

  const level: RiskLevel = score >= 0.65 ? 'RED'
    : score >= 0.35 ? 'AMBER'
    : 'GREEN'

  const dominantFactor = getDominantFactor(species, bull.factors, white.factors)
  const clearance = level !== 'GREEN'
    ? estimateClearance(dominantFactor, env.weather)
    : null

  return {
    score,
    level,
    species,
    bullScore: bull.score,
    whiteScore: white.score,
    reason: dominantFactor.reason,
    clearance,
    dominantFactor,
  }
}
