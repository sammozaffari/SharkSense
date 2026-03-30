/**
 * Generate a fan-shaped GeoJSON polygon representing a river discharge plume.
 * The plume extends seaward from an estuary centroid.
 */
export function generatePlume(
  centroid: [number, number],
  bearingDeg: number,
  dischargeRatio: number,
): GeoJSON.FeatureCollection {
  // Scale extent by discharge ratio
  // ratio 1-2: ~500m, 2-5: ~1km, 5+: ~2km
  const extentKm = dischargeRatio >= 5 ? 2.0
    : dischargeRatio >= 2 ? 1.0
    : 0.5

  // Fan spread: 45 degrees on each side of bearing
  const spreadDeg = 45
  const steps = 12

  const [lng, lat] = centroid
  const coords: [number, number][] = [[lng, lat]]

  for (let i = 0; i <= steps; i++) {
    const angle = bearingDeg - spreadDeg + (2 * spreadDeg * i / steps)
    const rad = (angle * Math.PI) / 180

    // Approximate degrees per km at this latitude
    const latPerKm = 1 / 111.32
    const lngPerKm = 1 / (111.32 * Math.cos((lat * Math.PI) / 180))

    const dLat = extentKm * Math.cos(rad) * latPerKm
    const dLng = extentKm * Math.sin(rad) * lngPerKm

    coords.push([lng + dLng, lat + dLat])
  }

  coords.push([lng, lat]) // close the polygon

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coords],
        },
        properties: { dischargeRatio },
      },
    ],
  }
}
