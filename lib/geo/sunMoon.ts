import SunCalc from 'suncalc'
import type { SunMoonData } from '@/lib/types'

const MOON_PHASE_NAMES = [
  'New Moon',
  'Waxing Crescent',
  'First Quarter',
  'Waxing Gibbous',
  'Full Moon',
  'Waning Gibbous',
  'Last Quarter',
  'Waning Crescent',
] as const

export function getSunMoonData(lat: number, lng: number, date: Date = new Date()): SunMoonData {
  const times = SunCalc.getTimes(date, lat, lng)
  const moonIllum = SunCalc.getMoonIllumination(date)

  const sunriseHour = times.sunrise.getHours() + times.sunrise.getMinutes() / 60
  const sunsetHour = times.sunset.getHours() + times.sunset.getMinutes() / 60

  // Moon phase: 0 = new moon, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter
  const phaseIndex = Math.round(moonIllum.phase * 8) % 8

  return {
    sunriseHour,
    sunsetHour,
    moonPhase: moonIllum.phase,
    moonPhaseName: MOON_PHASE_NAMES[phaseIndex],
  }
}

export function formatSunrise(sunriseHour: number): string {
  const h = Math.floor(sunriseHour)
  const m = Math.round((sunriseHour - h) * 60)
  const period = h >= 12 ? 'pm' : 'am'
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${displayH}:${m.toString().padStart(2, '0')}${period}`
}

export function formatSunset(sunsetHour: number): string {
  return formatSunrise(sunsetHour)
}
