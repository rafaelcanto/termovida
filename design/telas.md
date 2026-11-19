# TermoVida — especificação das telas

Base do design: pitch do Grupo 22 (GS 2026.2 · CitizenTech · Data Science).
Protótipo navegável no canvas: https://claude.ai/artifact/KXqTeCBXEVzQ4isdna1KJ7

Dois produtos, um mesmo sistema visual (`tokens.css`):

- **Painel do gestor** — web, desktop, fluido a partir de 1280 px. Só agregados.
- **TermoVida Campo** — PWA do agente comunitário de saúde (ACS), 390 × 844,
  offline-first, alvos de toque de 48 px, texto a partir de 16 px.

Tipografia: **Source Sans 3** (400/600/700), Google Fonts. Substitui a Calibri do
pitch, que não existe na web.

---

## 1. Painel do poder público (5 telas)

### 1.1 Visão geral (`Main`)
- Faixa de alerta vigente: nível + máxima prevista + distância do limiar + hora do disparo.
- 4 KPIs (os do slide 7): % de idosos alertados · % de visitas em até 24 h ·
  tempo entre previsão e alerta · excesso de óbitos 65+ estimado por ano.
- Gráfico de **carga térmica** de 5 dias com a linha tracejada do limiar de 32,8 °C;
  cada barra traz o número e a palavra do nível.
- Funil **“do alerta à visita”**: alertados → entregas por canal → pediram ajuda → fila.
- Tabela dos cinco distritos da Coordenadoria Sul, ordenada por temperatura + cartão de LGPD.

### 1.2 Mapa de risco (`Painel-Mapa`)
- Coroplético real dos **96 distritos** de São Paulo (`mapa-sp-distritos.svg`),
  pintado pela máxima prevista. Contorno tracejado = cobertura de celular baixa
  (Marsilac, Parelheiros, Jardim Ângela). Marcadores das 3 estações do INMET.
- Filtros: dia (hoje / amanhã / pico) e camada (temperatura / idosos / visitas).
- Lateral: distritos mais quentes, estações do INMET, “onde o alerta não chega”.

### 1.3 Alertas (`Painel-Alertas`)
- Resultado do disparo: destinatários, SMS entregues, ligações atendidas,
  sem contato, apertaram 1.
- Resultado por canal (barra empilhada + detalhamento).
- **O texto do SMS e o roteiro da ligação**, iguais aos do slide 10.
- Histórico dos últimos disparos.
- Regra do produto: *sem contato* e *pedido de ajuda* alimentam a fila de visitas.

### 1.4 Visitas (`Painel-Visitas`)
- KPIs da fila: na fila, feitas, pendentes, ACS em campo.
- Progresso por UBS (tabela com barra).
- “Por que entraram na fila” + resultado das visitas feitas.
- Equipe da UBS Jardim Ângela: cartão por ACS com progresso e estado de sincronização.

### 1.5 Análise (`Painel-Analise`)
Entrega da disciplina de BI/Data Viz (slide 12).
- Filtros: ano, mês, estação, faixa etária, sexo, raça/cor.
- Storytelling em três atos: (1) calor e óbitos andam juntos — série temporal;
  (2) o pico vem no dia seguinte — defasagem D+0 a D+3;
  (3) quem mais sofre — risco por subgrupo + risco por faixa de temperatura.

---

## 2. App do ACS — PWA (5 telas)

Fluxo clicável: Entrada → Hoje → Ficha → Registrar → Fila offline.

### 2.1 Entrada (`App-Entrada`)
CNS + senha + microárea. Aviso de que a lista fica no aparelho e é apagada ao sair.
Rodapé com a hora do download da lista.

### 2.2 Hoje (`App-Hoje`) — tela principal
- Barra teal com o nome do ACS, a microárea e o **badge da fila offline**.
- Faixa permanente “Sem internet — trabalhando offline”.
- Alerta do dia em linguagem direta: “Amanhã faz 35 °C. Risco alto.”
- Progresso (4 de 9) e prazo.
- Filtros: Todas / Pediram ajuda / Pendentes.
- Lista **priorizada**, cada pessoa com o **motivo do risco** em etiqueta:
  `Apertou 1 — pediu ajuda` · `Não atendeu a ligação` · `Só telefone fixo` ·
  `Sem sinal na rua` · `Mora sozinha` · `Hipertensa`.
  Itens já feitos aparecem apagados, com o resultado.

### 2.3 Ficha do idoso (`App-Ficha`)
Persona do pitch: **Maria Aparecida S., 78**.
- Identificação, motivo da prioridade, endereço com ponto de referência.
- “O que aumenta o risco dela”: mora sozinha, hipertensa, laje sem forro, celular simples.
- **Histórico do alerta de hoje**: SMS entregue 06h12 → ligação atendida 06h40 →
  apertou 1 às 06h41.
- Contato da família (filha Lúcia) com botão de ligar.
- Ação principal fixa no rodapé: *Registrar visita*.

### 2.4 Registrar visita (`App-Registrar`)
- Resultado (rádio): visitada sem intercorrência · encaminhada à UBS ·
  SAMU 192 acionado · ausente, voltar hoje.
- Checklist: bebeu água na sua frente · tem água e sombra · tomou os remédios ·
  **sinais de alerta (tontura, confusão, pele seca)** · avisei a família.
- Observação livre.
- Aviso de que o registro fica guardado no celular.

### 2.5 Fila offline (`App-Sincronizacao`)
Confirmação do que acabou de ser salvo, estado da conexão, lista do que espera envio,
botão “Tentar enviar agora”, notas de criptografia e validade da lista.

---

## 3. Dados do mock — use estes números

Um só evento de calor atravessa os dois produtos. Se mudar um número, mude nos dois.

**Evento:** hoje qui 19/11/2026; alerta para **sex 20/11, máxima 35,0 °C**, nível **Alto**
(limiar 32,8 °C). Pico de óbitos esperado no sáb 21/11. Disparo às 06h12,
previsão às 03h00 → **3h12** entre previsão e alerta.

Previsão de 5 dias: qua 31,2 (Baixo) · qui 33,4 (Atenção) · sex 35,0 (Alto) ·
sáb 34,1 (Alto) · dom 30,6 (Baixo).

**Disparo (Coordenadoria Regional Sul)**

| métrica | valor |
|---|---|
| idosos 65+ cadastrados | 12.480 |
| alertados | 11.936 (95,6%) |
| SMS enviados / entregues | 10.034 / 9.581 |
| ligações feitas / atendidas | 2.906 / 2.355 |
| sem contato | 544 |
| apertaram 1 (pedido de ajuda) | 212 |

`alertados + sem contato = cadastrados` e `SMS entregues + ligações atendidas = alertados`.

**Regra da fila de visitas:** entram (a) todos os 212 que apertaram 1 e (b) os que ficaram
sem contato **e** moram sozinhos ou têm doença crônica — 274 dos 544. Os outros 270 sem
contato recebem nova tentativa de ligação, não visita.

**Fila de visitas:** 486 = 212 pediram ajuda + 196 não atenderam + 78 sem sinal/só fixo.
Feitas 361 (74,3%), pendentes 125 (28 com pedido de ajuda).
Resultado das 361: 287 sem intercorrência · 41 ausentes · 26 encaminhadas à UBS · 7 SAMU.

**Por UBS** (soma 486 / 361):

| UBS | ACS | fila | feitas |
|---|---|---|---|
| Capão Redondo | 10 | 116 | 97 |
| Grajaú | 11 | 124 | 98 |
| Jardim Ângela | 9 | 112 | 83 |
| Parelheiros | 7 | 96 | 61 |
| Marsilac | 3 | 38 | 22 |

**ACS do app:** Cláudia Moreira, microárea 07, UBS Jardim Ângela — 9 visitas, 4 feitas,
3 registros na fila offline (4 depois de salvar a visita da Dona Maria).

**Distritos da Coordenadoria Sul** (os cinco da tabela da Visão geral e das cinco UBS,
somam os 12.480 cadastrados): Marsilac 36,1 °C / 612 · Parelheiros 35,8 / 2.104 ·
Grajaú 35,4 / 3.319 · Jardim Ângela 35,2 / 3.488 · Capão Redondo 34,6 / 2.957.
No mapa da cidade inteira, a contagem por nível é Extremo 2 · Alto 31 · Atenção 36 · Baixo 27.

**Estações do INMET:** Mirante de Santana 34,2 °C · Interlagos 35,6 °C ·
Riacho Grande 33,8 °C (fora do município).

**Análise — o que vem do notebook (slides 4, 10 e 12):** +10% de risco em dias ≥ 32,8 °C
(RR 1,10; p < 0,001); +17% a partir de 34 °C contra +10% nos adultos; pico no dia seguinte;
preta ou parda +14%, branca +9%, masculino +13%, feminino +8%, escolaridade até 3 anos +11%,
óbito no domicílio +10%, óbito no hospital +10%; excesso de 186 óbitos 65+ por ano.

**Análise — placeholders a substituir pelos do notebook** (marcados como ilustrativos nas telas):
a defasagem fora de D+1 (D+0 +4%, D+2 +6%, D+3 +2%); a faixa intermediária 30,0–32,7 °C +2%;
e a série semanal do verão 2022–2023 do gráfico de linha.

**Mensagens (verbatim do pitch):**

> SMS — *TermoVida: amanhã 35 °C. Beba água, evite o sol das 10h às 16h.
> Tontura? Ligue 192. Precisa de ajuda? Responda 1.*

> Voz — *“Olá, aqui é o TermoVida, da sua unidade de saúde. Amanhã vai fazer muito calor.
> Beba água várias vezes, fique na sombra e, se sentir tontura, ligue 192.
> Aperte 1 se precisar de ajuda.”*

---

## 4. Arquivos

- `tokens.css` — variáveis de cor, tipografia, raios e alvos de toque, com as regras de contraste.
- `mapa-sp-distritos.svg` — coroplético dos 96 distritos, pronto para usar como `<img>`
  ou para ser inlinado e colorido por dado; viewBox `-56 -40 1112 1653`.
  Geometria derivada de um GeoJSON público dos distritos de São Paulo
  ([gist de pedro-valentim](https://gist.github.com/pedro-valentim/492e20d78f57a92be3a032a34af01d40)),
  que reproduz a divisão da Lei nº 11.220/1992, simplificada com Douglas-Peucker.
  Para a entrega final, vale baixar a camada oficial do
  [GeoSampa / dados abertos](https://dados.prefeitura.sp.gov.br/dataset/distritos) e refazer
  o `paths.json` com o mesmo script.
- `mapa-sp-distritos-paths.json` — os mesmos 96 distritos como dados:
  `{ w, h, districts: [{ sigla, nome, sub, d, cx, cy, area }] }`, onde `d` é o `path`
  e `cx`/`cy` o centroide (bom para rótulo e tooltip). Use este arquivo quando o mapa
  precisar ser colorido por dado em tempo de execução, em vez do SVG pronto.

> Os números acima são **ilustrativos**, montados para o protótipo. Os valores de
> risco relativo e o excesso de óbitos vêm da análise real do grupo (INMET + SIM/DATASUS,
> São Paulo 2018–2023); a operação (cadastrados, disparos, visitas) é simulada.
