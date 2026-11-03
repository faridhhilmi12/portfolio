import { act, render, renderHook, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useCanvasMotion } from './useCanvasMotion'
import { SelectionBox } from './SelectionBox'
import { DotGrid } from './DotGrid'
import { Reveal } from './Reveal'
import { mockMedia } from '../test/media'

describe('useCanvasMotion', () => {
  it('animate is false under prefers-reduced-motion', () => {
    mockMedia({ reducedMotion: true, finePointer: true })
    const { result } = renderHook(() => useCanvasMotion())
    expect(result.current.animate).toBe(false)
  })

  it('finePointer is false without hover/fine pointer', () => {
    mockMedia({ finePointer: false })
    const { result } = renderHook(() => useCanvasMotion())
    expect(result.current.finePointer).toBe(false)
    expect(result.current.animate).toBe(true)
  })
})

describe('SelectionBox', () => {
  it('draws four handles and the badge when selected', () => {
    render(<SelectionBox badge="Peran X"><p>isi</p></SelectionBox>)
    expect(screen.getAllByTestId('handle')).toHaveLength(4)
    expect(screen.getByText('Peran X')).toBeInTheDocument()
    expect(screen.getByText('isi')).toBeInTheDocument()
  })

  it('draws no handles when not selected', () => {
    render(<SelectionBox selected={false} badge="Peran X"><p>isi</p></SelectionBox>)
    expect(screen.queryAllByTestId('handle')).toHaveLength(0)
    expect(screen.queryByText('Peran X')).not.toBeInTheDocument()
  })

  describe('size label', () => {
    const original = globalThis.ResizeObserver
    afterEach(() => {
      globalThis.ResizeObserver = original
    })

    it('shows the observed size as "w × h"', () => {
      globalThis.ResizeObserver = class {
        cb: ResizeObserverCallback
        constructor(cb: ResizeObserverCallback) {
          this.cb = cb
        }
        observe() {
          this.cb([{ contentRect: { width: 412.2, height: 167.8 } } as ResizeObserverEntry], this as unknown as ResizeObserver)
        }
        unobserve() {}
        disconnect() {}
      } as unknown as typeof ResizeObserver
      render(<SelectionBox showSize><h1>Nama</h1></SelectionBox>)
      act(() => {})
      expect(screen.getByTestId('size-label')).toHaveTextContent('412 × 168')
      // di layar sempit label ini bertabrakan dengan badge di bawah kotak
      expect(screen.getByTestId('size-label')).toHaveClass('max-md:hidden')
    })
  })
})

describe('DotGrid', () => {
  it('renders its children', () => {
    render(<DotGrid><span>konten</span></DotGrid>)
    expect(screen.getByText('konten')).toBeInTheDocument()
  })

  it('clips horizontal overflow so the bleeding dot layer cannot cause a horizontal scrollbar', () => {
    const { container } = render(<DotGrid><span>konten</span></DotGrid>)
    expect(container.firstElementChild).toHaveClass('overflow-x-clip')
  })
})

describe('Reveal', () => {
  it('renders children without a hidden initial style under reduced motion', () => {
    mockMedia({ reducedMotion: true })
    render(<Reveal><p>muncul</p></Reveal>)
    const el = screen.getByText('muncul').parentElement as HTMLElement
    expect(el.style.opacity).toBe('')
  })
})
