# CLAUDE.md — Pulapay Codebase Guide

This file provides guidance for AI assistants (Claude and others) working on the Pulapay codebase.

---

## Project Overview

**Pulapay** is a universal financial account for West Africa. It unifies Mobile Money (MTN MoMo, Moov, Celtiis), bank cards, and USDC stablecoins behind a single balance and a simple UX. The blockchain/stablecoin layer is **completely invisible to users** — they only ever see FCFA or USD.

Built in Benin. Private — © 2026 Pulapay.

---

## Repository Structure

This is a **pnpm + Turborepo monorepo**. The `apps/` and `packages/` directories are defined as workspaces.

```
pulapay/
├── apps/
│   ├── web/          # Next.js 14 frontend (user dashboard)
│   └── api/          # NestJS backend (API + transaction engine)
├── packages/
│   ├── shared/       # Shared TypeScript types (see index.ts at root)
│   ├── ui/           # Reusable UI components
│   └── database/     # Prisma schema + migrations
├── index.ts          # Root shared types export (Currency, User, Wallet, Transaction, etc.)
├── turbo.json        # Turborepo pipeline config
├── pnpm-workspace.yaml
├── docker-compose.yml  # PostgreSQL 15 + Redis 7
├── .env.example      # All required environment variables
├── ARCHITECTURE.md   # Full system design doc
├── CONTRIBUTING.md   # Git flow + commit conventions
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript, TailwindCSS, Framer Motion |
| Backend | Node.js, NestJS, TypeScript |
| Database | PostgreSQL 15 (double-entry ledger) |
| Cache | Redis 7 |
| Auth | Privy (Google, Email, Phone) + JWT |
| Blockchain | USDC on TRON / Ethereum via Circle API |
| MPC Wallets | Web3Auth (non-custodial) |
| Mobile Money | MTN MoMo, Moov, Celtiis |
| Cards | Stripe / Flutterwave |
| OTP/SMS | Twilio |
| KYC | Smile Identity |
| AML | Chainalysis + ComplyAdvantage |
| Monitoring | Sentry, Datadog |
| Infrastructure | AWS (eu-west-1), Docker, Kubernetes |
| Build System | Turborepo 2.x |
| Package Manager | pnpm 8.x |

---

## Key Architectural Principles

### 1. Ledger First
Every financial operation creates **two immutable double-entry ledger records**. No ledger entry = the transaction didn't happen.

```
SEND 5,000 FCFA:
  DEBIT  user_account    5,000 FCFA
  CREDIT system_transit  5,000 FCFA

SETTLEMENT:
  DEBIT  system_transit  5,000 FCFA
  CREDIT recipient       5,000 FCFA
```

### 2. Monetary Amounts Are Always Integers
- All amounts stored and passed as **integer cents** (never floats)
- Field names use the `Cents` suffix: `amountCents`, `feeCents`, `balanceCents`
- Use `formatAmount(cents, currency)` from `index.ts` for display only

### 3. Idempotency Keys Required
Every financial mutation (send, deposit, withdrawal) **must include an `idempotencyKey`** to prevent double-charging. Never call a payment endpoint without one.

### 4. Rail Agnostic UX
The `PaymentRail` type (`MTN_MOMO` | `MOOV` | `CELTIIS` | `CARD` | `USDC_TRON` | `USDC_ETHEREUM` | `INTERNAL`) is **internal only**. Never expose rail names, USDC, blockchain terminology, or wallet addresses to user-facing UI or logs.

### 5. Transaction Lifecycle
```
PENDING → PROCESSING → COMPLETED
                     ↘ FAILED → REVERSED
```

---

## Core Types (index.ts)

The root `index.ts` exports the canonical shared types used across frontend and backend:

```typescript
Currency          // 'XOF' | 'USD'
KycLevel          // 'NONE' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3'
TransactionType   // 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'FEE'
TransactionStatus // 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REVERSED'
PaymentRail       // 'MTN_MOMO' | 'MOOV' | 'CELTIIS' | 'CARD' | 'USDC_TRON' | 'USDC_ETHEREUM' | 'INTERNAL'

ApiResponse<T>     // Standard API envelope: { success, data?, error?, meta? }
User               // id, phone, email, displayName, avatarUrl, kycLevel, createdAt
Wallet             // id, userId, balanceCents (integer!), currency
Transaction        // Full transaction record with amountCents, feeCents, paymentRail, etc.
SendMoneyRequest   // amountCents, recipientPhone?, recipientUserId?, idempotencyKey
SendMoneyResponse  // transactionId, status, amountCents, feeCents

formatAmount(cents, currency)  // Display helper — only for UI rendering
```

---

## Development Setup

### Prerequisites
- Node.js >= 20
- pnpm >= 8
- Docker & Docker Compose

### First-time Setup
```bash
pnpm install
cp .env.example .env       # Fill in real credentials
docker-compose up -d       # Start PostgreSQL + Redis
pnpm db:migrate            # Run Prisma migrations
pnpm dev                   # Start all services via Turborepo
```

### Development URLs
| Service | URL |
|---|---|
| Web App | http://localhost:3000 |
| API | http://localhost:4000 |
| API Docs (Swagger) | http://localhost:4000/docs |

### Common Commands
```bash
pnpm dev              # Start all apps in watch mode
pnpm build            # Build all packages (respects dependency order)
pnpm test             # Run all tests
pnpm lint             # Lint all packages
pnpm typecheck        # TypeScript check all packages
pnpm db:migrate       # Run migrations (dev)
pnpm db:migrate:prod  # Deploy migrations (production)
pnpm db:seed          # Seed the database
pnpm db:studio        # Open Prisma Studio
pnpm clean            # Clean all build artifacts + node_modules
```

### Run a Single Workspace
```bash
pnpm --filter @pulapay/api dev
pnpm --filter @pulapay/web build
```

---

## Database

- **PostgreSQL 15** via Prisma ORM
- Schema lives in `packages/database/prisma/schema.prisma`
- Key tables: `users`, `wallets`, `accounts`, `transactions`, `ledger_entries`
- `ledger_entries` is **append-only** — never update or delete rows
- Docker container: `pulapay_postgres` on port 5432

---

## Environment Variables

Copy `.env.example` to `.env`. Key variables to configure:

| Group | Key Variables |
|---|---|
| App | `NODE_ENV`, `APP_URL`, `API_URL` |
| Database | `DATABASE_URL` |
| Cache | `REDIS_URL` |
| Auth | `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PRIVY_APP_ID`, `PRIVY_APP_SECRET` |
| SMS | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` |
| MTN MoMo | `MTN_MOMO_API_KEY`, `MTN_MOMO_API_SECRET`, `MTN_MOMO_SUBSCRIPTION_KEY` |
| Moov | `MOOV_API_KEY`, `MOOV_API_SECRET` |
| Circle/USDC | `CIRCLE_API_KEY` |
| MPC | `WEB3AUTH_CLIENT_ID` |
| KYC | `SMILE_IDENTITY_PARTNER_ID`, `SMILE_IDENTITY_API_KEY` |
| AML | `CHAINALYSIS_API_KEY`, `COMPLY_ADVANTAGE_API_KEY` |
| Monitoring | `SENTRY_DSN`, `DATADOG_API_KEY` |
| AWS | `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` |

---

## Git Workflow

### Branch Naming
| Branch | Purpose |
|---|---|
| `main` | Production — PR-only merges |
| `develop` | Integration — features merge here first |
| `feat/xxx` | New features |
| `fix/xxx` | Bug fixes |
| `chore/xxx` | Infra, deps, configuration |

### Workflow
```bash
git checkout develop && git pull origin develop
git checkout -b feat/my-feature
# ... make changes, commit ...
# Open PR → develop
# develop → main for releases
```

### Commit Format (Conventional Commits)
```
type(scope): description

Types:  feat | fix | chore | docs | refactor | test | perf
Scopes: auth | wallet | ledger | transactions | payments | ui | api | db
```

Examples:
```
feat(wallet): add MPC wallet creation on onboarding
fix(ledger): correct balance calculation on concurrent transactions
chore(deps): upgrade NestJS to v10.3
```

---

## Code Rules for AI Assistants

### Critical Financial Rules
- **NEVER use floats for money.** Use integers (cents). `amountCents: 150000` = 1,500 FCFA.
- **ALWAYS include `idempotencyKey`** on financial mutations.
- **NEVER expose payment rails to users.** No "USDC", "MTN MoMo", or blockchain addresses in UI text.
- **ALWAYS create ledger entries** for every financial operation — no exceptions.
- Ledger entries are **immutable** — never write code that updates or deletes them.

### TypeScript Rules
- **Strict mode is on** — no `any` types.
- Use the shared types from `index.ts` / `@pulapay/shared` consistently.
- API responses must use the `ApiResponse<T>` envelope.

### Logging Rules
- **No `console.log`** in any production code. Use NestJS `Logger` in backend services.
- **Never log** sensitive data: phone numbers, wallet addresses, API keys, transaction amounts with PII.

### Security Rules
- JWT tokens encode `kycLevel` as a claim — validate it on protected endpoints.
- KYC limits must be enforced server-side:
  - Level 1 (phone verified): 50,000 FCFA/day
  - Level 2 (ID verified): 500,000 FCFA/day
  - Level 3 (full KYC): unlimited
- All user input must be validated at API boundaries.

### API Design
- All mutations need idempotency key support.
- Use cursor-based pagination (`meta.cursor`, `meta.hasMore`) for list endpoints.
- Return `ApiResponse<T>` from all endpoints.

---

## PR Checklist

Before submitting a PR, ensure:
- [ ] Tests added or updated for new logic
- [ ] TypeScript types are correct (no `any`)
- [ ] All financial logic creates ledger entries
- [ ] Idempotency handled on financial mutations
- [ ] No sensitive data in logs
- [ ] No payment rail details exposed to user-facing code
- [ ] Monetary values are integers (not floats)

---

## User Flows

```
Onboarding:  Welcome → Auth (Privy) → Phone Verify → Wallet Created → Dashboard
Send:        Dashboard → Amount → Recipient → Confirm → Done
Receive:     Dashboard → QR/Link → Share → Confirmed
Cash Out:    Dashboard → Withdraw → Mobile Money → Done
```

---

## Questions

Contact Jerry or Wilfried on the team.
