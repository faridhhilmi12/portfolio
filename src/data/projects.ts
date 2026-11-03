import type { MessageKey } from '../i18n/id'

export type Wire = 'app' | 'dashboard' | 'lms' | 'site'

/** Kunci kamus untuk teks proyek, mis. projectKey('p1', 'title') → 'work.p1.title'. */
export function projectKey(id: Project['id'], field: 'role' | 'title' | 'sub' | 'desc' | 'note'): MessageKey {
  return `work.${id}.${field}` as MessageKey
}

export interface Project {
  id: 'p1' | 'p2' | 'p3' | 'p4'
  year: number
  tags: string[]
  wire: Wire
  image?: string
  isPrivate?: boolean
  link?: string
}

export const projects: Project[] = [
  { id: 'p1', year: 2026, wire: 'app', tags: ['Figma', 'REST API', 'Responsive UI'] },
  { id: 'p2', year: 2026, wire: 'dashboard', tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Recharts'] },
  { id: 'p3', year: 2026, wire: 'lms', isPrivate: true, tags: ['Laravel 12', 'PHP', 'Role-based access'] },
  { id: 'p4', year: 2025, wire: 'site', tags: ['Figma', 'Wireframe', 'High-fidelity UI'] },
]
