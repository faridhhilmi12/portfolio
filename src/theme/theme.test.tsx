import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider, useTheme } from './ThemeProvider'
import { mockMedia } from '../test/media'

function Probe() {
  const { theme, toggle } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggle}>toggle</button>
    </div>
  )
}

const root = document.documentElement

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ThemeProvider', () => {
  it('applies a stored theme to <html>', () => {
    localStorage.setItem('theme', 'dark')
    render(<ThemeProvider><Probe /></ThemeProvider>)
    expect(root.dataset.theme).toBe('dark')
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('ignores an invalid stored theme and follows the system', () => {
    localStorage.setItem('theme', 'purple')
    mockMedia({ dark: true })
    render(<ThemeProvider><Probe /></ThemeProvider>)
    expect(root.dataset.theme).toBe('dark')
  })

  it('toggle flips the theme and persists it', () => {
    localStorage.setItem('theme', 'light')
    render(<ThemeProvider><Probe /></ThemeProvider>)
    act(() => screen.getByText('toggle').click())
    expect(root.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('suspends transitions right after toggling', () => {
    localStorage.setItem('theme', 'light')
    render(<ThemeProvider><Probe /></ThemeProvider>)
    act(() => screen.getByText('toggle').click())
    expect(root.classList.contains('no-anim')).toBe(true)
  })

  it('restores transitions even when animation frames never fire', () => {
    vi.useFakeTimers()
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0)
    localStorage.setItem('theme', 'light')
    render(<ThemeProvider><Probe /></ThemeProvider>)
    act(() => screen.getByText('toggle').click())
    expect(root.classList.contains('no-anim')).toBe(true)
    act(() => { vi.advanceTimersByTime(300) })
    expect(root.classList.contains('no-anim')).toBe(false)
    vi.useRealTimers()
  })

  describe('browser theme-color', () => {
    const addMetas = () => {
      for (const media of ['(prefers-color-scheme: light)', '(prefers-color-scheme: dark)']) {
        const m = document.createElement('meta')
        m.name = 'theme-color'
        m.media = media
        m.content = media.includes('dark') ? '#121214' : '#FFFFFF'
        document.head.appendChild(m)
      }
    }
    afterEach(() => {
      document.head.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.remove())
    })

    it('collapses to a single meta with the chosen color when the user toggles', () => {
      addMetas()
      localStorage.setItem('theme', 'light')
      render(<ThemeProvider><Probe /></ThemeProvider>)
      act(() => screen.getByText('toggle').click())
      const metas = document.head.querySelectorAll('meta[name="theme-color"]')
      expect(metas).toHaveLength(1)
      expect(metas[0]).not.toHaveAttribute('media')
      expect(metas[0]).toHaveAttribute('content', '#121214')
    })

    it('applies a previously stored choice on load', () => {
      addMetas()
      localStorage.setItem('theme', 'dark')
      render(<ThemeProvider><Probe /></ThemeProvider>)
      const metas = document.head.querySelectorAll('meta[name="theme-color"]')
      expect(metas).toHaveLength(1)
      expect(metas[0]).toHaveAttribute('content', '#121214')
    })

    it('leaves the media-based metas alone when the user never chose', () => {
      addMetas()
      render(<ThemeProvider><Probe /></ThemeProvider>)
      expect(document.head.querySelectorAll('meta[name="theme-color"]')).toHaveLength(2)
    })
  })

  it('still toggles when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    render(<ThemeProvider><Probe /></ThemeProvider>)
    act(() => screen.getByText('toggle').click())
    expect(root.dataset.theme).toBe('dark')
  })
})
