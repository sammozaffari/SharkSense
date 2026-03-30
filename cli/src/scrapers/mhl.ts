import { db } from '../db.js'
import { logScrape, log } from '../logger.js'

/**
 * MHL Wave Buoy scraper.
 *
 * The MHL API (api.manly.hydraulics.works) requires authentication
 * embedded in their web app. For now, we use Open-Meteo marine data
 * as the primary wave source (already captured in environmental_snapshots).
 *
 * This scraper is a placeholder that logs its status. When MHL API
 * access is obtained (via data-request@mhl.nsw.gov.au), it will
 * fetch real buoy data from WAVESYD and other stations.
 */
export async function scrapeMhl() {
  const startTime = Date.now()

  log('mhl', 'MHL API requires auth — using Open-Meteo marine data as wave source')
  log('mhl', 'To get MHL access: email data-request@mhl.nsw.gov.au')

  await logScrape('mhl', 'partial', 0, startTime,
    'MHL API requires authentication. Wave data sourced from Open-Meteo marine API instead. Contact data-request@mhl.nsw.gov.au for direct access.')
}
