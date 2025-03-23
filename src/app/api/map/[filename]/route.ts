import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { MapType } from '@/components/map-list'
import { Params } from 'next/dist/server/request/params'
import { GeoJsonObject } from 'geojson'

export async function GET(request: Request, {
  params
}: { params: Params }): Promise<Response> {
  const { filename } = await params

  const textFilename = filename?.toLocaleString() || ''

  try {
    const uploadDir = path.join(process.cwd(), 'public/uploads')

    const filePath = path.join(uploadDir, textFilename)
    const fileUrl = `/public/uploads/${textFilename}`
    const filenameWithoutExtension = textFilename?.substring(0, textFilename.lastIndexOf('.'))

    const fileContent = await fs.readFile(filePath, 'utf-8')
    const geoJsonData: GeoJsonObject = JSON.parse(fileContent)
    const mapData: MapType = {
      id: fileUrl,
      nome: filenameWithoutExtension,
      url: fileUrl,
      geoJsonData
    }

    return NextResponse.json(mapData)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return NextResponse.json({ error: 'Mapa não encontrado' }, { status: 404 })
    }
    console.error('Erro ao ler o arquivo de mapa:', error)
    return NextResponse.json({ error: 'Erro ao carregar os detalhes do mapa' }, { status: 500 })
  }
}
