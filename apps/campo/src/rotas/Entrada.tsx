import { useNavigate } from 'react-router-dom'
import { AGENTE } from '@termovida/shared'
import { Logo } from '@termovida/shared/Logo'
import { useEstado } from '../estado'
import { IconeEscudo } from '../ui'

export function Entrada() {
  const navegar = useNavigate()
  const { idosos } = useEstado()
  const pendentes = idosos.length

  return (
    <>
      <div className="entrada-capa">
        <Logo size={62} arco="#FFFFFF" />
        <h1>
          TermoVida <span>Campo</span>
        </h1>
        <p>Lista de visitas do agente comunitário de saúde</p>
      </div>

      <form
        className="entrada-form"
        onSubmit={(e) => {
          e.preventDefault()
          navegar('/hoje')
        }}
      >
        <div className="campo-texto">
          <label htmlFor="e-cns">Seu número CNS</label>
          <input id="e-cns" type="text" inputMode="numeric" defaultValue={AGENTE.cns} autoComplete="username" />
        </div>

        <div className="campo-texto">
          <label htmlFor="e-senha">Senha</label>
          <input id="e-senha" type="password" defaultValue="123456" autoComplete="current-password" />
        </div>

        <div className="campo-texto">
          <label htmlFor="e-micro">Microárea de hoje</label>
          <select id="e-micro" defaultValue={AGENTE.microareas[0]}>
            {AGENTE.microareas.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <span className="ajuda">
            {AGENTE.ubs} · {AGENTE.regiao}
          </span>
        </div>

        <button type="submit" className="botao-grande">
          Entrar
        </button>

        <div className="cartao cartao--teal" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ color: 'var(--tv-teal-900)', flexShrink: 0, display: 'flex' }}>
            <IconeEscudo />
          </span>
          <p style={{ fontSize: 15, color: 'var(--tv-ink)', lineHeight: 1.45 }}>
            A lista fica <b>guardada no aparelho</b> e funciona sem internet. Ao sair, os dados são
            apagados do celular.
          </p>
        </div>

        <span style={{ flexGrow: 1 }} />

        <div className="item-fila">
          <span className="ponto" style={{ background: 'var(--tv-teal-600)' }} aria-hidden="true" />
          <span style={{ flexGrow: 1, minWidth: 0, fontSize: 14 }}>
            Lista de hoje baixada às <b style={{ color: 'var(--tv-ink)' }}>{AGENTE.listaBaixadaAs}</b>
          </span>
          <span
            className="num"
            style={{ fontSize: 14, fontWeight: 700, color: 'var(--tv-teal-900)' }}
          >
            {pendentes} visitas
          </span>
        </div>
      </form>
    </>
  )
}
