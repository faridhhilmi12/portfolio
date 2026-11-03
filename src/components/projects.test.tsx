import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { LangProvider, useLang } from '../i18n/LangProvider'
import { id } from '../i18n/id'
import { en } from '../i18n/en'
import { projects } from '../data/projects'
import { Projects } from './Projects'

function LangSwitch() {
  const { setLang } = useLang()
  return <button onClick={() => setLang('en')}>to-en</button>
}

function renderProjects() {
  return render(
    <LangProvider>
      <LangSwitch />
      <Projects />
    </LangProvider>,
  )
}

const inspect = () => screen.getByRole('region', { name: 'Inspect' })

beforeEach(() => {
  localStorage.setItem('lang', 'id')
})

describe('Projects', () => {
  it('renders four frames and selects the first by default', () => {
    renderProjects()
    const first = screen.getByRole('button', { name: id['work.p1.title'] })
    expect(first).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: id['work.p2.title'] })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getAllByTestId('project-frame')).toHaveLength(4)
    expect(within(inspect()).getByText(id['work.p1.desc'])).toBeInTheDocument()
  })

  it('clicking a frame swaps the Inspect panel', async () => {
    const user = userEvent.setup()
    renderProjects()
    await user.click(screen.getByRole('button', { name: id['work.p2.title'] }))
    expect(within(inspect()).getByText(id['work.p2.desc'])).toBeInTheDocument()
    expect(within(inspect()).queryByText(id['work.p1.desc'])).not.toBeInTheDocument()
  })

  it('selects with the keyboard and shows the private note for the internal project', async () => {
    const user = userEvent.setup()
    renderProjects()
    screen.getByRole('button', { name: id['work.p3.title'] }).focus()
    await user.keyboard('{Enter}')
    expect(within(inspect()).getByText(id['work.p3.desc'])).toBeInTheDocument()
    expect(within(inspect()).getByText(id['work.p3.note'])).toBeInTheDocument()
  })

  it('lists the stack tags of the selected project', () => {
    renderProjects()
    for (const tag of projects[0].tags) {
      expect(within(inspect()).getByText(tag)).toBeInTheDocument()
    }
  })

  it('keeps the selection when the language changes', async () => {
    const user = userEvent.setup()
    renderProjects()
    await user.click(screen.getByRole('button', { name: id['work.p2.title'] }))
    await user.click(screen.getByText('to-en'))
    expect(screen.getByRole('button', { name: en['work.p2.title'] })).toHaveAttribute('aria-pressed', 'true')
    expect(within(inspect()).getByText(en['work.p2.desc'])).toBeInTheDocument()
  })

  describe('preview image', () => {
    afterEach(() => {
      delete projects[0].image
    })

    it('shows the image when provided and falls back to the wireframe when it fails to load', () => {
      projects[0].image = '/x.png'
      const { container } = renderProjects()
      const img = container.querySelector('img') as HTMLImageElement
      expect(img).toHaveAttribute('src', '/x.png')
      fireEvent.error(img)
      expect(container.querySelector('img')).toBeNull()
      expect(within(screen.getAllByTestId('project-frame')[0]).getByTestId('wireframe')).toBeInTheDocument()
    })
  })
})
