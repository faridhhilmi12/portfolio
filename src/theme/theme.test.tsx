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

  it('still toggles when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    render(<ThemeProvider><Probe /></ThemeProvider>)
    act(() => screen.getByText('toggle').click())
    expect(root.dataset.theme).toBe('dark')
  })
})
