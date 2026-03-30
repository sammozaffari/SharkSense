import type { WeatherData, MarineData, DischargeData, SunMoonData } from '@/lib/types'

interface BullSharkInput {
  weather: WeatherData
  marine: MarineData
  discharge: DischargeData
  sunMoon: SunMoonData
  estuaryDistanceKm: number
  hourOfDay: number
  tideState?: string
  recentDetection?: boolean
}

export interface BullSharkFactors {
  rainfall: number
  discharge: number
  estuary: number
  temperature: number
  visibility: number
  time: number
  tidal_state: number
  detection: number
}

const WEIGHTS = {
  rainfall: 0.28,
  discharge: 0.20,
  estuary: 0.15,
  temperature: 0.12,
  visibility: 0.08,
  time: 0.05,
  tidal_state: 0.04,
  detection: 0.08,
} as const

export function calculateBullSharkRisk(input: BullSharkInput): {
  score: number
  factors: BullSharkFactors
} {
  const { weather, marine, discharge, sunMoon, estuaryDistanceKm, hourOfDay, tideState, recentDetection } = input

  // Rainfall factor (0-1): >=45mm moderate, >=100mm high (Werry & Sumpton 2018; Smoothey et al. 2023)
  const rainfallFactor = Math.min(weather.rainfall72hr / 150, 1.0)

  // River discharge factor (0-1): ratio to 30-day rolling median baseline
  const { currentDischarge, baselineDischarge } = discharge
  const dischargeFactor = baselineDischarge > 0
    ? Math.min(Math.max((currentDischarge - baselineDischarge) / baselineDischarge, 0), 1.0)
    : 0

  // Estuary proximity factor (0-1): <1km = max risk (Smoothey et al. 2023)
  const estuaryFactor = estuaryDistanceKm < 0.1 ? 1.0
    : estuaryDistanceKm <= 0.5 ? 0.9
    : estuaryDistanceKm <= 1 ? 0.8
    : estuaryDistanceKm <= 3 ? 0.5
    : estuaryDistanceKm <= 5 ? 0.3
    : 0.1

  // SST factor (0-1): departure <19C, peak 22-24C (Lubitz et al. 2025)
  const tempFactor = marine.sst >= 24 ? 1.0
    : marine.sst >= 22 ? 0.9
    : marine.sst >= 20 ? 0.5
    : marine.sst >= 19 ? 0.2
    : 0.0

  // Turbidity/visibility risk (0-1): derived from rainfall + wind
  const visibilityFactor = calculateVisibilityRisk(
    weather.rainfall72hr,
    weather.windSpeed,
    weather.windDirection
  )

  // Time of day factor (0-1): dawn/dusk penalty (Smoothey et al. 2023)
  const isDawnDusk = (hourOfDay <= sunMoon.sunriseHour + 1) || (hourOfDay >= sunMoon.sunsetHour - 1)
  const timeFactor = isDawnDusk ? 1.0 : 0.4

  // Tidal state factor (0-1): high tide = sharks closer to shore (Hammerschlag et al. 2006)
  const tidalFactor = tideState === 'high' ? 1.0
    : tideState === 'mid_falling' ? 0.6
    : tideState === 'mid_rising' ? 0.5
    : tideState === 'low' ? 0.2
    : 0.4

  // Detection factor (0-1): tagged bull shark detected nearby
  const detectionFactor = recentDetection ? 0.9 : 0.0

  const factors: BullSharkFactors = {
    rainfall: rainfallFactor,
    discharge: dischargeFactor,
    estuary: estuaryFactor,
    temperature: tempFactor,
    visibility: visibilityFactor,
    time: timeFactor,
    tidal_state: tidalFactor,
    detection: detectionFactor,
  }

  let score =
    factors.rainfall * WEIGHTS.rainfall +
    factors.discharge * WEIGHTS.discharge +
    factors.estuary * WEIGHTS.estuary +
    factors.temperature * WEIGHTS.temperature +
    factors.visibility * WEIGHTS.visibility +
    factors.time * WEIGHTS.time +
    factors.tidal_state * WEIGHTS.tidal_state +
    factors.detection * WEIGHTS.detection

  // Lunar modifier: +0.05 when near full/new moon (French et al. 2021)
  if (input.sunMoon.moonPhase >= 0.75 || input.sunMoon.moonPhase <= 0.25) {
    score += 0.05
  }

  return { score: Math.min(score, 1.0), factors }
}

function calculateVisibilityRisk(rainfall72hr: number, windSpeed: number, windDirection: number): number {
  const rainVisibility = Math.min(rainfall72hr / 80, 1.0)
  const isOnshore = windDirection >= 0 && windDirection <= 180
  const windContrib = isOnshore ? Math.min(windSpeed / 30, 0.5) : 0
  return Math.min(rainVisibility + windContrib, 1.0)
}

export { WEIGHTS as BULL_SHARK_WEIGHTS }
