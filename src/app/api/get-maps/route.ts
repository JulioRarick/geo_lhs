import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import { MapType } from '@/components/map-list'
import { GeoJsonObject } from 'geojson'

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    const files = await fs.readdir(uploadDir)
    const geojsonFiles = files.filter(file => file.toLowerCase().endsWith('.geojson'))
    const mapas: MapType[] = []

    for (const file of geojsonFiles) {
      const filePath = path.join(uploadDir, file)
      const fileUrl = `/public/uploads/${file}`
      const fileNameWithoutExtension = file.substring(0, file.lastIndexOf('.'))

      try {
        const fileContent = await fs.readFile(filePath, 'utf-8')
        const geoJsonData: GeoJsonObject = JSON.parse(fileContent)
        mapas.push({
          id: file,
          nome: fileNameWithoutExtension,
          url: fileUrl,
          geoJsonData,
        })
      } catch (error) {
        console.error(`Erro ao ler ou analisar GeoJSON em ${file}:`, error)
      }
    }

    return NextResponse.json(mapas)
  } catch (error) {
    console.error('Erro ao ler a pasta de uploads:', error)
    return NextResponse.json({ message: 'Erro ao carregar os mapas.' }, { status: 500 })
  }
}
