#!/usr/bin/env node
import 'dotenv/config'
import { Command } from 'commander'
import { scrapeTwitter } from './scrapers/twitter.js'
import { scrapeBeachwatch } from './scrapers/beachwatch.js'
import { scrapeBom } from './scrapers/bom.js'
import { scrapeImos } from './scrapers/imos.js'
import { scrapeSharksmart } from './scrapers/sharksmart.js'
import { scrapeMhl } from './scrapers/mhl.js'
import { scrapeAsid } from './scrapers/asid.js'
import { scrapeWaterNsw } from './scrapers/waternsw.js'
import { scrapeOpenMeteo } from './scrapers/openmeteo.js'
import { scrapeSydneyWater } from './scrapers/sydneywater.js'
import { scrapeGoogleNews } from './scrapers/googlenews.js'
import { scrapeTides } from './scrapers/tides.js'
import { scrapeSstSatellite } from './scrapers/sst-satellite.js'
import { db } from './db.js'

const SCRAPERS: Record<string, () => Promise<void>> = {
  twitter: scrapeTwitter,
  beachwatch: scrapeBeachwatch,
  bom: scrapeBom,
  imos: scrapeImos,
  sharksmart: scrapeSharksmart,
  mhl: scrapeMhl,
  asid: scrapeAsid,
  waternsw: scrapeWaterNsw,
  openmeteo: scrapeOpenMeteo,
  sydneywater: scrapeSydneyWater,
  googlenews: scrapeGoogleNews,
  tides: scrapeTides,
  'sst-satellite': scrapeSstSatellite,
}

const program = new Command()

program
  .name('sharksense')
  .description('SharkSense data scraping CLI')
  .version('1.0.0')

program
  .command('scrape <source>')
  .description('Run a scraper (twitter, beachwatch, bom, imos, sharksmart, mhl, asid, waternsw, openmeteo, sydneywater, googlenews, tides, all)')
  .action(async (source: string) => {
    if (source === 'all') {
      console.log('Running all scrapers...\n')
      for (const [name, fn] of Object.entries(SCRAPERS)) {
        try {
          await fn()
        } catch (err) {
          console.error(`  ${name} failed:`, err instanceof Error ? err.message : err)
        }
      }
      console.log('\nAll scrapers complete.')
      return
    }

    const scraper = SCRAPERS[source]
    if (!scraper) {
      console.error(`Unknown scraper: ${source}`)
      console.error(`Available: ${Object.keys(SCRAPERS).join(', ')}, all`)
      process.exit(1)
    }

    try {
      await scraper()
    } catch (err) {
      console.error(`Scraper failed:`, err instanceof Error ? err.message : err)
      process.exit(1)
    }
  })

program
  .command('db:seed')
  .description('Seed the beaches table from local data')
  .action(async () => {
    const { default: beaches } = await import('../../data/beaches.json', { with: { type: 'json' } })

    console.log(`Seeding ${beaches.length} beaches...`)

    for (const beach of beaches as Record<string, unknown>[]) {
      const { error } = await db.from('beaches').upsert({
        id: beach.id,
        name: beach.name,
        short_name: beach.shortName,
        lat: beach.lat,
        lng: beach.lng,
        estuary_distance_km: beach.estuaryDistanceKm,
        estuary_name: beach.estuaryName,
        water_nsw_gauge_id: beach.waterNswGaugeId,
        baseline_discharge: beach.baselineDischarge,
        historical_incidents: beach.historicalIncidents,
      }, { onConflict: 'id' })

      if (error) console.error(`  Failed ${beach.id}: ${error.message}`)
      else console.log(`  + ${beach.name}`)
    }

    console.log('Seed complete.')
  })

program
  .command('db:status')
  .description('Show database table counts and latest scrape logs')
  .action(async () => {
    const tables = ['beaches', 'shark_detections', 'water_quality', 'environmental_snapshots', 'marine_warnings', 'wave_buoy_readings', 'historical_incidents']

    console.log('Table counts:')
    for (const table of tables) {
      const { count } = await db.from(table).select('*', { count: 'exact', head: true })
      console.log(`  ${table}: ${count ?? 0}`)
    }

    console.log('\nRecent scrape logs:')
    const { data: logs } = await db
      .from('scrape_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(10)

    if (logs?.length) {
      for (const l of logs) {
        const icon = l.status === 'success' ? '+' : l.status === 'error' ? 'x' : '~'
        const time = new Date(l.started_at).toLocaleString('en-AU', { timeZone: 'Australia/Sydney' })
        console.log(`  [${icon}] ${time} | ${l.scraper}: ${l.status} (${l.records_upserted} records, ${l.duration_ms}ms)`)
        if (l.error_message) console.log(`      ${l.error_message}`)
      }
    } else {
      console.log('  No scrape logs yet.')
    }
  })

program.parse()
