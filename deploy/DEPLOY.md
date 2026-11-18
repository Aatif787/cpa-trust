# Deployment Guide — santosharoratrust.org

Hostinger KVM 4 VPS (Ubuntu) पर Nginx reverse proxy + PM2 के साथ Next.js deploy।
यह VPS की **दूसरी website** है।

```
Browser ──HTTPS──> Nginx :443 ──proxy──> Next.js (PM2) 127.0.0.1:3002
```

| | |
|---|---|
| Clone path | `/app/cpa-trust` |
| Port | `3002` |
| PM2 name | `santosharoratrust` |
| User | `root` |

| File | काम |
|---|---|
| `deploy/setup-server.sh` | नए/खाली VPS के लिए bootstrap — **इस server पर मत चलाएँ** (पहली site पहले से है) |
| `deploy/nginx/snippets/nextjs-proxy.conf` | सभी Next.js sites के लिए common proxy settings |
| `deploy/nginx/santosharoratrust.org.conf` | इस domain का Nginx server block (→ 3002) |
| `deploy/ecosystem.config.cjs` | PM2 process (port 3002) |
| `deploy/env.production.example` | `.env.production` का template (SMTP अभी खाली) |
| `deploy/deploy.sh` | हर update पर — pull → install → build → reload |

---

## 1. DNS (Hostinger hPanel → Domains → DNS)

| Type | Name | Value |
|---|---|---|
| A | `@` | `<VPS IP>` |
| A | `www` | `<VPS IP>` |

Check: `dig +short santosharoratrust.org` और `dig +short www.santosharoratrust.org` दोनों VPS IP दें।

## 2. Pre-checks (root)

```bash
ss -ltnp | grep ':3002'
```

कुछ नहीं आना चाहिए (port खाली)।

```bash
node -v; pnpm -v; pm2 -v; nginx -v; certbot --version
```

जो missing हो वही install करें:

```bash
npm install -g pnpm@10.17.1 pm2
```

```bash
apt-get install -y certbot python3-certbot-nginx
```

## 3. Code + env (root)

```bash
cd /app/cpa-trust && git pull
```

```bash
cp deploy/env.production.example .env.production && chmod 600 .env.production
```

## 4. Build + start

```bash
bash /app/cpa-trust/deploy/deploy.sh
```

अंत में `OK — app is responding on 127.0.0.1:3002` आना चाहिए। Reboot के बाद auto-start के लिए (अगर पहले नहीं किया):

```bash
pm2 startup systemd && pm2 save
```

## 5. Nginx

```bash
cp -n /app/cpa-trust/deploy/nginx/snippets/nextjs-proxy.conf /etc/nginx/snippets/
```

```bash
cp /app/cpa-trust/deploy/nginx/santosharoratrust.org.conf /etc/nginx/sites-available/
```

```bash
ln -s /etc/nginx/sites-available/santosharoratrust.org.conf /etc/nginx/sites-enabled/
```

```bash
nginx -t && systemctl reload nginx
```

`nginx -t` fail हो तो reload न करें — पहली site पर कोई असर नहीं होगा।

## 6. SSL (DNS propagate होने के बाद)

```bash
certbot --nginx -d santosharoratrust.org -d www.santosharoratrust.org --redirect
```

Test: `certbot renew --dry-run`

## 7. Verify

```bash
curl -I https://santosharoratrust.org
```

`200` आना चाहिए; `https://www.santosharoratrust.org` → `301` → bare domain।

## आगे के updates

```bash
bash /app/cpa-trust/deploy/deploy.sh
```

Build के दौरान कुछ सेकंड site धीमी हो सकती है — कम traffic वाले समय पर चलाएँ।

> Nginx conf repo में बदले तो दोबारा step 5 की `cp` + `nginx -t && systemctl reload nginx` चलाएँ।
> Certbot ने `/etc/nginx/sites-available/` वाली file में SSL lines जोड़ी हैं — उसे दोबारा overwrite करने के बाद `certbot --nginx -d santosharoratrust.org -d www.santosharoratrust.org --redirect` फिर चलाएँ।

---

## Contact form बाद में चालू करना

1. `/app/cpa-trust/.env.production` में `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `CONTACT_TO_EMAIL` भरें।
2. Reload (rebuild ज़रूरी नहीं):
   ```bash
   pm2 reload /app/cpa-trust/deploy/ecosystem.config.cjs --update-env
   ```
3. Error हो तो: `pm2 logs santosharoratrust | grep contact-api`

## Port register

| Port | Site | PM2 name |
|---|---|---|
| ? | पहली website | — |
| 3002 | santosharoratrust.org | `santosharoratrust` |
| 3003 | — | — |

नई site = नया folder + unique port + नई Nginx file (`server_name`, `upstream` name, port बदलें)।

## Useful commands

| काम | Command |
|---|---|
| सभी apps status | `pm2 ls` |
| Logs | `pm2 logs santosharoratrust` |
| Restart | `pm2 restart santosharoratrust` |
| Nginx test/reload | `nginx -t && systemctl reload nginx` |
| Nginx logs | `tail -f /var/log/nginx/santosharoratrust.org.error.log` |
| SSL certs | `certbot certificates` |
