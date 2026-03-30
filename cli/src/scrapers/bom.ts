import { db } from '../db.js'
import { logScrape, log } from '../logger.js'
import * as cheerio from 'cheerio'

// BOM marine forecast pages for NSW coastal areas
const BOM_FEEDS = [
  { region: 'sydney-coast', url: 'http://www.bom.gov.au/fwo/IDN11001.xml' },
  { region: 'hunter-coast', url: 'http://www.bom.gov.au/fwo/IDN11002.xml' },
  { region: 'central-coast', url: 'http://www.bom.gov.au/fwo/IDN11003.xml' },
]

// Fallback: scrape the marine warnings HTML page
const WARNINGS_URL = 'http://www.bom.gov.au/nsw/warnings/'

export async function scrapeBom() {
  const startTime = Date.now()
  let totalUpserted = 0

  try {
    log('bom', 'Fetching BOM marine warnings for NSW...')

    // Try RSS/XML feeds first
    for (const feed of BOM_FEEDS) {
      try {
        const res = await fetch(feed.url, {
          headers: { 'User-Agent': 'SharkSense/1.0 (research)' },
        })

        if (!res.ok) {
          log('bom', `  Feed ${feed.region}: HTTP ${res.status}, skipping`)
          continue
        }

        const xml = await res.text()
        const $ = cheerio.load(xml, { xml: true })

        $('item').each((_, item) => {
          const title = $(item).find('title').text()
          const description = $(item).find('description').text()
          const pubDate = $(item).find('pubDate').text()
          const link = $(item).find('link').text()

          // Determine severity from title
          let severity = 'advice'
          if (title.toLowerCase().includes('warning')) severity = 'warning'
          else if (title.toLowerCase().includes('watch')) severity = 'watch'

          // We'll batch insert after parsing
          db.from('marine_warnings').insert({
            title,
            description: description.substring(0, 2000),
            region: feed.region,
            severity,
            issued_at: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            source_url: link || feed.url,
          }).then(() => { totalUpserted++ })
        })
      } catch (err) {
        log('bom', `  Feed ${feed.region}: ${err}`)
      }
    }

    // Fallback: scrape warnings page
    try {
      const res = await fetch(WARNINGS_URL, {
        headers: { 'User-Agent': 'SharkSense/1.0 (research)' },
      })

      if (res.ok) {
        const html = await res.text()
        const $ = cheerio.load(html)

        // Look for warning items in the page
        $('h2:contains("Marine"), h3:contains("Marine")').each((_, heading) => {
          const section = $(heading).next('ul, div')
          section.find('a').each((_, link) => {
            const title = $(link).text().trim()
            const href = $(link).attr('href')
            if (title && title.toLowerCase().includes('warning')) {
              db.from('marine_warnings').insert({
                title,
                description: null,
                region: 'nsw',
                severity: 'warning',
                issued_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
                source_url: href ? `http://www.bom.gov.au${href}` : WARNINGS_URL,
              }).then(() => { totalUpserted++ })
            }
          })
        })
      }
    } catch (err) {
      log('bom', `  Warnings page: ${err}`)
    }

    // Wait a moment for async inserts
    await new Promise((r) => setTimeout(r, 1000))
    await logScrape('bom', 'success', totalUpserted, startTime)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await logScrape('bom', 'error', totalUpserted, startTime, message)
    throw err
  }
}
