import { Link, Navigate, useParams } from 'react-router-dom'
import { LGPD } from '@termovida/shared'
import { useIdoso } from '../estado'
import {
  BarraVoltar,
  IconeAlerta,
  IconeCheck,
  IconeMapa,
  IconeSemRede,
  IconeTelefone,
} from '../ui'

const COR_PESO = {
  alto: 'var(--tv-red-900)',
  medio: 'var(--tv-coral)',
  baixo: 'var(--tv-amber)',
}

const ROTULO_MOTIVO: Record<string, { texto: string; urgente: boolean }> = {
  'pediu-ajuda': { texto: 'Apertou 1 no alerta — pediu ajuda', urgente: true },
  'nao-atendeu': { texto: 'Não atendeu a ligação do alerta', urgente: false },
  'sem-sinal': { texto: 'Só telefone fixo ou sem sinal no endereço', urgente: false },
}

export function Ficha() {
  const { id } = useParams()
  const idoso = useIdoso(id)

  if (!idoso) return <Navigate to="/hoje" replace />

  const motivo = ROTULO_MOTIVO[idoso.motivos[0]]
  const iniciais = idoso.nome
    .split(' ')
    .filter((p) => p.length > 2)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')

  return (
    <>
      <BarraVoltar titulo="Ficha do idoso" />

      <div className="corpo" id="conteudo">
        <div className="ficha-topo">
          <span className="ficha-topo__identidade">
            <span className="ficha-avatar" aria-hidden="true">
              {iniciais}
            </span>
            <span style={{ flexGrow: 1, minWidth: 0 }}>
              <b style={{ fontSize: 21, color: 'var(--tv-ink)', display: 'block', lineHeight: 1.2 }}>
                {idoso.nome}
              </b>
              <span className="num" style={{ fontSize: 15, color: 'var(--tv-body)' }}>
                {idoso.idade} anos · CNS {idoso.cns}
              </span>
            </span>
          </span>

          <span className={`ficha-motivo${motivo.urgente ? '' : ' ficha-motivo--morno'}`}>
            <IconeAlerta size={19} />
            {motivo.texto}
          </span>

          <span style={{ fontSize: 16, color: 'var(--tv-ink)' }}>
            {idoso.endereco}
            <br />
            <span style={{ fontSize: 14, color: 'var(--tv-muted)' }}>
              {idoso.bairro} · ponto de referência: {idoso.referencia}
            </span>
          </span>

          {idoso.status === 'feita' && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                background: 'var(--tv-teal-100)',
                border: '1px solid var(--tv-teal-600)',
                borderRadius: 'var(--tv-radius-md)',
                padding: '11px 13px',
                fontSize: 15,
                color: 'var(--tv-ink)',
                fontWeight: 700,
              }}
            >
              <span style={{ color: 'var(--tv-teal-900)', display: 'flex' }}>
                <IconeCheck size={20} />
              </span>
              Visita registrada às {idoso.horaVisita}
            </span>
          )}

          <span className="acoes-duplas">
            <a
              className="acao-secundaria"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${idoso.endereco}, ${idoso.bairro}, São Paulo`,
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <IconeMapa />
              Como chegar
            </a>
            <a className="acao-secundaria" href={`tel:${idoso.contato.telefone.replace(/\D/g, '')}`}>
              <IconeTelefone />
              Ligar
            </a>
          </span>
        </div>

        <div className="corpo--pad">
          <section>
            <h2 className="secao-titulo" style={{ marginBottom: 10 }}>
              O que aumenta o risco {idoso.genero === 'f' ? 'dela' : 'dele'}
            </h2>
            <ul className="fatores">
              {idoso.fatores.map((f) => (
                <li className="fator" key={f.texto}>
                  <span className="ponto" style={{ background: COR_PESO[f.peso] }} aria-hidden="true" />
                  {f.texto}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="secao-titulo" style={{ marginBottom: 10 }}>
              O alerta de hoje
            </h2>
            <ol className="historico">
              {idoso.historicoAlerta.map((e) => (
                <li key={`${e.tipo}-${e.hora}`} className={e.destaque ? 'destaque' : undefined}>
                  <span
                    style={{
                      color: e.tipo === 'sem-contato' || e.destaque ? 'var(--tv-red-900)' : 'var(--tv-teal-900)',
                      display: 'flex',
                      flexShrink: 0,
                    }}
                  >
                    {e.tipo === 'sem-contato' ? (
                      <IconeSemRede size={20} />
                    ) : e.destaque ? (
                      <IconeAlerta size={20} />
                    ) : (
                      <IconeCheck size={20} />
                    )}
                  </span>
                  <span style={{ flexGrow: 1 }}>{e.rotulo}</span>
                  <b className="historico__hora">{e.hora}</b>
                </li>
              ))}
            </ol>
            <p style={{ marginTop: 10, fontSize: 14, color: 'var(--tv-muted)' }}>
              Última visita do TermoVida: {idoso.ultimaVisita}.
            </p>
          </section>

          <section>
            <h2 className="secao-titulo" style={{ marginBottom: 10 }}>
              Contato da família
            </h2>
            <div className="cartao cartao--teal contato">
              <span style={{ flexGrow: 1, minWidth: 0 }}>
                <b style={{ fontSize: 16, color: 'var(--tv-ink)', display: 'block' }}>
                  {idoso.contato.nome} — {idoso.contato.relacao}
                </b>
                <span className="num" style={{ fontSize: 14, color: 'var(--tv-body)' }}>
                  {idoso.contato.telefone} · {idoso.contato.nota}
                </span>
              </span>
              <a
                className="contato__botao"
                href={`tel:${idoso.contato.telefone.replace(/\D/g, '')}`}
                aria-label={`Ligar para ${idoso.contato.nome}, ${idoso.contato.relacao}`}
              >
                <IconeTelefone size={21} />
              </a>
            </div>
            <p className="aviso-lgpd" style={{ marginTop: 10 }}>
              {LGPD.campo}
            </p>
          </section>
        </div>
      </div>

      <div className="rodape-acao">
        <Link to={`/visita/${idoso.id}`} className="botao-grande">
          {idoso.status === 'feita' ? 'Corrigir registro' : 'Registrar visita'}
        </Link>
      </div>
    </>
  )
}
