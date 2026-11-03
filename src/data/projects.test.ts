import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { orderedProjects, projects } from './projects'
import { id } from '../i18n/id'
import { en } from '../i18n/en'

const publicPath = (p: string) => resolve(__dirname, '../../public', p.replace(/^\//, ''))

describe('project screenshots', () => {
  it('uses screenshots for Waldo, the dashboard, and the Himalkom site', () => {
    const images = Object.fromEntries(projects.map((p) => [p.id, p.image]))
    expect(images.p1).toBe('/assets/waldo.jpg')
    expect(images.p2).toBe('/assets/dashboard-bkd.jpg')
    expect(images.p4).toBe('/assets/himalkom.jpg')
  })

  it('never shows any screenshot for the private internal LMS', () => {
    const lms = projects.find((p) => p.id === 'p3')
    expect(lms?.isPrivate).toBe(true)
    expect(lms?.image).toBeUndefined()
  })

  it('explains in both languages why the LMS is not shown', () => {
    expect(id['work.p3.note']).toMatch(/internal/)
    expect(id['work.p3.note']).toMatch(/tidak bisa dibagikan/)
    expect(id['work.p3.note']).toMatch(/wireframe/)
    expect(en['work.p3.note']).toMatch(/internal/)
    expect(en['work.p3.note']).toMatch(/can’t be shared/)
    expect(en['work.p3.note']).toMatch(/wireframe/)
  })

  it('every referenced image exists, is a JPEG, and is light enough for the web', () => {
    for (const p of projects.filter((x) => x.image)) {
      const file = publicPath(p.image!)
      expect(existsSync(file), p.image).toBe(true)
      expect(p.image).toMatch(/\.jpg$/)
      expect(statSync(file).size / 1024, `${p.image} size in KB`).toBeLessThan(300)
    }
  })

  it('does not ship an LMS screenshot file in public/', () => {
    expect(existsSync(publicPath('/assets/lms.jpg'))).toBe(false)
    expect(existsSync(publicPath('/assets/lms.png'))).toBe(false)
  })
})

describe('project order', () => {
  it('keeps the grid order on wide screens', () => {
    expect(orderedProjects(true).map((p) => p.id)).toEqual(['p1', 'p2', 'p3', 'p4'])
  })

  it('shows LMS, Himalkom, BKD, then Waldo on mobile', () => {
    expect(orderedProjects(false).map((p) => p.id)).toEqual(['p3', 'p4', 'p2', 'p1'])
  })
})
