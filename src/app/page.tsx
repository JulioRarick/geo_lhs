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
      <section className="container mx-auto py-8 flex-1">
        {isLoading
          ? (
            <article className="w-full h-full flex items-center justify-center">
              <h1 className="text-2xl text-gray-500">
                Carregando mapas...
              </h1>
            </article>
            )
          : error
            ? (
              <section className="text-red-500">
                <article className="w-full h-full flex items-center justify-center">
                  <h1>
                    Erro ao carregar os mapas: {error}
                  </h1>
                </article>
              </section>
              )
            : (
              <MapList mapas={mapas || []} />
              )}
      </section>
      <Footer />
    </main>
  )
}
