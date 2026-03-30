'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { beaches } from '@/lib/geo/beaches'
import { fetchAllBeaches, type BeachRiskSummary } from '@/lib/data/fetchAllBeaches'
import { getFavourites, toggleFavourite } from '@/lib/favourites'
import { BeachCard, BeachCardSkeleton } from '@/components/BeachCard'
import { DashboardMap } from '@/components/DashboardMap'
import type { RiskLevel } from '@/lib/types'

export default function Home() {
  const [data, setData] = useState<Map<string, BeachRiskSummary | null>>(new Map())
  const [loading, setLoading] = useState(true)
  const [favourites, setFavourites] = useState<string[]>([])
  const [selectedBeachId, setSelectedBeachId] = useState<string | null>(null)
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  useEffect(() => {
    setFavourites(getFavourites())
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchAllBeaches(beaches).then((results) => {
      setData(results)
      setLoading(false)
    })
  }, [])

  const handleToggleFavourite = (beachId: string) => {
    const next = toggleFavourite(beachId)
    setFavourites(next)
  }

  const handleSelectBeach = useCallback((beachId: string) => {
    setSelectedBeachId(beachId)
    const el = cardRefs.current.get(beachId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  // Sort beaches by risk score (highest first)
  const rankedBeaches = [...beaches].sort((a, b) => {
    const aScore = data.get(a.id)?.risk.score ?? -1
    const bScore = data.get(b.id)?.risk.score ?? -1
    return bScore - aScore
  })

  const favouriteBeaches = rankedBeaches.filter((b) => favourites.includes(b.id))
  const otherBeaches = rankedBeaches.filter((b) => !favourites.includes(b.id))

  // Map pins data
  const mapBeaches = rankedBeaches
    .filter((b) => data.get(b.id))
    .map((b) => ({
      beach: b,
      level: (data.get(b.id)?.risk.level ?? 'GREEN') as RiskLevel,
    }))

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Ranked list */}
      <div className="md:w-[420px] md:min-w-[420px] md:h-screen md:overflow-y-auto pb-12">
        <div className="px-4 pt-8 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">SharkSense</h1>
          <p className="mt-1 text-sm text-gray-500">
            {beaches.length} beaches ranked by risk
          </p>
        </div>

        <div className="px-4 space-y-2">
          {loading && beaches.slice(0, 5).map((b) => <BeachCardSkeleton key={b.id} />)}

          {!loading && favouriteBeaches.length > 0 && (
            <>
              <p className="text-xs uppercase tracking-wide font-medium text-gray-400 pt-1 pb-1">
                Your spots
              </p>
              {favouriteBeaches.map((beach) => (
                <div
                  key={beach.id}
                  ref={(el) => { if (el) cardRefs.current.set(beach.id, el) }}
                  className={`transition-all duration-200 rounded-lg ${selectedBeachId === beach.id ? 'ring-2 ring-blue-400' : ''}`}
                  onClick={() => setSelectedBeachId(beach.id)}
                >
                  <BeachCard
                    beach={beach}
                    summary={data.get(beach.id) ?? null}
                    isFavourite={true}
                    onToggleFavourite={handleToggleFavourite}
                  />
                </div>
              ))}
              <p className="text-xs uppercase tracking-wide font-medium text-gray-400 pt-3 pb-1">
                All beaches
              </p>
            </>
          )}

          {!loading &&
            (favouriteBeaches.length > 0 ? otherBeaches : rankedBeaches).map((beach) => (
              <div
                key={beach.id}
                ref={(el) => { if (el) cardRefs.current.set(beach.id, el) }}
                className={`transition-all duration-200 rounded-lg ${selectedBeachId === beach.id ? 'ring-2 ring-blue-400' : ''}`}
                onMouseEnter={() => setSelectedBeachId(beach.id)}
              >
                <BeachCard
                  beach={beach}
                  summary={data.get(beach.id) ?? null}
                  isFavourite={favourites.includes(beach.id)}
                  onToggleFavourite={handleToggleFavourite}
                />
              </div>
            ))
          }
        </div>

        <div className="px-4 mt-8">
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            SharkSense provides environmental information to help you make informed
            decisions about ocean use. Risk is never zero. Always follow official beach
            closures and lifeguard advice.
          </p>
        </div>
      </div>

      {/* Right: Map (hidden on mobile until loaded, shown as top section on mobile) */}
      <div className="order-first md:order-last md:flex-1 h-[300px] md:h-screen md:sticky md:top-0">
        {!loading && mapBeaches.length > 0 && (
          <DashboardMap
            beaches={mapBeaches}
            selectedBeachId={selectedBeachId}
            onSelectBeach={handleSelectBeach}
          />
        )}
        {loading && (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <p className="text-sm text-gray-400">Loading map...</p>
          </div>
        )}
      </div>
    </div>
  )
}
