import type { DominantFactor, SharkSpecies } from '@/lib/types'
import type { BullSharkFactors } from './bullSharkRisk'
import type { WhiteSharkFactors } from './whiteSharkRisk'
import { BULL_SHARK_WEIGHTS } from './bullSharkRisk'
import { WHITE_SHARK_WEIGHTS } from './whiteSharkRisk'

type FactorReasons = { [key: string]: (value: number) => string }

const BULL_SHARK_REASONS: Record<keyof BullSharkFactors, (value: number) => string> = {
  rainfall: (v) => v >= 0.7
    ? 'Heavy rain in catchment — bull sharks may be near shore'
    : 'Recent rain increasing runoff — elevated bull shark risk',
  discharge: (v) => v >= 0.7
    ? 'River discharge well above normal — bull sharks leaving rivers'
    : 'River flow elevated after rain — increased bull shark activity',
  estuary: () => 'Close to river mouth — bull sharks concentrate here after rain',
  temperature: (v) => v >= 0.7
    ? 'Warm water (24°C+) — peak bull shark activity conditions'
    : 'Water temperature in bull shark active range',
  visibility: () => 'Murky water conditions — bull sharks hunt by electroreception in low visibility',
  time: () => 'Dawn/dusk period — sharks more active in low light',
}

const WHITE_SHARK_REASONS: Record<keyof WhiteSharkFactors, (value: number) => string> = {
  upwelling: (v) => v >= 0.7
    ? 'Cold water upwelling detected — attracts baitfish and white sharks'
    : 'Possible upwelling event — monitor sea temperature',
  temperature: () => 'Water temperature in white shark preferred range (15-22°C)',
  historical: () => 'This beach has a history of white shark encounters',
  season: () => 'White shark migration season along the NSW coast',
  detection: () => 'Tagged white shark recently detected in this area',
}

export function getDominantFactor(
  species: SharkSpecies,
  bullFactors: BullSharkFactors,
  whiteFactors: WhiteSharkFactors
): DominantFactor {
  if (species === 'bull') {
    return findDominantBull(bullFactors)
  }
  return findDominantWhite(whiteFactors)
}

function findDominantBull(factors: BullSharkFactors): DominantFactor {
  const entries: Array<[string, number, number]> = [
    ['rainfall', factors.rainfall, BULL_SHARK_WEIGHTS.rainfall],
    ['discharge', factors.discharge, BULL_SHARK_WEIGHTS.discharge],
    ['estuary', factors.estuary, BULL_SHARK_WEIGHTS.estuary],
    ['temperature', factors.temperature, BULL_SHARK_WEIGHTS.temperature],
    ['visibility', factors.visibility, BULL_SHARK_WEIGHTS.visibility],
    ['time', factors.time, BULL_SHARK_WEIGHTS.time],
  ]
  return pickDominant(entries, BULL_SHARK_REASONS as FactorReasons, factors as unknown as Record<string, number>)
}

function findDominantWhite(factors: WhiteSharkFactors): DominantFactor {
  const entries: Array<[string, number, number]> = [
    ['upwelling', factors.upwelling, WHITE_SHARK_WEIGHTS.upwelling],
    ['temperature', factors.temperature, WHITE_SHARK_WEIGHTS.temperature],
    ['historical', factors.historical, WHITE_SHARK_WEIGHTS.historical],
    ['season', factors.season, WHITE_SHARK_WEIGHTS.season],
    ['detection', factors.detection, WHITE_SHARK_WEIGHTS.detection],
  ]
  return pickDominant(entries, WHITE_SHARK_REASONS as FactorReasons, factors as unknown as Record<string, number>)
}

const TYPE_MAP: Record<string, DominantFactor['type']> = {
  rainfall: 'rainfall',
  discharge: 'discharge',
  estuary: 'estuary',
  temperature: 'temperature',
  visibility: 'visibility',
  time: 'time',
  upwelling: 'upwelling',
  detection: 'detection',
  season: 'season',
  historical: 'historical',
}

function pickDominant(
  entries: Array<[string, number, number]>,
  reasons: FactorReasons,
  factors: Record<string, number>
): DominantFactor {
  let maxWeighted = -1
  let dominantKey = entries[0][0]

  for (const [key, value, weight] of entries) {
    const weighted = value * weight
    if (weighted > maxWeighted) {
      maxWeighted = weighted
      dominantKey = key
    }
  }

  return {
    type: TYPE_MAP[dominantKey] ?? 'rainfall',
    reason: reasons[dominantKey](factors[dominantKey]),
    weight: maxWeighted,
  }
}
