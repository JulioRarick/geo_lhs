import { MapPinned } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  return (
    <header className="bg-gray-800/90 text-white w-full flex items-center justify-center shadow-md">
      <article className="px-10 py-6 justify-center flex items-center container flex-col xl:flex-row xl:justify-between">
        <Link href="/" className="text-2xl hover:scale-105 transition-all ease-in-out font-extrabold tracking-tighter flex items-center gap-2">
          <MapPinned className="w-6 h-6 text-sky-500" />
          GeoLHS
        </Link>
        <nav className="flex items-center">
          <ul className="flex space-x-4 items-center justify-between">
            <li className="cursor-pointer text-white xl:text-lg border-b-2  hover:text-green-400 border-transparent transition-colors duration-300 hover:border-green-400">
              <Link href="/">Início</Link>
            </li>
            <li className="cursor-pointer text-white xl:text-lg border-b-2  hover:text-green-400 border-transparent transition-colors duration-300 hover:border-green-400">
              <Link href="/upload">Upload</Link>
            </li>
          </ul>
        </nav>
      </article>
    </header>
  )
}
