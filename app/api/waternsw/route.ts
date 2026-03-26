import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const siteId = req.nextUrl.searchParams.get('siteId')
  if (!siteId) {
    return NextResponse.json({ error: 'siteId required' }, { status: 400 })
  }

  // Build WaterNSW API request for latest discharge values
  // Variable 141 = discharge (ML/day) for most gauges
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const params = new URLSearchParams({
    params: JSON.stringify({
      function: 'get_ts_traces',
      version: 2,
      params: {
        site_list: siteId,
        datasource: 'A',
        varfrom: '141',
        varto: '141',
        start_time: formatDate(oneDayAgo),
        end_time: formatDate(now),
        data_type: 'mean',
        interval: 'hour',
        multiplier: 1,
      },
    }),
  })

  try {
    // Use .exe endpoint — .pl redirects and causes issues
    const res = await fetch(
      `https://realtimedata.waternsw.com.au/cgi/webservice.exe?${params}`,
      {
        headers: { 'User-Agent': 'SharkSense/1.0' },
      }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: `WaterNSW returned ${res.status}` },
        { status: 502 }
      )
    }

    const data = await res.json()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=900, stale-while-revalidate',
      },
    })
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch from WaterNSW', details: String(e) },
      { status: 502 }
    )
  }
}

function formatDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}00`
}
