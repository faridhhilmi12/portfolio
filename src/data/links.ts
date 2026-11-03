export type LinkKey =
  | 'email' | 'emailText' | 'linkedin' | 'github' | 'instagram' | 'winme' | 'projects'

/** Link yang dikosongkan ('') otomatis tidak dirender. */
export const LINKS: Record<LinkKey, string> = {
  email: 'mailto:faridmochilmi@gmail.com',
  emailText: 'mailto:faridmochilmi@gmail.com',
  linkedin: 'https://www.linkedin.com/in/muhammad-farid-hilmi',
  github: 'https://github.com/faridhhilmi12',
  instagram: 'https://www.instagram.com/faridhhilmi',
  winme: 'https://winme.id/designwebrid1',
  projects: 'https://projects.co.id/public/browse_services/view/a2bf13/jasa-desain-uiux-landing-page-website-profesional-figma',
}

export function linkHref(key: LinkKey): string | null {
  return LINKS[key] || null
}
