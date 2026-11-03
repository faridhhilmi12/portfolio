import type { Wire } from '../data/projects'

const box = 'fill-line-strong'
const soft = 'fill-line'
const accent = 'fill-select'

/** Ilustrasi wireframe abstrak, dekoratif. Bukan tangkapan layar proyek. */
export function Wireframe({ kind }: { kind: Wire }) {
  return (
    <svg
      data-testid="wireframe"
      aria-hidden="true"
      viewBox="0 0 160 100"
      className="size-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="160" height="100" className="fill-surface" />
      {kind === 'app' && (
        <>
          <rect x="12" y="10" width="136" height="10" rx="3" className={box} />
          <rect x="12" y="28" width="64" height="30" rx="4" className={soft} />
          <rect x="84" y="28" width="64" height="30" rx="4" className={soft} />
          <rect x="12" y="66" width="100" height="6" rx="3" className={box} />
          <rect x="12" y="78" width="70" height="6" rx="3" className={soft} />
          <rect x="118" y="66" width="30" height="18" rx="4" className={accent} />
        </>
      )}
      {kind === 'dashboard' && (
        <>
          <rect x="12" y="10" width="40" height="22" rx="4" className={soft} />
          <rect x="60" y="10" width="40" height="22" rx="4" className={soft} />
          <rect x="108" y="10" width="40" height="22" rx="4" className={soft} />
          <rect x="16" y="78" width="12" height="12" rx="2" className={box} />
          <rect x="36" y="66" width="12" height="24" rx="2" className={box} />
          <rect x="56" y="54" width="12" height="36" rx="2" className={accent} />
          <rect x="76" y="62" width="12" height="28" rx="2" className={box} />
          <rect x="96" y="46" width="12" height="44" rx="2" className={box} />
          <rect x="116" y="58" width="12" height="32" rx="2" className={box} />
        </>
      )}
      {kind === 'lms' && (
        <>
          <rect x="0" y="0" width="38" height="100" className={soft} />
          <rect x="8" y="12" width="22" height="5" rx="2" className={box} />
          <rect x="8" y="24" width="22" height="5" rx="2" className={accent} />
          <rect x="8" y="36" width="22" height="5" rx="2" className={box} />
          <rect x="48" y="12" width="100" height="10" rx="3" className={box} />
          <rect x="48" y="32" width="100" height="14" rx="3" className={soft} />
          <rect x="48" y="52" width="100" height="14" rx="3" className={soft} />
          <rect x="48" y="72" width="100" height="14" rx="3" className={soft} />
        </>
      )}
      {kind === 'site' && (
        <>
          <rect x="12" y="8" width="136" height="8" rx="3" className={box} />
          <rect x="12" y="24" width="136" height="34" rx="4" className={soft} />
          <rect x="22" y="34" width="60" height="7" rx="3" className={box} />
          <rect x="22" y="46" width="24" height="7" rx="3" className={accent} />
          <rect x="12" y="66" width="42" height="24" rx="4" className={soft} />
          <rect x="59" y="66" width="42" height="24" rx="4" className={soft} />
          <rect x="106" y="66" width="42" height="24" rx="4" className={soft} />
        </>
      )}
    </svg>
  )
}
