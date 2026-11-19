import { Link } from 'react-router-dom'
import {
  AVISO_PROTOTIPO,
  ANALISE,
  DISPARO,
  DISTRITOS_SUL,
  EVENTO,
  FILA,
  LGPD,
  LIMIAR,
  NIVEIS,
  PREVISAO,
  grau,
  infoNivel,
  num,
  razaoPct,
  temp,
} from '@termovida/shared'
import { Card, EtiquetaNivel, IconeAlerta, IconeEscudo, Kpi } from '../ui'

/** Altura do gráfico de previsão, em px, para a faixa de 28 a 38 °C. */
const ALTURA = 200
const alturaDe = (t: number) => Math.max(0, Math.min(ALTURA, ((t - 28) / 10) * ALTURA))

function Previsao() {
  const nivelAlvo = infoNivel(EVENTO.maximaPrevista)
  return (
    <Card
      titulo="Carga térmica prevista e limiar de risco"
      sub={
        <>
          O gatilho do alerta é o calor acumulado no dia. A linha tracejada marca o limiar de{' '}
          {grau(LIMIAR)}&nbsp;°C, a partir do qual o risco de óbito de idosos sobe{' '}
          {ANALISE.doNotebook.riscoAcimaDoLimiar}%.
        </>
      }
      className="col-larga"
    >
      <div className="previsao">
        <div className="previsao__eixo" aria-hidden="true">
          <span>38&nbsp;°C</span>
          <span>33&nbsp;°C</span>
          <span>28&nbsp;°C</span>
        </div>

        <div className="previsao__area">
          <div className="previsao__limiar" style={{ bottom: alturaDe(LIMIAR) }} />
          <span className="previsao__limiar-rotulo" style={{ bottom: alturaDe(LIMIAR) + 4 }}>
            Limiar {grau(LIMIAR)}&nbsp;°C
          </span>

          <div className="previsao__barras">
            {PREVISAO.map((d) => {
              const n = infoNivel(d.maxima)
              return (
                <div className="previsao__coluna" key={d.data}>
                  <span
                    className="previsao__valor"
                    style={d.alerta ? { color: 'var(--tv-red-900)' } : undefined}
                  >
                    {grau(d.maxima)}°
                  </span>
                  <span
                    className="previsao__barra"
                    style={{
                      height: alturaDe(d.maxima),
                      background: n.fill,
                      boxShadow: d.alerta ? 'inset 0 0 0 2px var(--tv-red-900)' : undefined,
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="previsao__rotulos">
        {PREVISAO.map((d) => {
          const n = infoNivel(d.maxima)
          const mod = d.hoje ? ' previsao__rotulo--hoje' : d.alerta ? ' previsao__rotulo--alerta' : ''
          return (
            <span className={`previsao__rotulo${mod}`} key={d.data}>
              {d.rotulo}
              <br />
              <b style={{ color: n.texto }}>{n.rotulo}</b>
            </span>
          )
        })}
      </div>

      <p className="rodape-nota">
        Fonte: INMET, três estações (Mirante de Santana, Interlagos, Riacho Grande). Janela de
        ação: 24 a 48&nbsp;h entre a previsão e o pico de risco. Amanhã o nível é{' '}
        <b style={{ color: nivelAlvo.texto }}>{nivelAlvo.rotulo}</b>.
      </p>
    </Card>
  )
}

function Funil() {
  return (
    <Card
      titulo="Do alerta à visita"
      sub={`Disparo de hoje, ${EVENTO.horaDisparo}.`}
      className="col-estreita"
    >
      <ol className="funil">
        <li className="funil__item funil__item--teal">
          <span className="funil__numero funil__numero--teal">{num(DISPARO.alertados)}</span>
          <span>idosos alertados</span>
        </li>
        <li className="funil__item" style={{ flexDirection: 'column', gap: 6 }}>
          <span>
            <b className="num">{num(DISPARO.smsEntregues)}</b> SMS entregues ·{' '}
            <b className="num">{num(DISPARO.ligacoesAtendidas)}</b> ligações atendidas
          </span>
          <span style={{ color: 'var(--tv-red-900)', fontWeight: 600 }}>
            {num(DISPARO.semContato)} sem contato — {num(DISPARO.semContatoNaFila)} de maior risco
            entram na fila
          </span>
        </li>
        <li className="funil__item funil__item--risco">
          <span className="funil__numero funil__numero--risco">{num(DISPARO.pedidosAjuda)}</span>
          <span>
            apertaram <b>1</b> pedindo ajuda
          </span>
        </li>
        <li className="funil__item funil__item--destaque">
          <span className="funil__numero funil__numero--teal">{num(FILA.total)}</span>
          <span>na fila de visitas prioritárias dos ACS</span>
        </li>
      </ol>
      <Link to="/visitas" className="botao botao--secundario botao--bloco" style={{ marginTop: 14 }}>
        Acompanhar as visitas
      </Link>
    </Card>
  )
}

export function VisaoGeral() {
  const acima = EVENTO.maximaPrevista - LIMIAR

  return (
    <>
      <section className="faixa-alerta" aria-label="Alerta vigente">
        <span className="faixa-alerta__selo">
          <IconeAlerta />
          RISCO {NIVEIS[infoNivel(EVENTO.maximaPrevista).id].rotulo.toUpperCase()}
        </span>
        <div className="faixa-alerta__texto">
          <h2>
            Amanhã, {EVENTO.alvoRotulo}: máxima prevista de {temp(EVENTO.maximaPrevista)} —{' '}
            {grau(acima)}&nbsp;°C acima do limiar de risco
          </h2>
          <p>
            O pico de óbitos chega no dia seguinte ({EVENTO.picoObitosRotulo}). Os alertas por SMS
            e voz foram disparados hoje às {EVENTO.horaDisparo}.
          </p>
        </div>
        <Link to="/alertas" className="botao botao--primario">
          Ver disparos
        </Link>
      </section>

      <section className="kpis" aria-label="Indicadores do evento">
        <Kpi
          rotulo="Idosos 65+ alertados"
          valor={razaoPct(DISPARO.alertados, DISPARO.cadastrados)}
          nota={`${num(DISPARO.alertados)} de ${num(DISPARO.cadastrados)} cadastrados`}
          progresso={DISPARO.alertados / DISPARO.cadastrados}
        />
        <Kpi
          rotulo="Visitas feitas em até 24 h"
          valor={razaoPct(FILA.feitas, FILA.total)}
          nota={`${num(FILA.feitas)} de ${num(FILA.total)} visitas prioritárias`}
          progresso={FILA.feitas / FILA.total}
          progressoCor="var(--tv-amber)"
        />
        <Kpi
          rotulo="Da previsão ao alerta"
          valor={EVENTO.tempoAteAlerta}
          nota={`Previsão ${EVENTO.horaPrevisao} · disparo ${EVENTO.horaDisparo}`}
        />
        <Kpi
          rotulo="Excesso de óbitos 65+ estimado"
          valor={num(ANALISE.doNotebook.excessoObitosAno)}
          unidade="/ano"
          nota={
            <Link to="/analise" style={{ fontWeight: 700 }}>
              Ver a série histórica
            </Link>
          }
        />
      </section>

      <div className="linha">
        <Previsao />
        <Funil />
      </div>

      <div className="linha linha--topo">
        <Card
          titulo="Distritos de maior risco amanhã"
          className="col-larga"
          acao={
            <Link to="/mapa" style={{ fontSize: 13, fontWeight: 700 }}>
              Abrir o mapa
            </Link>
          }
        >
          <div className="tabela-rolagem">
            <table className="tabela">
              <caption className="sr-only">
                Distritos da {EVENTO.regiao} ordenados pela máxima prevista para amanhã
              </caption>
              <thead>
                <tr>
                  <th scope="col">Distrito</th>
                  <th scope="col">Máx. prevista</th>
                  <th scope="col">Nível</th>
                  <th scope="col">Idosos 65+</th>
                  <th scope="col">Observação</th>
                </tr>
              </thead>
              <tbody>
                {DISTRITOS_SUL.map((d) => (
                  <tr key={d.nome}>
                    <th scope="row">{d.nome}</th>
                    <td className="num">{temp(d.maxima)}</td>
                    <td>
                      <EtiquetaNivel nivel={d.nivel} />
                    </td>
                    <td className="num">{num(d.idosos)}</td>
                    <td className="obs">{d.observacao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="rodape-nota">
            Os cinco distritos da {EVENTO.regiao} somam os {num(DISPARO.cadastrados)} idosos
            cadastrados e têm, cada um, a sua UBS.
          </p>
        </Card>

        <Card variante="teal" className="col-estreita">
          <div className="lgpd">
            <span className="lgpd__selo">
              <IconeEscudo />
              Uso responsável dos dados
            </span>
            <p>{LGPD.painel}</p>
            <p>{LGPD.painelAnalise}</p>
            <span className="cresce" />
            <span style={{ fontSize: 12, color: 'var(--tv-teal-900)', fontWeight: 600 }}>
              LGPD · consentimento explícito colhido na UBS
            </span>
          </div>
        </Card>
      </div>

      <p className="aviso-rodape">{AVISO_PROTOTIPO}</p>
    </>
  )
}
