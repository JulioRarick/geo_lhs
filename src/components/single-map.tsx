import React from 'react'
import type { GeoJsonObject } from 'geojson'
import dynamic from 'next/dynamic'

export interface MapType {
  id: string;
  nome: string;
  url: string;
  latitude?: number;
  longitude?: number;
  geoJsonData?: GeoJsonObject;
}

interface SingleMapProps {
  mapa: MapType;
}

const SingleMap: React.FC<SingleMapProps> = ({ mapa }) => {
  const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
  )

  const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
  )

  const GeoJSON = dynamic(
    () => import('react-leaflet').then((mod) => mod.GeoJSON),
    { ssr: false }
  )

  if (mapa.geoJsonData && GeoJSON) {
    return <GeoJSON key={mapa.id} data={mapa.geoJsonData} />
  }

  if (
    mapa.latitude !== undefined && mapa.longitude !==
    undefined && mapa.nome && Marker && Popup) {
    return (
      <Marker key={mapa.id} position={[mapa.latitude, mapa.longitude]}>
        <Popup>{mapa.nome}</Popup>
      </Marker>
    )
  }

  return null
}

export default SingleMap
