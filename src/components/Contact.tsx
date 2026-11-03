import { Reveal } from '../canvas/Reveal'
import { linkHref, type LinkKey } from '../data/links'
import { useT } from '../i18n/LangProvider'
import { ExtLink } from './ExtLink'

const primary =
  'inline-flex min-h-[46px] items-center justify-center rounded-lg border-[1.5px] border-transparent bg-ink px-5 text-[15.5px] font-semibold text-paper no-underline transition-colors hover:bg-select-strong hover:text-white active:translate-y-px'
const ghost =
  'inline-flex min-h-[46px] items-center justify-center rounded-lg border-[1.5px] border-ink px-5 text-[15.5px] font-semibold no-underline transition-colors hover:bg-ink hover:text-paper active:translate-y-px'

const SOCIALS: Array<{ key: LinkKey; label: string }> = [
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'github', label: 'GitHub' },
  { key: 'instagram', label: 'Instagram @faridhhilmi' },
  { key: 'emailText', label: 'faridmochilmi@gmail.com' },
]

export function Contact() {
  const t = useT()
  return (
    <section id="kontak" aria-labelledby="contact-h" className="bg-band py-[clamp(64px,9vw,120px)]">
      <div className="mx-auto w-full max-w-[1120px] px-[clamp(16px,4vw,40px)]">
        <Reveal>
          <h2 id="contact-h" className="max-w-[14em] text-[clamp(32px,5vw,56px)] font-extrabold tracking-[-0.03em]">
            {t('contact.title')}
          </h2>
          <p className="mt-4 max-w-[34em] text-lg text-muted">{t('contact.lead')}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ExtLink linkKey="email" className={primary}>{t('contact.email')}</ExtLink>
            <ExtLink linkKey="winme" className={ghost}>{t('contact.winme')}</ExtLink>
            <ExtLink linkKey="projects" className={ghost}>{t('contact.projects')}</ExtLink>
          </div>
          <ul className="m-0 mt-10 flex list-none flex-wrap gap-x-7 gap-y-2 border-t border-line-strong p-0 pt-6">
            {SOCIALS.filter((s) => linkHref(s.key)).map((s) => (
              <li key={s.key}>
                <ExtLink linkKey={s.key} className="underline decoration-underline underline-offset-4 hover:decoration-select">
                  {s.label}
                </ExtLink>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
