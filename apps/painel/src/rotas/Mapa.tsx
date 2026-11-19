import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  COBERTURA_BAIXA,
  DISPARO,
  DISTRITOS_SUL,
  ESTACOES,
  EVENTO,
  NIVEIS,
  ORDEM_NIVEIS,
  grau,
  num,
  temp,
} from '@termovida/shared'
import { DISTRITOS_MAPA, MAPA, MARCADORES_ESTACOES, contarPorNivel } from '@termovida/shared/mapa'
import { Card, EtiquetaNivel, IconeEstacao } from '../ui'

const CONTAGEM = contarPorNivel()

export function Mapa() {
  const [selecionado, setSelecionado] = useState<string | null>(null)
  const detalhe = DISTRITOS_MAPA.find((d) => d.nome === selecionado)

  return (
    <>
      <div className="cabecalho-tela">
        <div style={{ minWidth: 0 }}>
          <h1>Mapa de risco por distrito</h1>
          <p>
            Os 96 distritos da cidade de São Paulo, pintados pela temperatura máxima prevista para
            amanhã. Toque num distrito para ver os números dele.
          </p>
        </div>
        <span className="cresce" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' }}>
          <span className="campo">
            <label className="campo__rotulo" htmlFor="mapa-dia">
              Dia
            </label>
            <select id="mapa-dia" defaultValue="alvo">
              <option value="alvo">Amanhã · {EVENTO.alvoRotulo} (alerta)</option>
              <option value="hoje">Hoje · qui 19/11</option>
              <option value="pico">{EVENTO.picoObitosRotulo} (pico de óbitos)</option>
            </select>
          </span>
          <span className="campo">
            <label className="campo__rotulo" htmlFor="mapa-camada">
              Camada
            </label>
            <select id="mapa-camada" defaultValue="temp">
              <option value="temp">Temperatura máxima prevista</option>
              <option value="idosos">Idosos 65+ cadastrados</option>
              <option value="visitas">Visitas pendentes</option>
            </select>
          </span>
        </div>
      </div>

      <div className="linha linha--topo">
        <Card className="col-larga">
          <div className="mapa-legenda">
            <span className="mapa-legenda__rotulo">Nível previsto</span>
            {ORDEM_NIVEIS.map((id) => (
              <span className="mapa-legenda__item" key={id}>
                <span className="mapa-legenda__amostra" style={{ background: NIVEIS[id].fill }} />
                {NIVEIS[id].rotulo} <b style={{ color: 'var(--tv-ink)' }}>{CONTAGEM[id]}</b>
              </span>
            ))}
            <span className="mapa-legenda__item">
              <span className="mapa-legenda__amostra mapa-legenda__amostra--tracejada" />
              Cobertura de celular baixa
            </span>
            <span className="mapa-legenda__item">
              <IconeEstacao />
              Estação do INMET
            </span>
          </div>

          <svg
            className="mapa-svg"
            viewBox={MAPA.viewBox}
            role="img"
            aria-label="Mapa dos 96 distritos da cidade de São Paulo coloridos pelo nível de risco de calor previsto para amanhã. O extremo sul (Marsilac e Parelheiros) e a periferia leste concentram os níveis Alto e Extremo; o centro-oeste e o norte da Cantareira ficam em Atenção ou Baixo."
          >
            <g>
              {DISTRITOS_MAPA.map((d) => (
                <path
                  key={d.sigla}
                  d={d.d}
                  className={`mapa-distrito${
                    selecionado === d.nome ? ' mapa-distrito--selecionado' : ''
                  }`}
                  fill={NIVEIS[d.nivel].fill}
                  stroke={d.coberturaBaixa ? 'var(--tv-ink)' : 'var(--tv-bg)'}
                  strokeWidth={d.coberturaBaixa ? 4 : 1.3}
                  strokeDasharray={d.coberturaBaixa ? '10 7' : undefined}
                  strokeLinejoin="round"
                  onClick={() => setSelecionado(selecionado === d.nome ? null : d.nome)}
                >
                  <title>
                    {d.nomeExibicao} — {grau(d.maxima)} °C · {NIVEIS[d.nivel].rotulo}
                    {d.coberturaBaixa ? ' · cobertura de celular baixa' : ''}
                  </title>
                </path>
              ))}
            </g>

            <g>
              {MARCADORES_ESTACOES.map((e) => (
                <g key={e.codigo}>
                  <circle cx={e.x} cy={e.y} r="13" fill="var(--tv-bg)" stroke="var(--tv-ink)" strokeWidth="6" />
                  <circle cx={e.x} cy={e.y} r="5" fill="var(--tv-ink)" />
                  <text className="mapa-estacao-rotulo" x={e.x} y={e.y - 24} textAnchor="middle">
                    {e.nome}
                  </text>
                </g>
              ))}
            </g>

            <g>
              {DISTRITOS_MAPA.filter((d) => d.rotulado).map((d) => (
                <g key={`r-${d.sigla}`}>
                  <text className="mapa-rotulo" x={d.cx} y={d.cy} textAnchor="middle">
                    {d.nomeExibicao}
                  </text>
                  <text
                    className="mapa-rotulo mapa-rotulo--valor"
                    x={d.cx}
                    y={d.cy + 30}
                    textAnchor="middle"
                  >
                    {grau(d.maxima)} °C
                  </text>
                </g>
              ))}
            </g>
          </svg>

          <div className="mapa-detalhe" aria-live="polite">
            {detalhe ? (
              <>
                <b style={{ fontSize: 16, color: 'var(--tv-ink)' }}>{detalhe.nomeExibicao}</b>
                <span className="num" style={{ fontWeight: 700, color: 'var(--tv-ink)' }}>
                  {temp(detalhe.maxima)}
                </span>
                <EtiquetaNivel nivel={detalhe.nivel} />
                <span style={{ fontSize: 13, color: 'var(--tv-muted)' }}>
                  Subprefeitura de {detalhe.sub}
                  {detalhe.coberturaBaixa ? ' · cobertura de celular baixa' : ''}
                </span>
              </>
            ) : (
              <span style={{ fontSize: 14, color: 'var(--tv-muted)' }}>
                Nenhum distrito selecionado. Toque no mapa para ver os detalhes.
              </span>
            )}
          </div>

          <p className="rodape-nota">
            Geometria dos 96 distritos a partir de base pública em GeoJSON (divisão da Lei nº
            11.220/1992), simplificada para o protótipo. Temperatura interpolada entre as três
            estações do INMET — valores ilustrativos.
          </p>
        </Card>

        <div className="col-estreita">
          <Card titulo="Distritos mais quentes amanhã" variante="risco">
            <ol className="lista" style={{ marginTop: 10, gap: 9 }}>
              {DISTRITOS_SUL.map((d) => (
                <li
                  key={d.nome}
                  style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontSize: 14 }}
                >
                  <b style={{ color: 'var(--tv-ink)', flexGrow: 1, minWidth: 0 }}>{d.nome}</b>
                  <span className="num" style={{ color: 'var(--tv-ink)', fontWeight: 700 }}>
                    {temp(d.maxima)}
                  </span>
                  <EtiquetaNivel nivel={d.nivel} />
                </li>
              ))}
            </ol>
            <p className="rodape-nota" style={{ fontSize: 13, color: 'var(--tv-body)' }}>
              Os <b>5 distritos da {EVENTO.regiao}</b> estão em nível Alto ou Extremo —{' '}
              <b>{num(DISPARO.cadastrados)}</b> idosos 65+ cadastrados.
            </p>
          </Card>

          <Card titulo="Estações do INMET">
            <ul className="lista" style={{ marginTop: 12 }}>
              {ESTACOES.map((e) => (
                <li className="lista-item" key={e.codigo}>
                  <span
                    className="ponto"
                    style={{
                      background:
                        e.maxima >= 35.5
                          ? 'var(--tv-red-900)'
                          : e.maxima >= 34
                            ? 'var(--tv-coral)'
                            : 'var(--tv-amber)',
                    }}
                  />
                  <span style={{ flexGrow: 1, minWidth: 0 }}>
                    <b className="lista-item__nome">{e.nome}</b>
                    <span className="lista-item__meta">
                      {e.regiao} · {e.codigo}
                    </span>
                  </span>
                  <span className="lista-item__valor">{temp(e.maxima)}</span>
                </li>
              ))}
            </ul>
            <p className="rodape-nota">
              Três estações em vez de uma: uma leitura única esconderia as ilhas de calor.
            </p>
          </Card>

          <Card titulo="Onde o alerta não chega" variante="teal">
            <p style={{ margin: '8px 0 12px', fontSize: 14, lineHeight: 1.5 }}>
              Distritos com cobertura de celular baixa, marcados no mapa com contorno tracejado. Ali
              o aviso vai por rádio comunitária e a visita do ACS é a garantia.
            </p>
            <ul className="lista" style={{ gap: 8 }}>
              {COBERTURA_BAIXA.map((d) => (
                <li
                  key={d.nome}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'baseline',
                    gap: 8,
                    fontSize: 14,
                    color: 'var(--tv-ink)',
                  }}
                >
                  <b style={{ flexGrow: 1 }}>{d.nome}</b>
                  <span className="num" style={{ color: 'var(--tv-body)' }}>
                    {num(d.idosos)} idosos · {d.semContato} sem contato
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Link to="/visitas" className="botao botao--primario botao--bloco">
            Priorizar visitas nesses distritos
          </Link>
        </div>
      </div>
    </>
  )
}
