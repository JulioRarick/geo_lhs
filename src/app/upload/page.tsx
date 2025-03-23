'use client'

import { AuthModal } from '@/components/auth-modal'
import { FileUploadButton } from '@/components/file-upload-button'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { X } from 'lucide-react'
import { redirect } from 'next/navigation'
import { useState, ChangeEvent, useEffect } from 'react'
import { toast } from 'react-toastify'

const ACCEPTED_FILE_TYPES = ['.kml', '.geojson', '.shp', '.zip']

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[] | undefined>()
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  function handleAuthSuccess() {
    setIsAuthenticated(true)
    setIsAuthModalOpen(false)

    toast.success('Autenticação realizada com sucesso!')
  }

  function handleCloseModal() {
    setIsAuthModalOpen(false)
    redirect('/')
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return setSelectedFiles([])
    }

    const files = Array.from(event.target.files)
    const validFiles = files.filter((file) =>
      ACCEPTED_FILE_TYPES.some((type) => file.name.toLowerCase().endsWith(type))
    )

    if (validFiles.length < files.length) {
      const invalidFiles = files.filter(
        (file) => !ACCEPTED_FILE_TYPES.some((type) =>
          file.name.toLowerCase().endsWith(type))
      )
      invalidFiles.forEach((file) => {
        toast.error(`Tipo de arquivo não suportado: ${file.name}. Tipos aceitos: ${ACCEPTED_FILE_TYPES.join(', ')}`)
      })
    }

    return setSelectedFiles(validFiles)
  }

  const handleRemoveFile = (indexToRemove: number) => {
    if (!selectedFiles) return
    setSelectedFiles(
      selectedFiles.filter((_, index) => index !== indexToRemove)
    )
  }

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setUploadStatus('Por favor, selecione um ou mais arquivos.')
      toast.warn('Por favor, selecione um ou mais arquivos.')
      return
    }

    const formData = new FormData()
    selectedFiles.forEach((file) => {
      formData.append('mapFiles', file)
    })

    try {
      setUploadStatus('Enviando arquivos...')
      const response = await fetch('/api/upload-map', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) {
        toast.error(`Erro ao enviar os arquivos: ${data.message || 'Algo deu errado.'}`)
        setUploadStatus(`Erro no upload: ${data.message || 'Algo deu errado.'}`)
        return
      }
      toast.success('Upload realizado com sucesso!')
      setUploadStatus('Upload realizado com sucesso!')
      setSelectedFiles(selectedFiles)
    } catch (error: unknown) {
      setUploadStatus('Erro ao enviar os arquivos.')
      if (error instanceof Error) {
        toast.error(`Erro ao enviar os arquivos: ${error.message}`)
      }
    }
  }

  useEffect(() => {
    const authToken = localStorage.getItem('auth_token_geo_lhs')
    if (authToken) {
      setIsAuthenticated(true)
    } else {
      setIsAuthModalOpen(true)
    }
  }, [setIsAuthenticated])

  return (
    <main className="w-full min-h-screen flex flex-col h-screen bg-gray-100 ">
      <section className="h-full flex flex-col items-center flex-1 w-full">
        {!isAuthenticated && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={handleCloseModal}
            onAuthSuccess={handleAuthSuccess}
          />
        )}
        <Header />
        <section className="flex gap-4 flex-col w-full h-full flex-1 items-center justify-center">
          {isAuthenticated && (
            <article className="bg-white flex items-center gap-4 justify-center flex-col p-8 rounded shadow-md w-xl">
              <h2 className="text-xl font-semibold mb-4 self-start">Upload de Mapa</h2>
              <FileUploadButton
                onChange={handleFileChange}
                multiple
                accept={ACCEPTED_FILE_TYPES.join(' ,')}
              />
              <p className="text-sm text-gray-600 font-medium mb-2">
                Tipos de arquivos aceitos: {ACCEPTED_FILE_TYPES.join(', ')}
              </p>
              {selectedFiles && selectedFiles.length > 0 && (
                <div className="mt-4 w-full flex flex-col gap-2 select-none">
                  <h3 className="text-md font-semibold mb-2">Arquivos Selecionados:</h3>
                  <ul className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between text-sm text-green-700 bg-green-50 p-2 rounded-md"
                      >
                        <span className="truncate">{file.name} ({Math.round(file.size / 1024)} KB)</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleUpload}
                    className="mt-4 bg-blue-600 cursor-pointer hover:bg-blue-700 self-end text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Enviar Arquivos
                  </button>
                </div>
              )}
              {uploadStatus && !selectedFiles?.length && <p className="mt-4 text-red-500">{uploadStatus}</p>}
              {uploadStatus === 'Upload realizado com sucesso!' && <p className="mt-4 text-green-500">{uploadStatus}</p>}
              {uploadStatus === 'Enviando arquivos...' && <p className="mt-4 text-blue-500">{uploadStatus}</p>}
            </article>
          )}
          {isAuthenticated && (
            <p className="text-gray-600 mt-2">Envie arquivos de mapas para serem exibidos na aplicação.</p>
          )}
          {!isAuthenticated && (
            <p className="text-gray-600 mt-2">Você precisa estar autenticado para enviar arquivos.</p>
          )}
        </section>
      </section>
      <Footer />
    </main>
  )
}
