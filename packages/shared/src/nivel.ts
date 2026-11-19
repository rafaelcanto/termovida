import type { Nivel, NivelInfo } from './types'

/**
 * Escala de risco de calor. O limiar de 32,8 °C vem da análise do grupo
 * (INMET + SIM/DATASUS, São Paulo 2018–2023): acima dele o risco de óbito
 * de idosos sobe 10%.
 */
export const LIMIAR = 32.8

export const NIVEIS: Record<Nivel, NivelInfo> = {
  baixo: {
    id: 'baixo',
    rotulo: 'Baixo',
    fill: 'var(--tv-teal-600)',
    ink: '#FFFFFF',
    texto: 'var(--tv-teal-900)',
    descricao: 'abaixo de 32,8 °C — sem disparo',
  },
  atencao: {
    id: 'atencao',
    rotulo: 'Atenção',
    fill: 'var(--tv-amber)',
    ink: 'var(--tv-ink)',
    texto: 'var(--tv-amber-ink)',
    descricao: '32,8 a 33,9 °C — SMS, sem ligação',
  },
  alto: {
    id: 'alto',
    rotulo: 'Alto',
    fill: 'var(--tv-coral)',
    ink: '#FFFFFF',
    texto: 'var(--tv-red-900)',
    descricao: '34,0 a 35,4 °C — SMS, voz e fila de visitas',
  },
  extremo: {
    id: 'extremo',
    rotulo: 'Extremo',
    fill: 'var(--tv-red-900)',
    ink: '#FFFFFF',
    texto: 'var(--tv-red-900)',
    descricao: '35,5 °C ou mais — e ainda rádio comunitária e Defesa Civil',
  },
}

export function nivelPara(maxima: number): Nivel {
  if (maxima >= 35.5) return 'extremo'
  if (maxima >= 34) return 'alto'
  if (maxima >= LIMIAR) return 'atencao'
  return 'baixo'
}

export function infoNivel(maxima: number): NivelInfo {
  return NIVEIS[nivelPara(maxima)]
}

export const ORDEM_NIVEIS: Nivel[] = ['baixo', 'atencao', 'alto', 'extremo']
