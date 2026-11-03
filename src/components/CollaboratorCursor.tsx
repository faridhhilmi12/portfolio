import { useEffect, useRef, useState, type RefObject } from 'react'
import { motion } from 'motion/react'
import { useCanvasMotion } from '../canvas/useCanvasMotion'
import { useT } from '../i18n/LangProvider'

const STEP_MS = 2600

function centerOf(el: HTMLElement | null, parent: HTMLElement): { x: number; y: number } | null {
  if (!el) return null
  const r = el.getBoundingClientRect()
  const p = parent.getBoundingClientRect()
  return { x: r.left - p.left + r.width / 2, y: r.top - p.top + r.height / 2 }
}

/** Kursor kolaborator dekoratif yang berpindah antar target. Hanya untuk perangkat dengan mouse. */
export function CollaboratorCursor({ targets }: { targets: RefObject<HTMLElement | null>[] }) {
  const { animate, finePointer } = useCanvasMotion()
  const t = useT()
  const ref = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [pos, setPos] = useState<{ x: number; y: number; instant: boolean } | null>(null)
  const enabled = animate && finePointer

  useEffect(() => {
    if (!enabled || targets.length === 0) return
    const id = window.setInterval(() => setStep((s) => (s + 1) % targets.length), STEP_MS)
    return () => window.clearInterval(id)
  }, [enabled, targets.length])

  useEffect(() => {
    const parent = ref.current?.offsetParent as HTMLElement | null
    if (!enabled || !parent) return
    const next = centerOf(targets[step]?.current ?? null, parent)
    if (next) setPos((prev) => ({ ...next, instant: prev === null }))
  }, [enabled, step, targets])

  if (!enabled) return null

  const resting = targets.length > 0 && step === targets.length - 1
  return (
    <motion.div
      ref={ref}
      data-testid="collaborator-cursor"
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 top-0 z-20 hidden transition-opacity duration-300 md:block ${
        pos ? 'opacity-100' : 'opacity-0'
      }`}
      initial={false}
      animate={{ x: pos?.x ?? 0, y: pos?.y ?? 0 }}
      transition={pos?.instant ? { duration: 0 } : { type: 'spring', stiffness: 50, damping: 16 }}
    >
      <svg width="18" height="22" viewBox="0 0 18 22" className="text-select drop-shadow">
        <path d="M1 1l15 9.5-6.6 1.7L6.6 20 1 1z" fill="currentColor" stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <span className="ml-3.5 -mt-0.5 inline-block rounded-full rounded-tl-none bg-select-strong px-2 py-0.5 text-xs font-semibold text-white">
        Farid
      </span>
      {resting && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ml-3.5 mt-1 block w-max rounded-xl rounded-tl-none border border-line bg-paper px-2.5 py-1 text-xs font-medium text-ink shadow-sm"
        >
          {t('hero.cursor')}
        </motion.span>
      )}
    </motion.div>
  )
}
