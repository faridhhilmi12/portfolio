import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { LangProvider, useLang } from '../i18n/LangProvider'
import { id } from '../i18n/id'
import { en } from '../i18n/en'
import { projects } from '../data/projects'
import { mockMedia } from '../test/media'
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
  mockMedia({ finePointer: true, wide: true })
})

const frameTitles = () =>
  screen.getAllByTestId('project-frame').map((f) => f.querySelector('button')?.getAttribute('aria-label'))

describe('Projects on a mobile screen', () => {
  beforeEach(() => {
    mockMedia({ finePointer: true, wide: false })
  })

  it('lists LMS, Himalkom, BKD, then Waldo', () => {
    renderProjects()
    expect(frameTitles()).toEqual([
      id['work.p3.title'],
      id['work.p4.title'],
      id['work.p2.title'],
      id['work.p1.title'],
    ])
  })

  it('opens the first listed project (LMS) by default, with its details right under its card', () => {
    renderProjects()
    expect(screen.getByRole('button', { name: id['work.p3.title'] })).toHaveAttribute('aria-pressed', 'true')
    const firstFrame = screen.getAllByTestId('project-frame')[0]
    expect(firstFrame.parentElement).toContainElement(inspect())
    expect(within(inspect()).getByText(id['work.p3.note'])).toBeInTheDocument()
  })

  it('keeps the selection when the screen grows to the wide layout', () => {
    const { rerender } = renderProjects()
    fireEvent.click(screen.getByRole('button', { name: id['work.p4.title'] }))
    mockMedia({ finePointer: true, wide: true })
    rerender(
      <LangProvider>
        <LangSwitch />
        <Projects />
      </LangProvider>,
    )
    expect(screen.getByRole('button', { name: id['work.p4.title'] })).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('Projects', () => {
  it('lists Waldo, BKD, LMS, then Himalkom on wide screens', () => {
    renderProjects()
    expect(frameTitles()).toEqual([
      id['work.p1.title'],
      id['work.p2.title'],
      id['work.p3.title'],
      id['work.p4.title'],
    ])
  })

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
    const original = projects[0].image
    afterEach(() => {
      projects[0].image = original
    })

    it('shows the image when provided and falls back to the wireframe when it fails to load', () => {
      projects[0].image = '/x.png'
      renderProjects()
      const frame = screen.getAllByTestId('project-frame')[0]
      const img = frame.querySelector('img') as HTMLImageElement
      expect(img).toHaveAttribute('src', '/x.png')
      fireEvent.error(img)
      expect(frame.querySelector('img')).toBeNull()
      expect(within(frame).getByTestId('wireframe')).toBeInTheDocument()
    })

    it('renders real screenshots for the public projects and a wireframe for the private LMS', () => {
      renderProjects()
      const frames = screen.getAllByTestId('project-frame')
      expect(frames.map((f) => f.querySelector('img')?.getAttribute('src') ?? null)).toEqual([
        '/assets/waldo.jpg',
        '/assets/dashboard-bkd.jpg',
        null,
        '/assets/himalkom.jpg',
      ])
      expect(within(frames[2]).getByTestId('wireframe')).toBeInTheDocument()
      expect(screen.getAllByTestId('wireframe')).toHaveLength(1)
    })
  })
})
