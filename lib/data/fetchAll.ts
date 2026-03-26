import type { Beach, EnvironmentalData } from '@/lib/types'
import { fetchWeather } from './fetchWeather'
import { fetchMarine } from './fetchMarine'
import { fetchDischarge } from './fetchDischarge'
import { getSunMoonData } from '@/lib/geo/sunMoon'
import { getCached, setCached } from './cache'

export async function fetchAllData(beach: Beach): Promise<EnvironmentalData> {
  const cacheKey = `env:${beach.id}`
  const cached = getCached<EnvironmentalData>(cacheKey)
  if (cached) return cached.data

  const [weather, marine, discharge] = await Promise.all([
    fetchWeather(beach.lat, beach.lng),
    fetchMarine(beach.lat, beach.lng),
    fetchDischarge(beach.waterNswGaugeId, beach.baselineDischarge),
  ])

  const sunMoon = getSunMoonData(beach.lat, beach.lng)

  const data: EnvironmentalData = {
    weather,
    marine,
    discharge,
    sunMoon,
    fetchedAt: Date.now(),
  }

  setCached(cacheKey, data)
  return data
}
