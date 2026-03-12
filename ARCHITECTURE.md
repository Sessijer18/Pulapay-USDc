# Pulapay — Architecture Technique

## Vue d'ensemble

Pulapay est un compte financier universel africain. L'utilisateur voit **un seul solde**, même si l'infrastructure utilise plusieurs rails en backend.

```
┌─────────────────────────────────────┐
│         Frontend (Next.js)          │
│   Balance · Send · Receive · History│
└────────────────┬────────────────────┘
                 │ HTTPS
┌────────────────▼────────────────────┐
│          API Gateway (NestJS)       │
│   Auth · Rate Limit · Validation    │
└──┬──────┬──────┬──────┬─────────────┘
   │      │      │      │
┌──▼──┐ ┌─▼──┐ ┌▼───┐ ┌▼──────────────┐
│Auth │ │User│ │Wlt │ │  Transaction  │
│Svc  │ │Svc │ │Svc │ │    Engine     │
└─────┘ └────┘ └────┘ └──────┬────────┘
                               │
                    ┌──────────▼──────────┐
                    │    Ledger Service   │
                    │  (double-entry)     │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼──────────────────────┐
          │                    │                      │
    ┌─────▼──────┐    ┌────────▼───────┐   ┌─────────▼──────┐
    │ MTN / Moov │    │  Card Gateway  │   │  USDC (Circle) │
    │  Celtiis   │    │                │   │  TRON/Ethereum │
    └────────────┘    └────────────────┘   └────────────────┘
```

## Services

### User Service
- Création et gestion des comptes
- Authentification via Privy (Google, Email, Phone)
- KYC progressive (Level 1 → 3)
- Device management

### Wallet Service
- Création de wallets MPC (non-custodial)
- Gestion des adresses blockchain
- Recovery via passkeys / social recovery
- Un wallet = un utilisateur

### Ledger Service
Le **cœur financier** de Pulapay. Chaque transaction crée deux entrées (double-entry).

```
SEND 5 000 FCFA :
  DEBIT  user_account    5 000 FCFA
  CREDIT system_transit  5 000 FCFA
  
SETTLEMENT :
  DEBIT  system_transit  5 000 FCFA
  CREDIT recipient       5 000 FCFA
```

Règles absolues :
- Les montants sont **toujours en entiers** (centimes)
- Les entrées sont **immutables** (append-only)
- Chaque transaction a une **clé d'idempotence**

### Transaction Engine
Orchestre le cycle de vie d'un paiement :

```
PENDING → PROCESSING → COMPLETED
                     ↘ FAILED → REVERSED
```

### Payment Rails Service
Adapters pour chaque rail de paiement :

| Rail | Provider | Usage |
|---|---|---|
| Mobile Money | MTN MoMo API | Dépôts/retraits Bénin |
| Mobile Money | Moov API | Dépôts/retraits |
| Mobile Money | Celtiis API | Dépôts/retraits |
| Cards | Stripe / Flutterwave | Funding |
| Stablecoin | Circle (USDC) | Settlement invisible |

## Database Schema

Voir `packages/database/prisma/schema.prisma` pour le schéma complet.

Tables clés :
- `users` — comptes utilisateurs + KYC
- `wallets` — wallets MPC
- `accounts` — comptes double-entry
- `transactions` — transactions financières
- `ledger_entries` — entrées de ledger (immutables)

## Sécurité

- **MPC Wallets** — clés fragmentées, jamais en un seul endroit
- **JWT + KYC Claims** — chaque token encode le niveau KYC
- **Idempotency Keys** — prévention des doubles paiements
- **Rate Limiting** — protection contre les abus
- **Audit Trail** — chaque action est loggée

## Compliance

- KYC Level 1 : phone verified → 50 000 FCFA/jour
- KYC Level 2 : ID verified → 500 000 FCFA/jour
- KYC Level 3 : full KYC → unlimited
- AML : monitoring automatique des transactions suspectes
- Reporting BCEAO : exports réglementaires automatisés
