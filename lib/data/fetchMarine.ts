import type { MarineData } from '@/lib/types'

export async function fetchMarine(lat: number, lng: number): Promise<MarineData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lng.toString(),
    hourly: 'wave_height,wave_period,wave_direction,sea_surface_temperature,swell_wave_height,swell_wave_period',
    timezone: 'Australia/Sydney',
    forecast_days: '1',
  })

  const res = await fetch(`https://marine-api.open-meteo.com/v1/marine?${params}`)
  if (!res.ok) throw new Error(`Marine API failed: ${res.status}`)

  const json = await res.json()
  const hourly = json.hourly

  // Get current values
  const now = new Date()
  const times: string[] = hourly.time
  const currentIdx = times.findIndex((t: string) => new Date(t) >= now) - 1
  const idx = Math.max(0, currentIdx)

  const inshoreSst = hourly.sea_surface_temperature?.[idx] ?? null

  // For upwelling detection, fetch SST at an offshore point (~20km out)
  // Offset longitude by ~0.2 degrees east (roughly 20km at this latitude)
  let offshoreSst: number | null = null
  try {
    const offshoreParams = new URLSearchParams({
      latitude: lat.toString(),
      longitude: (lng + 0.2).toString(),
      hourly: 'sea_surface_temperature',
      timezone: 'Australia/Sydney',
      forecast_days: '1',
    })
    const offshoreRes = await fetch(`https://marine-api.open-meteo.com/v1/marine?${offshoreParams}`)
    if (offshoreRes.ok) {
      const offshoreJson = await offshoreRes.json()
      offshoreSst = offshoreJson.hourly.sea_surface_temperature?.[idx] ?? null
    }
  } catch {
    // Offshore SST unavailable — upwelling detection degraded but not fatal
  }

  return {
    sst: inshoreSst ?? 20,
    waveHeight: hourly.wave_height?.[idx] ?? 0,
    wavePeriod: hourly.wave_period?.[idx] ?? 0,
    swellHeight: hourly.swell_wave_height?.[idx] ?? 0,
    swellPeriod: hourly.swell_wave_period?.[idx] ?? 0,
    offshoreSst,
  }
}
