import type { WeatherData } from '@/lib/types'

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    hourly: 'precipitation,rain,temperature_2m,wind_speed_10m,wind_direction_10m',
    past_days: '3',
    forecast_days: '7',
    timezone: 'Australia/Sydney',
  })

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  if (!res.ok) throw new Error(`Weather API failed: ${res.status}`)

  const json = await res.json()
  const hourly = json.hourly

  // Calculate 72hr rainfall: sum precipitation for the past 72 hours
  // past_days=3 gives us 72 hours of past data before the current hour
  const now = new Date()
  const times: string[] = hourly.time
  const precip: number[] = hourly.precipitation

  let rainfall72hr = 0
  const hourlyRainfall: number[] = []
  const precipitationForecast: number[] = []

  for (let i = 0; i < times.length; i++) {
    const t = new Date(times[i])
    const hoursAgo = (now.getTime() - t.getTime()) / (1000 * 60 * 60)

    if (hoursAgo >= 0 && hoursAgo <= 72) {
      rainfall72hr += precip[i] || 0
      hourlyRainfall.push(precip[i] || 0)
    } else if (hoursAgo < 0) {
      precipitationForecast.push(precip[i] || 0)
    }
  }

  // Get current values (closest hour to now)
  const currentIdx = times.findIndex((t: string) => new Date(t) >= now) - 1
  const idx = Math.max(0, currentIdx)

  return {
    rainfall72hr,
    currentTemp: hourly.temperature_2m[idx] ?? 20,
    windSpeed: hourly.wind_speed_10m[idx] ?? 0,
    windDirection: hourly.wind_direction_10m[idx] ?? 0,
    precipitationForecast,
    hourlyRainfall,
  }
}
