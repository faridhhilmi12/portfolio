import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { mockMedia } from './media'

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}
globalThis.ResizeObserver = NoopObserver as unknown as typeof ResizeObserver
globalThis.IntersectionObserver = NoopObserver as unknown as typeof IntersectionObserver

beforeEach(() => {
  mockMedia({ finePointer: true })
})

afterEach(() => {
  cleanup()
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.className = ''
})
