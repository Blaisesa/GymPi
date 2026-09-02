# GymPi

GymPi is an open-source, privacy-first household fitness and wellness platform built to run locally on a Raspberry Pi. It combines workout planning and tracking, nutrition and meal planning, pantry and shopping tools, household metrics, and bounded local AI explanations without requiring a cloud account.

## Status

GymPi is in the documentation-only foundation and architecture-planning phase. The repository currently contains supporting documentation and the approved semantic colour tokens, but no application code, dependencies, test scaffold, or implemented product features.

## Architecture

- React and TypeScript progressive web application
- Single-origin ASP.NET Core modular monolith on .NET 10 LTS
- PostgreSQL authoritative datastore
- Docker Compose deployment targeting Raspberry Pi 5 ARM64
- Optional reusable, database-blind Qwen3.5 0.8B inference through llama.cpp

Start with [PROJECT.md](PROJECT.md) for product scope, [ENGINEERING.md](ENGINEERING.md) for software design and delivery rules, [DESIGN.md](DESIGN.md) for the visual and emotional system, and [docs/architecture](docs/architecture) for system boundaries. Accepted architecture decisions live in [docs/adr](docs/adr).
