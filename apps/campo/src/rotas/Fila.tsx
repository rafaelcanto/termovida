import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AGENTE, EVENTO } from '@termovida/shared'
import { useEstado } from '../estado'
import {
  FaixaRede,
  IconeAgenda,
  IconeCadeado,
  IconeCheck,
  IconeSync,
  NavInferior,
} from '../ui'

function horaDe(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`
}

export function Fila() {
  const { fila, online, sincronizar, ultimoEnvioEm } = useEstado()
  const { state } = useLocation() as { state?: { acabouDeSalvar?: string } }
  const [enviando, setEnviando] = useState(false)
  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null)

  async function enviar() {
    setEnviando(true)
    const r = await sincronizar()
    setEnviando(false)
    setAviso(
      r.ok
        ? { ok: true, texto: `${r.enviados} registros enviados para a UBS.` }
        : {
            ok: false,
            texto: 'Ainda sem internet. Os registros continuam guardados no celular.',
          },
    )
  }

  return (
    <>
      <div className="barra-app">
        <div className="barra-app__linha">
          <span style={{ flexGrow: 1, minWidth: 0 }}>
            <b className="barra-app__titulo">Fila offline</b>
            <span className="barra-app__meta">
              {AGENTE.nome} · microárea {AGENTE.microarea}
            </span>
          </span>
        </div>
        <FaixaRede />
      </div>

      <div className="corpo corpo--pad" id="conteudo">
        {state?.acabouDeSalvar && (
          <div
            className="cartao cartao--teal"
            style={{ display: 'flex', gap: 12, alignItems: 'flex-start', borderWidth: 2 }}
            role="status"
          >
            <span
              style={{
                width: 38,
                height: 38,
                borderRadius: 999,
                background: 'var(--tv-teal-900)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IconeCheck size={21} />
            </span>
            <span style={{ flexGrow: 1, minWidth: 0 }}>
              <b style={{ fontSize: 17, color: 'var(--tv-ink)', display: 'block', lineHeight: 1.3 }}>
                Visita de {state.acabouDeSalvar} salva
              </b>
              <span style={{ fontSize: 15, color: 'var(--tv-body)' }}>
                Guardada no celular. Vai subir sozinha quando pegar sinal.
              </span>
            </span>
          </div>
        )}

        {aviso && (
          <div
            className={`cartao ${aviso.ok ? 'cartao--teal' : 'cartao--risco'}`}
            role="status"
            style={{ fontSize: 15, color: 'var(--tv-ink)' }}
          >
            {aviso.texto}
          </div>
        )}

        <section>
          <h2 className="secao-titulo" style={{ marginBottom: 10 }}>
            {fila.length === 0
              ? 'Nada esperando envio'
              : `${fila.length} ${fila.length === 1 ? 'registro espera' : 'registros esperando'} envio`}
          </h2>

          {fila.length === 0 ? (
            <p className="vazio">
              Tudo que você registrou já chegou à UBS.
              {ultimoEnvioEm && ` Último envio às ${horaDe(ultimoEnvioEm)}.`}
            </p>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {fila.map((f) => (
                <li className="item-fila" key={f.id}>
                  <span className="ponto" style={{ background: 'var(--tv-amber)' }} aria-hidden="true" />
                  <span style={{ flexGrow: 1, minWidth: 0 }}>
                    <b className="item-fila__nome">{f.nome}</b>
                    <span
                      className={`item-fila__resumo${f.urgente ? ' item-fila__resumo--urgente' : ''}`}
                    >
                      {f.resumo} · {f.hora}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <button
          type="button"
          className="botao-grande"
          onClick={enviar}
          disabled={enviando || fila.length === 0}
        >
          <IconeSync size={21} />
          {enviando ? 'Enviando…' : 'Tentar enviar agora'}
        </button>
        {!online && fila.length > 0 && (
          <p style={{ fontSize: 14, color: 'var(--tv-muted)', textAlign: 'center' }}>
            Sem internet, o envio não vai passar — mas nada se perde.
          </p>
        )}

        <div className="cartao" style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <span className="nota-linha">
            <span style={{ color: 'var(--tv-teal-900)', display: 'flex', flexShrink: 0 }}>
              <IconeCadeado />
            </span>
            Os registros ficam criptografados no aparelho.
          </span>
          <span className="nota-linha">
            <span style={{ color: 'var(--tv-teal-900)', display: 'flex', flexShrink: 0 }}>
              <IconeAgenda size={19} />
            </span>
            Lista de hoje baixada às {AGENTE.listaBaixadaAs}, válida até {EVENTO.prazoVisitas}.
          </span>
        </div>
      </div>

      <NavInferior atual="fila" />
    </>
  )
}
