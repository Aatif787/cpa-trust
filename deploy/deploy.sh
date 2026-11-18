#!/usr/bin/env bash
# ==============================================================================
# Build and (re)start the site. Run as the app user from anywhere:
#
#   /var/www/santosharoratrust/deploy/deploy.sh
#
# Steps: pull latest main -> install deps -> next build -> PM2 reload.
# Optional: BRANCH=main (default)  SKIP_PULL=1 (build current checkout only)
# ==============================================================================
set -euo pipefail

BRANCH="${BRANCH:-main}"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ECOSYSTEM="${APP_DIR}/deploy/ecosystem.config.cjs"

log() { printf '\n\033[1;32m==> %s\033[0m\n' "$*"; }

if [[ "${EUID}" -eq 0 ]]; then
  echo "Do not run as root. Use the app user: sudo -iu deploy" >&2
  exit 1
fi

cd "${APP_DIR}"

if [[ ! -f .env.production ]]; then
  echo "Missing ${APP_DIR}/.env.production" >&2
  echo "Create it first:  cp deploy/env.production.example .env.production" >&2
  exit 1
fi

if [[ -z "${SKIP_PULL:-}" ]]; then
  log "Pulling origin/${BRANCH}"
  git fetch --prune origin
  git checkout "${BRANCH}"
  git pull --ff-only origin "${BRANCH}"
fi
log "Deploying commit $(git rev-parse --short HEAD)"

log "Installing dependencies"
pnpm install --frozen-lockfile

log "Building"
NEXT_TELEMETRY_DISABLED=1 pnpm build

log "Starting / reloading PM2 process"
pm2 startOrReload "${ECOSYSTEM}" --update-env
pm2 save

log "Health check"
PORT="$(node -p "require('${ECOSYSTEM}').apps[0].env.PORT")"
for _ in {1..20}; do
  if curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/"; then
    log "OK — app is responding on 127.0.0.1:${PORT}"
    exit 0
  fi
  sleep 1
done
echo "App did not respond on port ${PORT}. Check: pm2 logs santosharoratrust" >&2
exit 1
