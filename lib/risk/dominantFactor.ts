import type { DominantFactor, SharkSpecies } from '@/lib/types'
import type { BullSharkFactors } from './bullSharkRisk'
import type { WhiteSharkFactors } from './whiteSharkRisk'
import { BULL_SHARK_WEIGHTS } from './bullSharkRisk'
import { WHITE_SHARK_WEIGHTS } from './whiteSharkRisk'

type FactorReasons = { [key: string]: (value: number) => string }

const BULL_SHARK_REASONS: Record<keyof BullSharkFactors, (value: number) => string> = {
  rainfall: (v) => v >= 0.7
    ? 'Heavy rain recently — rain flushes sharks from rivers into the ocean near beaches'
    : 'Some recent rain — runoff can draw sharks closer to shore',
  discharge: (v) => v >= 0.7
    ? 'Rivers flowing well above normal — sharks leave rivers in large numbers after rain'
    : 'River flow above normal after rain',
  estuary: () => 'Near a lagoon or river outlet where sharks enter the ocean after rain',
  temperature: (v) => v >= 0.7
    ? 'Warm water makes bull sharks more active in this area'
    : 'Water temperature is in the range where bull sharks are active',
  visibility: () => 'Murky water — sharks can hunt by sensing electrical fields even when visibility is poor',
  time: () => 'Dawn or dusk — sharks are more active in low light',
  tidal_state: () => 'High tide — sharks can move closer to shore',
  detection: () => 'A tagged shark was recently detected near this beach',
}

const WHITE_SHARK_REASONS: Record<keyof WhiteSharkFactors, (value: number) => string> = {
  upwelling: (v) => v >= 0.7
    ? 'Cold water pushing up from the deep — this attracts baitfish and the sharks that follow them'
    : 'Possible cold water upwelling — this can attract sharks over the coming days',
  temperature: () => 'Water temperature is in the range preferred by white sharks (14-22°C)',
  historical: () => 'This beach has a history of white shark encounters',
  season: () => 'White sharks migrate through NSW waters this time of year',
  detection: () => 'A tagged white shark was recently detected near this beach',
  tidal_state: () => 'High tide — sharks can move into shallower water near shore',
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
    ['tidal_state', factors.tidal_state, BULL_SHARK_WEIGHTS.tidal_state],
    ['detection', factors.detection, BULL_SHARK_WEIGHTS.detection],
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
    ['tidal_state', factors.tidal_state, WHITE_SHARK_WEIGHTS.tidal_state],
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
  tidal_state: 'tidal_state',
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
