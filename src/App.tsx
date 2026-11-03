import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'

export default function App() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
      </main>
      <Footer />
    </>
  )
}
