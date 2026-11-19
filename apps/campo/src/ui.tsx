import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useEstado } from './estado'

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

type P = { size?: number }

export const IconeVoltar = ({ size = 25 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2.6">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

export const IconeAlerta = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2.6">
    <path d="M12 4v9" />
    <path d="M12 18h.01" />
  </svg>
)

export const IconeCheck = ({ size = 24 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="3">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

export const IconeSync = ({ size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2.4">
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
)

export const IconeSemRede = ({ size = 17 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2.4">
    <path d="M1 1l22 22" />
    <path d="M5 12.5a11 11 0 0 1 4-2.6" />
    <path d="M12 20h.01" />
    <path d="M15.5 10.9a11 11 0 0 1 3.5 1.6" />
  </svg>
)

export const IconeRede = ({ size = 17 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2.4">
    <path d="M2 8.8a16 16 0 0 1 20 0" />
    <path d="M5 12.6a11 11 0 0 1 14 0" />
    <path d="M8.5 16.3a6 6 0 0 1 7 0" />
    <path d="M12 20h.01" />
  </svg>
)

export const IconeAgenda = ({ size = 23 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2.3">
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect x="3" y="5" width="18" height="17" rx="3" />
    <path d="M3 11h18" />
  </svg>
)

export const IconePessoa = ({ size = 23 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2.3">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
)

export const IconeMapa = ({ size = 19 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2.4">
    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
)

export const IconeTelefone = ({ size = 19 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2.4">
    <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A17 17 0 0 1 4 5.1 1 1 0 0 1 5 4z" />
  </svg>
)

export const IconeCadeado = ({ size = 19 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2.3">
    <rect x="4" y="10" width="16" height="11" rx="2.5" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
)

export const IconeInfo = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2.3">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v5" />
    <path d="M12 16h.01" />
  </svg>
)

export const IconeEscudo = ({ size = 24 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2.2">
    <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z" />
  </svg>
)

/* ------------------------------------------------------ estado da rede */

/** O estado offline fica sempre à vista — regra do produto. */
export function FaixaRede() {
  const { online } = useEstado()
  return (
    <div className={`rede rede--${online ? 'online' : 'offline'}`} role="status">
      {online ? <IconeRede /> : <IconeSemRede />}
      <span style={{ flexGrow: 1 }}>
        {online ? 'Conectado — dá para enviar os registros' : 'Sem internet — trabalhando offline'}
      </span>
    </div>
  )
}

export function ChipRede() {
  const { online } = useEstado()
  return (
    <span className="chip-rede" role="status">
      {online ? <IconeRede size={15} /> : <IconeSemRede size={15} />}
      {online ? 'Online' : 'Offline'}
    </span>
  )
}

/* -------------------------------------------------------- barra do topo */

export function BarraVoltar({
  titulo,
  meta,
  para = '/hoje',
  direita,
}: {
  titulo: string
  meta?: string
  para?: string
  direita?: ReactNode
}) {
  return (
    <div className="barra-app">
      <div className="barra-app__linha">
        <Link to={para} className="voltar" aria-label="Voltar">
          <IconeVoltar />
        </Link>
        <span style={{ flexGrow: 1, minWidth: 0 }}>
          <b className="barra-app__titulo">{titulo}</b>
          {meta && <span className="barra-app__meta">{meta}</span>}
        </span>
        {direita ?? <ChipRede />}
      </div>
    </div>
  )
}

/* ----------------------------------------------------- navegação inferior */

export function NavInferior({ atual }: { atual: 'hoje' | 'fila' | 'sair' }) {
  const { fila } = useEstado()
  return (
    <nav className="nav-inferior" aria-label="Navegação">
      <Link to="/hoje" className={atual === 'hoje' ? 'ativo' : undefined} aria-current={atual === 'hoje' ? 'page' : undefined}>
        <IconeAgenda />
        Hoje
      </Link>
      <Link to="/fila" className={atual === 'fila' ? 'ativo' : undefined} aria-current={atual === 'fila' ? 'page' : undefined}>
        <IconeSync size={23} />
        Fila offline{fila.length > 0 ? ` (${fila.length})` : ''}
      </Link>
      <Link to="/" className={atual === 'sair' ? 'ativo' : undefined}>
        <IconePessoa />
        Sair
      </Link>
    </nav>
  )
}
