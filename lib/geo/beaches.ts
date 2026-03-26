import type { Beach } from '@/lib/types'
import beachData from '@/data/beaches.json'

export const beaches: Beach[] = beachData as Beach[]

export function getBeachById(id: string): Beach | undefined {
  return beaches.find(b => b.id === id)
}

export const DEFAULT_BEACH_ID = 'manly'
