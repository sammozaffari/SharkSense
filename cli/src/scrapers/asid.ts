import { db } from '../db.js'
import { logScrape, log } from '../logger.js'

const ASID_ZENODO_URL = 'https://zenodo.org/api/records/18752301/files/Australian%20Shark-Incident%20Database%20Public%20Version.xlsx/content'

export async function scrapeAsid() {
  const startTime = Date.now()
  let totalUpserted = 0

  try {
    log('asid', 'Downloading ASID Excel from Zenodo...')

    const res = await fetch(ASID_ZENODO_URL, {
      headers: { 'User-Agent': 'SharkSense/1.0 (research)' },
      redirect: 'follow',
    })

    if (!res.ok) throw new Error(`GitHub download failed: ${res.status}`)

    const buffer = await res.arrayBuffer()

    // Dynamic import xlsx (it's a CJS module)
    const XLSX = await import('xlsx')
    const workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' })

    const sheetName = workbook.SheetNames[0]
    if (!sheetName) throw new Error('No sheets in workbook')

    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)

    log('asid', `Parsed ${rows.length} incident records`)

    // Filter for NSW incidents
    const nswRows = rows.filter((r) => {
      const state = String(r['State'] ?? r['state'] ?? '').toLowerCase()
      return state === 'nsw' || state === 'new south wales'
    })

    log('asid', `${nswRows.length} NSW incidents`)

    // Match incidents to nearest pilot beach
    const { data: beaches } = await db.from('beaches').select('id, lat, lng')
    const beachList = (beaches ?? []) as { id: string; lat: number; lng: number }[]

    const records = nswRows.map((row) => {
      const lat = parseFloat(String(row['Latitude'] ?? row['latitude'] ?? '0'))
      const lng = parseFloat(String(row['Longitude'] ?? row['longitude'] ?? '0'))

      let nearestBeachId: string | null = null
      if (lat && lng && beachList.length > 0) {
        let minDist = Infinity
        for (const b of beachList) {
          const d = Math.sqrt((b.lat - lat) ** 2 + (b.lng - lng) ** 2)
          if (d < minDist) { minDist = d; nearestBeachId = b.id }
        }
        // Only assign if within ~50km (roughly 0.5 degrees)
        if (minDist > 0.5) nearestBeachId = null
      }

      return {
        incident_date: parseDate(row['Date'] ?? row['date'] ?? row['Incident.year']),
        location: String(row['Location'] ?? row['location'] ?? 'Unknown'),
        lat: lat || null,
        lng: lng || null,
        species: normalizeSpecies(String(row['Shark.common.name'] ?? row['Species'] ?? '')),
        outcome: normalizeOutcome(String(row['Injury.severity'] ?? row['Outcome'] ?? '')),
        activity: String(row['Victim.activity'] ?? row['Activity'] ?? '').toLowerCase() || null,
        description: String(row['Provoked/unprovoked'] ?? ''),
        source: 'taronga-asid',
        nearest_beach_id: nearestBeachId,
      }
    }).filter((r) => r.incident_date)

    // Batch insert
    const batchSize = 50
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      const { error } = await db.from('historical_incidents').upsert(batch, {
        onConflict: 'id',
        ignoreDuplicates: true,
      })
      if (!error) totalUpserted += batch.length
    }

    await logScrape('asid', 'success', totalUpserted, startTime)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    await logScrape('asid', 'error', totalUpserted, startTime, message)
    throw err
  }
}

function parseDate(value: unknown): string | null {
  if (!value) return null
  const str = String(value)
  // Try various date formats
  const d = new Date(str)
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0]
  // Try year-only
  const yearMatch = str.match(/\d{4}/)
  if (yearMatch) return `${yearMatch[0]}-01-01`
  return null
}

function normalizeSpecies(species: string): string {
  const s = species.toLowerCase()
  if (s.includes('white') || s.includes('carcharodon')) return 'white'
  if (s.includes('bull') || s.includes('carcharhinus leucas')) return 'bull'
  if (s.includes('tiger') || s.includes('galeocerdo')) return 'tiger'
  if (s.includes('wobbegong')) return 'wobbegong'
  return 'unknown'
}

function normalizeOutcome(outcome: string): string {
  const o = outcome.toLowerCase()
  if (o.includes('fatal') || o.includes('death')) return 'fatal'
  if (o.includes('injur') || o.includes('wound')) return 'injured'
  return 'uninjured'
}
