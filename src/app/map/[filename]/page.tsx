// map/[filename].tsx (Página)
'use client'

import React, { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MapType } from '@/components/single-map'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'

const MapComponentPage = dynamic(
  () => import('@/components/map-component-page').then((mod) => mod.MapComponentPage),
  { ssr: false }
)

export default function Map() {
  const { filename } = useParams()
  const [mapData, setMapData] = useState<MapType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMapDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/geo_lhs/api/map/${filename}`)

        if (!response.ok) {
          const errorText = await response.text()
          setError(
            response.status === 404
              ? 'Mapa não encontrado.'
              : `Falha ao carregar: ${response.status} - ${errorText}`
          )
          setLoading(false)
          return
        }

        const data: MapType = await response.json()
        setMapData(data)
        setLoading(false)
      } catch (error) {
        setError(`Erro inesperado: ${error instanceof Error ? error.message : String(error)}`)
        setLoading(false)
        console.error('Erro ao buscar detalhes do mapa:', error)
      }
    }

    if (filename) {
      fetchMapDetails()
    }
  }, [filename])

  return (
    <main className="flex justify-center flex-col w-full min-h-screen h-screen bg-gray-100">
      <Header />
      <section className="w-full h-full p-12 flex items-center justify-center">
        {loading && <p>Carregando...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && mapData && (
          <MapComponentPage title={mapData.nome} mapa={mapData} />
        )}
        {!loading && !error && !mapData && (
          <p>Mapa não encontrado.</p>
        )}
      </section>
      <Footer />
    </main>
  )
}
