# Prompt de implementação — TermoVida (versão mockada)

> **Já implementado neste repositório** — veja o [README](../README.md).
> O texto abaixo fica como registro do briefing. Uma diferença em relação ao que
> foi construído: os dois produtos viraram **apps separados** (`apps/painel` e
> `apps/campo`), cada um com o seu projeto na Vercel, e não duas árvores de rotas
> dentro de um app só.
>
> Para refazer do zero, cole o bloco abaixo numa sessão nova do Claude Code, com o
> cwd em `/Users/rafael/Repos/FIAP/project-termovida`.

---

Quero implementar a versão mockada (sem backend) do TermoVida, um serviço de alerta de
calor para idosos 65+ em São Paulo. É entrega acadêmica da FIAP (Global Solution 2026.2,
Grupo 22) e precisa rodar numa apresentação ao vivo.

São **dois produtos num repositório só**:

1. **Painel do gestor** — web, desktop, para a Secretaria de Saúde. Só dados agregados.
2. **TermoVida Campo** — PWA do agente comunitário de saúde (ACS), mobile, offline-first.

## Antes de escrever código, leia

- `design/telas.md` — especificação das 10 telas e **todo o dataset mockado**, com as
  contas já fechando entre os dois produtos.
- `design/tokens.css` — paleta, tipografia, raios, alvos de toque e as regras de contraste.
- `design/mapa-sp-distritos.svg` e `design/mapa-sp-distritos-paths.json` — mapa dos 96
  distritos de São Paulo.

O design de alta fidelidade já está pronto neste canvas, com as 10 telas desenhadas:
https://claude.ai/artifact/KXqTeCBXEVzQ4isdna1KJ7
Se você tiver a ferramenta de Artifact, leia os arquivos `project/*.dc.html` dele: cada um
é o HTML de uma tela e serve de referência visual direta. Os nomes batem com os da spec
(`Main`, `Painel-Mapa`, `Painel-Alertas`, `Painel-Visitas`, `Painel-Analise`,
`App-Entrada`, `App-Hoje`, `App-Ficha`, `App-Registrar`, `App-Sincronizacao`).

## Stack

Vite + React + TypeScript + React Router. Sem biblioteca de componentes e sem Tailwind —
CSS Modules ou CSS puro consumindo as variáveis de `design/tokens.css`, que deve ser
importado como está, sem reescrever os valores. Sem backend: tudo sai de módulos de mock.

Dois apps separados, com um pacote compartilhado — cada app vira um projeto próprio
na Vercel:

```
apps/painel/src/     5 rotas do painel
apps/campo/src/      5 rotas do PWA
packages/shared/src/ tokens, tipos, dataset do design/telas.md §3, mapa
```

Rotas do painel: `/`, `/mapa`, `/alertas`, `/visitas`, `/analise`.
Rotas do app: `/`, `/hoje`, `/idoso/:id`, `/visita/:id`, `/fila`.

## Regras que não se quebram

1. **Um único dataset.** Tudo vem de `src/mock/`, derivado de `design/telas.md §3`. Os
   números têm que continuar fechando: `alertados + sem contato = cadastrados`,
   `SMS entregues + ligações atendidas = alertados`, a soma das UBS = a fila da região,
   e a Dona Maria tem que aparecer nas duas pontas com os mesmos horários.
2. **O painel do gestor nunca mostra pessoa.** Nome, telefone e endereço só existem no
   app do ACS. Isso é requisito de LGPD do projeto, não detalhe de tela.
3. **Nível de risco nunca é só cor.** A etiqueta sempre traz a palavra
   (Baixo / Atenção / Alto / Extremo). Âmbar e coral só como preenchimento; texto de risco
   usa `--tv-red-900`, texto âmbar usa `--tv-amber-ink`.
4. **O app é para o sol e para celular barato.** Texto a partir de 16 px, alvos de 48 px,
   contraste alto, nada de cinza-claro sobre creme.
5. **O estado offline está sempre à vista** no app, em todas as telas.
6. **Acessibilidade de verdade:** `<button>`, `<a href>`, `<input>` + `<label>` reais;
   nunca `onClick` em `div`; `aria-label` em botão só-ícone; `<table>` com `<th scope>`.
7. **Números sempre com `font-variant-numeric: tabular-nums`.**

## Mapa

Use `mapa-sp-distritos-paths.json` e renderize o SVG em React, um `<path>` por distrito,
preenchido pela temperatura do mock — não o SVG pronto. Assim o filtro de dia e a camada
mudam a cor de verdade. `cx`/`cy` servem para rótulo e tooltip. O viewBox é
`-56 -40 1112 1653`. Mantenha o tracejado nos distritos de cobertura baixa e os marcadores
das três estações do INMET.

## PWA — tem que ser real, não decorativo

É o ponto que o pitch promete, então não simule:

- `manifest.webmanifest` com nome, ícones e `display: standalone`.
- Service worker com precache do app shell, para a aplicação abrir sem rede.
- A lista de visitas do dia fica no IndexedDB; a tela Hoje lê de lá.
- **Fila offline funcionando:** registrar uma visita grava na fila local e incrementa o
  badge; "Tentar enviar agora" esvazia a fila; a faixa de status reflete
  `navigator.onLine` com os eventos `online` / `offline`.
- Teste desligando a rede no DevTools: o fluxo Hoje → Ficha → Registrar → Fila tem que
  funcionar inteiro offline.

## Gráficos

Sem biblioteca de charts. São poucos e simples: barras com `div` e a série temporal como
um `<svg>` com `<polyline>`, como está no design. Mantenha os rótulos
"valores ilustrativos — substituir pelos do notebook" onde eles já estão na spec: o grupo
vai trocar esses números pelos do notebook de verdade.

## Entrega

1. Comece pelo scaffold + tokens + mock tipado e me mostre rodando.
2. Depois as duas telas-herói, `/painel` e `/campo/hoje`, que vão virar print no pitch.
3. Depois as outras oito.
4. Por último o service worker e o teste offline.

Me avise ao fim de cada etapa em vez de fazer tudo de uma vez. `npm run dev` tem que
subir sem erro e sem warning de console a cada etapa.
