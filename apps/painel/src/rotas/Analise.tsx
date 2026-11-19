import { ANALISE, LIMIAR, grau, num } from '@termovida/shared'
import { BarraRotulada, Card } from '../ui'

const FILTROS = [
  { id: 'f-ano', rotulo: 'Ano', opcoes: ['2018–2023', '2023', '2022', '2021'] },
  { id: 'f-mes', rotulo: 'Mês', opcoes: ['Todos', 'Verão (dez–mar)', 'Janeiro', 'Fevereiro'] },
  {
    id: 'f-estacao',
    rotulo: 'Estação',
    opcoes: ['Três estações', 'Mirante de Santana', 'Interlagos', 'Riacho Grande'],
  },
  {
    id: 'f-idade',
    rotulo: 'Faixa etária',
    opcoes: ['65 anos ou mais', '80 anos ou mais', 'Adultos 18–64'],
  },
  { id: 'f-sexo', rotulo: 'Sexo', opcoes: ['Todos', 'Feminino', 'Masculino'] },
  { id: 'f-raca', rotulo: 'Raça/cor', opcoes: ['Todas', 'Preta ou parda', 'Branca'] },
]

/* ------------------------------------------------------- série temporal */

const L = { x0: 30, passo: 40, base: 178, topo: 20 }

function pontos(valores: readonly number[], min: number, max: number): string {
  const alt = L.base - L.topo
  return valores
    .map((v, i) => {
      const y = L.base - ((v - min) / (max - min)) * alt
      return `${L.x0 + i * L.passo},${y.toFixed(1)}`
    })
    .join(' ')
}

function Serie() {
  const { temperatura, obitos } = ANALISE.serie
  const linhaTemp = pontos(temperatura, 28, 38)
  const linhaObitos = pontos(obitos, 300, 500)

  const iTempMax = temperatura.indexOf(Math.max(...temperatura))
  const iObitosMax = obitos.indexOf(Math.max(...obitos))
  const pTemp = linhaTemp.split(' ')[iTempMax].split(',')
  const pObitos = linhaObitos.split(' ')[iObitosMax].split(',')

  return (
    <Card
      titulo="1. O calor e os óbitos de idosos andam juntos"
      sub={
        <>
          Média semanal, verão de 2022–2023. Cada pico de temperatura é seguido por um pico de
          óbitos. <b className="ilustrativo">Série ilustrativa — substituir pela do notebook.</b>
        </>
      }
      className="col-larga"
    >
      <div className="legenda-serie">
        <span className="legenda-serie__item">
          <span className="legenda-serie__traco" style={{ background: 'var(--tv-coral)' }} />
          Temperatura máxima (°C)
        </span>
        <span className="legenda-serie__item">
          <span className="legenda-serie__traco" style={{ background: 'var(--tv-teal-900)' }} />
          Óbitos 65+ na semana
        </span>
      </div>

      <svg
        className="serie"
        viewBox="0 0 600 200"
        role="img"
        aria-label="Linha dupla de dezembro a março: a temperatura máxima semanal sobe de 30 para 36 graus e volta a cair, e os óbitos de idosos acompanham, com os dois picos mais altos nas mesmas semanas de calor."
      >
        <line x1="24" y1={L.base} x2="586" y2={L.base} stroke="var(--tv-line)" strokeWidth="1.5" />
        <line x1="24" y1={L.topo} x2="24" y2={L.base} stroke="var(--tv-line)" strokeWidth="1.5" />
        <polyline
          points={linhaTemp}
          fill="none"
          stroke="var(--tv-coral)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polyline
          points={linhaObitos}
          fill="none"
          stroke="var(--tv-teal-900)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx={pTemp[0]} cy={pTemp[1]} r="5" fill="var(--tv-coral)" stroke="#fff" strokeWidth="2" />
        <circle
          cx={pObitos[0]}
          cy={pObitos[1]}
          r="5"
          fill="var(--tv-teal-900)"
          stroke="#fff"
          strokeWidth="2"
        />
        {ANALISE.serie.rotulos.map((r, i) => (
          <text key={r} x={24 + i * 158} y="194" fontSize="12" fill="var(--tv-muted)">
            {r}
          </text>
        ))}
      </svg>
    </Card>
  )
}

/* ----------------------------------------------------------- defasagem */

function Defasagem() {
  const maior = Math.max(...ANALISE.defasagem.map((d) => d.valor))
  return (
    <Card
      titulo="2. O pico vem no dia seguinte"
      sub="Aumento do risco de óbito por dia após o dia quente. É essa defasagem que dá tempo de agir."
      className="col-estreita"
    >
      <ul className="barras">
        {ANALISE.defasagem.map((d) => (
          <BarraRotulada
            key={d.rotulo}
            rotulo={d.rotulo}
            valorTexto={`+${d.valor}%`}
            fracao={d.valor / maior}
            cor={d.doNotebook ? 'var(--tv-red-900)' : 'var(--tv-amber)'}
            tomValor={d.doNotebook ? 'var(--tv-red-900)' : 'var(--tv-ink)'}
          />
        ))}
      </ul>
      <p className="rodape-nota">
        H2 sustentada · regressão de Poisson. O notebook confirma o pico em{' '}
        <b style={{ color: 'var(--tv-ink)' }}>{ANALISE.doNotebook.picoEm}</b> com{' '}
        <b style={{ color: 'var(--tv-ink)' }}>+{ANALISE.doNotebook.riscoAcimaDoLimiar}%</b>; os
        demais dias são <b className="ilustrativo">valores ilustrativos</b>.
      </p>
    </Card>
  )
}

/* --------------------------------------------------------------- faixas */

function Faixas() {
  return (
    <Card
      titulo="Risco por faixa de temperatura"
      sub={
        <>
          O limiar de {grau(LIMIAR)}&nbsp;°C é onde a curva vira. As faixas de{' '}
          <b>+{ANALISE.doNotebook.riscoAcimaDoLimiar}%</b> e{' '}
          <b>+{ANALISE.doNotebook.riscoAcima34}%</b> vêm do notebook; a faixa intermediária é{' '}
          <b className="ilustrativo">ilustrativa</b>.
        </>
      }
      className="col-estreita"
    >
      <ul className="barras">
        {ANALISE.faixas.map((f) => (
          <BarraRotulada
            key={f.rotulo}
            rotulo={f.rotulo}
            valorTexto={f.valor === null ? 'referência' : `+${f.valor}%`}
            fracao={(f.valor ?? 0.6) / ANALISE.doNotebook.riscoAcima34}
            cor={
              f.valor === null || f.valor <= 2
                ? 'var(--tv-teal-600)'
                : f.valor < 15
                  ? 'var(--tv-amber)'
                  : 'var(--tv-red-900)'
            }
            tomValor={f.valor && f.valor >= 10 ? 'var(--tv-red-900)' : 'var(--tv-muted)'}
          />
        ))}
      </ul>
    </Card>
  )
}

/* ------------------------------------------------------------ subgrupos */

function Subgrupos() {
  const maior = Math.max(...ANALISE.subgrupos.map((s) => s.valor))
  return (
    <Card
      titulo="3. Quem mais sofre"
      sub={`Aumento do risco de óbito em dia quente (≥ ${grau(LIMIAR)} °C), por subgrupo. Barra mais longa, risco maior.`}
      className="col-larga"
    >
      <div className="grade-subgrupos">
        {ANALISE.subgrupos.map((s) => (
          <div key={s.rotulo}>
            <span className="barras__cabeca">
              <b>{s.rotulo}</b>
              <b
                className="barras__valor"
                style={{ color: s.valor >= 13 ? 'var(--tv-red-900)' : 'var(--tv-ink)' }}
              >
                +{s.valor}%
              </b>
            </span>
            <span style={{ display: 'block', marginTop: 4 }}>
              <span className="barra barra--grossa" style={{ height: 11 }}>
                <span
                  className="barra__preenche"
                  style={{ width: `${(s.valor / maior) * 100}%`, background: s.cor }}
                />
              </span>
            </span>
          </div>
        ))}
      </div>
      <p className="rodape-nota">
        {ANALISE.fonte} {ANALISE.ressalva}
      </p>
    </Card>
  )
}

/* ------------------------------------------------------------------ tela */

export function Analise() {
  return (
    <>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Análise · calor e óbitos de idosos</h1>
        <p style={{ marginTop: 4, fontSize: 14, color: 'var(--tv-muted)' }}>
          Entrega da disciplina de BI, Analytics &amp; Data Visualization. Excesso de{' '}
          <b style={{ color: 'var(--tv-ink)' }}>
            {num(ANALISE.doNotebook.excessoObitosAno)} óbitos 65+ por ano
          </b>{' '}
          atribuídos ao calor extremo na cidade de São Paulo.
        </p>
      </div>

      <section className="filtros" aria-label="Filtros da análise">
        {FILTROS.map((f) => (
          <span className="campo" key={f.id}>
            <label className="campo__rotulo" htmlFor={f.id}>
              {f.rotulo}
            </label>
            <select id={f.id} defaultValue={f.opcoes[0]}>
              {f.opcoes.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </span>
        ))}
        <span className="cresce" />
        <button type="button" className="botao botao--secundario">
          Limpar filtros
        </button>
      </section>

      <div className="linha linha--topo">
        <Serie />
        <Defasagem />
      </div>

      <div className="linha linha--topo">
        <Faixas />
        <Subgrupos />
      </div>
    </>
  )
}
