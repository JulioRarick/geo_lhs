'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('auth_token_geo_lhs', data.token)
        onAuthSuccess()
        onClose()
      } else {
        setError(data.message || 'Erro ao autenticar')
        toast.error('Usuário e/ou Senha incorreto!')
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição de login:', error)
      setError('Erro ao conectar com o servidor')
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-gray-600/30 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-2xl w-96 p-6">
        <h2 className="text-lg font-semibold mb-4">Autenticação</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
            Usuário:
          </label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Senha:
          </label>
          <input
            type="password"
            id="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleLogin}
          >
            Entrar
          </button>
          <button
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
