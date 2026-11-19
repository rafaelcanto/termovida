import {
  EQUIPE,
  EQUIPE_RESTANTE,
  EVENTO,
  FILA,
  UBS_DO_AGENTE,
  UBS_LISTA,
  num,
  razaoPct,
} from '@termovida/shared'
import { Barra, BarraRotulada, Card, Kpi } from '../ui'

/** Teal no alvo, âmbar entre 60 e 74%, coral abaixo de 60%. */
function corProgresso(f: number): string {
  if (f >= 0.75) return 'var(--tv-teal-600)'
  if (f >= 0.6) return 'var(--tv-amber)'
  return 'var(--tv-coral)'
}

function tomProgresso(f: number): string {
  if (f >= 0.75) return 'var(--tv-teal-900)'
  if (f >= 0.6) return 'var(--tv-amber-ink)'
  return 'var(--tv-red-900)'
}

const MOTIVOS = [
  { rotulo: 'Apertou 1 pedindo ajuda', valor: FILA.motivos.pediuAjuda, cor: 'var(--tv-red-900)' },
  { rotulo: 'Não atendeu a ligação', valor: FILA.motivos.naoAtendeu, cor: 'var(--tv-coral)' },
  { rotulo: 'Sem sinal ou só telefone fixo', valor: FILA.motivos.semSinal, cor: 'var(--tv-amber)' },
]

const RESULTADOS = [
  { rotulo: 'Visitada, sem intercorrência', valor: FILA.resultados.semIntercorrencia, cor: 'var(--tv-teal-600)' },
  { rotulo: 'Ausente, retorno agendado', valor: FILA.resultados.ausente, cor: 'var(--tv-amber)' },
  { rotulo: 'Encaminhada à UBS', valor: FILA.resultados.encaminhadaUbs, cor: 'var(--tv-coral)' },
  { rotulo: 'SAMU 192 acionado', valor: FILA.resultados.samu192, cor: 'var(--tv-red-900)' },
]

export function Visitas() {
  const ubsAgente = UBS_LISTA.find((u) => u.id === UBS_DO_AGENTE)!

  return (
    <>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Visitas prioritárias · janela de 24 h</h1>
        <p style={{ marginTop: 4, fontSize: 14, color: 'var(--tv-muted)' }}>
          A fila de hoje saiu do disparo das {EVENTO.horaDisparo}. O prazo termina{' '}
          {EVENTO.prazoVisitas}, antes do pico de óbitos de {EVENTO.picoObitosRotulo}.
        </p>
      </div>

      <section className="kpis" aria-label="Situação da fila">
        <Kpi rotulo="Na fila hoje" valor={num(FILA.total)} nota="idosos de maior risco" />
        <Kpi
          rotulo="Visitas feitas"
          valor={num(FILA.feitas)}
          tom="teal"
          progresso={FILA.feitas / FILA.total}
          nota={`${razaoPct(FILA.feitas, FILA.total)} da fila`}
        />
        <Kpi
          rotulo="Pendentes"
          valor={num(FILA.pendentes)}
          tom="risco"
          nota={`${FILA.pendentesComPedidoAjuda} delas com pedido de ajuda`}
          notaTipo="risco"
        />
        <Kpi
          rotulo="ACS em campo"
          valor={num(FILA.acsEmCampo)}
          nota={`em ${UBS_LISTA.length} UBS · ${FILA.acsComPendenciaSync} com dados pendentes de sincronizar`}
        />
      </section>

      <div className="linha linha--topo">
        <Card titulo="Por unidade básica de saúde" className="col-larga">
          <div className="tabela-rolagem">
            <table className="tabela" style={{ minWidth: 580 }}>
              <thead>
                <tr>
                  <th scope="col">UBS</th>
                  <th scope="col">ACS</th>
                  <th scope="col">Fila</th>
                  <th scope="col">Feitas</th>
                  <th scope="col">Progresso</th>
                </tr>
              </thead>
              <tbody>
                {[...UBS_LISTA]
                  .sort((a, b) => b.feitas / b.fila - a.feitas / a.fila)
                  .map((u) => {
                    const f = u.feitas / u.fila
                    return (
                      <tr key={u.id} className={u.id === UBS_DO_AGENTE ? 'destacada' : undefined}>
                        <th scope="row">{u.nome}</th>
                        <td className="num">{u.acs}</td>
                        <td className="num">{num(u.fila)}</td>
                        <td className="num">{num(u.feitas)}</td>
                        <td>
                          <span className="barra-linha">
                            <Barra valor={f} cor={corProgresso(f)} />
                            <b style={{ color: tomProgresso(f) }}>{Math.round(f * 100)}%</b>
                          </span>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
          <p className="rodape-nota" style={{ color: 'var(--tv-red-900)', fontSize: 13 }}>
            <b>Marsilac e Parelheiros estão atrás.</b> São os distritos com cobertura de celular
            baixa, onde a visita é o único canal garantido — e os que têm menos ACS por idoso.
          </p>
        </Card>

        <Card
          titulo="Por que entraram na fila"
          sub="Um idoso pode entrar por mais de um motivo; conta o de maior peso."
          className="col-estreita"
        >
          <ul className="barras">
            {MOTIVOS.map((m) => (
              <BarraRotulada
                key={m.rotulo}
                rotulo={m.rotulo}
                valorTexto={num(m.valor)}
                fracao={m.valor / FILA.total}
                cor={m.cor}
              />
            ))}
          </ul>

          <div style={{ marginTop: 18, borderTop: '1px solid var(--tv-line)', paddingTop: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
              Resultado das {num(FILA.feitas)} visitas feitas
            </h3>
            <ul className="lista" style={{ gap: 8 }}>
              {RESULTADOS.map((r) => (
                <li
                  key={r.rotulo}
                  style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 14 }}
                >
                  <span
                    style={{ width: 11, height: 11, borderRadius: 3, background: r.cor, flexShrink: 0 }}
                    aria-hidden="true"
                  />
                  <span style={{ flexGrow: 1 }}>{r.rotulo}</span>
                  <b className="num" style={{ color: 'var(--tv-ink)' }}>
                    {num(r.valor)}
                  </b>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <Card
        titulo={`Equipe da UBS ${ubsAgente.nome}`}
        sub={`${ubsAgente.acs} agentes · ${num(ubsAgente.fila)} na fila · ${num(ubsAgente.feitas)} feitas`}
      >
        <div className="equipe" style={{ marginTop: 14 }}>
          {EQUIPE.map((a) => {
            const f = a.feitas / a.fila
            const atencao = a.pendentesSync > 0
            return (
              <div key={a.id} className={`agente${atencao ? ' agente--atencao' : ''}`}>
                <span className="agente__topo">
                  <span className="agente__avatar" aria-hidden="true">
                    {a.iniciais}
                  </span>
                  <span style={{ flexGrow: 1, minWidth: 0 }}>
                    <b style={{ fontSize: 15, color: 'var(--tv-ink)', display: 'block' }}>{a.nome}</b>
                    <span style={{ fontSize: 12, color: 'var(--tv-muted)' }}>
                      Microárea {a.microarea}
                    </span>
                  </span>
                </span>
                <span className="barra-linha">
                  <Barra valor={f} cor={corProgresso(f)} />
                  <b className="num" style={{ fontSize: 13, color: tomProgresso(f) }}>
                    {a.feitas} / {a.fila}
                  </b>
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: atencao ? 'var(--tv-red-900)' : 'var(--tv-muted)',
                    fontWeight: atencao ? 600 : 400,
                  }}
                >
                  {atencao
                    ? `${a.pendentesSync} registros ainda não sincronizados`
                    : `Sincronizado às ${a.ultimaSync}`}
                </span>
              </div>
            )
          })}

          <div className="agente agente--vazio">
            <b style={{ fontSize: 15, color: 'var(--tv-ink)' }}>
              + {EQUIPE_RESTANTE.agentes} agentes
            </b>
            <span className="num" style={{ fontSize: 13, color: 'var(--tv-muted)' }}>
              {EQUIPE_RESTANTE.fila} na fila · {EQUIPE_RESTANTE.feitas} feitas
            </span>
          </div>
        </div>

        <p className="rodape-nota">
          O painel mostra o andamento por equipe. A lista com nome e endereço dos idosos só existe
          no app do agente, dentro da UBS responsável. Protótipo de alta fidelidade · dados
          ilustrativos.
        </p>
      </Card>
    </>
  )
}
