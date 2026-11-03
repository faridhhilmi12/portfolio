import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { Timeline } from './components/Timeline'
import { Skills } from './components/Skills'
import { Contact } from './components/Contact'

export default function App() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Projects />
        <Timeline />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
