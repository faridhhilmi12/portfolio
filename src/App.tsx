import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'

export default function App() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Projects />
      </main>
      <Footer />
    </>
  )
}
