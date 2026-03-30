'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface ScrapeLog {
  scraper: string
  status: 'success' | 'error' | 'partial'
  records_upserted: number
  started_at: string
  duration_ms: number
  error_message: string | null
}

const SOURCE_LABELS: Record<string, string> = {
  openmeteo: 'Open-Meteo (Weather + Marine)',
  waternsw: 'WaterNSW (River Discharge)',
  twitter: 'Twitter (@NSWSharkSmart)',
  beachwatch: 'Beachwatch (Water Quality)',
  bom: 'BOM (Marine Warnings)',
  asid: 'ASID (Historical Incidents)',
  imos: 'IMOS (Shark Tracking)',
  sharksmart: 'SharkSmart (Activity)',
  mhl: 'MHL (Wave Buoys)',
  sydneywater: 'Sydney Water (Overflows)',
  googlenews: 'Google News (Shark News)',
  tides: 'Tides (WillyWeather)',
}

const STATUS_DOT: Record<string, string> = {
  success: 'bg-emerald-400',
  partial: 'bg-amber-400',
  error: 'bg-red-400',
  never: 'bg-gray-300',
}

export function DataSourceStatus() {
  const [logs, setLogs] = useState<Map<string, ScrapeLog>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      const { data, error } = await supabase
        .from('scrape_logs')
        .select('scraper, status, records_upserted, started_at, duration_ms, error_message')
        .order('started_at', { ascending: false })
        .limit(100)

      if (error || !data) {
        setLoading(false)
        return
      }

      // Keep only the most recent log per scraper
      const latest = new Map<string, ScrapeLog>()
      for (const log of data as ScrapeLog[]) {
        if (!latest.has(log.scraper)) {
          latest.set(log.scraper, log)
        }
      }
      setLogs(latest)
      setLoading(false)
    }

    fetchLogs()
  }, [])

  const sources = Object.keys(SOURCE_LABELS)

  return (
    <details className="border border-gray-200 rounded-lg bg-white">
      <summary className="cursor-pointer px-4 py-3 font-medium text-gray-900 select-none">
        Data Sources
      </summary>
      <div className="px-4 pb-4">
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <div className="space-y-2">
            {sources.map((key) => {
              const log = logs.get(key)
              return (
                <SourceRow
                  key={key}
                  name={SOURCE_LABELS[key]}
                  log={log ?? null}
                />
              )
            })}
          </div>
        )}
      </div>
    </details>
  )
}

function SourceRow({ name, log }: { name: string; log: ScrapeLog | null }) {
  const status = log?.status ?? 'never'
  const dotColor = STATUS_DOT[status] ?? STATUS_DOT.never

  let timeLabel = 'Never'
  if (log?.started_at) {
    const elapsed = Date.now() - new Date(log.started_at).getTime()
    const mins = Math.round(elapsed / 60000)
    if (mins < 1) timeLabel = 'Just now'
    else if (mins < 60) timeLabel = `${mins}m ago`
    else if (mins < 1440) timeLabel = `${Math.round(mins / 60)}hr ago`
    else timeLabel = `${Math.round(mins / 1440)}d ago`
  }

  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2 min-w-0">
        <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
        <span className="text-sm text-gray-700 truncate">{name}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {log && log.records_upserted > 0 && (
          <span className="text-xs text-gray-400">{log.records_upserted} rec</span>
        )}
        <span className="text-xs text-gray-500 w-16 text-right">{timeLabel}</span>
      </div>
    </div>
  )
}
