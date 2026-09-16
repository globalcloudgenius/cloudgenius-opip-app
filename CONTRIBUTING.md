# Contributing to CloudGenius OPIP

## Development workflow

1. Never develop directly on `main`.
2. Create a short-lived branch from the latest `main` using a clear prefix such as `feature/`, `fix/`, `docs/`, or `chore/`.
3. Keep commits small and use descriptive commit messages.
4. Push the branch and open a pull request into `main`.
5. CI checks must pass before merge.
6. Request review and resolve review comments before merge.
7. Do not commit passwords, tokens, certificates, private keys, `.env` files, or production secrets.
8. Use HashiCorp Vault or approved CI/CD secret stores for runtime and pipeline secrets.

## Application stack

- Frontend: TypeScript + Next.js/React
- Backend: Python + FastAPI
- Database: PostgreSQL
- Cache: Redis
- Messaging: RabbitMQ

## Pull request expectations

A pull request should explain what changed, why it changed, how it was tested, and any security or deployment impact.
