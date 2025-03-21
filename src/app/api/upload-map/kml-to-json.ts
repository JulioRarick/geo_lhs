import { FeatureCollection, Feature, Geometry, GeoJsonProperties } from 'geojson'

export async function kmlToGeoJSON(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  kmlData: Record<string, any>
): Promise<FeatureCollection | null> {
  try {
    const features: Feature<Geometry, GeoJsonProperties>[] = []
    const placemarks =
      kmlData?.kml?.Document?.Placemark || kmlData?.kml?.Placemark
    const placemarksArray =
      Array.isArray(placemarks) ? placemarks : [placemarks]

    for (const placemark of placemarksArray) {
      if (placemark?.Point?.coordinates) {
        const coords = placemark.Point.coordinates.split(',').map(Number)
        if (coords.length >= 2) {
          features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [coords[0], coords[1]],
            },
            properties: {
              name: placemark.name || '',
              description: placemark.description || '',
            },
          })
        }
      } else if (placemark?.LineString?.coordinates) {
        const coords = placemark.LineString.coordinates.trim().split(/\s+/).map((coordPair: string) => coordPair.split(',').map(Number))
        features.push({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coords.map((c: number[]) => [c[0], c[1]]),
          },
          properties: {
            name: placemark.name || '',
            description: placemark.description || '',
          },
        })
      } else if (placemark?.Polygon?.outerBoundaryIs?.LinearRing?.coordinates) {
        const coords = placemark.Polygon.outerBoundaryIs.LinearRing.coordinates.trim().split(/\s+/).map((coordPair: string) => coordPair.split(',').map(Number))
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [coords.map((c: number[]) => [c[0], c[1]])],
          },
          properties: {
            name: placemark.name || '',
            description: placemark.description || '',
          },
        })
      }
    }

    return {
      type: 'FeatureCollection',
      features,
    }
  } catch (error) {
    console.error('Erro na conversão de KML para GeoJSON:', error)
    return null
  }
}
