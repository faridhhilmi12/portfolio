import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { id } from './id'
import { en } from './en'
import { LangProvider, useLang, useT } from './LangProvider'
import { LINKS, linkHref } from '../data/links'

function Probe() {
  const t = useT()
  const { lang, setLang } = useLang()
  return (
    <div>
      <span data-testid="text">{t('nav.work')}</span>
      <span data-testid="lang">{lang}</span>
      <button onClick={() => setLang('en')}>to-en</button>
    </div>
  )
}

afterEach(() => {
  vi.restoreAllMocks()
  document.title = ''
  document.head.querySelector('meta[name="description"]')?.remove()
})

describe('dictionaries', () => {
  it('en has exactly the keys of id', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(id).sort())
  })
})

describe('links', () => {
  it('returns the legacy url for a filled link', () => {
    expect(linkHref('instagram')).toBe('https://www.instagram.com/faridhhilmi')
  })

  it('returns null for an emptied link', () => {
    const saved = LINKS.winme
    LINKS.winme = ''
    expect(linkHref('winme')).toBeNull()
    LINKS.winme = saved
  })
})

describe('LangProvider', () => {
  it('uses the stored language', () => {
    localStorage.setItem('lang', 'en')
    render(<LangProvider><Probe /></LangProvider>)
    expect(screen.getByTestId('text')).toHaveTextContent('Work')
  })

  it('falls back to navigator.language when the stored value is invalid', () => {
    localStorage.setItem('lang', 'fr')
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('id-ID')
    render(<LangProvider><Probe /></LangProvider>)
    expect(screen.getByTestId('text')).toHaveTextContent('Karya')
  })

  it('setLang updates html lang, title and description, and persists', () => {
    const meta = document.createElement('meta')
    meta.name = 'description'
    document.head.appendChild(meta)
    localStorage.setItem('lang', 'id')
    render(<LangProvider><Probe /></LangProvider>)
    act(() => screen.getByText('to-en').click())
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe(en['meta.title'])
    expect(meta.content).toBe(en['meta.desc'])
    expect(localStorage.getItem('lang')).toBe('en')
  })

  it('still renders and switches when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    render(<LangProvider><Probe /></LangProvider>)
    act(() => screen.getByText('to-en').click())
    expect(screen.getByTestId('text')).toHaveTextContent('Work')
  })
})
