import type { WeatherData, MarineData, DischargeData, SunMoonData } from '@/lib/types'

interface BullSharkInput {
  weather: WeatherData
  marine: MarineData
  discharge: DischargeData
  sunMoon: SunMoonData
  estuaryDistanceKm: number
  hourOfDay: number
}

export interface BullSharkFactors {
  rainfall: number
  discharge: number
  estuary: number
  temperature: number
  visibility: number
  time: number
}

const WEIGHTS = {
  rainfall: 0.30,
  discharge: 0.25,
  estuary: 0.15,
  temperature: 0.10,
  visibility: 0.10,
  time: 0.10,
} as const

export function calculateBullSharkRisk(input: BullSharkInput): {
  score: number
  factors: BullSharkFactors
} {
  const { weather, marine, discharge, sunMoon, estuaryDistanceKm, hourOfDay } = input

  // Rainfall factor (0-1): >=100mm in catchment is significant
  const rainfallFactor = Math.min(weather.rainfall72hr / 150, 1.0)

  // River discharge factor (0-1): above baseline = sharks leaving rivers
  const { currentDischarge, baselineDischarge } = discharge
  const dischargeFactor = baselineDischarge > 0
    ? Math.min(Math.max((currentDischarge - baselineDischarge) / baselineDischarge, 0), 1.0)
    : 0

  // Estuary proximity factor (0-1): within 1km = high risk
  const estuaryFactor = estuaryDistanceKm <= 1 ? 1.0
    : estuaryDistanceKm <= 3 ? 0.6
    : estuaryDistanceKm <= 5 ? 0.3
    : 0.1

  // Water temperature factor (0-1): active above 19C, very active above 24C
  const tempFactor = marine.sst >= 24 ? 1.0
    : marine.sst >= 22 ? 0.7
    : marine.sst >= 19 ? 0.4
    : 0.1

  // Visibility risk (0-1): derived from rainfall + wind
  const visibilityFactor = calculateVisibilityRisk(
    weather.rainfall72hr,
    weather.windSpeed,
    weather.windDirection
  )

  // Time of day factor (0-1): dawn/dusk penalty
  const isDawnDusk = (hourOfDay <= sunMoon.sunriseHour + 1) || (hourOfDay >= sunMoon.sunsetHour - 1)
  const timeFactor = isDawnDusk ? 0.8 : 0.3

  const factors: BullSharkFactors = {
    rainfall: rainfallFactor,
    discharge: dischargeFactor,
    estuary: estuaryFactor,
    temperature: tempFactor,
    visibility: visibilityFactor,
    time: timeFactor,
  }

  const score =
    factors.rainfall * WEIGHTS.rainfall +
    factors.discharge * WEIGHTS.discharge +
    factors.estuary * WEIGHTS.estuary +
    factors.temperature * WEIGHTS.temperature +
    factors.visibility * WEIGHTS.visibility +
    factors.time * WEIGHTS.time

  return { score, factors }
}

/**
 * Estimate water visibility risk from rainfall, wind speed, and wind direction.
 * Onshore wind (45-135 or 225-315 for east-facing beaches) pushes turbid water onto beach.
 * Heavy rain = murky water. High wind = stirred sediment.
 */
function calculateVisibilityRisk(rainfall72hr: number, windSpeed: number, windDirection: number): number {
  // Rainfall contribution: >50mm = significantly murky
  const rainVisibility = Math.min(rainfall72hr / 80, 1.0)

  // Wind contribution: strong onshore wind stirs up water
  // East-facing NSW beaches: onshore = roughly 0-180 degrees (NE to SE)
  const isOnshore = windDirection >= 0 && windDirection <= 180
  const windContrib = isOnshore ? Math.min(windSpeed / 30, 0.5) : 0

  return Math.min(rainVisibility + windContrib, 1.0)
}

export { WEIGHTS as BULL_SHARK_WEIGHTS }
