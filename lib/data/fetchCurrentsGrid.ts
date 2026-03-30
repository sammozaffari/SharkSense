import { getCached, setCached } from './cache'

export interface CurrentGridPoint {
  lat: number
  lng: number
  velocity: number   // m/s
  direction: number  // degrees (direction current flows TO)
}

const GRID_SIZE = 3
const GRID_SPAN = 0.06 // ~6km spread

export async function fetchCurrentsGrid(
  centerLat: number,
  centerLng: number,
  beachId: string,
): Promise<CurrentGridPoint[]> {
  const cacheKey = `currents-grid:${beachId}`
  const cached = getCached<CurrentGridPoint[]>(cacheKey)
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
        hourly: 'ocean_current_velocity,ocean_current_direction',
        timezone: 'Australia/Sydney',
        forecast_days: '1',
      })

      const res = await fetch(`https://marine-api.open-meteo.com/v1/marine?${params}`)
      if (!res.ok) throw new Error(`Current API failed: ${res.status}`)

      const json = await res.json()
      const hourly = json.hourly
      const now = new Date()
      const times: string[] = hourly.time ?? []
      const currentIdx = Math.max(0, times.findIndex((t: string) => new Date(t) >= now) - 1)

      const velocity = hourly.ocean_current_velocity?.[currentIdx] ?? null
      const direction = hourly.ocean_current_direction?.[currentIdx] ?? null

      if (velocity === null || direction === null) return null

      return { lat: pt.lat, lng: pt.lng, velocity, direction }
    })
  )

  const grid = results
    .filter((r): r is PromiseFulfilledResult<CurrentGridPoint> => r.status === 'fulfilled' && r.value !== null)
    .map((r) => r.value)

  if (grid.length > 0) {
    setCached(cacheKey, grid)
  }

  return grid
}
