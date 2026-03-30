'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Beach, RiskLevel } from '@/lib/types'
import estuariesData from '@/data/estuaries.json'
import drumlinesData from '@/data/drumlines.json'
import listeningStationsData from '@/data/listening-stations.json'

interface BeachMapProps {
  beach: Beach
  riskLevel: RiskLevel
}

const RISK_COLORS: Record<RiskLevel, string> = {
  GREEN: '#34D399',
  AMBER: '#FBBF24',
  RED: '#F87171',
}

const RISK_GLOWS: Record<RiskLevel, string> = {
  GREEN: 'rgba(52, 211, 153, 0.4)',
  AMBER: 'rgba(251, 191, 36, 0.4)',
  RED: 'rgba(248, 113, 113, 0.4)',
}

const TILE_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'

function createBeachMarker(color: string, glowColor: string): HTMLElement {
  const el = document.createElement('div')
  el.style.width = '12px'
  el.style.height = '12px'
  el.style.borderRadius = '50%'
  el.style.backgroundColor = color
  el.style.boxShadow = `0 0 8px ${glowColor}`
  el.style.animation = 'pulse-dot 2s ease-in-out infinite'
  return el
}

function createSmallDot(bg: string, border: string): HTMLElement {
  const el = document.createElement('div')
  el.style.width = '8px'
  el.style.height = '8px'
  el.style.borderRadius = '50%'
  el.style.backgroundColor = bg
  el.style.border = `1px solid ${border}`
  el.style.opacity = '0.7'
  return el
}

export function BeachMap({ beach, riskLevel }: BeachMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: TILE_STYLE,
      center: [beach.lng, beach.lat],
      zoom: 14,
      attributionControl: false,
    })

    // Minimal attribution
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left')

    map.on('load', () => {
      // Beach marker with pulse
      const markerEl = createBeachMarker(RISK_COLORS[riskLevel], RISK_GLOWS[riskLevel])
      new maplibregl.Marker({ element: markerEl })
        .setLngLat([beach.lng, beach.lat])
        .addTo(map)

      // Estuary polygons
      const beachEstuaries = {
        ...estuariesData,
        features: (estuariesData as GeoJSON.FeatureCollection).features.filter(
          (f) => f.properties?.beachId === beach.id
        ),
      }

      if (beachEstuaries.features.length > 0) {
        map.addSource('estuaries', {
          type: 'geojson',
          data: beachEstuaries as GeoJSON.FeatureCollection,
        })

        map.addLayer({
          id: 'estuary-fill',
          type: 'fill',
          source: 'estuaries',
          paint: {
            'fill-color': '#0F1D32',
            'fill-opacity': 0.4,
          },
        })

        map.addLayer({
          id: 'estuary-outline',
          type: 'line',
          source: 'estuaries',
          paint: {
            'line-color': '#60A5FA',
            'line-width': 1.5,
            'line-opacity': 0.6,
          },
        })
      }

      // Drumline markers
      const nearbyDrumlines = drumlinesData.filter((d) => d.beachId === beach.id)
      for (const dl of nearbyDrumlines) {
        new maplibregl.Marker({ element: createSmallDot('#FBBF24', '#78350F') })
          .setLngLat([dl.lng, dl.lat])
          .addTo(map)
      }

      // Listening station markers
      const nearbyStations = listeningStationsData.filter((s) => s.nearestBeachId === beach.id)
      for (const st of nearbyStations) {
        new maplibregl.Marker({ element: createSmallDot('#8B8B9E', '#4A4A5E') })
          .setLngLat([st.lng, st.lat])
          .addTo(map)
      }
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [beach.id, beach.lat, beach.lng, beach.name, riskLevel])

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 mx-6 my-4">
      <div ref={mapContainer} className="h-52 w-full" />
      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-gray-100/80 backdrop-blur-sm rounded-md px-2.5 py-1.5 space-y-1">
        <LegendItem color={RISK_COLORS[riskLevel]} label="Beach" round />
        <LegendItem color="#60A5FA" label="Estuary" />
        <LegendItem color="#FBBF24" label="Drumline" round />
        <LegendItem color="#8B8B9E" label="Listener" round />
      </div>
    </div>
  )
}

function LegendItem({ color, label, round }: { color: string; label: string; round?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`inline-block w-2 h-2 ${round ? 'rounded-full' : 'rounded-[2px]'}`}
        style={{ backgroundColor: color, opacity: label === 'Estuary' ? 0.6 : 1 }}
      />
      <span className="text-[11px] uppercase tracking-[0.03em] font-medium text-gray-500">
        {label}
      </span>
    </div>
  )
}
