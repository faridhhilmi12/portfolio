import type { ReactNode } from 'react'
import { linkHref, type LinkKey } from '../data/links'

interface ExtLinkProps {
  linkKey: LinkKey
  className?: string
  children: ReactNode
}

/** Anchor untuk link kontak. Tidak dirender sama sekali kalau link-nya dikosongkan. */
export function ExtLink({ linkKey, className, children }: ExtLinkProps) {
  const href = linkHref(linkKey)
  if (!href) return null
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
    >
      {children}
    </a>
  )
}
