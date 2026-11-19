/**
 * Dataset mockado do TermoVida — FONTE ÚNICA para os dois produtos.
 * Espelha design/telas.md §3. Se mudar um número aqui, as duas pontas mudam juntas.
 *
 * Invariantes verificados em invariantes.ts:
 *   alertados + semContato        = cadastrados
 *   smsEntregues + ligacoesAtend. = alertados
 *   soma das UBS (fila/feitas)    = fila/feitas da região
 *   pediuAjuda + naoAtendeu + semSinal = fila
 */
import type {
  AgenteResumo,
  DiaPrevisao,
  Disparo,
  DistritoRisco,
  Estacao,
  Idoso,
  ItemFilaOffline,
  Ubs,
} from './types'

/* ---------------------------------------------------------------- evento */

export const EVENTO = {
  hoje: '2026-11-19',
  hojeRotulo: 'qui 19/11/2026',
  alvo: '2026-11-20',
  alvoRotulo: 'sex 20/11',
  maximaPrevista: 35.0,
  picoObitosRotulo: 'sáb 21/11',
  horaPrevisao: '03h00',
  horaDisparo: '06h12',
  /** Entre a previsão e o disparo. Meta: 6 h. */
  tempoAteAlerta: '3h12',
  metaTempoAteAlerta: '6 h',
  regiao: 'Coordenadoria Regional Sul',
  prazoVisitas: 'amanhã às 06h12',
} as const

export const PREVISAO: DiaPrevisao[] = [
  { data: '2026-11-18', rotulo: 'qua 18/11', maxima: 31.2 },
  { data: '2026-11-19', rotulo: 'hoje 19/11', maxima: 33.4, hoje: true },
  { data: '2026-11-20', rotulo: 'sex 20/11', maxima: 35.0, alerta: true },
  { data: '2026-11-21', rotulo: 'sáb 21/11', maxima: 34.1 },
  { data: '2026-11-22', rotulo: 'dom 22/11', maxima: 30.6 },
]

/* --------------------------------------------------------------- disparo */

export const DISPARO = {
  cadastrados: 12_480,
  alertados: 11_936,
  semContato: 544,
  smsEnviados: 10_034,
  smsEntregues: 9_581,
  ligacoesFeitas: 2_906,
  ligacoesAtendidas: 2_355,
  pedidosAjuda: 212,
  /** Dos 544 sem contato, estes vão para a fila (moram sozinhos ou têm doença crônica). */
  semContatoNaFila: 274,
  semContatoCoberturaBaixa: 212,
} as const

export const MENSAGENS = {
  sms:
    'TermoVida: amanhã 35 °C. Beba água, evite o sol das 10h às 16h. ' +
    'Tontura? Ligue 192. Precisa de ajuda? Responda 1.',
  voz:
    'Olá, aqui é o TermoVida, da sua unidade de saúde. Amanhã vai fazer muito calor. ' +
    'Beba água várias vezes, fique na sombra e, se sentir tontura, ligue 192. ' +
    'Aperte 1 se precisar de ajuda.',
  duracaoVoz: '22 s',
} as const

/* ---------------------------------------------------------------- visitas */

export const FILA = {
  total: 486,
  feitas: 361,
  pendentes: 125,
  pendentesComPedidoAjuda: 28,
  acsEmCampo: 40,
  acsComPendenciaSync: 12,
  motivos: {
    pediuAjuda: 212,
    naoAtendeu: 196,
    semSinal: 78,
  },
  resultados: {
    semIntercorrencia: 287,
    ausente: 41,
    encaminhadaUbs: 26,
    samu192: 7,
  },
} as const

export const UBS_LISTA: Ubs[] = [
  { id: 'capao-redondo', nome: 'Capão Redondo', acs: 10, fila: 116, feitas: 97 },
  { id: 'grajau', nome: 'Grajaú', acs: 11, fila: 124, feitas: 98 },
  { id: 'jardim-angela', nome: 'Jardim Ângela', acs: 9, fila: 112, feitas: 83 },
  { id: 'parelheiros', nome: 'Parelheiros', acs: 7, fila: 96, feitas: 61 },
  { id: 'marsilac', nome: 'Marsilac', acs: 3, fila: 38, feitas: 22 },
]

/** UBS do agente que usa o app. */
export const UBS_DO_AGENTE = 'jardim-angela'

export const EQUIPE: AgenteResumo[] = [
  {
    id: 'claudia-moreira',
    nome: 'Cláudia Moreira',
    iniciais: 'CM',
    microarea: '07',
    fila: 9,
    feitas: 4,
    pendentesSync: 3,
    ultimaSync: null,
  },
  {
    id: 'sueli-nascimento',
    nome: 'Sueli Nascimento',
    iniciais: 'SN',
    microarea: '09',
    fila: 15,
    feitas: 13,
    pendentesSync: 0,
    ultimaSync: '13h40',
  },
  {
    id: 'edson-paulo',
    nome: 'Edson Paulo da Silva',
    iniciais: 'EP',
    microarea: '04',
    fila: 14,
    feitas: 12,
    pendentesSync: 0,
    ultimaSync: '14h05',
  },
  {
    id: 'marina-tavares',
    nome: 'Marina Tavares',
    iniciais: 'MT',
    microarea: '11',
    fila: 13,
    feitas: 11,
    pendentesSync: 0,
    ultimaSync: '13h12',
  },
  {
    id: 'jonas-ribeiro',
    nome: 'Jonas Ribeiro',
    iniciais: 'JR',
    microarea: '02',
    fila: 12,
    feitas: 9,
    pendentesSync: 0,
    ultimaSync: '12h50',
  },
]

/** Os outros 4 agentes da UBS, agregados. */
export const EQUIPE_RESTANTE = { agentes: 4, fila: 49, feitas: 34 }

/* -------------------------------------------------------------- distritos */

/**
 * Os cinco distritos da Coordenadoria Sul. A soma de `idosos` é
 * exatamente DISPARO.cadastrados, e cada um tem a sua UBS em UBS_LISTA.
 */
export const DISTRITOS_SUL: DistritoRisco[] = [
  {
    nome: 'Marsilac',
    maxima: 36.1,
    nivel: 'extremo',
    idosos: 612,
    coberturaBaixa: true,
    observacao: 'Cobertura de celular baixa — reforço por rádio e visita',
  },
  {
    nome: 'Parelheiros',
    maxima: 35.8,
    nivel: 'extremo',
    idosos: 2_104,
    coberturaBaixa: true,
    observacao: 'Cobertura de celular baixa — reforço por rádio e visita',
  },
  {
    nome: 'Grajaú',
    maxima: 35.4,
    nivel: 'alto',
    idosos: 3_319,
    coberturaBaixa: false,
    observacao: 'Ilha de calor — laje sem forro',
  },
  {
    nome: 'Jardim Ângela',
    maxima: 35.2,
    nivel: 'alto',
    idosos: 3_488,
    coberturaBaixa: true,
    observacao: '9 ACS em campo · 112 visitas na fila',
  },
  {
    nome: 'Capão Redondo',
    maxima: 34.6,
    nivel: 'alto',
    idosos: 2_957,
    coberturaBaixa: false,
    observacao: '10 ACS em campo · 116 visitas na fila',
  },
]

/** Sem contato por distrito de cobertura baixa (mapa). */
export const COBERTURA_BAIXA = [
  { nome: 'Marsilac', idosos: 612, semContato: 38 },
  { nome: 'Parelheiros', idosos: 2_104, semContato: 96 },
  { nome: 'Jardim Ângela', idosos: 3_488, semContato: 78 },
]

export const ESTACOES: Estacao[] = [
  {
    nome: 'Mirante de Santana',
    codigo: 'A701',
    regiao: 'Zona norte',
    lon: -46.62,
    lat: -23.496,
    x: 447.3,
    y: 330.1,
    maxima: 34.2,
  },
  {
    nome: 'Interlagos',
    codigo: 'A771',
    regiao: 'Zona sul',
    lon: -46.677,
    lat: -23.724,
    x: 323.6,
    y: 870.0,
    maxima: 35.6,
  },
  {
    nome: 'Riacho Grande',
    codigo: 'A746',
    regiao: 'Fora do município, ao sul',
    lon: -46.527,
    lat: -23.777,
    x: 648.9,
    y: 995.5,
    maxima: 33.8,
  },
]

/* ------------------------------------------------------- mapa da cidade */

/**
 * Temperatura prevista por distrito no mapa da cidade inteira.
 * Campo de calor ilustrativo: duas fontes (ilha de calor central-leste e
 * periferia do extremo sul) com estes valores fixados por cima.
 * Contagem resultante: Extremo 2 · Alto 31 · Atenção 36 · Baixo 27.
 */
export const TEMPERATURA_FIXA: Record<string, number> = {
  Marsilac: 36.1,
  Parelheiros: 35.8,
  'Jardim Angela': 35.2,
  'Cidade Tiradentes': 35.0,
  Brasilandia: 34.4,
  Grajau: 35.4,
  Guaianases: 35.3,
  Iguatemi: 35.2,
  'Itaim Paulista': 35.1,
  Se: 34.9,
  'Sao Mateus': 34.9,
  Sacoma: 34.8,
  'Capao Redondo': 34.6,
  'Jardim Sao Luis': 34.9,
  'Cidade Ademar': 34.5,
  'Cidade Dutra': 33.5,
}

export const COBERTURA_BAIXA_SIGLAS = ['Marsilac', 'Parelheiros', 'Jardim Angela']

/** Distritos rotulados no mapa (nome do GeoJSON, sem acento). */
export const DISTRITOS_ROTULADOS = [
  'Marsilac',
  'Parelheiros',
  'Jardim Angela',
  'Grajau',
  'Cidade Tiradentes',
  'Brasilandia',
  'Se',
  'Butanta',
  'Itaim Paulista',
]

/* -------------------------------------------------------------- histórico */

export const HISTORICO_DISPAROS: Disparo[] = [
  {
    data: '2026-11-19',
    rotulo: '19/11 · 06h12',
    evento: 'Calor de sex 20/11',
    nivel: 'alto',
    alertados: 11_936,
    pedidosAjuda: 212,
    visitas24h: null,
  },
  {
    data: '2026-11-08',
    rotulo: '08/11 · 05h58',
    evento: 'Calor de sáb 09/11',
    nivel: 'atencao',
    alertados: 11_802,
    pedidosAjuda: 97,
    visitas24h: 81,
  },
  {
    data: '2026-10-27',
    rotulo: '27/10 · 06h04',
    evento: 'Calor de seg 28/10',
    nivel: 'alto',
    alertados: 11_744,
    pedidosAjuda: 168,
    visitas24h: 69,
  },
  {
    data: '2026-10-14',
    rotulo: '14/10 · 06h20',
    evento: 'Calor de ter 15/10',
    nivel: 'extremo',
    alertados: 11_690,
    pedidosAjuda: 281,
    visitas24h: 77,
  },
]

/* --------------------------------------------------------------- análise */

export const ANALISE = {
  /** Confirmado no notebook do grupo (INMET + SIM/DATASUS, SP 2018–2023). */
  doNotebook: {
    riscoAcimaDoLimiar: 10,
    riscoAcima34: 17,
    riscoAdultosAcima34: 10,
    excessoObitosAno: 186,
    picoEm: 'D+1',
  },
  /** Série semanal do verão 22/23 — ILUSTRATIVA, trocar pela do notebook. */
  serie: {
    ilustrativa: true,
    rotulos: ['dez', 'jan', 'fev', 'mar'] as string[],
    temperatura: [
      30.1, 31.4, 32.9, 33.6, 35.1, 34.2, 32.8, 31.9, 33.4, 35.8, 36.2, 34.0, 32.2, 30.8,
    ] as number[],
    obitos: [318, 335, 352, 371, 398, 432, 405, 362, 349, 388, 455, 478, 412, 356] as number[],
  },
  /** D+1 vem do notebook; os outros dias são ilustrativos. */
  defasagem: [
    { rotulo: 'Mesmo dia', valor: 4, doNotebook: false },
    { rotulo: '1 dia depois', valor: 10, doNotebook: true },
    { rotulo: '2 dias depois', valor: 6, doNotebook: false },
    { rotulo: '3 dias depois', valor: 2, doNotebook: false },
  ],
  faixas: [
    { rotulo: 'Abaixo de 30 °C', valor: null, doNotebook: true },
    { rotulo: '30,0 a 32,7 °C', valor: 2, doNotebook: false },
    { rotulo: '32,8 a 33,9 °C', valor: 10, doNotebook: true },
    { rotulo: '34 °C ou mais', valor: 17, doNotebook: true },
  ],
  subgrupos: [
    { rotulo: 'Todos os idosos 65+', valor: 10, cor: 'var(--tv-ink)' },
    { rotulo: 'Preta ou parda', valor: 14, cor: 'var(--tv-red-900)' },
    { rotulo: 'Branca', valor: 9, cor: 'var(--tv-teal-600)' },
    { rotulo: 'Masculino', valor: 13, cor: 'var(--tv-coral)' },
    { rotulo: 'Feminino', valor: 8, cor: 'var(--tv-teal-600)' },
    { rotulo: 'Escolaridade até 3 anos', valor: 11, cor: 'var(--tv-amber)' },
    { rotulo: 'Óbito no domicílio', valor: 10, cor: 'var(--tv-amber-ink)' },
    { rotulo: 'Óbito no hospital', valor: 10, cor: 'var(--tv-amber-ink)' },
  ],
  fonte:
    'Regressão de Poisson, IC 95%. INMET (3 estações) + SIM/DATASUS, São Paulo 2018–2023.',
  ressalva:
    'Raça/cor e escolaridade têm registros “ignorados” no SIM: a leitura por subgrupo é indicativa.',
} as const

/* ------------------------------------------------------- app do agente */

export const AGENTE = {
  id: 'claudia-moreira',
  nome: 'Cláudia Moreira',
  cns: '898 0041 2765 3310',
  microarea: '07',
  ubs: 'UBS Jardim Ângela',
  regiao: EVENTO.regiao,
  listaBaixadaAs: '06h20',
  microareas: ['07 — Jardim Ângela', '04 — Jardim Ângela', '11 — Jardim Ângela'],
} as const

export const IDOSOS: Idoso[] = [
  {
    id: 'maria-aparecida',
    nome: 'Maria Aparecida S.',
    genero: 'f',
    prioridade: 1,
    idade: 78,
    cns: '704 0012 8891 5502',
    endereco: 'R. das Hortênsias, 212 — fundos',
    referencia: 'ao lado da padaria São Jorge',
    bairro: 'Jardim Ângela',
    moraSozinho: true,
    condicoes: ['Hipertensa'],
    fatores: [
      { texto: 'Mora sozinha', peso: 'alto' },
      { texto: 'Hipertensa · usa losartana', peso: 'alto' },
      { texto: 'Casa de laje sem forro', peso: 'medio' },
      { texto: 'Celular simples, não usa aplicativos', peso: 'baixo' },
    ],
    motivos: ['pediu-ajuda'],
    status: 'pendente',
    historicoAlerta: [
      { tipo: 'sms-entregue', rotulo: 'SMS entregue', hora: '06h12' },
      { tipo: 'ligacao-atendida', rotulo: 'Ligação de voz atendida', hora: '06h40' },
      { tipo: 'apertou-1', rotulo: 'Apertou 1 — pediu ajuda', hora: '06h41', destaque: true },
    ],
    contato: {
      nome: 'Lúcia S.',
      relacao: 'filha',
      telefone: '(11) 9 8812-4407',
      nota: 'mora a 3 quadras',
    },
    ultimaVisita: '28/10, sem intercorrência',
  },
  {
    id: 'benedito-alves',
    nome: 'Benedito Alves R.',
    genero: 'm',
    prioridade: 2,
    idade: 84,
    cns: '702 9981 4420 7718',
    endereco: 'R. Córrego do Bispo, 45',
    referencia: 'casa azul, portão de ferro',
    bairro: 'Jardim Ângela',
    moraSozinho: true,
    condicoes: ['Diabético'],
    fatores: [
      { texto: 'Mora sozinho', peso: 'alto' },
      { texto: 'Diabético · insulina', peso: 'alto' },
      { texto: 'Dificuldade de locomoção', peso: 'medio' },
    ],
    motivos: ['pediu-ajuda'],
    status: 'pendente',
    historicoAlerta: [
      { tipo: 'sms-entregue', rotulo: 'SMS entregue', hora: '06h12' },
      { tipo: 'ligacao-atendida', rotulo: 'Ligação de voz atendida', hora: '07h02' },
      { tipo: 'apertou-1', rotulo: 'Apertou 1 — pediu ajuda', hora: '07h03', destaque: true },
    ],
    contato: {
      nome: 'Rosa R.',
      relacao: 'sobrinha',
      telefone: '(11) 9 7741-2093',
      nota: 'visita aos domingos',
    },
    ultimaVisita: '28/10, sem intercorrência',
  },
  {
    id: 'terezinha-jesus',
    nome: 'Terezinha de J.',
    genero: 'f',
    prioridade: 3,
    idade: 81,
    cns: '701 4420 9983 1140',
    endereco: "Estr. do M'Boi Mirim, 9.410",
    referencia: 'depois do posto, subindo a viela',
    bairro: 'Jardim Ângela',
    moraSozinho: false,
    condicoes: ['Cardiopata'],
    fatores: [
      { texto: 'Só telefone fixo', peso: 'alto' },
      { texto: 'Sem sinal de celular na rua', peso: 'alto' },
      { texto: 'Cardiopata', peso: 'medio' },
    ],
    motivos: ['sem-sinal'],
    status: 'pendente',
    historicoAlerta: [
      { tipo: 'sem-contato', rotulo: 'SMS não entregue — sem celular', hora: '06h12' },
      { tipo: 'ligacao-atendida', rotulo: 'Ligação para o fixo atendida', hora: '08h15' },
    ],
    contato: {
      nome: 'Marlene J.',
      relacao: 'vizinha',
      telefone: '(11) 9 9003-5512',
      nota: 'tem a chave de casa',
    },
    ultimaVisita: '14/10, sem intercorrência',
  },
  {
    id: 'antonio-carlos',
    nome: 'Antônio Carlos P.',
    genero: 'm',
    prioridade: 4,
    idade: 76,
    cns: '708 1120 4409 9931',
    endereco: 'R. Dr. Luiz Migliano, 88',
    referencia: 'sobrado dos fundos',
    bairro: 'Jardim Ângela',
    moraSozinho: false,
    condicoes: ['Hipertenso'],
    fatores: [
      { texto: 'Não atendeu a ligação', peso: 'alto' },
      { texto: 'Hipertenso', peso: 'medio' },
    ],
    motivos: ['nao-atendeu'],
    status: 'pendente',
    historicoAlerta: [
      { tipo: 'sms-entregue', rotulo: 'SMS entregue', hora: '06h12' },
      { tipo: 'sem-contato', rotulo: 'Ligação não atendida (2 tentativas)', hora: '09h30' },
    ],
    contato: {
      nome: 'Pedro P.',
      relacao: 'filho',
      telefone: '(11) 9 8120-7734',
      nota: 'trabalha durante o dia',
    },
    ultimaVisita: '28/10, sem intercorrência',
  },
  {
    id: 'donato-ferreira',
    nome: 'Donato Ferreira',
    genero: 'm',
    prioridade: 6,
    idade: 83,
    cns: '700 3391 8820 4417',
    endereco: 'R. Guapiara, 301',
    referencia: 'em frente à escola',
    bairro: 'Jardim Ângela',
    moraSozinho: true,
    condicoes: ['DPOC'],
    fatores: [
      { texto: 'Mora sozinho', peso: 'alto' },
      { texto: 'DPOC', peso: 'alto' },
    ],
    motivos: ['nao-atendeu'],
    status: 'feita',
    resultado: 'ausente',
    horaVisita: '08h40',
    historicoAlerta: [
      { tipo: 'sms-entregue', rotulo: 'SMS entregue', hora: '06h12' },
      { tipo: 'sem-contato', rotulo: 'Ligação não atendida', hora: '07h50' },
    ],
    contato: {
      nome: 'Ivone F.',
      relacao: 'irmã',
      telefone: '(11) 9 9450-1182',
      nota: 'mora no mesmo quintal',
    },
    ultimaVisita: '28/10, sem intercorrência',
  },
  {
    id: 'josefa-lima',
    nome: 'Josefa Lima dos S.',
    genero: 'f',
    prioridade: 7,
    idade: 79,
    cns: '706 2210 7793 0084',
    endereco: 'R. Mário Lopes Leão, 57',
    referencia: 'portão verde',
    bairro: 'Jardim Ângela',
    moraSozinho: false,
    condicoes: ['Hipertensa'],
    fatores: [
      { texto: 'Não atendeu a ligação', peso: 'medio' },
      { texto: 'Hipertensa', peso: 'medio' },
    ],
    motivos: ['nao-atendeu'],
    status: 'feita',
    resultado: 'sem-intercorrencia',
    horaVisita: '09h14',
    historicoAlerta: [
      { tipo: 'sms-entregue', rotulo: 'SMS entregue', hora: '06h12' },
      { tipo: 'sem-contato', rotulo: 'Ligação não atendida', hora: '07h40' },
    ],
    contato: {
      nome: 'Cida L.',
      relacao: 'filha',
      telefone: '(11) 9 7712-8890',
      nota: 'mora junto',
    },
    ultimaVisita: '28/10, sem intercorrência',
  },
  {
    id: 'sebastiao-costa',
    nome: 'Sebastião M. da Costa',
    genero: 'm',
    prioridade: 8,
    idade: 88,
    cns: '703 8810 2247 6650',
    endereco: 'R. Felipe Pinel, 120',
    referencia: 'casa dos fundos, escada',
    bairro: 'Jardim Ângela',
    moraSozinho: true,
    condicoes: ['Hipertenso', 'Insuficiência cardíaca'],
    fatores: [
      { texto: 'Mora sozinho', peso: 'alto' },
      { texto: 'Insuficiência cardíaca', peso: 'alto' },
    ],
    motivos: ['sem-sinal'],
    status: 'feita',
    resultado: 'encaminhada-ubs',
    horaVisita: '10h02',
    historicoAlerta: [
      { tipo: 'sem-contato', rotulo: 'Sem sinal no endereço', hora: '06h12' },
    ],
    contato: {
      nome: 'Neusa C.',
      relacao: 'nora',
      telefone: '(11) 9 9931-4408',
      nota: 'leva às consultas',
    },
    ultimaVisita: '28/10, encaminhado à UBS',
  },
  {
    id: 'raimunda-souza',
    nome: 'Raimunda de S.',
    genero: 'f',
    prioridade: 9,
    idade: 75,
    cns: '705 1177 3340 2298',
    endereco: 'R. Comendador Santoro, 44',
    referencia: 'ao lado do mercadinho',
    bairro: 'Jardim Ângela',
    moraSozinho: false,
    condicoes: [],
    fatores: [{ texto: 'Não atendeu a ligação', peso: 'medio' }],
    motivos: ['nao-atendeu'],
    status: 'feita',
    resultado: 'sem-intercorrencia',
    horaVisita: '11h20',
    historicoAlerta: [
      { tipo: 'sms-entregue', rotulo: 'SMS entregue', hora: '06h12' },
      { tipo: 'sem-contato', rotulo: 'Ligação não atendida', hora: '08h05' },
    ],
    contato: {
      nome: 'Jorge S.',
      relacao: 'marido',
      telefone: '(11) 9 8870-1123',
      nota: 'mora junto',
    },
    ultimaVisita: '28/10, sem intercorrência',
  },
  {
    id: 'genival-barros',
    nome: 'Genival B. de Barros',
    genero: 'm',
    prioridade: 5,
    idade: 80,
    cns: '709 4432 1180 7765',
    endereco: 'R. Cel. Octaviano, 9',
    referencia: 'último sobrado da rua',
    bairro: 'Jardim Ângela',
    moraSozinho: true,
    condicoes: ['Hipertenso'],
    fatores: [
      { texto: 'Mora sozinho', peso: 'alto' },
      { texto: 'Sem sinal de celular na rua', peso: 'medio' },
    ],
    motivos: ['sem-sinal'],
    status: 'pendente',
    historicoAlerta: [
      { tipo: 'sem-contato', rotulo: 'Sem sinal no endereço', hora: '06h12' },
    ],
    contato: {
      nome: 'Sandra B.',
      relacao: 'filha',
      telefone: '(11) 9 7790-3341',
      nota: 'liga todo dia à noite',
    },
    ultimaVisita: '14/10, sem intercorrência',
  },
]

/** Itens que já estavam na fila offline antes da visita da Dona Maria. */
export const FILA_OFFLINE_INICIAL: ItemFilaOffline[] = [
  {
    id: 'fila-sebastiao',
    idosoId: 'sebastiao-costa',
    nome: 'Sebastião M. da Costa',
    resumo: 'Visita · encaminhado à UBS',
    hora: '10h02',
    urgente: true,
  },
  {
    id: 'fila-josefa',
    idosoId: 'josefa-lima',
    nome: 'Josefa Lima dos S.',
    resumo: 'Visita · sem intercorrência',
    hora: '09h14',
    urgente: false,
  },
  {
    id: 'fila-donato',
    idosoId: 'donato-ferreira',
    nome: 'Donato Ferreira',
    resumo: 'Ausente · retorno hoje às 17h',
    hora: '08h40',
    urgente: false,
  },
]

export const CHECKLIST = [
  { id: 'agua', texto: 'Bebeu água na sua frente', alerta: false },
  { id: 'sombra', texto: 'Tem água e lugar com sombra em casa', alerta: false },
  { id: 'remedios', texto: 'Tomou os remédios de hoje', alerta: false },
  {
    id: 'sinais',
    texto: 'Sinais de alerta: tontura, confusão, pele muito seca',
    alerta: true,
  },
  { id: 'familia', texto: 'Avisei a família sobre o calor de amanhã', alerta: false },
]

export const RESULTADOS = [
  { id: 'sem-intercorrencia', rotulo: 'Visitada, sem intercorrência', urgente: false },
  { id: 'encaminhada-ubs', rotulo: 'Encaminhada à UBS', urgente: false },
  { id: 'samu-192', rotulo: 'SAMU 192 acionado', urgente: true },
  { id: 'ausente', rotulo: 'Ausente — voltar hoje', urgente: false },
] as const

export const LGPD = {
  painel:
    'Este painel mostra apenas dados agregados. Nome, telefone e endereço dos idosos ' +
    'ficam na base operacional da UBS, criptografada e visível só para a equipe de campo.',
  painelAnalise:
    'A análise usa dados públicos agregados por dia, sem identificação. ' +
    'O idoso pode sair do programa a qualquer momento.',
  campo:
    'Dados do cadastro da UBS, com consentimento. Visíveis só para a equipe de campo ' +
    'e apagados do celular ao sair.',
}

export const AVISO_PROTOTIPO =
  'Protótipo de alta fidelidade · dados ilustrativos. Fontes previstas: INMET, SIM/DATASUS, Censo IBGE e cadastro da UBS.'
