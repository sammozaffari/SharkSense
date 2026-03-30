import { db } from '../db.js'
import { logScrape, log } from '../logger.js'
import * as cheerio from 'cheerio'

// Beachwatch API (discovered from SPA JS bundle)
const SITES_API = 'https://api.beachwatch.nsw.gov.au/sites'
const RSS_API = 'https://api.beachwatch.nsw.gov.au/public/sites/rss'

// Map our beach IDs to Beachwatch site names
const BEACH_MAPPING: Record<string, string[]> = {
  'manly': ['Manly Beach', 'South Steyne Beach', 'North Steyne Beach'],
  'dee-why': ['Dee Why Beach'],
  'nielsen-park': ['Nielsen Park'],
  'bondi': ['Bondi Beach'],
  'newcastle': ['Nobbys Beach', 'Newcastle Beach'],
}

export async function scrapeBeachwatch() {
  const startTime = Date.now()
  let totalUpserted = 0

  try {
    log('beachwatch', 'Fetching from Beachwatch GeoJSON API...')

    // Method 1: GeoJSON sites endpoint (has pollution forecast)
    const sitesRes = await fetch(SITES_API, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(15000),
    })

    if (sitesRes.ok) {
      const geojson = await sitesRes.json()
      const features = geojson.features ?? []
      log('beachwatch', `Got ${features.length} sites from GeoJSON API`)

      for (const [beachId, siteNames] of Object.entries(BEACH_MAPPING)) {
        const match = features.find((f: { properties: { site_name: string } }) =>
          siteNames.some((name) =>
            f.properties.site_name.toLowerCase() === name.toLowerCase()
          )
        )

        if (!match) continue

        const props = match.properties
        const { error } = await db.from('water_quality').insert({
          beach_id: beachId,
          rating: props.latest_result_star_rating ?? null,
          forecast: props.pollution_forecast ?? null,
          sampled_at: new Date().toISOString(),
          source_url: SITES_API,
        })

        if (!error) {
          totalUpserted++
          log('beachwatch', `  ${beachId}: forecast=${props.pollution_forecast}, rating=${props.latest_result_star_rating}`)
        }
      }
    } else {
      // Method 2: Fallback to RSS feed
      log('beachwatch', `GeoJSON returned ${sitesRes.status}, trying RSS...`)

      const rssRes = await fetch(RSS_API, { signal: AbortSignal.timeout(15000) })
      if (!rssRes.ok) throw new Error(`Both API endpoints failed`)

      const xml = await rssRes.text()
      const $ = cheerio.load(xml, { xml: true })

      for (const [beachId, siteNames] of Object.entries(BEACH_MAPPING)) {
        $('item').each((_, item) => {
          const title = $(item).find('title').text()
          if (!siteNames.some((name) => title.toLowerCase() === name.toLowerCase())) return

          const desc = $(item).find('description').text()
          const forecastMatch = desc.match(/Pollution is:\s*<b>([^<]+)<\/b>/i)
          const forecast = forecastMatch ? forecastMatch[1].trim() : null

          db.from('water_quality').insert({
            beach_id: beachId,
            forecast,
            sampled_at: new Date().toISOString(),
            source_url: RSS_API,
          }).then(({ error }) => {
            if (!error) totalUpserted++
          })
        })
      }

      await new Promise((r) => setTimeout(r, 1000))
    }

    await logScrape('beachwatch', totalUpserted > 0 ? 'success' : 'partial', totalUpserted, startTime)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await logScrape('beachwatch', 'error', totalUpserted, startTime, message)
    throw err
  }
}
