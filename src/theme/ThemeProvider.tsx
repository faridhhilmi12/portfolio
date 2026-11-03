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

const THEME_COLOR: Record<Theme, string> = { light: '#FFFFFF', dark: '#121214' }

/** Pilihan manual menggantikan dua meta theme-color berbasis media dengan satu meta tetap. */
function syncThemeColor(theme: Theme): void {
  document.head.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta, i) => {
    if (i === 0) {
      meta.removeAttribute('media')
      meta.content = THEME_COLOR[theme]
    } else {
      meta.remove()
    }
  })
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
    if (chosen.current) syncThemeColor(theme)
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
    const restore = () => root.classList.remove('no-anim')
    requestAnimationFrame(() => requestAnimationFrame(restore))
    // cadangan: rAF bisa tertahan (tab tersembunyi), transisi tidak boleh mati selamanya
    window.setTimeout(restore, 150)
  }, [theme])

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
