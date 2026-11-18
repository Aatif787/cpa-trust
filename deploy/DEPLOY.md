# Deployment Guide — santosharoratrust.org

Hostinger KVM 4 VPS (Ubuntu) पर Nginx reverse proxy + PM2 के साथ Next.js deploy।

```
Browser ──HTTPS──> Nginx :443 ──proxy──> Next.js (PM2) 127.0.0.1:3001
```

| File | काम |
|---|---|
| `deploy/setup-server.sh` | VPS पर **एक बार** — Node, pnpm, PM2, Nginx, Certbot, firewall |
| `deploy/nginx/snippets/nextjs-proxy.conf` | सभी Next.js sites के लिए common proxy settings (एक बार copy) |
| `deploy/nginx/santosharoratrust.org.conf` | इस domain का Nginx server block |
| `deploy/ecosystem.config.cjs` | PM2 process (port 3001) |
| `deploy/env.production.example` | `.env.production` का template (SMTP अभी खाली) |
| `deploy/deploy.sh` | हर update पर — pull → install → build → reload |

---

## 1. DNS (Hostinger hPanel → Domains → DNS)

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `<VPS IP>` | 300 |
| A | `www` | `<VPS IP>` | 300 |

पुराने parking `A`/`CNAME` records हटा दें। Check करें: `dig +short santosharoratrust.org` और `dig +short www.santosharoratrust.org` दोनों VPS IP दें।

## 2. Server setup (root, एक बार)

```bash
scp deploy/setup-server.sh root@<VPS IP>:/root/
```

```bash
ssh root@<VPS IP> "bash /root/setup-server.sh"
```

> SSH 22 के अलावा किसी port पर है तो: `SSH_PORT=2222 bash /root/setup-server.sh`

## 3. Code clone (user `deploy`)

```bash
sudo -iu deploy
ssh-keygen -t ed25519 -C "vps-santosharoratrust" -f ~/.ssh/santosharoratrust -N ""
cat ~/.ssh/santosharoratrust.pub
```

यह public key GitHub repo → **Settings → Deploy keys → Add** (read-only) में डालें। फिर `~/.ssh/config`:

```
Host github-santosharoratrust
    HostName github.com
    User git
    IdentityFile ~/.ssh/santosharoratrust
    IdentitiesOnly yes
```

```bash
git clone git@github-santosharoratrust:CPA-aviation/cpa-trust.git /var/www/santosharoratrust
```

> GitHub एक deploy key सिर्फ़ एक repo पर allow करता है — बाकी 13 sites के लिए अलग key + अलग `Host` alias बनाएँ।

## 4. Environment file

```bash
cd /var/www/santosharoratrust
cp deploy/env.production.example .env.production
chmod 600 .env.production
```

SMTP values अभी खाली रहेंगी — site पूरी चलेगी, बस contact form "temporarily unavailable" (503) बताएगा।

## 5. पहला build + start (user `deploy`)

```bash
bash /var/www/santosharoratrust/deploy/deploy.sh
```

Script के अंत में `OK — app is responding on 127.0.0.1:3001` आना चाहिए।

## 6. Nginx + SSL (root / sudo)

```bash
sudo cp /var/www/santosharoratrust/deploy/nginx/snippets/nextjs-proxy.conf /etc/nginx/snippets/
sudo cp /var/www/santosharoratrust/deploy/nginx/santosharoratrust.org.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/santosharoratrust.org.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

DNS propagate होने के बाद:

```bash
sudo certbot --nginx -d santosharoratrust.org -d www.santosharoratrust.org --redirect
```

Certbot SSL lines + HTTP→HTTPS redirect खुद जोड़ देगा और auto-renew timer लगा देगा। Test: `sudo certbot renew --dry-run`

Result:
- `http://…`, `http://www…`, `https://www…` → **301** → `https://santosharoratrust.org`

## 7. आगे के updates

```bash
sudo -iu deploy /var/www/santosharoratrust/deploy/deploy.sh
```

Build के दौरान कुछ सेकंड site धीमी/अटक सकती है (वही folder rebuild होता है) — कम traffic वाले समय पर चलाएँ।

---

## Contact form बाद में चालू करना

1. `/var/www/santosharoratrust/.env.production` में `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `CONTACT_TO_EMAIL` भरें।
2. Reload (rebuild ज़रूरी नहीं):
   ```bash
   sudo -iu deploy pm2 reload /var/www/santosharoratrust/deploy/ecosystem.config.cjs --update-env
   ```
3. Error हो तो: `pm2 logs santosharoratrust | grep contact-api`
4. Firewall: outgoing 465/587 Hostinger VPS पर आमतौर पर खुले होते हैं; `nc -vz smtp.hostinger.com 465` से check करें।

## बाकी 13 sites के लिए pattern

हर नई site = नया folder + unique port + नई Nginx file:

1. `/var/www/<site>/` में clone
2. उसके `ecosystem.config.cjs` में `name` और `PORT` बदलें
3. Nginx conf copy करके `server_name`, `upstream` name और port बदलें
4. `certbot --nginx -d <domain> -d www.<domain> --redirect`

### Port register

| Port | Site | PM2 name |
|---|---|---|
| 3001 | santosharoratrust.org | `santosharoratrust` |
| 3002 | — | — |
| 3003 | — | — |

(Static HTML sites को port नहीं चाहिए — Nginx में सीधे `root /var/www/<site>;`)

## Useful commands

| काम | Command |
|---|---|
| सभी apps status | `pm2 ls` |
| Logs | `pm2 logs santosharoratrust` |
| Restart | `pm2 restart santosharoratrust` |
| RAM/CPU | `pm2 monit` |
| Nginx test/reload | `sudo nginx -t && sudo systemctl reload nginx` |
| Nginx logs | `sudo tail -f /var/log/nginx/santosharoratrust.org.error.log` |
| SSL certs | `sudo certbot certificates` |
