import type { SharkDetection } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { getCached, setCached } from './cache'

const DETECTION_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch recent shark detections near a beach from Supabase.
 * Falls back to returning empty array if Supabase is unavailable.
 */
export async function fetchSharkDetections(beachId: string): Promise<SharkDetection[]> {
  const cacheKey = `shark-detections:${beachId}`
  const cached = getCached<SharkDetection[]>(cacheKey)
  if (cached) return cached.data

  try {
    // Get beach location for proximity filtering
    const { data: beach } = await supabase
      .from('beaches')
      .select('lat, lng')
      .eq('id', beachId)
      .single()

    if (!beach) return []

    // Fetch detections from the last 48 hours within ~0.1 degree (~10km)
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

    const { data: detections } = await supabase
      .from('shark_detections')
      .select('id, species, lat, lng, detected_at, station_id')
      .gte('detected_at', cutoff)
      .gte('lat', beach.lat - 0.1)
      .lte('lat', beach.lat + 0.1)
      .gte('lng', beach.lng - 0.1)
      .lte('lng', beach.lng + 0.1)
      .order('detected_at', { ascending: false })
      .limit(20)

    if (!detections?.length) return []

    const result: SharkDetection[] = detections.map((d) => ({
      id: d.id,
      lat: d.lat,
      lng: d.lng,
      species: (d.species === 'white' || d.species === 'bull') ? d.species : 'white',
      timestamp: new Date(d.detected_at).getTime(),
      stationId: d.station_id ?? '',
    }))

    setCached(cacheKey, result, DETECTION_CACHE_TTL)
    return result
  } catch {
    return []
  }
}

/**
 * Check if any white shark detections exist within range and time window.
 */
export function hasRecentWhiteSharkDetection(
  detections: SharkDetection[],
  beachLat: number,
  beachLng: number,
  maxDistKm: number = 5,
  maxAgeHours: number = 24,
): boolean {
  const now = Date.now()
  const maxAgeMs = maxAgeHours * 60 * 60 * 1000

  return detections.some((d) => {
    if (d.species !== 'white') return false
    if (now - d.timestamp > maxAgeMs) return false

    const dist = haversineKm(beachLat, beachLng, d.lat, d.lng)
    return dist <= maxDistKm
  })
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
