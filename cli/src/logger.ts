import { db } from './db.js'

export async function logScrape(
  scraper: string,
  status: 'success' | 'error' | 'partial',
  recordsUpserted: number,
  startTime: number,
  errorMessage?: string,
) {
  const durationMs = Date.now() - startTime

  await db.from('scrape_logs').insert({
    scraper,
    status,
    records_upserted: recordsUpserted,
    error_message: errorMessage ?? null,
    duration_ms: durationMs,
  })

  const icon = status === 'success' ? '+' : status === 'error' ? 'x' : '~'
  console.log(`[${icon}] ${scraper}: ${status} (${recordsUpserted} records, ${durationMs}ms)`)
  if (errorMessage) console.log(`    Error: ${errorMessage}`)
}

export function log(scraper: string, message: string) {
  console.log(`[.] ${scraper}: ${message}`)
}
