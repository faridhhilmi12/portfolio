import { useEffect, useRef, useState } from 'react'
import { useLang, useT, type Lang } from '../i18n/LangProvider'
import { useTheme } from '../theme/ThemeProvider'
import type { MessageKey } from '../i18n/id'
import { useActiveSection } from './useActiveSection'

const LINKS: Array<{ id: string; key: MessageKey }> = [
  { id: 'karya', key: 'nav.work' },
  { id: 'pengalaman', key: 'nav.exp' },
  { id: 'keahlian', key: 'nav.skills' },
  { id: 'kontak', key: 'nav.contact' },
]

const LANGS: Lang[] = ['id', 'en']

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  className: 'size-[18px]',
}

export function Nav() {
  const t = useT()
  const { lang, setLang } = useLang()
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuBtn = useRef<HTMLButtonElement>(null)
  const active = useActiveSection(LINKS.map((l) => l.id))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuBtn.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const iconBtn =
    'inline-flex size-9 items-center justify-center rounded-lg border border-line bg-surface text-ink transition-colors hover:border-select cursor-pointer'

  return (
    <>
      <a
        href="#karya"
        className="absolute -left-[999px] top-2 z-[100] rounded-md bg-ink px-3.5 py-2 text-paper focus:left-3"
      >
        {t('skip')}
      </a>
      <nav
        aria-label={t('nav.label')}
        className={`sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur transition-shadow ${
          scrolled ? 'shadow-[0_6px_20px_-12px_rgb(0_0_0/0.25)]' : ''
        }`}
      >
        <div className="relative mx-auto flex h-16 w-full max-w-[1120px] items-center gap-6 px-[clamp(16px,4vw,40px)]">
          <a href="#top" className="font-extrabold tracking-tight no-underline">
            Farid Hilmi
          </a>
          <ul
            id="nav-links"
            className={`m-0 list-none gap-6 p-0 md:ml-auto md:flex ${
              open
                ? 'max-md:absolute max-md:left-0 max-md:right-0 max-md:top-full max-md:flex max-md:flex-col max-md:gap-0 max-md:border-b max-md:border-line max-md:bg-paper max-md:px-[clamp(16px,4vw,40px)] max-md:pb-4 max-md:pt-2'
                : 'hidden'
            }`}
          >
            {LINKS.map(({ id, key }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? 'location' : undefined}
                  onClick={() => setOpen(false)}
                  className="relative block py-3 text-[17px] font-medium text-muted no-underline transition-colors hover:text-ink aria-[current=location]:text-ink md:py-1 md:text-[15px] md:after:absolute md:after:inset-x-0 md:after:-bottom-0.5 md:after:h-0.5 md:after:origin-left md:after:scale-x-0 md:after:bg-select md:after:transition-transform md:aria-[current=location]:after:scale-x-100"
                >
                  {t(key)}
                </a>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <div role="group" aria-label={t('lang.label')} className="inline-flex rounded-lg border border-line bg-surface p-0.5">
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                  className="cursor-pointer rounded-md border-0 bg-transparent px-2.5 py-[7px] text-[13px] font-semibold leading-none text-muted aria-pressed:bg-ink aria-pressed:text-paper"
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button type="button" aria-label={t('nav.theme')} onClick={toggle} className={iconBtn}>
              {theme === 'dark' ? (
                <svg {...iconProps}>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg {...iconProps}>
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                </svg>
              )}
            </button>
            <button
              ref={menuBtn}
              type="button"
              aria-label={t('nav.menu')}
              aria-expanded={open}
              aria-controls="nav-links"
              onClick={() => setOpen((o) => !o)}
              className={`${iconBtn} md:hidden`}
            >
              <svg {...iconProps}>{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}
