import type { Beach, EnvironmentalData } from '@/lib/types'
import { fetchWeather } from './fetchWeather'
import { fetchMarine } from './fetchMarine'
import { fetchDischarge } from './fetchDischarge'
import { fetchSharkDetections } from './fetchSharkDetections'
import { getSunMoonData } from '@/lib/geo/sunMoon'
import { getCached, setCached } from './cache'
import { supabase } from '@/lib/supabase'

const STALE_THRESHOLD = 60 * 60 * 1000 // 1 hour

export async function fetchAllData(beach: Beach): Promise<EnvironmentalData> {
  // Try localStorage cache first (instant)
  const cacheKey = `env:${beach.id}`
  const cached = getCached<EnvironmentalData>(cacheKey)
  if (cached) return cached.data

  // Try Supabase for recent scraped data
  if (supabase) {
    try {
      const data = await fetchFromSupabase(beach)
      if (data) {
        setCached(cacheKey, data)
        return data
      }
    } catch {
      // Fall through to direct API calls
    }
  }

  // Fallback: direct API calls (original behavior)
  const [weather, marine, discharge, detections] = await Promise.all([
    fetchWeather(beach.lat, beach.lng),
    fetchMarine(beach.lat, beach.lng),
    fetchDischarge(beach.waterNswGaugeId, beach.baselineDischarge),
    fetchSharkDetections(beach.id),
  ])

  const sunMoon = getSunMoonData(beach.lat, beach.lng)

  const data: EnvironmentalData = {
    weather,
    marine,
    discharge,
    sunMoon,
    detections,
    fetchedAt: Date.now(),
  }

  setCached(cacheKey, data)
  return data
}

async function fetchFromSupabase(beach: Beach): Promise<EnvironmentalData | null> {
  const { data: snapshot } = await supabase
    .from('environmental_snapshots')
    .select('*')
    .eq('beach_id', beach.id)
    .order('fetched_at', { ascending: false })
    .limit(1)
    .single()

  if (!snapshot) return null

  // Check staleness
  const age = Date.now() - new Date(snapshot.fetched_at).getTime()
  if (age > STALE_THRESHOLD) return null

  const sunMoon = (await import('@/lib/geo/sunMoon')).getSunMoonData(beach.lat, beach.lng)
  const detections = await fetchSharkDetections(beach.id)

  return {
    weather: {
      rainfall72hr: snapshot.rainfall_72hr ?? 0,
      currentTemp: snapshot.current_temp ?? 20,
      windSpeed: snapshot.wind_speed ?? 0,
      windDirection: snapshot.wind_direction ?? 0,
      precipitationForecast: snapshot.precipitation_forecast ?? [],
      hourlyRainfall: [],
    },
    marine: {
      sst: snapshot.sst ?? 20,
      waveHeight: snapshot.wave_height ?? 0,
      wavePeriod: 0,
      swellHeight: snapshot.swell_height ?? 0,
      swellPeriod: snapshot.swell_period ?? 0,
      offshoreSst: snapshot.offshore_sst ?? null,
    },
    discharge: {
      currentDischarge: snapshot.current_discharge ?? beach.baselineDischarge,
      baselineDischarge: snapshot.baseline_discharge ?? beach.baselineDischarge,
    },
    sunMoon,
    detections,
    fetchedAt: new Date(snapshot.fetched_at).getTime(),
  }
}
