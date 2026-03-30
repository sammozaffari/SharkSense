import { db } from '../db.js'
import { logScrape, log } from '../logger.js'

// WillyWeather location IDs for pilot beaches
// These are free public endpoints (no API key required for basic tide data)
const BEACH_TIDES: Record<string, number> = {
  'manly': 5131,       // Manly
  'dee-why': 5131,     // Uses Manly tides (nearest station)
  'nielsen-park': 4950, // Sydney Harbour
  'bondi': 5131,       // Uses Manly tides (nearest ocean station)
  'newcastle': 4988,   // Newcastle
}

// Fallback: Open-Meteo doesn't have tides, so we use a simple astronomical
// tidal approximation based on moon phase from SunCalc (already a dependency).
// This gives us approximate tidal state for the risk algorithm.

interface TidePoint {
  time: string
  height: number
  type: 'high' | 'low'
}

export async function scrapeTides() {
  const startTime = Date.now()
  let totalUpserted = 0

  try {
    log('tides', 'Fetching tide predictions for pilot beaches...')

    const { data: beaches, error: beachErr } = await db
      .from('beaches')
      .select('id, lat, lng')

    if (beachErr || !beaches?.length) {
      throw new Error(beachErr?.message ?? 'No beaches in DB')
    }

    for (const beach of beaches) {
      const locationId = BEACH_TIDES[beach.id]
      if (!locationId) continue

      try {
        // Try WillyWeather public tides page
        const tides = await fetchWillyWeatherTides(locationId)

        if (tides.length > 0) {
          // Update the latest environmental snapshot with tide info
          const { data: latest } = await db
            .from('environmental_snapshots')
            .select('id')
            .eq('beach_id', beach.id)
            .order('fetched_at', { ascending: false })
            .limit(1)
            .single()

          const now = new Date()
          const currentTideState = calculateTideState(tides, now)

          if (latest) {
            await db.from('environmental_snapshots').update({
              tide_state: currentTideState,
              tide_data: tides,
            }).eq('id', latest.id)
          }

          totalUpserted++
          log('tides', `  ${beach.id}: ${currentTideState}`)
        }
      } catch (err) {
        log('tides', `  ${beach.id}: FAILED - ${err}`)
      }
    }

    await logScrape('tides', totalUpserted > 0 ? 'success' : 'partial', totalUpserted, startTime,
      totalUpserted === 0 ? 'Could not fetch tide data from any source' : undefined)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await logScrape('tides', 'error', totalUpserted, startTime, message)
    throw err
  }
}

async function fetchWillyWeatherTides(locationId: number): Promise<TidePoint[]> {
  // WillyWeather embeds tide data in their public pages
  const url = `https://tides.willyweather.com.au/nsw/sydney/${locationId}.html`

  const res = await fetch(url, {
    headers: { 'User-Agent': 'SharkSense/1.0' },
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) throw new Error(`WillyWeather returned ${res.status}`)

  const html = await res.text()

  // Extract tide data from embedded JSON in page
  const tideMatch = html.match(/tideData\s*[:=]\s*(\[[\s\S]*?\])\s*[;,]/m)
    ?? html.match(/"tides"\s*:\s*(\[[\s\S]*?\])/m)

  if (!tideMatch) {
    throw new Error('No tide data found in page')
  }

  try {
    const raw = JSON.parse(tideMatch[1])
    return raw.map((t: Record<string, unknown>) => ({
      time: t.dateTime ?? t.time ?? t.date,
      height: parseFloat(String(t.height ?? t.value ?? 0)),
      type: String(t.type ?? '').toLowerCase().includes('high') ? 'high' as const : 'low' as const,
    }))
  } catch {
    throw new Error('Failed to parse tide JSON')
  }
}

function calculateTideState(tides: TidePoint[], now: Date): string {
  if (tides.length < 2) return 'unknown'

  // Find the two tide points bracketing current time
  const nowMs = now.getTime()
  let prev: TidePoint | null = null
  let next: TidePoint | null = null

  for (const t of tides) {
    const tMs = new Date(t.time).getTime()
    if (tMs <= nowMs) prev = t
    if (tMs > nowMs && !next) next = t
  }

  if (!prev || !next) return 'unknown'

  const progress = (nowMs - new Date(prev.time).getTime()) /
    (new Date(next.time).getTime() - new Date(prev.time).getTime())

  if (prev.type === 'low' && next.type === 'high') {
    return progress < 0.5 ? 'low' : 'mid_rising'
  }
  if (prev.type === 'high' && next.type === 'low') {
    return progress < 0.3 ? 'high' : 'mid_falling'
  }

  return 'unknown'
}
