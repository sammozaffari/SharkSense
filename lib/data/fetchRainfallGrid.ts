import { getCached, setCached } from './cache'

export interface RainfallGridPoint {
  lat: number
  lng: number
  rainfall72hr: number
}

const GRID_SIZE = 3 // 3x3 = 9 points
const GRID_SPAN = 0.08 // ~8km spread in each direction

export async function fetchRainfallGrid(
  centerLat: number,
  centerLng: number,
  beachId: string,
): Promise<RainfallGridPoint[]> {
  const cacheKey = `rainfall-grid:${beachId}`
  const cached = getCached<RainfallGridPoint[]>(cacheKey)
  if (cached) return cached.data

  const points: { lat: number; lng: number }[] = []
  const step = (GRID_SPAN * 2) / (GRID_SIZE - 1)

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      points.push({
        lat: centerLat - GRID_SPAN + row * step,
        lng: centerLng - GRID_SPAN + col * step,
      })
    }
  }

  const results = await Promise.allSettled(
    points.map(async (pt) => {
      const params = new URLSearchParams({
        latitude: pt.lat.toFixed(4),
        longitude: pt.lng.toFixed(4),
        hourly: 'precipitation',
        past_days: '3',
        forecast_days: '0',
        timezone: 'Australia/Sydney',
      })

      const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
      if (!res.ok) throw new Error(`Weather grid API failed: ${res.status}`)

      const json = await res.json()
      const precip: number[] = json.hourly.precipitation ?? []
      const rainfall72hr = precip.reduce((sum, v) => sum + (v || 0), 0)

      return { lat: pt.lat, lng: pt.lng, rainfall72hr }
    })
  )

  const grid = results
    .filter((r): r is PromiseFulfilledResult<RainfallGridPoint> => r.status === 'fulfilled')
    .map((r) => r.value)

  if (grid.length > 0) {
    setCached(cacheKey, grid)
  }

  return grid
}
