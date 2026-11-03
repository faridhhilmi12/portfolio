import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { readStore, writeStore } from '../lib/storage'

export type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggle(): void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const isTheme = (v: string | null | undefined): v is Theme => v === 'light' || v === 'dark'

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function initialTheme(): Theme {
  const attr = document.documentElement.dataset.theme
  if (isTheme(attr)) return attr
  const saved = readStore('theme')
  return isTheme(saved) ? saved : systemTheme()
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  // true setelah pengguna memilih (atau ada pilihan tersimpan): berhenti mengikuti sistem
  const chosen = useRef(isTheme(readStore('theme')))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (!chosen.current) setTheme(mq.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    const root = document.documentElement
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    chosen.current = true
    // matikan transisi sesaat agar warna tidak memudar tidak serempak
    root.classList.add('no-anim')
    setTheme(next)
    root.dataset.theme = next
    writeStore('theme', next)
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('no-anim')))
  }, [theme])

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
