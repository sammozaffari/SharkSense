import type { DischargeData } from '@/lib/types'

/**
 * Fetches river discharge data from WaterNSW via our proxy endpoint.
 * Falls back to baseline if the gauge has no ID or the API is unavailable.
 */
export async function fetchDischarge(
  gaugeId: string | null,
  baselineDischarge: number
): Promise<DischargeData> {
  if (!gaugeId) {
    return { currentDischarge: baselineDischarge, baselineDischarge }
  }

  try {
    const res = await fetch(`/api/waternsw?siteId=${gaugeId}`)
    if (!res.ok) throw new Error(`WaterNSW proxy failed: ${res.status}`)

    const json = await res.json()

    // WaterNSW returns discharge in ML/day (megalitres per day)
    // The API response structure varies — extract the latest value
    const currentDischarge = parseDischargeResponse(json)

    return {
      currentDischarge: currentDischarge ?? baselineDischarge,
      baselineDischarge,
    }
  } catch {
    // API unavailable — use baseline (assumes normal conditions)
    return { currentDischarge: baselineDischarge, baselineDischarge }
  }
}

function parseDischargeResponse(json: Record<string, unknown>): number | null {
  try {
    // WaterNSW API returns: { return: { traces: [{ trace: [{ v: value, t: timestamp }] }] } }
    const ret = json.return as Record<string, unknown>
    const traces = ret?.traces as Array<Record<string, unknown>>
    if (!traces?.length) return null

    const trace = traces[0].trace as Array<{ v: number; t: number }>
    if (!trace?.length) return null

    // Return the most recent value
    return trace[trace.length - 1].v
  } catch {
    return null
  }
}
