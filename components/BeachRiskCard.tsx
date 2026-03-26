import type { Beach, EnvironmentalData as EnvData, RiskResult } from '@/lib/types'
import { RiskColourBlock } from './RiskColourBlock'
import { RiskReason } from './RiskReason'
import { RiskDetailExpander } from './RiskDetailExpander'
import { BeachMap } from './BeachMap'
import { EnvironmentalData } from './EnvironmentalData'
import { HistoricalData } from './HistoricalData'

interface BeachRiskCardProps {
  beach: Beach
  envData: EnvData
  risk: RiskResult
}

export function BeachRiskCard({ beach, envData, risk }: BeachRiskCardProps) {
  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
      <RiskColourBlock
        level={risk.level}
        beachName={beach.name}
        score={risk.score}
      />
      <RiskReason result={risk} />
      <RiskDetailExpander result={risk} />
      <BeachMap beach={beach} riskLevel={risk.level} />
      <EnvironmentalData data={envData} />
      <HistoricalData beach={beach} />
    </div>
  )
}
