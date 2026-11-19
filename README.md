# TermoVida

Alerta de calor para idosos 65+, por SMS e ligação de voz, com visitas prioritárias
dos agentes comunitários de saúde.

Grupo 22 · Global Solution 2026.2 · CitizenTech · Data Science · FIAP
(Guilherme Francisco RM 569145 · Rafael Canto Xavier RM 572513 · Renata Cristina de Oliveira RM 569564)

> Versão mockada, sem backend. Os números de operação são ilustrativos; os de risco
> vêm da análise do grupo com INMET + SIM/DATASUS, São Paulo 2018–2023.

## No ar

| Produto | Para quem | Link |
|---|---|---|
| Painel do gestor | Secretaria de Saúde, Defesa Civil | https://termovida-painel.vercel.app |
| TermoVida Campo (PWA) | Agente comunitário de saúde | https://termovida-campo.vercel.app |

O app de campo instala na tela inicial do celular e **funciona sem internet**:
abra, adicione à tela inicial, ative o modo avião e continue navegando.

## Os dois produtos

**Painel do gestor** — 5 telas. Visão geral (carga térmica contra o limiar de 32,8 °C,
KPIs do alerta), mapa de risco com os 96 distritos de São Paulo, alertas enviados por
canal, acompanhamento das visitas por UBS e por ACS, e a análise de BI.
Mostra **só dados agregados**: nome, telefone e endereço não aparecem em lugar nenhum.

**TermoVida Campo** — 5 telas. Entrada, lista priorizada do dia com o motivo do risco de
cada pessoa, ficha do idoso com o histórico do alerta, registro da visita e fila offline.
Feito para o sol e para celular barato: texto a partir de 16 px, alvos de 48 px,
contraste alto, estado da conexão sempre à vista.

## Rodar

```bash
npm install
npm run dev:painel   # http://localhost:5173
npm run dev:campo    # http://localhost:5174
```

Para testar o comportamento offline é preciso o build de produção — o service worker
não roda em dev:

```bash
npm run build:campo && npm run preview:campo
```

Abra http://localhost:4174, deixe carregar, derrube o servidor e recarregue: o app
continua de pé, servido pelo cache do service worker, com a lista vinda do IndexedDB.

## Publicar

```bash
vercel login
./scripts/deploy.sh
```

São dois projetos separados na Vercel (`termovida-painel` e `termovida-campo`). O build
roda na máquina e só a pasta `dist` de cada app é enviada; o `vercel.json` que vai junto
traz as rewrites de SPA e os headers do service worker. `./scripts/deploy.sh painel` ou
`./scripts/deploy.sh campo` publica um só.

## Estrutura

```
apps/painel      painel do gestor (React + Vite)
apps/campo       PWA do ACS (React + Vite + vite-plugin-pwa + IndexedDB)
packages/shared  tokens, tipos, dataset mockado, mapa e invariantes
design/          especificação das telas, tokens e o mapa dos 96 distritos
scripts/         deploy
```

### O dataset é um só

`packages/shared/src/mock.ts` é a fonte única dos dois produtos — se um número muda ali,
muda nas duas pontas. `invariantes.ts` confere as contas (alertados + sem contato =
cadastrados, soma das UBS = fila da região, e assim por diante) e avisa no console em
desenvolvimento se alguém quebrar a coerência.

### Regras de design que não se quebram

Estão em `design/tokens.css` e valem para os dois apps: âmbar e coral só como
preenchimento, texto de risco sempre em `--tv-red-900`, nível de risco nunca comunicado
só pela cor, e o estado offline sempre visível no app de campo.

## Próximos passos

- Trocar os placeholders marcados como “valores ilustrativos” na tela de Análise pelos
  números do notebook (defasagem fora de D+1, faixa 30–32,7 °C e a série do gráfico de linha).
- Refazer a geometria do mapa a partir da camada oficial do GeoSampa.
- Ligar o cadastro real da UBS e o gateway de SMS/voz.
