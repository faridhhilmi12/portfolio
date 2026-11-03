import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { LangProvider } from '../i18n/LangProvider'
import { ThemeProvider } from '../theme/ThemeProvider'
import { LINKS } from '../data/links'
import { Nav } from './Nav'
import { ExtLink } from './ExtLink'

function renderNav() {
  return render(
    <LangProvider>
      <ThemeProvider>
        <Nav />
      </ThemeProvider>
    </LangProvider>,
  )
}

beforeEach(() => {
  localStorage.setItem('lang', 'id')
})

describe('Nav', () => {
  it('menu button toggles aria-expanded, Escape closes, link click closes', async () => {
    const user = userEvent.setup()
    renderNav()
    const btn = screen.getByRole('button', { name: 'Buka menu' })
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    await user.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
    await user.keyboard('{Escape}')
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    await user.click(btn)
    await user.click(screen.getByRole('link', { name: 'Pengalaman' }))
    expect(btn).toHaveAttribute('aria-expanded', 'false')
  })

  it('EN button switches language', async () => {
    const user = userEvent.setup()
    renderNav()
    expect(screen.getByRole('link', { name: 'Karya' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'EN' }))
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('link', { name: 'Work' })).toBeInTheDocument()
  })

  it('theme button flips data-theme', async () => {
    const user = userEvent.setup()
    localStorage.setItem('theme', 'light')
    renderNav()
    await user.click(screen.getByRole('button', { name: 'Ganti tema terang/gelap' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})

describe('active section', () => {
  const original = globalThis.IntersectionObserver
  afterEach(() => {
    globalThis.IntersectionObserver = original
    document.body.querySelectorAll('section[data-test]').forEach((n) => n.remove())
  })

  it('marks the link of the intersecting section with aria-current', () => {
    let fire: IntersectionObserverCallback = () => {}
    globalThis.IntersectionObserver = class {
      constructor(cb: IntersectionObserverCallback) {
        fire = cb
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return [] }
    } as unknown as typeof IntersectionObserver
    const sec = document.createElement('section')
    sec.id = 'karya'
    sec.dataset.test = '1'
    document.body.appendChild(sec)

    renderNav()
    act(() => {
      fire([{ isIntersecting: true, target: sec } as unknown as IntersectionObserverEntry], {} as IntersectionObserver)
    })
    expect(screen.getByRole('link', { name: 'Karya' })).toHaveAttribute('aria-current', 'location')
    expect(screen.getByRole('link', { name: 'Kontak' })).not.toHaveAttribute('aria-current')
  })
})

describe('ExtLink', () => {
  it('renders nothing when the link is emptied', () => {
    const saved = LINKS.winme
    LINKS.winme = ''
    render(<ExtLink linkKey="winme">Winme</ExtLink>)
    expect(screen.queryByText('Winme')).not.toBeInTheDocument()
    LINKS.winme = saved
  })

  it('opens http links in a new tab safely', () => {
    render(<ExtLink linkKey="github">GitHub</ExtLink>)
    const a = screen.getByRole('link', { name: 'GitHub' })
    expect(a).toHaveAttribute('target', '_blank')
    expect(a).toHaveAttribute('rel', 'noopener')
  })
})
