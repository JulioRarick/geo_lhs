'use client'

import SingleMap from './single-map'
import { MapContainer as LeafletMapContainer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MapType } from './map-list'
import dynamic from 'next/dynamic'

interface MapComponentPageProps {
  title: string;
  mapa: MapType
}

const ReactLeafletTileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

export function MapComponentPage({ title, mapa }: MapComponentPageProps) {
  return (
    <section className="w-11/12 h-11/12 bg-white rounded-lg overflow-hidden shadow-lg border-2 border-gray-300">
      <article className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="w-full min-h-min h-20 text-center flex items-center justify-center text-2xl tracking-tight font-semibold bg-white p-2">
          {title}
        </h1>
        <div style={{ height: '100%', width: '100%' }}>
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
      </article>
    </section>
  )
}
