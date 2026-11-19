import type { ReactNode } from 'react'
import { NIVEIS, type Nivel } from '@termovida/shared'

/* --------------------------------------------------------------- ícones */

const svg = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function IconeAlerta({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...svg} strokeWidth="2.6" aria-hidden="true">
      <path d="M12 4v9" />
      <path d="M12 18h.01" />
    </svg>
  )
}

export function IconeCheck({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...svg} strokeWidth="2.6" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export function IconeEscudo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...svg} strokeWidth="2.2" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z" />
    </svg>
  )
}

export function IconeEstacao({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="var(--tv-bg)" stroke="var(--tv-ink)" strokeWidth="4" />
      <circle cx="12" cy="12" r="4" fill="var(--tv-ink)" />
    </svg>
  )
}

/* ------------------------------------------------------------ cartões */

export function Card({
  titulo,
  sub,
  children,
  variante,
  className = '',
  acao,
}: {
  titulo?: string
  sub?: ReactNode
  children: ReactNode
  variante?: 'teal' | 'risco'
  className?: string
  acao?: ReactNode
}) {
  const cls = ['card', variante ? `card--${variante}` : '', className].filter(Boolean).join(' ')
  return (
    <section className={cls}>
      {titulo && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'baseline' }}>
          <h2 className="card__titulo">{titulo}</h2>
          {acao && (
            <>
              <span className="cresce" />
              {acao}
            </>
          )}
        </div>
      )}
      {sub && <p className="card__sub">{sub}</p>}
      {children}
    </section>
  )
}

export function Kpi({
  rotulo,
  valor,
  unidade,
  nota,
  notaTipo,
  tom,
  progresso,
  progressoCor,
}: {
  rotulo: string
  valor: string
  unidade?: string
  nota?: ReactNode
  notaTipo?: 'risco' | 'ok'
  tom?: 'teal' | 'risco'
  progresso?: number
  progressoCor?: string
}) {
  return (
    <div className="card kpi">
      <span className="kpi__rotulo">{rotulo}</span>
      <span className={`kpi__valor${tom ? ` kpi__valor--${tom}` : ''}`}>
        {valor}
        {unidade && <span className="kpi__unidade">{unidade}</span>}
      </span>
      {progresso !== undefined && (
        <span className="barra barra--fina" style={{ marginTop: 3 }}>
          <span
            className="barra__preenche"
            style={{ width: `${progresso * 100}%`, background: progressoCor ?? 'var(--tv-teal-600)' }}
          />
        </span>
      )}
      {nota && (
        <span className={`kpi__nota${notaTipo ? ` kpi__nota--${notaTipo}` : ''}`}>{nota}</span>
      )}
    </div>
  )
}

/* ------------------------------------------------------------ etiquetas */

export function EtiquetaNivel({ nivel, grande = false }: { nivel: Nivel; grande?: boolean }) {
  const n = NIVEIS[nivel]
  return (
    <span
      className={`nivel${grande ? ' nivel--grande' : ''}`}
      style={{ background: n.fill, color: n.ink }}
    >
      {n.rotulo}
    </span>
  )
}

/* -------------------------------------------------------------- barras */

export function Barra({
  valor,
  cor = 'var(--tv-teal-600)',
  grossa = false,
}: {
  valor: number
  cor?: string
  grossa?: boolean
}) {
  const pct = Math.max(0, Math.min(1, valor))
  return (
    <span className={`barra${grossa ? ' barra--grossa' : ''}`}>
      <span className="barra__preenche" style={{ width: `${pct * 100}%`, background: cor }} />
    </span>
  )
}

export function BarraRotulada({
  rotulo,
  valorTexto,
  fracao,
  cor,
  tomValor,
  nota,
}: {
  rotulo: string
  valorTexto: string
  fracao: number
  cor: string
  tomValor?: string
  nota?: ReactNode
}) {
  return (
    <li>
      <span className="barras__cabeca">
        <b>{rotulo}</b>
        <b className="barras__valor" style={{ color: tomValor ?? 'var(--tv-ink)' }}>
          {valorTexto}
        </b>
      </span>
      <span style={{ display: 'block', marginTop: 4 }}>
        <Barra valor={fracao} cor={cor} grossa />
      </span>
      {nota && (
        <span style={{ display: 'block', marginTop: 4, fontSize: 12, color: 'var(--tv-muted)' }}>
          {nota}
        </span>
      )}
    </li>
  )
}
