import { db } from '../db.js'
import { logScrape, log } from '../logger.js'

const WATERNSW_API = 'https://realtimedata.waternsw.com.au/cgi/webservice.exe'

interface BeachRow {
  id: string
  water_nsw_gauge_id: string | null
  baseline_discharge: number
}

export async function scrapeWaterNsw() {
  const startTime = Date.now()
  let totalUpserted = 0

  try {
    const { data: beaches, error: beachErr } = await db
      .from('beaches')
      .select('id, water_nsw_gauge_id, baseline_discharge')
      .not('water_nsw_gauge_id', 'is', null)

    if (beachErr || !beaches?.length) {
      throw new Error(beachErr?.message ?? 'No beaches with gauge IDs')
    }

    log('waternsw', `Fetching discharge for ${beaches.length} gauges...`)

    for (const beach of beaches as BeachRow[]) {
      if (!beach.water_nsw_gauge_id) continue

      try {
        const discharge = await fetchDischarge(beach.water_nsw_gauge_id)

        // Update the latest environmental snapshot with discharge data
        const { data: latest } = await db
          .from('environmental_snapshots')
          .select('id')
          .eq('beach_id', beach.id)
          .order('fetched_at', { ascending: false })
          .limit(1)
          .single()

        if (latest) {
          await db.from('environmental_snapshots').update({
            current_discharge: discharge,
            baseline_discharge: beach.baseline_discharge,
          }).eq('id', latest.id)
        } else {
          await db.from('environmental_snapshots').insert({
            beach_id: beach.id,
            current_discharge: discharge,
            baseline_discharge: beach.baseline_discharge,
          })
        }

        totalUpserted++
        log('waternsw', `  ${beach.id}: ${discharge.toFixed(1)} ML/day`)
      } catch (err) {
        log('waternsw', `  ${beach.id}: FAILED - ${err}`)
      }
    }

    await logScrape('waternsw', totalUpserted > 0 ? 'success' : 'error', totalUpserted, startTime)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await logScrape('waternsw', 'error', totalUpserted, startTime, message)
    throw err
  }
}

async function fetchDischarge(gaugeId: string): Promise<number> {
  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  // Use flat query params - more reliable than JSON wrapper
  const query = new URLSearchParams({
    function: 'get_ts_traces',
    version: '2',
    site_list: gaugeId,
    datasource: 'PROV',
    varfrom: '141.01',
    varto: '141.01',
    start_time: formatDate(yesterday),
    end_time: formatDate(now),
    data_type: 'mean',
    interval: 'hour',
    multiplier: '1',
  })

  const res = await fetch(`${WATERNSW_API}?${query}`, {
    headers: { 'User-Agent': 'SharkSense/1.0' },
    signal: AbortSignal.timeout(30000),
  })

  if (!res.ok) throw new Error(`WaterNSW API ${res.status}`)

  const json = await res.json()
  const traces = json?.return?.traces
  if (!traces?.[0]?.trace?.length) {
    // Gauge has no current data — return 0 (will use baseline in risk calc)
    return 0
  }

  const values = traces[0].trace
  const latest = values[values.length - 1]
  return parseFloat(latest.v) || 0
}

function formatDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}00`
}
