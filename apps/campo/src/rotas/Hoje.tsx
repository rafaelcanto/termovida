import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AGENTE, EVENTO, grau, infoNivel, type Idoso } from '@termovida/shared'
import { Logo } from '@termovida/shared/Logo'
import { useEstado } from '../estado'
import {
  FaixaRede,
  IconeAlerta,
  IconeCheck,
  IconeSync,
  NavInferior,
} from '../ui'

type Filtro = 'todas' | 'ajuda' | 'pendentes'

const ROTULO_MOTIVO: Record<string, { texto: string; urgente: boolean }> = {
  'pediu-ajuda': { texto: 'Apertou 1 — pediu ajuda', urgente: true },
  'nao-atendeu': { texto: 'Não atendeu a ligação', urgente: false },
  'sem-sinal': { texto: 'Só telefone fixo / sem sinal', urgente: false },
}

const ROTULO_RESULTADO: Record<string, { texto: string; urgente: boolean }> = {
  'sem-intercorrencia': { texto: 'sem intercorrência', urgente: false },
  'encaminhada-ubs': { texto: 'encaminhada à UBS', urgente: true },
  'samu-192': { texto: 'SAMU 192 acionado', urgente: true },
  ausente: { texto: 'ausente, voltar hoje', urgente: false },
}

function CartaoVisita({ idoso, posicao }: { idoso: Idoso; posicao: number }) {
  const pediuAjuda = idoso.motivos.includes('pediu-ajuda')

  if (idoso.status === 'feita') {
    const r = idoso.resultado ? ROTULO_RESULTADO[idoso.resultado] : undefined
    return (
      <li>
        <Link to={`/idoso/${idoso.id}`} className="visita visita--feita">
          <span className="visita__topo">
            <span
              className="visita__posicao visita__posicao--feita"
              style={r?.urgente ? { background: 'var(--tv-coral-100)' } : undefined}
              aria-hidden="true"
            >
              {r?.urgente ? (
                <span style={{ color: 'var(--tv-red-900)', display: 'flex' }}>
                  <IconeAlerta size={24} />
                </span>
              ) : (
                <span style={{ color: 'var(--tv-teal-900)', display: 'flex' }}>
                  <IconeCheck />
                </span>
              )}
            </span>
            <span style={{ flexGrow: 1, minWidth: 0 }}>
              <b className="visita__nome" style={{ fontSize: 17 }}>
                {idoso.nome}, {idoso.idade}
              </b>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: r?.urgente ? 'var(--tv-red-900)' : 'var(--tv-teal-900)',
                }}
              >
                {idoso.horaVisita ? `Visitada às ${idoso.horaVisita} · ` : ''}
                {r?.texto}
              </span>
            </span>
          </span>
        </Link>
      </li>
    )
  }

  return (
    <li>
      <Link
        to={`/idoso/${idoso.id}`}
        className={`visita${pediuAjuda ? ' visita--urgente' : ''}`}
      >
        <span className="visita__topo">
          <span
            className={`visita__posicao${pediuAjuda ? '' : ' visita__posicao--morno'}`}
            aria-hidden="true"
          >
            {posicao}º
          </span>
          <span style={{ flexGrow: 1, minWidth: 0 }}>
            <b className="visita__nome">
              {idoso.nome}, {idoso.idade}
            </b>
            <span className="visita__endereco">{idoso.endereco}</span>
          </span>
        </span>

        <span className="visita__etiquetas">
          {idoso.motivos.map((m) => {
            const r = ROTULO_MOTIVO[m]
            return (
              <span
                key={m}
                className="etiqueta"
                style={{
                  background: r.urgente ? 'var(--tv-red-900)' : 'var(--tv-amber)',
                  color: r.urgente ? '#fff' : 'var(--tv-ink)',
                }}
              >
                {r.texto}
              </span>
            )
          })}
          {idoso.moraSozinho && (
            <span className="etiqueta etiqueta--contexto">
              Mora {idoso.genero === 'f' ? 'sozinha' : 'sozinho'}
            </span>
          )}
          {idoso.condicoes.map((c) => (
            <span key={c} className="etiqueta etiqueta--contexto">
              {c}
            </span>
          ))}
        </span>

        <span
          className="visita__status"
          style={{ color: pediuAjuda ? 'var(--tv-red-900)' : 'var(--tv-amber-ink)' }}
        >
          Pendente{posicao === 1 ? ' · toque para abrir a ficha' : ''}
        </span>
      </Link>
    </li>
  )
}

export function Hoje() {
  const { idosos, fila } = useEstado()
  const [filtro, setFiltro] = useState<Filtro>('todas')

  const pendentes = idosos.filter((i) => i.status === 'pendente')
  const feitas = idosos.length - pendentes.length
  const pedidosAjuda = idosos.filter(
    (i) => i.status === 'pendente' && i.motivos.includes('pediu-ajuda'),
  ).length

  const visiveis = useMemo(() => {
    if (filtro === 'ajuda')
      return idosos.filter((i) => i.status === 'pendente' && i.motivos.includes('pediu-ajuda'))
    if (filtro === 'pendentes') return pendentes
    return idosos
  }, [filtro, idosos, pendentes])

  const nivel = infoNivel(EVENTO.maximaPrevista)
  let posicao = 0

  return (
    <>
      <div className="barra-app">
        <div className="barra-app__linha">
          <Logo size={26} arco="#FFFFFF" />
          <span style={{ flexGrow: 1, minWidth: 0 }}>
            <b className="barra-app__titulo">Visitas de hoje</b>
            <span className="barra-app__meta">
              {AGENTE.nome} · microárea {AGENTE.microarea}
            </span>
          </span>
          <Link
            to="/fila"
            className={`selo-fila${fila.length === 0 ? ' selo-fila--vazio' : ''}`}
            aria-label={
              fila.length === 0
                ? 'Fila offline vazia'
                : `Fila offline: ${fila.length} registros para enviar`
            }
          >
            <IconeSync />
            {fila.length}
          </Link>
        </div>
        <FaixaRede />
      </div>

      <div className="faixa-calor">
        <span style={{ color: 'var(--tv-red-900)', flexShrink: 0, display: 'flex' }}>
          <IconeAlerta />
        </span>
        <p>
          <b>
            Amanhã faz {grau(EVENTO.maximaPrevista)}&nbsp;°C.
          </b>{' '}
          Risco {nivel.rotulo.toLowerCase()}. Visite primeiro quem pediu ajuda.
        </p>
      </div>

      <div className="progresso">
        <span className="progresso__texto">
          <b>
            {feitas} de {idosos.length} visitas feitas
          </b>
          <span className="barra">
            <span
              className="barra__preenche"
              style={{ width: `${(feitas / Math.max(1, idosos.length)) * 100}%` }}
            />
          </span>
        </span>
        <span className="progresso__prazo">
          Prazo
          <br />
          {EVENTO.horaDisparo}
        </span>
      </div>

      <div className="filtros-chip">
        <button
          type="button"
          className={`chip${filtro === 'todas' ? ' chip--ativo' : ''}`}
          aria-pressed={filtro === 'todas'}
          onClick={() => setFiltro('todas')}
        >
          Todas {idosos.length}
        </button>
        <button
          type="button"
          className={`chip chip--risco${filtro === 'ajuda' ? ' chip--ativo' : ''}`}
          aria-pressed={filtro === 'ajuda'}
          onClick={() => setFiltro('ajuda')}
        >
          Pediram ajuda {pedidosAjuda}
        </button>
        <button
          type="button"
          className={`chip${filtro === 'pendentes' ? ' chip--ativo' : ''}`}
          aria-pressed={filtro === 'pendentes'}
          onClick={() => setFiltro('pendentes')}
        >
          Pendentes {pendentes.length}
        </button>
      </div>

      <div className="corpo" id="conteudo">
        {visiveis.length === 0 ? (
          <p className="vazio">Nenhuma visita neste filtro.</p>
        ) : (
          <ul className="lista-visitas">
            {visiveis.map((i) => {
              if (i.status === 'pendente') posicao += 1
              return <CartaoVisita key={i.id} idoso={i} posicao={posicao} />
            })}
          </ul>
        )}
      </div>

      <NavInferior atual="hoje" />
    </>
  )
}
