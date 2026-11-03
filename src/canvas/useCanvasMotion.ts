import { useEffect, useState } from 'react'

function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/** animate: gerak boleh jalan. finePointer: ada mouse (kursor, parallax, drag). */
export function useCanvasMotion(): { animate: boolean; finePointer: boolean } {
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const finePointer = useMedia('(hover: hover) and (pointer: fine)')
  return { animate: !reduced, finePointer }
}
