/** Marca do TermoVida: o sol (calor) sobre o arco (cuidado e abrigo). */
export function Logo({
  size = 30,
  arco = 'var(--tv-teal-600)',
  title = 'TermoVida',
}: {
  size?: number
  /** Cor do arco — branco quando a marca está sobre o teal escuro. */
  arco?: string
  title?: string
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={title}>
      <circle cx="32" cy="27" r="13" fill="var(--tv-amber)" />
      <g stroke="var(--tv-coral)" strokeWidth="6" strokeLinecap="round">
        <line x1="32" y1="3" x2="32" y2="10" />
        <line x1="14" y1="10" x2="19" y2="15" />
        <line x1="50" y1="10" x2="45" y2="15" />
        <line x1="5" y1="27" x2="12" y2="27" />
        <line x1="59" y1="27" x2="52" y2="27" />
      </g>
      <path d="M8 38a24 24 0 0 0 48 0" fill="none" stroke={arco} strokeWidth="8" strokeLinecap="round" />
    </svg>
  )
}

export function Marca({ size = 19 }: { size?: number }) {
  return (
    <span style={{ fontSize: size, fontWeight: 700, color: 'var(--tv-ink)', letterSpacing: '-0.2px' }}>
      Termo<span style={{ color: 'var(--tv-teal-900)' }}>Vida</span>
    </span>
  )
}
