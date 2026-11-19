import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { EVENTO } from '@termovida/shared'
import { Logo, Marca } from '@termovida/shared/Logo'
import { VisaoGeral } from './rotas/VisaoGeral'
import { Mapa } from './rotas/Mapa'
import { Alertas } from './rotas/Alertas'
import { Visitas } from './rotas/Visitas'
import { Analise } from './rotas/Analise'

const SECOES = [
  { to: '/', rotulo: 'Visão geral', fim: true },
  { to: '/mapa', rotulo: 'Mapa de risco' },
  { to: '/alertas', rotulo: 'Alertas' },
  { to: '/visitas', rotulo: 'Visitas' },
  { to: '/analise', rotulo: 'Análise' },
]

function Topo() {
  return (
    <header className="topo">
      <NavLink to="/" className="topo__marca">
        <Logo />
        <Marca />
      </NavLink>
      <span className="topo__divisor" />
      <span className="topo__produto">Painel do gestor</span>
      <span className="cresce" />
      <span className="topo__meta">
        Atualizado hoje, {EVENTO.hojeRotulo.replace('qui ', '')} às {EVENTO.horaDisparo}
      </span>
      <span className="topo__usuario">
        <span className="avatar" aria-hidden="true">
          CR
        </span>
        {EVENTO.regiao}
      </span>
    </header>
  )
}

function Nav() {
  return (
    <nav className="nav" aria-label="Seções do painel">
      {SECOES.map((s) => (
        <NavLink
          key={s.to}
          to={s.to}
          end={s.fim}
          className={({ isActive }) => `nav__item${isActive ? ' nav__item--ativo' : ''}`}
        >
          {s.rotulo}
        </NavLink>
      ))}
    </nav>
  )
}

export function App() {
  return (
    <div className="app">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Topo />
      <Nav />
      <main className="conteudo" id="conteudo">
        <Routes>
          <Route path="/" element={<VisaoGeral />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/visitas" element={<Visitas />} />
          <Route path="/analise" element={<Analise />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
