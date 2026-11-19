/**
 * Mapa dos 96 distritos da cidade de São Paulo.
 *
 * Geometria derivada de um GeoJSON público dos distritos de São Paulo
 * (divisão da Lei nº 11.220/1992), simplificada com Douglas-Peucker.
 * Para a entrega final, vale refazer a partir da camada oficial do GeoSampa.
 */
import bruto from '../data/mapa-sp-distritos-paths.json'
import { COBERTURA_BAIXA_SIGLAS, DISTRITOS_ROTULADOS, ESTACOES, TEMPERATURA_FIXA } from './mock'
import { nivelPara } from './nivel'
import type { Distrito, Nivel } from './types'

interface ArquivoMapa {
  w: number
  h: number
  districts: Distrito[]
}

const arquivo = bruto as ArquivoMapa

/** Folga em volta do desenho, para os rótulos não encostarem na borda. */
const PAD_X = 56
const PAD_Y = 40

export const MAPA = {
  largura: arquivo.w,
  altura: arquivo.h,
  viewBox: `${-PAD_X} ${-PAD_Y} ${arquivo.w + PAD_X * 2} ${arquivo.h + PAD_Y * 2 + 30}`,
}

/* -------------------------------------------------------------- estações */

/**
 * Os marcadores do INMET já vêm projetados no mesmo referencial dos paths
 * (equirretangular com correção de cosseno na latitude média da cidade),
 * calculados junto com o arquivo de geometria.
 */
export const MARCADORES_ESTACOES = ESTACOES

/* --------------------------------------------------------- campo de calor */

/**
 * Temperatura prevista por distrito: valores fixados onde o mock define, e,
 * no resto da cidade, um campo ilustrativo com duas fontes de calor — a ilha
 * central-leste e a periferia do extremo sul.
 */
function temperaturaDe(d: Distrito): number {
  const fixa = TEMPERATURA_FIXA[d.nome]
  if (fixa !== undefined) return fixa

  const d1 = Math.hypot(d.cx - 580, d.cy - 470)
  const d2 = Math.hypot(d.cx - 430, d.cy - 1120)
  const t =
    30.6 +
    3.7 * Math.exp(-(d1 ** 2) / (2 * 250 ** 2)) +
    5.2 * Math.exp(-(d2 ** 2) / (2 * 255 ** 2))
  return Math.round(Math.min(t, 36.2) * 10) / 10
}

export interface DistritoMapa extends Distrito {
  /** Nome com acento, para exibição. */
  nomeExibicao: string
  maxima: number
  nivel: Nivel
  coberturaBaixa: boolean
  rotulado: boolean
}

const ACENTOS: Record<string, string> = {
  'Agua Rasa': 'Água Rasa',
  'Alto De Pinheiros': 'Alto de Pinheiros',
  Belem: 'Belém',
  Bras: 'Brás',
  Brasilandia: 'Brasilândia',
  Butanta: 'Butantã',
  Cangaiba: 'Cangaíba',
  'Capao Redondo': 'Capão Redondo',
  Carrao: 'Carrão',
  'Cidade Lider': 'Cidade Líder',
  Consolacao: 'Consolação',
  'Freguesia Do O': 'Freguesia do Ó',
  Grajau: 'Grajaú',
  Jacana: 'Jaçanã',
  Jaragua: 'Jaraguá',
  'Jardim Angela': 'Jardim Ângela',
  'Jardim Sao Luis': 'Jardim São Luís',
  'Jose Bonifacio': 'José Bonifácio',
  'Parque Do Carmo': 'Parque do Carmo',
  Republica: 'República',
  Sacoma: 'Sacomã',
  'Santa Cecilia': 'Santa Cecília',
  'Sao Domingos': 'São Domingos',
  'Sao Lucas': 'São Lucas',
  'Sao Mateus': 'São Mateus',
  'Sao Miguel': 'São Miguel',
  'Sao Rafael': 'São Rafael',
  Saude: 'Saúde',
  Se: 'Sé',
  Tremembe: 'Tremembé',
  'Vila Curuca': 'Vila Curuçá',
  'Vila Jacui': 'Vila Jacuí',
  'Vila Sonia': 'Vila Sônia',
}

export const DISTRITOS_MAPA: DistritoMapa[] = arquivo.districts.map((d) => {
  const maxima = temperaturaDe(d)
  return {
    ...d,
    nomeExibicao: ACENTOS[d.nome] ?? d.nome,
    maxima,
    nivel: nivelPara(maxima),
    coberturaBaixa: COBERTURA_BAIXA_SIGLAS.includes(d.nome),
    rotulado: DISTRITOS_ROTULADOS.includes(d.nome),
  }
})

export function contarPorNivel(): Record<Nivel, number> {
  const acc: Record<Nivel, number> = { baixo: 0, atencao: 0, alto: 0, extremo: 0 }
  for (const d of DISTRITOS_MAPA) acc[d.nivel] += 1
  return acc
}
