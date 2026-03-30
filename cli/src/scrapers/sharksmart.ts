import { db } from '../db.js'
import { logScrape, log } from '../logger.js'
import * as cheerio from 'cheerio'

const SHARKSMART_ACTIVITY_URL = 'https://www.sharksmart.nsw.gov.au/shark-activity'

export async function scrapeSharksmart() {
  const startTime = Date.now()
  let totalUpserted = 0

  try {
    log('sharksmart', 'Fetching SharkSmart activity page...')

    const res = await fetch(SHARKSMART_ACTIVITY_URL, {
      headers: {
        'User-Agent': 'SharkSense/1.0 (research)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(15000),
    })

    if (res.status === 403) {
      await logScrape('sharksmart', 'partial', 0, startTime, 'SharkSmart blocking scraping (403 Forbidden). Site may require Puppeteer or different User-Agent.')
      return
    }
    if (!res.ok) throw new Error(`SharkSmart returned ${res.status}`)

    const html = await res.text()
    const $ = cheerio.load(html)

    // Look for embedded JSON data or script tags with activity data
    $('script').each((_, script) => {
      const content = $(script).html() ?? ''

      // SharkSmart may embed detection data in script tags
      // Look for patterns like JSON.parse, marker data, or API calls
      const jsonMatch = content.match(/markers?\s*[:=]\s*(\[[\s\S]*?\])/m)
      if (jsonMatch) {
        try {
          const markers = JSON.parse(jsonMatch[1])
          for (const marker of markers) {
            if (marker.lat && marker.lng) {
              db.from('shark_detections').upsert({
                id: `sharksmart-${marker.id ?? Date.now()}-${marker.lat}`,
                source: 'sharksmart',
                species: normalizeSpecies(marker.species ?? marker.type ?? ''),
                lat: parseFloat(marker.lat),
                lng: parseFloat(marker.lng),
                detected_at: marker.date ? new Date(marker.date).toISOString() : new Date().toISOString(),
                raw_text: JSON.stringify(marker),
                metadata: marker,
              }, { onConflict: 'id' }).then(({ error }) => {
                if (!error) totalUpserted++
              })
            }
          }
        } catch {
          // JSON parse failed, try next pattern
        }
      }
    })

    // Also look for any list/table of recent activity
    $('.activity-item, .shark-alert, [data-type="detection"]').each((_, el) => {
      const text = $(el).text()
      const lat = $(el).attr('data-lat')
      const lng = $(el).attr('data-lng')

      if (lat && lng) {
        db.from('shark_detections').upsert({
          id: `sharksmart-page-${lat}-${lng}`,
          source: 'sharksmart',
          species: 'unknown',
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          detected_at: new Date().toISOString(),
          raw_text: text.trim().substring(0, 500),
        }, { onConflict: 'id' }).then(({ error }) => {
          if (!error) totalUpserted++
        })
      }
    })

    await new Promise((r) => setTimeout(r, 1000))
    await logScrape('sharksmart', totalUpserted > 0 ? 'success' : 'partial', totalUpserted, startTime,
      totalUpserted === 0 ? 'No detections parsed (page may use JS rendering)' : undefined)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await logScrape('sharksmart', 'error', totalUpserted, startTime, message)
    throw err
  }
}

function normalizeSpecies(s: string): string {
  const lower = s.toLowerCase()
  if (lower.includes('white')) return 'white'
  if (lower.includes('bull')) return 'bull'
  if (lower.includes('tiger')) return 'tiger'
  return 'unknown'
}
