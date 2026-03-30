import { db } from '../db.js'
import { logScrape, log } from '../logger.js'
import * as cheerio from 'cheerio'

// IMOS Animal Tracking web interface
const IMOS_BASE = 'https://animaltracking.aodn.org.au'

// NSW bounding box for filtering
const NSW_BOUNDS = {
  minLat: -37.5, maxLat: -28.0,
  minLng: 149.0, maxLng: 154.5,
}

// Shark species we're interested in
const TARGET_SPECIES = ['white shark', 'bull shark', 'tiger shark', 'grey nurse shark']

export async function scrapeImos() {
  const startTime = Date.now()
  let totalUpserted = 0

  try {
    log('imos', 'Fetching IMOS animal tracking data...')

    // IMOS uses a JavaScript app, so direct HTML scraping is limited
    // Try to find API endpoints used by the web app
    const res = await fetch(IMOS_BASE, {
      headers: { 'User-Agent': 'SharkSense/1.0 (research)' },
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) throw new Error(`IMOS returned ${res.status}`)

    const html = await res.text()
    const $ = cheerio.load(html)

    // Look for API endpoints in script tags
    let apiBase = ''
    $('script').each((_, script) => {
      const content = $(script).html() ?? ''
      // Look for API URL patterns
      const apiMatch = content.match(/api[Bb]ase[Uu]rl\s*[:=]\s*['"]([^'"]+)['"]/)
        ?? content.match(/baseUrl\s*[:=]\s*['"]([^'"]+)['"]/)
        ?? content.match(/(https?:\/\/[^'"]*api[^'"]*animaltracking[^'"]*)/i)

      if (apiMatch) {
        apiBase = apiMatch[1]
      }
    })

    if (apiBase) {
      log('imos', `Found API base: ${apiBase}`)

      // Try to query for recent shark detections in NSW
      try {
        const detectionUrl = `${apiBase}/detections?species=Carcharodon+carcharias&minLat=${NSW_BOUNDS.minLat}&maxLat=${NSW_BOUNDS.maxLat}&minLng=${NSW_BOUNDS.minLng}&maxLng=${NSW_BOUNDS.maxLng}&limit=50`
        const detRes = await fetch(detectionUrl, {
          headers: { 'User-Agent': 'SharkSense/1.0 (research)', 'Accept': 'application/json' },
          signal: AbortSignal.timeout(15000),
        })

        if (detRes.ok) {
          const data = await detRes.json()
          const detections = Array.isArray(data) ? data : data?.results ?? data?.data ?? []

          for (const det of detections) {
            if (!det.latitude || !det.longitude) continue

            const id = `imos-${det.id ?? det.detection_id ?? `${det.latitude}-${det.longitude}-${det.timestamp}`}`

            const { error } = await db.from('shark_detections').upsert({
              id,
              source: 'imos',
              species: normalizeSpecies(det.species ?? det.common_name ?? ''),
              lat: parseFloat(det.latitude),
              lng: parseFloat(det.longitude),
              detected_at: det.timestamp ? new Date(det.timestamp).toISOString() : new Date().toISOString(),
              station_id: det.station_name ?? det.receiver ?? null,
              tag_id: det.tag_id ?? det.transmitter_id ?? null,
              metadata: det,
            }, { onConflict: 'id' })

            if (!error) totalUpserted++
          }
        }
      } catch (apiErr) {
        log('imos', `API query failed: ${apiErr}`)
      }
    } else {
      log('imos', 'No API endpoint found, page likely requires JS rendering')
    }

    const status = totalUpserted > 0 ? 'success' : 'partial'
    await logScrape('imos', status, totalUpserted, startTime,
      totalUpserted === 0 ? 'IMOS uses JS app; may need Puppeteer for full scraping' : undefined)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await logScrape('imos', 'error', totalUpserted, startTime, message)
    throw err
  }
}

function normalizeSpecies(s: string): string {
  const lower = s.toLowerCase()
  if (lower.includes('white') || lower.includes('carcharodon')) return 'white'
  if (lower.includes('bull') || lower.includes('leucas')) return 'bull'
  if (lower.includes('tiger') || lower.includes('galeocerdo')) return 'tiger'
  return 'unknown'
}
