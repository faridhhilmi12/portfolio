interface MediaOpts {
  reducedMotion?: boolean
  finePointer?: boolean
  dark?: boolean
  /** viewport selebar md ke atas (min-width: 768px); bawaan false = layout mobile */
  wide?: boolean
}

/** Installs window.matchMedia answering the queries the app uses; any other query is false. */
export function mockMedia({ reducedMotion = false, finePointer = false, dark = false, wide = false }: MediaOpts = {}): void {
  window.matchMedia = (query: string): MediaQueryList => {
    const matches =
      query.includes('prefers-reduced-motion') ? reducedMotion
      : query.includes('hover: hover') ? finePointer
      : query.includes('prefers-color-scheme: dark') ? dark
      : query.includes('min-width: 768px') ? wide
      : false
    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList
  }
}
