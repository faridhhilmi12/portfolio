import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { LangProvider } from '../i18n/LangProvider'
import { Hero } from './Hero'
import { mockMedia } from '../test/media'

function renderHero() {
  return render(
    <LangProvider>
      <Hero />
    </LangProvider>,
  )
}

beforeEach(() => {
  localStorage.setItem('lang', 'id')
})

describe('Hero', () => {
  it('shows the name, lead, and both calls to action', () => {
    renderHero()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Muhammad\s+Farid Hilmi/)
    expect(screen.getByText(/Saya merancang tampilan web di Figma/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Lihat karya' })).toHaveAttribute('href', '#karya')
    expect(screen.getByRole('link', { name: 'Hubungi saya' })).toHaveAttribute('href', '#kontak')
  })

  it('shows the profile photo with its alt text', () => {
    renderHero()
    const img = screen.getByRole('img', { name: 'Foto Muhammad Farid Hilmi' })
    expect(img.getAttribute('src')).toMatch(/\/assets\/farid\.jpg$/)
  })

  it('makes the photo draggable with a mouse and motion allowed', () => {
    renderHero()
    expect(screen.getByRole('figure')).toHaveAttribute('data-drag', 'true')
  })

  it('keeps the photo static under reduced motion', () => {
    mockMedia({ reducedMotion: true, finePointer: true })
    renderHero()
    expect(screen.getByRole('figure')).toHaveAttribute('data-drag', 'false')
  })

  it('keeps the photo static without a fine pointer', () => {
    mockMedia({ finePointer: false })
    renderHero()
    expect(screen.getByRole('figure')).toHaveAttribute('data-drag', 'false')
  })
})
