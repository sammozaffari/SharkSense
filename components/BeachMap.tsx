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
  GREEN: '#22c55e',
  AMBER: '#f59e0b',
  RED: '#ef4444',
}

// Free tile source — no API key required
const TILE_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

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

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left')

    map.on('load', () => {
      // Beach marker
      new maplibregl.Marker({
        color: RISK_COLORS[riskLevel],
      })
        .setLngLat([beach.lng, beach.lat])
        .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(
          `<strong style="color:#000">${beach.name}</strong>`
        ))
        .addTo(map)

      // Estuary polygons — filter to this beach
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
            'fill-color': '#3b82f6',
            'fill-opacity': 0.25,
          },
        })

        map.addLayer({
          id: 'estuary-outline',
          type: 'line',
          source: 'estuaries',
          paint: {
            'line-color': '#60a5fa',
            'line-width': 2,
          },
        })
      }

      // Drumline markers — filter near this beach
      const nearbyDrumlines = drumlinesData.filter(
        (d) => d.beachId === beach.id
      )
      for (const dl of nearbyDrumlines) {
        const el = document.createElement('div')
        el.style.width = '10px'
        el.style.height = '10px'
        el.style.borderRadius = '50%'
        el.style.backgroundColor = '#facc15'
        el.style.border = '1.5px solid #a16207'

        new maplibregl.Marker({ element: el })
          .setLngLat([dl.lng, dl.lat])
          .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(
            `<span style="color:#000;font-size:12px">${dl.name}</span>`
          ))
          .addTo(map)
      }

      // Listening station markers — filter near this beach
      const nearbyStations = listeningStationsData.filter(
        (s) => s.nearestBeachId === beach.id
      )
      for (const st of nearbyStations) {
        const el = document.createElement('div')
        el.style.width = '8px'
        el.style.height = '8px'
        el.style.borderRadius = '2px'
        el.style.backgroundColor = '#a78bfa'
        el.style.border = '1.5px solid #7c3aed'

        new maplibregl.Marker({ element: el })
          .setLngLat([st.lng, st.lat])
          .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(
            `<span style="color:#000;font-size:12px">${st.name}</span>`
          ))
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
    <div className="relative">
      <div ref={mapContainer} className="h-56 w-full" />
      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-slate-900/80 rounded px-2 py-1 text-[10px] space-y-0.5">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: RISK_COLORS[riskLevel] }} />
          <span className="text-slate-300">Beach</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-sm bg-blue-500 opacity-60" />
          <span className="text-slate-300">Estuary</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400" />
          <span className="text-slate-300">Drumline</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-sm bg-violet-400" />
          <span className="text-slate-300">Listener</span>
        </div>
      </div>
    </div>
  )
}
