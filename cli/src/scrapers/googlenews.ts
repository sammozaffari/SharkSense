import { db } from '../db.js'
import { logScrape, log } from '../logger.js'
import * as cheerio from 'cheerio'

const RSS_URL = 'https://news.google.com/rss/search?q=shark+attack+NSW+Australia&hl=en-AU&gl=AU&ceid=AU:en'

export async function scrapeGoogleNews() {
  const startTime = Date.now()
  let totalUpserted = 0

  try {
    log('googlenews', 'Fetching Google News RSS for shark news...')

    const res = await fetch(RSS_URL, {
      headers: { 'User-Agent': 'SharkSense/1.0' },
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) throw new Error(`Google News RSS returned ${res.status}`)

    const xml = await res.text()
    const $ = cheerio.load(xml, { xmlMode: true })

    const items: { title: string; link: string; pubDate: string; source: string }[] = []

    $('item').each((_, item) => {
      items.push({
        title: $(item).find('title').text().trim(),
        link: $(item).find('link').text().trim(),
        pubDate: $(item).find('pubDate').text().trim(),
        source: $(item).find('source').text().trim(),
      })
    })

    log('googlenews', `Found ${items.length} articles`)

    // Filter for likely shark-related articles (not just keyword matches)
    const sharkTerms = /shark|attack|bite|sighting|drumline|net\b|bull shark|white shark/i

    for (const item of items) {
      if (!sharkTerms.test(item.title)) continue

      const id = `googlenews-${Buffer.from(item.link).toString('base64').substring(0, 40)}`

      const { error } = await db.from('marine_warnings').upsert({
        id,
        title: `News: ${item.title}`.substring(0, 500),
        description: `Source: ${item.source}. ${item.link}`,
        region: 'nsw',
        severity: 'info',
        issued_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 day expiry
        source_url: item.link,
      }, { onConflict: 'id' })

      if (!error) totalUpserted++
    }

    await logScrape('googlenews', 'success', totalUpserted, startTime)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await logScrape('googlenews', 'error', totalUpserted, startTime, message)
    throw err
  }
}
