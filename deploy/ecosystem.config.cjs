// PM2 process definition for the production site.
// Start / reload:  pm2 startOrReload deploy/ecosystem.config.cjs --update-env
//
// PORT must be unique per site on the VPS (see the port table in deploy/DEPLOY.md).
// Runtime secrets (SMTP_*) live in .env.production at the repo root; `next start`
// loads that file automatically, so they are not duplicated here.

const PORT = 3002;

module.exports = {
  apps: [
    {
      name: "santosharoratrust",
      cwd: `${__dirname}/..`,
      script: "node_modules/next/dist/bin/next",
      args: `start --hostname 127.0.0.1 --port ${PORT}`,
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      max_memory_restart: "400M",
      kill_timeout: 5000,
      env: {
        NODE_ENV: "production",
        PORT: String(PORT),
      },
    },
  ],
};
