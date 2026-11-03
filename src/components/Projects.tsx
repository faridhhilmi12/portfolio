import { useState } from 'react'
import { Reveal } from '../canvas/Reveal'
import { projects, type Project } from '../data/projects'
import { useT } from '../i18n/LangProvider'
import { useMedia } from '../lib/useMedia'
import { Inspect } from './Inspect'
import { ProjectFrame } from './ProjectFrame'

export function Projects() {
  const t = useT()
  const [selectedId, setSelectedId] = useState<Project['id']>('p1')
  const wide = useMedia('(min-width: 768px)')
  const selected = projects.find((p) => p.id === selectedId) ?? projects[0]

  return (
    <section
      id="karya"
      aria-labelledby="karya-h"
      className="mx-auto w-full max-w-[1120px] border-t border-line px-[clamp(16px,4vw,40px)] py-[clamp(56px,8vw,104px)]"
    >
      <Reveal>
        <div className="mb-[clamp(32px,5vw,56px)] max-w-[40em]">
          <h2 id="karya-h" className="text-[clamp(30px,4vw,44px)] font-extrabold tracking-[-0.025em]">
            {t('work.title')}
          </h2>
          <p className="mt-3 text-lg text-muted">{t('work.intro')}</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.05}>
            <ProjectFrame
              project={project}
              selected={project.id === selected.id}
              onSelect={() => setSelectedId(project.id)}
            />
            {!wide && project.id === selected.id && <Inspect project={selected} />}
          </Reveal>
        ))}
      </div>

      {wide && (
        <div className="mt-4">
          <Inspect project={selected} />
        </div>
      )}
    </section>
  )
}
