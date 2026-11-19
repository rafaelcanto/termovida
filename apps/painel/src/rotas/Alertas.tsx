import { Link } from 'react-router-dom'
import {
  DISPARO,
  EVENTO,
  FILA,
  HISTORICO_DISPAROS,
  MENSAGENS,
  num,
  razaoPct,
} from '@termovida/shared'
import { Card, EtiquetaNivel, IconeCheck, Kpi } from '../ui'

const CANAIS = [
  {
    chave: 'sms',
    rotulo: 'SMS',
    cor: 'var(--tv-teal-900)',
    fracao: DISPARO.smsEntregues / DISPARO.cadastrados,
    detalhe: (
      <>
        {num(DISPARO.smsEnviados)} enviados · <b>{num(DISPARO.smsEntregues)} entregues</b> ·{' '}
        {num(DISPARO.smsEnviados - DISPARO.smsEntregues)} não entregues
      </>
    ),
  },
  {
    chave: 'voz',
    rotulo: 'Ligação de voz',
    cor: 'var(--tv-teal-600)',
    fracao: DISPARO.ligacoesAtendidas / DISPARO.cadastrados,
    detalhe: (
      <>
        {num(DISPARO.ligacoesFeitas)} ligações · <b>{num(DISPARO.ligacoesAtendidas)} atendidas</b> ·{' '}
        {num(DISPARO.ligacoesFeitas - DISPARO.ligacoesAtendidas)} não atenderam
      </>
    ),
  },
  {
    chave: 'sem',
    rotulo: 'Sem contato',
    cor: 'var(--tv-red-900)',
    fracao: DISPARO.semContato / DISPARO.cadastrados,
    detalhe: (
      <>
        {num(DISPARO.semContato)} idosos · {num(DISPARO.semContatoCoberturaBaixa)} em área de
        cobertura baixa
      </>
    ),
  },
]

export function Alertas() {
  return (
    <>
      <div className="cabecalho-tela">
        <div style={{ minWidth: 0 }}>
          <h1>Disparo de hoje · onda de calor de {EVENTO.alvoRotulo}</h1>
          <p>
            Enviado às {EVENTO.horaDisparo} pelo gateway de SMS e voz. Entram na fila de visitas
            quem apertou 1 e quem ficou sem contato morando sozinho ou com doença crônica.
          </p>
        </div>
        <span className="cresce" />
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--tv-teal-100)',
            color: 'var(--tv-teal-900)',
            border: '1px solid var(--tv-teal-600)',
            borderRadius: 'var(--tv-radius-pill)',
            padding: '8px 15px',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <IconeCheck />
          Disparo concluído
        </span>
      </div>

      <section className="kpis kpis--5" aria-label="Resultado do disparo">
        <Kpi
          rotulo="Destinatários"
          valor={num(DISPARO.cadastrados)}
          nota="idosos 65+ cadastrados"
        />
        <Kpi
          rotulo="SMS entregues"
          valor={num(DISPARO.smsEntregues)}
          tom="teal"
          nota={`${razaoPct(DISPARO.smsEntregues, DISPARO.cadastrados)} dos cadastrados`}
        />
        <Kpi
          rotulo="Ligações atendidas"
          valor={num(DISPARO.ligacoesAtendidas)}
          tom="teal"
          nota="inclui telefone fixo"
        />
        <Kpi
          rotulo="Sem contato"
          valor={num(DISPARO.semContato)}
          tom="risco"
          nota={`${num(DISPARO.semContatoNaFila)} de maior risco vão para a fila`}
          notaTipo="risco"
        />
        <Kpi
          rotulo="Apertaram 1 (pedido de ajuda)"
          valor={num(DISPARO.pedidosAjuda)}
          tom="risco"
          nota="prioridade máxima no app"
          notaTipo="risco"
        />
      </section>

      <div className="linha linha--topo">
        <Card
          titulo="Resultado por canal"
          sub="Cada idoso recebe SMS e, se tiver só telefone fixo ou não abrir o SMS, uma ligação de voz."
          className="col-larga"
        >
          <div className="canal-barra">
            {CANAIS.map((c) => (
              <span
                key={c.chave}
                className="canal-barra__parte"
                style={{ width: `${c.fracao * 100}%`, background: c.cor }}
              >
                {c.chave === 'sem'
                  ? razaoPct(DISPARO.semContato, DISPARO.cadastrados)
                  : `${c.rotulo} ${razaoPct(
                      c.chave === 'sms' ? DISPARO.smsEntregues : DISPARO.ligacoesAtendidas,
                      DISPARO.cadastrados,
                    )}`}
              </span>
            ))}
          </div>

          <ul className="lista" style={{ marginTop: 16, gap: 10 }}>
            {CANAIS.map((c) => (
              <li
                key={c.chave}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 10,
                  borderBottom: '1px solid var(--tv-line-soft)',
                  paddingBottom: 10,
                }}
              >
                <span
                  className="mapa-legenda__amostra"
                  style={{ background: c.cor }}
                  aria-hidden="true"
                />
                <b style={{ fontSize: 14, color: 'var(--tv-ink)', flexGrow: 1, minWidth: 160 }}>
                  {c.rotulo}
                </b>
                <span className="num" style={{ fontSize: 13 }}>
                  {c.detalhe}
                </span>
              </li>
            ))}
          </ul>

          <div
            style={{
              marginTop: 18,
              background: 'var(--tv-teal-100)',
              borderRadius: 11,
              padding: '14px 16px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <p style={{ flex: '999 1 300px', fontSize: 14, lineHeight: 1.5, color: 'var(--tv-ink)' }}>
              <b>{num(FILA.total)} idosos</b> entraram na fila de visitas prioritárias: os{' '}
              {num(DISPARO.pedidosAjuda)} que pediram ajuda, mais {num(DISPARO.semContatoNaFila)}{' '}
              dos {num(DISPARO.semContato)} sem contato que moram sozinhos ou têm doença crônica —{' '}
              {num(FILA.motivos.naoAtendeu)} que não atenderam e {num(FILA.motivos.semSinal)} sem
              sinal ou só com telefone fixo.
            </p>
            <Link to="/visitas" className="botao botao--primario">
              Ver a fila
            </Link>
          </div>
        </Card>

        <div className="col-estreita">
          <Card titulo="Mensagem enviada">
            <div className="mensagem" style={{ marginTop: 12 }}>
              <span className="mensagem__tipo">SMS · TermoVida · sua unidade de saúde</span>
              <p className="mensagem__corpo">{MENSAGENS.sms}</p>
              <span style={{ display: 'inline-block', marginTop: 8, fontSize: 12, color: 'var(--tv-muted)' }}>
                Sem link, sem abreviação, sem jargão
              </span>
            </div>
            <div className="mensagem">
              <span className="mensagem__tipo">
                Roteiro da ligação de voz · {MENSAGENS.duracaoVoz}
              </span>
              <p className="mensagem__corpo">“{MENSAGENS.voz}”</p>
            </div>
            <p className="rodape-nota">
              Linguagem simples, uma ação por frase. Funciona em celular simples e telefone fixo,
              sem internet e sem aplicativo.
            </p>
          </Card>
        </div>
      </div>

      <Card titulo="Histórico de disparos">
        <div className="tabela-rolagem">
          <table className="tabela" style={{ minWidth: 640 }}>
            <thead>
              <tr>
                <th scope="col">Data e hora</th>
                <th scope="col">Evento</th>
                <th scope="col">Nível</th>
                <th scope="col">Alertados</th>
                <th scope="col">Pediram ajuda</th>
                <th scope="col">Visitas em 24 h</th>
              </tr>
            </thead>
            <tbody>
              {HISTORICO_DISPAROS.map((d) => (
                <tr key={d.data}>
                  <th scope="row" className="num">
                    {d.rotulo}
                  </th>
                  <td>{d.evento}</td>
                  <td>
                    <EtiquetaNivel nivel={d.nivel} />
                  </td>
                  <td className="num">{num(d.alertados)}</td>
                  <td className="num">{num(d.pedidosAjuda)}</td>
                  <td className="num">
                    {d.visitas24h === null ? 'em andamento' : `${d.visitas24h}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="rodape-nota">
          Protótipo de alta fidelidade · dados ilustrativos. O painel não exibe nome, telefone nem
          endereço: só agregados.
        </p>
      </Card>
    </>
  )
}
