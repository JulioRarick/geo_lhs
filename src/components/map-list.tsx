'use client'

import React, { JSX, useEffect, useState } from 'react'
import { MapContainer as LeafletMapContainer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { GeoJsonObject } from 'geojson'
import dynamic from 'next/dynamic'
import SingleMap from './single-map'

export interface MapType {
  id: string;
  nome: string;
  url: string;
  latitude?: number;
  longitude?: number;
  geoJsonData?: GeoJsonObject;
}
export interface MapListProps {
  mapas: MapType[];
}

const ReactLeafletTileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

export function MapList({ mapas }: MapListProps): JSX.Element | null {
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false)

  useEffect(() => {
    import('leaflet').then((L) => {
      const DefaultIcon = new L.Icon({
        iconUrl: '/images/marker-icon.png',
        shadowUrl: '/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      L.Marker.prototype.options.icon = DefaultIcon
      setIsLeafletLoaded(true)
    })
  }, [])

  if (!isLeafletLoaded) {
    return <div>Carregando mapas...</div>
  }

  if (!mapas || !Array.isArray(mapas) || mapas.length === 0) {
    return <div>Nenhum mapa para exibir.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {mapas.map((mapa) => (
        <div key={mapa.id} className="bg-gray-100 rounded drop-shadow-lg overflow-hidden">
          <h3 className="p-2 font-semibold text-center">{mapa.nome}</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <LeafletMapContainer
              center={
                mapa.latitude && mapa.longitude
                  ? [mapa.latitude, mapa.longitude]
                  : [0, 0]
              }
              zoom={mapa.latitude && mapa.longitude ? 10 : 2}
              style={{ height: '100%', width: '100%' }}
            >
              <ReactLeafletTileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <SingleMap mapa={mapa} />
            </LeafletMapContainer>
          </div>
        </div>
      ))}
    </div>
  )
}
