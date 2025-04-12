import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { HomeMaps } from '@/components/home-maps'

export default function Home() {
  return (
    <main className="w-full flex flex-col min-h-screen">
      <Header />
      <HomeMaps />
      <Footer />
    </main>
  )
}
