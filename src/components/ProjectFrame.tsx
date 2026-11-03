import { useState } from 'react'
import { SelectionBox } from '../canvas/SelectionBox'
import { projectKey, type Project } from '../data/projects'
import { useT } from '../i18n/LangProvider'
import { Wireframe } from './Wireframe'

interface ProjectFrameProps {
  project: Project
  selected: boolean
  onSelect(): void
}

export function ProjectFrame({ project, selected, onSelect }: ProjectFrameProps) {
  const t = useT()
  const [imageFailed, setImageFailed] = useState(false)
  const title = t(projectKey(project.id, 'title'))
  const showImage = project.image && !imageFailed

  return (
    <div data-testid="project-frame" className="pb-8">
      <p className="mb-2 text-sm font-medium text-muted">
        {title} · {project.year}
      </p>
      <button
        type="button"
        aria-pressed={selected}
        aria-label={title}
        onClick={onSelect}
        className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
      >
        <SelectionBox selected={selected} badge={t(projectKey(project.id, 'role'))} className="block!">
          <div
            className={`aspect-[16/10] w-full overflow-hidden rounded transition-shadow hover:shadow-lg ${
              project.isPrivate ? 'border-[1.5px] border-dashed border-dash' : 'border border-line'
            }`}
          >
            {showImage ? (
              <img
                src={project.image}
                alt={title}
                onError={() => setImageFailed(true)}
                className="size-full object-cover"
              />
            ) : (
              <Wireframe kind={project.wire} />
            )}
          </div>
        </SelectionBox>
      </button>
    </div>
  )
}
