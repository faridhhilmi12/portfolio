import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useCanvasMotion } from './useCanvasMotion'

export function Reveal({ delay = 0, children }: { delay?: number; children: ReactNode }) {
  const { animate } = useCanvasMotion()
  if (!animate) return <div>{children}</div>
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}
