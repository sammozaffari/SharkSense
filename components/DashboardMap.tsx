'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Beach, RiskLevel } from '@/lib/types'

const TILE_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
const SST_GRID_URL = '/api/sst'

const RISK_COLORS: Record<RiskLevel, string> = {
  GREEN: '#34D399',
  AMBER: '#FBBF24',
  RED: '#F87171',
}

// SST color stops: [temp, r, g, b]
const SST_STOPS: Array<[number, number, number, number]> = [
  [14, 43, 10, 130],    // deep purple
  [16, 30, 68, 176],    // blue
  [18, 33, 150, 164],   // teal
  [20, 26, 152, 80],    // green
  [22, 145, 207, 96],   // light green
  [23, 254, 224, 139],  // yellow
  [24, 252, 141, 89],   // orange
  [26, 215, 48, 39],    // red
]

function sstToRgb(sst: number): [number, number, number] {
  if (sst <= SST_STOPS[0][0]) return [SST_STOPS[0][1], SST_STOPS[0][2], SST_STOPS[0][3]]
  if (sst >= SST_STOPS[SST_STOPS.length - 1][0]) {
    const last = SST_STOPS[SST_STOPS.length - 1]
    return [last[1], last[2], last[3]]
  }
  for (let i = 0; i < SST_STOPS.length - 1; i++) {
    const [t0, r0, g0, b0] = SST_STOPS[i]
    const [t1, r1, g1, b1] = SST_STOPS[i + 1]
    if (sst >= t0 && sst <= t1) {
      const f = (sst - t0) / (t1 - t0)
      return [
        Math.round(r0 + f * (r1 - r0)),
        Math.round(g0 + f * (g1 - g0)),
        Math.round(b0 + f * (b1 - b0)),
      ]
    }
  }
  return [128, 128, 128]
}

interface SstGrid {
  lats: number[]
  lngs: number[]
  values: (number | null)[][] // [latIdx][lngIdx]
  bounds: { north: number; south: number; east: number; west: number }
}

function parseSstGrid(json: { table: { columnNames: string[]; rows: unknown[][] } }): SstGrid {
  const { columnNames, rows } = json.table
  const latIdx = columnNames.indexOf('latitude')
  const lngIdx = columnNames.indexOf('longitude')
  const sstIdx = columnNames.indexOf('analysed_sst')

  const latSet = new Set<number>()
  const lngSet = new Set<number>()
  const dataMap = new Map<string, number>()

  for (const row of rows) {
    const lat = row[latIdx] as number
    const lng = row[lngIdx] as number
    const sst = row[sstIdx] as number | null
    latSet.add(lat)
    lngSet.add(lng)
    if (sst !== null && sst !== undefined) {
      dataMap.set(`${lat},${lng}`, sst)
    }
  }

  const lats = Array.from(latSet).sort((a, b) => b - a) // north to south
  const lngs = Array.from(lngSet).sort((a, b) => a - b) // west to east

  const values: (number | null)[][] = lats.map(lat =>
    lngs.map(lng => dataMap.get(`${lat},${lng}`) ?? null)
  )

  return {
    lats, lngs, values,
    bounds: {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
    },
  }
}

function bilinearInterpolate(grid: SstGrid, lat: number, lng: number): number | null {
  const { lats, lngs, values } = grid

  const latStep = lats.length > 1 ? lats[0] - lats[1] : 1
  const lngStep = lngs.length > 1 ? lngs[1] - lngs[0] : 1

  const latIdx0 = Math.floor((lats[0] - lat) / latStep)
  const lngIdx0 = Math.floor((lng - lngs[0]) / lngStep)

  if (latIdx0 < 0 || latIdx0 >= lats.length - 1) return null
  if (lngIdx0 < 0 || lngIdx0 >= lngs.length - 1) return null

  const v00 = values[latIdx0][lngIdx0]
  const v01 = values[latIdx0][lngIdx0 + 1]
  const v10 = values[latIdx0 + 1][lngIdx0]
  const v11 = values[latIdx0 + 1][lngIdx0 + 1]

  // Only render where ALL 4 corners are ocean
  // This keeps the edge tight to the last full-ocean grid cell
  if (v00 === null || v01 === null || v10 === null || v11 === null) return null

  const fLat = (lats[latIdx0] - lat) / (lats[latIdx0] - lats[latIdx0 + 1])
  const fLng = (lng - lngs[lngIdx0]) / (lngs[lngIdx0 + 1] - lngs[lngIdx0])

  return v00 * (1 - fLat) * (1 - fLng) +
         v01 * (1 - fLat) * fLng +
         v10 * fLat * (1 - fLng) +
         v11 * fLat * fLng
}

// Second pass: Gaussian blur the alpha channel to soften the edge
function blurAlpha(imageData: ImageData, width: number, height: number, radius: number) {
  const alpha = new Float32Array(width * height)
  const blurred = new Float32Array(width * height)

  // Extract alpha
  for (let i = 0; i < width * height; i++) {
    alpha[i] = imageData.data[i * 4 + 3]
  }

  // Horizontal blur
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0, count = 0
      for (let dx = -radius; dx <= radius; dx++) {
        const nx = x + dx
        if (nx >= 0 && nx < width) {
          sum += alpha[y * width + nx]
          count++
        }
      }
      blurred[y * width + x] = sum / count
    }
  }

  // Vertical blur into final
  const final = new Float32Array(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0, count = 0
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy
        if (ny >= 0 && ny < height) {
          sum += blurred[ny * width + x]
          count++
        }
      }
      final[y * width + x] = sum / count
    }
  }

  // Apply: ocean pixels keep full alpha, edge pixels get smoothed alpha
  // Land pixels (original=0) stay transparent unless surrounded by ocean
  for (let i = 0; i < width * height; i++) {
    const original = alpha[i]
    const smoothed = final[i]
    if (original > 0) {
      // Ocean pixel — use the smoothed value (slightly reduces alpha at edges)
      imageData.data[i * 4 + 3] = Math.round(Math.min(original, smoothed + original * 0.5))
    } else {
      // Land pixel — stay transparent (don't bleed into land)
      imageData.data[i * 4 + 3] = 0
    }
  }
}

function renderSstCanvas(grid: SstGrid, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  const imageData = ctx.createImageData(width, height)

  const { bounds } = grid

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const lat = bounds.north - (py / height) * (bounds.north - bounds.south)
      const lng = bounds.west + (px / width) * (bounds.east - bounds.west)

      const sst = bilinearInterpolate(grid, lat, lng)
      const idx = (py * width + px) * 4

      if (sst !== null) {
        const [r, g, b] = sstToRgb(sst)
        imageData.data[idx] = r
        imageData.data[idx + 1] = g
        imageData.data[idx + 2] = b
        imageData.data[idx + 3] = 200
      } else {
        imageData.data[idx + 3] = 0
      }
    }
  }

  // Blur the alpha channel to soften the coastline edge
  blurAlpha(imageData, width, height, 6)

  ctx.putImageData(imageData, 0, 0)
  return canvas
}

interface DashboardMapProps {
  beaches: Array<{ beach: Beach; level: RiskLevel }>
  selectedBeachId: string | null
  onSelectBeach: (beachId: string) => void
}

export function DashboardMap({ beaches, selectedBeachId, onSelectBeach }: DashboardMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Map<string, { marker: maplibregl.Marker; el: HTMLElement }>>(new Map())
  const [sstVisible, setSstVisible] = useState(true)
  const [sstLoaded, setSstLoaded] = useState(false)
  const [sstLoading, setSstLoading] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)

  const loadSst = useCallback(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded() || sstLoaded || sstLoading) return

    setSstLoading(true)

    fetch(SST_GRID_URL, { signal: AbortSignal.timeout(30000) })
      .then(r => {
        if (!r.ok) throw new Error(`API ${r.status}`)
        return r.json()
      })
      .then(json => {
        if (!json.table) throw new Error('Bad response')

        const grid = parseSstGrid(json)
        const canvas = renderSstCanvas(grid, grid.lngs.length * 6, grid.lats.length * 6)

        map.addSource('sst-image', {
          type: 'image',
          url: canvas.toDataURL('image/png'),
          coordinates: [
            [grid.bounds.west, grid.bounds.north],
            [grid.bounds.east, grid.bounds.north],
            [grid.bounds.east, grid.bounds.south],
            [grid.bounds.west, grid.bounds.south],
          ],
        })

        map.addLayer({
          id: 'sst-layer',
          type: 'raster',
          source: 'sst-image',
          paint: { 'raster-opacity': 0.6 },
          layout: { visibility: 'visible' },
        })

        const firstSymbol = map.getStyle().layers?.find(l => l.type === 'symbol')
        if (firstSymbol) map.moveLayer('sst-layer', firstSymbol.id)

        setSstLoaded(true)
        setSstLoading(false)
      })
      .catch(err => {
        console.error('SST load failed:', err)
        setSstLoading(false)
      })
  }, [sstLoaded, sstLoading])

  useEffect(() => {
    if (!mapContainer.current || beaches.length === 0) return

    const nbBeaches = beaches.filter(b => b.beach.lat > -34.0 && b.beach.lat < -33.4)
    const centerBeaches = nbBeaches.length > 0 ? nbBeaches : beaches
    const avgLat = centerBeaches.reduce((s, b) => s + b.beach.lat, 0) / centerBeaches.length
    const avgLng = centerBeaches.reduce((s, b) => s + b.beach.lng, 0) / centerBeaches.length

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: TILE_STYLE,
      center: [avgLng, avgLat],
      zoom: 10.5,
      attributionControl: false,
    })

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left')
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

    map.on('load', () => {
      // Add beach pins
      for (const { beach, level } of beaches) {
        const el = createPin(RISK_COLORS[level], beach.id === selectedBeachId, beach.shortName)
        el.addEventListener('click', (e) => {
          e.stopPropagation()
          onSelectBeach(beach.id)
        })
        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([beach.lng, beach.lat])
          .addTo(map)
        markersRef.current.set(beach.id, { marker, el })
      }

      // Load SST after style is fully loaded
      setTimeout(() => {
        if (!sstLoaded && !sstLoading) loadSst()
      }, 500)
    })

    mapRef.current = map
    return () => {
      markersRef.current.clear()
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beaches.map(b => b.beach.id).join(',')])

  // Load SST when toggled on
  useEffect(() => {
    if (sstVisible && !sstLoaded && !sstLoading) loadSst()
  }, [sstVisible, sstLoaded, sstLoading, loadSst])

  // Toggle visibility
  useEffect(() => {
    const map = mapRef.current
    if (!map || !sstLoaded) return
    try {
      map.setLayoutProperty('sst-layer', 'visibility', sstVisible ? 'visible' : 'none')
    } catch { /* not ready */ }
  }, [sstVisible, sstLoaded])

  // Pin highlight
  useEffect(() => {
    for (const [id, { el }] of markersRef.current) {
      const isSelected = id === selectedBeachId
      const dot = el.querySelector('div') as HTMLElement | null
      const label = el.querySelector('span') as HTMLElement | null
      el.style.zIndex = isSelected ? '10' : '1'
      if (dot) {
        dot.style.width = isSelected ? '16px' : '10px'
        dot.style.height = isSelected ? '16px' : '10px'
        dot.style.border = isSelected ? '2px solid white' : 'none'
        dot.style.boxShadow = isSelected ? '0 0 6px rgba(0,0,0,0.3)' : 'none'
      }
      if (label) {
        label.style.fontWeight = isSelected ? '600' : '500'
      }
    }
  }, [selectedBeachId])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {/* SST toggle + info button */}
      <div className="absolute top-3 left-3 flex gap-2">
        <button
          onClick={() => setSstVisible(!sstVisible)}
          className={`px-3 py-1.5 rounded text-xs font-medium shadow transition-colors ${
            sstVisible ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          {sstLoading ? 'Loading...' : sstVisible ? 'Sea Temp: ON' : 'Sea Temp: OFF'}
        </button>
        {sstVisible && sstLoaded && (
          <button
            onClick={() => setGuideOpen(!guideOpen)}
            className="px-2.5 py-1.5 rounded bg-white border border-gray-300 shadow text-xs text-gray-600 flex items-center gap-1.5"
          >
            <span className="font-bold">?</span>
            <span>What am I looking at?</span>
          </button>
        )}
      </div>

      {/* Legend (always visible when SST is on) */}
      {sstVisible && sstLoaded && (
        <div className="absolute bottom-8 right-3 bg-white/90 rounded px-3 py-2 shadow text-xs">
          <div className="flex items-center gap-1">
            <span className="text-gray-500">14°C</span>
            <div className="flex h-3 flex-1 rounded overflow-hidden" style={{ minWidth: '100px' }}>
              <div className="flex-1" style={{ background: '#2b0a82' }} />
              <div className="flex-1" style={{ background: '#1e44b0' }} />
              <div className="flex-1" style={{ background: '#2196a4' }} />
              <div className="flex-1" style={{ background: '#1a9850' }} />
              <div className="flex-1" style={{ background: '#91cf60' }} />
              <div className="flex-1" style={{ background: '#fee08b' }} />
              <div className="flex-1" style={{ background: '#fc8d59' }} />
              <div className="flex-1" style={{ background: '#d73027' }} />
            </div>
            <span className="text-gray-500">26°C+</span>
          </div>
          <p className="text-gray-400 mt-1">NOAA CoralTemp satellite (daily)</p>
        </div>
      )}

      {/* Upwelling guide panel */}
      {guideOpen && (
        <div className="absolute top-14 left-3 w-80 bg-white rounded-lg shadow-lg border border-gray-200 text-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Understanding Upwellings</h3>
            <button onClick={() => setGuideOpen(false)} className="text-gray-400 text-lg leading-none">&times;</button>
          </div>
          <div className="px-4 py-3 space-y-3 max-h-[60vh] overflow-y-auto">
            <div>
              <p className="font-medium text-gray-800">What is an upwelling?</p>
              <p className="text-gray-500 text-xs mt-1">
                When winds or currents push warm surface water away from the coast, cold, nutrient-rich water rises from the deep ocean to replace it. This shows as a <b className="text-blue-700">blue or purple patch</b> near the shore on this map.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-800">Why does it matter for sharks?</p>
              <p className="text-gray-500 text-xs mt-1">
                Upwelling triggers a food chain cascade: cold nutrient water &rarr; plankton bloom &rarr; baitfish aggregation &rarr; <b>white sharks follow the baitfish</b>. This process takes 7-14 days from the initial upwelling event to peak shark activity.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-800">What to look for</p>
              <div className="mt-1 space-y-1.5 text-xs text-gray-500">
                <div className="flex items-start gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0 mt-0.5" style={{ background: '#fc8d59' }} />
                  <span><b className="text-gray-700">Uniform warm colour</b> — normal conditions, no upwelling. Lower white shark risk.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0 mt-0.5" style={{ background: '#1a9850' }} />
                  <span><b className="text-gray-700">Cool green patches near shore</b> — possible early-stage upwelling. Monitor over coming days.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0 mt-0.5" style={{ background: '#1e44b0' }} />
                  <span><b className="text-gray-700">Blue/purple patches near shore</b> — active upwelling event. Significant temperature drop (3°C+). White shark risk elevated for 1-2 weeks.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0 mt-0.5" style={{ background: '#2b0a82' }} />
                  <span><b className="text-gray-700">Deep purple inshore</b> — strong upwelling. If inshore is 3°C+ colder than offshore, risk is high. This is what Bitemetrix monitors daily for white shark warnings.</span>
                </div>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-800">The 3°C rule</p>
              <p className="text-gray-500 text-xs mt-1">
                When the water near the beach is <b>3°C or more colder</b> than offshore water, that's a significant upwelling event. SharkSense automatically detects this and elevates the white shark risk score. Look for a sharp colour change between the coast and open ocean.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-800">Season matters</p>
              <p className="text-gray-500 text-xs mt-1">
                White sharks migrate through NSW waters primarily <b>May to November</b> (peak Sep-Nov). Upwelling events during these months carry the highest risk. Summer upwellings (Dec-Apr) are less concerning for white sharks but can still attract other species.
              </p>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-gray-400 text-xs">
                Data: NOAA CoralTemp satellite SST (5km resolution, updated daily).
                SharkSense compares inshore vs offshore temperatures automatically and factors this into the risk score.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function createPin(color: string, selected: boolean, name: string): HTMLElement {
  const wrapper = document.createElement('div')
  wrapper.style.display = 'flex'
  wrapper.style.alignItems = 'center'
  wrapper.style.gap = '4px'
  wrapper.style.cursor = 'pointer'
  wrapper.style.transition = 'all 150ms ease'
  wrapper.style.zIndex = selected ? '10' : '1'

  const dot = document.createElement('div')
  dot.style.width = selected ? '16px' : '10px'
  dot.style.height = selected ? '16px' : '10px'
  dot.style.borderRadius = '50%'
  dot.style.backgroundColor = color
  dot.style.flexShrink = '0'
  if (selected) {
    dot.style.border = '2px solid white'
    dot.style.boxShadow = '0 0 6px rgba(0,0,0,0.3)'
  }

  const label = document.createElement('span')
  label.textContent = name
  label.style.fontSize = '11px'
  label.style.fontWeight = selected ? '600' : '500'
  label.style.color = '#374151'
  label.style.whiteSpace = 'nowrap'
  label.style.textShadow = '0 0 3px white, 0 0 3px white, 0 0 3px white'

  wrapper.appendChild(dot)
  wrapper.appendChild(label)
  return wrapper
}
