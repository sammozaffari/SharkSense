import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Full NSW coast: Tweed Heads to Eden, out past continental shelf
// Stride of 2 on lat/lng to reduce data volume (~5,800 rows vs 23,000)
// Effective resolution: 0.1° (~10km) — still smooth when interpolated
const SST_URL =
  'https://coastwatch.noaa.gov/erddap/griddap/noaacrwsstDaily.json' +
  '?analysed_sst[(last)][(-37.5):2:(-28.0)][(149.0):2:(155.0)]'

export async function GET() {
  try {
    const res = await fetch(SST_URL, {
      headers: { 'User-Agent': 'SharkSense/1.0' },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `NOAA returned ${res.status}` },
        { status: 502 }
      )
    }

    const data = await res.json()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch SST data', details: String(e) },
      { status: 502 }
    )
  }
}
