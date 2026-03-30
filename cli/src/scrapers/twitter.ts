import { db } from '../db.js'
import { logScrape, log } from '../logger.js'
import * as cheerio from 'cheerio'

// Nitter instances (open-source Twitter frontend, no auth required)
const NITTER_INSTANCES = [
  'https://nitter.privacydev.net',
  'https://nitter.poast.org',
  'https://nitter.cz',
]

const ACCOUNT = 'NSWSharkSmart'

// Listening station name → lat/lng mapping for geocoding detections
const STATION_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  'manly': { lat: -33.7992, lng: 151.2890 },
  'dee why': { lat: -33.7500, lng: 151.2970 },
  'bondi': { lat: -33.8908, lng: 151.2750 },
  'coogee': { lat: -33.9200, lng: 151.2580 },
  'newcastle': { lat: -32.9280, lng: 151.7900 },
  'nobbys': { lat: -32.9190, lng: 151.7930 },
  'port stephens': { lat: -32.7180, lng: 152.1460 },
  'forster': { lat: -32.1810, lng: 152.5230 },
  'ballina': { lat: -28.8670, lng: 153.5870 },
  'byron bay': { lat: -28.6430, lng: 153.6360 },
  'coffs harbour': { lat: -30.2960, lng: 153.1420 },
  'port macquarie': { lat: -31.4300, lng: 152.9200 },
  'crowdy head': { lat: -31.8370, lng: 152.7470 },
  'wollongong': { lat: -34.4250, lng: 150.9010 },
  'kiama': { lat: -34.6710, lng: 150.8540 },
  'merimbula': { lat: -36.8890, lng: 149.9080 },
}

/**
 * Parse a @NSWSharkSmart tweet to extract shark detection data.
 *
 * Typical format:
 * "DPI Fisheries advise: tagged White Shark #12345 detected by Manly receiver
 *  at 10:23am (AEDT) on 15/03/2026. Last detected at 8:45am by Dee Why receiver.
 *  Tagged and released 01/02/2026 (AEDT) at Port Stephens."
 */
function parseTweet(text: string): {
  species: string
  tagId: string
  stationName: string
  detectedAt: Date
  lat: number
  lng: number
} | null {
  // Match species
  const speciesMatch = text.match(/tagged\s+(White|Bull|Tiger)\s+Shark/i)
  if (!speciesMatch) return null

  const species = speciesMatch[1].toLowerCase()

  // Match tag ID
  const tagMatch = text.match(/#(\d+)/)
  const tagId = tagMatch ? tagMatch[1] : 'unknown'

  // Match station name: "detected by [station] receiver"
  const stationMatch = text.match(/detected\s+by\s+(.+?)\s+receiver/i)
  if (!stationMatch) return null

  const stationName = stationMatch[1].trim().toLowerCase()

  // Match time and date
  const timeMatch = text.match(/at\s+(\d{1,2}:\d{2}(?:am|pm)?)\s*\((?:AEDT|AEST)\)\s+on\s+(\d{1,2}\/\d{1,2}\/\d{4})/i)
  let detectedAt: Date

  if (timeMatch) {
    const [, time, date] = timeMatch
    const [day, month, year] = date.split('/')
    detectedAt = new Date(`${year}-${month}-${day}T${convertTo24hr(time)}:00+11:00`)
  } else {
    detectedAt = new Date()
  }

  // Geocode station
  const location = STATION_LOCATIONS[stationName]
  if (!location) {
    // Try partial match
    const key = Object.keys(STATION_LOCATIONS).find((k) => stationName.includes(k) || k.includes(stationName))
    if (!key) return null
    const loc = STATION_LOCATIONS[key]
    return { species, tagId, stationName, detectedAt, lat: loc.lat, lng: loc.lng }
  }

  return { species, tagId, stationName, detectedAt, lat: location.lat, lng: location.lng }
}

function convertTo24hr(time: string): string {
  const match = time.match(/(\d{1,2}):(\d{2})(am|pm)?/i)
  if (!match) return '12:00'
  let [, hours, minutes, period] = match
  let h = parseInt(hours)
  if (period?.toLowerCase() === 'pm' && h < 12) h += 12
  if (period?.toLowerCase() === 'am' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${minutes}`
}

export async function scrapeTwitter() {
  const startTime = Date.now()
  let totalUpserted = 0

  try {
    log('twitter', 'Fetching @NSWSharkSmart tweets via Nitter...')

    let html = ''
    let usedInstance = ''

    // Try Nitter instances until one works
    for (const instance of NITTER_INSTANCES) {
      try {
        const res = await fetch(`${instance}/${ACCOUNT}`, {
          headers: { 'User-Agent': 'SharkSense/1.0 (research)' },
          signal: AbortSignal.timeout(10000),
        })
        if (res.ok) {
          html = await res.text()
          usedInstance = instance
          break
        }
      } catch {
        continue
      }
    }

    if (!html) {
      throw new Error('All Nitter instances unavailable')
    }

    log('twitter', `Using ${usedInstance}`)

    const $ = cheerio.load(html)

    // Parse tweets from Nitter HTML
    const tweets: string[] = []
    $('.timeline-item .tweet-content, .tweet-body .tweet-content').each((_, el) => {
      tweets.push($(el).text().trim())
    })

    log('twitter', `Found ${tweets.length} tweets`)

    for (const text of tweets) {
      // Only process detection tweets
      if (!text.toLowerCase().includes('detected by') || !text.toLowerCase().includes('tagged')) continue

      const parsed = parseTweet(text)
      if (!parsed) continue

      const detectionId = `twitter-${parsed.tagId}-${parsed.detectedAt.getTime()}`

      const { error } = await db.from('shark_detections').upsert({
        id: detectionId,
        source: 'twitter',
        species: parsed.species,
        lat: parsed.lat,
        lng: parsed.lng,
        detected_at: parsed.detectedAt.toISOString(),
        raw_text: text,
        station_id: parsed.stationName,
        tag_id: parsed.tagId,
        metadata: { nitter_instance: usedInstance },
      }, { onConflict: 'id' })

      if (!error) totalUpserted++
    }

    await logScrape('twitter', 'success', totalUpserted, startTime)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await logScrape('twitter', 'error', totalUpserted, startTime, message)
    throw err
  }
}
