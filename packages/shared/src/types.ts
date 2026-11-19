/** Tipos do domínio TermoVida. Ver design/telas.md. */

export type Nivel = 'baixo' | 'atencao' | 'alto' | 'extremo'

export interface NivelInfo {
  id: Nivel
  /** Rótulo escrito — o nível NUNCA é comunicado só pela cor. */
  rotulo: string
  /** Token de preenchimento. */
  fill: string
  /** Tinta legível sobre o preenchimento. */
  ink: string
  /** Cor para texto do nível sobre fundo claro (contraste). */
  texto: string
  descricao: string
}

export interface DiaPrevisao {
  /** ISO curto, ex. '2026-11-20'. */
  data: string
  /** Rótulo curto, ex. 'sex 20/11'. */
  rotulo: string
  maxima: number
  hoje?: boolean
  alerta?: boolean
}

export interface Distrito {
  sigla: string
  nome: string
  sub: string
  /** `path` SVG. */
  d: string
  cx: number
  cy: number
  area: number
}

export interface DistritoRisco {
  nome: string
  maxima: number
  nivel: Nivel
  idosos: number
  coberturaBaixa: boolean
  observacao: string
}

export interface Estacao {
  nome: string
  codigo: string
  regiao: string
  lon: number
  lat: number
  /** Posição já projetada no viewBox do mapa (ver packages/shared/src/mapa.ts). */
  x: number
  y: number
  maxima: number
}

export interface Disparo {
  data: string
  rotulo: string
  evento: string
  nivel: Nivel
  alertados: number
  pedidosAjuda: number
  /** `null` enquanto a janela de 24 h não fecha. */
  visitas24h: number | null
}

export interface Ubs {
  id: string
  nome: string
  acs: number
  fila: number
  feitas: number
}

export interface AgenteResumo {
  id: string
  nome: string
  iniciais: string
  microarea: string
  fila: number
  feitas: number
  /** Registros ainda na fila offline do aparelho. */
  pendentesSync: number
  ultimaSync: string | null
}

export type MotivoFila =
  | 'pediu-ajuda'
  | 'nao-atendeu'
  | 'sem-sinal'

export type ResultadoVisita =
  | 'sem-intercorrencia'
  | 'encaminhada-ubs'
  | 'samu-192'
  | 'ausente'

export type StatusVisita = 'pendente' | 'feita'

export interface EventoAlerta {
  /** 'sms-entregue' | 'ligacao-atendida' | 'apertou-1' … */
  tipo: 'sms-entregue' | 'ligacao-atendida' | 'apertou-1' | 'sem-contato'
  rotulo: string
  hora: string
  destaque?: boolean
}

export interface Idoso {
  id: string
  /** Nome como o ACS vê. NUNCA sai do app de campo. */
  nome: string
  /** Usado só para a concordância do texto ("mora sozinha" / "sozinho"). */
  genero: 'f' | 'm'
  /**
   * Posição na fila priorizada da microárea, calculada pela UBS no disparo:
   * pedido de ajuda primeiro, depois quem mora sozinho, depois risco clínico.
   * Fixa aqui para que a ordem não dependa da ordem de leitura do IndexedDB.
   */
  prioridade: number
  idade: number
  cns: string
  endereco: string
  referencia: string
  bairro: string
  moraSozinho: boolean
  condicoes: string[]
  /** Fatores de risco mostrados na ficha, com peso visual. */
  fatores: { texto: string; peso: 'alto' | 'medio' | 'baixo' }[]
  motivos: MotivoFila[]
  status: StatusVisita
  resultado?: ResultadoVisita
  horaVisita?: string
  historicoAlerta: EventoAlerta[]
  contato: { nome: string; relacao: string; telefone: string; nota: string }
  ultimaVisita: string
}

export interface ItemFilaOffline {
  id: string
  idosoId: string
  nome: string
  resumo: string
  hora: string
  urgente: boolean
}

export interface RegistroVisita {
  idosoId: string
  resultado: ResultadoVisita
  checklist: string[]
  observacao: string
  hora: string
}
