import { db } from '../db.js'
import { logScrape, log } from '../logger.js'

const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'
const MARINE_API = 'https://marine-api.open-meteo.com/v1/marine'

interface BeachRow {
  id: string
  lat: number
  lng: number
  baseline_discharge: number
}

export async function scrapeOpenMeteo() {
  const startTime = Date.now()
  let totalUpserted = 0

  try {
    // Get beaches from DB
    const { data: beaches, error: beachErr } = await db.from('beaches').select('id, lat, lng, baseline_discharge')
    if (beachErr || !beaches?.length) throw new Error(beachErr?.message ?? 'No beaches in DB')

    log('openmeteo', `Fetching weather + marine data for ${beaches.length} beaches...`)

    for (const beach of beaches as BeachRow[]) {
      try {
        const [weather, marine] = await Promise.all([
          fetchWeather(beach.lat, beach.lng),
          fetchMarine(beach.lat, beach.lng),
        ])

        await db.from('environmental_snapshots').insert({
          beach_id: beach.id,
          rainfall_72hr: weather.rainfall72hr,
          current_temp: weather.currentTemp,
          wind_speed: weather.windSpeed,
          wind_direction: weather.windDirection,
          sst: marine.sst,
          wave_height: marine.waveHeight,
          swell_height: marine.swellHeight,
          swell_period: marine.swellPeriod,
          offshore_sst: marine.offshoreSst,
          precipitation_forecast: weather.precipitationForecast,
        })

        totalUpserted++
        log('openmeteo', `  ${beach.id}: done`)
      } catch (err) {
        log('openmeteo', `  ${beach.id}: FAILED - ${err}`)
      }
    }

    await logScrape('openmeteo', totalUpserted > 0 ? 'success' : 'error', totalUpserted, startTime)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await logScrape('openmeteo', 'error', totalUpserted, startTime, message)
    throw err
  }
}

async function fetchWeather(lat: number, lng: number) {
  const params = new URLSearchParams({
    latitude: String(lat), longitude: String(lng),
    hourly: 'precipitation,temperature_2m,wind_speed_10m,wind_direction_10m',
    past_days: '3', forecast_days: '7', timezone: 'Australia/Sydney',
  })

  const res = await fetch(`${WEATHER_API}?${params}`)
  if (!res.ok) throw new Error(`Weather API ${res.status}`)

  const { hourly } = await res.json()
  const now = new Date()
  const times: string[] = hourly.time
  const precip: number[] = hourly.precipitation

  let rainfall72hr = 0
  const precipitationForecast: number[] = []

  for (let i = 0; i < times.length; i++) {
    const hoursAgo = (now.getTime() - new Date(times[i]).getTime()) / 3600000
    if (hoursAgo >= 0 && hoursAgo <= 72) rainfall72hr += precip[i] || 0
    else if (hoursAgo < 0) precipitationForecast.push(precip[i] || 0)
  }

  const idx = Math.max(0, times.findIndex((t: string) => new Date(t) >= now) - 1)

  return {
    rainfall72hr,
    currentTemp: hourly.temperature_2m[idx] ?? 20,
    windSpeed: hourly.wind_speed_10m[idx] ?? 0,
    windDirection: hourly.wind_direction_10m[idx] ?? 0,
    precipitationForecast,
  }
}

async function fetchMarine(lat: number, lng: number) {
  const params = new URLSearchParams({
    latitude: String(lat), longitude: String(lng),
    hourly: 'wave_height,swell_wave_height,swell_wave_period,sea_surface_temperature',
    forecast_days: '1', timezone: 'Australia/Sydney',
  })

  const res = await fetch(`${MARINE_API}?${params}`)
  if (!res.ok) throw new Error(`Marine API ${res.status}`)

  const { hourly } = await res.json()
  const now = new Date()
  const idx = Math.max(0, (hourly.time as string[]).findIndex((t: string) => new Date(t) >= now) - 1)

  // Offshore SST for upwelling detection
  let offshoreSst: number | null = null
  try {
    const offParams = new URLSearchParams({
      latitude: String(lat), longitude: String(lng + 0.2),
      hourly: 'sea_surface_temperature', forecast_days: '1', timezone: 'Australia/Sydney',
    })
    const offRes = await fetch(`${MARINE_API}?${offParams}`)
    if (offRes.ok) {
      const offJson = await offRes.json()
      offshoreSst = offJson.hourly.sea_surface_temperature?.[idx] ?? null
    }
  } catch { /* non-fatal */ }

  return {
    sst: hourly.sea_surface_temperature?.[idx] ?? 20,
    waveHeight: hourly.wave_height?.[idx] ?? 0,
    swellHeight: hourly.swell_wave_height?.[idx] ?? 0,
    swellPeriod: hourly.swell_wave_period?.[idx] ?? 0,
    offshoreSst,
  }
}
