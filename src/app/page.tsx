'use client'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { MapType } from '@/components/map-list'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const MapList = dynamic(() => import('../components/map-list').then((mod) => mod.MapList), {
  ssr: false,
})

export default function Home() {
  const [mapas, setMapas] = useState<MapType[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMapas = async () => {
      try {
        const response = await fetch('/api/get-maps')
        if (!response.ok) {
          throw new Error(`Erro ao buscar mapas: ${response.status}`)
        }
        const data: MapType[] = await response.json()
        setMapas(data)
      } catch (error: Error | unknown) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError('Erro desconhecido')
        }
        console.error('Erro ao buscar mapas:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMapas()
  }, [])

  return (
    <main className="w-full flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto py-8 flex-1">
        {isLoading
          ? (
            <div>Carregando mapas...</div>
            )
          : error
            ? (
              <div className="text-red-500">Erro ao carregar os mapas: {error}</div>
              )
            : (
              <MapList mapas={mapas || []} />
              )}
      </div>
      <Footer />
    </main>
  )
}
