export type RiskLevel = 'GREEN' | 'AMBER' | 'RED'
export type SharkSpecies = 'bull' | 'white'

export interface Beach {
  id: string
  name: string
  shortName: string
  lat: number
  lng: number
  estuaryDistanceKm: number
  estuaryName: string
  waterNswGaugeId: string | null
  historicalIncidents: {
    total: number
    bull: number
    white: number
    lastIncidentDate: string | null
    lastIncidentSpecies: SharkSpecies | null
  }
  /** Baseline seasonal discharge in ML/day for the associated gauge */
  baselineDischarge: number
}

export interface WeatherData {
  rainfall72hr: number
  currentTemp: number
  windSpeed: number
  windDirection: number
  precipitationForecast: number[]
  hourlyRainfall: number[]
}

export interface MarineData {
  sst: number
  waveHeight: number
  wavePeriod: number
  swellHeight: number
  swellPeriod: number
  /** SST at an offshore point for upwelling detection */
  offshoreSst: number | null
}

export interface DischargeData {
  currentDischarge: number
  baselineDischarge: number
}

export interface SunMoonData {
  sunriseHour: number
  sunsetHour: number
  moonPhase: number
  moonPhaseName: string
}

export interface EnvironmentalData {
  weather: WeatherData
  marine: MarineData
  discharge: DischargeData
  sunMoon: SunMoonData
  fetchedAt: number
}

export interface DominantFactor {
  type: 'rainfall' | 'discharge' | 'estuary' | 'temperature' | 'visibility' | 'time' | 'upwelling' | 'detection' | 'season' | 'historical'
  reason: string
  weight: number
}

export interface RiskResult {
  score: number
  level: RiskLevel
  species: SharkSpecies
  bullScore: number
  whiteScore: number
  reason: string
  clearance: string | null
  dominantFactor: DominantFactor
}
