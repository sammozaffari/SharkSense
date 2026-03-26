import { describe, it, expect } from 'vitest'
import { calculateRisk } from '../combinedRisk'
import type { Beach, EnvironmentalData } from '@/lib/types'

// Helper to build a beach with overrides
function makeBeach(overrides: Partial<Beach> = {}): Beach {
  return {
    id: 'test',
    name: 'Test Beach',
    shortName: 'Test',
    lat: -33.8,
    lng: 151.3,
    estuaryDistanceKm: 3,
    estuaryName: 'Test Estuary',
    waterNswGaugeId: null,
    historicalIncidents: { total: 5, bull: 3, white: 2, lastIncidentDate: null, lastIncidentSpecies: null },
    baselineDischarge: 50,
    ...overrides,
  }
}

// Helper to build env data with overrides
function makeEnv(overrides: {
  rainfall72hr?: number
  sst?: number
  offshoreSst?: number | null
  windSpeed?: number
  windDirection?: number
  currentDischarge?: number
  baselineDischarge?: number
  precipitationForecast?: number[]
} = {}): EnvironmentalData {
  return {
    weather: {
      rainfall72hr: overrides.rainfall72hr ?? 0,
      currentTemp: 22,
      windSpeed: overrides.windSpeed ?? 10,
      windDirection: overrides.windDirection ?? 180,
      precipitationForecast: overrides.precipitationForecast ?? new Array(168).fill(0),
      hourlyRainfall: [],
    },
    marine: {
      sst: overrides.sst ?? 20,
      waveHeight: 1.2,
      wavePeriod: 10,
      swellHeight: 1.0,
      swellPeriod: 12,
      offshoreSst: overrides.offshoreSst ?? null,
    },
    discharge: {
      currentDischarge: overrides.currentDischarge ?? 50,
      baselineDischarge: overrides.baselineDischarge ?? 50,
    },
    sunMoon: {
      sunriseHour: 6.2,
      sunsetHour: 18.5,
      moonPhase: 0.5,
      moonPhaseName: 'Full Moon',
    },
    fetchedAt: Date.now(),
  }
}

describe('Risk Scoring Algorithm', () => {
  describe('Scenario 1: January 18-20, 2026 — Sydney Attacks (should score RED)', () => {
    it('scores RED with heavy rain, high discharge, warm water, near estuary', () => {
      const beach = makeBeach({
        estuaryDistanceKm: 0.8, // Nielsen Park — close to harbour
        baselineDischarge: 120,
      })
      const env = makeEnv({
        rainfall72hr: 150,        // >100mm heavy rain
        sst: 25,                  // 24-27°C
        windSpeed: 20,            // onshore wind
        windDirection: 90,        // east (onshore for NSW)
        currentDischarge: 600,    // well above baseline
        baselineDischarge: 120,
      })

      const result = calculateRisk(beach, env)

      expect(result.level).toBe('RED')
      expect(result.score).toBeGreaterThanOrEqual(0.65)
      expect(result.species).toBe('bull')
      expect(result.reason).toContain('rain')
    })
  })

  describe('Scenario 2: Calm winter day, no recent rain (should score GREEN)', () => {
    it('scores GREEN with no rain, cool water, normal discharge', () => {
      const beach = makeBeach({
        estuaryDistanceKm: 5,
        baselineDischarge: 50,
      })
      const env = makeEnv({
        rainfall72hr: 0,
        sst: 17,                  // Below bull shark activity threshold
        windSpeed: 5,
        windDirection: 270,       // offshore
        currentDischarge: 50,     // at baseline
        baselineDischarge: 50,
      })

      const result = calculateRisk(beach, env)

      expect(result.level).toBe('GREEN')
      expect(result.score).toBeLessThan(0.35)
    })
  })

  describe('Scenario 3: Upwelling event, no rain (should score AMBER+ for white sharks)', () => {
    it('scores AMBER or RED with upwelling detected in white shark season', () => {
      const beach = makeBeach({
        estuaryDistanceKm: 8,
        historicalIncidents: { total: 6, bull: 1, white: 4, lastIncidentDate: null, lastIncidentSpecies: null },
      })
      const env = makeEnv({
        rainfall72hr: 0,
        sst: 17,                  // Cool inshore water (upwelling)
        offshoreSst: 22,          // 5°C drop = strong upwelling
        windSpeed: 10,
        windDirection: 270,
        currentDischarge: 50,
        baselineDischarge: 50,
      })

      const result = calculateRisk(beach, env)

      // White shark risk should dominate
      expect(result.whiteScore).toBeGreaterThan(result.bullScore)
      // Score should be at least AMBER
      expect(result.score).toBeGreaterThanOrEqual(0.35)
      expect(['AMBER', 'RED']).toContain(result.level)
    })
  })

  describe('Scenario 4: Light rain, warm water, near estuary (should score AMBER)', () => {
    it('scores AMBER with moderate rain near river mouth at dawn', () => {
      const beach = makeBeach({
        estuaryDistanceKm: 0.8, // Close to river mouth
        baselineDischarge: 50,
      })
      const env = makeEnv({
        rainfall72hr: 40,         // Below 100mm but non-trivial
        sst: 22,                  // Warm
        windSpeed: 12,
        windDirection: 45,        // onshore NE
        currentDischarge: 80,     // Slightly above baseline
        baselineDischarge: 50,
      })

      const result = calculateRisk(beach, env)

      expect(result.level).toBe('AMBER')
      expect(result.score).toBeGreaterThanOrEqual(0.35)
      expect(result.score).toBeLessThan(0.65)
      expect(result.species).toBe('bull')
    })
  })
})
