import { db } from '../db.js'
import { logScrape, log } from '../logger.js'
import * as cheerio from 'cheerio'

// Primary URL; fallback to alternate paths if 404
const SYDNEY_WATER_URLS = [
  'https://www.sydneywater.com.au/water-the-environment/how-we-manage-sydneys-water/wastewater-network/wastewater-monitoring.html',
  'https://www.sydneywater.com.au/water-the-environment/wastewater-network/wastewater-monitoring.html',
  'https://www.sydneywater.com.au/wastewater-monitoring',
]

// Beach IDs near Sydney Water catchments
const AFFECTED_BEACHES = ['manly', 'dee-why', 'nielsen-park', 'bondi']

export async function scrapeSydneyWater() {
  const startTime = Date.now()
  let totalUpserted = 0

  try {
    log('sydneywater', 'Checking Sydney Water overflow alerts...')

    let res: Response | null = null
    for (const url of SYDNEY_WATER_URLS) {
      try {
        const attempt = await fetch(url, {
          headers: { 'User-Agent': 'SharkSense/1.0 (research)' },
          signal: AbortSignal.timeout(15000),
        })
        if (attempt.ok) {
          res = attempt
          break
        }
      } catch { continue }
    }

    if (!res) {
      await logScrape('sydneywater', 'partial', 0, startTime, 'All Sydney Water URLs returned errors (page may have moved)')
      return
    }

    const html = await res.text()
    const $ = cheerio.load(html)

    // Look for overflow event information
    // Sydney Water typically lists active overflow events with dates and locations
    const alerts: { title: string; description: string; date: string }[] = []

    // Search for alert/warning content
    $('h2, h3, h4').each((_, heading) => {
      const text = $(heading).text().toLowerCase()
      if (text.includes('overflow') || text.includes('wet weather') || text.includes('alert')) {
        const description = $(heading).nextUntil('h2, h3, h4').text().trim()
        alerts.push({
          title: $(heading).text().trim(),
          description: description.substring(0, 1000),
          date: new Date().toISOString(),
        })
      }
    })

    // Also check for table data
    $('table').each((_, table) => {
      $(table).find('tr').each((_, row) => {
        const cells = $(row).find('td').map((_, td) => $(td).text().trim()).get()
        if (cells.length >= 2 && cells.some((c) => c.toLowerCase().includes('overflow'))) {
          alerts.push({
            title: `Overflow: ${cells[0]}`,
            description: cells.join(' | '),
            date: new Date().toISOString(),
          })
        }
      })
    })

    log('sydneywater', `Found ${alerts.length} overflow mentions`)

    // Store as marine warnings (reuse the table for general environmental warnings)
    for (const alert of alerts) {
      const { error } = await db.from('marine_warnings').insert({
        title: `Sydney Water: ${alert.title}`,
        description: alert.description,
        region: 'sydney',
        severity: 'advice',
        issued_at: alert.date,
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48hr expiry
        source_url: SYDNEY_WATER_URLS[0],
      })

      if (!error) totalUpserted++
    }

    await logScrape('sydneywater', 'success', totalUpserted, startTime)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await logScrape('sydneywater', 'error', totalUpserted, startTime, message)
    throw err
  }
}
