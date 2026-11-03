import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const ORIGIN = 'https://farid-hilmi-portfolio.netlify.app/'
const read = (p: string) => readFileSync(resolve(__dirname, '../..', p), 'utf8')

describe('static SEO shell', () => {
  const html = read('index.html')

  it('has canonical, og, twitter, theme-color and noscript', () => {
    expect(html).toContain(`<link rel="canonical" href="${ORIGIN}">`)
    expect(html).toContain('property="og:title"')
    expect(html).toMatch(new RegExp(`property="og:image" content="${ORIGIN}`))
    expect(html).toContain('name="twitter:card"')
    expect(html.match(/name="theme-color"/g)).toHaveLength(2)
    expect(html).toContain('<noscript>')
  })

  it('declares the real dimensions of the profile photo for link previews', () => {
    expect(html).toContain('property="og:image:width" content="900"')
    expect(html).toContain('property="og:image:height" content="1193"')
  })

  it('has valid Person JSON-LD', () => {
    const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
    expect(m).not.toBeNull()
    const ld = JSON.parse(m![1])
    expect(ld['@type']).toBe('Person')
    expect(ld.name).toBe('Muhammad Farid Hilmi')
  })

  it('points robots.txt and sitemap.xml at the same origin', () => {
    expect(read('public/robots.txt')).toContain(`Sitemap: ${ORIGIN}sitemap.xml`)
    expect(read('public/sitemap.xml')).toContain(`<loc>${ORIGIN}</loc>`)
  })
})
