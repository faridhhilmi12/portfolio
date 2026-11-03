import { useEffect, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useCanvasMotion } from './useCanvasMotion'

const MAX_SHIFT = 8

export function DotGrid({ className = '', children }: { className?: string; children?: ReactNode }) {
  const { animate, finePointer } = useCanvasMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 })
  const y = useSpring(useMotionValue(0), { stiffness: 80, damping: 20 })
  const parallax = animate && finePointer

  useEffect(() => {
    if (!parallax) return
    const onMove = (e: PointerEvent) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 2 * MAX_SHIFT)
      y.set((e.clientY / window.innerHeight - 0.5) * 2 * MAX_SHIFT)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [parallax, x, y])

  return (
    <div className={`relative isolate ${className}`}>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 -z-10 opacity-70"
        style={{
          x,
          y,
          backgroundImage: 'radial-gradient(circle, var(--c-line-strong) 1px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />
      {children}
    </div>
  )
}
