const DEFAULT_TTL = 30 * 60 * 1000 // 30 minutes

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export function getCached<T>(key: string): { data: T; age: number } | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = localStorage.getItem(`sharksense:${key}`)
    if (!raw) return null

    const entry: CacheEntry<T> = JSON.parse(raw)
    const age = Date.now() - entry.timestamp

    if (age > entry.ttl) {
      localStorage.removeItem(`sharksense:${key}`)
      return null
    }

    return { data: entry.data, age }
  } catch {
    return null
  }
}

export function setCached<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  if (typeof window === 'undefined') return

  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttl,
  }

  try {
    localStorage.setItem(`sharksense:${key}`, JSON.stringify(entry))
  } catch {
    // localStorage full or unavailable — fail silently
  }
}
