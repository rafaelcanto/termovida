/**
 * Verificações do dataset mockado. Rodam em desenvolvimento (main.tsx dos dois
 * apps) e avisam no console se alguém mexer num número e quebrar a coerência
 * entre o painel e o app. Ver design/telas.md §3.
 */
import { DISPARO, DISTRITOS_SUL, EQUIPE, EQUIPE_RESTANTE, FILA, UBS_LISTA } from './mock'

interface Checagem {
  nome: string
  ok: boolean
  detalhe: string
}

export function checarInvariantes(): Checagem[] {
  const somaUbsFila = UBS_LISTA.reduce((s, u) => s + u.fila, 0)
  const somaUbsFeitas = UBS_LISTA.reduce((s, u) => s + u.feitas, 0)
  const somaUbsAcs = UBS_LISTA.reduce((s, u) => s + u.acs, 0)
  const somaMotivos =
    FILA.motivos.pediuAjuda + FILA.motivos.naoAtendeu + FILA.motivos.semSinal
  const somaResultados =
    FILA.resultados.semIntercorrencia +
    FILA.resultados.ausente +
    FILA.resultados.encaminhadaUbs +
    FILA.resultados.samu192
  const somaIdososSul = DISTRITOS_SUL.reduce((s, d) => s + d.idosos, 0)
  const equipeFila = EQUIPE.reduce((s, a) => s + a.fila, 0) + EQUIPE_RESTANTE.fila
  const equipeFeitas = EQUIPE.reduce((s, a) => s + a.feitas, 0) + EQUIPE_RESTANTE.feitas
  const ubsAgente = UBS_LISTA.find((u) => u.id === 'jardim-angela')!

  return [
    {
      nome: 'alertados + sem contato = cadastrados',
      ok: DISPARO.alertados + DISPARO.semContato === DISPARO.cadastrados,
      detalhe: `${DISPARO.alertados} + ${DISPARO.semContato} = ${DISPARO.cadastrados}`,
    },
    {
      nome: 'SMS entregues + ligações atendidas = alertados',
      ok: DISPARO.smsEntregues + DISPARO.ligacoesAtendidas === DISPARO.alertados,
      detalhe: `${DISPARO.smsEntregues} + ${DISPARO.ligacoesAtendidas} = ${DISPARO.alertados}`,
    },
    {
      nome: 'pedidos de ajuda + sem contato na fila = fila',
      ok: DISPARO.pedidosAjuda + DISPARO.semContatoNaFila === FILA.total,
      detalhe: `${DISPARO.pedidosAjuda} + ${DISPARO.semContatoNaFila} = ${FILA.total}`,
    },
    {
      nome: 'motivos somam a fila',
      ok: somaMotivos === FILA.total,
      detalhe: `${somaMotivos} = ${FILA.total}`,
    },
    {
      nome: 'sem contato na fila ⊂ sem contato',
      ok: DISPARO.semContatoNaFila <= DISPARO.semContato,
      detalhe: `${DISPARO.semContatoNaFila} ≤ ${DISPARO.semContato}`,
    },
    {
      nome: 'feitas + pendentes = fila',
      ok: FILA.feitas + FILA.pendentes === FILA.total,
      detalhe: `${FILA.feitas} + ${FILA.pendentes} = ${FILA.total}`,
    },
    {
      nome: 'resultados somam as visitas feitas',
      ok: somaResultados === FILA.feitas,
      detalhe: `${somaResultados} = ${FILA.feitas}`,
    },
    {
      nome: 'UBS somam a fila da região',
      ok: somaUbsFila === FILA.total && somaUbsFeitas === FILA.feitas,
      detalhe: `fila ${somaUbsFila}/${FILA.total} · feitas ${somaUbsFeitas}/${FILA.feitas}`,
    },
    {
      nome: 'UBS somam os ACS em campo',
      ok: somaUbsAcs === FILA.acsEmCampo,
      detalhe: `${somaUbsAcs} = ${FILA.acsEmCampo}`,
    },
    {
      nome: 'equipe da UBS soma a fila da UBS',
      ok: equipeFila === ubsAgente.fila && equipeFeitas === ubsAgente.feitas,
      detalhe: `fila ${equipeFila}/${ubsAgente.fila} · feitas ${equipeFeitas}/${ubsAgente.feitas}`,
    },
    {
      nome: 'idosos dos distritos da Sul = cadastrados',
      ok: somaIdososSul === DISPARO.cadastrados,
      detalhe: `${somaIdososSul} = ${DISPARO.cadastrados}`,
    },
  ]
}

/** Chamado só em dev. Silencioso quando tudo bate. */
export function avisarSeInconsistente(): void {
  const falhas = checarInvariantes().filter((c) => !c.ok)
  if (falhas.length === 0) return
  console.group('%cTermoVida — dataset inconsistente', 'color:#B83A1B;font-weight:700')
  for (const f of falhas) console.warn(`${f.nome} → ${f.detalhe}`)
  console.groupEnd()
}
