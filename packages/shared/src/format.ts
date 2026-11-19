const nf = new Intl.NumberFormat('pt-BR')
const nf1 = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

/** 12480 → "12.480" */
export const num = (n: number): string => nf.format(n)

/** 35 → "35,0 °C" (espaço fino não separável antes da unidade) */
export const temp = (n: number): string => `${nf1.format(n)} °C`

/** 35 → "35,0" */
export const grau = (n: number): string => nf1.format(n)

/** 0.743 → "74,3%" */
export const pct = (fracao: number, casas = 1): string =>
  `${new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  }).format(fracao * 100)}%`

/** 361 de 486 → "74,3%" */
export const razaoPct = (parte: number, total: number, casas = 1): string =>
  total === 0 ? '—' : pct(parte / total, casas)
