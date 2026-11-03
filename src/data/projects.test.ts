import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { projects } from './projects'

const publicPath = (p: string) => resolve(__dirname, '../../public', p.replace(/^\//, ''))

describe('project screenshots', () => {
  it('uses screenshots for Waldo, the dashboard, and the Himalkom site', () => {
    const images = Object.fromEntries(projects.map((p) => [p.id, p.image]))
    expect(images.p1).toBe('/assets/waldo.jpg')
    expect(images.p2).toBe('/assets/dashboard-bkd.jpg')
    expect(images.p4).toBe('/assets/himalkom.jpg')
  })

  it('never shows a screenshot for the private internal project', () => {
    const lms = projects.find((p) => p.isPrivate)
    expect(lms?.id).toBe('p3')
    expect(lms?.image).toBeUndefined()
  })

  it('every referenced image exists, is a JPEG, and is light enough for the web', () => {
    for (const p of projects.filter((x) => x.image)) {
      const file = publicPath(p.image!)
      expect(existsSync(file), p.image).toBe(true)
      expect(p.image).toMatch(/\.jpg$/)
      expect(statSync(file).size / 1024, `${p.image} size in KB`).toBeLessThan(300)
    }
  })
})
