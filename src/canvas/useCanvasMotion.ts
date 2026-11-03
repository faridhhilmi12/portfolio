import { useMedia } from '../lib/useMedia'

/** animate: gerak boleh jalan. finePointer: ada mouse (kursor, parallax, drag). */
export function useCanvasMotion(): { animate: boolean; finePointer: boolean } {
  const reduced = useMedia('(prefers-reduced-motion: reduce)')
  const finePointer = useMedia('(hover: hover) and (pointer: fine)')
  return { animate: !reduced, finePointer }
}
