import { db } from '../db.js'
import { logScrape, log } from '../logger.js'

// NOAA ERDDAP SST satellite data - multiple products and mirrors for reliability
// CoralTemp (0.05° / 5km) is fastest from Australia; MUR (0.01° / 1km) is higher res but slower
const ERDDAP_MIRRORS = [
  // CoralTemp daily SST - 5km res, fast from AU (different server than pfeg)
  'https://coastwatch.noaa.gov/erddap/griddap/noaacrwsstDaily.json',
  // MUR SST - 1km res, may be slow from AU
  'https://coastwatch.pfeg.noaa.gov/erddap/griddap/jplMURSST41.json',
  'https://upwell.pfeg.noaa.gov/erddap/griddap/jplMURSST41.json',
]

// NSW coast bounding box (Northern Beaches + Newcastle + Bondi)
const BBOX = {
  latMin: -33.95,
  latMax: -32.85,
  lngMin: 151.2,
  lngMax: 151.9,
}

// Offshore offset in degrees (~20km east)
const OFFSHORE_OFFSET_DEG = 0.2

interface BeachRow {
  id: string
  lat: number
  lng: number
}

export async function scrapeSstSatellite() {
  const startTime = Date.now()
  let totalUpserted = 0

  try {
    log('sst-satellite', 'Fetching NOAA MUR SST satellite data for NSW coast...')

    // Fetch the latest SST grid from ERDDAP (try multiple mirrors)
    const query = `?analysed_sst[(last)][(${BBOX.latMin}):(${BBOX.latMax})][(${BBOX.lngMin}):(${BBOX.lngMax})]`

    let res: Response | null = null
    for (const mirror of ERDDAP_MIRRORS) {
      try {
        log('sst-satellite', `  Trying ${new URL(mirror).hostname}...`)
        const attempt = await fetch(mirror + query, {
          headers: { 'User-Agent': 'SharkSense/1.0' },
          signal: AbortSignal.timeout(45000),
        })
        if (attempt.ok) {
          res = attempt
          break
        }
      } catch { continue }
    }

    if (!res) {
      throw new Error('All ERDDAP mirrors unreachable (NOAA servers may be slow from Australia)')
    }

    const json = await res.json()

    // ERDDAP JSON format: { table: { columnNames: [...], rows: [[time, lat, lng, sst], ...] } }
    const { columnNames, rows } = json.table
    const latIdx = columnNames.indexOf('latitude')
    const lngIdx = columnNames.indexOf('longitude')
    const sstIdx = columnNames.indexOf('analysed_sst')
    const timeIdx = columnNames.indexOf('time')

    if (latIdx === -1 || lngIdx === -1 || sstIdx === -1) {
      throw new Error(`Unexpected ERDDAP columns: ${columnNames.join(', ')}`)
    }

    log('sst-satellite', `Got ${rows.length} SST grid points`)

    // Build a lookup grid for fast nearest-neighbor queries
    const sstGrid: Array<{ lat: number; lng: number; sst: number }> = []
    for (const row of rows) {
      const sst = row[sstIdx]
      if (sst === null || sst === undefined) continue
      sstGrid.push({
        lat: row[latIdx],
        lng: row[lngIdx],
        sst: typeof sst === 'number' ? sst : parseFloat(sst),
      })
    }

    const gridTime = rows[0]?.[timeIdx] ?? new Date().toISOString()
    log('sst-satellite', `SST data timestamp: ${gridTime}`)

    // Get beaches from DB
    const { data: beaches, error: beachErr } = await db
      .from('beaches')
      .select('id, lat, lng')

    if (beachErr || !beaches?.length) {
      throw new Error(beachErr?.message ?? 'No beaches in DB')
    }

    // For each beach, find inshore and offshore SST from the satellite grid
    for (const beach of beaches as BeachRow[]) {
      const inshoreSst = findNearestSst(sstGrid, beach.lat, beach.lng)
      const offshoreSst = findNearestSst(sstGrid, beach.lat, beach.lng + OFFSHORE_OFFSET_DEG)

      if (inshoreSst === null) {
        log('sst-satellite', `  ${beach.id}: no satellite data at this location`)
        continue
      }

      const gradient = offshoreSst !== null ? offshoreSst - inshoreSst : null

      // Update the latest environmental snapshot with satellite SST
      const { data: latest } = await db
        .from('environmental_snapshots')
        .select('id')
        .eq('beach_id', beach.id)
        .order('fetched_at', { ascending: false })
        .limit(1)
        .single()

      if (latest) {
        await db.from('environmental_snapshots').update({
          satellite_sst: inshoreSst,
          satellite_offshore_sst: offshoreSst,
          sst_gradient: gradient,
        }).eq('id', latest.id)
        totalUpserted++
      }

      const gradientStr = gradient !== null ? `(gradient: ${gradient > 0 ? '+' : ''}${gradient.toFixed(2)}°C)` : ''
      log('sst-satellite', `  ${beach.id}: ${inshoreSst.toFixed(1)}°C inshore, ${offshoreSst?.toFixed(1) ?? '?'}°C offshore ${gradientStr}`)
    }

    await logScrape('sst-satellite', totalUpserted > 0 ? 'success' : 'partial', totalUpserted, startTime,
      totalUpserted === 0 ? 'No satellite SST data matched beach locations' : undefined)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await logScrape('sst-satellite', 'error', totalUpserted, startTime, message)
    throw err
  }
}

function findNearestSst(
  grid: Array<{ lat: number; lng: number; sst: number }>,
  targetLat: number,
  targetLng: number,
  maxDistDeg = 0.05, // ~5km tolerance
): number | null {
  let nearest: { sst: number; dist: number } | null = null

  for (const point of grid) {
    const dLat = point.lat - targetLat
    const dLng = point.lng - targetLng
    const dist = Math.sqrt(dLat * dLat + dLng * dLng)

    if (dist <= maxDistDeg && (nearest === null || dist < nearest.dist)) {
      nearest = { sst: point.sst, dist }
    }
  }

  return nearest?.sst ?? null
}
