import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { useCanvasMotion } from './useCanvasMotion'

interface SelectionBoxProps {
  selected?: boolean
  badge?: ReactNode
  showSize?: boolean
  className?: string
  children: ReactNode
}

const HANDLES = [
  '-top-1 -left-1',
  '-top-1 -right-1',
  '-bottom-1 -left-1',
  '-bottom-1 -right-1',
] as const

export function SelectionBox({ selected = true, badge, showSize = false, className = '', children }: SelectionBoxProps) {
  const { animate } = useCanvasMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    if (!showSize || !ref.current) return
    const ro = new ResizeObserver((entries) => {
      const e = entries[0]
      const box = e.borderBoxSize?.[0]
      setSize({ w: box?.inlineSize ?? e.contentRect.width, h: box?.blockSize ?? e.contentRect.height })
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [showSize])

  const pop = animate
    ? { initial: { opacity: 0, scale: 0.6 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.85, duration: 0.3 } }
    : {}

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      {children}
      {selected && (
        <>
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 border-[1.5px] border-select"
            {...(animate
              ? {
                  initial: { clipPath: 'inset(0 100% 100% 0)' },
                  animate: { clipPath: 'inset(0 0% 0% 0)' },
                  transition: { delay: 0.25, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const },
                }
              : {})}
          />
          {HANDLES.map((pos) => (
            <motion.span
              key={pos}
              data-testid="handle"
              aria-hidden="true"
              className={`pointer-events-none absolute size-[9px] border-[1.5px] border-select bg-paper ${pos}`}
              {...pop}
            />
          ))}
          {badge && (
            <motion.span
              className="absolute left-1/2 top-full -translate-x-1/2 translate-y-2.5 whitespace-nowrap rounded bg-select-strong px-2 py-[3px] text-[12.5px] font-semibold text-white"
              {...pop}
            >
              {badge}
            </motion.span>
          )}
          {showSize && size && (
            <motion.span
              data-testid="size-label"
              aria-hidden="true"
              className="absolute right-0 top-full mt-2 rounded bg-select-strong px-1.5 py-px text-[11px] font-semibold tabular-nums text-white"
              {...pop}
            >
              {`${Math.round(size.w)} × ${Math.round(size.h)}`}
            </motion.span>
          )}
        </>
      )}
    </div>
  )
}
