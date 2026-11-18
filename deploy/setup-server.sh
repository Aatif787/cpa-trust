#!/usr/bin/env bash
# ==============================================================================
# One-time VPS bootstrap (Ubuntu 24.04 / 26.04) for hosting multiple Next.js
# sites behind Nginx. Run ONCE per server, as root:
#
#   sudo bash setup-server.sh
#
# Optional overrides:
#   APP_USER=deploy   Linux user that owns the apps and runs PM2
#   NODE_MAJOR=24     Node.js major version (LTS)
#   SSH_PORT=22       SSH port to keep open in the firewall
#   ENABLE_UFW=yes    Set to "no" to skip firewall setup
#
# Safe to re-run: every step checks before changing anything.
# ==============================================================================
set -euo pipefail

APP_USER="${APP_USER:-deploy}"
NODE_MAJOR="${NODE_MAJOR:-24}"
PNPM_VERSION="${PNPM_VERSION:-10.17.1}"
SSH_PORT="${SSH_PORT:-22}"
ENABLE_UFW="${ENABLE_UFW:-yes}"

log() { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script as root (sudo bash setup-server.sh)." >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

log "Installing base packages (nginx, certbot, git, ufw)"
apt-get update -y
apt-get install -y ca-certificates curl gnupg git nginx certbot \
  python3-certbot-nginx ufw build-essential

log "Installing Node.js ${NODE_MAJOR}.x"
if ! command -v node >/dev/null 2>&1 || \
   [[ "$(node -p 'process.versions.node.split(".")[0]')" != "${NODE_MAJOR}" ]]; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi
node -v

log "Installing pnpm ${PNPM_VERSION} and PM2"
npm install -g "pnpm@${PNPM_VERSION}" pm2

log "Creating app user '${APP_USER}'"
if ! id -u "${APP_USER}" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "${APP_USER}"
fi
APP_HOME="$(getent passwd "${APP_USER}" | cut -d: -f6)"

log "Preparing /var/www (owned by ${APP_USER})"
install -d -m 755 /var/www
chown "${APP_USER}:${APP_USER}" /var/www

log "Registering PM2 to start on boot for ${APP_USER}"
env PATH="${PATH}:/usr/bin" pm2 startup systemd -u "${APP_USER}" --hp "${APP_HOME}"
sudo -u "${APP_USER}" -H bash -lc 'pm2 install pm2-logrotate >/dev/null 2>&1 || true'

log "Hardening Nginx defaults"
cat > /etc/nginx/conf.d/00-hardening.conf <<'EOF'
server_tokens off;
EOF
# Drop the stock "Welcome to nginx" site; every domain gets its own file.
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable --now nginx
systemctl reload nginx

if [[ "${ENABLE_UFW}" == "yes" ]]; then
  log "Configuring firewall (SSH ${SSH_PORT}, HTTP, HTTPS)"
  ufw allow "${SSH_PORT}/tcp"
  ufw allow 'Nginx Full'
  ufw --force enable
  ufw status
fi

log "Done. Next: follow deploy/DEPLOY.md step 3 as user '${APP_USER}'."
