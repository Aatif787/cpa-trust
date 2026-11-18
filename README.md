# Santosh Arora Trust

Official website for **Santosh Arora Trust**, an irrevocable public charitable trust registered in New Delhi under the Indian Trusts Act, 1882.

- **Registration Number:** `2026/22/IV/1415`
- **NGO DARPAN ID:** `DL/2026/1252835` (Active)
- **Primary Focus:** Women Empowerment, Education & Literacy, Healthcare & Medical Relief, Vocational Livelihoods, Community Welfare, and Environment & Sanitation.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4, custom design tokens, modern CSS modules
- **Animation:** Motion (`motion/react`), Lenis smooth scroll
- **Icons:** Lucide React
- **Email Service:** Nodemailer with secure Hostinger SMTP integration
- **Type Safety:** TypeScript 5.9 with strict type checking

---

## Getting Started

### Prerequisites

- Node.js 20+ installed
- `pnpm` (version 10+)

### Installation

```bash
pnpm install
```

### Environment Configuration

Copy the example environment configuration to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your Hostinger SMTP credentials in `.env.local` (never commit real credentials):

- `SMTP_HOST`: Hostinger SMTP server host
- `SMTP_PORT`: `465` (SSL) or `587` (STARTTLS)
- `SMTP_SECURE`: `true` for 465, `false` for 587
- `SMTP_USER`: Authenticated mailbox email
- `SMTP_PASS`: Authenticated mailbox password
- `SMTP_FROM`: Formatted sender header (`"Santosh Arora Trust <noreply@yourdomain.org>"`)
- `CONTACT_TO_EMAIL`: The Trust email address that receives form submissions
- `SMTP_SEND_AUTO_REPLY`: `true` to send visitor acknowledgement emails

### Development Server

Run the local development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build & Verification

```bash
# Typecheck
pnpm typecheck

# Lint
pnpm lint

# Production build
pnpm build

# Start production server
pnpm start
```

---

## Hostinger Cloud / VPS Deployment

1. Set up Node.js application in Hostinger hPanel.
2. Configure repository deployment pointing to the `main` branch.
3. Add the required server-side environment variables in Hostinger's environment variables dashboard.
4. Set build command to `pnpm install && pnpm build` and start command to `pnpm start`.

---

## License & Ownership

&copy; Santosh Arora Trust. All rights reserved.
