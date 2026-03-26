'use client'

import { useState } from 'react'
import type { EnvironmentalData as EnvData } from '@/lib/types'
import { formatSunrise, formatSunset } from '@/lib/geo/sunMoon'

interface EnvironmentalDataProps {
  data: EnvData
}

export function EnvironmentalData({ data }: EnvironmentalDataProps) {
  const [open, setOpen] = useState(false)

  const { weather, marine, sunMoon } = data

  // Wind direction to compass
  const windDir = degToCompass(weather.windDirection)

  const rows = [
    { label: 'Water temp', value: `${marine.sst.toFixed(1)}°C` },
    { label: 'Rainfall (72hr)', value: `${weather.rainfall72hr.toFixed(1)}mm` },
    { label: 'Wind', value: `${weather.windSpeed.toFixed(0)}km/h ${windDir}` },
    { label: 'Swell', value: `${marine.swellHeight.toFixed(1)}m @ ${marine.swellPeriod.toFixed(0)}s` },
    { label: 'Wave height', value: `${marine.waveHeight.toFixed(1)}m` },
    { label: 'Sunrise', value: formatSunrise(sunMoon.sunriseHour) },
    { label: 'Sunset', value: formatSunset(sunMoon.sunsetHour) },
    { label: 'Moon', value: sunMoon.moonPhaseName },
  ]

  return (
    <div className="border-t border-slate-800">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-3 text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        <span>Environmental Data</span>
        <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          &#9662;
        </span>
      </button>

      {open && (
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 gap-2">
            {rows.map((row) => (
              <div key={row.label}>
                <div className="text-xs text-slate-500">{row.label}</div>
                <div className="text-sm text-slate-200">{row.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-slate-600">
            Data updated: {new Date(data.fetchedAt).toLocaleTimeString('en-AU', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function degToCompass(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}
