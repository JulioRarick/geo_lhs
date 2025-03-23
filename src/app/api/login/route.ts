import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'

const secretKey = process.env.JWT_SECRET || 'lhs_server_geo_maps'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    const expectedUsername = process.env.AUTH_USERNAME
    const expectedPassword = process.env.AUTH_PASSWORD

    if (username === expectedUsername && password === expectedPassword) {
      const token = sign({ username }, secretKey, { expiresIn: '5h' })
      return NextResponse.json({ token }, { status: 200 })
    }
    return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
  } catch (error) {
    console.error('Erro ao processar a requisição:', error)
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 })
  }
}
