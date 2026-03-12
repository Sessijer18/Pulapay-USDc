# Pulapay

> **Un compte. Un solde. Toute l'Afrique.**

Pulapay est un compte financier universel pour l'Afrique de l'Ouest. Mobile Money, cartes bancaires, stablecoins — tout dans une seule interface simple.

---

## Philosophy

> *"Finally… someone gets it."*

L'infrastructure financière africaine est fragmentée. Pulapay unifie tout en une expérience aussi simple qu'envoyer un message.

- **Un seul solde** — peu importe le rail utilisé
- **Infrastructure invisible** — l'utilisateur ne voit jamais USDC, blockchain ou Mobile Money
- **Sécurité maximale** — MPC wallets, non-custodial architecture
- **UX radicale** — Send. Receive. Done.

---

## Monorepo Structure

```
pulapay/
├── apps/
│   ├── web/          # Frontend Next.js (dashboard utilisateur)
│   └── api/          # Backend NestJS (API + transaction engine)
├── packages/
│   ├── shared/       # Types TypeScript partagés
│   ├── ui/           # Composants UI réutilisables
│   └── database/     # Schéma Prisma + migrations
├── docs/             # Documentation technique
└── scripts/          # Scripts DevOps & setup
```

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript, TailwindCSS, Framer Motion |
| Backend | Node.js, NestJS, TypeScript |
| Database | PostgreSQL (double-entry ledger) |
| Auth | Privy (Google, Email, Phone) |
| Blockchain | USDC on TRON/Ethereum (invisible user) |
| Mobile Money | MTN MoMo, Moov, Celtiis |
| Infrastructure | AWS, Docker, Kubernetes |

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 8
- Docker & Docker Compose
- PostgreSQL 15+

### Installation

```bash
# Clone le repo
git clone https://github.com/pulapay/pulapay.git
cd pulapay

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Start database
docker-compose up -d postgres redis

# Run migrations
pnpm db:migrate

# Start development
pnpm dev
```

### Development URLs

| Service | URL |
|---|---|
| Web App | http://localhost:3000 |
| API | http://localhost:4000 |
| API Docs | http://localhost:4000/docs |

---

## Core Flows

```
Onboarding:  Welcome → Auth → Phone Verify → Wallet Created → Dashboard
Send:        Dashboard → Amount → Recipient → Confirm → Done
Receive:     Dashboard → QR/Link → Share → Confirmed
Cash Out:    Dashboard → Withdraw → Mobile Money → Done
```

---

## Architecture

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the full system design.

Key principles:
- **Ledger First** — every transaction is atomic, auditable, immutable
- **Event Driven** — payment events trigger notifications, logs, analytics
- **Rail Agnostic** — same UX whether Mobile Money, card, or USDC
- **Non-Custodial** — MPC wallets, users control their funds

---

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

---

## License

Private — © 2026 Pulapay. All rights reserved.

---

*Built in Benin. For West Africa. For everyone.*
