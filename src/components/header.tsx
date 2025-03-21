import { MapPinned } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-gray-800 text-white w-full flex items-center justify-center">
      <article className="px-10 py-6 justify-between flex items-center container">
        <Link href="/" className="text-2xl hover:scale-105 transition-all ease-in-out font-bold tracking-tight flex items-center gap-2">
          <MapPinned className="w-6 h-6 text-sky-500" />
          GeoLHS
        </Link>
        <nav className="flex items-center">
          <ul className="flex space-x-4 items-center justify-between">
            <li className="cursor-pointer text-white border-b-2  hover:text-gray-300 border-transparent transition-colors duration-300 hover:border-gray-300">
              <Link href="/">Início</Link>
            </li>
            <li className="cursor-pointer text-white border-b-2  hover:text-gray-300 border-transparent transition-colors duration-300 hover:border-gray-300">
              <Link href="/upload">Upload</Link>
            </li>
          </ul>
        </nav>
      </article>
    </header>
  )
}
