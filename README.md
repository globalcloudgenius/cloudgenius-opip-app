# CloudGenius Ontario Population Intelligence Platform (OPIP)

Production-style population intelligence application used to demonstrate application engineering and an end-to-end DevSecOps/GitOps operating model.

> **Data notice:** Population values included in this repository are synthetic training data. They are not official Government of Ontario or Statistics Canada figures and must not be presented as authoritative statistics.

## Current vertical slice

Browser → Next.js/TypeScript dashboard → FastAPI → PostgreSQL

The first release intentionally keeps the application small and functional before the platform is decomposed into additional analytics, ingestion, reporting, cache, and messaging services.

## Technology

- Next.js + React + TypeScript
- Recharts visualization
- Python + FastAPI
- SQLAlchemy + PostgreSQL
- Prometheus-compatible `/metrics` endpoint
- Docker + Docker Compose
- Pytest
- GitHub Actions CI

## Repository layout

```text
frontend/                    Next.js dashboard
services/population-api/     FastAPI population service
database/                    Local database bootstrap/sample data
.github/workflows/           CI pipeline
.github/CODEOWNERS            Ownership policy
.github/PULL_REQUEST_TEMPLATE.md
CONTRIBUTING.md
docker-compose.yml
.env.example
```

## Run the complete application

Prerequisite: Docker with Docker Compose support.

```bash
git clone https://github.com/globalcloudgenius/cloudgenius-opip-app.git
cd cloudgenius-opip-app
cp .env.example .env
docker compose up --build
```

Open:

- Dashboard: `http://localhost:3000`
- API: `http://localhost:8000`
- Interactive API documentation: `http://localhost:8000/docs`
- Health: `http://localhost:8000/health`
- Metrics: `http://localhost:8000/metrics`

Stop the stack with `docker compose down`. To remove the local PostgreSQL volume and reseed the training dataset, use `docker compose down -v` before starting again.

## API examples

```text
GET /health
GET /api/v1/population
GET /api/v1/population?year=2025
GET /api/v1/population?municipality=Toronto
GET /api/v1/summary
GET /metrics
```

## Development workflow

Do not use `main` for routine development. Create a feature branch, commit focused changes, push the branch, open a pull request, allow CI to complete, obtain the required review, resolve conversations, and merge through the protected branch workflow.

Never commit `.env`, passwords, tokens, private keys, certificates, Vault secrets, Harbor credentials, cloud credentials, or production connection strings.

## Roadmap

After this functional application baseline is merged, the project will progressively add SAST/secret/dependency scanning, Trivy, Harbor, Helm, Kubernetes, Argo CD, Argo Rollouts, Vault, Calico policies, Prometheus/Grafana/Loki, Slack ChatOps, security monitoring, and backup/disaster-recovery exercises.

## License

MIT. See `LICENSE`.
