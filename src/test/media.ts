interface MediaOpts {
  reducedMotion?: boolean
  finePointer?: boolean
  dark?: boolean
}

/** Installs window.matchMedia answering the three queries the app uses; any other query is false. */
export function mockMedia({ reducedMotion = false, finePointer = false, dark = false }: MediaOpts = {}): void {
  window.matchMedia = (query: string): MediaQueryList => {
    const matches =
      query.includes('prefers-reduced-motion') ? reducedMotion
      : query.includes('hover: hover') ? finePointer
      : query.includes('prefers-color-scheme: dark') ? dark
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
