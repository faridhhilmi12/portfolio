import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LangProvider } from '../i18n/LangProvider'
import { CollaboratorCursor } from './CollaboratorCursor'
import { mockMedia } from '../test/media'

function renderCursor() {
  return render(
    <LangProvider>
      <CollaboratorCursor targets={[]} />
    </LangProvider>,
  )
}

describe('CollaboratorCursor', () => {
  it('renders nothing under reduced motion', () => {
    mockMedia({ reducedMotion: true, finePointer: true })
    renderCursor()
    expect(screen.queryByTestId('collaborator-cursor')).not.toBeInTheDocument()
  })

  it('renders nothing without a fine pointer', () => {
    mockMedia({ finePointer: false })
    renderCursor()
    expect(screen.queryByTestId('collaborator-cursor')).not.toBeInTheDocument()
  })

  it('stays invisible until a target has been measured', () => {
    renderCursor()
    expect(screen.getByTestId('collaborator-cursor')).toHaveClass('opacity-0')
  })

  it('renders a decorative cursor labelled Farid with a mouse', () => {
    renderCursor()
    const cursor = screen.getByTestId('collaborator-cursor')
    expect(cursor).toHaveAttribute('aria-hidden', 'true')
    expect(cursor).toHaveTextContent('Farid')
  })
})
