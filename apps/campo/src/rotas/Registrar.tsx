import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { CHECKLIST, RESULTADOS, type ResultadoVisita } from '@termovida/shared'
import { useEstado, useIdoso } from '../estado'
import { BarraVoltar, IconeInfo } from '../ui'

function agora(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`
}

export function Registrar() {
  const { id } = useParams()
  const idoso = useIdoso(id)
  const { registrar, online } = useEstado()
  const navegar = useNavigate()

  const [resultado, setResultado] = useState<ResultadoVisita>('sem-intercorrencia')
  const [marcados, setMarcados] = useState<string[]>(['agua', 'sombra', 'remedios', 'familia'])
  const [observacao, setObservacao] = useState('')
  const [salvando, setSalvando] = useState(false)

  if (!idoso) return <Navigate to="/hoje" replace />

  function alternar(idItem: string) {
    setMarcados((m) => (m.includes(idItem) ? m.filter((x) => x !== idItem) : [...m, idItem]))
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!idoso || salvando) return
    setSalvando(true)
    await registrar({
      idosoId: idoso.id,
      resultado,
      checklist: marcados,
      observacao,
      hora: agora(),
    })
    navegar('/fila', { state: { acabouDeSalvar: idoso.nome } })
  }

  return (
    <form onSubmit={salvar} style={{ display: 'contents' }}>
      <BarraVoltar
        titulo="Registrar visita"
        meta={`${idoso.nome}, ${idoso.idade} · hoje ${agora()}`}
        para={`/idoso/${idoso.id}`}
      />

      <div className="corpo corpo--pad" id="conteudo">
        <fieldset>
          <legend>Como foi a visita?</legend>
          {RESULTADOS.map((r) => (
            <label
              key={r.id}
              htmlFor={`r-${r.id}`}
              className={`opcao${resultado === r.id ? ' opcao--marcada' : ''}${
                r.urgente ? ' opcao--urgente' : ''
              }`}
            >
              <input
                type="radio"
                id={`r-${r.id}`}
                name="resultado"
                checked={resultado === r.id}
                onChange={() => setResultado(r.id)}
              />
              <span>{r.urgente ? <b>{r.rotulo}</b> : r.rotulo}</span>
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>O que você conferiu</legend>
          {CHECKLIST.map((c) => (
            <label
              key={c.id}
              htmlFor={`c-${c.id}`}
              className={`opcao${c.alerta ? ' opcao--alerta' : ''}`}
            >
              <input
                type="checkbox"
                id={`c-${c.id}`}
                checked={marcados.includes(c.id)}
                onChange={() => alternar(c.id)}
              />
              <span>
                {c.alerta ? (
                  <>
                    <b>Sinais de alerta:</b> tontura, confusão, pele muito seca
                  </>
                ) : (
                  c.texto
                )}
              </span>
            </label>
          ))}
        </fieldset>

        <div className="campo-texto">
          <label htmlFor="obs">Observação</label>
          <textarea
            id="obs"
            rows={3}
            placeholder="Opcional"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />
        </div>

        <div
          className="cartao cartao--teal"
          style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}
        >
          <span style={{ color: 'var(--tv-teal-900)', flexShrink: 0, display: 'flex' }}>
            <IconeInfo />
          </span>
          <p style={{ fontSize: 15, color: 'var(--tv-ink)', lineHeight: 1.45 }}>
            {online ? (
              <>
                Com internet agora. O registro é <b>guardado no celular</b> e entra na fila de
                envio — você confirma o envio na tela seguinte.
              </>
            ) : (
              <>
                Sem internet agora. O registro fica <b>guardado no celular</b> e sobe sozinho
                quando pegar sinal.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="rodape-acao">
        <button type="submit" className="botao-grande" disabled={salvando}>
          {salvando ? 'Salvando…' : 'Salvar visita'}
        </button>
      </div>
    </form>
  )
}
