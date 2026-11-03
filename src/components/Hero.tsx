import { useRef } from 'react'
import { motion } from 'motion/react'
import { CollaboratorCursor } from './CollaboratorCursor'
import { DotGrid } from '../canvas/DotGrid'
import { SelectionBox } from '../canvas/SelectionBox'
import { useCanvasMotion } from '../canvas/useCanvasMotion'
import { useT } from '../i18n/LangProvider'

const GUTTER = 'px-[clamp(16px,4vw,40px)]'

export function Hero() {
  const t = useT()
  const { animate, finePointer } = useCanvasMotion()
  const draggable = animate && finePointer
  const nameRef = useRef<HTMLHeadingElement>(null)
  const photoRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const cursorTargets = [nameRef, photoRef, ctaRef]

  const photo = (
    <>
      <img
        src="/assets/farid.jpg"
        width={900}
        height={1193}
        alt={t('hero.alt')}
        fetchPriority="high"
        decoding="async"
        draggable={false}
        className="aspect-square w-full rounded bg-surface object-cover object-[50%_30%] md:aspect-[4/5]"
      />
      <figcaption className="mt-2.5 text-sm text-muted">{t('hero.caption')}</figcaption>
    </>
  )
  const photoClass = 'order-first m-0 w-full max-w-[200px] justify-self-start md:order-none md:max-w-[330px] md:justify-self-end'

  return (
    <DotGrid>
      <header
        className={`mx-auto grid w-full max-w-[1120px] grid-cols-1 items-center gap-[clamp(32px,6vw,80px)] pb-[clamp(56px,9vw,120px)] pt-[clamp(48px,9vw,112px)] md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] ${GUTTER}`}
      >
        <div>
          <p className="mb-2.5 text-[13px] font-medium text-muted">{t('hero.frame')}</p>
          <SelectionBox showSize badge={t('hero.badge')} className="-ml-2.5 px-2.5 pb-2.5 pt-2 md:-ml-3.5 md:px-3.5 md:pb-3 md:pt-2.5">
            <h1 ref={nameRef} className="text-[clamp(44px,7.4vw,92px)] font-extrabold leading-[0.98] tracking-[-0.035em]">
              Muhammad{' '}
              <br />
              Farid Hilmi
            </h1>
          </SelectionBox>
          <div aria-hidden="true" className="relative ml-[22px] h-12 w-px bg-select-strong max-md:hidden before:absolute before:left-[-4px] before:top-0 before:h-px before:w-[9px] before:bg-select-strong after:absolute after:bottom-0 after:left-[-4px] after:h-px after:w-[9px] after:bg-select-strong">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 rounded-[3px] bg-select-strong px-[5px] py-px text-[11px] font-semibold tabular-nums text-white">
              48
            </span>
          </div>
          <p className="mt-11 max-w-[34em] text-[clamp(17px,1.6vw,19px)] text-muted md:mt-0">{t('hero.lead')}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              ref={ctaRef}
              href="#karya"
              className="inline-flex min-h-[46px] items-center justify-center rounded-lg border-[1.5px] border-transparent bg-ink px-5 text-[15.5px] font-semibold text-paper no-underline transition-colors hover:bg-select-strong hover:text-white active:translate-y-px"
            >
              {t('hero.cta1')}
            </a>
            <a
              href="#kontak"
              className="inline-flex min-h-[46px] items-center justify-center rounded-lg border-[1.5px] border-ink px-5 text-[15.5px] font-semibold no-underline transition-colors hover:bg-ink hover:text-paper active:translate-y-px"
            >
              {t('hero.cta2')}
            </a>
          </div>
        </div>
        {draggable ? (
          <motion.figure
            ref={photoRef}
            data-drag="true"
            drag
            dragSnapToOrigin
            dragElastic={0.2}
            whileDrag={{ scale: 1.02 }}
            className={`${photoClass} cursor-grab active:cursor-grabbing`}
          >
            {photo}
          </motion.figure>
        ) : (
          <figure ref={photoRef} data-drag="false" className={photoClass}>
            {photo}
          </figure>
        )}
      </header>
      <CollaboratorCursor targets={cursorTargets} />
    </DotGrid>
  )
}
