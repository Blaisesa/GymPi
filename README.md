# GymPi

GymPi is an open-source, privacy-first household fitness and wellness platform built to run locally on a Raspberry Pi. It combines workout planning and tracking, nutrition and meal planning, pantry and shopping tools, household metrics, and bounded local AI explanations without requiring a cloud account.

## Status

GymPi is in active foundation development. The repository contains the mobile-first React application shell, ASP.NET Core modular monolith, operational health slice, and the first PostgreSQL-backed household-profile slice.

## Architecture

- React and TypeScript progressive web application
- Single-origin ASP.NET Core modular monolith on .NET 10 LTS
- PostgreSQL authoritative datastore
- Docker Compose deployment targeting Raspberry Pi 5 ARM64
- Optional reusable, database-blind Qwen3.5 0.8B inference through llama.cpp

Start with [PROJECT.md](PROJECT.md) for product scope, [ENGINEERING.md](ENGINEERING.md) for software design and delivery rules, [DESIGN.md](DESIGN.md) for the visual and emotional system, and [docs/architecture](docs/architecture) for system boundaries. Accepted architecture decisions live in [docs/adr](docs/adr).

## Local development

Create local configuration from the non-secret example, then replace both password placeholders with the same local password:

```bash
cp .env.example .env
```

Start PostgreSQL and export the API connection string:

```bash
docker compose up -d postgres
set -a
source .env
set +a
```

Restore the repository-managed EF Core tool and apply reviewed migrations:

```bash
dotnet tool restore
dotnet restore GymPi.sln
dotnet ef database update \
  --project src/backend/GymPi.Infrastructure \
  --startup-project src/backend/GymPi.Api
```

Run the API from the repository root:

```bash
dotnet run --project src/backend/GymPi.Api
```

Run the web client from another terminal:

```bash
cd src/web
npm install
npm run dev
```

Backend integration tests require a running Docker service because they create a disposable PostgreSQL container.
