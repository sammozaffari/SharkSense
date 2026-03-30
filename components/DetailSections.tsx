import type { RiskResult, Beach, EnvironmentalData } from '@/lib/types'

interface DetailSectionsProps {
  risk: RiskResult
  beach: Beach
  env: EnvironmentalData
}

export function DetailSections({ risk, beach, env }: DetailSectionsProps) {
  return (
    <div className="space-y-6">
      <RiskBreakdown risk={risk} />
      <ScienceExplanation risk={risk} env={env} beach={beach} />
      <BeachHistory beach={beach} />
    </div>
  )
}

function RiskBreakdown({ risk }: { risk: RiskResult }) {
  return (
    <section>
      <h2 className="text-sm font-bold text-gray-900 mb-3">Risk Breakdown</h2>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Bull shark</span>
            <span className="font-medium">{(risk.bullScore * 100).toFixed(0)}%</span>
          </div>
          <ScoreBar score={risk.bullScore} />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">White shark</span>
            <span className="font-medium">{(risk.whiteScore * 100).toFixed(0)}%</span>
          </div>
          <ScoreBar score={risk.whiteScore} />
        </div>
        <p className="text-xs text-gray-500">
          Dominant factor: <b>{risk.dominantFactor.type.replace('_', ' ')}</b> ({risk.species} shark branch)
        </p>
      </div>
    </section>
  )
}

function ScienceExplanation({ risk, env, beach }: { risk: RiskResult; env: EnvironmentalData; beach: Beach }) {
  const explanations = getScienceExplanations(risk, env, beach)

  return (
    <section>
      <h2 className="text-sm font-bold text-gray-900 mb-3">Why This Risk Level</h2>
      {explanations.length > 0 ? (
        <div className="space-y-3">
          {explanations.map((exp, i) => (
            <div key={i} className="border-l-2 border-gray-200 pl-3">
              <p className="text-sm font-medium text-gray-700">{exp.factor}</p>
              <p className="text-sm text-gray-500">{exp.explanation}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">All environmental factors are within normal ranges.</p>
      )}
    </section>
  )
}

function BeachHistory({ beach }: { beach: Beach }) {
  const { historicalIncidents: h } = beach

  return (
    <section>
      <h2 className="text-sm font-bold text-gray-900 mb-3">Beach History</h2>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-400 text-xs">Total incidents</p>
          <p className="font-medium text-gray-900">{h.total}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Bull shark</p>
          <p className="font-medium text-gray-900">{h.bull}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">White shark</p>
          <p className="font-medium text-gray-900">{h.white}</p>
        </div>
        {h.lastIncidentDate && (
          <div>
            <p className="text-gray-400 text-xs">Last incident</p>
            <p className="font-medium text-gray-900">
              {h.lastIncidentDate}{h.lastIncidentSpecies ? ` (${h.lastIncidentSpecies})` : ''}
            </p>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        Source: Australian Shark-Incident Database (Taronga/Flinders/NSW DPI)
      </p>
    </section>
  )
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100)
  const color = score >= 0.63 ? 'bg-risk-red' : score >= 0.33 ? 'bg-risk-amber' : 'bg-risk-green'

  return (
    <div className="w-full h-2 bg-gray-100 rounded-full">
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

interface Explanation {
  factor: string
  explanation: string
}

function getScienceExplanations(risk: RiskResult, env: EnvironmentalData, beach: Beach): Explanation[] {
  const explanations: Explanation[] = []

  if (env.weather.rainfall72hr >= 45) {
    explanations.push({
      factor: `${env.weather.rainfall72hr.toFixed(0)}mm rainfall in the last 72 hours`,
      explanation: 'Bull sharks leave rivers 1-8 days after heavy rain, peak at 3-5 days (Werry & Sumpton 2018). Water takes up to a week to clear.',
    })
  }

  const dischargeRatio = env.discharge.baselineDischarge > 0
    ? env.discharge.currentDischarge / env.discharge.baselineDischarge
    : 0
  if (dischargeRatio >= 2) {
    explanations.push({
      factor: `River discharge ${dischargeRatio.toFixed(1)}x above normal`,
      explanation: 'When rivers flow above baseline, bull sharks leave in large numbers simultaneously.',
    })
  }

  if (beach.estuaryDistanceKm <= 0.5) {
    explanations.push({
      factor: `${beach.estuaryName} is ${beach.estuaryDistanceKm < 0.1 ? 'directly adjacent' : `${(beach.estuaryDistanceKm * 1000).toFixed(0)}m away`}`,
      explanation: 'Proximity to estuary/lagoon mouth is a top predictor of shark presence. Peak detections occur within 640m of river mouths (Smoothey et al. 2023).',
    })
  }

  if (env.marine.sst >= 22 && risk.species === 'bull') {
    explanations.push({
      factor: `Water temperature ${env.marine.sst.toFixed(1)}\u00b0C`,
      explanation: 'Bull sharks peak at 23-24\u00b0C. Warming SST extends bull shark season by ~1 day/year (Lubitz et al. 2025).',
    })
  }

  if (env.marine.offshoreSst !== null && (env.marine.offshoreSst - env.marine.sst) >= 1.5) {
    const drop = (env.marine.offshoreSst - env.marine.sst).toFixed(1)
    explanations.push({
      factor: `${drop}\u00b0C inshore temperature drop (upwelling)`,
      explanation: 'Cold water upwelling triggers plankton > baitfish > shark cascade. Risk peaks 7-14 days after event.',
    })
  }

  if ((env.detections?.length ?? 0) > 0) {
    const count = env.detections!.length
    const latest = env.detections![0]
    const hoursAgo = Math.round((Date.now() - latest.timestamp) / 3600000)
    explanations.push({
      factor: `${count} shark detection${count > 1 ? 's' : ''} nearby (${hoursAgo}hr ago)`,
      explanation: `Tagged ${latest.species} shark detected at ${latest.stationId || 'nearby receiver'}. Detection range is ~500m per receiver.`,
    })
  }

  if (env.tideState === 'high') {
    explanations.push({
      factor: 'High tide',
      explanation: 'Tidal state is the #1 predictor of white shark predation (Hammerschlag et al. 2006). High tide = sharks closer to shore.',
    })
  }

  return explanations
}
