import { useState } from 'react'
import { Reveal } from '../canvas/Reveal'
import { certs, codeSkills, designSkills, pairs } from '../data/skills'
import { useT } from '../i18n/LangProvider'
import type { MessageKey } from '../i18n/id'

const skillKey = (id: string) => `skills.${id}` as MessageKey

function pairedWith(active: string | null): Set<string> {
  const out = new Set<string>()
  if (!active) return out
  for (const [d, c] of pairs) {
    if (d === active) out.add(c)
    if (c === active) out.add(d)
  }
  return out
}

export function Skills() {
  const t = useT()
  const [active, setActive] = useState<string | null>(null)
  const paired = pairedWith(active)

  const item = (id: string) => (
    <li
      key={id}
      tabIndex={0}
      data-paired={paired.has(id)}
      onMouseEnter={() => setActive(id)}
      onMouseLeave={() => setActive(null)}
      onFocus={() => setActive(id)}
      onBlur={() => setActive(null)}
      className="border-t border-line px-2 py-2.5 transition-colors data-[paired=true]:bg-select/15 hover:bg-select/10 focus-visible:bg-select/10"
    >
      {t(skillKey(id))}
    </li>
  )

  return (
    <section
      id="keahlian"
      aria-labelledby="skills-h"
      className="mx-auto w-full max-w-[1120px] border-t border-line px-[clamp(16px,4vw,40px)] py-[clamp(56px,8vw,104px)]"
    >
      <Reveal>
        <div className="mb-[clamp(32px,5vw,56px)] max-w-[40em]">
          <h2 id="skills-h" className="text-[clamp(30px,4vw,44px)] font-extrabold tracking-[-0.025em]">
            {t('skills.title')}
          </h2>
          <p className="mt-3 text-lg text-muted">{t('skills.intro')}</p>
        </div>
      </Reveal>
      <Reveal>
        <div className="grid grid-cols-1 rounded-lg border border-line bg-surface p-[clamp(24px,4vw,44px)] md:grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)]">
          <div>
            <h3 className="mb-3.5 text-[22px] font-extrabold">{t('skills.design')}</h3>
            <ul className="m-0 list-none p-0">{designSkills.map(item)}</ul>
          </div>
          <div
            aria-hidden="true"
            className="relative h-14 md:h-auto before:absolute before:inset-y-0 before:left-1/2 before:w-[1.5px] before:bg-select after:absolute after:left-1/2 after:top-1/2 after:size-[11px] after:-translate-x-1/2 after:-translate-y-1/2 after:rotate-45 after:bg-select-strong"
          />
          <div>
            <h3 className="mb-3.5 text-[22px] font-extrabold">{t('skills.code')}</h3>
            <ul className="m-0 list-none p-0">{codeSkills.map(item)}</ul>
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div className="mt-12">
          <h3 className="mb-3 text-xl font-bold">{t('skills.certs')}</h3>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {certs.map((c) => (
              <li key={c} className="rounded-md border border-line bg-surface px-3 py-[7px] text-[14.5px]">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}
