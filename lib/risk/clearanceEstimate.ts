import type { DominantFactor, WeatherData } from '@/lib/types'

export function estimateClearance(
  dominantFactor: DominantFactor,
  weather: WeatherData
): string | null {
  if (dominantFactor.type === 'rainfall' || dominantFactor.type === 'discharge' || dominantFactor.type === 'visibility') {
    // Check if more rain is forecast (sum next 48 hours)
    const forecastSum = weather.precipitationForecast
      .slice(0, 48)
      .reduce((sum, v) => sum + v, 0)

    if (forecastSum > 20) {
      return 'More rain forecast — risk likely to remain elevated'
    }

    // Estimate clearance: ~1 day per 50mm of rainfall
    // Marine ecologist stated "up to a week after heavy rain"
    const estimatedDays = Math.max(1, Math.ceil(weather.rainfall72hr / 50))
    const clearDate = new Date()
    clearDate.setDate(clearDate.getDate() + estimatedDays)

    const dayName = clearDate.toLocaleDateString('en-AU', { weekday: 'long' })
    return `Conditions likely to improve: ~${dayName}`
  }

  if (dominantFactor.type === 'upwelling') {
    return 'Upwelling event in progress — monitor SST for normalisation'
  }

  if (dominantFactor.type === 'detection') {
    return 'Tagged shark recently detected — risk reduces with time and distance'
  }

  if (dominantFactor.type === 'temperature') {
    return 'Water temperature elevated — risk eases as conditions cool'
  }

  if (dominantFactor.type === 'estuary') {
    return 'Proximity to river mouth is a persistent risk factor at this beach'
  }

  return null
}
