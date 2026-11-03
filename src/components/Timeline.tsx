import { Reveal } from '../canvas/Reveal'
import { experience } from '../data/experience'
import { useT } from '../i18n/LangProvider'
import type { MessageKey } from '../i18n/id'

const key = (id: string, field: 'date' | 'title' | 'org' | 'desc') => `exp.${id}.${field}` as MessageKey

export function Timeline() {
  const t = useT()
  return (
    <section
      id="pengalaman"
      aria-labelledby="exp-h"
      className="mx-auto w-full max-w-[1120px] border-t border-line px-[clamp(16px,4vw,40px)] py-[clamp(56px,8vw,104px)]"
    >
      <Reveal>
        <h2 id="exp-h" className="mb-[clamp(32px,5vw,56px)] text-[clamp(30px,4vw,44px)] font-extrabold tracking-[-0.025em]">
          {t('exp.title')}
        </h2>
      </Reveal>
      <ol className="m-0 list-none p-0">
        {experience.map(({ id }) => (
          <li
            key={id}
            className="grid grid-cols-1 gap-2 border-t border-line py-6 md:grid-cols-[130px_minmax(0,1fr)] md:gap-x-10 lg:grid-cols-[170px_minmax(0,1fr)]"
          >
            <p className="pt-[3px] text-[14.5px] tabular-nums text-muted">{t(key(id, 'date'))}</p>
            <div>
              <h3 className="text-xl font-bold">{t(key(id, 'title'))}</h3>
              <p className="mb-2 mt-0.5 text-muted">{t(key(id, 'org'))}</p>
              <p className="max-w-[38em]">{t(key(id, 'desc'))}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
