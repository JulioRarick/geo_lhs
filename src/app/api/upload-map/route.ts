import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import AdmZip from 'adm-zip'
import { parseZip } from 'shpjs'
import { XMLParser } from 'fast-xml-parser'
import { FeatureCollection, } from 'geojson'
import { kmlToGeoJSON } from './kml-to-json'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('mapFiles') as File[]
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    const uploadedFileUrls: string[] = []

    for (const file of files) {
      const fileExtension = file.name.toLowerCase().split('.').pop()
      const originalFilenameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'))
      const outputFilename = `${originalFilenameWithoutExt}.geojson`
      const outputFilePath = path.join(uploadDir, outputFilename)
      const outputFileUrl = `/public/uploads/${outputFilename}`
      uploadedFileUrls.push(outputFileUrl)

      const buffer = await file.arrayBuffer()
      const fileContent = Buffer.from(new Uint8Array(buffer)).toString('utf-8')

      let geojsonData: FeatureCollection | null = null

      if (fileExtension === 'geojson') {
        try {
          geojsonData = JSON.parse(fileContent)
          await fs.writeFile(outputFilePath, JSON.stringify(geojsonData), 'utf-8')
        } catch (error) {
          console.error('Erro ao analisar GeoJSON:', error)
          return NextResponse.json({ message: `Erro ao analisar o arquivo GeoJSON: ${file.name}. Verifique se o formato é válido.` }, { status: 400 })
        }
      } else if (fileExtension === 'kml') {
        try {
          const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', })
          const kmlData = parser.parse(fileContent)
          const convertedGeoJSON = await kmlToGeoJSON(kmlData)
          if (convertedGeoJSON) {
            await fs.writeFile(outputFilePath, JSON.stringify(convertedGeoJSON), 'utf-8')
            geojsonData = convertedGeoJSON
          } else {
            return NextResponse.json({ message: `Erro ao converter o arquivo KML: ${file.name} para GeoJSON.` }, { status: 400 })
          }
        } catch (error) {
          console.error('Erro ao analisar KML:', error)
          return NextResponse.json({ message: `Erro ao analisar o arquivo KML: ${file.name}.` }, { status: 400 })
        }
      } else if (fileExtension === 'shp' || fileExtension === 'zip') {
        try {
          if (fileExtension === 'zip') {
            const zip = new AdmZip(Buffer.from(new Uint8Array(buffer)))
            const zipEntries = zip.getEntries()
            const shpFileEntry = zipEntries.find((entry: AdmZip.IZipEntry) => entry.entryName.toLowerCase().endsWith('.shp'))

            if (shpFileEntry) {
              const geojsonFromShp =
                await parseZip(Buffer.from(new Uint8Array(buffer)))
              await fs.writeFile(outputFilePath, JSON.stringify(geojsonFromShp), 'utf-8')
              geojsonData = geojsonFromShp as FeatureCollection
            } else {
              console.warn('Nenhum arquivo .shp encontrado no ZIP.')
            }
          } else if (fileExtension === 'shp') {
            return NextResponse.json({ message: 'Por favor, envie arquivos SHP dentro de um arquivo ZIP.' }, { status: 400 })
          }
        } catch (error) {
          console.error('Erro ao processar Shapefile:', error)
          return NextResponse.json({ message: `Erro ao processar o arquivo Shapefile (${file.name}). Certifique-se de que está dentro de um ZIP.` }, { status: 400 })
        }
      } else {
        console.warn(`Tipo de arquivo não suportado para conversão: ${fileExtension}`)
        return NextResponse.json({ message: `Tipo de arquivo não suportado: ${file.name}. Apenas GeoJSON, KML, SHP (em ZIP) e GPX são suportados.` }, { status: 400 })
      }
    }

    const uploadedGeoJSONUrls = (await fs.readdir(uploadDir))
      .filter(f => f.endsWith('.geojson'))
      .map(f => `/public/uploads/${f}`)

    return NextResponse.json({ message: 'Arquivos convertidos para GeoJSON com sucesso!', urls: uploadedGeoJSONUrls }, { status: 200 })
  } catch (error) {
    console.error('Erro ao fazer o upload e processar os arquivos:', error)
    return NextResponse.json({ message: 'Erro ao fazer o upload e processar os arquivos.' }, { status: 500 })
  }
}
