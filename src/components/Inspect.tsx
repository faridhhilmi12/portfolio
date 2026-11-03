import { projectKey, type Project } from '../data/projects'
import { useT } from '../i18n/LangProvider'

export function Inspect({ project }: { project: Project }) {
  const t = useT()
  return (
    <section
      aria-labelledby="inspect-h"
      aria-live="polite"
      className="rounded-lg border border-line bg-surface p-[clamp(20px,3vw,32px)]"
    >
      <h3 id="inspect-h" className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
        {t('inspect.title')}
      </h3>
      <p className="mt-3 text-[clamp(22px,2.4vw,28px)] font-bold tracking-tight">{t(projectKey(project.id, 'title'))}</p>
      <p className="mt-1 text-[15px] font-semibold text-muted">{t(projectKey(project.id, 'sub'))}</p>
      <dl className="mt-5 grid gap-x-8 gap-y-4 md:grid-cols-[120px_minmax(0,1fr)]">
        <dt className="text-sm font-semibold text-muted">{t('inspect.role')}</dt>
        <dd className="m-0">{t(projectKey(project.id, 'role'))}</dd>
        <dt className="text-sm font-semibold text-muted">{t('inspect.about')}</dt>
        <dd className="m-0 max-w-[36em] text-body">
          <p>{t(projectKey(project.id, 'desc'))}</p>
          {project.isPrivate && (
            <p className="mt-3.5 rounded-md border-[1.5px] border-dashed border-dash px-3.5 py-2.5 text-[14.5px] text-muted">
              {t(projectKey(project.id, 'note'))}
            </p>
          )}
        </dd>
        <dt className="text-sm font-semibold text-muted">{t('inspect.stack')}</dt>
        <dd className="m-0">
          <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-paper px-2.5 py-1 text-[13px] font-medium">
                {tag}
              </li>
            ))}
          </ul>
        </dd>
      </dl>
    </section>
  )
}
