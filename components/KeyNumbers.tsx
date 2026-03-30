import type { EnvironmentalData, RiskResult, RiskProjection, RiskLevel } from '@/lib/types'

const DOT_COLORS: Record<RiskLevel, string> = {
  GREEN: 'bg-risk-green',
  AMBER: 'bg-risk-amber',
  RED: 'bg-risk-red',
}

interface KeyNumbersProps {
  env: EnvironmentalData
  risk: RiskResult
  projections: RiskProjection[]
  estuaryName: string
  estuaryDistanceKm: number
}

export function KeyNumbers({ env, risk, projections, estuaryName, estuaryDistanceKm }: KeyNumbersProps) {
  const dischargeRatio = env.discharge.baselineDischarge > 0
    ? env.discharge.currentDischarge / env.discharge.baselineDischarge
    : 0

  const windDir = getWindDirection(env.weather.windDirection)

  const fetchedDate = new Date(env.fetchedAt)
  const freshness = fetchedDate.toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney',
    day: 'numeric', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <NumberCell
          label="Rainfall (72hr)"
          value={`${env.weather.rainfall72hr.toFixed(0)}mm`}
          warn={env.weather.rainfall72hr >= 45}
        />
        <NumberCell
          label="Water temp"
          value={`${env.marine.sst.toFixed(1)}\u00b0C`}
          warn={env.marine.sst >= 22}
        />
        <NumberCell
          label="River flow"
          value={dischargeRatio > 0
            ? dischargeRatio >= 2 ? `${dischargeRatio.toFixed(1)}x above normal`
            : 'Normal'
            : 'No gauge nearby'}
          subtitle="Water flowing from nearby rivers compared to normal levels"
          warn={dischargeRatio >= 2}
        />
        <NumberCell
          label="Tide"
          value={formatTideState(env.tideState)}
          warn={env.tideState === 'high'}
        />
        <NumberCell
          label="Wind"
          value={`${env.weather.windSpeed.toFixed(0)} km/h ${windDir}`}
        />
        <NumberCell
          label="Wave height"
          value={`${env.marine.waveHeight.toFixed(1)}m`}
        />
        <NumberCell
          label="Moon"
          value={env.sunMoon.moonPhaseName}
        />
        <NumberCell
          label="Nearest estuary"
          value={`${estuaryName} (${estuaryDistanceKm.toFixed(1)}km)`}
          warn={estuaryDistanceKm <= 1}
        />
      </div>

      {/* 5-day outlook */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-400 mb-2">5-day outlook</p>
        <div className="flex gap-2">
          {projections.map((p) => (
            <div key={p.day} className="flex flex-col items-center gap-1 flex-1">
              <div className={`w-4 h-4 rounded-full ${DOT_COLORS[p.level]}`} />
              <span className="text-xs text-gray-500">{p.day}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-3 text-right">Data fetched: {freshness}</p>
    </div>
  )
}

function NumberCell({ label, value, subtitle, warn }: { label: string; value: string; subtitle?: string; warn?: boolean }) {
  return (
    <div className={`p-3 rounded border ${warn ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'}`}>
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-sm font-medium ${warn ? 'text-amber-800' : 'text-gray-900'}`}>{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  )
}

function formatTideState(state?: string): string {
  if (!state) return 'Unknown'
  const map: Record<string, string> = {
    low: 'Low',
    mid_rising: 'Rising',
    high: 'High',
    mid_falling: 'Falling',
  }
  return map[state] ?? state
}

function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(degrees / 45) % 8]
}
