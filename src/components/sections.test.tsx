import { act, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { LangProvider } from '../i18n/LangProvider'
import { id } from '../i18n/id'
import { LINKS, type LinkKey } from '../data/links'
import { Timeline } from './Timeline'
import { Skills } from './Skills'
import { Contact } from './Contact'

const wrap = (ui: React.ReactElement) => render(<LangProvider>{ui}</LangProvider>)

beforeEach(() => {
  localStorage.setItem('lang', 'id')
})

describe('Timeline', () => {
  it('lists the four entries in order', () => {
    wrap(<Timeline />)
    const titles = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(titles).toEqual([
      id['exp.e1.title'],
      id['exp.e2.title'],
      id['exp.e3.title'],
      id['exp.e4.title'],
    ])
  })
})

describe('Skills', () => {
  it('lights up the paired skills when a skill is focused', () => {
    wrap(<Skills />)
    act(() => screen.getByText(id['skills.d1']).focus())
    expect(screen.getByText(id['skills.c2'])).toHaveAttribute('data-paired', 'true')
    expect(screen.getByText(id['skills.c4'])).not.toHaveAttribute('data-paired', 'true')
  })

  it('clears the pairing when focus leaves', () => {
    wrap(<Skills />)
    const d1 = screen.getByText(id['skills.d1'])
    act(() => d1.focus())
    act(() => d1.blur())
    expect(screen.getByText(id['skills.c2'])).not.toHaveAttribute('data-paired', 'true')
  })

  it('shows every certification', () => {
    wrap(<Skills />)
    expect(screen.getByText('Figma Essential Training')).toBeInTheDocument()
    expect(screen.getByText('Software Design: Modeling with UML')).toBeInTheDocument()
  })
})

describe('Contact', () => {
  it('links the buttons to the configured destinations', () => {
    wrap(<Contact />)
    expect(screen.getByRole('link', { name: id['contact.email'] })).toHaveAttribute('href', 'mailto:faridmochilmi@gmail.com')
    expect(screen.getByRole('link', { name: id['contact.winme'] })).toHaveAttribute('href', LINKS.winme)
    expect(screen.getByRole('link', { name: id['contact.projects'] })).toHaveAttribute('href', LINKS.projects)
  })

  it('renders only the email links when every optional link is empty', () => {
    const optional: LinkKey[] = ['linkedin', 'github', 'instagram', 'winme', 'projects']
    const saved = optional.map((k) => [k, LINKS[k]] as const)
    optional.forEach((k) => { LINKS[k] = '' })
    try {
      wrap(<Contact />)
      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(2)
      links.forEach((a) => expect(a.getAttribute('href')).toMatch(/^mailto:/))
      expect(within(screen.getByRole('region')).queryByText('LinkedIn')).not.toBeInTheDocument()
    } finally {
      saved.forEach(([k, v]) => { LINKS[k] = v })
    }
  })
})
