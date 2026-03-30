import type { Beach, EnvironmentalData, RiskResult, RiskLevel } from '@/lib/types'
import { calculateBullSharkRisk } from './bullSharkRisk'
import { calculateWhiteSharkRisk } from './whiteSharkRisk'
import { getDominantFactor } from './dominantFactor'
import { estimateClearance } from './clearanceEstimate'
import type { SharkDetection } from '@/lib/types'

// Max white shark incidents across all pilot beaches (Newcastle = 12 total, 4 white)
const MAX_WHITE_INCIDENTS = 4

export function calculateRisk(beach: Beach, env: EnvironmentalData): RiskResult {
  const now = new Date()
  const hourOfDay = now.getHours() + now.getMinutes() / 60
  const detections = env.detections ?? []

  // Check for recent detections by species
  const hasWhiteDetection = hasRecentDetection(detections, 'white', beach.lat, beach.lng)
  const hasBullDetection = hasRecentDetection(detections, 'bull', beach.lat, beach.lng)
  const hasAnyDetection = detections.length > 0

  const bull = calculateBullSharkRisk({
    weather: env.weather,
    marine: env.marine,
    discharge: env.discharge,
    sunMoon: env.sunMoon,
    estuaryDistanceKm: beach.estuaryDistanceKm,
    hourOfDay,
    tideState: env.tideState,
    recentDetection: hasBullDetection || hasAnyDetection,
  })

  const white = calculateWhiteSharkRisk({
    marine: env.marine,
    historicalIncidents: beach.historicalIncidents.white,
    maxIncidentsAnyBeach: MAX_WHITE_INCIDENTS,
    monthOfYear: now.getMonth() + 1,
    recentDetection: hasWhiteDetection || hasAnyDetection,
    tideState: env.tideState,
  })

  const score = Math.max(bull.score, white.score)
  const species = bull.score > white.score ? 'bull' as const : 'white' as const

  // Research-calibrated thresholds (research/09-risk-algorithm-design.md)
  const level: RiskLevel = score >= 0.63 ? 'RED'
    : score >= 0.33 ? 'AMBER'
    : 'GREEN'

  const dominantFactor = getDominantFactor(species, bull.factors, white.factors)
  const clearance = level !== 'GREEN'
    ? estimateClearance(dominantFactor, env.weather)
    : null

  // Generate level-appropriate reason text
  const reason = level === 'GREEN'
    ? getGreenReason(bull.score, white.score, env)
    : dominantFactor.reason

  return {
    score,
    level,
    species,
    bullScore: bull.score,
    whiteScore: white.score,
    reason,
    clearance,
    dominantFactor,
  }
}

function getGreenReason(bullScore: number, whiteScore: number, env: EnvironmentalData): string {
  const parts: string[] = []

  if (env.weather.rainfall72hr < 10) parts.push('no significant rainfall')
  else parts.push('light rainfall only')

  if (env.marine.sst < 19) parts.push('water too cool for bull sharks')
  else if (env.marine.sst > 24) parts.push('water too warm for white sharks')

  if (env.discharge.currentDischarge <= env.discharge.baselineDischarge) {
    parts.push('river flow at baseline')
  }

  if (!env.detections?.length) parts.push('no recent detections')

  if (parts.length === 0) return 'No elevated risk factors detected'
  return 'Low risk — ' + parts.join(', ')
}

function hasRecentDetection(
  detections: SharkDetection[],
  species: 'bull' | 'white',
  beachLat: number,
  beachLng: number,
  maxDistKm = 10,
  maxAgeHours = 48,
): boolean {
  const now = Date.now()
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000

  return detections.some((d) => {
    if (d.species !== species) return false
    if (now - d.timestamp > maxAgeMs) return false
    // Simple distance check (rough, ~1 degree = 111km)
    const dLat = (d.lat - beachLat) * 111
    const dLng = (d.lng - beachLng) * 111 * Math.cos(beachLat * Math.PI / 180)
    return Math.sqrt(dLat * dLat + dLng * dLng) <= maxDistKm
  })
}
