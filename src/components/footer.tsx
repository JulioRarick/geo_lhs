import Link from 'next/link'
export function Footer() {
  return (
    <footer className="flex items-center justify-center py-6 justify-self-end px-8 w-full self-end bg-gray-200 shadow-inner">
      <article className="flex items-center justify-between container">
        <p className="text-gray-600">&copy; 2025</p>
        <Link href="https://lhs.unb.br/sentinela" className="hover:text-blue-500 hover:underline text-gray-800">
          lhs.unb.br
        </Link>
      </article>
    </footer>
  )
}
