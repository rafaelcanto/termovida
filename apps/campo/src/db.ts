/**
 * Armazenamento local do app de campo.
 *
 * A lista do dia e a fila de envio ficam no IndexedDB: o agente abre o app
 * sem rede e continua trabalhando. Nada sobe sozinho enquanto estiver offline.
 */
import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import {
  FILA_OFFLINE_INICIAL,
  IDOSOS,
  type Idoso,
  type ItemFilaOffline,
  type RegistroVisita,
  type ResultadoVisita,
} from '@termovida/shared'

interface EsquemaTermoVida extends DBSchema {
  visitas: { key: string; value: Idoso }
  fila: { key: string; value: ItemFilaOffline }
  meta: { key: string; value: string | number }
}

const NOME = 'termovida-campo'
const VERSAO = 1

/**
 * Sobe junto com o formato do mock. Quando muda, o aparelho descarta a lista
 * antiga e baixa a nova — é o equivalente a uma nova lista do dia.
 */
const VERSAO_DADOS = 2

let dbPromise: Promise<IDBPDatabase<EsquemaTermoVida>> | null = null

function db() {
  if (!dbPromise) {
    dbPromise = openDB<EsquemaTermoVida>(NOME, VERSAO, {
      upgrade(banco) {
        if (!banco.objectStoreNames.contains('visitas'))
          banco.createObjectStore('visitas', { keyPath: 'id' })
        if (!banco.objectStoreNames.contains('fila'))
          banco.createObjectStore('fila', { keyPath: 'id' })
        if (!banco.objectStoreNames.contains('meta')) banco.createObjectStore('meta')
      },
    })
  }
  return dbPromise
}

/** Baixa a lista do dia uma vez; depois disso o app vive do que está no aparelho. */
export async function semear(): Promise<void> {
  const banco = await db()
  const versao = await banco.get('meta', 'versaoDados')
  const jaTem = await banco.count('visitas')
  if (jaTem > 0 && versao === VERSAO_DADOS) return

  const tx = banco.transaction(['visitas', 'fila', 'meta'], 'readwrite')
  await tx.objectStore('visitas').clear()
  await tx.objectStore('fila').clear()
  for (const i of IDOSOS) await tx.objectStore('visitas').put(i)
  for (const f of FILA_OFFLINE_INICIAL) await tx.objectStore('fila').put(f)
  await tx.objectStore('meta').put(new Date().toISOString(), 'baixadaEm')
  await tx.objectStore('meta').put(VERSAO_DADOS, 'versaoDados')
  await tx.done
}

export async function listarVisitas(): Promise<Idoso[]> {
  const banco = await db()
  const todas = await banco.getAll('visitas')
  return ordenar(todas)
}

export async function obterIdoso(id: string): Promise<Idoso | undefined> {
  const banco = await db()
  return banco.get('visitas', id)
}

export async function listarFila(): Promise<ItemFilaOffline[]> {
  const banco = await db()
  const itens = await banco.getAll('fila')
  return itens.sort((a, b) => b.hora.localeCompare(a.hora))
}

const RESUMO: Record<ResultadoVisita, string> = {
  'sem-intercorrencia': 'Visita · sem intercorrência',
  'encaminhada-ubs': 'Visita · encaminhada à UBS',
  'samu-192': 'Visita · SAMU 192 acionado',
  ausente: 'Ausente · retorno hoje',
}

/** Grava a visita e põe o registro na fila de envio. Tudo local. */
export async function registrarVisita(r: RegistroVisita): Promise<void> {
  const banco = await db()
  const idoso = await banco.get('visitas', r.idosoId)
  if (!idoso) throw new Error(`Idoso ${r.idosoId} não está na lista do aparelho`)

  const tx = banco.transaction(['visitas', 'fila'], 'readwrite')
  await tx.objectStore('visitas').put({
    ...idoso,
    status: 'feita',
    resultado: r.resultado,
    horaVisita: r.hora,
  })
  await tx.objectStore('fila').put({
    id: `fila-${r.idosoId}-${Date.now()}`,
    idosoId: r.idosoId,
    nome: idoso.nome,
    resumo: RESUMO[r.resultado],
    hora: r.hora,
    urgente: r.resultado === 'samu-192' || r.resultado === 'encaminhada-ubs',
  })
  await tx.done
}

/** Envia a fila. Só funciona com rede — é exatamente o ponto. */
export async function enviarFila(): Promise<number> {
  if (!navigator.onLine) throw new Error('sem-rede')
  const banco = await db()
  const quantos = await banco.count('fila')
  // Numa versão com backend, aqui iria o POST. No protótipo, o envio esvazia a fila.
  await banco.clear('fila')
  await banco.put('meta', new Date().toISOString(), 'ultimoEnvio')
  return quantos
}

export async function ultimoEnvio(): Promise<string | null> {
  const banco = await db()
  const v = await banco.get('meta', 'ultimoEnvio')
  return typeof v === 'string' ? v : null
}

/** Sair apaga os dados pessoais do aparelho, como o cartão de LGPD promete. */
export async function limparTudo(): Promise<void> {
  const banco = await db()
  const tx = banco.transaction(['visitas', 'fila', 'meta'], 'readwrite')
  await tx.objectStore('visitas').clear()
  await tx.objectStore('fila').clear()
  await tx.objectStore('meta').clear()
  await tx.done
}

/* ------------------------------------------------------------ ordenação */

/**
 * Pendentes primeiro, na ordem de prioridade que a UBS calculou no disparo
 * (campo `prioridade`); depois as visitas já feitas, da mais antiga para a mais
 * recente. A ordem não pode depender da ordem de leitura do IndexedDB.
 */
function ordenar(lista: Idoso[]): Idoso[] {
  return [...lista].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'pendente' ? -1 : 1
    if (a.status === 'feita') return (a.horaVisita ?? '').localeCompare(b.horaVisita ?? '')
    return a.prioridade - b.prioridade
  })
}
