#!/usr/bin/env bash
# Publica os dois apps na Vercel como deploys estáticos, da sua máquina.
#
# Caminho alternativo ao deploy automático por push: útil para publicar sem
# passar pelo Git (demo de última hora, branch não enviada, GitHub fora do ar).
#
# São dois projetos separados: termovida-painel e termovida-campo. O build roda
# aqui e só a pasta dist de cada app é enviada, junto com o vercel.json do app
# — as rewrites de SPA e, no campo, os headers do service worker.
#
# Uso:  ./scripts/deploy.sh            publica os dois
#       ./scripts/deploy.sh painel     publica só o painel
#       ./scripts/deploy.sh campo      publica só o app do ACS
#
# Precisa de `vercel login` feito antes.
set -euo pipefail

cd "$(dirname "$0")/.."
RAIZ="$(pwd)"
SAIDA="$RAIZ/.deploy"

publicar() {
  local app="$1" projeto="termovida-$1"
  echo "==> build do $app"
  npm run "build:$app"

  mkdir -p "$SAIDA/$projeto"
  # --delete mantém a pasta igual ao dist, mas preserva o vínculo .vercel.
  rsync -a --delete --exclude '.vercel' --exclude 'vercel.json' \
    "$RAIZ/apps/$app/dist/" "$SAIDA/$projeto/"
  # Reaproveita o vercel.json do app, para os dois caminhos não divergirem, mas
  # só as chaves de runtime: aqui a pasta já está buildada, e deixar `framework`
  # ou `buildCommand` faria a Vercel tentar buildar de novo lá dentro e falhar.
  python3 -I -c '
import json, sys
origem, destino = sys.argv[1], sys.argv[2]
cfg = json.load(open(origem, encoding="utf-8"))
runtime = {k: v for k, v in cfg.items() if k in ("rewrites", "headers", "redirects", "cleanUrls", "trailingSlash")}
json.dump(runtime, open(destino, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
' "$RAIZ/apps/$app/vercel.json" "$SAIDA/$projeto/vercel.json"

  echo "==> publicando $projeto"
  vercel deploy "$SAIDA/$projeto" --prod --yes
}

alvo="${1:-ambos}"
case "$alvo" in
  painel) publicar painel ;;
  campo) publicar campo ;;
  ambos)
    publicar painel
    publicar campo
    ;;
  *)
    echo "uso: $0 [painel|campo]" >&2
    exit 1
    ;;
esac
