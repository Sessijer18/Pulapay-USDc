# Contributing to Pulapay

## Branches

| Branch | Usage |
|---|---|
| `main` | Production — merge via PR only |
| `develop` | Integration — features merge here first |
| `feat/xxx` | New features |
| `fix/xxx` | Bug fixes |
| `chore/xxx` | Infra, deps, config |

## Git Flow

```bash
# Start a feature
git checkout develop
git pull origin develop
git checkout -b feat/send-money-flow

# Work, commit
git add .
git commit -m "feat(transactions): add send money validation"

# Open PR → develop
# After review → merge to develop
# Release: develop → main
```

## Commit Format (Conventional Commits)

```
type(scope): description

Types: feat | fix | chore | docs | refactor | test | perf
Scopes: auth | wallet | ledger | transactions | payments | ui | api | db
```

Examples:
```
feat(wallet): add MPC wallet creation on onboarding
fix(ledger): correct balance calculation on concurrent transactions
chore(deps): upgrade NestJS to v10.3
```

## Code Rules

- **TypeScript strict mode** — no `any`
- **Monetary amounts as integers** — never `float`
- **Idempotency keys** on all financial mutations
- **No console.log** in production code — use NestJS Logger
- **Never expose** blockchain, USDC, rail selection to user-facing code

## PR Checklist

- [ ] Tests added/updated
- [ ] TypeScript types correct
- [ ] No financial logic without ledger entries
- [ ] Idempotency handled
- [ ] No sensitive data in logs

## Questions?

Ping Jerry or Wilfried.
