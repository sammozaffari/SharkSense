import type { Beach, EnvironmentalData, RiskLevel } from '@/lib/types'
import { calculateBullSharkRisk } from './bullSharkRisk'
import { calculateWhiteSharkRisk } from './whiteSharkRisk'

export interface RiskProjection {
  day: string
  level: RiskLevel
  score: number
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function projectRisk(beach: Beach, env: EnvironmentalData): RiskProjection[] {
  const now = new Date()
  const projections: RiskProjection[] = []

  for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
    const futureDate = new Date(now)
    futureDate.setDate(futureDate.getDate() + dayOffset)

    const dayLabel = dayOffset === 0
      ? 'Today'
      : DAY_NAMES[futureDate.getDay()]

    // Project future rainfall: sum forecast hours for this day window
    // precipitationForecast is hourly, starting from "now"
    const startHour = dayOffset * 24
    const endHour = startHour + 24
    const dayPrecip = env.weather.precipitationForecast
      .slice(startHour, endHour)
      .reduce((sum, v) => sum + v, 0)

    // Cumulative 72hr rainfall looking back from this future day
    // Day 0: actual 72hr rainfall
    // Day 1+: decay existing rainfall and add forecast
    const decayFactor = Math.max(0, 1 - (dayOffset * 0.3))
    const projectedRainfall = env.weather.rainfall72hr * decayFactor + dayPrecip

    // Discharge decays toward baseline over time
    const dischargeDecay = Math.max(0, 1 - (dayOffset * 0.2))
    const projectedDischarge = env.discharge.baselineDischarge +
      (env.discharge.currentDischarge - env.discharge.baselineDischarge) * dischargeDecay

    const bull = calculateBullSharkRisk({
      weather: {
        ...env.weather,
        rainfall72hr: projectedRainfall,
      },
      marine: env.marine,
      discharge: {
        currentDischarge: projectedDischarge,
        baselineDischarge: env.discharge.baselineDischarge,
      },
      sunMoon: env.sunMoon,
      estuaryDistanceKm: beach.estuaryDistanceKm,
      hourOfDay: 10, // Assume midday conditions for projection
    })

    const white = calculateWhiteSharkRisk({
      marine: env.marine,
      historicalIncidents: beach.historicalIncidents.white,
      maxIncidentsAnyBeach: 4,
      monthOfYear: futureDate.getMonth() + 1,
      recentDetection: false,
    })

    const score = Math.max(bull.score, white.score)
    const level: RiskLevel = score >= 0.63 ? 'RED'
      : score >= 0.33 ? 'AMBER'
      : 'GREEN'

    projections.push({ day: dayLabel, level, score })
  }

  return projections
}
