const STORAGE_KEY = 'sharksense:favourites'

export function getFavourites(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function toggleFavourite(id: string): string[] {
  const current = getFavourites()
  const next = current.includes(id)
    ? current.filter((fav) => fav !== id)
    : [...current, id]

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // localStorage full or unavailable
  }

  return next
}

export function isFavourite(id: string): boolean {
  return getFavourites().includes(id)
}
